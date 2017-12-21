module Perspectives.DomeinCache
-- ( namespaceToDomeinFileName
-- , retrieveDomeinResourceDefinition )

where

import Control.Monad.Aff (Aff, forkAff)
import Control.Monad.Aff.AVar (AVar, makeEmptyVar, makeVar, putVar, readVar)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Exception (error)
import Control.Monad.Except (throwError)
import Data.Argonaut (jsonParser, toArray, toObject, toString)
import Data.Argonaut.Core (JObject)
import Data.Either (Either(..))
import Data.HTTP.Method (Method(..))
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, fromFoldable, lookup)
import Data.String.Regex (Regex, replace)
import Data.String.Regex.Flags (global)
import Data.String.Regex.Unsafe (unsafeRegex)
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..))
import Network.HTTP.Affjax (AffjaxRequest, affjax)
import Network.HTTP.StatusCode (StatusCode(..))
import Perspectives.GlobalUnsafeStrMap (GLOBALMAP, GLStrMap, new, poke, peek)
import Perspectives.Identifiers (Namespace)
import Perspectives.ResourceTypes (AsyncDomeinFile, PropDefs(..), Resource, CouchdbResource)
import Prelude (Unit, bind, pure, show, unit, ($), (*>), (<>))

-- | A DomeinFile is an immutable map of resource type names to resource definitions in the form of PropDefs.
type DomeinFile = StrMap CouchdbResource

-- | The global index of all cached Domein files, indexed by namespace name, is a mutable unsafe map.
type DomeinCache = GLStrMap (AVar DomeinFile)

domeinCache :: DomeinCache
domeinCache = new unit

storeDomeinFileInCache :: forall e. Namespace -> AVar DomeinFile -> Aff (gm :: GLOBALMAP | e) (AVar DomeinFile)
storeDomeinFileInCache ns df= liftEff $ poke domeinCache ns df *> pure df

-- | Matches all occurrences of : and /.
domeinFileRegex :: Regex
domeinFileRegex = unsafeRegex "[:\\/]" global

-- | Replace all occurrences of : and / by _.
namespaceToDomeinFileName :: String -> String
namespaceToDomeinFileName s = replace domeinFileRegex "_" s

-- | Fetch the definition of a resource asynchronously from its Domein.
retrieveDomeinResourceDefinition :: forall e.
  Resource
  -> Namespace
  -> (AsyncDomeinFile e CouchdbResource)
retrieveDomeinResourceDefinition id ns = do
  f <- retrieveDomeinFile (namespaceToDomeinFileName ns)
  case lookup id f of
    Nothing -> throwError $ error ("retrieveDomeinResourceDefinition: cannot find definition of " <> id <> " in DomeinFile for " <> ns)
    (Just propDefs) -> pure propDefs

retrieveDomeinFile :: forall e. Namespace -> AsyncDomeinFile e DomeinFile
retrieveDomeinFile ns = do
  x <- liftEff $ peek domeinCache ns
  case x of
    Nothing -> do
      v <- makeEmptyVar
      _ <- storeDomeinFileInCache ns v
      _ <- forkAff do
            res <- affjax $ domeinRequest {url = modelsURL <> ns}
            case res.status of
              StatusCode 200 -> case stringToDomeinFile res.response of
                (Left err) -> throwError $ error err
                (Right (df :: DomeinFile)) -> putVar df v
              otherwise -> throwError $ error ("retrieveDomeinFile " <> ns <> " fails: " <> (show res.status) <> "(" <> show res.response <> ")")
      readVar v
    (Just v) -> readVar v

stringToDomeinFile :: String -> Either String DomeinFile
stringToDomeinFile s = case jsonParser s of
  (Left err) -> Left $ "stringToDomeinFile: cannot parse: " <> s
  (Right file) ->
    case toObject file of
      Nothing -> Left "stringToDomeinFile: received file is not a JSON object!"
      (Just obj) -> case lookup "resources" obj of
        Nothing -> Left "stringToDomeinFile: model object does not have a 'resources' property!"
        (Just json) -> case toArray json of
          Nothing -> Left "stringToDomeinFile: value of 'resources' property is not an array!"
          (Just arr) -> case traverse toObject arr of
            Nothing -> Left "stringToDomeinFile: not all array elements are objects!"
            (Just objArr) -> case objArrayToDomeinFile objArr of
              Nothing -> Left "stringToDomeinFile: not all json objects in the array have an appropriate id!"
              (Just df) -> Right df

objArrayToDomeinFile :: Array JObject -> Maybe DomeinFile
objArrayToDomeinFile arr = case traverse g arr of
  Nothing -> Nothing
  (Just tuples) -> Just $ fromFoldable tuples
  where
  g :: JObject -> Maybe (Tuple String CouchdbResource)
  g def = case lookup "id" def of
    Nothing -> Nothing
    (Just json) -> case toString json of
      Nothing -> Nothing
      (Just id ) -> Just (Tuple id def)

-- | There can be two error scenarios here: either the returned string cannot be parsed
-- | by JSON.parse, or the resulting json is not an object. Neither is likely, because Couchdb
-- | will not store such documents.
stringToPropDefs :: String -> Either String CouchdbResource
stringToPropDefs s = case jsonParser s of
    (Left err) -> Left $ "stringToPropDefs: cannot parse: " <> s
    (Right json) ->
      case toObject json of
        Nothing -> Left $ "stringToPropDefs: parsed json is not an object!"
        (Just obj) -> Right obj

modelsURL :: String
modelsURL = "http://localhost:5984/models2/"

domeinRequest :: AffjaxRequest Unit
domeinRequest =
  { method: Left GET
  , url: "http://localhost:5984/models2model_SysteemDomein_"
  , headers: []
  , content: Nothing
  , username: Just "cor"
  , password: Just "geheim"
  , withCredentials: true
  }
