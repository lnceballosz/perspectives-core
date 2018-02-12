module Perspectives.Deltas where

import Control.Monad.Aff (Aff, error, throwError)
import Control.Monad.Eff (Eff, runPure)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Exception (Error, catchException)
import Control.Monad.Eff.Now (NOW, now)
import Control.Monad.Error.Class (class MonadThrow)
import Control.Monad.State.Trans (StateT, execStateT, get, lift, put, runStateT)
import Data.Array (cons, delete, deleteAt, elemIndex, find, findIndex, foldr, head)
import Data.DateTime (DateTime)
import Data.DateTime.Instant (toDateTime)
import Data.Foreign (toForeign)
import Data.Foreign.Class (class Encode)
import Data.Foreign.Generic (encodeJSON)
import Data.Foreign.NullOrUndefined (NullOrUndefined(..), unNullOrUndefined)
import Data.Function (flip)
import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Show (genericShow)
import Data.JSDate (fromDateTime, toISOString)
import Data.Maybe (Maybe(..), fromJust, maybe)
import Data.StrMap (StrMap, empty)
import Data.Traversable (traverse)
import Data.TraversableWithIndex (forWithIndex)
import Network.HTTP.Affjax (AffjaxResponse, put) as AJ
import Network.HTTP.StatusCode (StatusCode(..))
import Partial.Unsafe (unsafePartial)
import Perspectives.ContextAndRole (addContext_rolInContext, changeContext_displayName, changeContext_rev, changeContext_type, changeRol_binding, changeRol_context, changeRol_type, context_rev)
import Perspectives.Effects (AjaxAvarCache)
import Perspectives.PerspectEntiteit (class PerspectEntiteit, encode, getRevision, setRevision)
import Perspectives.Property (getRol)
import Perspectives.QueryCombinators (toBoolean)
import Perspectives.Resource (changePerspectEntiteit, getPerspectEntiteit)
import Perspectives.ResourceRetrieval (modifyResourceInCouchdb)
import Perspectives.Syntax (PerspectContext(..), PerspectRol(..))
import Perspectives.SystemQueries (identity, isFunctional)
import Perspectives.TheoryChange (modifyTriple, setProperty, updateFromSeeds)
import Perspectives.TripleAdministration (tripleObjects)
import Perspectives.TripleGetter ((##))
import Perspectives.TypesForDeltas (Delta(..), DeltaType(..), encodeDefault)
import Perspectives.EntiteitAndRDFAliases (ID, PropertyName)
import Prelude (class Show, Unit, bind, discard, id, pure, show, unit, void, ($), (&&), (<>), (==), (||))

-----------------------------------------------------------
-- DATETIME
-- We need a newtype for DateTime in order to be able to serialize and show it.
-----------------------------------------------------------
newtype SerializableDateTime = SerializableDateTime DateTime

instance encodeSerializableDateTime :: Encode SerializableDateTime where
  encode d = toForeign $ show d

instance showSerializableDateTime :: Show SerializableDateTime where
  show (SerializableDateTime d) = runPure (catchException (\err -> pure "Could not serialize DateTime") (toISOString (fromDateTime d)))

-----------------------------------------------------------
-- TRANSACTIE
-----------------------------------------------------------
newtype Transactie = Transactie
  { author :: String
  , timeStamp :: SerializableDateTime
  , deltas :: Array Delta
  , createdContexts :: Array PerspectContext
  , createdRoles :: Array PerspectRol
  , deletedContexts :: Array ID
  , deletedRoles :: Array ID
  }

derive instance genericRepTransactie :: Generic Transactie _

instance showTransactie :: Show Transactie where
  show = genericShow

instance encodeTransactie :: Encode Transactie where
  encode = encodeDefault

createTransactie :: forall e. String -> Eff (now :: NOW | e) Transactie
createTransactie author =
  do
    n <- now
    pure $ Transactie{ author: author, timeStamp: SerializableDateTime (toDateTime n), deltas: [], createdContexts: [], createdRoles: [], deletedContexts: [], deletedRoles: []}

runInTransactie :: forall e. StateT Transactie (Aff (AjaxAvarCache (now :: NOW | e))) Unit -> Aff (AjaxAvarCache (now :: NOW | e)) Unit
runInTransactie m = do
  -- TODO: hier moet de user id worden gebruikt.
  s <- liftEff (createTransactie "Joop")
  t@(Transactie{deltas}) <- execStateT m s
  -- register a triple for each delta, add it to the queue, run the queue.
  maybeTriples <- traverse modifyTriple deltas
  modifiedTriples <- pure (foldr (\mt a -> maybe a (flip cons a) mt) [] maybeTriples)
  -- Propagate the triple changes.
  _ <- runStateT (updateFromSeeds modifiedTriples) true
  -- Send the Transaction to all involved.
  distributeTransactie t

distributeTransactie :: forall e. Transactie -> Aff (AjaxAvarCache e) Unit
distributeTransactie t = do
  (others :: StrMap Transactie) <- selectDeltasForUsers t
  _ <- forWithIndex others sendTransactieToUser
  pure unit

addContextToTransactie :: forall e. PerspectContext -> StateT Transactie (Aff (AjaxAvarCache e)) Unit
addContextToTransactie c = do
  (Transactie tf@{createdContexts}) <- get
  put $ Transactie tf {createdContexts = cons c createdContexts}

addRolToTransactie :: forall e. PerspectRol -> StateT Transactie (Aff (AjaxAvarCache e)) Unit
addRolToTransactie c = do
  (Transactie tf@{createdRoles}) <- get
  put $ Transactie tf {createdRoles = cons c createdRoles}

deleteContextFromTransactie :: forall e. PerspectContext -> StateT Transactie (Aff (AjaxAvarCache e)) Unit
deleteContextFromTransactie c@(PerspectContext{_id}) = do
  (Transactie tf@{createdContexts, deletedContexts}) <- get
  case findIndex (\(PerspectContext{_id: i}) -> _id == i) createdContexts of
    Nothing -> put (Transactie tf{deletedContexts = cons _id deletedContexts})
    (Just i) -> put (Transactie tf{createdContexts = unsafePartial $ fromJust $ deleteAt i createdContexts})

deleteRolFromTransactie :: forall e. PerspectRol -> StateT Transactie (Aff (AjaxAvarCache e)) Unit
deleteRolFromTransactie c@(PerspectRol{_id}) = do
  (Transactie tf@{createdRoles, deletedRoles}) <- get
  case findIndex (\(PerspectRol{_id: i}) -> _id == i) createdRoles of
    Nothing -> put (Transactie tf{deletedRoles = cons _id deletedRoles})
    (Just i) -> put (Transactie tf{createdRoles = unsafePartial $ fromJust $ deleteAt i createdRoles})

{-
1. Bepaal of de delta precies zo voorkomt in de lijst in de transactie. Zo ja, negeer dan de nieuwe delta.
2. Bepaal of de rol functioneel is.
ZO JA:
3. Zoek een delta waarvan de id, rolName en DeltaType gelijk zijn aan die van de nieuwe.
	Indien gevonden: vervang die door de nieuwe.
	Indien niet gevonden: zoek een delta waarvan id en rolName overeenkomen.
		Indien gevonden, als geldt:
			het ene DeltaType is Add en het andere Remove, verwijder dan de oude.
			het oude DeltaType is Change en het nieuwe Remove, vervang de oude dan door de nieuwe
			het oude DeltaType is Add en het nieuwe is Change, vervang dan in de oude de rolID door die van de nieuwe.
		Indien niet gevonden: voeg de nieuwe toe.
ZO NEE:
4. zoek een delta waarvan id, rolName en rolID gelijk zijn aan die van de nieuwe en het ene DeltaType Add is en het andere Remove.
	Indien gevonden: verwijder de oude.
	Anders: voeg de nieuwe toe.
-}
addDelta :: forall e. Delta -> StateT Transactie (Aff (AjaxAvarCache e)) Unit
addDelta newCD@(Delta{id: id', memberName, deltaType, value}) = do
  t@(Transactie tf@{deltas}) <- get
  case elemIndex newCD deltas of
    (Just _) -> pure unit
    Nothing -> do
      (isfunc :: Boolean) <- lift $ (toBoolean isFunctional) memberName
      if isfunc
        then do
          x <- pure $ findIndex equalExceptRolID deltas
          case x of
            (Just oldCD) -> put (replace oldCD newCD t)
            Nothing -> do
              mCdelta <- pure $ find equalIdRolName deltas
              case mCdelta of
                Nothing -> put (add newCD t)
                (Just oldCD@(Delta oldF@{deltaType: d})) -> do
                  indexOld <- pure (unsafePartial (fromJust (elemIndex oldCD deltas)))
                  case d of
                    Add | (deltaType == Remove) -> put (remove oldCD t)
                    Remove | (deltaType == Add) -> put (remove oldCD t)
                    Change | (deltaType == Remove) -> put (replace indexOld newCD t)
                    Add | (deltaType == Change) -> put (replace indexOld (Delta oldF {value = value}) t)
                    otherwise -> put (add newCD t)
        else do
          x <- pure $ findIndex equalExceptDeltaType deltas
          case x of
            Nothing -> put (add newCD t)
            (Just i) -> put (replace i newCD t)
  pure unit
  where
    equalExceptDeltaType :: Delta  -> Boolean
    equalExceptDeltaType
      (Delta{id: i, memberName: r, deltaType: d, value: ri}) =
        id' == i &&
        memberName == r &&
        value == ri &&
        ((deltaType == Add && d == Remove) || (deltaType == Remove && d == Add))
    equalExceptRolID :: Delta -> Boolean
    equalExceptRolID
      (Delta{id: i, memberName: r, deltaType: d}) =
        id' == i &&
        memberName == r &&
        deltaType == d
    equalIdRolName :: Delta -> Boolean
    equalIdRolName (Delta{id: i, memberName: r}) =
      id' == i &&
      memberName == r
    add :: Delta -> Transactie -> Transactie
    add delta (Transactie tf@{deltas}) = Transactie tf {deltas = cons delta deltas}
    replace :: Int -> Delta -> Transactie -> Transactie
    replace i delta (Transactie tf@{deltas}) = Transactie tf {deltas = cons newCD (maybe deltas id (deleteAt i deltas))}
    remove :: Delta -> Transactie -> Transactie
    remove i (Transactie tf@{deltas}) = Transactie tf {deltas = (delete i deltas)}


sendTransactieToUser :: forall e. ID -> Transactie -> Aff (AjaxAvarCache e) Unit
sendTransactieToUser userId t = do
  tripleUserIP <- userId ## identity
  (userIP :: String) <- onNothing' ("sendTransactieToUser: user has no IP: " <> userId) (head (tripleObjects tripleUserIP))
  (res :: AJ.AffjaxResponse String)  <- AJ.put (userIP <> "/" <> userId <> "_post/" <> "transactie id hier") (encodeJSON t)
  (StatusCode n) <- pure res.status
  case n == 200 || n == 201 of
    true -> pure unit
    false -> throwError $ error ("sendTransactieToUser " <> "transactie id hier" <> " fails: " <> (show res.status) <> "(" <> show res.response <> ")")
  pure unit

-- TODO Uitwerken.
usersInvolvedInTransactie :: forall e. Transactie -> Aff e (Array ID)
usersInvolvedInTransactie t = pure []

{-
Bouw een transactie eerst op, splits hem dan in versies voor elke gebruiker.
Doorloop elke verzameling deltas en bepaal per delta welke gebruikers betrokken zijn.
Bouw al doende een StrMap van userId en gespecialiseerde transacties op, waarbij je een transactie toevoegt voor een gebruiker die nog niet in de StrMap voorkomt.
-}
selectDeltasForUsers :: forall e. Transactie -> Aff (AjaxAvarCache e)(StrMap Transactie)
selectDeltasForUsers t = pure empty

-----------------------------------------------------------
-- UPDATEPERSPECTENTITEIT
-----------------------------------------------------------
{-
Om een door de gebruiker aangebrachte wijziging door te voeren, moet je:
  - een Delta maken;
  - die versturen aan alle betrokkenen.
    - wat is het type van de context?
    - wie zijn de betrokkenen?
    - welke betrokkenen hebben een Actie met als lijdend voorwerp de entiteit?
    - heeft die Actie een view met de betreffende property?
  - de wijziging doorvoeren op de interne representatie;
  - de consequenties doorvoeren in de triple administratie;
  - de gewijzigde context opslaan;

Om een door een andere gebruiker aangebrachte wijziging door te voeren, moet je:
  - controleren of de author wel gerechtigd is tot de wijziging;
    - in welke rol is de author betrokken bij de context (van de rol)?
    - heeft die rol een actie die de betreffende delta oplevert?
      - past het werkwoord bij de DeltaType?
      - is het lijdend voorwerp de betreffende rol of context?
      - heeft de view op het lijdend voorwerp de relevante property (indien het gaat om een property delta)?
  - de wijziging doorvoeren op de interne representatie;
  - de consequenties doorvoeren in de triple administratie;
  - de gewijzigde context opslaan;
-}

updatePerspectEntiteit :: forall e a. PerspectEntiteit a =>
  (String -> a -> a) ->
  (ID -> String -> Delta) ->
  ID -> ID -> StateT Transactie (Aff (AjaxAvarCache e)) Unit
updatePerspectEntiteit changeEntity createDelta cid value = do
  (context) <- lift $ onNothing ("updatePerspectEntiteit: cannot find this context: " <> cid) (getPerspectEntiteit cid)
  -- Change the entity in cache:
  changedEntity <- lift $ changePerspectEntiteit cid (changeEntity value context)
  rev <- lift $ onNothing' ("updatePerspectEntiteit: context has no revision, deltas are impossible: " <> cid) (unNullOrUndefined (getRevision context))
  -- Store the changed entity in couchdb.
  newRev <- lift $ modifyResourceInCouchdb cid rev (encode context)
  -- Set the new revision in the entity.
  lift $ changePerspectEntiteit cid (setRevision newRev context)
  -- Create a delta and add it to the Transactie.
  addDelta $ createDelta cid value

setContextType :: forall e. ID -> ID -> StateT Transactie (Aff (AjaxAvarCache e)) Unit
setContextType = updatePerspectEntiteit
  changeContext_type
  (\cid theType -> Delta
    { id : cid
    , memberName: "model:Perspectives$type"
    , deltaType: Change
    , value: NullOrUndefined (Just theType)
    , isContext: true
    })

setRolType :: forall e. ID -> ID -> StateT Transactie (Aff (AjaxAvarCache e)) Unit
setRolType = updatePerspectEntiteit
  changeRol_type
  (\cid theType -> Delta
    { id : cid
    , memberName: "model:Perspectives$type"
    , deltaType: Change
    , value: NullOrUndefined (Just theType)
    , isContext: false
    })

setContextDisplayName :: forall e. ID -> ID -> StateT Transactie (Aff (AjaxAvarCache e)) Unit
setContextDisplayName = updatePerspectEntiteit
  changeContext_displayName
  (\cid displayName -> Delta
    { id : cid
    , memberName: "model:Perspectives$label"
    , deltaType: Change
    , value: NullOrUndefined (Just displayName)
    , isContext: true
    })

setContext :: forall e. ID -> ID -> StateT Transactie (Aff (AjaxAvarCache e)) Unit
setContext = updatePerspectEntiteit
  changeRol_context
  (\cid rol -> Delta
    { id : cid
    , memberName: "model:Perspectives$context"
    , deltaType: Change
    , value: NullOrUndefined (Just rol)
    , isContext: false
    })

setBinding :: forall e. ID -> ID -> StateT Transactie (Aff (AjaxAvarCache e)) Unit
setBinding = updatePerspectEntiteit
  changeRol_binding
  (\rid binding -> Delta
    { id : rid
    , memberName: "model:Perspectives$binding"
    , deltaType: Change
    , value: NullOrUndefined (Just binding)
    , isContext: false
    })

-- TODO maak addProperty, removeRol en removeProperty. ChangeProperty, ChangeRol voor functionele properties en rollen?
addRol :: forall e. ID -> ID -> ID -> StateT Transactie (Aff (AjaxAvarCache e)) Unit
addRol cid rolName rolId = do
  (context :: PerspectContext) <- lift $ onNothing ("addRol: cannot find this context: " <> cid) (getPerspectEntiteit cid)
  -- Change the entity in cache:
  changedEntity <- lift $ changePerspectEntiteit cid (addContext_rolInContext context rolName rolId)
  rev <- lift $ onNothing' ("addRol: context has no revision, deltas are impossible: " <> cid) (context_rev context)
  -- Store the changed entity in couchdb.
  newRev <- lift $ modifyResourceInCouchdb cid rev (encode context)
  -- Set the new revision in the entity.
  lift $ changePerspectEntiteit cid (changeContext_rev newRev context)
  -- Create a delta and add it to the Transactie.
  addDelta $ Delta
    { id : cid
    , memberName: rolName
    , deltaType: Add
    , value: NullOrUndefined (Just rolId)
    , isContext: true
    }

-- updatePerspectEntiteitMember :: forall e a. PerspectEntiteit a =>
--   (String -> a -> a) ->
--   (a -> PropertyName -> String -> Delta) ->
--   ID -> ID -> StateT Transactie (Aff (AjaxAvarCache e)) Unit
-- updatePerspectEntiteitMember changeEntityMember createDelta cid memberName value = do
--   (context) <- lift $ onNothing ("updatePerspectEntiteit: cannot find this context: " <> cid) (getPerspectEntiteit cid)
--   -- Change the entity in cache:
--   changedEntity <- lift $ changePerspectEntiteit cid (changeEntityMember context memberName value)
--   rev <- lift $ onNothing' ("updatePerspectEntiteit: context has no revision, deltas are impossible: " <> cid) (unNullOrUndefined (getRevision context))
--   -- Store the changed entity in couchdb.
--   newRev <- lift $ modifyResourceInCouchdb cid rev (encode context)
--   -- Set the new revision in the entity.
--   lift $ changePerspectEntiteit cid (setRevision newRev context)
--   -- Create a delta and add it to the Transactie.
--   addDelta $ createDelta cid value

onNothing :: forall a m. MonadThrow Error m => String -> m (Maybe a) -> m a
onNothing message ma = do
  a <- ma
  case a of
    Nothing -> throwError $ error message
    (Just v) -> pure v

onNothing' :: forall a m. MonadThrow Error m => String -> Maybe a -> m a
onNothing' message ma = do
  case ma of
    Nothing -> throwError $ error message
    (Just v) -> pure v
