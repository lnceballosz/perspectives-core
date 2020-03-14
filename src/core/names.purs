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

module Perspectives.Names

where
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Foreign.Object (Object, fromFoldable, lookup) as OBJ
import Perspectives.CoreTypes (MonadPerspectives)
import Perspectives.Identifiers (deconstructLocalNameFromCurie, deconstructPrefix, isQualifiedWithDomein)
import Perspectives.User (getUserIdentifier)
import Prelude (bind, pure, ($), (<>), (>>=), (<<<))

-----------------------------------------------------------
-- EXPAND DEFAULT NAMESPACES
-----------------------------------------------------------
-- | Replace `sys:User` by `model:Systeem$User` if sys = `model:Systeem`
-- | Replace model:User$Me by "model:User$<guid>$User_0001".
-- | Useful for expanding local names used in bindings, property- and view references.
expandDefaultNamespaces :: String -> MonadPerspectives String
expandDefaultNamespaces n = do
  names <- defaultIndexedNames
  (pure $ expandNamespaces defaultNamespaces n) >>= pure <<< expandIndexedNames names

-- | As expandDefaultNamespaces, but provide both indexed names and namespaces.
expandDefaultNamespaces_ :: OBJ.Object String -> OBJ.Object String -> String -> String
expandDefaultNamespaces_ indexedNames namespaces n = expandIndexedNames indexedNames (expandNamespaces namespaces n)

-- | Replace model:User$Me by "model:User$<guid>$User_0001".
expandIndexedNames :: OBJ.Object String -> String -> String
expandIndexedNames defaults expandedName =
  case OBJ.lookup expandedName defaults of
    (Just ind) -> ind
    Nothing -> expandedName

-- | Replace `sys:User` by `model:Systeem$User` if sys = `model:Systeem`
expandNamespaces :: OBJ.Object String -> String -> String
expandNamespaces namespaces s = if isQualifiedWithDomein s then s else
  case deconstructPrefix s of
    (Just pre) -> do
      case OBJ.lookup pre namespaces of
        (Just modelName) -> case deconstructLocalNameFromCurie s of
          (Just ln) -> (modelName <> "$" <> ln )
          Nothing -> s
        Nothing -> s
    Nothing -> s

defaultNamespaces :: OBJ.Object String
defaultNamespaces = OBJ.fromFoldable
  [ Tuple "cdb" "model:Couchdb"
  , Tuple "sys" "model:System"
  , Tuple "usr" "model:User"
  ]

defaultIndexedNames :: MonadPerspectives (OBJ.Object String)
defaultIndexedNames = do
  user <- getUserIdentifier
  pure $ OBJ.fromFoldable
    [ Tuple "model:User$Me" user
    ]
-----------------------------------------------------------
-- CONVENIENCE NAMESPACE PREFIX FUNCIONS
-----------------------------------------------------------
q :: String -> String
q ln = "model:QueryAst$" <> ln

psp :: String -> String
psp ln = "model:Perspectives$" <> ln
