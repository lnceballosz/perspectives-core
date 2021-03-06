-- BEGIN LICENSE
-- Perspectives Distributed Runtime
-- SPDX-FileCopyrightText: 2019 Joop Ringelberg (joopringelberg@perspect.it), Cor Baars
-- SPDX-License-Identifier: GPL-3.0-or-later
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with this program.  If not, see <https://www.gnu.org/licenses/>.
--
-- Full text of this license can be found in the LICENSE directory in the projects root.

-- END LICENSE

-- | The functions in this module modify contexts and roles. All these functions
-- |  * cache the results
-- |  * save the results
-- |  * add Delta's to the current Transaction
-- | They fall in three categories:
-- |  * modification of a Context, by changing its roles.
-- |  * modification of a Role by changing its binding
-- |  * modification of a Role by changing its property values
-- | The two binding-changing functions recompute the special `isMe` property (a Boolean value indicating whether the role represents the user).
-- | The context-changing functions recompute the special `me` role (it is the role instance that represents the user).
-- | IMPORTANT: the functions that change the context never save nor cache the role instances that are involved in the
-- | change.

module Perspectives.Assignment.Update where

import Prelude

import Control.Monad.AvarMonadAsk (gets)
import Control.Monad.Error.Class (try)
import Control.Monad.Trans.Class (lift)
import Data.Array (cons, difference, elemIndex, filter, find, foldM, null, union)
import Data.Array (head) as ARR
import Data.Array.NonEmpty (NonEmptyArray, head, toArray)
import Data.Foldable (for_)
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe(..), fromJust, isJust, maybe)
import Data.Newtype (over, unwrap)
import Data.Traversable (for)
import Data.Tuple (Tuple(..), fst, snd)
import Foreign.Generic (encodeJSON)
import Foreign.Generic.Class (class GenericEncode)
import Foreign.Object (Object, empty, filterKeys, fromFoldable, insert, lookup)
import Foreign.Object (union) as OBJ
import Partial.Unsafe (unsafePartial)
import Perspectives.Authenticate (sign)
import Perspectives.CollectAffectedContexts (aisInPropertyDelta, lift2, usersWithPerspectiveOnRoleInstance)
import Perspectives.ContextAndRole (addRol_property, changeContext_me, context_rolInContext, deleteRol_property, isDefaultContextDelta, modifyContext_rolInContext, removeRol_property, rol_id, rol_isMe)
import Perspectives.CoreTypes (MonadPerspectivesTransaction, Updater, MonadPerspectives, (##>>))
import Perspectives.Deltas (addCorrelationIdentifiersToTransactie, addDelta)
import Perspectives.DependencyTracking.Dependency (findPropertyRequests, findRoleRequests)
import Perspectives.Error.Boundaries (handlePerspectContextError, handlePerspectRolError, handlePerspectRolError')
import Perspectives.InstanceRepresentation (PerspectContext, PerspectRol(..))
import Perspectives.Instances.ObjectGetters (binding_, roleType)
import Perspectives.Persistent (class Persistent, getPerspectEntiteit, getPerspectRol, getPerspectContext)
import Perspectives.Persistent (saveEntiteit) as Instances
import Perspectives.Representation.ADT (ADT(..))
import Perspectives.Representation.Class.Cacheable (EnumeratedPropertyType, EnumeratedRoleType(..), cacheEntity)
import Perspectives.Representation.Class.Identifiable (identifier)
import Perspectives.Representation.Class.Role (allLocallyRepresentedProperties)
import Perspectives.Representation.InstanceIdentifiers (ContextInstance, RoleInstance, Value(..))
import Perspectives.Representation.TypeIdentifiers (PropertyType(..))
import Perspectives.SerializableNonEmptyArray (SerializableNonEmptyArray(..), singleton)
import Perspectives.Sync.DeltaInTransaction (DeltaInTransaction(..))
import Perspectives.Sync.SignedDelta (SignedDelta(..))
import Perspectives.Types.ObjectGetters (isUnlinked_)
import Perspectives.TypesForDeltas (ContextDelta(..), ContextDeltaType(..), RolePropertyDelta(..), RolePropertyDeltaType(..), SubjectOfAction(..), UniverseRoleDelta(..), UniverseRoleDeltaType(..))

---------------------------------
-----------------------------------------------------------
-- UPDATE A CONTEXT (ADDING OR REMOVING ROLE INSTANCES)
-----------------------------------------------------------
type RoleUpdater = ContextInstance -> EnumeratedRoleType -> (Updater (Array RoleInstance))

-- | Modifies the context instance by adding the given role instances.
-- | Notice that this function does neither cache nor save the rolInstances themselves.
-- | If all rolInstances are part of the context before the operation, this is a no-op without any effects.
-- | PERSISTENCE of the context instance.
-- | SYNCHRONISATION by ContextDelta and UniverseRoleDelta.
-- | RULE TRIGGERING
-- | QUERY UPDATES
-- | CURRENTUSER for contextId and one of rolInstances.
-- | To handle incoming ContextDeltas, we include them optionally in the last argument.
addRoleInstancesToContext :: ContextInstance -> EnumeratedRoleType -> (Updater (NonEmptyArray (Tuple RoleInstance (Maybe SignedDelta))))
addRoleInstancesToContext contextId rolName instancesAndDeltas = do
  rolInstances <- pure $ fst <$> instancesAndDeltas
  (lift2 $ try $ getPerspectContext contextId) >>=
    handlePerspectContextError "addRoleInstancesToContext1"
      \(pe :: PerspectContext) -> do
        unlinked <- lift2 $ isUnlinked_ rolName
        -- Do not add a roleinstance a second time.
        if unlinked

          then do
            (roles :: Array PerspectRol) <- foldM
              (\roles roleId -> (lift $ lift $ try $ getPerspectRol roleId) >>= (handlePerspectRolError' "addRoleInstancesToContext2" roles (pure <<< (flip cons roles))))
              []
              (toArray rolInstances)
            roles' <- pure $ filter (\(PerspectRol{contextDelta}) -> isDefaultContextDelta contextDelta) roles
            -- only apply f to those role instances that don't yet have a contextDelta (other than the default one).
            if null roles'
              then pure unit
              else f roles' pe unlinked

          else if null (toArray rolInstances `difference` context_rolInContext pe rolName)
            then pure unit
            else do
              (roles :: Array PerspectRol) <- foldM
                (\roles roleId -> (lift $ lift $ try $ getPerspectRol roleId) >>= (handlePerspectRolError' "addRoleInstancesToContext3" roles (pure <<< (flip cons roles))))
                []
                (toArray rolInstances)
              f roles pe unlinked

  where
    f :: Array PerspectRol -> PerspectContext -> Boolean -> MonadPerspectivesTransaction Unit
    f roles pe unlinked = do
      changedContext <- if not unlinked
        then lift2 (modifyContext_rolInContext pe rolName (flip union (identifier <$> roles)))
        else pure pe
      -- PERSISTENCE
      -- In the new roleInstances, is one of them filled by me?
      case find rol_isMe roles of
        Nothing -> cacheAndSave contextId changedContext
        Just me -> do
          (lift2 $ findRoleRequests contextId (EnumeratedRoleType "model:System$Context$Me")) >>= addCorrelationIdentifiersToTransactie
          -- CURRENTUSER
          cacheAndSave contextId (changeContext_me changedContext (Just (rol_id me)))

      -- Guarantees RULE TRIGGERING because contexts with a vantage point are added to
      -- the transaction, too.
      users <- usersWithPerspectiveOnRoleInstance contextId rolName (identifier $ unsafePartial $ fromJust $ ARR.head roles)
      -- SYNCHRONISATION
      subject <- getSubject
      author <- getAuthor
      for_ roles \(PerspectRol r@{_id, universeRoleDelta}) -> do
        addDelta (DeltaInTransaction { users, delta: universeRoleDelta})
        (receivedDelta :: Maybe (Maybe SignedDelta)) <- pure $ snd <$> find (fst >>> eq _id) instancesAndDeltas
        delta <- case receivedDelta of
          Just (Just d) -> pure d
          otherwise -> pure $ SignedDelta
            { author
            , encryptedDelta: sign $ encodeJSON $ ContextDelta
              { id : contextId
              , roleType: rolName
              , deltaType: AddRoleInstancesToContext
              , roleInstances: (singleton _id)
              , destinationContext: Nothing
              , subject
              } }
        addDelta $ DeltaInTransaction {users, delta}
        cacheAndSave _id $ PerspectRol r { contextDelta = delta }
      -- QUERY UPDATES
      (lift2 $ findRoleRequests contextId rolName) >>= addCorrelationIdentifiersToTransactie

-- | Modifies the context instance by detaching the given role instances.
-- | Notice that this function does neither uncache nor unsave the rolInstances
-- | themselves. Instead, use removeRoleInstance.
-- | Does not touch the binding of any of the role instances.
-- | PERSISTENCE of the context instance.
-- | SYNCHRONISATION by ContextDelta and UniverseRoleDelta.
-- | RULE TRIGGERING
-- | QUERY UPDATES
-- | CURRENTUSER for contextId and one of rolInstances.
removeRoleInstancesFromContext :: ContextInstance -> EnumeratedRoleType -> (Updater (NonEmptyArray RoleInstance))
removeRoleInstancesFromContext contextId rolName rolInstances = do
  -- Guarantees RULE TRIGGERING because contexts with a vantage point are added to
  -- the transaction, too.
  users <- usersWithPerspectiveOnRoleInstance contextId rolName (head rolInstances)
  subject <- getSubject
-- SYNCHRONISATION
  author <- getAuthor
  addDelta $ DeltaInTransaction
    { users
    , delta: SignedDelta
      { author
      , encryptedDelta: sign $ encodeJSON $ UniverseRoleDelta
        { id: contextId
        , roleInstances: (SerializableNonEmptyArray rolInstances)
        , roleType: rolName
        , authorizedRole: Nothing
        , deltaType: RemoveRoleInstance
        , subject } }}

  -- QUERY UPDATES.
  (lift2 $ findRoleRequests contextId rolName) >>= addCorrelationIdentifiersToTransactie
  -- Modify the context: remove the role instances from those recorded with the role type.
  (roles :: Array PerspectRol) <- foldM
    (\roles roleId -> (lift $ lift $ try $ getPerspectRol roleId) >>= (handlePerspectRolError' "addRoleInstancesToContext" roles (pure <<< (flip cons roles))))
    []
    (toArray rolInstances)
  (lift2 $ try $ getPerspectContext contextId) >>=
    handlePerspectContextError "removeRoleInstancesFromContext"
      \(pe :: PerspectContext) -> do
        unlinked <- lift2 $ isUnlinked_ rolName
        changedContext <- if unlinked
          then pure pe
          else lift2 (modifyContext_rolInContext pe rolName (flip difference (toArray rolInstances)))
        -- PERSISTENCE.
        case find rol_isMe roles of
          Nothing -> cacheAndSave contextId changedContext
          Just me -> do
            (lift2 $ findRoleRequests contextId (EnumeratedRoleType "model:System$Context$Me")) >>= addCorrelationIdentifiersToTransactie
            -- CURRENTUSER.
            cacheAndSave contextId (changeContext_me changedContext Nothing)

-- | Detach the role instances from their current context and attach them to the new context.
-- | This is not just a convenience function. The combination of removeRoleInstancesFromContext and addRoleInstancesToContext would add UniverseRoleDeltas, which we don't need here.
-- | If all rolInstances are part of the destination context before the operation, this is a no-op without any effects.
-- | PERSISTENCE of both context instances.
-- | SYNCHRONISATION by two ContextDeltas (no UniverseRoleDeltas needed!).
-- | RULE TRIGGERING
-- | QUERY UPDATES
-- | CURRENTUSER for contextId and one of rolInstances.
-- TODO. De enige manier om deze functie aan te passen lijkt een nieuwe ContextDelta te maken en mee te nemen in de ContextDelta met MoveRoleInstancesToAnotherContext. Aan de ontvangende kant moet die nieuwe ContextDelta dan in de verplaatste rol worden gezet op de plek van 'contextDelta'.
moveRoleInstancesToAnotherContext :: ContextInstance -> ContextInstance -> EnumeratedRoleType -> (Updater (NonEmptyArray RoleInstance))
moveRoleInstancesToAnotherContext originContextId destinationContextId rolName rolInstances = pure unit
-- moveRoleInstancesToAnotherContext originContextId destinationContextId rolName rolInstances = do
--   roles <- traverse (lift <<< lift <<< getPerspectRol) rolInstances
--   me <- pure $ rol_id <$> find rol_isMe roles
--   -- me <- pure $ Just $ RoleInstance ""
--   origin <- lift $ lift $ getPerspectContext originContextId
--   destination <- lift $ lift $ getPerspectContext destinationContextId
--   subject <- subjectForRoleInstance (head rolInstances)
--   when (not null (toArray rolInstances `difference` context_rolInContext destination rolName))
--     do
--       case me of
--         Nothing -> do
--           (lift2 $ modifyContext_rolInContext destination rolName (append (toArray rolInstances))) >>= cacheAndSave destinationContextId
--           (lift2 $ modifyContext_rolInContext origin rolName (flip difference (toArray rolInstances))) >>= cacheAndSave originContextId
--         Just m -> do
--           destination' <- lift2 (modifyContext_rolInContext destination rolName (append (toArray rolInstances)))
--           cacheAndSave destinationContextId (changeContext_me destination' me)
--           (lift2 $ findRoleRequests destinationContextId (EnumeratedRoleType "model:System$Context$Me")) >>= addCorrelationIdentifiersToTransactie
--           origin' <- lift2 (modifyContext_rolInContext origin rolName (flip difference (toArray rolInstances)))
--           cacheAndSave originContextId (changeContext_me origin' Nothing)
--           (lift2 $ findRoleRequests originContextId (EnumeratedRoleType "model:System$Context$Me")) >>= addCorrelationIdentifiersToTransactie
--       -- Guarantees RULE TRIGGERING because contexts with a vantage point are added to
--       -- the transaction, too.
--       users <- usersWithPerspectiveOnRoleInstance originContextId rolName (head rolInstances)
--       -- SYNCHRONISATION
--       addContextDelta $ ContextDelta
--             { id : originContextId
--             , roleType: rolName
--             , deltaType: MoveRoleInstancesToAnotherContext
--             , roleInstances: SerializableNonEmptyArray rolInstances
--             , users
--             , sequenceNumber: 0
--             , destinationContext: Just destinationContextId
--             , subject
--             }
--       -- QUERY UPDATES
--       (lift2 $ findRoleRequests destinationContextId rolName) >>= addCorrelationIdentifiersToTransactie
--       (lift2 $ findRoleRequests originContextId rolName) >>= addCorrelationIdentifiersToTransactie

-----------------------------------------------------------
-- UPDATE A ROLE (ADD OR REMOVE PROPERTY VALUES)
-----------------------------------------------------------
type PropertyUpdater = Array RoleInstance -> EnumeratedPropertyType -> (Updater (Array Value))

-- | Modify the role instance with the new property values.
-- | When all values are already in the list of values of the property for the role instance, this is a no-op.
-- | PERSISTENCE of the role instance.
-- | SYNCHRONISATION by RolePropertyDelta.
-- | RULE TRIGGERING
-- | QUERY UPDATES
-- | CURRENTUSER: there can be no change to the current user.
addProperty :: Array RoleInstance -> EnumeratedPropertyType -> (Updater (Array (Tuple Value (Maybe SignedDelta))))
addProperty rids propertyName valuesAndDeltas = case ARR.head rids of
  Nothing -> pure unit
  Just roleId -> do
    values <- pure $ fst <$> valuesAndDeltas
    subject <- getSubject
    author <- getAuthor
    for_ rids \rid' -> do
      mrid <- lift2 $ getPropertyBearingRoleInstance propertyName rid'
      case mrid of
        Nothing -> pure unit
        Just rid -> (lift2 $ try $ getPerspectEntiteit rid) >>= handlePerspectRolError "addProperty"
          \(pe :: PerspectRol) -> do
            -- Compute the users for this role (the value has no effect). As a side effect, contexts are added to the transaction.
            users <- aisInPropertyDelta rid propertyName
            deltas <- for valuesAndDeltas \(Tuple value msignedDelta) -> do
                delta <- case msignedDelta of
                  Nothing -> do
                    -- Create a delta for each value.
                    delta <- pure $ RolePropertyDelta
                      { id : rid
                      , property: propertyName
                      , deltaType: AddProperty
                      , values: [value]
                      , subject
                      }
                    pure $ SignedDelta
                      { author
                      , encryptedDelta: sign $ encodeJSON $ delta}
                  Just signedDelta -> pure signedDelta
                addDelta (DeltaInTransaction { users, delta: delta })
                pure (Tuple (unwrap value) delta)
            (lift2 $ findPropertyRequests rid propertyName) >>= addCorrelationIdentifiersToTransactie
            -- Apply all changes to the role and then save it:
            --  - change the property values in one go
            --  - add all propertyDeltas.
            cacheAndSave rid (over PerspectRol (\r@{propertyDeltas} -> r {propertyDeltas = setDeltasForProperty propertyName (OBJ.union (fromFoldable deltas)) propertyDeltas}) (addRol_property pe propertyName values))

-- | Get the property bearing role individual in the chain.
-- | If the property is defined on role instance's type (either directly or by Aspect), return it; otherwise
-- | recursively apply this function to its binding.
getPropertyBearingRoleInstance :: EnumeratedPropertyType -> RoleInstance -> MonadPerspectives (Maybe RoleInstance)
getPropertyBearingRoleInstance prop roleId = do
  tp <- roleId ##>> roleType
  allProps <- allLocallyRepresentedProperties (ST tp)
  if isJust $ elemIndex (ENP prop) allProps
    then pure $ Just roleId
    else binding_ roleId >>= maybe (pure Nothing) (getPropertyBearingRoleInstance prop)

setDeltasForProperty :: EnumeratedPropertyType -> (Object SignedDelta -> Object SignedDelta) -> (Object (Object SignedDelta)) -> (Object (Object SignedDelta))
setDeltasForProperty propertyName modifier allDeltas = case lookup (unwrap propertyName) allDeltas of
  Nothing -> insert (unwrap propertyName) (modifier empty) allDeltas
  Just oldDeltas -> insert (unwrap propertyName) (modifier oldDeltas) allDeltas

-- | Remove the values from the property's values for the role instance.
-- | When none of the values are in the list of values of the property for the role instance, this is a no-op.
-- | PERSISTENCE of the role instance.
-- | SYNCHRONISATION by RolePropertyDelta.
-- | RULE TRIGGERING
-- | QUERY UPDATES
-- | CURRENTUSER: there can be no change to the current user.
removeProperty :: Array RoleInstance -> EnumeratedPropertyType -> (Updater (Array Value))
removeProperty rids propertyName values = case ARR.head rids of
  Nothing -> pure unit
  Just roleId -> do
    subject <- getSubject
    for_ rids \rid' -> do
      mrid <- lift2 $ getPropertyBearingRoleInstance propertyName rid'
      case mrid of
        Nothing -> pure unit
        Just rid -> (lift2 $ try $ getPerspectEntiteit rid) >>=
          handlePerspectRolError "removeProperty"
          \(pe :: PerspectRol) -> do
            users <- aisInPropertyDelta rid propertyName
            -- Create a delta for all values at once.
            delta <- pure $ RolePropertyDelta
              { id : rid
              , property: propertyName
              , deltaType: RemoveProperty
              , values: values
              , subject
              }
            author <- getAuthor
            signedDelta <- pure $ SignedDelta
              { author
              , encryptedDelta: sign $ encodeJSON $ delta}
            addDelta (DeltaInTransaction { users, delta: signedDelta})
            (lift2 $ findPropertyRequests rid propertyName) >>= addCorrelationIdentifiersToTransactie
            -- Apply all changes to the role and then save it:
            --  - change the property values in one go
            --  - remove all propertyDeltas.
            cacheAndSave rid (over PerspectRol (\r@{propertyDeltas} -> r {propertyDeltas = setDeltasForProperty propertyName (filterKeys (\key -> isJust $ elemIndex (Value key) values)) propertyDeltas}) (removeRol_property pe propertyName values))

-- | Delete all property values from the role for the EnumeratedPropertyType.
-- | If there are no values for the property on the role instance, this is a no-op.
-- | PERSISTENCE of the role instance.
-- | SYNCHRONISATION by PropertyDelta.
-- | RULE TRIGGERING
-- | QUERY UPDATES
-- | CURRENTUSER: there can be no change to the current user.
deleteProperty :: Array RoleInstance -> EnumeratedPropertyType -> MonadPerspectivesTransaction Unit
deleteProperty rids propertyName = case ARR.head rids of
  Nothing -> pure unit
  Just roleId -> do
    subject <- getSubject
    for_ rids \rid' -> do
      mrid <- lift2 $ getPropertyBearingRoleInstance propertyName rid'
      case mrid of
        Nothing -> pure unit
        Just rid -> (lift2 $ try $ getPerspectEntiteit rid) >>=
            handlePerspectRolError
            "deleteProperty"
            \(pe :: PerspectRol) -> do
              users <- aisInPropertyDelta rid propertyName
              -- Create a delta for all values.
              delta <- pure $ RolePropertyDelta
                { id : rid
                , property: propertyName
                , deltaType: DeleteProperty
                , values: []
                , subject
                }
              author <- getAuthor
              signedDelta <- pure $ SignedDelta
                { author
                , encryptedDelta: sign $ encodeJSON $ delta}
              addDelta (DeltaInTransaction { users, delta: signedDelta})
              (lift2 $ findPropertyRequests rid propertyName) >>= addCorrelationIdentifiersToTransactie
              -- Apply all changes to the role and then save it:
              --  - change the property values in one go
              --  - remove all propertyDeltas for this property.
              cacheAndSave rid (over PerspectRol (\r@{propertyDeltas} -> r {propertyDeltas = setDeltasForProperty propertyName (const empty) propertyDeltas}) (deleteRol_property pe propertyName))

-- | Modify the role instance with the new property values.
-- | When all new values are in fact already in the set of values for the property of the role instance, this is
-- | a no-op.
-- | PERSISTENCE of the role instance.
-- | SYNCHRONISATION by RolePropertyDelta.
-- | RULE TRIGGERING
-- | QUERY UPDATES
-- | CURRENTUSER: there can be no change to the current user.
setProperty :: Array RoleInstance -> EnumeratedPropertyType -> (Updater (Array Value))
setProperty rids propertyName values = do
  deleteProperty rids propertyName
  addProperty rids propertyName (flip Tuple Nothing <$> values)

-----------------------------------------------------------
-- CACHEANDSAVE
-----------------------------------------------------------
-- Save the entity in cache and in couchdb.
cacheAndSave :: forall a i r. GenericEncode r => Generic a r => Persistent a i => i -> a -> MonadPerspectivesTransaction Unit
cacheAndSave rid rol = do
  lift2 $ void $ cacheEntity rid rol
  lift2 $ void $ Instances.saveEntiteit rid

-----------------------------------------------------------
-- SET ME
-----------------------------------------------------------
-- | Even though we modify the ContextInstance, we do not push a Delta.
-- | This is because the value of Me is indexed and never communicated with other users.
setMe :: ContextInstance -> Maybe RoleInstance -> MonadPerspectivesTransaction Unit
setMe cid me = do
  (lift2 $ try $ getPerspectContext cid) >>=
    handlePerspectContextError "setMe"
      \ctxt -> do
        cacheAndSave cid (changeContext_me ctxt me)
        (lift2 $ findRoleRequests cid (EnumeratedRoleType "model:System$Context$Me")) >>= addCorrelationIdentifiersToTransactie

getSubject :: MonadPerspectivesTransaction SubjectOfAction
getSubject = lift $ UserType <$> gets (_.authoringRole <<< unwrap)

getAuthor :: MonadPerspectivesTransaction String
getAuthor = lift $ gets (_.author <<< unwrap)
