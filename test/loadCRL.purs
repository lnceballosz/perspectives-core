module Test.LoadCRL where

import Prelude

import Control.Monad.Free (Free)
import Data.Array (length, null)
import Data.Either (Either)
import Data.Tuple (Tuple)
import Effect.Class.Console (logShow)
import Foreign.Object (Object)
import Perspectives.Actions (setupBotActions)
import Perspectives.CoreTypes ((##=))
import Perspectives.InstanceRepresentation (PerspectContext, PerspectRol)
import Perspectives.Instances.ObjectGetters (getRole)
import Perspectives.LoadCRL (loadAndSaveCrlFile, loadCrlFile)
import Perspectives.Parsing.Messages (PerspectivesError)
import Perspectives.Representation.InstanceIdentifiers (ContextInstance(..))
import Perspectives.Representation.TypeIdentifiers (EnumeratedRoleType(..))
import Test.Perspectives.Utils (runP)
import Test.Unit (TestF, suite, suiteSkip, test, testOnly, testSkip)
import Test.Unit.Assert (assert)

testDirectory :: String
testDirectory = "test"

theSuite :: Free TestF Unit
theSuite = suite "Perspectives.loadCRL" do
  test "Load a file with a context instance in cache" do
    (r :: Either (Array PerspectivesError) (Tuple (Object PerspectContext)(Object PerspectRol))) <- runP $ loadCrlFile "test1.crl" testDirectory
    logShow r
    pure unit

  testOnly "Load a file with a context instance in couchdb" do
    r <- runP do
      r' <- loadAndSaveCrlFile "test1.crl" testDirectory
      if null r'
        then do
          setupBotActions $ ContextInstance "model:User$MyTestCase"
          pure []
        else pure r'
    if null r
      then do
        srole <- runP ((ContextInstance "model:User$MyTestCase") ##= getRole (EnumeratedRoleType "model:Test$TestCase$SomeRole"))
        assert "There shoule be an instance of SomeRole." (length srole == 1)
      else do
        logShow r
        assert "Expected to load a file into couchdb" false

  test "Setup bot action" do
    runP $ setupBotActions $ ContextInstance "model:User$MyTestCase"
