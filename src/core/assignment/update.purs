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

import Control.Monad.Trans.Class (lift)
import Data.Array (difference, union)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Perspectives.ContextAndRole (addRol_gevuldeRollen, addRol_property, changeRol_binding, modifyContext_rolInContext, removeRol_binding, removeRol_gevuldeRollen, removeRol_property, rol_binding, rol_pspType, setContext_rolInContext, setRol_property)
import Perspectives.CoreTypes (Updater, MonadPerspectivesTransaction)
import Perspectives.Deltas (addBindingDelta, addRoleDelta, addPropertyDelta)
import Perspectives.InstanceRepresentation (PerspectContext, PerspectRol)
import Perspectives.Instances (class PersistentInstance, getPerspectEntiteit, saveVersionedEntiteit)
import Perspectives.Representation.Class.Persistent (EnumeratedPropertyType, EnumeratedRoleType, cacheCachedEntiteit)
import Perspectives.Representation.InstanceIdentifiers (ContextInstance, RoleInstance, Value)
import Perspectives.TypesForDeltas (BindingDelta(..), RoleDelta(..), DeltaType(..), PropertyDelta(..))

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
-- | The result is an ObjectsGetter that always returns the (ID of the) PersistentInstance.
-- | Sets up the Bot actions for a Context.

-----------------------------------------------------------
-- UPDATE A BINDING
-----------------------------------------------------------
setBinding :: RoleInstance -> (Updater RoleInstance)
setBinding roleId (newBindingId :: RoleInstance) = do
  (originalRole :: PerspectRol) <- lift $ lift $ getPerspectEntiteit roleId
  saveEntiteit roleId (changeRol_binding newBindingId originalRole)
  addBindingDelta $ BindingDelta
              { id : roleId
              , binding: Just newBindingId
              , deltaType: Change
              }

  -- Handle inverse binding.
  case rol_binding originalRole of
    Nothing -> pure unit
    (Just (oldBindingId :: RoleInstance)) -> do
      -- Remove this roleinstance as a binding role from the old binding.
      (oldBinding :: PerspectRol) <- lift $ lift $ getPerspectEntiteit oldBindingId
      saveEntiteit oldBindingId (removeRol_gevuldeRollen oldBinding (rol_pspType originalRole) roleId)

      -- Add this roleinstance as a binding role for the new binding.
      newBinding <- lift $ lift $ getPerspectEntiteit newBindingId
      saveEntiteit newBindingId (addRol_gevuldeRollen newBinding (rol_pspType originalRole) roleId)

-- saveEntiteit :: RoleInstance -> PerspectRol -> MonadPerspectivesTransaction Unit
saveEntiteit :: forall a i. PersistentInstance a i => i -> a -> MonadPerspectivesTransaction Unit
saveEntiteit rid rol = do
  lift $ lift $ void $ cacheCachedEntiteit rid rol
  lift $ lift $ void $ saveVersionedEntiteit rid rol

-- | Removes the binding R of the rol, if any.
-- | Removes the rol as value of 'gevuldeRollen' for psp:Rol$binding from the binding R.
removeBinding :: (Updater RoleInstance)
removeBinding roleId = do
  (originalRole :: PerspectRol) <- lift $ lift $ getPerspectEntiteit roleId
  saveEntiteit roleId (removeRol_binding originalRole)
  addBindingDelta $ BindingDelta
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

addRol :: ContextInstance -> EnumeratedRoleType -> (Updater (Array RoleInstance))
addRol contextId rolName rolInstances = do
  (pe :: PerspectContext) <- lift $ lift $ getPerspectEntiteit contextId
  saveEntiteit contextId (modifyContext_rolInContext pe rolName (flip union rolInstances))
  for_ rolInstances \rolInstance ->
    addRoleDelta $ RoleDelta
                { id : contextId
                , role: rolName
                , deltaType: Add
                , instance: rolInstance
                }

removeRol :: ContextInstance -> EnumeratedRoleType -> (Updater (Array RoleInstance))
removeRol contextId rolName rolInstances = do
  (pe :: PerspectContext) <- lift $ lift $ getPerspectEntiteit contextId
  saveEntiteit contextId (modifyContext_rolInContext pe rolName (flip difference rolInstances))
  for_ rolInstances \rolInstance ->
    addRoleDelta $ RoleDelta
                { id : contextId
                , role: rolName
                , deltaType: Remove
                , instance: rolInstance
                }

setRol :: ContextInstance -> EnumeratedRoleType -> (Updater (Array RoleInstance))
setRol contextId rolName rolInstances = do
  (pe :: PerspectContext) <- lift $ lift $ getPerspectEntiteit contextId
  saveEntiteit contextId (setContext_rolInContext pe rolName (rolInstances :: Array RoleInstance))
  for_ rolInstances \rolInstance ->
    addRoleDelta $ RoleDelta
                { id : contextId
                , role: rolName
                , deltaType: Change
                , instance: rolInstance
                }

-----------------------------------------------------------
-- UPDATE A PROPERTY
-----------------------------------------------------------
type PropertyUpdater = Array RoleInstance -> EnumeratedPropertyType -> (Updater (Array Value))

addProperty :: Array RoleInstance -> EnumeratedPropertyType -> (Updater (Array Value))
addProperty rids propertyName values = for_ rids \rid -> do
  (pe :: PerspectRol) <- lift $ lift $ getPerspectEntiteit rid
  saveEntiteit rid (addRol_property pe propertyName values)
  for_ values \val ->
    addPropertyDelta $ PropertyDelta
                { id : rid
                , property: propertyName
                , deltaType: Add
                , value: val
                }

removeProperty :: Array RoleInstance -> EnumeratedPropertyType -> (Updater (Array Value))
removeProperty rids propertyName values = for_ rids \rid -> do
  (pe :: PerspectRol) <- lift $ lift $ getPerspectEntiteit rid
  saveEntiteit rid (removeRol_property pe propertyName values)
  for_ values \val ->
    addPropertyDelta $ PropertyDelta
                { id : rid
                , property: propertyName
                , deltaType: Remove
                , value: val
                }

setProperty :: Array RoleInstance -> EnumeratedPropertyType -> (Updater (Array Value))
setProperty rids propertyName values = for_ rids \rid -> do
  (pe :: PerspectRol) <- lift $ lift $ getPerspectEntiteit rid
  saveEntiteit rid (setRol_property pe propertyName values)
  for_ values \value ->
    addPropertyDelta $ PropertyDelta
                { id : rid
                , property: propertyName
                , deltaType: Change
                , value: value
                }
