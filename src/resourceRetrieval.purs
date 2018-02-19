module Perspectives.ResourceRetrieval
( fetchPerspectEntiteitFromCouchdb
, saveUnversionedEntiteit
, saveVersionedEntiteit
, saveEntiteit
  )
where

import Prelude
import Control.Monad.Aff (Aff)
import Control.Monad.Aff.AVar (AVar, isEmptyVar, putVar, takeVar)
import Control.Monad.Eff.Exception (error)
import Control.Monad.Except (throwError)
import Data.Either (Either(..))
import Data.Foreign.NullOrUndefined (unNullOrUndefined)
import Data.HTTP.Method (Method(..))
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Network.HTTP.Affjax (AffjaxRequest, AffjaxResponse, affjax, put)
import Perspectives.Couchdb (PutCouchdbDocument, onAccepted)
import Perspectives.Effects (AjaxAvarCache, AvarCache)
import Perspectives.EntiteitAndRDFAliases (ID)
import Perspectives.Identifiers (deconstructNamespace, escapeCouchdbDocumentName, getStandardNamespace, isQualifiedWithDomein, isStandardNamespaceCURIE, isUserURI)
import Perspectives.PerspectEntiteit (class PerspectEntiteit, cacheCachedEntiteit, encode, getRevision', readEntiteitFromCache, representInternally, retrieveFromDomein, retrieveInternally, setRevision)
import Perspectives.User (getUser)


-- | Fetch the definition of the resource asynchronously, either from a Domein file or from the user database.
-- TODO rename
fetchPerspectEntiteitFromCouchdb :: forall e a. PerspectEntiteit a => ID -> Aff (AjaxAvarCache e) a
fetchPerspectEntiteitFromCouchdb id = if isUserURI id
  then fetchEntiteit id
  else if isQualifiedWithDomein id
    then case deconstructNamespace id of
      Nothing -> throwError $ error ("fetchPerspectEntiteitFromCouchdb: Cannot construct namespace out of id " <> id)
      (Just ns) -> retrieveFromDomein id ns
    else if isStandardNamespaceCURIE id
      then case getStandardNamespace id of
        Nothing -> throwError $ error ("fetchPerspectEntiteitFromCouchdb: Cannot construct standard namespace out of id " <> id)
        (Just ns) -> retrieveFromDomein id ns
      else throwError $ error ("fetchPerspectEntiteitFromCouchdb: Unknown URI structure for " <> id)

-- | Fetch the definition of a resource asynchronously.
fetchEntiteit :: forall e a. PerspectEntiteit a => ID -> Aff (AjaxAvarCache e) a
fetchEntiteit id = do
  v <- representInternally id
  -- _ <- forkAff do
  base <- baseURL
  (res :: AffjaxResponse a) <- affjax $ userResourceRequest {url = base <> id}
  onAccepted res.status [200] "fetchEntiteit" $ putVar res.response v
  takeVar v

saveEntiteit :: forall e a. PerspectEntiteit a => ID -> Aff (AjaxAvarCache e) a
saveEntiteit id = do
  pe <- readEntiteitFromCache id
  case unNullOrUndefined $ getRevision' pe of
    Nothing -> saveUnversionedEntiteit id
    otherwise -> saveVersionedEntiteit id pe

-- | A Resource may be created and stored locally, but not sent to the couchdb. Send such resources to
-- | couchdb with this function.
saveUnversionedEntiteit :: forall e a. PerspectEntiteit a => ID -> Aff (AjaxAvarCache e) a
saveUnversionedEntiteit id = do
  (mAvar :: Maybe (AVar a)) <- retrieveInternally id
  case mAvar of
    Nothing -> throwError $ error ("saveUnversionedEntiteit needs a locally stored resource for " <> id)
    (Just avar) -> do
      empty <- isEmptyVar avar
      if empty
        then throwError $ error ("saveUnversionedEntiteit needs a locally stored and filled resource for " <> id)
        else do
          pe <- takeVar avar
          base <- baseURL
          (res :: AffjaxResponse PutCouchdbDocument) <- put (base <> escapeCouchdbDocumentName id) (encode pe)
          onAccepted res.status [200, 201] "saveUnversionedEntiteit"
            $ putVar (setRevision (unwrap res.response).rev pe) avar
          pure pe

saveVersionedEntiteit :: forall e a. PerspectEntiteit a => ID -> a -> Aff (AjaxAvarCache e) a
saveVersionedEntiteit entId entiteit = do
  case (unNullOrUndefined (getRevision' entiteit)) of
    Nothing -> throwError $ error ("saveVersionedEntiteit: entiteit has no revision, deltas are impossible: " <> entId)
    (Just rev) -> do
      base <- baseURL
      (res :: AffjaxResponse PutCouchdbDocument) <- put (base <> escapeCouchdbDocumentName entId <> "?_rev=" <> rev) (encode entiteit)
      onAccepted res.status [200, 201] "saveUnversionedEntiteit"
        $ cacheCachedEntiteit entId (setRevision (unwrap res.response).rev entiteit)

baseURL :: forall e. Aff (AvarCache e ) String
baseURL = getUser >>= \usr -> pure $ "http://localhost:5984/user_" <> usr <> "_contexts2/"

userResourceRequest :: AffjaxRequest Unit
userResourceRequest =
  { method: Left GET
  , url: "http://localhost:5984/user_cor_contexts2/user:xGebruiker"
  , headers: []
  , content: Nothing
  , username: Just "cor"
  , password: Just "geheim"
  , withCredentials: true
  }
