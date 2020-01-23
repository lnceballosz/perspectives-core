module Test.Model.System where

import Prelude

import Control.Monad.Free (Free)
import Control.Monad.Writer (runWriterT)
import Data.Array (length, null)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Effect.Aff.Class (liftAff)
import Effect.Class.Console (logShow)
import Foreign.Object (empty)
import Perspectives.ApiTypes (PropertySerialization(..), RolSerialization(..))
import Perspectives.BasicConstructors (constructAnotherRol)
import Perspectives.ContextAndRole (addRol_gevuldeRollen)
import Perspectives.CoreTypes ((##=))
import Perspectives.Couchdb.Databases (deleteDocument, documentExists)
import Perspectives.DependencyTracking.Array.Trans (runArrayT)
import Perspectives.DomeinFile (DomeinFile, DomeinFileId(..))
import Perspectives.Extern.Couchdb (addExternalFunctions) as ExternalCouchdb
import Perspectives.Extern.Couchdb (uploadToRepository_)
import Perspectives.InstanceRepresentation (PerspectRol(..))
import Perspectives.Persistent (getPerspectRol, removeEntiteit, saveEntiteit)
import Perspectives.Query.Compiler (getRoleFunction)
import Perspectives.Representation.Class.Cacheable (cacheOverwritingRevision, removeInternally)
import Perspectives.Representation.InstanceIdentifiers (ContextInstance(..), RoleInstance(..))
import Perspectives.Representation.TypeIdentifiers (EnumeratedRoleType(..))
import Perspectives.RunMonadPerspectivesTransaction (runMonadPerspectivesTransaction)
import Perspectives.SaveUserData (saveAndConnectRoleInstance)
import Perspectives.TypePersistence.LoadArc (loadArcAndCrl, loadCompileAndSaveArcFile)
import Perspectives.User (getCouchdbBaseURL)
import Test.Perspectives.Utils (clearUserDatabase, runP, setupUser)
import Test.Unit (TestF, suite, suiteSkip, test, testOnly, testSkip)
import Test.Unit.Assert (assert)

testDirectory :: String
testDirectory = "test"

modelDirectory :: String
modelDirectory = "src/model"

theSuite :: Free TestF Unit
theSuite = suite "Model:System" do

  test "models" (runP do
    ExternalCouchdb.addExternalFunctions
    ar <- loadCompileAndSaveArcFile "perspectivesSysteem" modelDirectory
    if not null ar
      then do
        logShow ar
        liftAff $ assert "Model errors" false
      else pure unit
    setupUser
    -- Read and compile the model and its instances, but do not save or cache them.
    r <- loadArcAndCrl "testBotActie" modelDirectory
    case r of
      Left m -> do
        logShow m
        liftAff $ assert "There are modelerrors" false
      Right df -> do
        -- Send the model to the repository.
        cdburl <- getCouchdbBaseURL
        void $ runWriterT $ runArrayT (uploadToRepository_ (DomeinFileId "model:TestBotActie") (cdburl <> "repository") df)

        -- Now remove the model instances from cache!
        void $ removeInternally (RoleInstance "model:User$TestBotActieModel_External")
        void $ removeInternally (ContextInstance "model:User$TestBotActieModel")
        void $ removeInternally (RoleInstance "model:User$MyTest_External")
        void $ removeInternally (ContextInstance "model:User$MyTest")
        void $ removeInternally (ContextInstance "model:User$TestBotActieModel$IndexedContext_0000")

        -- Get the model descriptions from the repository into cache.
        getModels <- getRoleFunction "model:System$PerspectivesSystem$Modellen"
        models <- ((ContextInstance "model:User$MijnSysteem") ##= getModels)

        -- Bind the description of Model:TestBotActie to an instance of ModelsInUse
        descriptionId <- pure "model:User$TestBotActieModel_External"
        binder <- pure $ EnumeratedRoleType "model:System$PerspectivesSystem$ModelsInUse"
        role@(PerspectRol{_id}) <- constructAnotherRol binder "model:User$MijnSysteem"
          (RolSerialization{ properties: PropertySerialization empty, binding: Just descriptionId})
        b <- getPerspectRol (RoleInstance descriptionId)
        void $ cacheOverwritingRevision (RoleInstance descriptionId) (addRol_gevuldeRollen b binder _id)
        void $ saveEntiteit (RoleInstance descriptionId)
        void $ runMonadPerspectivesTransaction (saveAndConnectRoleInstance _id)

        -- Check if model:TestBotActie is in perspect_models
        succes <- documentExists (cdburl <> "perspect_models/model:TestBotActie")
        liftAff $ assert "model:TestBotActie should be in perspect_models" succes

        -- Check if ModelsInUse has two instances.
        getIndexedContexts <- getRoleFunction "model:System$PerspectivesSystem$IndexedContexts"
        n2 <- ((ContextInstance "model:User$MijnSysteem") ##= getIndexedContexts)
        logShow n2
        liftAff $ assert "There should be two instances of IndexedContexts." (length n2 == 2)

        -- remove model:TestBotActie from the repository and from perspect_models
        (_ :: DomeinFile) <- removeEntiteit (DomeinFileId "model:TestBotActie")
        void $ deleteDocument (cdburl <> "repository/model:TestBotActie") Nothing

        -- remove all user instances
        clearUserDatabase
  )