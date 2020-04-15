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

-- | This module defines External Core functions for model:Couchdb.

module Perspectives.Instances.Indexed where

import Control.Monad.AvarMonadAsk (get) as AMA
import Control.Monad.Error.Class (throwError)
import Data.Array (foldl, head)
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.String (Pattern(..), Replacement(..), replaceAll)
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..))
import Effect.Exception (error)
import Foreign.Object (Object, fromFoldable, keys)
import Foreign.Object.Unsafe (unsafeIndex)
import Perspectives.ContextAndRole (rol_binding, rol_property)
import Perspectives.CoreTypes (MonadPerspectives, (##=), (##>))
import Perspectives.Identifiers (qualifyWith, unsafeDeconstructModelName)
import Perspectives.Instances.ObjectGetters (binding, context, getRole)
import Perspectives.Persistent (getPerspectRol)
import Perspectives.Representation.InstanceIdentifiers (ContextInstance, RoleInstance, Value(..))
import Perspectives.Representation.TypeIdentifiers (EnumeratedPropertyType(..), EnumeratedRoleType(..))
import Prelude (bind, pure, ($), (<>), (>=>), (>>=))

-- | Replace any occurrence of any indexed name in the string.
replaceIndexedNames :: String -> MonadPerspectives String
replaceIndexedNames s = do
  {indexedRoles:roleReplacements, indexedContexts:contextReplacements} <- AMA.get
  s' <- pure $ foldl (\(crl_ :: String) iname -> replaceAll (Pattern iname) (Replacement $ unwrap $ unsafeIndex roleReplacements iname) crl_) s (keys roleReplacements)
  pure $ foldl (\(crl_ :: String) iname -> replaceAll (Pattern iname) (Replacement $ unwrap $ unsafeIndex contextReplacements iname) crl_) s' (keys contextReplacements)

-- | From an instance of sys:Model$External, return combinations of the indexed name and the private role instance.
indexedRoles :: RoleInstance -> MonadPerspectives (Object RoleInstance)
indexedRoles modelDescription = (modelDescription ##= context >=> getRole (EnumeratedRoleType "model:System$Model$IndexedRole")) >>= indexedRoles_

indexedRoles_ :: Array RoleInstance -> MonadPerspectives (Object RoleInstance)
indexedRoles_ roleIds = do
  rows <- traverse f roleIds
  pure $ fromFoldable rows
  where
    f :: RoleInstance -> MonadPerspectives (Tuple String RoleInstance)
    f roleId = do
      r <- getPerspectRol roleId
      case rol_binding r of
        Nothing -> throwError (error ("An instance of sys:Model$IndexedRole has no binding: " <> unwrap roleId))
        Just b -> case head $ rol_property r (EnumeratedPropertyType "model:System$Model$IndexedRole$Name") of
          Nothing -> throwError (error ("An instance of sys:Model$IndexeRole$Name has no value: " <> unwrap roleId))
          Just (Value iname) -> pure (Tuple (qualifyWith (unsafeDeconstructModelName $ unwrap b) iname) b)

-- | From an instance of sys:Model$External, return combinations of the indexed name and the private role instance.
indexedContexts :: RoleInstance -> MonadPerspectives (Object ContextInstance)
indexedContexts modelDescription = (modelDescription ##= context >=> getRole (EnumeratedRoleType "model:System$Model$IndexedContext")) >>= indexedContexts_

indexedContexts_ :: Array RoleInstance -> MonadPerspectives (Object ContextInstance)
indexedContexts_ externalRoleIds = do
  rows <- traverse f externalRoleIds
  pure $ fromFoldable rows
  where
    f :: RoleInstance -> MonadPerspectives (Tuple String ContextInstance)
    f roleId = do
      r <- getPerspectRol roleId
      case head $ rol_property r (EnumeratedPropertyType "model:System$Model$IndexedContext$Name") of
        Nothing -> throwError (error ("An instance of sys:Model$IndexeContext$Name has no value: " <> unwrap roleId))
        Just (Value iname) -> do
          mcontextId <- roleId ##> binding >=> context
          case mcontextId of
            Nothing -> throwError (error ("An instance of sys:Model$IndexeContext has no context bound to it: " <> unwrap roleId))
            Just c -> pure (Tuple (qualifyWith (unsafeDeconstructModelName $ unwrap c) iname) c)