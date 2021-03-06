-- BEGIN LICENSE
-- Perspectives Distributed Runtime
-- SPDX-FileCopyrightText: 2019 Joop Ringelberg (joopringelberg@perspect.it), Cor Baars
-- SPDX-License-Identifier: GPL-3.0-or-later
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
-- Full text of this license can be found in the LICENSE directory in the projects root.

-- END LICENSE

module Perspectives.SetupCouchdb where

import Affjax (put, Request)
import Affjax.RequestBody as RequestBody
import Affjax.ResponseFormat as ResponseFormat
import Control.Monad.AvarMonadAsk (gets)
import Control.Monad.Trans.Class (lift)
import Data.Argonaut (fromString)
import Data.Array (null)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff, try)
import Effect.Aff.Class (liftAff)
import Perspectives.CoreTypes (MonadPerspectives)
import Perspectives.Couchdb (Password, SecurityDocument(..), User, View(..), onAccepted)
import Perspectives.Couchdb.Databases (addViewToDatabase, allDbs, createDatabase, databaseExists, defaultPerspectRequest, ensureAuthentication, setSecurityDocument)
import Perspectives.CouchdbState (MonadCouchdb, CouchdbUser(..), runMonadCouchdb)
import Perspectives.Persistent (entitiesDatabaseName, saveEntiteit_)
import Perspectives.RunPerspectives (runPerspectives)
import Perspectives.User (getCouchdbBaseURL, getHost, getPort, getSystemIdentifier)
import Prelude (Unit, bind, discard, not, pure, unit, void, ($), (<>), (>>=))

-----------------------------------------------------------
-- SETUPCOUCHDBFORFIRSTUSER
-- Notice: Requires Couchdb to be in partymode.
-----------------------------------------------------------
setupCouchdbForFirstUser :: String -> String -> String -> Int -> String -> Aff Unit
setupCouchdbForFirstUser usr pwd host port publicRepo = do
  -- TODO: genereer hier de systeemIdentifier als een guid.
  runMonadCouchdb usr pwd usr host port (createFirstAdmin usr pwd)
  setupPerspectivesInCouchdb usr pwd host port
  runPerspectives usr pwd usr host port publicRepo do
    getSystemIdentifier >>= createUserDatabases
    void addUserToLocalUsers
    entitiesDatabaseName >>= setRoleView

-----------------------------------------------------------
-- SETUPPERSPECTIVESINCOUCHDB
-- Notice: Requires authentication.
-----------------------------------------------------------
-- | If it has not been done before,
-- |  * create system databases
-- |  * initialize the local repository
-- |  * create the database `localusers` and set its security document.
setupPerspectivesInCouchdb :: String -> String -> String -> Int -> Aff Unit
setupPerspectivesInCouchdb usr pwd host port = runMonadCouchdb usr pwd usr host port
  do
    isFirstUser <- databaseExists_ "localusers"
    if not isFirstUser
      then (ensureAuthentication do
        createSystemDatabases
        -- For now, we initialise the repository, too.
        initRepository
        createDatabase "localusers"
        setSecurityDocument "localusers" (SecurityDocument {admins: {names: [], roles: []}, members: {names: [], roles: ["NotExistingRole"]}}))
      else pure unit

databaseExists_ :: forall f. String -> MonadCouchdb f Boolean
databaseExists_ dbname = do
  base <- getCouchdbBaseURL
  databaseExists (base <> dbname)

-----------------------------------------------------------
-- SETUPCOUCHDBFORANOTHERUSER
-- Notice: Requires authentication.
-----------------------------------------------------------
setupCouchdbForAnotherUser :: String -> String -> String -> MonadPerspectives Unit
setupCouchdbForAnotherUser usr pwd publicRepo = do
  createAnotherAdmin usr pwd
  host <- getHost
  port <- getPort
  void $ lift $ createAnotherPerspectivesUser usr pwd host port publicRepo

createAnotherPerspectivesUser :: String -> String -> String -> Int -> String ->Aff CouchdbUser
createAnotherPerspectivesUser usr pwd host port publicRepo =
  -- TODO: genereer hier de systeemIdentifier als een guid.
  runPerspectives usr pwd usr host port publicRepo do
    getSystemIdentifier >>= createUserDatabases
    u <- addUserToLocalUsers
    entitiesDatabaseName >>= setRoleView
    pure u

-----------------------------------------------------------
-- INITREPOSITORY
-----------------------------------------------------------
-- | Create a database "repository" and add a view to it to retrive the external roles of the ModelDescription instances.
initRepository :: forall f. MonadCouchdb f Unit
initRepository = do
  createDatabase "repository"
  setModelDescriptionsView
  setSecurityDocument "repository"
    (SecurityDocument {admins: {names: [], roles: ["_admin"]}, members: {names: [], roles: []}})


-----------------------------------------------------------
-- ADDUSERTOLOCALUSERS
-----------------------------------------------------------
addUserToLocalUsers :: MonadPerspectives CouchdbUser
addUserToLocalUsers = (gets _.userInfo) >>= \u@(CouchdbUser{userName}) -> saveEntiteit_ userName u

