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

module Perspectives.Parsing.Arc.PhaseThree where

-- | Phase Three of the parser solves problems that arise due to forward reference.
-- | In a View, for example, the modeller can reference a property of a Role that
-- | has not yet been parsed in phase two (this may happen if that Role is filled with
-- | a role that is 'later' in the source text).
-- |

import Control.Monad.Error.Class (try)
import Control.Monad.Except (throwError)
import Control.Monad.State (gets)
import Control.Monad.Trans.Class (lift)
import Data.Array (filter, filterA, foldM, head, length, null, reverse, uncons)
import Data.Char.Unicode (toLower)
import Data.Either (Either(..))
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), isJust)
import Data.Newtype (unwrap)
import Data.String (Pattern(..), Replacement(..), replace)
import Data.String.CodeUnits (fromCharArray, uncons) as CU
import Data.Traversable (traverse)
import Data.TraversableWithIndex (traverseWithIndex)
import Data.Tuple (Tuple(..))
import Foreign.Object (insert, keys, lookup, unions, values)
import Partial.Unsafe (unsafePartial)
import Perspectives.CoreTypes ((###=), MP, (###>))
import Perspectives.DomeinCache (removeDomeinFileFromCache, storeDomeinFileInCache)
import Perspectives.DomeinFile (DomeinFile(..), DomeinFileRecord, indexedContexts, indexedRoles)
import Perspectives.External.CoreModules (isExternalCoreModule)
import Perspectives.External.HiddenFunctionCache (lookupHiddenFunctionNArgs)
import Perspectives.Identifiers (Namespace, deconstructModelName, endsWithSegments, isQualifiedWithDomein)
import Perspectives.Parsing.Arc.Expression (endOf, startOf)
import Perspectives.Parsing.Arc.Expression.AST (Assignment(..), AssignmentOperator(..), LetStep(..), Step)
import Perspectives.Parsing.Arc.IndentParser (ArcPosition)
import Perspectives.Parsing.Arc.InvertQueriesForBindings (hasAccessToPropertiesOf, setInvertedQueriesForUserAndRole)
import Perspectives.Query.Kinked (setInvertedQueries)
import Perspectives.Parsing.Arc.PhaseTwoDefs (PhaseThree, addBinding, lift2, modifyDF, runPhaseTwo_', withFrame)
import Perspectives.Parsing.Messages (PerspectivesError(..))
import Perspectives.Persistent (getDomeinFile)
import Perspectives.Query.DescriptionCompiler (addVarBindingToSequence, compileStep, makeSequence)
import Perspectives.Query.QueryTypes (Calculation(..), Domain(..), QueryFunctionDescription(..), domain, domain2roleType, functional, mandatory, range, traverseQfd)
import Perspectives.Representation.ADT (ADT(..), reduce)
import Perspectives.Representation.Action (Action(..))
import Perspectives.Representation.CalculatedProperty (CalculatedProperty(..))
import Perspectives.Representation.CalculatedRole (CalculatedRole(..))
import Perspectives.Representation.Class.Identifiable (identifier_)
import Perspectives.Representation.Class.PersistentType (getEnumeratedProperty, getEnumeratedRole, typeExists)
import Perspectives.Representation.Class.Property (range) as PT
import Perspectives.Representation.Class.Role (adtOfRole, bindingOfRole, getCalculation, getRole, hasNotMorePropertiesThan, lessThanOrEqualTo, roleADT)
import Perspectives.Representation.Class.Role (contextOfRepresentation, roleTypeIsFunctional) as ROLE
import Perspectives.Representation.Context (Context(..))
import Perspectives.Representation.EnumeratedRole (EnumeratedRole(..))
import Perspectives.Representation.QueryFunction (FunctionName(..), QueryFunction(..)) as QF
import Perspectives.Representation.SideEffect (SideEffect(..))
import Perspectives.Representation.ThreeValuedLogic (ThreeValuedLogic(..), bool2threeValued)
import Perspectives.Representation.TypeIdentifiers (ActionType(..), CalculatedPropertyType(..), CalculatedRoleType(..), ContextType, EnumeratedPropertyType, EnumeratedRoleType(..), PropertyType(..), RoleType(..), ViewType, externalRoleType, propertytype2string, roletype2string)
import Perspectives.Representation.View (View(..))
import Perspectives.Types.ObjectGetters (lookForUnqualifiedPropertyType, lookForUnqualifiedPropertyType_, lookForUnqualifiedRoleType, lookForUnqualifiedRoleTypeOfADT, lookForUnqualifiedViewType, rolesWithPerspectiveOnProperty, rolesWithPerspectiveOnRole)
import Prelude (Unit, bind, discard, map, pure, unit, void, ($), (<$>), (<*), (<*>), (<<<), (<>), (==), (>=>), (>>=))

phaseThree :: DomeinFileRecord -> MP (Either PerspectivesError DomeinFileRecord)
phaseThree df@{_id} = do
  -- Store the DomeinFile in cache. If a prefix for the domain is defined in the file,
  -- phaseThree_ will try to retrieve it.
  void $ storeDomeinFileInCache _id (DomeinFile df)
  phaseThree_ df <* removeDomeinFileFromCache _id

phaseThree_ :: DomeinFileRecord -> MP (Either PerspectivesError DomeinFileRecord)
phaseThree_ df@{_id, referredModels} = do
  indexedContexts <- unions <$> traverse (getDomeinFile >=> pure <<< indexedContexts) referredModels
  indexedRoles <- unions <$> traverse (getDomeinFile >=> pure <<< indexedRoles) referredModels
  (Tuple ei {dfr}) <- runPhaseTwo_'
    (do
      qualifyActionRoles
      qualifyBindings
      qualifyPropertyReferences
      qualifyViewReferences
      compileExpressions
      requalifyBindingsToCalculatedRoles
      invertedQueriesForLocalRolesAndProperties
      compileRules
      )
    df
    indexedContexts
    indexedRoles
  case ei of
    (Left e) -> pure $ Left e
    otherwise -> pure $ Right dfr

getDF :: Unit -> PhaseThree DomeinFileRecord
getDF _ = lift $ gets _.dfr

withDomeinFile :: forall a. Namespace -> DomeinFile -> PhaseThree a -> PhaseThree a
withDomeinFile ns df mpa = do
  void $ lift2 $ storeDomeinFileInCache ns df
  r <- mpa
  lift2 $ removeDomeinFileFromCache ns
  pure r

-- | Qualifies the identifiers used in the object- and indirectObject field of an Action.
-- | All Objects are by default constructed as enumerated; this function corrects that if
-- | applicable.
-- | Note that this function requires the DomeinFile to be available in the cache!
qualifyActionRoles :: PhaseThree Unit
qualifyActionRoles = do
  df@{_id} <- lift $ gets _.dfr
  withDomeinFile
    _id
    (DomeinFile df)
    (qualifyActionRoles' df)
  where
  qualifyActionRoles' :: DomeinFileRecord -> PhaseThree Unit
  qualifyActionRoles' {contexts, enumeratedRoles, actions, calculatedRoles} = for_ contexts
    \(Context{_id:ctxtId, gebruikerRol, contextRol}) -> for_ gebruikerRol
      \rt -> case rt of
        (ENR (EnumeratedRoleType ur)) -> case lookup ur enumeratedRoles of
          Nothing -> throwError (Custom $ "Impossible error: cannot find '" <> ur <> "' in model.")
          (Just (EnumeratedRole {perspectives})) -> for_ (values perspectives)
            \acts -> for_ acts
              \(ActionType a) -> case lookup a actions of
                Nothing -> throwError (Custom $ "Impossible error: cannot find '" <> a <> "' in model.")
                (Just (Action ar@{_id: actId, object, indirectObject: mindirectObject, pos})) -> do
                  ar' <- do
                    qname <- case object of
                      (ENR (EnumeratedRoleType "External")) -> pure $ ENR $ externalRoleType ctxtId
                      other -> qualifiedRoleType ctxtId pos (roletype2string other)
                    -- qname <- qualifiedRoleType ctxtId pos (roletype2string object)
                    pure $ ar {object = qname}
                  ar'' <- case mindirectObject of
                    (Just indirectObject) -> do
                      qname <- case object of
                        (ENR (EnumeratedRoleType "External")) -> pure $ ENR $ externalRoleType ctxtId
                        other -> qualifiedRoleType ctxtId pos (roletype2string indirectObject)
                      pure $ ar' {indirectObject = Just qname}
                    otherwise -> pure ar'
                  if ar'' == ar
                    then pure unit
                    -- A change, so modify the DomeinFileRecord
                    else modifyDF (\df@{actions: actions'} -> df {actions = insert (unwrap actId) (Action ar'') actions'})
        -- No perspectives for Calculated Users yet!
        (CR (CalculatedRoleType ur)) -> pure unit
    where
      qualifiedRoleType :: ContextType -> ArcPosition -> String -> PhaseThree RoleType
      qualifiedRoleType ctxtId pos ident = if isQualifiedWithDomein ident
        then case lookup ident calculatedRoles of
          Nothing -> do
            -- Does the role exist at all (in some other model)?
            exists <- lift2 $ typeExists (EnumeratedRoleType ident)
            if exists
              then pure $ ENR $ EnumeratedRoleType ident
              else throwError $ UnknownRole pos ident
          (Just (CalculatedRole{_id:id'})) -> pure $ CR id'
        else do
          types <- lift2 $ ctxtId ###= lookForUnqualifiedRoleType ident
          case head types of
            Nothing -> throwError $ RoleMissingInContext pos ident (unwrap ctxtId)
            (Just t) -> pure t

-- | Qualifies the identifiers used in the filledBy part of an EnumeratedRole declaration.
-- | A binding is represented as an ADT. We transform all elements of the form `ST segmentedName` in the tree
-- | to `ST qualifiedName`, using the `Reducible a (ADT b)` instance.
-- | We qualify a name only by searching the roles of the domain. Role names that have the segmentedName as a suffix
-- | are candidates to qualify it. Only one such Role may exist in the domain!
-- | Note that this function requires the DomeinFile to be available in the cache.
-- | This function just uses the DomeinFileRecord that is passed in as an argument.
qualifyBindings :: PhaseThree Unit
qualifyBindings = (lift $ gets _.dfr) >>= qualifyBindings'
  where
    qualifyBindings' :: DomeinFileRecord -> PhaseThree Unit
    qualifyBindings' {enumeratedRoles:eroles, calculatedRoles:croles} = for_ eroles
      (\(EnumeratedRole rr@{_id, binding, pos}) -> do
        qbinding <- reduce (qualifyBinding pos) binding
        if binding == qbinding
          then pure unit
          else -- change the role in the domain
            modifyDF (\df@{enumeratedRoles} -> df {enumeratedRoles = insert (unwrap _id) (EnumeratedRole rr {binding = qbinding}) enumeratedRoles}))
      where
        qualifyBinding :: ArcPosition -> EnumeratedRoleType -> PhaseThree (ADT EnumeratedRoleType)
        qualifyBinding pos i@(EnumeratedRoleType ident) = do
          q <- try $ qualifyLocalRoleName pos ident (keys eroles)
          case q of
            -- We introduce an intentional semantic error here by attempting to qualify the binding, that we know not
            -- to be an EnumeratedRole, as an EnumeratedRole. However, with requalifyBindingsToCalculatedRoles we will
            -- correct that error. We cannot do otherwise because at this state we don't have compiled the expressions
            -- of the CalculatedRoles yet.
            -- If not found in the EnumeratedRoles, try the CalculatedRoles
            Left (UnknownRole _ _) -> qualifyLocalRoleName pos ident (keys croles)
            Left e -> throwError e
            Right adt -> pure adt

-- | If the name is unqualified, look for an EnumeratedRol with matching local name in the Domain.
qualifyLocalRoleName :: ArcPosition -> String -> Array String -> PhaseThree (ADT EnumeratedRoleType)
qualifyLocalRoleName pos ident roleIdentifiers = if isQualifiedWithDomein ident
  then pure $ ST $ EnumeratedRoleType ident
  else do
    (candidates :: Array String) <- pure $ filter (\_id -> _id `endsWithSegments` ident) roleIdentifiers
    case head candidates of
      Nothing -> throwError $ UnknownRole pos ident
      (Just qname) | length candidates == 1 -> pure $ ST $ EnumeratedRoleType qname
      otherwise -> throwError $ NotUniquelyIdentifying pos ident candidates

-- | For each (Enumerated) role with a binding to the name of a CalculatedRole (falsely declared to be Enumerated!),
-- | replace that binding with the ADT of the (now compiled) CalculatedRole.
requalifyBindingsToCalculatedRoles :: PhaseThree Unit
requalifyBindingsToCalculatedRoles = (lift $ gets _.dfr) >>= qualifyBindings'
  where
    qualifyBindings' :: DomeinFileRecord -> PhaseThree Unit
    qualifyBindings' {enumeratedRoles:eroles, calculatedRoles:croles} = for_ eroles
      (\(EnumeratedRole rr@{_id, binding, pos}) -> case binding of
        -- If the binding is to a calculated role, replace it with the roleADT of that calculated role.
        ST (EnumeratedRoleType cr) -> case lookup cr croles of
          Nothing -> pure unit
          Just crole -> do
            adt <- lift2 $ roleADT crole
            modifyDF (\df@{enumeratedRoles} -> df {enumeratedRoles = insert (unwrap _id) (EnumeratedRole rr {binding = adt}) enumeratedRoles})
        otherwise -> pure unit)

-- | Qualify the references to Properties in each View.
qualifyPropertyReferences :: PhaseThree Unit
qualifyPropertyReferences = do
  df@{_id} <- lift $ gets _.dfr
  withDomeinFile
    _id
    (DomeinFile df)
    (qualifyPropertyReferences' df)
  where
    qualifyPropertyReferences' :: DomeinFileRecord -> PhaseThree Unit
    qualifyPropertyReferences' df@{_id, views, calculatedProperties} = do
      qviews <- traverseWithIndex qualifyView views
      modifyDF \dfr -> dfr {views = qviews}

      where
        qualifyView :: String -> View -> PhaseThree View
        qualifyView viewName (View vr@{propertyReferences, role, pos}) = do
          qprops <- traverse (qualifyProperty role pos) propertyReferences
          pure $ View $ vr {propertyReferences = qprops}

        qualifyProperty :: EnumeratedRoleType -> ArcPosition -> PropertyType -> PhaseThree PropertyType
        qualifyProperty erole pos propType = do
          -- Note that we need the DomeinFile with qualified bindings in the cache
          -- for this function to work correctly!
          if isQualifiedWithDomein (propertytype2string propType)
            -- The modeller has provided a qualified property. He cannot say whether it is Calculated, or Enumerated,
            -- however. If it is Calculated, change now.
            then if isJust (lookup (propertytype2string propType) calculatedProperties)
              then pure $ CP $ CalculatedPropertyType (propertytype2string propType)
              else pure propType
            else do
              (candidates :: Array PropertyType) <- lift2 (erole ###= lookForUnqualifiedPropertyType_ (propertytype2string propType))
              case head candidates of
                Nothing -> throwError $ UnknownProperty pos (propertytype2string propType) erole
                (Just t) | length candidates == 1 -> pure t
                otherwise -> throwError $ NotUniquelyIdentifying pos (propertytype2string propType) (map propertytype2string candidates)

-- | The views on the subject, object and indirectObject of an Action can be specified
-- | with a local name. It should be possible to qualify such a name by comparing it with
-- | the views that are available on the roles bound to the subject, object and
-- | indirectObject, respectively.
qualifyViewReferences :: PhaseThree Unit
qualifyViewReferences = do
  df@{_id} <- lift $ gets _.dfr
  withDomeinFile
    _id
    (DomeinFile df)
    (qualifyViewReferences' df)
  where
    qualifyViewReferences' :: DomeinFileRecord -> PhaseThree Unit
    qualifyViewReferences' df@{_id, actions} = do
      qactions <- traverseWithIndex qualifyAction actions
      modifyDF \dfr -> dfr {actions = qactions}

      where
        qualifyAction :: String -> Action -> PhaseThree Action
        qualifyAction actionName (Action ar@{subject, requiredSubjectProperties, object, requiredObjectProperties, indirectObject, requiredIndirectObjectProperties, pos}) = do
          (subjectView :: Maybe ViewType) <- qualifyViewForRole requiredSubjectProperties (ENR subject)
          (objectView :: Maybe ViewType) <- qualifyViewForRole requiredObjectProperties object
          (indirectObjectView :: Maybe ViewType) <- case indirectObject of
            (Just indirectObject') -> qualifyViewForRole requiredIndirectObjectProperties indirectObject'
            Nothing -> pure Nothing
          pure $ Action ar
            { requiredSubjectProperties = subjectView
            , requiredObjectProperties = objectView
            , requiredIndirectObjectProperties = indirectObjectView}

          where
            qualifyViewForRole :: Maybe ViewType -> RoleType -> PhaseThree (Maybe ViewType)
            qualifyViewForRole requiredProperties role =
              case requiredProperties of
                Nothing -> pure Nothing
                (Just rqp) -> do
                  viewCandidates <- lift2 do
                    adt <- getRole role >>= adtOfRole
                    (adt ###= lookForUnqualifiedViewType (unwrap rqp))
                  case head viewCandidates of
                    Nothing -> throwError $ UnknownView pos (unwrap rqp)
                    (Just v) | length viewCandidates == 1 -> pure $ Just v
                    otherwise -> throwError $ NotUniquelyIdentifying pos (unwrap rqp) (map unwrap viewCandidates)

-- | For each Role with a binding, record that Role as an inverse binding for the value of the binding.
-- TODO. Implement inverseBindings. Or don't we really need it?
inverseBindings :: PhaseThree Unit
inverseBindings = throwError (Custom "Implement inverseBindings")

-- | For each EnumeratedRole R in the model, add InvertedQueries to make deltas
-- | available to User Roles in the context of R that have a Perspective on R.
-- | For an explanation, see https://joopringelberg.github.io/perspectives-documentation/Perspectives%20on%20bindings.pdf
invertedQueriesForLocalRolesAndProperties :: PhaseThree Unit
invertedQueriesForLocalRolesAndProperties = do
  df@{_id} <- lift $ gets _.dfr
  withDomeinFile
    _id
    (DomeinFile df)
    (invertedQueriesForLocalRolesAndProperties' df)
  where
    invertedQueriesForLocalRolesAndProperties' :: DomeinFileRecord -> PhaseThree Unit
    invertedQueriesForLocalRolesAndProperties' {enumeratedRoles} = do
      for_ enumeratedRoles
        \(EnumeratedRole {_id, context, mandatory}) -> do
          (userTypes :: Array RoleType) <- lift $ lift (context ###= rolesWithPerspectiveOnRole (ENR _id))
          qfd <- pure $ (SQD (RDOM (ST _id)) (QF.DataTypeGetter QF.ContextF) (CDOM (ST context)) True (bool2threeValued mandatory))
          for_ userTypes \user -> do
            props <- lift $ lift (user `hasAccessToPropertiesOf` (ENR _id))
            setInvertedQueriesForUserAndRole user (ST _id) props qfd

-- | The calculation of a CalculatedRole or a CalculatedProperty are both expressions. This function compiles the
-- | parser AST output that represents these expressions to QueryFunctionDescriptions.
-- | All names are qualified in the process.
compileExpressions :: PhaseThree Unit
compileExpressions = do
  df@{_id} <- lift $ gets _.dfr
  withDomeinFile
    _id
    (DomeinFile df)
    (compileExpressions' df)
  where
    compileExpressions' :: DomeinFileRecord -> PhaseThree Unit
    compileExpressions' {calculatedRoles, calculatedProperties} = do
      -- TODO. Collect references to Calculated Properties from the QueryFunctionDescriptions and sort
      -- the calculatedRoles accordingly before compiling the descriptions. That will detect cycles
      -- (throw an error) and prevent forward reference errors.
      compRoles <- traverseWithIndex compileRolExpr calculatedRoles
      compProps <- traverseWithIndex compilePropertyExpr calculatedProperties
      modifyDF \dfr -> dfr {calculatedRoles = compRoles, calculatedProperties = compProps}

    compileRolExpr :: String -> CalculatedRole -> PhaseThree CalculatedRole
    compileRolExpr roleName (CalculatedRole cr@{_id, calculation, context}) = case calculation of
      Q _ -> pure $ CalculatedRole cr
      S stp -> do
        userTypes <- lift $ lift (context ###= rolesWithPerspectiveOnRole (CR _id))
        descr <- compileAndDistributeStep userTypes (CDOM $ ST context) stp
        pure $ CalculatedRole (cr {calculation = Q descr})

    compilePropertyExpr :: String -> CalculatedProperty -> PhaseThree CalculatedProperty
    compilePropertyExpr propertyName (CalculatedProperty cr@{_id, calculation, role}) = case calculation of
      Q _ -> pure $ CalculatedProperty cr
      S stp -> do
        (EnumeratedRole{context}) <- lift $ lift $ getEnumeratedRole role
        userTypes <- lift $ lift (context ###= rolesWithPerspectiveOnProperty (CP _id))
        descr <- compileAndDistributeStep userTypes (RDOM $ ST role) stp
        pure $ CalculatedProperty (cr {calculation = Q descr})

-- compileArg :: Array EnumeratedRoleType -> Domain -> Calculation -> PhaseThree Calculation
-- compileArg userTypes dom (S s) = compileAndDistributeStep userTypes dom s >>= pure <<< Q
-- compileArg userTypes dom x = pure x

-- | Use `compileAndDistributeStep` to compile a parsed expression into a QueryFunctionDescription, and to
-- | distribute inverted versions of it over all definitions of EnumeratedRoles and EnumeratedProperties that
-- | are visited during query traversal. These inverted versions are used to compute the users that should be
-- | informed of changes.
-- | This function calls [compileStep](Perspectives.Query.DescriptionCompiler.html#t:compileStep).
-- | It also has a side effect on the DomeinFileRecord that is kept in [PhaseTwoState](Perspectives.Parsing.Arc.PhaseTwoDefs.html#t:PhaseTwoState): it
-- |  * changes EnumeratedRoles
-- |  * changes EnumeratedProperties
-- | We only call `compileAndDistributeStep` in the functions `compileExpressions` and `compileRules`. These functions
-- | also modify the DomeinFileRecord, but just the CalculatedRole, CalculatedProperty and Action definitions in it.
-- | Hence we do not risk to modify a definition that will be overwritten soon after without including that modification.
compileAndDistributeStep :: Array RoleType -> Domain -> Step -> PhaseThree QueryFunctionDescription
compileAndDistributeStep userTypes dom s = do
  descr <- compileStep dom s
  descr' <- traverseQfd (qualifyReturnsClause (startOf s)) descr
  setInvertedQueries userTypes descr'
  pure descr'

qualifyReturnsClause :: ArcPosition -> QueryFunctionDescription -> PhaseThree QueryFunctionDescription
qualifyReturnsClause pos qfd@(MQD dom' (QF.ExternalCoreRoleGetter f) args (RDOM (ST (EnumeratedRoleType computedType))) isF isM) = do
  enumeratedRoles <- (lift $ gets _.dfr) >>= pure <<< _.enumeratedRoles
  computedTypeADT <- qualifyLocalRoleName pos computedType (keys enumeratedRoles)
  case computedTypeADT of
    ST (EnumeratedRoleType qComputedType) | computedType == qComputedType -> pure qfd
    _ -> pure (MQD dom' (QF.ExternalCoreRoleGetter f) args (RDOM computedTypeADT) isF isM)
qualifyReturnsClause pos qfd = pure qfd

-- | For each Action that has a SideEffect for its `effect` member, compile the List of Assignments, or the Let* expression in it to a `QueryFunctionDescription`.
-- | All names are qualified in the process.
compileRules :: PhaseThree Unit
compileRules = do
  df@{_id} <- lift $ gets _.dfr
  withDomeinFile
    _id
    (DomeinFile df)
    (compileRules' df)
  where
    compileRules' :: DomeinFileRecord -> PhaseThree Unit
    compileRules' {actions, enumeratedRoles} = do
      compActions <- traverseWithIndex compileRule actions
      modifyDF \dfr -> dfr {actions = compActions}
      where
        compileRule :: String -> Action -> PhaseThree Action
        compileRule actionName a@(Action ar@{_id, subject, condition, effect, object}) = do
          conditionDescription <- compileActionCondition
          ctxt <- lift2 (getEnumeratedRole subject >>= pure <<< ROLE.contextOfRepresentation)
          currentDomain <- pure (CDOM $ ST ctxt)
          objectCalculation <- lift $ lift $ getRole object >>= getCalculation
          objectVar <- pure (UQD (domain objectCalculation) (QF.BindVariable "object") objectCalculation (range objectCalculation) (functional objectCalculation) (mandatory objectCalculation))
          -- The expression below returns a QueryFunctionDescription that describes either a single assignment, or
          -- a BQD with QueryFunction equal to (BinaryCombinator SequenceF).
          case effect of
            -- Compile a series of Assignments into a QueryDescription.
            (Just (A assignments)) -> do
              let_ <- withFrame do
                addBinding "object" objectCalculation
                makeSequence <$> pure objectVar <*> (sequenceOfAssignments currentDomain assignments)
              (aStatements :: QueryFunctionDescription) <- pure (UQD currentDomain QF.WithFrame let_ (range let_) (functional let_) (mandatory let_))
              pure $ Action ar {condition = Q conditionDescription, effect = Just $ EF aStatements}
              -- Compile the LetStep into a QueryDescription.
            (Just (L (LetStep {bindings, assignments}))) -> do
              let_ <- withFrame do
                addBinding "object" objectCalculation
                (makeSequence <$> foldM addVarBindingToSequence objectVar (reverse bindings) <*> sequenceOfAssignments currentDomain assignments)
              -- Add the runtime frame.
              aStatements <- pure (UQD currentDomain QF.WithFrame let_ (range let_) (functional let_) (mandatory let_))
              pure $ Action ar {condition = Q conditionDescription, effect = Just $ EF aStatements}
            otherwise -> pure $ Action ar {condition = Q conditionDescription}

          where

            compileActionCondition :: PhaseThree QueryFunctionDescription
            compileActionCondition = case condition of
              Q d -> pure d
              S stp -> do
                ctxt <- lift2 (getEnumeratedRole subject >>= pure <<< ROLE.contextOfRepresentation)
                descr <- compileAndDistributeStep [ENR subject] (CDOM $ ST ctxt) stp
                pure descr

            -- This will return a QueryFunctionDescription that describes either a single assignment, or
            -- a BQD with QueryFunction equal to (BinaryCombinator SequenceF)
            sequenceOfAssignments :: Domain -> Array Assignment -> PhaseThree QueryFunctionDescription
            sequenceOfAssignments currentDomain assignments' = sequenceOfAssignments_ (reverse assignments')
              where
                sequenceOfAssignments_ :: Array Assignment -> PhaseThree QueryFunctionDescription
                sequenceOfAssignments_ assignments = case uncons assignments of
                  Nothing -> throwError $ Custom "There must be at least one assignment in a let*"
                  (Just {head, tail}) -> do
                    head_ <- describeAssignmentStatement currentDomain head
                    foldM (addAssignmentToSequence currentDomain) head_ tail

            -- Returns a BQD with QueryFunction (BinaryCombinator SequenceF)
            addAssignmentToSequence :: Domain -> QueryFunctionDescription -> Assignment -> PhaseThree QueryFunctionDescription
            addAssignmentToSequence currentDomain seq v = makeSequence <$> pure seq <*> (describeAssignmentStatement currentDomain v)

            -- we need the Object of the Perspective. Right now it is a RoleType, possibly a(n anonymous) CalculatedRole.
            -- The assignment functions arbitrarily return the currentContext. Hence,
            -- we declare the functions to be both functional and mandatory.
            describeAssignmentStatement :: Domain -> Assignment -> PhaseThree QueryFunctionDescription
            describeAssignmentStatement currentDomain ass = case ass of
              Remove {roleExpression} -> do
                rle <- ensureRole [ENR subject] currentDomain roleExpression
                pure $ UQD currentDomain QF.Remove rle currentDomain True True
              CreateRole {roleIdentifier, contextExpression, start, end} -> do
                (cte :: QueryFunctionDescription) <- case contextExpression of
                  Nothing -> pure $ (SQD currentDomain QF.Identity currentDomain True True)
                  (Just stp) -> ensureContext [ENR subject] currentDomain stp
                qualifiedRoleIdentifier <- qualifyWithRespectTo roleIdentifier cte start end
                pure $ UQD currentDomain (QF.CreateRole qualifiedRoleIdentifier) cte currentDomain True True
              Move {roleExpression, contextExpression} -> do
                rle <- ensureRole [ENR subject] currentDomain roleExpression
                (cte :: QueryFunctionDescription) <- case contextExpression of
                  Nothing -> pure $ (SQD currentDomain QF.Identity currentDomain True True)
                  (Just (stp :: Step)) -> ensureContext [ENR subject] currentDomain stp >>= ensureFunctional stp
                pure $ BQD currentDomain QF.Move rle cte currentDomain True True
              Bind f@{bindingExpression, roleIdentifier, contextExpression} -> do
                -- Bind <binding-expression> to <binderType> [in <context-expression>]. Check:
                -- bindingExpression should result in roles
                (bindings :: QueryFunctionDescription) <- ensureRole [ENR subject] currentDomain bindingExpression
                (cte :: QueryFunctionDescription) <- case contextExpression of
                  Nothing -> pure $ (SQD currentDomain QF.Identity currentDomain True True)
                  (Just (stp :: Step)) -> ensureContext [ENR subject] currentDomain stp
                -- binderType should be an EnumeratedRoleType (local name should resolve w.r.t. the contextExpression)
                (qualifiedRoleIdentifier :: EnumeratedRoleType) <- qualifyWithRespectTo roleIdentifier cte f.start f.end
                -- If the roleIdentifier is functional, the bindings should be functional too.
                (lift $ lift $ ROLE.roleTypeIsFunctional (ENR qualifiedRoleIdentifier)) >>= if _
                  then case functional bindings of
                    True -> pure unit
                    Unknown -> throwError $ MaybeNotFunctional f.start f.end bindingExpression
                    False -> throwError $ NotFunctional f.start f.end bindingExpression
                  else pure unit
                -- the possible bindings of binderType (qualifiedRoleIdentifier) should be less specific (=more general) than or equal to the type of the results of binderExpression (bindings).
                qualifies <- do
                  possibleBinding <- lift $ lift (bindingOfRole (ENR qualifiedRoleIdentifier))
                  bindings' <- pure (unsafePartial $ domain2roleType (range bindings))
                  lift2 $ possibleBinding `hasNotMorePropertiesThan` bindings'
                if qualifies
                  -- Create a function description that describes the actual role creating and binding.
                  then pure $ BQD currentDomain (QF.Bind qualifiedRoleIdentifier) bindings cte currentDomain True True
                  else throwError $ RoleDoesNotBind f.start (ENR qualifiedRoleIdentifier) (unsafePartial $ domain2roleType (range bindings))

              Bind_ {bindingExpression, binderExpression} -> do
                -- bindingExpression should result in a functional role
                (bindings :: QueryFunctionDescription) <- ensureRole [ENR subject]  currentDomain bindingExpression >>= ensureFunctional bindingExpression
                -- binderExpression should result in a functional role
                (binders :: QueryFunctionDescription) <- ensureRole [ENR subject]  currentDomain binderExpression >>= ensureFunctional binderExpression
                -- Now create a function description.
                pure $ BQD currentDomain QF.Bind_ bindings binders currentDomain True True

              Unbind f@{bindingExpression, roleIdentifier} -> do
                (bindings :: QueryFunctionDescription) <- ensureRole [ENR subject]  currentDomain bindingExpression
                -- binderType (roleIdentifier) should be an EnumeratedRoleType (local name should resolve w.r.t. the binders of the bindings). We try to resolve in the model and then filter candidates on whether they bind the bindings.
                (qualifiedRoleIdentifier :: Maybe EnumeratedRoleType) <- qualifyBinderType roleIdentifier (unsafePartial $ domain2roleType $ range bindings) f.start f.end
                pure $ UQD currentDomain (QF.Unbind qualifiedRoleIdentifier) bindings currentDomain True True

              Unbind_ {bindingExpression, binderExpression} -> do
                -- bindingExpression should result in a functional role
                (bindings :: QueryFunctionDescription) <- ensureRole [ENR subject]  currentDomain bindingExpression >>= ensureFunctional bindingExpression
                -- binderExpression should result in a functional role
                (binders :: QueryFunctionDescription) <- ensureRole [ENR subject]  currentDomain binderExpression >>= ensureFunctional binderExpression
                -- Now create a function description.
                pure $ BQD currentDomain QF.Unbind_ bindings binders currentDomain True True

              DeleteRole f@{roleIdentifier, contextExpression} -> do
                (contextQfd :: QueryFunctionDescription) <- case contextExpression of
                  Nothing -> pure $ (SQD currentDomain QF.Identity currentDomain True True)
                  (Just stp) -> ensureContext [ENR subject] currentDomain stp
                (qualifiedRoleIdentifier :: EnumeratedRoleType) <- qualifyWithRespectTo roleIdentifier contextQfd f.start f.end
                pure $ UQD currentDomain (QF.DeleteRole qualifiedRoleIdentifier) contextQfd currentDomain True True

              DeleteProperty f@{propertyIdentifier, roleExpression} -> do
                (roleQfd :: QueryFunctionDescription) <- case roleExpression of
                  Nothing -> lift $ lift $ getRole object >>= getCalculation
                  Just e -> ensureRole [ENR subject]  currentDomain e
                (qualifiedProperty :: EnumeratedPropertyType) <- qualifyPropertyWithRespectTo propertyIdentifier roleQfd f.start f.end
                pure $ UQD currentDomain (QF.DeleteProperty qualifiedProperty) roleQfd currentDomain True True

              PropertyAssignment f@{propertyIdentifier, operator, valueExpression, roleExpression} -> do
                (roleQfd :: QueryFunctionDescription) <- case roleExpression of
                  Nothing -> lift $ lift $ (getRole >=> getCalculation) object
                  Just e -> ensureRole [ENR subject]  currentDomain e
                (qualifiedProperty :: EnumeratedPropertyType) <- qualifyPropertyWithRespectTo propertyIdentifier roleQfd f.start f.end
                -- Compile the value expression to a QueryFunctionDescription. Its range must comply with the range of the qualifiedProperty. It is compiled relative to the current context; not relative to the object!
                valueQfd <- compileAndDistributeStep [ENR subject] currentDomain valueExpression
                rangeOfProperty <- lift $ lift $ getEnumeratedProperty qualifiedProperty >>= PT.range
                fname <- case operator of
                  Set _ -> pure $ QF.SetPropertyValue qualifiedProperty
                  AddTo _ -> pure $ QF.AddPropertyValue qualifiedProperty
                  DeleteFrom _ -> pure $ QF.RemovePropertyValue qualifiedProperty
                case range valueQfd of
                  (VDOM r _) | r == rangeOfProperty -> pure unit
                  (VDOM r _) -> throwError $ WrongPropertyRange (startOf valueExpression) (endOf valueExpression) rangeOfProperty r
                  otherwise -> throwError $ NotAPropertyRange (startOf valueExpression) (endOf valueExpression) rangeOfProperty
                pure $ BQD currentDomain fname valueQfd roleQfd currentDomain True True
              ExternalEffect f@{start, end, effectName, arguments} -> do
                case (deconstructModelName effectName) of
                  Nothing -> throwError (NotWellFormedName start effectName)
                  Just modelName -> if isExternalCoreModule modelName
                    then do
                      mexpectedNrOfArgs <- pure $ lookupHiddenFunctionNArgs effectName
                      case mexpectedNrOfArgs of
                        Nothing -> throwError (UnknownExternalFunction start end effectName)
                        Just expectedNrOfArgs -> if expectedNrOfArgs == length arguments
                          then do
                            compiledArguments <- traverse (\s -> compileAndDistributeStep [ENR subject] currentDomain s) arguments
                            pure $ MQD currentDomain (QF.ExternalEffectFullFunction effectName) compiledArguments currentDomain Unknown Unknown
                          else throwError (WrongNumberOfArguments start end effectName expectedNrOfArgs (length arguments))
                    -- TODO: behandel hier Foreign functions.
                    else throwError (UnknownExternalFunction start end effectName)
              where
                mapName :: String -> String
                mapName s = case CU.uncons (replace (Pattern "$") (Replacement "_") (replace (Pattern "model:") (Replacement "") s)) of
                  (Just {head, tail}) -> CU.fromCharArray [toLower head] <> tail
                  Nothing -> s

                qualifyWithRespectTo :: String -> QueryFunctionDescription -> ArcPosition -> ArcPosition -> PhaseThree EnumeratedRoleType
                qualifyWithRespectTo roleIdentifier contextFunctionDescription start end = do
                  (ct :: ADT ContextType) <- case range contextFunctionDescription of
                    (CDOM ct') -> pure ct'
                    otherwise -> throwError $ NotAContextDomain otherwise start end
                  mrt <- lift2 (ct ###> lookForUnqualifiedRoleTypeOfADT roleIdentifier)
                  case mrt of
                    Just (ENR et) -> pure et
                    Just (CR ct') -> throwError $ CannotCreateCalculatedRole ct' start end
                    otherwise -> throwError $ ContextHasNoRole ct roleIdentifier

                qualifyPropertyWithRespectTo :: String -> QueryFunctionDescription -> ArcPosition -> ArcPosition -> PhaseThree EnumeratedPropertyType
                qualifyPropertyWithRespectTo propertyIdentifier roleQfdunctionDescription start end = do
                  (rt :: ADT EnumeratedRoleType) <- case range roleQfdunctionDescription of
                    (RDOM rt') -> pure rt'
                    otherwise -> throwError $ NotARoleDomain otherwise start end
                  (mrt :: Maybe PropertyType) <- lift2 (rt ###> lookForUnqualifiedPropertyType propertyIdentifier)
                  case mrt of
                    Just (ENP et) -> pure et
                    Just (CP ct') -> throwError $ CannotCreateCalculatedProperty ct' start end
                    otherwise -> throwError $ RoleHasNoProperty rt propertyIdentifier

                -- | If the name is unqualified, look for an EnumeratedRol with matching local name in the Domain.
                qualifyBinderType :: Maybe String -> ADT EnumeratedRoleType -> ArcPosition -> ArcPosition -> PhaseThree (Maybe EnumeratedRoleType)
                qualifyBinderType Nothing _ _ _ = pure Nothing
                qualifyBinderType (Just ident) bindings start end = if isQualifiedWithDomein ident
                  then pure $ Just $ EnumeratedRoleType ident
                  else do
                    (nameMatches :: Array EnumeratedRole) <- pure (filter (\(EnumeratedRole{_id:roleId}) -> (unwrap roleId) `endsWithSegments` ident) (values enumeratedRoles))
                    (candidates :: Array EnumeratedRole) <-(filterA (\(EnumeratedRole{binding}) -> lift2 $ lessThanOrEqualTo binding bindings) nameMatches)
                    case head candidates of
                      Nothing -> if null nameMatches
                        then throwError $ UnknownRole start ident
                        else throwError $ LocalRoleDoesNotBind start end ident bindings
                      (Just (EnumeratedRole {_id:candidate})) | length candidates == 1 -> pure $ Just candidate
                      otherwise -> throwError $ NotUniquelyIdentifying start ident (identifier_ <$> candidates)

ensureContext :: Array RoleType -> Domain -> Step -> PhaseThree QueryFunctionDescription
ensureContext userTypes currentDomain stp = do
  qfd <- compileAndDistributeStep userTypes currentDomain stp
  case range qfd of
    (CDOM _) -> pure qfd
    otherwise -> throwError $ NotAContextDomain (range qfd) (startOf stp) (endOf stp)

ensureRole :: Array RoleType -> Domain -> Step -> PhaseThree QueryFunctionDescription
ensureRole userTypes currentDomain stp = do
  qfd <- compileAndDistributeStep userTypes currentDomain stp
  case range qfd of
    (RDOM _) -> pure qfd
    otherwise -> throwError $ NotARoleDomain (range qfd) (startOf stp) (endOf stp)

ensureFunctional :: Step -> QueryFunctionDescription -> PhaseThree QueryFunctionDescription
ensureFunctional stp qfd = case functional qfd of
  True -> pure qfd
  Unknown -> throwError $ MaybeNotFunctional (startOf stp) (endOf stp) stp
  False -> throwError $ NotFunctional (startOf stp) (endOf stp) stp
