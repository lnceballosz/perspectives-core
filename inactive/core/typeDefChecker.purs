module Perspectives.TypeDefChecker (checkContext, checkModel, getPropertyFunction, checkDomeinFile)

where

import Control.Monad.Eff.Exception (error)
import Control.Monad.Error.Class (throwError)
import Control.Monad.Writer (WriterT, execWriterT, lift, tell)
import Data.Argonaut.Core (fromString)
import Data.Argonaut.Decode (decodeJson)
import Data.Array (elemIndex, head, length)
import Data.DateTime.ISO (ISO)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.Number (fromString) as Nmb
import Data.StrMap (keys)
import Data.Traversable (for_, traverse)
import Perspectives.TypeChecker (contextHasType)
import Perspectives.CoreTypes (MP, MonadPerspectives, MonadPerspectivesQuery, Triple(..), TypeID, TypedTripleGetter, UserMessage(..), mtripleObject, runMonadPerspectivesQueryCompiler, tripleObject, tripleObjects, (%%>>), (@@), (@@=), (@@>))
import Perspectives.DataTypeObjectGetters (internePropertyTypen, propertyTypen, rolType)
import Perspectives.DataTypeTripleGetters (bindingM, contextM, contextTypeM, typeVanIedereRolInContextM)
import Perspectives.DomeinCache (retrieveDomeinFile)
import Perspectives.DomeinFile (DomeinFile(..))
import Perspectives.Effects (AjaxAvarCache)
import Perspectives.EntiteitAndRDFAliases (ContextID, ID, RolID, RolName, PropertyName)
import Perspectives.Identifiers (binnenRol, buitenRol)
import Perspectives.ModelBasedTripleGetters (aspectenDefM, aspectRollenDefM, aspectenDefMClosure, externePropertiesDefM, internePropertiesDefM, ownExternePropertiesDefM, ownInternePropertiesDefM, rollenDefM, contextDefM, propertyIsFunctioneelM, bindingDefM, rolIsVerplichtM, rangeDefM, propertyIsVerplichtM, propertiesDefM)
import Perspectives.ObjectGetterConstructors (getRolUsingAspects)
import Perspectives.QueryAST (ElementaryQueryStep(..))
import Perspectives.QueryCombinators (toBoolean)
import Perspectives.QueryCompiler (constructQueryFunction)
import Perspectives.QueryFunctionDescriptionCompiler (compileElementaryQueryStep)
import Perspectives.RunMonadPerspectivesQuery (runMonadPerspectivesQuery, (##=), (##>))
import Perspectives.TripleGetterComposition ((>->))
import Perspectives.Utilities (ifNothing)
import Prelude (Unit, bind, const, discard, ifM, pure, show, unit, void, ($), (<), (<<<), (<>), (>>=), (>=>))

type TDChecker e = WriterT (Array UserMessage) (MonadPerspectivesQuery e)

checkDomeinFile :: forall e. DomeinFile -> MonadPerspectivesQuery (AjaxAvarCache e) (Array UserMessage)
checkDomeinFile (DomeinFile{contexts}) = execWriterT $ for_ (keys contexts) checkContext'

checkModel :: forall e. ContextID -> MP e (Array UserMessage)
checkModel modelId = runMonadPerspectivesQuery modelId (lift <<< retrieveDomeinFile >=> checkDomeinFile)

-- | `psp:ContextInstance -> psp:ElkType`
checkContext :: forall e. ContextID -> MP e (Array UserMessage)
checkContext cid = runMonadPerspectivesQuery cid \x -> execWriterT $ checkContext' x

-- TODO. CONTROLEER RECURSIEF DE AAN ROLLEN GEBONDEN CONTEXTEN.
-- | `psp:ContextInstance -> psp:ElkType`
checkContext' :: forall e. ContextID -> TDChecker (AjaxAvarCache e) Unit
checkContext' cid = do
  ifNothing (lift (cid @@> contextTypeM))
    (tell [MissingType cid])
    -- tp is psp:Context
    \tp -> do
      checkProperties tp cid
      checkDefinedRoles tp cid
      checkAvailableRoles tp cid
      -- if this psp:ContextInstance represents a psp:Rol, and if it has an instance
      -- of $aspectRol, check whether its namespace giving context has that Aspect.
      -- TODO: move to checkDefinedRoles. Each instance of psp:Rol (that is, each RolDef) is always defined in context.
      b <- (lift $ lift $ (cid `contextHasType` "model:Perspectives$Rol"))
      if b
        then (checkAspectOfRolType cid)
        else (pure unit)
      checkCyclicAspects cid

-- | `psp:Context -> psp:ContextInstance -> psp:ElkType`
checkProperties :: forall e. TypeID -> ContextID -> TDChecker (AjaxAvarCache e) Unit
checkProperties typeId cid = do
  void $ (typeId ~> ownInternePropertiesDefM) >>= (traverse (checkInternalProperty cid))
  -- TODO: PROBEER de binnenrol op dezelfde manier te checken als de buitenrol.

  void $ (typeId ~> ownExternePropertiesDefM) >>= (traverse (comparePropertyInstanceToDefinition cid (buitenRol cid)))

  definedExternalProperties <- lift $ lift (typeId ##= externePropertiesDefM)
  availableExternalProperties <- lift $ lift $ propertyTypen (buitenRol cid)
  checkAvailableProperties (buitenRol cid) typeId availableExternalProperties definedExternalProperties cid

  definedInternalProperties <- lift $ lift (typeId ##= internePropertiesDefM)
  availableInternalProperties <- lift $ lift $ internePropertyTypen cid
  checkAvailableProperties (binnenRol cid) typeId availableInternalProperties definedInternalProperties cid

get :: forall e. TypeID -> TypedTripleGetter e -> TDChecker (AjaxAvarCache e) (Array ID)
get typeId tg = lift $ (typeId @@ tg) >>= pure <<< tripleObjects

infix 0 get as ~>

-- | For each Rol that is defined for this type of Context, is the instance of that Rol
-- | in accordance to its definition?
-- | `psp:Context -> psp:ContextInstance -> psp:ElkType`
checkDefinedRoles :: forall e. TypeID -> ContextID -> TDChecker (AjaxAvarCache e) Unit
checkDefinedRoles typeId cid = do
  definedRollen <- lift $ lift (typeId ##= rollenDefM)
  void $ traverse (compareRolInstancesToDefinition cid) definedRollen
  -- TODO: add the check checkAspectOfRolType

-- | For each RolInstance in the ContextInstance, is there a Rol defined with the Context?
-- | `psp:Context -> psp:ContextInstance -> psp:ElkType`
checkAvailableRoles :: forall e. TypeID -> ContextID -> TDChecker (AjaxAvarCache e) Unit
checkAvailableRoles typeId cid = do
  availableRoles <- lift (cid @@= typeVanIedereRolInContextM)
  for_ availableRoles isDefined
  where
    -- `psp:Context -> psp:Rol -> Unit`
    isDefined :: RolName -> TDChecker (AjaxAvarCache e) Unit
    isDefined rolType = do
      definedRollen <- lift $ lift $ (typeId ##= rollenDefM)
      case elemIndex rolType definedRollen of
        Nothing -> tell [RolNotDefined rolType cid typeId]
        otherwise -> pure unit

-- | Does the type hold a definition for all properties given to the RolInstantie?
-- | `psp:BinnenRolInstance -> psp:Context -> Array psp:Property -> Array psp:Property -> psp:ElkType`
checkAvailableProperties :: forall e. RolID -> TypeID -> Array PropertyName -> Array PropertyName -> ContextID -> TDChecker (AjaxAvarCache e) Unit
checkAvailableProperties rolId contextId availableProperties definedProperties cid = do
  for_ availableProperties isDefined
  where
    isDefined :: PropertyName -> TDChecker (AjaxAvarCache e) Unit
    isDefined propertyName =
      case elemIndex propertyName definedProperties of
        Nothing -> tell [PropertyNotDefined cid propertyName rolId contextId]
        otherwise -> pure unit

-- To check:
--  * if the property is mandatory, is it present?
--  * guess the type of the property value of the given name. Does it have the range as Aspect?
--  * if the property is functional, not more than one value may be present.
-- `psp:ContextInstance -> psp:Property -> psp:ElkType`
checkInternalProperty :: forall e. ContextID -> TypeID -> TDChecker e Unit
-- TODO: schrijf deze functie!
checkInternalProperty cid propertyType = pure unit

-- | If the Property is mandatory and missing, adds a message.
-- | Checks the value of the Property with the range that has been defined.
-- | If the Property is functional and more than one value has been given, adds a message.
-- | `psp:ContextInstance -> psp:RolInstance -> psp:Property -> psp:ElkType`
comparePropertyInstanceToDefinition :: forall e. ContextID -> RolID -> TypeID -> TDChecker (AjaxAvarCache e) Unit
comparePropertyInstanceToDefinition cid rid propertyType = do
  rolType <- lift $ lift (rid %%>> rolType)
  (propertyGetter :: TypedTripleGetter e) <- lift $ lift $ getPropertyFunction propertyType rolType
  (Triple {object}) <- lift (rid @@ propertyGetter)
  pure unit
  case head object of
    Nothing -> ifM (lift $ propertyIsMandatory propertyType)
      (tell [MissingPropertyValue cid propertyType rid])
      (pure unit)
    (Just propertyValue) -> do
      mrange <- lift (propertyType @@> rangeDefM)
      case mrange of
        Nothing -> pure unit -- There should be a range, however, we protect this function from failing on it.
        (Just sv) -> ifM (tryParseSimpleValue sv propertyValue)
          (pure unit)
          (tell [IncorrectPropertyValue cid propertyType sv propertyValue])
      if length object < 2
        then pure unit
        else ifM (lift $ propertyIsFunctional propertyType)
          (tell [TooManyPropertyValues cid propertyType])
          (pure unit)

  where

    tryParseSimpleValue :: TypeID -> String -> TDChecker (AjaxAvarCache e) Boolean
    tryParseSimpleValue sv propertyValue = case sv of
      "model:Perspectives$Number" -> pure $ maybe false (const true) (Nmb.fromString propertyValue)
      "model:Perspectives$Boolean" -> case propertyValue of
        "true" -> pure true
        "false" -> pure true
        otherwise -> pure false
      "model:Perspectives$Date" -> -- Dates *should* be represented as ISO strings.
        case decodeJson $ fromString propertyValue of
          (Left err :: Either String ISO) -> pure false
          (Right iso :: Either String ISO) -> pure true
      otherwise -> pure true

-- Returns a getter, lookup function or compiled query.
-- `Property -> Rol -> (RolInstance -> PropertyValue)`
getPropertyFunction :: forall e. PropertyName -> RolName -> MonadPerspectives (AjaxAvarCache e) (TypedTripleGetter e)
getPropertyFunction pn rn = do
  r <- runMonadPerspectivesQueryCompiler rn (compileElementaryQueryStep (QualifiedProperty pn) (pn <> "_getter"))
  case r of
    (Left m) -> throwError $ error $ show m
    (Right descriptionId) -> constructQueryFunction descriptionId

-- | For this Rol (definition), looks for an instance of it in the ContextInstance.
-- | Compares that RolInstance to its definition:
-- |  1. Checks each defined property with the instance of the rol.
-- |  2. Checks the type of the binding, if given.
-- | Finally, ff the Rol is mandatory and missing, adds a message.
-- | `psp:ContextInstance -> psp:Rol -> psp:ElkType`
compareRolInstancesToDefinition :: forall e. ContextID -> TypeID -> TDChecker (AjaxAvarCache e) Unit
compareRolInstancesToDefinition cid rolType' = do
  rolInstances <- lift $ lift $ getRolUsingAspects rolType' cid -- TODO: rolType' is een gekwalificeerde naam. Je kunt hier volstaan met getRol.
  -- (Triple {object:rolInstances}) <- lift (cid @@ rolGetter) -- TODO: kijk ook bij de aspectRollenDefMClosure!
  case head rolInstances of
    Nothing -> ifM (lift (rolIsMandatory rolType'))
      (tell [MissingRolInstance rolType' cid])
      (pure unit)
    otherwise -> void $ traverse compareRolInstanceToDefinition rolInstances
  where
    -- `psp:RolInstance -> Unit`
    compareRolInstanceToDefinition :: RolID -> TDChecker (AjaxAvarCache e) Unit
    compareRolInstanceToDefinition rolId = do
      -- Check the properties.
      propertyDef' <- lift $ (rolType' @@= propertiesDefM)
      void $ (traverse (comparePropertyInstanceToDefinition cid rolId)) propertyDef'

      -- Detect used but undefined properties.
      definedRolProperties <- lift $ lift $ (rolType' ##= propertiesDefM)
      availableProperties <- lift $ lift $ propertyTypen rolId
      checkAvailableProperties rolId rolType' availableProperties definedRolProperties cid

      -- check the binding. Does the binding have the type given by bindingDefM, or has its type that Aspect?
      -- Note that we work on type level. So the theBinding is a Context describing a type of Rol.
      -- TODO: moeten we hier niet iets met de roltelescoop?
      -- Notice that the binding may not exist!
      maybeBinding <- lift (rolId @@ bindingM >-> contextM)
      case mtripleObject maybeBinding of
        Nothing -> pure unit
        (Just theBinding) -> do
          mmb <- lift (rolType' @@> bindingDefM)
          case mmb of
            Nothing -> pure unit
            (Just toegestaneBinding) -> do
              ifM (lift $ lift $ contextHasType theBinding toegestaneBinding)
                (pure unit)
                (do
                  typeOfTheBinding <- lift (theBinding @@ contextTypeM)
                  (tell [IncorrectBinding cid rolId theBinding (tripleObject typeOfTheBinding) toegestaneBinding]))

-- Check the aspectRol, if any. Is it bound to a Rol of an Aspect?
-- | The first parameter is bound to a psp:ContextInstance that represents (describes) a psp:Rol.
-- | This function checks the eventual aspectRol instances given in that description.
-- | If such an aspectRol is not a Rol of one of the Aspecten of the Description of the Context that holds
-- | the psp:Rol description, it returns a warning.
-- | psp:Rol -> psp:Context -> psp:ElkType`
checkAspectOfRolType :: forall e. ContextID -> TDChecker (AjaxAvarCache e) Unit
checkAspectOfRolType cid = do
  ctypeArr <- lift $ lift (cid ##> contextDefM)
  case ctypeArr of
    Nothing -> tell [RolWithoutContext cid]
    (Just ctype) -> do
      mar <- lift $ lift (cid ##= aspectRollenDefM)
      case head mar of -- TODO: nu wordt gecontroleerd voor één aspectRol, maar er kunnen er meer zijn.
        Nothing -> pure unit
        (Just aspectRol) -> do
          aspectRollen <- lift $ lift $ (ctype ##= aspectenDefM >-> rollenDefM)
          if isJust $ elemIndex aspectRol aspectRollen
            then pure unit
            else tell [AspectRolNotFromAspect cid aspectRol ctype]

-- | `psp:ContextInstance -> psp:ElkType`
checkCyclicAspects :: forall e. ContextID -> TDChecker (AjaxAvarCache e) Unit
checkCyclicAspects cid = do
  aspects <- lift $ lift (cid ##= aspectenDefMClosure)
  case elemIndex cid aspects of
    Nothing -> pure unit
    otherwise -> tell [CycleInAspects cid aspects]

rolIsMandatory :: forall e. RolID -> MonadPerspectivesQuery (AjaxAvarCache e) Boolean
rolIsMandatory = toBoolean rolIsVerplichtM

propertyIsMandatory :: forall e. RolID -> MonadPerspectivesQuery (AjaxAvarCache e) Boolean
propertyIsMandatory = toBoolean propertyIsVerplichtM

propertyIsFunctional :: forall e. RolID -> MonadPerspectivesQuery (AjaxAvarCache e) Boolean
propertyIsFunctional = toBoolean propertyIsFunctioneelM