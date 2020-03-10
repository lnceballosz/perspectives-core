module Test.Extern.Couchdb where

import Prelude

import Control.Monad.Error.Class (throwError)
import Control.Monad.Free (Free)
import Control.Monad.Writer (lift, runWriterT)
import Data.Array (elemIndex, head, length, null)
import Data.Maybe (Maybe(..), isJust)
import Data.Newtype (unwrap)
import Effect.Aff.Class (liftAff)
import Effect.Class.Console (logShow)
import Effect.Exception (error)
import Foreign.Object (lookup)
import Perspectives.CollectAffectedContexts (lift2)
import Perspectives.CoreTypes (evalMonadPerspectivesQuery, (##=), (##>))
import Perspectives.Couchdb (designDocumentViews)
import Perspectives.Couchdb.Databases (deleteDatabase, getDesignDocument)
import Perspectives.DependencyTracking.Array.Trans (runArrayT)
import Perspectives.DomeinFile (DomeinFileId(..))
import Perspectives.Extern.Couchdb (addExternalFunctions) as ExternalCouchdb
import Perspectives.Extern.Couchdb (addUserToChannel, createChannel, models, roleInstances, uploadToRepository)
import Perspectives.LoadCRL (loadAndSaveCrlFile)
import Perspectives.Persistent (entitiesDatabaseName)
import Perspectives.Query.Compiler (getPropertyFunction, getRoleFunction)
import Perspectives.Representation.InstanceIdentifiers (ContextInstance(..), RoleInstance(..))
import Perspectives.RunMonadPerspectivesTransaction (runMonadPerspectivesTransaction)
import Perspectives.SetupCouchdb (setModelDescriptionsView, setRoleView)
import Perspectives.TypePersistence.LoadArc (loadCompileAndCacheArcFile, loadCompileAndCacheArcFile', loadCompileAndSaveArcFile)
import Perspectives.User (getCouchdbBaseURL)
import Test.Perspectives.Utils (assertEqual, clearUserDatabase, runP, setupUser)
import Test.Unit (TestF, suite, suiteOnly, suiteSkip, test, testOnly, testSkip)
import Test.Unit.Assert (assert)

testDirectory :: String
testDirectory = "test"

modelDirectory :: String
modelDirectory = "src/model"

theSuite :: Free TestF Unit
theSuite = suite "Perspectives.Extern.Couchdb" do

  test "models" (runP do
    ExternalCouchdb.addExternalFunctions
    modelErrors <- loadCompileAndCacheArcFile "perspectivesSysteem" modelDirectory
    if null modelErrors
      then do
        getModels <- getRoleFunction "model:System$PerspectivesSystem$Modellen"
        models <- ((ContextInstance "model:User$MijnSysteem") ##= getModels)
        logShow models
        liftAff $ assert "There should be some models" (length models > 0)
      else liftAff $ assert ("There are model errors: " <> show modelErrors) false
      )

  test "upload model to repository and to perspect_models from files" (runP do
    ExternalCouchdb.addExternalFunctions
    -- setupUser
    modelErrors <- loadCompileAndSaveArcFile "perspectivesSysteem" modelDirectory
    if null modelErrors
      then do
        cdburl <- getCouchdbBaseURL
        void $ runWriterT $ runArrayT (uploadToRepository (DomeinFileId "model:System") (cdburl <> "repository"))
        -- now run the query that retrieves the modelDescription field of all models in repository.
        -- The result must include "model:System$Model$External"
        (descriptions :: Array RoleInstance) <- evalMonadPerspectivesQuery "" \_ -> models
        logShow descriptions
        liftAff $ assert "There must be the model:System description" (isJust $ elemIndex (RoleInstance "model:User$PerspectivesSystemModel_External") descriptions)
      else liftAff $ assert ("There are model errors: " <> show modelErrors) false
      )

  test "upload model to repository from files" (runP do
    -- setupUser
    cdburl <- getCouchdbBaseURL
    _ <- loadCompileAndCacheArcFile "perspectivesSysteem" modelDirectory
    errors <- loadCompileAndSaveArcFile "simpleChat" modelDirectory
    -- errors <- loadCompileAndSaveArcFile "perspectivesSysteem" modelDirectory
    liftAff $ assert ("There should be no errors" <> show errors) (null errors)
    void $ runWriterT $ runArrayT (uploadToRepository (DomeinFileId "model:SimpleChat") (cdburl <> "repository"))
    -- now run the query that retrieves the modelDescription field of all models in repository.
    -- The result must include "model:System$Model$External"
      )

  test "setModelDescriptionsView" do
    assertEqual "The retrieved document should equal the sent document"
      (do
        setModelDescriptionsView
        mddoc <- getDesignDocument "repository" "defaultViews"
        case mddoc of
          Nothing -> throwError (error "No design doc, impossible!")
          Just ddoc -> do
            views <- pure $ designDocumentViews ddoc
            pure $ isJust $ lookup "modeldescriptions" views)
      true

  test "setRoleView" do
    assertEqual "The retrieved document should equal the sent document"
      (do
        entitiesDatabaseName >>= setRoleView
        mddoc <- entitiesDatabaseName >>= \db -> getDesignDocument db "defaultViews"
        case mddoc of
          Nothing -> throwError (error "No design doc, impossible!")
          Just ddoc -> do
            views <- pure $ designDocumentViews ddoc
            pure $ isJust $ lookup "roleView" views)
      true

--   test "setRoleView" (runP do
--     users <- roleInstances ["model:System$PerspectivesSystem$User"]
--     logShow users
--     liftAff $ assert "There should be two users" (length users == 2)
-- )

  test "createChannel" (runP do
    _ <- loadCompileAndCacheArcFile' "perspectivesSysteem" modelDirectory
    setupUser
    void $ runMonadPerspectivesTransaction createChannel

    -- There must be an instance of "model:System$PerspectivesSystem$Channels" in "model:User$MijnSysteem"
    -- If we can retrieve a value for the property model:System$PerspectivesSystem$User$Channel, everything is OK.
    getter <- getPropertyFunction "model:System$PerspectivesSystem$User$Channel"
    mdbname <- RoleInstance "model:User$MijnSysteem$User_0001" ##> getter
    lift $ logShow mdbname
    liftAff $ assert "We should be able to calculate the value of the Channel property for `me`" (isJust mdbname)
    case mdbname of
      Nothing -> pure unit
      Just dbname -> deleteDatabase (unwrap dbname)
    clearUserDatabase
    )

  test "create channel, add user" (runP do
    -- _ <- loadCompileAndCacheArcFile' "perspectivesSysteem" modelDirectory
    -- setupUser
    achannel <- runMonadPerspectivesTransaction createChannel
    case head achannel of
      Nothing -> liftAff $ assert "Failed to create a channel" false
      Just channel -> do
        -- load a second user
        void $ loadAndSaveCrlFile "userJoop.crl" testDirectory
        void $ runMonadPerspectivesTransaction $ addUserToChannel (RoleInstance "model:User$JoopsSysteem$User_0001") channel

    getter <- getPropertyFunction "model:System$PerspectivesSystem$User$Channel"
    mdbname <- RoleInstance "model:User$JoopsSysteem$User_0001" ##> getter
    lift $ logShow mdbname

    liftAff $ assert "We should be able to calculate the value of the Channel property for `model:User$JoopsSysteem$User_0001`" (isJust mdbname)

    -- Comment out to prepare for a test of Transaction distribution.
    -- case mdbname of
    --   Nothing -> pure unit
    --   Just dbname -> deleteDatabase (unwrap dbname)
    -- clearUserDatabase

    )
