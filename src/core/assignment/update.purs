-- BEGIN LICENSE
-- Perspectives Distributed Runtime
-- Copyright (C) 2019 Joop Ringelberg (joopringelberg@perspect.it), Cor Baars
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
-- Full text of this license can be found in the LICENSE file in the projects root.

-- END LICENSE

module Perspectives.Assignment.Update where

import Prelude

import Control.Monad.Error.Class (throwError)
import Control.Monad.Trans.Class (lift)
import Data.Array (difference, union)
import Data.Foldable (for_)
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe(..))
import Effect.Exception (error)
import Foreign.Generic.Class (class GenericEncode)
import Perspectives.ContextAndRole (addRol_gevuldeRollen, addRol_property, changeContext_me, changeRol_binding, changeRol_isMe, context_me, deleteContext_rolInContext, deleteRol_property, modifyContext_rolInContext, removeRol_binding, removeRol_gevuldeRollen, removeRol_property, rol_binding, rol_context, rol_pspType, setContext_rolInContext, setRol_property)
import Perspectives.CoreTypes (MonadPerspectivesTransaction, Updater)
import Perspectives.Deltas (addRoleDelta, addContextDelta, addPropertyDelta)
import Perspectives.InstanceRepresentation (PerspectContext, PerspectRol(..))
import Perspectives.Parsing.Messages (PerspectivesError(..))
import Perspectives.Persistent (class Persistent, getPerspectEntiteit, getPerspectContext)
import Perspectives.Persistent (saveEntiteit) as Instances
import Perspectives.Representation.Class.Cacheable (EnumeratedPropertyType, EnumeratedRoleType, cacheOverwritingRevision)
import Perspectives.Representation.InstanceIdentifiers (ContextInstance, RoleInstance, Value)
import Perspectives.TypesForDeltas (RoleDelta(..), ContextDelta(..), DeltaType(..), PropertyDelta(..))

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
-- | Create update functions on PerspectContext or PerspectRol.
-- | The result is an ObjectsGetter that always returns the (ID of the) Persistent.
-- | Sets up the Bot actions for a Context.

-----------------------------------------------------------
-- UPDATE A BINDING
-----------------------------------------------------------
-- | Changes the binding.
-- | Modifies the Role instance.
-- | Caches and saves the Role instance.
-- | Adds a RoleDelta to the transaction.
-- | Sets isMe on the Role instance if the binding represents the user.
-- | Sets me on the context of the Role instance if the binding represents the user.
setBinding :: RoleInstance -> (Updater RoleInstance)
setBinding roleId (newBindingId :: RoleInstance) = do
  (originalRole :: PerspectRol) <- lift $ lift $ getPerspectEntiteit roleId
  saveEntiteit roleId (changeRol_binding newBindingId originalRole)
  addRoleDelta $ RoleDelta
              { id : roleId
              , binding: Just newBindingId
              , deltaType: Change
              }

  newBinding@(PerspectRol{isMe}) <- lift $ lift $ getPerspectEntiteit newBindingId
  if isMe
    then do
      modifiedRole <- lift $ lift $ getPerspectEntiteit roleId
      saveEntiteit roleId (changeRol_isMe modifiedRole isMe)
      -- set roleId to be the value of Me of its context.
      setMe (rol_context modifiedRole) (Just roleId)
    else pure unit

  -- Handle inverse binding.
  case rol_binding originalRole of
    Nothing -> pure unit
    (Just (oldBindingId :: RoleInstance)) -> do
      -- Remove this roleinstance as a binding role from the old binding.
      (oldBinding :: PerspectRol) <- lift $ lift $ getPerspectEntiteit oldBindingId
      saveEntiteit oldBindingId (removeRol_gevuldeRollen oldBinding (rol_pspType originalRole) roleId)

      -- Add this roleinstance as a binding role for the new binding.
      saveEntiteit newBindingId (addRol_gevuldeRollen newBinding (rol_pspType originalRole) roleId)

