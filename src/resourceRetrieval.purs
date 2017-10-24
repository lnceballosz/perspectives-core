module Perspectives.ResourceRetrieval
(fetchPropDefs
  )
where

import Prelude
import Control.Monad.Aff (forkAff)
import Control.Monad.Aff.AVar (makeVar, putVar, takeVar)
import Control.Monad.Eff.Exception (error)
import Control.Monad.Except (throwError)
import Data.Either (Either(..))
import Data.HTTP.Method (Method(..))
import Data.Maybe (Maybe(..))
import Network.HTTP.Affjax (AffjaxRequest, affjax)
import Network.HTTP.StatusCode (StatusCode(..))

import Perspectives.Identifiers (getNamespace, getStandardNamespace, isDomeinURI, isStandardNamespaceCURIE)
import Perspectives.DomeinCache (retrieveDomeinResourceDefinition, stringToPropDefs)
import Perspectives.ResourceTypes(Resource, AsyncResource, AsyncDomeinFile, PropDefs)

-- | Fetch the definition of the resource asynchronously, either from a Domein file or from the user database.
fetchPropDefs :: forall e. Resource -> (AsyncDomeinFile e PropDefs)
--fetchPropDefs :: forall e. Resource -> (AsyncDomeinFile e PropDefs)
fetchPropDefs id = if isDomeinURI id
  then case getNamespace id of
    Nothing -> throwError $ error ("Cannot construct namespace out of id " <> id)
    (Just ns) -> retrieveDomeinResourceDefinition id ns
  else if isStandardNamespaceCURIE id
    then case getStandardNamespace id of
      Nothing -> throwError $ error ("Cannot construct standard namespace out of id " <> id)
      (Just ns) -> retrieveDomeinResourceDefinition id ns
    else fetchResourceDefinition id

-- | Fetch the definition of a resource asynchronously.
fetchResourceDefinition :: forall e. Resource -> (AsyncResource e PropDefs)
fetchResourceDefinition id = do
  v <- makeVar
  _ <- forkAff do
        res <- affjax $ userResourceRequest {url = baseURL <> id}
        case res.status of
          StatusCode 200 ->
            case stringToPropDefs res.response of
              (Left message) -> throwError $ error (message <> " (" <> id <> ")")
              Right pd -> putVar v pd
          otherwise -> throwError $ error ("fetchDefinition " <> id <> " fails: " <> (show res.status) <> "(" <> show res.response <> ")")
  takeVar v

baseURL :: String
baseURL = "http://localhost:5984/user_cor_contexts2/"

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
