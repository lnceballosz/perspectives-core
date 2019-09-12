module Perspectives.Types.ObjectGetters where

-- | If a role with the given qualified name is available, return it as a RoleType. From the type we can find out its RoleKind, too.
import Perspectives.CoreTypes (MonadPerspectives, type (~~~>))
import Perspectives.DependencyTracking.Array.Trans (ArrayT(..))
import Perspectives.Identifiers (isContainingNamespace)
import Perspectives.Instances.Combinators (closure_, filter')
import Perspectives.Representation.Class.PersistentType (getPerspectType)
import Perspectives.Representation.Class.Role (class RoleClass, properties, roleAspects)
import Perspectives.Representation.Context (Context, aspects, roleInContext) as Context
import Perspectives.Representation.EnumeratedRole (EnumeratedRole)
import Perspectives.Representation.TypeIdentifiers (ContextType, EnumeratedRoleType, PropertyType, RoleType, propertytype2string, roletype2string)
import Prelude (pure, (==), (>>>), (<<<), (>=>))

-- | If a role with the given qualified name is available, return it as a RoleType. From the type we can find out its RoleKind, too.
lookForRoleType :: String -> (ContextType ~~~> RoleType)
lookForRoleType s = lookForRole (roletype2string >>> ((==) s))

-- | We simply require the Pattern to match the end of the string.
lookForUnqualifiedRoleType :: String -> ContextType ~~~> RoleType
lookForUnqualifiedRoleType s = lookForRole (roletype2string >>> isContainingNamespace s)

lookForRole :: (RoleType -> Boolean) -> ContextType ~~~> RoleType
lookForRole criterium = filter' (contextAspectsClosure >=> roleInContext) criterium

roleInContext :: ContextType ~~~> RoleType
roleInContext = ArrayT <<< ((getPerspectType :: ContextType -> MonadPerspectives Context.Context) >=> pure <<< Context.roleInContext)

contextAspectsClosure :: ContextType ~~~> ContextType
contextAspectsClosure = closure_ f where
  f :: ContextType -> ArrayT MonadPerspectives ContextType
  f = ArrayT <<< ((getPerspectType :: ContextType -> MonadPerspectives Context.Context) >=> pure <<< Context.aspects)

lookForPropertyType :: forall r i. RoleClass r i => String -> (i ~~~> PropertyType)
lookForPropertyType s = lookForProperty (propertytype2string >>> ((==) s))

-- | We simply require the Pattern to match the end of the string.
lookForUnqualifiedPropertyType :: forall r i. RoleClass r i => String -> (i ~~~> PropertyType)
lookForUnqualifiedPropertyType s = lookForProperty (propertytype2string >>> isContainingNamespace s)

lookForProperty :: forall r i. RoleClass r i => (PropertyType -> Boolean) -> i ~~~> PropertyType
lookForProperty criterium = filter' (roleAspectsClosure >=> propertyOfRole) criterium

propertyOfRole :: forall r i. RoleClass r i => i ~~~> PropertyType
propertyOfRole = ArrayT <<< ((getPerspectType :: i -> MonadPerspectives r) >=> properties)

roleAspectsClosure :: forall r i. RoleClass r i => i ~~~> EnumeratedRoleType
roleAspectsClosure = g >=> closure_ f where
  f :: EnumeratedRoleType -> ArrayT MonadPerspectives EnumeratedRoleType
  f = ArrayT <<< ((getPerspectType :: EnumeratedRoleType -> MonadPerspectives EnumeratedRole) >=> roleAspects)

  g :: i ~~~> EnumeratedRoleType
  g = ArrayT <<< ((getPerspectType :: i -> MonadPerspectives r) >=> roleAspects)
