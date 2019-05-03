module Test.Perspectives.TestBotActie (theSuite) where

import Prelude

import Control.Monad.Aff (Milliseconds(..), delay)
import Control.Monad.Eff.Exception (error)
import Control.Monad.Free (Free)
import Control.Monad.Trans.Class (lift)
import Data.Array (length)
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Perspectives.Actions (compileBotAction, constructActionFunction, getBindingOfRol, setProperty')
import Perspectives.CoreTypes (type (~~>), (##>))
import Perspectives.DataTypeObjectGetters (rolBindingDef)
import Perspectives.DataTypeTripleGetters (binnenRol, buitenRol, identity)
import Perspectives.Identifiers (psp)
import Perspectives.ModelBasedObjectGetters (buitenRolBeschrijvingDef, propertyIsFunctioneel, propertyIsVerplicht, rolDef, rolIsVerplicht)
import Perspectives.ObjectGetterConstructors (directAspectProperties, getContextRol, getInternalProperty, getRoleBinders)
import Perspectives.ObjectsGetterComposition ((/-/))
import Perspectives.PerspectivesState (tripleQueue)
import Perspectives.PerspectivesTypes (BuitenRol(..), ContextDef(..), ContextRol(..), PBool(..), PString(..), PropertyDef(..), RolDef(..), Value(..))
import Perspectives.QueryCompiler (constructQueryFunction)
import Perspectives.RunMonadPerspectivesQuery ((##), (##=))
import Perspectives.SaveUserData (removeUserData)
import Perspectives.StringTripleGetterConstructors (StringTypedTripleGetter)
import Perspectives.TheoryChange (propagate)
import Perspectives.TripleGetterComposition (followedBy)
import Perspectives.Utilities (onNothing)
import Test.Perspectives.Utils (TestEffects, TestModelLoadEffects, assertEqual, loadTestModel, unLoadTestModel, p, u, assertEqualWithPropagation)
import Test.Unit (TestF, suite, suiteSkip, test, testOnly, testSkip)

t :: String -> String
t s = "model:TestOGC$" <> s

t2 :: String -> String
t2 s = "model:TestTDC$" <> s

tba :: String -> String
tba s = "model:TestBotActie$" <> s

theSuite :: forall e. Free (TestF (TestEffects (TestModelLoadEffects e))) Unit
theSuite = suite "TestBotActie" do
  test "Setting up" do
    loadTestModel "testBotActie.crl"
    loadTestModel "testbotInstantie.crl"

  test "constructActionFunction" do
    assertEqual "The action function copies the value of $v1 into $v2"
      do
        meffect <- (tba "Test$botCopiesV1ToV2") ##> getContextRol (RolDef $ p "Actie$effect") /-/ rolBindingDef
        case meffect of
          Nothing -> pure []
          (Just effect) -> do
            f <- (constructActionFunction effect (binnenRol `followedBy` unwrap))
            void $ f (u "test1") (PBool "true")
            getInternalProperty (PropertyDef $ tba "Test$binnenRolBeschrijving$v2") (u "test1")
      [Value "aap"]

  test "nAryOperator-defined property $propsEqual of usr:test1 is false" do
    assertEqual "$propsEqual"
      do
        propsEqual <- constructQueryFunction (tba "Test$binnenRolBeschrijving$propsEqual")
        (u "test1") ##= propsEqual
      ["false"]

  test "testing the action condition" do
    assertEqual "The condition of botCopiesV1ToV2 evalates to true for test1."
      do
        condition <- onNothing
          (error "Cannot find condition")
          (tba "Test$botCopiesV1ToV2" ##> getBindingOfRol (psp "Actie$condition"))
        conditionQuery <- constructQueryFunction condition
        (u "test1") ##= conditionQuery
      ["true"]

  testOnly "compileBotAction" do
    loadTestModel "testBotActie.crl"
    loadTestModel "testbotInstantie.crl"
    assertEqualWithPropagation "Apply the botAction to the context usr:test1 to copy the value of $v1 to $v2"
      do
        botaction <- (compileBotAction (ContextDef $ tba "Test$botCopiesV1ToV2") (u "test1"))
        void ((u "test1") ## botaction)
        getInternalProperty (PropertyDef $ tba "Test$binnenRolBeschrijving$v2") (u "test1")
      [Value "aap"]
      1000.0
    -- assertEqual "$propsEqual should now be true"
    --   do
    --     propsEqual <- constructQueryFunction (tba "Test$binnenRolBeschrijving$propsEqual")
    --     (u "test1") ##= propsEqual
    --   ["true"]
    -- assertEqualWithPropagation "Setting $v1 to a new value causes $propsEqual to be false"
    --   do
    --     void $ setProperty' (tba "Test$binnenRolBeschrijving$v1") "noot" (u "test1_binnenRol")
    --     lift $ delay (Milliseconds 100.0)
    --     propsEqual <- constructQueryFunction (tba "Test$binnenRolBeschrijving$propsEqual")
    --     (u "test1") ##= propsEqual
    --   ["false"]
    --   1000.0
    -- assertEqual "Setting $v1 to a new value caused the condition to become true"
    --   do
    --     condition <- onNothing
    --       (error "Cannot find condition")
    --       (tba "Test$botCopiesV1ToV2" ##> getBindingOfRol (psp "Actie$condition"))
    --     conditionQuery <- constructQueryFunction condition
    --     (u "test1") ##= conditionQuery
    --   ["true"]

    -- TODO. De volgende test faalt. Hoewel de conditie van waarde verandert, wordt de actie niet opnieuw uitgevoerd.
    -- assertEqual "Setting $v1 to a new value caused $v2 to assume the same value"
    --   do
    --     r <- getInternalProperty (PropertyDef $ tba "Test$binnenRolBeschrijving$v2") (u "test1")
    --     removeUserData [BuitenRol "model:User$test1_buitenRol"]
    --     pure r
    --   [Value "noot"]

  -- testOnly "Add a test!" do
  --   loadTestModel "testBotActie.crl"
  --
  --   unLoadTestModel "model:TestBotActie"

  -- test "Tearing down" do
  --   unLoadTestModel "model:TestBotActie"
  pure unit