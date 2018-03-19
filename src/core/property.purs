module Perspectives.Property where

import Data.Array (nub, singleton)
import Data.Array.Partial (head) as ArrayPartial
import Data.Maybe (Maybe(..), maybe)
import Data.StrMap (keys, lookup, values)
import Partial.Unsafe (unsafePartial)
import Perspectives.ContextAndRole (context_binnenRol, context_buitenRol, context_displayName, context_id, context_pspType, context_rolInContext, rol_binding, rol_context, rol_id, rol_properties, rol_pspType)
import Perspectives.Effects (AjaxAvarCache)
import Perspectives.EntiteitAndRDFAliases (ID, PropertyName, RolName, ContextID)
import Perspectives.Identifiers (LocalName, deconstructNamespace)
import Perspectives.PerspectivesState (MonadPerspectives)
import Perspectives.Resource (getPerspectEntiteit)
import Perspectives.Syntax (PerspectContext, PerspectRol(..), PropertyValueWithComments(..), propertyValue)
import Prelude (bind, id, join, pure, ($), (<>), (==))


{-
Property values are represented by Arrays.
We need functions that give us an array of values for a given property for a given resource.
-}

type ObjectsGetter e = ID -> MonadPerspectives (AjaxAvarCache e) (Array String)

type ObjectGetter e = ID -> MonadPerspectives (AjaxAvarCache e) String

getContextMember :: forall e. (PerspectContext -> Array String) -> ObjectsGetter e
getContextMember f c = do
  maybeContext <- getPerspectEntiteit c
  case maybeContext of
    (Just perspectContext) -> pure $ f perspectContext
    otherwise -> pure []

-- Even though members of a context will always be present, the context itself may not. Hence we return a Maybe value.
getContextMember' :: forall a e. (PerspectContext -> a) -> (ID -> MonadPerspectives (AjaxAvarCache e) (Maybe a))
getContextMember' f c = do
  maybeContext <- getPerspectEntiteit c
  case maybeContext of
    (Just perspectContext) -> pure $ Just $ f perspectContext
    otherwise -> pure Nothing

getContextType :: forall e. ObjectsGetter e
getContextType = getContextMember \context -> [context_pspType context]

-- Returns an empty array if the context does not exist.
getBuitenRol :: forall e. ObjectsGetter e
getBuitenRol = getContextMember \c -> [context_buitenRol c]

-- Returns Nothing if the context does not exist.
getBuitenRol' :: forall e. ID -> MonadPerspectives (AjaxAvarCache e) (Maybe String)
getBuitenRol' = getContextMember' \c -> context_buitenRol c

getRol :: forall e. RolName -> ObjectsGetter e
getRol rn = getContextMember \context -> maybe [] id (lookup rn (context_rolInContext context))

rolNameInContext :: LocalName -> ContextID -> RolName
rolNameInContext ln contextId = (maybe "" id (deconstructNamespace contextId)) <> "$" <> ln

getRolByLocalName :: forall e. RolName -> ObjectsGetter e
getRolByLocalName rn = getContextMember \context -> maybe [] id (lookup (rolNameInContext rn (context_id context)) (context_rolInContext context))

getRolFromContextTypeHierarchy :: forall e. LocalName -> ObjectsGetter e
getRolFromContextTypeHierarchy ln contextId = do
  maybeContext <- getPerspectEntiteit contextId
  case maybeContext of
    (Just perspectContext) -> case lookup localNameInContextNamespace (context_rolInContext perspectContext) of
      Nothing -> if (contextId == context_pspType perspectContext)
        then pure []
        else getRolFromContextTypeHierarchy ln (context_pspType perspectContext)
      (Just value) -> pure value
    otherwise -> pure []
  where
    localNameInContextNamespace :: ID
    localNameInContextNamespace = (maybe "" id (deconstructNamespace contextId)) <> "$" <> ln

getRollen :: forall e. ObjectsGetter e
getRollen = getContextMember \context -> nub $ join $ values (context_rolInContext context)

getRolTypen :: forall e. ObjectsGetter e
getRolTypen = getContextMember \context -> keys (context_rolInContext context)