-- | Removes the binding R of the rol, if any.
-- | Removes the rol as value of 'gevuldeRollen' for psp:Rol$binding from the binding R.
-- | Modifies the Role instance.
-- | Caches and saves the Role instance.
-- | Adds a RoleDelta to the transaction.
-- | Sets isMe to Nothing on the Role instance if the binding we removed represents the user.
-- | Removes me from the context of the Role instance if the binding we removed represents the user.
removeBinding :: (Updater RoleInstance)
removeBinding roleId = do
  (originalRole :: PerspectRol) <- lift $ lift $ getPerspectEntiteit roleId
  saveEntiteit roleId (changeRol_isMe (removeRol_binding originalRole) false)
  -- TODO: if roleId is the value of Me in its context, remove it.
  ctxt <- lift $ lift $ getPerspectContext $ rol_context originalRole
  if (context_me ctxt == (Just roleId))
    then setMe (rol_context originalRole) Nothing
    else pure unit
  addRoleDelta $ RoleDelta
              { id : roleId
              , binding: (rol_binding originalRole)
              , deltaType: Remove
              }

  -- Handle inverse binding.
  case rol_binding originalRole of
    Nothing -> pure unit
    (Just oldBindingId) -> do
      -- Remove this roleinstance as a binding role from the old binding.
      (oldBinding :: PerspectRol) <- lift $ lift $ getPerspectEntiteit oldBindingId
      saveEntiteit oldBindingId (removeRol_gevuldeRollen oldBinding (rol_pspType originalRole) roleId)

-----------------------------------------------------------
-- UPDATE A ROLE
-----------------------------------------------------------
type RoleUpdater = ContextInstance -> EnumeratedRoleType -> (Updater (Array RoleInstance))

-- | Modifies the context instance.
-- | Adds Context deltas to the Transaction.
-- | Caches and saves the context instance.
-- | Notice that this function does neither cache nor save the rolInstances themselves.
addRol :: ContextInstance -> EnumeratedRoleType -> (Updater (Array RoleInstance))
addRol contextId rolName rolInstances = do
  (pe :: PerspectContext) <- lift $ lift $ getPerspectEntiteit contextId
  saveEntiteit contextId (modifyContext_rolInContext pe rolName (flip union rolInstances))
  for_ rolInstances \rolInstance ->
    addContextDelta $ ContextDelta
                { id : contextId
                , role: rolName
                , deltaType: Add
                , instance: Just rolInstance
                }

-- | Modifies the context instance.
-- | Adds Context deltas to the Transaction.
-- | Caches and saves the context instance.
-- | Notice that this function does neither cache nor save the rolInstances themselves.
-- | Instead, use removeRoleInstance.
removeRolFromContext :: ContextInstance -> EnumeratedRoleType -> (Updater (Array RoleInstance))
removeRolFromContext contextId rolName rolInstances = do
  (pe :: PerspectContext) <- lift $ lift $ getPerspectEntiteit contextId
  saveEntiteit contextId (modifyContext_rolInContext pe rolName (flip difference rolInstances))
  for_ rolInstances \rolInstance ->
    addContextDelta $ ContextDelta
                { id : contextId
                , role: rolName
                , deltaType: Remove
                , instance: Just rolInstance
                }

-- | Modifies the context instance.
-- | Adds Context deltas to the Transaction.
-- | Caches and saves the context instance.
-- | Notice that this function does not remove the rolInstances themselves, nor
-- | add them to the Transaction.
-- | Instead, use removeAllRoleInstances for that.
deleteRol :: ContextInstance -> EnumeratedRoleType -> MonadPerspectivesTransaction Unit
deleteRol contextId rolName = do
  (pe :: PerspectContext) <- lift $ lift $ getPerspectEntiteit contextId
  saveEntiteit contextId (deleteContext_rolInContext pe rolName)
  addContextDelta $ ContextDelta
              { id : contextId
              , role: rolName
              , deltaType: Delete
              , instance: Nothing
              }

-- | Modifies the context instance.
-- | Adds Context deltas to the Transaction.
-- | Caches and saves the context instance.
-- | Notice that this function does not remove the rolInstances themselves, nor
-- | add them to the Transaction.
-- | Instead, use removeAllRoleInstances for that.
setRol :: ContextInstance -> EnumeratedRoleType -> (Updater (Array RoleInstance))
setRol contextId rolName rolInstances = do
  (pe :: PerspectContext) <- lift $ lift $ getPerspectEntiteit contextId
  saveEntiteit contextId (setContext_rolInContext pe rolName (rolInstances :: Array RoleInstance))
  for_ rolInstances \rolInstance ->
    addContextDelta $ ContextDelta
                { id : contextId
                , role: rolName
                , deltaType: Change
                , instance: Just rolInstance
                }

