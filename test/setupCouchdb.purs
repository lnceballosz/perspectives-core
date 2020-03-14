module Test.SetupCouchdb where

import Prelude

import Control.Monad.Free (Free)
import Effect.Aff.Class (liftAff)
import Perspectives.Couchdb (SecurityDocument(..))
import Perspectives.Couchdb.Databases (setSecurityDocument)
import Perspectives.SetupCouchdb (setupCouchdbForAnotherUser, setupCouchdbForFirstUser)
import Test.Perspectives.Utils (runP)
import Test.Unit (TestF, suite, suiteOnly, suiteSkip, test, testOnly, testSkip)
import Test.Unit.Assert (assert)

testDirectory :: String
testDirectory = "/Users/joopringelberg/Code/perspectives-core/test"

theSuite :: Free TestF Unit
theSuite = suiteSkip "Perspectives.SetupCouchdb" do
  test "setupCouchdbForFirstUser" do
    setupCouchdbForFirstUser "cor" "geheim"
    assert "Just ran 'setupCouchdbForFirstUser'" true

  test "setupCouchdbForAnotherUser" (runP do
    setupCouchdbForAnotherUser "cor" "geheim"
    liftAff $ assert "Just ran 'setupCouchdbForAnotherUser'" true)

  testSkip "set security document on localusers" (runP do
    (setSecurityDocument "localusers" (SecurityDocument {admins: {names: [], roles: []}, members: {names: ["authenticator"], roles: []}}))
    liftAff $ assert "Set the security document" true
)
