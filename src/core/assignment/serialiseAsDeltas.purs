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

module Perspectives.Assignment.SerialiseAsDeltas where

import Prelude (Unit, bind, ($), discard, pure, unit)

import Data.Foldable (for_)
import Data.FoldableWithIndex (forWithIndex_)
import Data.Maybe (Maybe(..))
import Perspectives.CollectAffectedContexts (lift2)
import Perspectives.CoreTypes (MonadPerspectivesTransaction, (###>>))
import Perspectives.Deltas (addPropertyDelta, addRoleDelta, addUniverseContextDelta, addUniverseRoleDelta)
import Perspectives.InstanceRepresentation (PerspectContext(..), PerspectRol(..))
import Perspectives.Instances.ObjectGetters (roleType_)
import Perspectives.Persistent (getPerspectContext, getPerspectRol)
import Perspectives.Representation.InstanceIdentifiers (ContextInstance, RoleInstance)
import Perspectives.Representation.TypeIdentifiers (EnumeratedPropertyType(..), EnumeratedRoleType(..), PropertyType(..), RoleType(..))
import Perspectives.Types.ObjectGetters (propertyIsInPerspectiveOf, roleIsInPerspectiveOf)
import Perspectives.TypesForDeltas (DeltaType(..), RoleBindingDelta(..), RolePropertyDelta(..), UniverseContextDelta(..), UniverseRoleDelta(..))

serialisedAsDeltasFor:: ContextInstance -> RoleInstance -> MonadPerspectivesTransaction Unit
serialisedAsDeltasFor cid userId = do
  (PerspectContext{pspType, rolInContext}) <- lift2 $ getPerspectContext cid
  addUniverseContextDelta $ UniverseContextDelta
    { id: cid
    , contextType: pspType
    , deltaType: Add
    , users: [userId]
    , sequenceNumber: 0
    }
  -- Now for each role, decide if the user may see it.
  -- If so, add a UniverseRoleDelta and a ContextDelta.
  userType <- lift2 $ roleType_ userId
  forWithIndex_ rolInContext \roleTypeId roleInstances -> do
    allowed <- lift2 (userType ###>> roleIsInPerspectiveOf (ENR $ EnumeratedRoleType roleTypeId))
    if allowed
      then do
        for_ roleInstances \roleInstance -> do
          addUniverseRoleDelta $ UniverseRoleDelta
            { id: roleInstance
            , roleType: (EnumeratedRoleType roleTypeId)
            , deltaType: Add
            , users: [userId]
            , sequenceNumber: 0
          }
          (PerspectRol{binding, properties}) <- lift2 $ getPerspectRol roleInstance
          addRoleDelta $ RoleBindingDelta
            { id : roleInstance
            , binding: binding
            , oldBinding: Nothing
            , deltaType: Change
            , users: [userId]
            , sequenceNumber: 0
            }
          -- For each set of Property Values, add a RolePropertyDelta if the user may see it.
          forWithIndex_ properties \propertyTypeId values -> do
            propAllowed <- lift2 (userType ###>> propertyIsInPerspectiveOf (ENP (EnumeratedPropertyType propertyTypeId)))
            if propAllowed
              then for_ values \value -> do
                addPropertyDelta $ RolePropertyDelta
                  { id : roleInstance
                  , property: (EnumeratedPropertyType propertyTypeId)
                  , deltaType: Add
                  , value: Just value
                  , users: [userId]
                  , sequenceNumber: 0
                  }
              else pure unit
      else pure unit