getDisplayName :: forall e. ObjectsGetter e
getDisplayName = getContextMember \context -> [(context_displayName context)]

getExternalProperty :: forall e. PropertyName -> ObjectsGetter e
getExternalProperty pn id = do
  mbr <- getBuitenRol' id
  case mbr of
    Nothing -> pure []
    (Just br) -> getProperty pn br

-- | Look up a local name in the rol telescope of the buitenrol.
lookupExternalProperty :: forall e. LocalName -> ObjectsGetter e
lookupExternalProperty pn id = getPropertyFromRolTelescope pn $ id <> "_buitenRol"

getInternalProperty :: forall e. PropertyName -> ObjectsGetter e
getInternalProperty pn ident = do
  (mbr :: Maybe PerspectRol) <- getContextMember' context_binnenRol ident
  case mbr of
    Nothing -> pure []
    -- TODO: vervang de pattern matching zodra binnenRol een 'echte' rol is.
    (Just rol) -> pure $ (maybe [] propertyValue) (lookup pn (rol_properties rol))

-- | Look up a local name in the rol telescope of the binnenrol.
lookupInternalProperty :: forall e. LocalName -> ObjectsGetter e
lookupInternalProperty pn id = do
  maybeBinnenRol <- getContextMember' context_binnenRol id
  case maybeBinnenRol of
    Nothing -> pure []
    (Just binnenRol) -> getPropertyFromRolTelescope' pn binnenRol

getRolMember :: forall e. (PerspectRol -> Array String) -> ObjectsGetter e
getRolMember f c = do
  maybeRol <- getPerspectEntiteit c
  case maybeRol of
    (Just perspectRol) -> pure $ f perspectRol
    otherwise -> pure []

getRolType :: forall e. ObjectsGetter e
getRolType = getRolMember \rol -> [rol_pspType rol]

getRolBinding :: forall e. ObjectsGetter e
getRolBinding = getRolMember \rol -> maybe [] singleton (rol_binding rol)

getGebondenAls :: forall e. RolName -> ObjectsGetter e
getGebondenAls rname = getRolMember \(PerspectRol{gevuldeRollen}) -> maybe [] id (lookup rname gevuldeRollen)

getRolContext :: forall e. ObjectsGetter e
getRolContext = getRolMember \rol -> [rol_context rol]

getProperty :: forall e. PropertyName -> ObjectsGetter e
getProperty pn = getRolMember \rol -> maybe [] propertyValue (lookup pn (rol_properties rol))

getPropertyFromRolTelescope :: forall e. LocalName -> ObjectsGetter e
getPropertyFromRolTelescope ln rolId = do
  maybeRol <- getPerspectEntiteit rolId
  case maybeRol of
    (Just perspectRol) -> getPropertyFromRolTelescope' ln perspectRol
    otherwise -> pure []

getPropertyFromRolTelescope' :: forall e. LocalName -> PerspectRol -> MonadPerspectives (AjaxAvarCache e) (Array String)
getPropertyFromRolTelescope' ln perspectRol =
  case lookup localNameInRolNamespace (rol_properties perspectRol) of
    Nothing -> case rol_binding perspectRol of
      Nothing -> pure []
      (Just i) -> if i == (rol_id perspectRol)
        then pure []
        else getPropertyFromRolTelescope ln i
    (Just (PropertyValueWithComments{value})) -> pure value
  where
    localNameInRolNamespace :: ID
    localNameInRolNamespace = (maybe "" id (deconstructNamespace (rol_id perspectRol))) <> "$" <> ln

-- | Some ObjectsGetters will return an array with a single ID. Some of them represent contexts (such as the result
-- | of getRolContext), others roles (such as the result of getRolBinding). The Partial function below returns that
-- | single ID instead of the Array holding it, effectively turning an ObjectsGetter into an ObjectGetter.
toSingle :: forall e. Partial => ObjectsGetter e -> ObjectGetter e
toSingle og id = do
  (ar :: Array String) <- og id
  pure $ ArrayPartial.head ar

getRolBinding' :: forall e. ObjectGetter e
getRolBinding' = unsafePartial $ toSingle getRolBinding