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

module Perspectives.Representation.InstanceIdentifiers where

import Data.Generic.Rep (class Generic)
import Data.Newtype (class Newtype, unwrap)
import Prelude (class Eq, class Ord, class Show, compare, show, (<<<), (==))
import Simple.JSON (class ReadForeign, class WriteForeign)

newtype ContextInstance = ContextInstance String
derive instance newtypeContextInstance :: Newtype ContextInstance _
derive instance genericRepContextInstance :: Generic ContextInstance _
derive newtype instance writeForeignContextInstance :: WriteForeign ContextInstance
derive newtype instance readForeignContextInstance :: ReadForeign ContextInstance
instance showContextInstance :: Show ContextInstance where
  show = show <<< unwrap
instance eqContextInstance :: Eq ContextInstance where
  eq (ContextInstance id1) (ContextInstance id2) = id1 == id2
instance ordContextInstance :: Ord ContextInstance where
  compare (ContextInstance a) (ContextInstance b) = compare a b

newtype RoleInstance = RoleInstance String
derive instance newtypeRoleInstance :: Newtype RoleInstance _
derive instance genericRepRoleInstance :: Generic RoleInstance _
derive newtype instance writeForeignRoleInstance :: WriteForeign RoleInstance
derive newtype instance readForeignRoleInstance :: ReadForeign RoleInstance
instance showRoleInstance :: Show RoleInstance where
  show = show <<< unwrap
instance eqRoleInstance :: Eq RoleInstance where
  eq (RoleInstance id1) (RoleInstance id2) = id1 == id2
instance ordRoleInstance :: Ord RoleInstance where
  compare (RoleInstance a) (RoleInstance b) = compare a b

newtype Value = Value String
derive instance newtypeValue :: Newtype Value _
derive instance genericRepValue :: Generic Value _
derive newtype instance writeForeignValue :: WriteForeign Value
derive newtype instance readForeignValue :: ReadForeign Value
instance showValue :: Show Value where
  show = show <<< unwrap
instance eqValue :: Eq Value where
  eq (Value id1) (Value id2) = id1 == id2
