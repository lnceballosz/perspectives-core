module Perspectives.PerspectEntiteit where

import Control.Monad.Aff (Aff)
import Control.Monad.Aff.AVar (AVAR, AVar, makeEmptyVar)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Except (runExcept)
import Data.Either (Either)
import Data.Foreign (MultipleErrors)
import Data.Foreign.Class (class Encode, class Decode)
import Data.Foreign.Generic (decodeJSON, encodeJSON)
import Data.Maybe (Maybe)
import Perspectives.ContextAndRole (context_id, context_rev', rol_id, rol_rev')
import Perspectives.DomeinCache (retrieveContextFromDomein, retrieveRolFromDomein)
import Perspectives.GlobalUnsafeStrMap (GLOBALMAP, poke, peek)
import Perspectives.Identifiers (Namespace)
import Perspectives.ResourceTypes (AsyncDomeinFile, contextDefinitions, rolDefinitions)
import Perspectives.Syntax (ID, PerspectContext(..), PerspectRol(..), Revision, revision)
import Prelude (bind, pure, ($), (<<<))

class (Encode a, Decode a) <=  PerspectEntiteit a where
  getRevision :: a -> Revision
  setRevision :: String -> a -> a
  getId :: a -> ID
  -- | Create an empty AVar that will be filled by the PerspectEntiteit.
  representInternally :: forall e. ID -> Aff (avar :: AVAR, gm :: GLOBALMAP | e) (AVar a)
  retrieveInternally :: forall e. ID -> Aff (avar :: AVAR, gm :: GLOBALMAP | e) (Maybe (AVar a))
  -- | A default implementation for encode is encodeJSON.
  encode :: a -> String
  -- | A default implementation for decode is decodeJSON.
  decode :: String -> Either MultipleErrors a
  retrieveFromDomein :: forall e. ID -> Namespace -> AsyncDomeinFile e a

instance perspectEntiteitContext :: PerspectEntiteit PerspectContext where
  getRevision = context_rev'
  setRevision r (PerspectContext c) = PerspectContext c {_rev = revision r}
  getId = context_id
  representInternally c = do
    av <- makeEmptyVar
    _ <- liftEff $ poke contextDefinitions c av
    pure av
  retrieveInternally id = liftEff $ peek contextDefinitions id
  encode = encodeJSON
  decode = runExcept <<< decodeJSON
  retrieveFromDomein = retrieveContextFromDomein

instance perspectEntiteitRol :: PerspectEntiteit PerspectRol where
  getRevision = rol_rev'
  setRevision r (PerspectRol rp) = PerspectRol rp {_rev = revision r}
  getId = rol_id
  representInternally c = do
    av <- makeEmptyVar
    _ <- liftEff $ poke rolDefinitions c av
    pure av
  retrieveInternally id = liftEff $ peek rolDefinitions id
  encode = encodeJSON
  decode = runExcept <<< decodeJSON
  retrieveFromDomein = retrieveRolFromDomein