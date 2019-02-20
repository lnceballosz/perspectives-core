module Perspectives.Deltas where

import Control.Monad.Aff (error, throwError)
import Control.Monad.Aff.Class (liftAff)
import Control.Monad.Eff.AVar (AVAR)
import Control.Monad.State.Trans (StateT, execStateT, get, lift, put)
import Data.Array (cons, delete, deleteAt, elemIndex, find, findIndex, head)
import Data.Foreign.Generic (encodeJSON)
import Data.Maybe (Maybe(..), fromJust, maybe)
import Data.StrMap (StrMap, empty, insert, lookup)
import Data.Traversable (for_)
import Data.TraversableWithIndex (forWithIndex)
import Network.HTTP.Affjax (AffjaxResponse, put) as AJ
import Network.HTTP.StatusCode (StatusCode(..))
import Partial.Unsafe (unsafePartial)
import Perspectives.CoreTypes (MonadPerspectives, Transactie(..), Triple(..), TypedTripleGetter, ObjectsGetter, createTransactie, transactieID, (%%>>))
import Perspectives.DataTypeObjectGetters (context)
import Perspectives.DataTypeTripleGetters (identity, rolType) as DTG
import Perspectives.DomeinCache (saveCachedDomeinFile)
import Perspectives.Effects (AjaxAvarCache, TransactieEffects)
import Perspectives.EntiteitAndRDFAliases (ContextID, ID)
import Perspectives.ModelBasedObjectGetters (propertyIsFunctioneel, rolIsFunctioneel)
import Perspectives.ModelBasedTripleGetters (actiesInContextDefM, ownRollenDefM, rolInContextDefM, inverse_subjectRollenDefM, propertyIsFunctioneelM, rolIsFunctioneelM, bindingDefM, objectRollenDefM, objectViewDefM, propertyReferentiesM, rolUserM, subjectRollenDefM)
import Perspectives.PerspectivesState (setTransactie, transactie)
import Perspectives.QueryCombinators (contains, filter, intersect, notEmpty, rolesOf, toBoolean)
import Perspectives.RunMonadPerspectivesQuery (runMonadPerspectivesQuery, (##), (##>))
import Perspectives.Syntax (PerspectContext(..), PerspectRol(..))
import Perspectives.TheoryChange (addTripleToQueue, modifyTriple)
import Perspectives.TripleGetterComposition ((>->))
import Perspectives.TypesForDeltas (Delta(..), DeltaType(..))
import Perspectives.User (getUser)
import Perspectives.Utilities (maybeM, onNothing')
import Prelude (Unit, bind, discard, id, pure, show, unit, ($), (&&), (<<<), (<>), (==), (>>=), (||))

-- TODO: doe ook wat met de andere modificaties in de transactie?
runTransactie :: forall e. MonadPerspectives (TransactieEffects e) Unit
runTransactie = do
  user <- getUser
  t@(Transactie{deltas, changedDomeinFiles}) <- transactie
  -- register a triple for each delta, add it to the queue, run the queue.
  -- maybeTriples <- traverse (lift <<< modifyTriple) deltas
  -- modifiedTriples <- pure (foldr (\mt a -> maybe a (flip cons a) mt) [] maybeTriples)
  -- Propagate the triple changes.
  -- _ <- updateFromSeeds modifiedTriples
  for_ changedDomeinFiles saveCachedDomeinFile
  -- Send the Transaction to all involved.
  distributeTransactie t
  (lift $ createTransactie user) >>= setTransactie

distributeTransactie :: forall e. Transactie -> MonadPerspectives (AjaxAvarCache e) Unit
distributeTransactie t = do
  (customizedTransacties :: StrMap Transactie) <- transactieForEachUser t
  _ <- forWithIndex customizedTransacties sendTransactieToUser
  pure unit

addContextToTransactie :: forall e. PerspectContext ->
  MonadPerspectives (avar :: AVAR | e) Unit
addContextToTransactie c = do
  (Transactie tf@{createdContexts}) <- transactie
  setTransactie $ Transactie tf {createdContexts = cons c createdContexts}
  -- put $ Transactie tf {createdContexts = cons c createdContexts}

addRolToTransactie :: forall e. PerspectRol -> MonadPerspectives (avar :: AVAR | e) Unit
addRolToTransactie c = do
  (Transactie tf@{createdRoles}) <- transactie
  setTransactie $ Transactie tf {createdRoles = cons c createdRoles}

deleteContextFromTransactie :: forall e. PerspectContext -> MonadPerspectives (avar :: AVAR | e) Unit
deleteContextFromTransactie c@(PerspectContext{_id}) = do
  (Transactie tf@{createdContexts, deletedContexts}) <- transactie
  case findIndex (\(PerspectContext{_id: i}) -> _id == i) createdContexts of
    Nothing -> setTransactie (Transactie tf{deletedContexts = cons _id deletedContexts})
    (Just i) -> setTransactie (Transactie tf{createdContexts = unsafePartial $ fromJust $ deleteAt i createdContexts})

deleteRolFromTransactie :: forall e. PerspectRol -> MonadPerspectives (avar :: AVAR | e) Unit
deleteRolFromTransactie c@(PerspectRol{_id}) = do
  (Transactie tf@{createdRoles, deletedRoles}) <- transactie
  case findIndex (\(PerspectRol{_id: i}) -> _id == i) createdRoles of
    Nothing -> setTransactie (Transactie tf{deletedRoles = cons _id deletedRoles})
    (Just i) -> setTransactie (Transactie tf{createdRoles = unsafePartial $ fromJust $ deleteAt i createdRoles})

addDomeinFileToTransactie :: forall e. ID -> MonadPerspectives (avar :: AVAR | e) Unit
addDomeinFileToTransactie dfId = do
  (Transactie tf@{changedDomeinFiles}) <- transactie
  case elemIndex dfId changedDomeinFiles of
    Nothing -> setTransactie $ Transactie tf {changedDomeinFiles = cons dfId changedDomeinFiles}
    otherwise -> pure unit

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
addDelta :: forall e. Delta -> MonadPerspectives (AjaxAvarCache e) Unit
addDelta newCD@(Delta{id: id', memberName, deltaType, value, isContext}) = do
  t@(Transactie tf@{deltas}) <- transactie
  case elemIndex newCD deltas of
    (Just _) -> pure unit
    Nothing -> do
      maybeM (pure unit) addTripleToQueue (lift $ modifyTriple newCD)
      (isFunctionalComputer :: ObjectsGetter e) <- if isContext then pure rolIsFunctioneel else pure propertyIsFunctioneel
      isfunc <- isFunctionalComputer memberName -- hier komt ie niet uit.
      -- (isfunc :: Boolean) <- runMonadPerspectivesQuery memberName (toBoolean (if isContext then rolIsFunctioneelM else propertyIsFunctioneelM ))
      if (maybe false ((==) "true") (head isfunc))
        then do
          x <- pure $ findIndex equalExceptRolID deltas
          case x of
            (Just oldCD) -> setTransactie (replace oldCD newCD t)
            Nothing -> do
              mCdelta <- pure $ find equalIdRolName deltas
              case mCdelta of
                Nothing -> setTransactie (add newCD t)
                (Just oldCD@(Delta oldF@{deltaType: d})) -> do
                  indexOld <- pure (unsafePartial (fromJust (elemIndex oldCD deltas)))
                  case d of
                    Add | (deltaType == Remove) -> setTransactie (remove oldCD t)
                    Remove | (deltaType == Add) -> setTransactie (remove oldCD t)
                    Change | (deltaType == Remove) -> setTransactie (replace indexOld newCD t)
                    Add | (deltaType == Change) -> setTransactie (replace indexOld (Delta oldF {value = value}) t)
                    otherwise -> setTransactie (add newCD t)
        else do
          x <- pure $ findIndex equalExceptDeltaType deltas
          case x of
            Nothing -> setTransactie (add newCD t)
            (Just i) -> setTransactie (replace i newCD t)
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


sendTransactieToUser :: forall e. ID -> Transactie -> MonadPerspectives (AjaxAvarCache e) Unit
sendTransactieToUser userId t = do
  tripleUserIP <- userId ##> DTG.identity -- TODO. Het lijkt erop dat hier een getter toegepast moet worden die het IP adres van de user oplevert!
  (userIP :: String) <- (onNothing' <<< error) ("sendTransactieToUser: user has no IP: " <> userId) tripleUserIP
  -- TODO controleer of hier authentication nodig is!
  (res :: AJ.AffjaxResponse String)  <- liftAff $ AJ.put (userIP <> "/" <> userId <> "_post/" <> transactieID t) (encodeJSON t)
  (StatusCode n) <- pure res.status
  case n == 200 || n == 201 of
    true -> pure unit
    false -> throwError $ error ("sendTransactieToUser " <> transactieID t <> " fails: " <> (show res.status) <> "(" <> show res.response <> ")")
  pure unit

-- TODO. De verbinding tussen Actie en Rol is omgekeerd en is niet
-- langer geregistreerd als een rol van de Actie, maar als rol van de Rol (objectRol en subjectRol).
-- | The (IDs of the) users that play a role in, and have a relevant perspective on, the Context that is modified;
-- | or the users that play a role in the context of the Role that is modified and have a relevant perspective on that Role.
usersInvolvedInDelta :: forall e. Delta -> MonadPerspectives (AjaxAvarCache e) (Array ID)
usersInvolvedInDelta dlt@(Delta{isContext}) = if isContext then usersInvolvedInContext dlt else usersInvolvedInRol dlt
  where

  -- From the instance of a Rol, retrieve the instances of users that play another Rol
  -- in the same context, such that they have an Actie with an objectView that has the
  -- changed property (as identified by memberName).
  usersInvolvedInRol :: Delta -> MonadPerspectives (AjaxAvarCache e) (Array ID)
  usersInvolvedInRol (Delta{id, memberName}) =
    do
      (contextId :: ContextID) <- id %%>> context
      (Triple {object}) <-
        id ## DTG.rolType >-> subjectsOfRelevantActies >-> (rolesOf contextId) >-> rolUserM
      pure $ object
    where
      -- roles in context that play the subjectRol in the relevant acties
      -- psp:Rol -> psp:Rol
      subjectsOfRelevantActies = filter (notEmpty (intersect subjectRollenDefM relevantActies)) (rolInContextDefM >-> ownRollenDefM)

      -- acties that have an objectView with the memberName
      -- psp:Rol -> psp:Actie
      relevantActies = filter (hasRelevantView memberName) (rolInContextDefM >-> actiesInContextDefM)

  -- From the instance of the context, retrieve the instances of the users that play
  -- a Rol in this context that have a subjectRol bound to an Actie that is bound as the
  -- objectRol of the Rol of which memberName is an instance.
  usersInvolvedInContext :: Delta -> MonadPerspectives (AjaxAvarCache e) (Array ID)
  usersInvolvedInContext (Delta{id, memberName}) =
    do
      (Triple {object}) <- id ## DTG.rolType >-> actorsForObject >-> (rolesOf id) >-> rolUserM
      pure object
    where
      -- All Rollen that are the subject of Acties that have the Rol as object.
      -- `psp:Rol -> psp:Rol`
      actorsForObject = objectRollenDefM >-> inverse_subjectRollenDefM

  -- Tests an Actie for having memberName in the view that is its objectView.
  -- psp:Actie -> psp:Boolean
  hasRelevantView :: ID -> TypedTripleGetter e
  hasRelevantView id = contains id (objectViewDefM >-> propertyReferentiesM >-> bindingDefM)

{-
Bouw een transactie eerst op, splits hem dan in versies voor elke gebruiker.
Doorloop de verzameling deltas en bepaal per delta welke gebruikers betrokken zijn.
Bouw al doende een StrMap van userId en gespecialiseerde transacties op, waarbij je een transactie toevoegt voor een gebruiker die nog niet in de StrMap voorkomt.
-}
transactieForEachUser :: forall e. Transactie -> MonadPerspectives (AjaxAvarCache e)(StrMap Transactie)
transactieForEachUser t@(Transactie{deltas}) = do
  execStateT
    (for_ deltas (\d -> (lift $ usersInvolvedInDelta d) >>= (\users -> transactieForEachUser' d users)))
    empty
  where
    transactieForEachUser' :: Delta -> (Array ID) -> StateT (StrMap Transactie) (MonadPerspectives (AjaxAvarCache e)) Unit
    transactieForEachUser' d users = do
      trs <- get
      for_
        users
        (\user -> case lookup user trs of
          Nothing -> put $ insert user (transactieCloneWithJustDelta t d) trs
          (Just (Transactie tr@{deltas: ds})) -> put $ insert user (Transactie tr {deltas = cons d ds}) trs)
    transactieCloneWithJustDelta :: Transactie -> Delta -> Transactie
    transactieCloneWithJustDelta (Transactie tr) d = Transactie tr {deltas = [d]}
