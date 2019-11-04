module Test.Parsing.Arc.PhaseThree where

import Prelude

import Control.Monad.Free (Free)
import Control.Monad.Trans.Class (lift)
import Data.Array (elemIndex, filter, findIndex, head, length)
import Data.Either (Either(..))
import Data.Lens (_Just, preview, traversed)
import Data.Lens.At (at)
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Lens.Record (prop)
import Data.Maybe (Maybe(..), isJust)
import Data.Newtype (unwrap)
import Data.Symbol (SProxy(..))
import Effect.Class.Console (logShow, log)
import Foreign.Object (lookup)
import Perspectives.CoreTypes (MonadPerspectives, runTypeLevelToArray, (###=))
import Perspectives.DomeinCache (removeDomeinFileFromCache, storeDomeinFileInCache)
import Perspectives.DomeinFile (DomeinFile(..), DomeinFileRecord)
import Perspectives.Identifiers (Namespace, areLastSegmentsOf)
import Perspectives.Parsing.Arc (domain) as ARC
import Perspectives.Parsing.Arc.AST (ContextE(..))
import Perspectives.Parsing.Arc.IndentParser (runIndentParser)
import Perspectives.Parsing.Arc.PhaseThree (phaseThree)
import Perspectives.Parsing.Arc.PhaseTwo (PhaseThree, evalPhaseTwo', lift2, traverseDomain)
import Perspectives.Parsing.Messages (PerspectivesError(..))
import Perspectives.Parsing.TransferFile (domain)
import Perspectives.Query.QueryTypes (Domain(..), QueryFunctionDescription(..))
import Perspectives.Representation.ADT (ADT(..))
import Perspectives.Representation.Action (Action(..))
import Perspectives.Representation.Assignment (AssignmentStatement(..))
import Perspectives.Representation.CalculatedRole (CalculatedRole(..))
import Perspectives.Representation.Calculation (Calculation(..))
import Perspectives.Representation.Class.PersistentType (getPerspectType)
import Perspectives.Representation.Class.Role (propertiesOfADT)
import Perspectives.Representation.Context (Context(..))
import Perspectives.Representation.EnumeratedRole (EnumeratedRole(..))
import Perspectives.Representation.QueryFunction (QueryFunction(..))
import Perspectives.Representation.SideEffect (SideEffect(..))
import Perspectives.Representation.TypeIdentifiers (CalculatedPropertyType(..), CalculatedRoleType(..), ContextType(..), EnumeratedPropertyType(..), EnumeratedRoleType(..), PropertyType(..), RoleType(..), ViewType(..), propertytype2string, roletype2string)
import Perspectives.Representation.View (View(..))
import Perspectives.Types.ObjectGetters (contextAspectsClosure, lookForContextRole, lookForRoleInContext, lookForUnqualifiedPropertyType_, lookForUnqualifiedRoleType, lookForUnqualifiedRoleTypeOfADT, roleInContext)
import Test.Perspectives.Utils (runP)
import Test.Unit (TestF, suite, suiteSkip, test, testOnly, testSkip)
import Test.Unit.Assert (assert)
import Text.Parsing.Parser (ParseError)

withDomeinFile :: forall a. Namespace -> DomeinFile -> MonadPerspectives a -> MonadPerspectives a
withDomeinFile ns df mpa = do
  void $ storeDomeinFileInCache ns df
  r <- mpa
  removeDomeinFileFromCache ns
  pure r

theSuite :: Free TestF Unit
theSuite = suite "Perspectives.Parsing.Arc.PhaseThree" do
  test "TypeLevelObjectGetters" do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "Context : Domain : MyTestDomain\n  Agent : BotRole : MyBot\n    ForUser : MySelf\n    Perspective : Perspective : BotPerspective\n      ObjectRef : AnotherRole\n      Action : Consult : ConsultAnotherRole\n        IndirectObjectRef : AnotherRole\n  Role : RoleInContext : AnotherRole\n    Calculation : context >> Role" domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right df@(DomeinFile dr')) -> do
            -- logShow dr'
            (Context {_id}) <- runP $
              withDomeinFile "model:MyTestDomain" df
                (getPerspectType (ContextType "model:MyTestDomain"))
            assert "Should be able to retrieve the context that represents the domain"
              (_id == ContextType "model:MyTestDomain")
            (CalculatedRole {_id:crid}) <- runP $
              withDomeinFile "model:MyTestDomain" df
                (getPerspectType (CalculatedRoleType "model:MyTestDomain$AnotherRole"))
            assert "Should be able to retrieve the role AnotherRole"
              (crid == CalculatedRoleType "model:MyTestDomain$AnotherRole")

            roles <- runP $
              withDomeinFile "model:MyTestDomain" df
                ((ContextType "model:MyTestDomain") ###= roleInContext)
            assert "roleInContext should be able to retrieve the role AnotherRole from the context model:MyTestDomain."
              case head roles of
                (Just (CR (CalculatedRoleType "model:MyTestDomain$AnotherRole"))) -> true
                otherwise -> false

            contexts <- runP $
              withDomeinFile "model:MyTestDomain" df
                ((ContextType "model:MyTestDomain") ###= contextAspectsClosure)
            assert "contextAspectsClosure applied to model:MyTestDomain should return a set containing model:MyTestDomain"
              case head contexts of
                (Just (ContextType "model:MyTestDomain")) -> true
                otherwise -> false

            roles' <- runP $
              withDomeinFile "model:MyTestDomain" df
                ((ContextType "model:MyTestDomain") ###= (contextAspectsClosure >=> roleInContext))
            assert "(contextAspectsClosure >=> roleInContext) should be able to retrieve the role AnotherRole from the context model:MyTestDomain."
              case head roles' of
                (Just (CR (CalculatedRoleType "model:MyTestDomain$AnotherRole"))) -> true
                otherwise -> false

            roles'' <- runP $
              withDomeinFile "model:MyTestDomain" df
                ((ContextType "model:MyTestDomain") ###= (lookForUnqualifiedRoleType "AnotherRole"))
            assert "lookForUnqualifiedRoleType should be able to retrieve the role AnotherRole from the context model:MyTestDomain."
              (isJust (head roles''))

  -- test "Testing qualifyActionRoles." do
  --   (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "Context : Domain : MyTestDomain\n  Agent : BotRole : MyBot\n    ForUser : MySelf\n    Perspective : Perspective : BotPerspective\n      ObjectRef : AnotherRole\n      Action : Consult : ConsultAnotherRole\n        IndirectObjectRef : AnotherRole\n  Role : RoleInContext : AnotherRole\n    Calculation : blabla" domain

  test "Testing qualifyActionRoles." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  bot: for MySelf\n    perspective on: AnotherRole\n      Consult\n        indirectObject: AnotherRole \n  thing: Role (mandatory, functional) filledBy: YetAnotherRole\n  thing: AnotherRole = Role >> binding\n  thing: YetAnotherRole (mandatory, functional)" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left e) -> assert (show e) false
              (Right correctedDFR) -> do
                -- logShow correctedDFR
                assert "AnotherRole should be a calculatedRole"
                  (let
                    _r = prop (SProxy :: (SProxy "calculatedRoles")) <<< at "model:MyTestDomain$AnotherRole" <<< traversed
                    in case (preview _r correctedDFR) of
                      (Just _) -> true
                      otherwise -> false
                  )
                assert "The Object of the action 'ConsultAnotherRole' should be a qualified CalculatedRole type."
                  (let
                    _o = prop (SProxy :: (SProxy "actions")) <<< at "model:MyTestDomain$MySelf$ConsultAnotherRole" <<< traversed <<< _Newtype <<< prop (SProxy :: (SProxy "object"))
                    in case (preview _o correctedDFR) of
                      (Just (CR (CalculatedRoleType "model:MyTestDomain$AnotherRole"))) -> true
                      -- (Just (CR _)) -> true
                      otherwise -> false
                    )
                assert "The IndirectObject of the action 'ConsultAnotherRole' should be a qualified CalculatedRole type."
                  (let
                    _o = prop (SProxy :: (SProxy "actions")) <<< at "model:MyTestDomain$MySelf$ConsultAnotherRole" <<< traversed <<< _Newtype <<< prop (SProxy :: (SProxy "indirectObject")) <<< _Just
                    in case (preview _o correctedDFR) of
                      (Just (CR (CalculatedRoleType "model:MyTestDomain$AnotherRole"))) -> true
                      -- (Just (CR _)) -> true
                      otherwise -> false
                    )

  test "Testing qualifyActionRoles: External." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  user: Driver\n    perspective on: External\n" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left e) -> assert (show e) false
              (Right correctedDFR) -> do
                -- logShow correctedDFR
                assert "The Object of the action 'ConsultExternal' should be 'model:MyTestDomain$External'."
                  (let
                    _o = prop (SProxy :: (SProxy "actions")) <<< at "model:MyTestDomain$Driver$ConsultExternal" <<< traversed <<< _Newtype <<< prop (SProxy :: (SProxy "object"))
                    in case (preview _o correctedDFR) of
                      (Just (ENR (EnumeratedRoleType "model:MyTestDomain$External"))) -> true
                      -- (Just (CR _)) -> true
                      otherwise -> false
                    )

  test "Testing qualifyActionRoles: UnknownRole." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  user: Gast (mandatory, functional)\n    perspective on: model:System$System$SomeRole: Consult\n" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left (UnknownRole _ _)) -> assert "" true
              otherwise -> assert "Expected the 'UnkownRole' error" false

  test "Testing qualifyActionRoles: RoleMissingInContext." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  user: Gast (mandatory, functional)\n    perspective on: SomeRole: Consult\n" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left (RoleMissingInContext _ _ _)) -> assert "" true
              otherwise -> assert "Expected the 'RoleMissingInContext' error" false

  test "Testing qualifyBindings: correct reference." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  thing: Binder (mandatory, functional) filledBy: Bound\n  thing: Bound (mandatory, functional)" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left e) -> assert (show e) false
              (Right correctedDFR@{enumeratedRoles}) -> do
                -- logShow correctedDFR
                case lookup "model:MyTestDomain$Binder" enumeratedRoles of
                  Nothing -> assert "The model should have role 'model:MyTestDomain$Binder'." false
                  (Just (EnumeratedRole{binding})) -> assert
                    "The binding of 'model:MyTestDomain$Binder' should be 'model:MyTestDomain$Bound'"
                    (binding == ST (EnumeratedRoleType "model:MyTestDomain$Bound"))

  test "Testing qualifyBindings: qualified reference." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  thing: Binder (mandatory, functional) filledBy: model:MyTestDomain$Bound\n  thing: Bound (mandatory, functional)" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left e) -> assert (show e) false
              (Right correctedDFR@{enumeratedRoles}) -> do
                -- logShow correctedDFR
                case lookup "model:MyTestDomain$Binder" enumeratedRoles of
                  Nothing -> assert "The model should have role 'model:MyTestDomain$Binder'." false
                  (Just (EnumeratedRole{binding})) -> assert
                    "The binding of 'model:MyTestDomain$Binder' should be 'model:MyTestDomain$Bound'"
                    (binding == ST (EnumeratedRoleType "model:MyTestDomain$Bound"))

  test "Testing qualifyBindings: prefixed reference." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  use: my for model:MyTestDomain\n  thing: Binder (mandatory, functional) filledBy: my:Bound\n  thing: Bound (mandatory, functional)" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left e) -> assert (show e) false
              (Right correctedDFR@{enumeratedRoles}) -> do
                -- logShow correctedDFR
                case lookup "model:MyTestDomain$Binder" enumeratedRoles of
                  Nothing -> assert "The model should have role 'model:MyTestDomain$Binder'." false
                  (Just (EnumeratedRole{binding})) -> assert
                    "The binding of 'model:MyTestDomain$Binder' should be 'model:MyTestDomain$Bound'"
                    (binding == ST (EnumeratedRoleType "model:MyTestDomain$Bound"))

  test "Testing qualifyBindings: missing reference." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  thing: Binder (mandatory, functional) filledBy: Bount\n  thing: Bound (mandatory, functional)" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left (UnknownRole _ _)) -> assert "" true
              otherwise -> do
                assert "The binding of 'Binder' is not defined and that should have been detected." false

  test "Testing qualifyBindings: two candidates for binding." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  thing: Binder (mandatory, functional) filledBy: Bound\n  thing: Bound (mandatory, functional)\n  case: Nested\n    thing: Bound (mandatory, functional)" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left e@(NotUniquelyIdentifying _ _ _)) -> do
                -- logShow e
                assert "" true
              otherwise -> do
                assert "The binding of 'Binder' is not defined and that should have been detected." false

  test "Testing qualifyPropertyReferences: correct reference." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  thing: Feest (mandatory, functional)\n    property: Datum (mandatory, functional, DateTime)\n    view: ViewOpFeest (Datum)\n" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left e) -> assert (show e) false
              (Right correctedDFR@{views}) -> do
                -- logShow correctedDFR
                case lookup "model:MyTestDomain$Feest$ViewOpFeest" views of
                  Nothing -> assert "There should be a View 'model:MyTestDomain$Feest$ViewOpFeest'" false
                  (Just (View{propertyReferences})) -> case head (filter (\pref -> propertytype2string pref == "model:MyTestDomain$Feest$Datum") propertyReferences) of
                    (Just (ENP (EnumeratedPropertyType "model:MyTestDomain$Feest$Datum"))) -> assert "" true
                    otherwise -> assert "There should be a Property 'model:MyTestDomain$Feest$Datum' in ViewOpFeest" false

  test "Testing qualifyPropertyReferences: incorrect reference." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  thing: Feest (mandatory, functional)\n    property: Datum (mandatory, functional, DateTime)\n    view: ViewOpFeest (Datu)\n" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left (UnknownProperty _ _)) -> assert "" true
              otherwise -> assert "The view refers to a non-existing property 'Datu' and that should be detected." false

  test "Testing qualifyPropertyReferences: reference to property on binding." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  thing: Feest (mandatory, functional) filledBy: FeestVoorbereiding\n    view: ViewOpFeest (Datum)\n  thing: FeestVoorbereiding (mandatory, functional)\n    property: Datum (mandatory, functional, DateTime)\n" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left e) -> assert (show e) false
              (Right correctedDFR@{views}) -> do
                -- logShow correctedDFR
                -- Get the references from the view
                case lookup "model:MyTestDomain$Feest$ViewOpFeest" views of
                  Nothing -> assert "There should be a View 'model:MyTestDomain$Feest$ViewOpFeest'" false
                  (Just (View{propertyReferences})) -> case elemIndex (ENP $ EnumeratedPropertyType "Datum") propertyReferences of
                    Nothing -> assert "There should be an unqualified PropertyType 'Datum' in 'model:MyTestDomain$Feest$ViewOpFeest'" true
                    (Just pr) -> do
                      candidates <- runP $ withDomeinFile "model:MyTestDomain" (DomeinFile correctedDFR) ((EnumeratedRoleType "model:MyTestDomain$Feest") ###= (lookForUnqualifiedPropertyType_ "Datum"))
                      case head candidates of
                        Nothing -> assert "We should be able to find the qualified version of 'Datum'" false
                        (Just (ENP (EnumeratedPropertyType "model:MyTestDomain$FeestVoorbereiding$Datum")))  | length candidates == 1 -> assert "" true
                        otherwise -> assert "There is only one property with local name 'Datum' defined but we've found more?!" false
                      xx <- runP $ withDomeinFile "model:MyTestDomain" (DomeinFile correctedDFR) (propertiesOfADT (ST (EnumeratedRoleType "model:MyTestDomain$Feest")))
                      case head xx of
                        Nothing -> assert "geen properties" false
                        (Just p) | length xx == 1 -> assert "The properties of 'model:MyTestDomain$Feest' should include 'model:MyTestDomain$FeestVoorbereiding$Datum'" (p == ENP (EnumeratedPropertyType "model:MyTestDomain$FeestVoorbereiding$Datum"))
                        otherwise -> assert "There is only one property defined for 'Feest'" false

                case lookup "model:MyTestDomain$Feest$ViewOpFeest" views of
                  Nothing -> assert "There should be a View 'model:MyTestDomain$Feest$ViewOpFeest'" false
                  (Just (View{propertyReferences})) -> case head (filter (\pref -> propertytype2string pref == "model:MyTestDomain$FeestVoorbereiding$Datum") propertyReferences) of
                    (Just (ENP (EnumeratedPropertyType "model:MyTestDomain$FeestVoorbereiding$Datum"))) -> assert "" true
                    otherwise -> assert "There should be a Property 'model:MyTestDomain$FeestVoorbereiding$Datum' in ViewOpFeest" false

  test "Testing qualifyViewReferences: reference to View on Action." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  thing: Feest (mandatory, functional) filledBy: FeestVoorbereiding\n    property: BigParty = context >> Guest >>= count > 10\n    view: ViewOpFeest (Datum, BigParty)\n  thing: FeestVoorbereiding (mandatory, functional)\n    property: Datum (mandatory, functional, DateTime)\n  user: Guest (mandatory, functional)\n    perspective on: Feest (ViewOpFeest) Consult" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x' <- runP $ phaseThree dr'
            case x' of
              (Left e) -> assert (show e) false
              (Right correctedDFR@{actions}) -> do
                case lookup "model:MyTestDomain$Guest$ConsultFeest" actions of
                  Nothing -> assert "There should be an Action 'model:MyTestDomain$Guest$ConsultFeest'." false
                  (Just (Action{requiredObjectProperties})) -> case requiredObjectProperties of
                    (Just (ViewType "model:MyTestDomain$Feest$ViewOpFeest")) -> assert "bla" true
                    otherwise -> assert "There should be an Object View" false

  test "Testing qualifyPropertyReferences: reference to a Calculated Property." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: MyTestDomain\n  thing: Feest (mandatory, functional) filledBy: FeestVoorbereiding\n    property: NrOfGuests (mandatory, functional, Number)\n    property: BigParty = NrOfGuests > 10\n    view: ViewOpFeest (Datum, BigParty)\n  thing: FeestVoorbereiding (mandatory, functional)\n    property: Datum (mandatory, functional, DateTime)\n  user: Guest (mandatory, functional)\n    perspective on: Feest (ViewOpFeest) Consult" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left e) -> assert (show e) false
              (Right correctedDFR@{views}) -> do
                -- logShow correctedDFR
                -- get the action
                case lookup "model:MyTestDomain$Feest$ViewOpFeest" views of
                  Nothing -> assert "There should be a View 'model:MyTestDomain$Feest$ViewOpFeest'." false
                  (Just (View{propertyReferences})) -> case elemIndex (CP (CalculatedPropertyType "model:MyTestDomain$Feest$BigParty")) propertyReferences of
                    Nothing -> assert "There should be a CalculatedProperty 'BigParty' in the View 'ViewOpFeest'" false
                    otherwise -> assert "" true

  test "A Context with a Computed Role." do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain : MyTestDomain\n  thing : MyRole = apicall \"ModellenM\" returns : Modellen\n  case: SubContext\n    thing: Modellen (mandatory, functional)\n" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left e) -> assert (show e) false
              (Right correctedDFR@{calculatedRoles}) -> do
                -- logShow correctedDFR
                case lookup "model:MyTestDomain$MyRole" calculatedRoles of
                  Nothing -> assert "There should be a role 'MyRole'" false
                  Just (CalculatedRole{calculation}) -> do
                    assert "The calculation should have '(RDOM (ST EnumeratedRoleType model:MyTestDomain$SubContext$Modellen))' as its Range"
                      case calculation of
                        (Q (SQD _ _ (RDOM (ST (EnumeratedRoleType "model:MyTestDomain$SubContext$Modellen"))))) -> true
                        otherwise -> false
                    assert "The queryfunction of the calculation should be '(ComputedRoleGetter \"ModellenM\")'"
                      case calculation of
                        (Q (SQD _ (ComputedRoleGetter "ModellenM") _)) -> true
                        otherwise -> false

  test "Action with Condition" do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: Test\n  user: Gast (mandatory, functional)\n    property: Voornaam (mandatory, functional, String)\n    view: AnotherView (Voornaam)\n    perspective on: Party\n      Consult with ViewOnParty\n        subjectView: AnotherView\n        if Party >> Datum > '2019-11-04'\n  thing: Party (mandatory, functional)\n    property: Naam (mandatory, functional, String)\n    property: Datum (mandatory, functional, DateTime)\n    view: ViewOnParty (Naam)\n    view: AnotherView (Datum)" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left e) -> assert (show e) false
              (Right correctedDFR@{actions}) -> do
                -- logShow correctedDFR
                case lookup "model:Test$Gast$ConsultParty" actions of
                  (Just (Action{condition})) -> assert "The condition should have operator '>'"
                    (case condition of
                      (Q (BQD _ (BinaryCombinator "greaterThan") _ _ _)) -> true
                      otherwise -> false)
                  otherwise -> assert "There should be an action Consult Party" false

  test "Bot Action with if-then rule" do
    (r :: Either ParseError ContextE) <- pure $ unwrap $ runIndentParser "domain: Test\n  user: Gast (mandatory, functional)\n    property: Prop2 (mandatory, functional, Number)\n  thing: Party (mandatory, functional)\n    property: Prop1 (mandatory, functional, Number)\n  bot: for Gast\n    perspective on: Party\n      if Party >> Prop1 > 10 then\n        Gast =+ createRole Gast\n        delete Party\n        Prop1 = 20\n" ARC.domain
    case r of
      (Left e) -> assert (show e) false
      (Right ctxt@(ContextE{id})) -> do
        -- logShow ctxt
        case unwrap $ evalPhaseTwo' (traverseDomain ctxt "model:") of
          (Left e) -> assert (show e) false
          (Right (DomeinFile dr')) -> do
            -- logShow dr'
            x <- runP $ phaseThree dr'
            case x of
              (Left e) -> assert (show e) false
              (Right correctedDFR@{actions}) -> do
                -- logShow correctedDFR
                case lookup "model:Test$Gast$ChangeParty" actions of
                  (Just (Action{condition, effect})) -> do
                    assert "The condition should have operator '>'"
                      (case condition of
                        (Q (BQD _ (BinaryCombinator "greaterThan") _ _ _)) -> true
                        otherwise -> false)
                    assert "The effect should have one AssignmentStatement"
                      (case effect of
                        Just (AS stmts) -> length stmts == 3
                        otherwise -> false)
                    assert "One of the assignmentStatements should have operator Delete"
                      (case effect of
                        Just (AS stmts) -> (isJust (findIndex (case _ of
                          DeleteRol (EnumeratedRoleType "model:Test$Party") -> true
                          otherwise -> false) stmts))
                        otherwise -> false)
                    assert "One of the assignmentStatements should have operator AddToRol"
                      (case effect of
                        Just (AS stmts) -> (isJust (findIndex (case _ of
                          AddToRol (EnumeratedRoleType "model:Test$Gast") _ -> true
                          otherwise -> false) stmts))
                        otherwise -> false)
                    assert "One of the assignmentStatements should have operator SetProperty"
                      (case effect of
                        Just (AS stmts) -> (isJust (findIndex (case _ of
                          SetProperty (EnumeratedPropertyType "model:Test$Party$Prop1") _ -> true
                          otherwise -> false) stmts))
                        otherwise -> false)
                  otherwise -> assert "There should be an action Consult Party" false

x :: DomeinFileRecord -> MonadPerspectives (Array RoleType)
x correctedDFR = withDomeinFile "model:MyTestDomain"
  (DomeinFile correctedDFR)
  ((runTypeLevelToArray (ST (ContextType "model:MyTestDomain")) (lookForUnqualifiedRoleTypeOfADT "Guest")))
