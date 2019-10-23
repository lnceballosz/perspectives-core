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

module Perspectives.SetupUser where

import Data.Maybe (Maybe(..))
import Perspectives.CoreTypes (MonadPerspectives)
import Perspectives.InstanceRepresentation (PerspectContext)
import Perspectives.Instances (tryGetPerspectEntiteit)
import Perspectives.LoadCRL (loadCRLFile)
import Perspectives.Representation.InstanceIdentifiers (ContextInstance(..))
import Prelude (Unit, bind, pure, unit, void, ($))

setupUser :: MonadPerspectives Unit
setupUser = do
  (mu :: Maybe PerspectContext) <- tryGetPerspectEntiteit (ContextInstance "model:User$MijnSysteem")
  case mu of
    Nothing -> void $ loadCRLFile "systeemInstanties.crl"
    otherwise -> pure unit
