module Perspectives.TypeDefChecker where

import Control.Monad.Writer (WriterT, lift, tell)
import Data.Traversable (traverse)
import Perspectives.CoreTypes (MP, TypeID, TypedTripleGetter, UserMessage(..), runMonadPerspectivesQuery, tripleGetter2function, tripleObjects, (##))
import Perspectives.EntiteitAndRDFAliases (ContextID, ID)
import Perspectives.SystemQueries (contextExternePropertyTypes, contextInternePropertyTypes, contextRolTypes, contextType)
import Perspectives.Utilities (ifNothing)
import Prelude (Unit, pure, unit, ($), (*>), (>>=), (<<<), (<>), discard, void)

type TDChecker e = WriterT (Array UserMessage) (MP e)

checkContext :: forall e. ContextID -> TDChecker e Unit
checkContext cid = do
  ifNothing (lift $ runMonadPerspectivesQuery cid (tripleGetter2function contextType))
    (tell [MissingType cid])
    \tp -> checkProperties tp cid *> checkRoles tp cid

checkProperties :: forall e. TypeID -> ContextID -> TDChecker e Unit
checkProperties typeId cid = do
  void $ (get contextInternePropertyTypes) >>= (traverse (checkInternalProperty cid))
  -- TODO: Each internal property must be defined.
  void $ (get contextExternePropertyTypes) >>= (traverse (checkProperty (cid <> "_buitenRol")))
  -- TODO: Each external property must be defined.
  where
    get :: TypedTripleGetter e -> TDChecker e (Array ID)
    get tg = lift $ (typeId ## tg) >>= pure <<< tripleObjects

checkRoles :: forall e. TypeID -> ContextID -> TDChecker e Unit
checkRoles typeId cid =
  void $ (lift $ (typeId ## contextRolTypes) >>= pure <<< tripleObjects) >>=
    (traverse (checkRol cid))
  -- TODO: each role must be defined. This involves a check the other way round.

-- Note: properties can be mandatory
checkInternalProperty :: forall e. ContextID -> TypeID -> TDChecker e Unit
checkInternalProperty cid propertyType = pure unit

-- Note: properties can be mandatory.
checkProperty :: forall e. ContextID -> TypeID -> TDChecker e Unit
checkProperty cid propertyType = pure unit

-- Note: roles can be mandatory.
checkRol :: forall e. ContextID -> TypeID -> TDChecker e Unit
checkRol cid rolType = pure unit
