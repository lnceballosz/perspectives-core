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

module Perspectives.Parsing.Arc.PhaseTwo where

import Perspectives.Parsing.Arc.PhaseTwoDefs

import Control.Monad.Except (throwError)
import Data.Array (cons, elemIndex, fromFoldable)
import Data.Char.Unicode (toLower)
import Data.Foldable (foldl)
import Data.Lens (over)
import Data.Lens.Record (prop)
import Data.List (List(..), filter, findIndex, foldM, head, null, (:), length)
import Data.Maybe (Maybe(..), fromJust, isJust)
import Data.Newtype (unwrap)
import Data.String (Pattern(..), Replacement(..), replace)
import Data.String.CodeUnits (fromCharArray, uncons)
import Data.Symbol (SProxy(..))
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..))
import Foreign.Object (insert, lookup)
import Partial.Unsafe (unsafePartial)
import Perspectives.DomeinFile (DomeinFile(..), DomeinFileRecord)
import Perspectives.External.CoreModules (isExternalCoreModule)
import Perspectives.External.HiddenFunctionCache (lookupHiddenFunctionNArgs)
import Perspectives.Identifiers (Namespace, deconstructModelName, deconstructNamespace_, isQualifiedWithDomein)
import Perspectives.Parsing.Arc (mkActionFromVerb)
import Perspectives.Parsing.Arc.AST (ActionE(..), ActionPart(..), ContextE(..), ContextPart(..), PerspectiveE(..), PerspectivePart(..), PropertyE(..), PropertyPart(..), RoleE(..), RolePart(..), ViewE(..))
import Perspectives.Parsing.Arc.Expression.AST (SimpleStep(..), Step(..)) as Expr
import Perspectives.Parsing.Arc.IndentParser (ArcPosition)
import Perspectives.Parsing.Messages (PerspectivesError(..))
import Perspectives.Query.QueryTypes (Domain(..), QueryFunctionDescription(..), Calculation(..))
import Perspectives.Representation.ADT (ADT(..))
import Perspectives.Representation.Action (Action(..))
import Perspectives.Representation.CalculatedProperty (CalculatedProperty(..), defaultCalculatedProperty)
import Perspectives.Representation.CalculatedRole (CalculatedRole(..), defaultCalculatedRole)
import Perspectives.Representation.Class.Identifiable (identifier)
import Perspectives.Representation.Class.Property (Property(..)) as Property
import Perspectives.Representation.Class.Role (Role(..))
import Perspectives.Representation.Context (Context(..), defaultContext)
import Perspectives.Representation.EnumeratedProperty (EnumeratedProperty(..), defaultEnumeratedProperty)
import Perspectives.Representation.EnumeratedRole (EnumeratedRole(..), defaultEnumeratedRole)
import Perspectives.Representation.QueryFunction (QueryFunction(..))
import Perspectives.Representation.Range (Range(..))
import Perspectives.Representation.SideEffect (SideEffect(..))
import Perspectives.Representation.ThreeValuedLogic (ThreeValuedLogic(..))
import Perspectives.Representation.TypeIdentifiers (ActionType(..), ContextType(..), EnumeratedPropertyType(..), EnumeratedRoleType(..), PropertyType(..), RoleKind(..), RoleType(..), ViewType(..))
import Perspectives.Representation.View (View(..))
import Prelude (bind, discard, map, pure, show, ($), (<>), (==), (&&), not, (<$>))

-------------------
traverseDomain :: ContextE -> Namespace -> PhaseTwo DomeinFile
traverseDomain c ns = do
  (Context {_id}) <- traverseContextE c ns
  domeinFileRecord <- getDF
  pure $ DomeinFile (domeinFileRecord {_id = unwrap _id})