-----------------------------------------------------------
-- CREATEFIRSTADMIN
-- Notice: no authentication. Requires Couchdb to be in party mode.
-- Assumes Couchdb to run on http://127.0.0.1:5984.
-- This function is no longer used in Perspectives.
-----------------------------------------------------------
createFirstAdmin :: forall f. User -> Password -> MonadCouchdb f Unit
createFirstAdmin user password = do
  base <- getCouchdbBaseURL
  -- See http://docs.couchdb.org/en/2.1.1/api/server/configuration.html#api-config
  res <- liftAff $ put ResponseFormat.string (base <> "_node/couchdb@localhost/_config/admins/" <> user) (RequestBody.json (fromString password))
  onAccepted res.status [200] "createFirstAdmin"
    $ pure unit

-----------------------------------------------------------
-- CREATEANOTHERADMIN
-- Notice: requires authentication!
-- This function is no longer used in Perspectives.
-----------------------------------------------------------
createAnotherAdmin :: User -> Password -> MonadPerspectives Unit
createAnotherAdmin user password = ensureAuthentication do
  base <- getCouchdbBaseURL
  (rq :: (Request String)) <- defaultPerspectRequest
  res <- liftAff $ put ResponseFormat.string (base <> "_node/couchdb@localhost/_config/admins/" <> user) (RequestBody.json (fromString password))
  liftAff $ onAccepted res.status [200] "createAnotherAdmin" $ pure unit

-----------------------------------------------------------
-- CREATESYSTEMDATABASES
-- Notice: authentication required!
-----------------------------------------------------------
createSystemDatabases :: forall f. MonadCouchdb f Unit
createSystemDatabases = do
  databaseExists_ "_users" >>= \exists -> if not exists then createDatabase "_users" else pure unit
  databaseExists_ "_replicator" >>= \exists -> if not exists then createDatabase "_replicator" else pure unit
  databaseExists_ "_global_changes" >>= \exists -> if not exists then createDatabase "_global_changes" else pure unit

-----------------------------------------------------------
-- CREATEUSERDATABASES
-- Notice: authentication required!
-----------------------------------------------------------
createUserDatabases :: forall f. User -> MonadCouchdb f Unit
createUserDatabases user = do
  createDatabase $ user <> "_entities"
  createDatabase $ user <> "_post"
  createDatabase $ user <> "_models/"
  -- Now set the security document such that there is no role restriction for members.
  setSecurityDocument (user <> "_models/")
    (SecurityDocument {admins: {names: [], roles: ["_admin"]}, members: {names: [], roles: []}})

-----------------------------------------------------------
-- PARTYMODE
-----------------------------------------------------------
-- | PartyMode operationalized as Couchdb having no databases, or failing.
partyMode :: String -> Int -> Aff Boolean
partyMode host port = runMonadCouchdb "authenticator" "secret" "authenticator" host port
  do
    r <- try $ allDbs
    case r of
      Left _ -> pure false
      Right dbs -> pure $ null dbs

-----------------------------------------------------------
-- THE VIEW 'MODELDESCRIPTIONS'
-----------------------------------------------------------
-- | Add a view to the couchdb installation in the 'repository' db.
setModelDescriptionsView :: forall f. MonadCouchdb f Unit
setModelDescriptionsView = do
  addViewToDatabase "repository" "defaultViews" "modeldescriptions" (View {map: modelDescriptions, reduce: Nothing})

-- | Import the view definition as a String.
foreign import modelDescriptions :: String

-----------------------------------------------------------
-- THE VIEW 'ROLE'
-- This view collects instances of a particular role type.
-----------------------------------------------------------
-- | Add a view to the couchdb installation in the 'repository' db.
setRoleView :: forall f. String -> MonadCouchdb f Unit
setRoleView dbname = do
  addViewToDatabase dbname "defaultViews" "roleView" (View {map: roleView, reduce: Nothing})

-- | Import the view definition as a String.
foreign import roleView :: String

-- THE VIEW 'ROLEFROMCONTEXT'
-- This view collects instances of a particular role type, **from a particular context instance**.
-----------------------------------------------------------
-- | Add a view to the couchdb installation in the 'repository' db.
setRoleFromContextView :: forall f. String -> MonadCouchdb f Unit
setRoleFromContextView dbname = do
  addViewToDatabase dbname "defaultViews" "roleFromContext" (View {map: roleFromContextView, reduce: Nothing})

-- | Import the view definition as a String.
foreign import roleFromContextView :: String

-----------------------------------------------------------
-- THE VIEW 'PENDINGINVITATIONS'
-- This view collects instances model:System$Invitation$External.
-----------------------------------------------------------
-- | Add a view to the couchdb installation in the 'repository' db.
setPendingInvitationView :: forall f. String -> MonadCouchdb f Unit
setPendingInvitationView dbname = do
  addViewToDatabase dbname "defaultViews" "pendingInvitations" (View {map: pendingInvitations, reduce: Nothing})

-- | Import the view definition as a String.
foreign import pendingInvitations :: String

-----------------------------------------------------------
-- THE VIEW 'CONTEXTVIEW'
-- This view collects instances of a particular context type.
-----------------------------------------------------------
-- | Add a view to the couchdb installation in the 'repository' db.
setContextView :: forall f. String -> MonadCouchdb f Unit
setContextView dbname = do
  addViewToDatabase dbname "defaultViews" "contextView" (View {map: contextView, reduce: Nothing})

-- | Import the view definition as a String.
foreign import contextView :: String