-- | Detach the role instances from their current context and attach them to the new context.
-- | Modifies both context instances.
-- | Adds Context deltas to the Transaction.
-- | Caches and saves the context instances.
-- | Notice that this function does neither cache nor save the rolInstances themselves.
-- TODO: implement moveRoles.
moveRoles :: ContextInstance -> EnumeratedRoleType -> (Updater (Array RoleInstance))
moveRoles contextId rolName rolInstances = throwError (error $ show (Custom "Implement moveRoles!"))
-----------------------------------------------------------
-- UPDATE A PROPERTY
-----------------------------------------------------------
type PropertyUpdater = Array RoleInstance -> EnumeratedPropertyType -> (Updater (Array Value))

-- | Modify the role instance with the new property values.
-- | Adds PropertyDeltas to the Transaction.
-- | Caches and saves the modified Role instance.
addProperty :: Array RoleInstance -> EnumeratedPropertyType -> (Updater (Array Value))
addProperty rids propertyName values = for_ rids \rid -> do
  (pe :: PerspectRol) <- lift $ lift $ getPerspectEntiteit rid
  saveEntiteit rid (addRol_property pe propertyName values)
  for_ values \val ->
    addPropertyDelta $ PropertyDelta
                { id : rid
                , property: propertyName
                , deltaType: Add
                , value: Just val
                }

-- | Modify the role instance with the new property values.
-- | Adds PropertyDeltas to the Transaction.
-- | Caches and saves the modified Role instance.
removeProperty :: Array RoleInstance -> EnumeratedPropertyType -> (Updater (Array Value))
removeProperty rids propertyName values = for_ rids \rid -> do
  (pe :: PerspectRol) <- lift $ lift $ getPerspectEntiteit rid
  saveEntiteit rid (removeRol_property pe propertyName values)
  for_ values \val ->
    addPropertyDelta $ PropertyDelta
                { id : rid
                , property: propertyName
                , deltaType: Remove
                , value: Just val
                }

-- | Modify the role instance with the new property values.
-- | Adds PropertyDeltas to the Transaction.
-- | Caches and saves the modified Role instance.
deleteProperty :: Array RoleInstance -> EnumeratedPropertyType -> MonadPerspectivesTransaction Unit
deleteProperty rids propertyName = for_ rids \rid -> do
  (pe :: PerspectRol) <- lift $ lift $ getPerspectEntiteit rid
  saveEntiteit rid (deleteRol_property pe propertyName)
  addPropertyDelta $ PropertyDelta
              { id : rid
              , property: propertyName
              , deltaType: Delete
              , value: Nothing
              }

-- | Modify the role instance with the new property values.
-- | Adds PropertyDeltas to the Transaction.
-- | Caches and saves the modified Role instance.
setProperty :: Array RoleInstance -> EnumeratedPropertyType -> (Updater (Array Value))
setProperty rids propertyName values = for_ rids \rid -> do
  (pe :: PerspectRol) <- lift $ lift $ getPerspectEntiteit rid
  saveEntiteit rid (setRol_property pe propertyName values)
  for_ values \value ->
    addPropertyDelta $ PropertyDelta
                { id : rid
                , property: propertyName
                , deltaType: Change
                , value: Just value
                }

-----------------------------------------------------------
-- LOCAL SAVENTITEIT
-----------------------------------------------------------
-- Save the entity in cache and in couchdb.
saveEntiteit :: forall a i r. GenericEncode r => Generic a r => Persistent a i => i -> a -> MonadPerspectivesTransaction Unit
saveEntiteit rid rol = do
  -- We can use cacheOverwritingRevision instead of cachePreservingRevision because a) we know there is
  -- a cached entiteit, in this context of updating, so b) we do not accidentally overwrite
  -- the version number (because we don't create entities in this file).
  lift $ lift $ void $ cacheOverwritingRevision rid rol
  lift $ lift $ void $ Instances.saveEntiteit rid

-----------------------------------------------------------
-- SET ME
-----------------------------------------------------------
-- | Even though we modify the ContextInstance, we do not push a Delta.
-- | This is because the value of Me is indexed and never communicated with other users.
setMe :: ContextInstance -> Maybe RoleInstance -> MonadPerspectivesTransaction Unit
setMe cid me = do
  ctxt <- lift $ lift $ getPerspectContext cid
  saveEntiteit cid (changeContext_me ctxt me)
