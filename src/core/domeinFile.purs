module Perspectives.DomeinFile where

import Data.Foreign.Class (class Encode)
import Data.Foreign.Generic (defaultOptions, genericDecode, genericEncode)
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, empty, insert)
import Data.Tuple (Tuple(..))
import Network.HTTP.Affjax.Response (class Respondable, ResponseType(..))
import Perspectives.Syntax (PerspectContext(..), PerspectRol(..), Revision, noRevision, toRevision)
import Prelude (($))

newtype DomeinFile = DomeinFile
  { _rev :: Revision
  , _id :: String
  , contexts :: DomeinFileContexts
  , roles ::DomeinFileRoles
  }

derive instance genericDomeinFile :: Generic DomeinFile _

instance encodeDomeinFile :: Encode DomeinFile where
  encode = genericEncode $ defaultOptions {unwrapSingleConstructors = true}

instance respondableDomeinFile :: Respondable DomeinFile where
  responseType = Tuple Nothing JSONResponse
  fromResponse = genericDecode $ defaultOptions {unwrapSingleConstructors = true}

defaultDomeinFile :: DomeinFile
defaultDomeinFile = DomeinFile{ _rev: noRevision, _id: "", contexts: empty, roles: empty}

-- | DomeinFileContexts is an immutable map of resource type names to PerspectContexts.
type DomeinFileContexts = StrMap PerspectContext

type DomeinFileRoles = StrMap PerspectRol

-- The same context may be inserted multiple times without consequence; it is an idempotent operation.
addContextToDomeinFile :: PerspectContext -> DomeinFile -> DomeinFile
addContextToDomeinFile c@(PerspectContext {_id}) (DomeinFile dff@{contexts}) = DomeinFile dff {contexts = insert _id c contexts}

addRolToDomeinFile :: PerspectRol -> DomeinFile -> DomeinFile
addRolToDomeinFile c@(PerspectRol {_id}) (DomeinFile dff@{roles}) = DomeinFile dff {roles = insert _id c roles}

setRevision :: String -> DomeinFile -> DomeinFile
setRevision vs (DomeinFile dff) = DomeinFile $ dff {_rev = toRevision $ Just vs}
