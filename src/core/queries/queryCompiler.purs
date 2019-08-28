module Perspectives.Query.Compiler where

import Prelude

import Control.Alt ((<|>))
import Control.Monad.Error.Class (throwError)
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.Variant (Variant, inj, on)
import Effect.Exception (error)
import Perspectives.ContextAndRole (context_rolInContext)
import Perspectives.CoreTypes (type (~~>), MonadPerspectives, MP)
import Perspectives.InstanceRepresentation (PerspectContext(..))
import Perspectives.Instances (getPerspectEntiteit)
import Perspectives.Query.QueryTypes (QueryFunctionDescription(..))
import Perspectives.Representation.CalculatedProperty (CalculatedProperty)
import Perspectives.Representation.CalculatedRole (CalculatedRole)
import Perspectives.Representation.Class.PersistentType (getPerspectType)
import Perspectives.Representation.Class.Property (calculation) as PC
import Perspectives.Representation.Class.Role (calculation) as RC
import Perspectives.Representation.EnumeratedProperty (EnumeratedProperty)
import Perspectives.Representation.EnumeratedRole (EnumeratedRole)
import Perspectives.Representation.InstanceIdentifiers (ContextInstance, RoleInstance)
import Perspectives.Representation.QueryFunction (QueryFunction(..))
import Perspectives.Representation.TypeIdentifiers (CalculatedPropertyType(..), CalculatedRoleType(..), EnumeratedPropertyType(..), EnumeratedRoleType(..), RoleType(..))
import Unsafe.Coerce (unsafeCoerce)

compileQuery :: QueryFunctionDescription -> MonadPerspectives (TypedTripleGetter Subject Objects)

-- ROLGETTER
-- TODO: extend for prototypes.
compileQuery (QD _ (RolGetter (ENR r)) _) = pure (f `trackedAs` (unwrap r))
  where
    f :: forall r.
      Variant (context :: ContextInstance | r)
      -> MP (Variant (roles :: Array RoleInstance))
    f v = do
      (mc :: Maybe ContextInstance) <- pure $ (on _context Just \_ -> Nothing) v
      case mc of
        Nothing -> throwError (error "Runtime error: Not a context instance")
        (Just c) -> do
          (ct :: PerspectContext) <- getPerspectEntiteit c
          pure (inj _roles (context_rolInContext ct r))

compileQuery (QD _ (RolGetter (CR cr)) _) = do
  (ct :: CalculatedRole) <- getPerspectType cr
  compileQuery (RC.calculation ct)


-- The last case
compileQuery _ = throwError (error "Unknown QueryFunction expression")

-- From a string that maybe identifies a Property, construct a function to get that property from
-- a Role instance. Notice that this function may fail.
getPropertyFunction ::
  String ->
  MonadPerspectives StringTypedTripleGetter
getPropertyFunction id =
  do
    (p :: EnumeratedProperty) <- getPerspectType (EnumeratedPropertyType id)
    compileQuery $ PC.calculation p
  <|>
  do
    (p :: CalculatedProperty) <- getPerspectType (CalculatedPropertyType id)
    compileQuery $ PC.calculation p

-- From a string that maybe identifies a Role, construct a function to get that role from
-- a Context instance. Notice that this function may fail.
getRoleFunction ::
  String ->
  MonadPerspectives StringTypedTripleGetter
getRoleFunction id =
  do
    (p :: EnumeratedRole) <- getPerspectType (EnumeratedRoleType id)
    compileQuery $ RC.calculation p
  <|>
  do
    (p :: CalculatedRole) <- getPerspectType (CalculatedRoleType id)
    compileQuery $ RC.calculation p