-- | Traverse the members of the ContextE AST type to construct a new Context type
-- | and insert it into a DomeinFileRecord.
traverseContextE :: ContextE -> Namespace -> PhaseTwo Context
traverseContextE (ContextE {id, kindOfContext, contextParts, pos}) ns = do
  context <- pure $ defaultContext (addNamespace ns id) id kindOfContext (if ns == "model:" then Nothing else (Just ns)) pos
  unsafePartial $ withNamespaces
    (filter (case _ of
      (PREFIX _ _) -> true
      otherwise -> false) contextParts)
    do
      contextParts' <- case (head (filter (case _ of
        RE (RoleE{id:rid}) -> rid == "External"
        otherwise -> false) contextParts)) of
          Nothing -> pure $ Cons (RE (RoleE{id: "External", kindOfRole: ExternalRole, roleParts: Nil, pos})) contextParts
          otherwise -> pure contextParts
      context' <- foldM handleParts context contextParts'
      modifyDF (\domeinFile -> addContextToDomeinFile context' domeinFile)
      pure context'

  where

    -- Construct members for the new Context type according to the type of
    -- parts found in the ContextE AST type. Insert these members into the new Context.
    handleParts :: Context -> ContextPart -> PhaseTwo Context
    -- Construct a nested Context.
    handleParts contextUnderConstruction (CE c) = do
      subContext <- traverseContextE c (addNamespace ns id)
      pure (subContext `insertInto` contextUnderConstruction)

    -- Construct a Role
    handleParts contextUnderConstruction (RE r) = do
      role <- traverseRoleE r (addNamespace ns id)
      pure (unsafePartial (role `insertRoleInto` contextUnderConstruction))

    -- Prefixes are handled earlier, so this can be a no-op
    handleParts contextUnderConstruction (PREFIX pre model) = pure contextUnderConstruction

    handleParts (Context contextUnderConstruction@{contextAspects}) (ContextAspect contextName pos') = do
      expandedAspect <- expandNamespace contextName
      if isQualifiedWithDomein expandedAspect
        then pure (Context $ contextUnderConstruction {contextAspects = cons (ContextType expandedAspect) contextAspects})
        else throwError $ NotWellFormedName pos' contextName

    addContextToDomeinFile :: Context -> DomeinFileRecord -> DomeinFileRecord
    addContextToDomeinFile c@(Context{_id: (ContextType ident)}) domeinFile = over
      (prop (SProxy :: SProxy "contexts"))
      (insert ident c)
      domeinFile

    -- Insert a sub-Context type into a Context type.
    insertInto :: Context -> Context -> Context
    insertInto (Context{_id}) (Context cr@{nestedContexts}) = Context $ cr {nestedContexts = cons _id nestedContexts}

    -- Insert a Role type into a Context type. This function is partial, because we ignore
    -- BotRole (a BotRole is represented with the UserRole that it serves).
    insertRoleInto :: Partial => Role -> Context -> Context
    insertRoleInto (E (EnumeratedRole {_id, kindOfRole})) c = case kindOfRole, c of
      RoleInContext, (Context cr@{rolInContext}) -> Context $ cr {rolInContext = cons (ENR _id) rolInContext}
      ContextRole, (Context cr@{contextRol}) -> Context $ cr {contextRol = cons (ENR _id) contextRol}
      ExternalRole, ctxt -> ctxt
      -- We may have added the user before, on handling his BotRole.
      UserRole, (Context cr@{gebruikerRol}) -> Context $ cr {gebruikerRol = case elemIndex _id gebruikerRol of
        Nothing -> cons _id gebruikerRol
        (Just _) -> gebruikerRol}

    insertRoleInto (C (CalculatedRole {_id, kindOfRole})) c = case kindOfRole, c of
      RoleInContext, (Context cr@{rolInContext}) -> Context $ cr {rolInContext = cons (CR _id) rolInContext}
      ContextRole, (Context cr@{contextRol}) -> Context $ cr {contextRol = cons (CR _id) contextRol}
      -- A catchall case that just returns the context. Calculated roles for ExternalRole,
      -- UserRole and BotRole should be ignored.
      _, _ -> c

    addNamespace :: String -> String -> String
    addNamespace ns' ln = if ns == "model:" then (ns' <> ln) else (ns' <> "$" <> ln)

-- | Traverse the members of the RoleE AST type to construct a new Role type
-- | and insert it into a DomeinFileRecord.
traverseRoleE :: RoleE -> Namespace -> PhaseTwo Role
traverseRoleE r ns = if isCalculatedRole r
  then traverseCalculatedRoleE r ns
  else if isComputedRole r
    then traverseComputedRoleE r ns
    else traverseEnumeratedRoleE r ns
  where
    isCalculatedRole :: RoleE -> Boolean
    -- isCalculatedRole _ = true
    isCalculatedRole (RoleE {roleParts}) = (isJust (findIndex (case _ of
      (Calculation _) -> true
      otherwise -> false) roleParts))

    isComputedRole :: RoleE -> Boolean
    -- isCalculatedRole _ = true
    isComputedRole (RoleE {roleParts}) = (isJust (findIndex (case _ of
      (Computation _ _ _) -> true
      otherwise -> false) roleParts))

-- | Traverse a RoleE that results in an EnumeratedRole.
traverseEnumeratedRoleE :: RoleE -> Namespace -> PhaseTwo Role
traverseEnumeratedRoleE (RoleE {id, kindOfRole, roleParts, pos}) ns = do
  -- If we have a BotRole, we add its parts (perspectives with actions) to the UserRole
  -- that it serves.
  df@{enumeratedRoles} <- getDF
  role@(EnumeratedRole{_id:roleName}) <-
    case kindOfRole of
      BotRole -> do
        subjectIsBot
        servedUserLocalName <- userServedByBot pos id roleParts
        servedUserId <- pure (ns <> "$" <> servedUserLocalName)
        case lookup servedUserId enumeratedRoles of
          (Just user) -> pure user
          Nothing -> pure (defaultEnumeratedRole servedUserId servedUserLocalName UserRole ns pos)
      UserRole -> do
        userId <- pure (ns <> "$" <> id)
        case lookup userId enumeratedRoles of
          (Just user) -> pure user
          Nothing -> pure (defaultEnumeratedRole userId id kindOfRole ns pos)
      otherwise -> do
        roleName <- pure (ns <> "$" <> id)
        pure (defaultEnumeratedRole roleName id kindOfRole ns pos)
  role' <- foldM (unsafePartial $ handleParts (unwrap roleName)) role roleParts
  -- Now we've handled traverseActionE (where we set executedByBot), we can restore the 'bot' member of state.
  subjectIsNotABot
  modifyDF (\domeinFile -> addRoleToDomeinFile (E role') domeinFile)
  pure (E role')

  where

    -- Construct members for the new Role type according to the type of
    -- parts found in the RoleE AST type. Insert these members into the new Role.
    -- The Calculation case is not handled for an EnumeratedRole, hence the Partial constraint.
    handleParts :: Partial => Namespace -> EnumeratedRole -> RolePart -> PhaseTwo EnumeratedRole

    -- PROPERTY
    handleParts roleName roleUnderConstruction (PE pe) = do
      property <- traversePropertyE pe roleName
      pure (property `insertPropertyInto` roleUnderConstruction)

    -- PERSPECTIVE
    handleParts roleName (EnumeratedRole roleUnderConstruction@{perspectives}) (PRE pe) = do
      (Tuple roleIdentifier actions) <- traversePerspectiveE pe roleName
      pure (EnumeratedRole roleUnderConstruction {perspectives = (insert roleIdentifier actions perspectives)})

    -- VIEW
    handleParts roleName (EnumeratedRole roleUnderConstruction@{views}) (VE pe) = do
      viewType <- traverseViewE pe roleName
      pure (EnumeratedRole $ roleUnderConstruction {views = cons viewType views})

    -- FUNCTIONALATTRIBUTE
    handleParts roleName (EnumeratedRole roleUnderConstruction) (FunctionalAttribute bool) = pure (EnumeratedRole $ roleUnderConstruction {functional = bool})

    -- MANDATORYATTRIBUTE
    handleParts roleName (EnumeratedRole roleUnderConstruction) (MandatoryAttribute bool) = pure (EnumeratedRole $ roleUnderConstruction {mandatory = bool})

    -- FILLEDBYATTRIBUTE
    handleParts roleName (EnumeratedRole roleUnderConstruction@{binding}) (FilledByAttribute bnd) = do
      if bnd == "None"
        then pure (EnumeratedRole $ roleUnderConstruction {binding = UNIVERSAL})
        else do
          -- If the RoleKind is ContextRole, we should construct the name of the External
          -- Role of the binding (which then is a Context)
          expandedBnd <- if kindOfRole == ContextRole
            then expandNamespace (bnd <> "$External")
            else expandNamespace bnd
          pure (EnumeratedRole $ roleUnderConstruction {binding = augmentADT binding expandedBnd})

    -- FORUSER
    handleParts roleName (EnumeratedRole roleUnderConstruction) (ForUser _) = pure (EnumeratedRole $ roleUnderConstruction)

    -- ROLEASPECT
    handleParts roleName (EnumeratedRole roleUnderConstruction@{roleAspects}) (RoleAspect a pos') = do
      expandedAspect <- expandNamespace a
      if isQualifiedWithDomein expandedAspect
        then pure (EnumeratedRole $ roleUnderConstruction {roleAspects = cons (EnumeratedRoleType expandedAspect) roleAspects})
        else throwError $ NotWellFormedName pos' a

    userServedByBot :: ArcPosition -> String -> List RolePart -> PhaseTwo String
    userServedByBot pos' localBotName parts = let
      f = foldl
        (\found next -> if isJust found then found else case next of
          (ForUser user) -> Just user
          otherwise -> Nothing)
        Nothing
        parts
      in case f of
        (Just user) -> pure user
        otherwise -> throwError (MissingForUser pos' localBotName)

    -- We assume we add roleName as another disjunct of a sum type.
    -- `roleName` should be qualified.
    augmentADT :: ADT EnumeratedRoleType -> String -> ADT EnumeratedRoleType
    augmentADT adt roleName = case adt of
      EMPTY -> ST $ EnumeratedRoleType roleName
      SUM terms -> SUM $ cons (ST $ EnumeratedRoleType roleName) terms
      p@(PROD _) -> SUM [p, ST $ EnumeratedRoleType roleName]
      s@(ST _) -> SUM [s, ST $ EnumeratedRoleType roleName]
      UNIVERSAL -> UNIVERSAL

    -- Insert a Property type into a Role type.
    insertPropertyInto :: Property.Property -> EnumeratedRole -> EnumeratedRole
    insertPropertyInto (Property.E (EnumeratedProperty {_id})) (EnumeratedRole rr@{properties}) = EnumeratedRole $ rr {properties = cons (ENP _id) properties}
    insertPropertyInto (Property.C (CalculatedProperty{_id})) (EnumeratedRole rr@{properties}) = EnumeratedRole $ rr {properties = cons (CP _id) properties}

-- Traverse the members of ViewE to construct a new View type and insert it into the
-- DomeinFileRecord.
traverseViewE :: ViewE -> Namespace -> PhaseTwo ViewType
traverseViewE (ViewE {id, viewParts, pos}) ns = do
  viewName <- pure (ns <> "$" <> id)
  (expandedPropertyReferences :: Array PropertyType) <- traverse qualifyProperty (fromFoldable viewParts)
  view <- pure $ View
    { _id: ViewType viewName
    , _rev: Nothing
    , displayName: id
    , propertyReferences: expandedPropertyReferences
    , role: EnumeratedRoleType ns
    , pos: pos}
  modifyDF (\(df@{views}) -> df {views = insert viewName view views})
  pure (ViewType viewName)

  where
    -- TODO. Is het een calculated of een enumerated property?
    -- | Expand prefixed names.
    qualifyProperty :: String -> PhaseTwo PropertyType
    qualifyProperty pname = do
      expandedPname <- expandNamespace pname
      pure $ ENP $ EnumeratedPropertyType expandedPname

addRoleToDomeinFile :: Role -> DomeinFileRecord -> DomeinFileRecord
addRoleToDomeinFile (E r@(EnumeratedRole{_id})) domeinFile = over
  (prop (SProxy :: SProxy "enumeratedRoles"))
  (insert (unwrap _id) r)
  domeinFile
addRoleToDomeinFile (C r@(CalculatedRole{_id})) domeinFile = over
  (prop (SProxy :: SProxy "calculatedRoles"))
  (insert (unwrap _id) r)
  domeinFile
-- addRoleToDomeinFile role df@{enumeratedRoles, calculatedRoles} = case role of
--   (E r@(EnumeratedRole{_id})) -> df {enumeratedRoles = insert (unwrap _id) r enumeratedRoles}
--   (C r@(CalculatedRole{_id})) -> df {calculatedRoles = insert (unwrap _id) r calculatedRoles}

-- | Traverse a RoleE that results in an CalculatedRole.
traverseCalculatedRoleE :: RoleE -> Namespace -> PhaseTwo Role
traverseCalculatedRoleE (RoleE {id, kindOfRole, roleParts, pos}) ns = do
  role <- pure (defaultCalculatedRole (ns <> "$" <> id) id kindOfRole ns pos)
  role' <- foldM (unsafePartial $ handleParts) role roleParts
  modifyDF (\domeinFile -> addRoleToDomeinFile (C role') domeinFile)
  pure (C role')

  where
    handleParts :: Partial => CalculatedRole -> RolePart -> PhaseTwo CalculatedRole
    -- Parse the query expression.
    handleParts (CalculatedRole roleUnderConstruction) (Calculation calc) =
      pure $ CalculatedRole (roleUnderConstruction {calculation = S calc})

-- | Traverse a RoleE that results in an CalculatedRole with a Calculation that depends on a Computed function.
traverseComputedRoleE :: RoleE -> Namespace -> PhaseTwo Role
traverseComputedRoleE (RoleE {id, kindOfRole, roleParts, pos}) ns = do
  role <- pure (defaultCalculatedRole (ns <> "$" <> id) id kindOfRole ns pos)
  role' <- foldM (unsafePartial $ handleParts) role roleParts
  modifyDF (\domeinFile -> addRoleToDomeinFile (C role') domeinFile)
  pure (C role')

  where
    handleParts :: Partial => CalculatedRole -> RolePart -> PhaseTwo CalculatedRole
    handleParts (CalculatedRole roleUnderConstruction) (Computation functionName arguments computedType) = do
      functionName' <- expandDefaultNamespaces functionName
      case (deconstructModelName functionName') of
        Nothing -> throwError (NotWellFormedName pos functionName)
        Just modelName -> if isExternalCoreModule modelName
          then let
            mappedFunctionName = mapName functionName'
            mexpectedNrOfArgs = lookupHiddenFunctionNArgs mappedFunctionName
            calculation = Q $ MQD (CDOM $ ST $ ContextType ns) (ExternalCoreRoleGetter mappedFunctionName) (S <$> (fromFoldable arguments)) (RDOM (ST (EnumeratedRoleType computedType))) Unknown Unknown
            in case mexpectedNrOfArgs of
              Nothing -> throwError (UnknownExternalFunction pos pos functionName')
              Just expectedNrOfArgs -> if expectedNrOfArgs == length arguments
                then pure (CalculatedRole $ roleUnderConstruction {calculation = calculation})
                else throwError (WrongNumberOfArguments pos pos functionName expectedNrOfArgs (length arguments))
          else let
            -- TODO. Check whether the foreign function exists and whether it has been given the right number of arguments.
            calculation = Q $ MQD (CDOM $ ST $ ContextType ns) (ForeignRoleGetter functionName) (S <$> (fromFoldable arguments)) (RDOM (ST (EnumeratedRoleType computedType))) Unknown Unknown
            in pure (CalculatedRole $ roleUnderConstruction {calculation = calculation})

    mapName :: String -> String
    mapName s = case uncons (replace (Pattern "$") (Replacement "_") (replace (Pattern "model:") (Replacement "") s)) of
      (Just {head, tail}) -> fromCharArray [toLower head] <> tail
      Nothing -> s

-- | Traverse the members of the PropertyE AST type to construct a new Property type
-- | and insert it into a DomeinFileRecord.
traversePropertyE :: PropertyE -> Namespace -> PhaseTwo Property.Property
traversePropertyE r ns = if isCalculatedProperty r
  then traverseCalculatedPropertyE r ns
  else traverseEnumeratedPropertyE r ns
  where
    isCalculatedProperty :: PropertyE -> Boolean
    isCalculatedProperty (PropertyE {propertyParts}) = (isJust (findIndex (case _ of
        (Calculation' _) -> true
        otherwise -> false) propertyParts))

traverseEnumeratedPropertyE :: PropertyE -> Namespace -> PhaseTwo Property.Property
traverseEnumeratedPropertyE (PropertyE {id, range, propertyParts, pos}) ns = do
  property <- pure $ defaultEnumeratedProperty (ns <> "$" <> id) id ns (unsafePartial $ fromJust range) pos
  property' <- foldM (unsafePartial handleParts) property propertyParts
  modifyDF (\df -> addPropertyToDomeinFile (Property.E property') df)
  pure (Property.E property')

  where
    -- Construct members for the new Property type according to the type of
    -- parts found in the PropertyE AST type. Insert these members into the new Property.
    -- The Calculation case is not handled for an EnumeratedRole, hence the Partial constraint.
    handleParts :: Partial => EnumeratedProperty -> PropertyPart -> PhaseTwo EnumeratedProperty
    -- FUNCTIONALATTRIBUTE
    handleParts (EnumeratedProperty propertyUnderConstruction) (FunctionalAttribute' bool) = pure (EnumeratedProperty $ propertyUnderConstruction {functional = bool})

    -- MANDATORYATTRIBUTE
    handleParts (EnumeratedProperty propertyUnderConstruction) (MandatoryAttribute' bool) = pure (EnumeratedProperty $ propertyUnderConstruction {mandatory = bool})

-- | Traverse a PropertyE that results in an CalculatedProperty.
traverseCalculatedPropertyE :: PropertyE -> Namespace -> PhaseTwo Property.Property
traverseCalculatedPropertyE (PropertyE {id, range, propertyParts, pos}) ns = do
  (CalculatedProperty property@{calculation}) <- pure $ defaultCalculatedProperty (ns <> "$" <> id) id ns pos
  calculation' <- case head propertyParts of
    -- TODO: fish out the actually parsed calculation and use that!
    (Just (Calculation' c)) -> pure $ S c
    otherwise -> pure calculation
  property' <- pure $ Property.C $ CalculatedProperty (property {calculation = calculation'})
  modifyDF (\df -> addPropertyToDomeinFile property' df)
  pure property'

addPropertyToDomeinFile :: Property.Property -> DomeinFileRecord -> DomeinFileRecord
addPropertyToDomeinFile property df@{enumeratedProperties, calculatedProperties} = case property of
  (Property.E r@(EnumeratedProperty{_id})) -> df {enumeratedProperties = insert (unwrap _id) r enumeratedProperties}
  (Property.C r@(CalculatedProperty{_id})) -> df {calculatedProperties = insert (unwrap _id) r calculatedProperties}

-- | Traverse a PerspectiveE. Add each Action seperately to the DomeinFile.
-- | Returns the fully qualified string that identifies the Object of the Action and the qualified identifiers of the Actions
-- | (we need not know what kind of Role that Object is, to be able to store the
-- | Perspective in the Role itself).
traversePerspectiveE :: PerspectiveE -> Namespace -> PhaseTwo (Tuple String (Array ActionType))
traversePerspectiveE (PerspectiveE {id, perspectiveParts, pos}) rolename = do

  -- First identify the Object of the Perspective. We need to hand it down to treatment
  -- of each separate Action.
  (object :: String) <- case head $ filter (case _ of
    (Object _) -> true
    otherwise -> false) perspectiveParts of
      -- (Just (Object o)) -> pure (deconstructNamespace_ rolename <> "$" <> o)
      -- Even though the object should be a role in the context,
      -- we cannot be sure at this point that it will actually be so.
      -- We pass the unqualified name and have PhaseThree look it up.
      (Just (Object o)) -> pure o
        -- TODO. Case analyse: als o een expressie (step) is, maak dan een CalculatedRole. We hoeven hem niet toe te voegen aan een context.
        -- Immers, de enige referentie ernaar is vanuit de acties die we in het kader
        -- van dit perspectief maken. We genereren een id en verspreiden die naar de
        -- Acties.
      otherwise -> throwError (MissingObject pos id)

  -- Similarly, find and use the DefaultObjectView, if the Action has not provided its own View.
  -- We do not (yet) allow a View with a CalculatedRole, so the View is taken from the EnumeratedRole's that
  -- underly the calculation of such a role. However, that still allows the View to be defined in another
  -- namespace than the Role itself.
  -- In other words, the namespace of the View is unknown.
  (defaultObjectView :: Maybe ViewType) <- pure $ map (unsafePartial \(DefaultView v) -> ViewType v)
    (head $ filter (case _ of
      (DefaultView _) -> true
      otherwise -> false) perspectiveParts)

  -- Now construct all Actions. If there are no Actions and this is not a bot, fill in the defaults for Users.
  actions <- do
    (acts :: List PerspectivePart) <- pure $ (filter (case _ of
        (Act _) -> true
        otherwise -> false) perspectiveParts)
    isabot <- isSubjectBot
    if null acts && not isabot
      then foldM (unsafePartial $ traverseActionE object defaultObjectView rolename) []
        (map (mkActionFromVerb pos) ("Consult" : "Change" : "Delete" : "Create" : Nil))
      else foldM (unsafePartial $ traverseActionE object defaultObjectView rolename) [] acts

  pure (Tuple object actions)

-- | Constructs an Action, using the provided Object and maybe the View on that Object,
-- | from the ActionE. Returns the fully qualified name of the Action in the ActionType.
-- | Adds each Action to the DomeinFileRecord.
traverseActionE :: Partial =>                     -- The function is partial because we just handle ActionE.
  String ->                                       -- The unqualified identifier of the Object.
  Maybe ViewType ->                               -- The unqualified identifier of the Default View on the Object.
  Namespace ->                                    -- The namespace, i.e. the qualified identifier of the Role.
  (Array ActionType) ->                           -- Accumulator: an array of Actions.
  PerspectivePart ->                              -- The ActionE element.
  PhaseTwo (Array ActionType)
traverseActionE object defaultObjectView rolename actions (Act (ActionE{id, verb, actionParts, pos})) = do
  isabot <- isSubjectBot
  actionId <- if isabot
    -- Different names for the same verb and object for the bot and its master, otherwise they will overwrite.
    then pure (rolename <> "_bot$" <> show verb <> object)
    else pure (rolename <> "$" <> show verb <> object)
  executedByBot <- isSubjectBot
  action <- pure $ Action
    { _id: ActionType actionId
    , _rev: Nothing
    , displayName: id
    , subject: EnumeratedRoleType rolename
    , verb: verb
    , object: (ENR $ EnumeratedRoleType object) -- But it may be Calculated!
    , requiredObjectProperties: defaultObjectView
    , requiredSubjectProperties: Nothing
    , requiredIndirectObjectProperties: Nothing
    , indirectObject: Nothing
    , condition: S (Expr.Simple (Expr.Value pos PBool "true"))
    , effect: Nothing
    , executedByBot: executedByBot
    , pos
  }
  action' <- foldM (handleParts $ deconstructNamespace_ rolename) action actionParts
  modifyDF (\df -> df {actions = (insert actionId action' df.actions)})
  pure (cons (identifier action') actions)

  where

    handleParts :: Namespace -> Action -> ActionPart -> PhaseTwo Action

    -- INDIRECTOBJECT
    -- TODO: weliswaar hoort het object in de namespace van de context te zitten,
    -- maar we weten natuurlijk niet of het er ook werkelijk is!
    handleParts contextName (Action ar) (IndirectObject ido) = pure $ Action ar {indirectObject = Just (ENR $ EnumeratedRoleType (contextName <> "$" <> ido))}

    -- SUBJECTVIEW
    handleParts _ (Action ar) (SubjectView sv) = pure $ Action (ar {requiredSubjectProperties = Just $ ViewType sv})

    -- OBJECTVIEW
    handleParts _ (Action ar) (ObjectView ov) = pure $ Action (ar {requiredObjectProperties = Just $ ViewType ov})

    -- INDIRECTOBJECTVIEW
    handleParts _ (Action ar) (IndirectObjectView iov) = pure $ Action (ar {requiredIndirectObjectProperties = Just $ ViewType iov})

    -- CONDITION
    handleParts _ (Action ar) (Condition s) = pure $ Action (ar {condition = S s})

    -- ASSIGNMENT
    handleParts _ (Action ar@{effect}) (AssignmentPart a) = case effect of
      Nothing -> pure $ Action (ar {effect = Just $ A [a]})
      Just (A as) -> pure $ Action (ar {effect = Just $ A (cons a as)})

    -- LETPART
    handleParts _ (Action ar) (LetPart lstep) = pure $ Action (ar {effect = Just $ L lstep})
