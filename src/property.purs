module Perspectives.Property where

import Prelude
import Control.Monad.Eff.Class (liftEff)
import Data.Argonaut (Json, toArray, toBoolean, toNumber, toString)
import Data.Array (head)
import Data.Either (Either(..), either)
import Data.Maybe (Maybe(..))
import Data.StrMap (lookup)
import Data.Traversable (traverse)
import Perspectives.Resource (Resource, AsyncPropDefs, getPropDefs, representResource)
import Perspectives.ResourceRetrieval (PropDefs(..))

{-
Property values are represented by Arrays, whatever the cardinality of the property.
We need functions that give us an array of values for a given property for a given resource.
However, we also want to memoize that and track the dependency and provide a method for updating the values.
Therefore, we lift these functions over Locations. Hence, Resources are put into Locations.
However, a property whose range is Resource, must be represented by an Array of Resources - not of Locations!
-}

type PropertyName = String

-- | Returns either an Array of types, or one of two messages:
-- | - the value is not an Array;
-- | - not all elements in the Array are of the required type.
-- | Wrap this in a function that annotates the Resource with a property holding the message,
-- | thus lifting the problem into the Domain that is modelled. Then return an empty Array so
-- | the operation may continue.
-- | NOTE: callers may expect a non-zero Array (based on the model). They will have to handle
-- | this error situation.
getPluralGetter :: forall e a.
  (Json -> Maybe a)
  -> PropertyName
  -> Maybe Resource
  -> AsyncPropDefs e (Either String (Array a))
getPluralGetter tofn pn Nothing = pure (Right [])
getPluralGetter tofn pn (Just r) = do
  pde <- getPropDefs r
  case pde of
    (Left err ) -> pure (Left err)
    (Right (PropDefs pd)) ->
      case lookup pn pd of
        Nothing -> pure (Right [])
        -- This must be an array filled with types that the tofn recognizes.
        (Just json) -> case toArray json of
          Nothing ->  pure (Left ("getPluralGetter: property " <> pn <> " of resource " <> show r <> " is not an array!" ))
          (Just arr) -> case traverse tofn arr of
            Nothing ->  pure (Left ("getPluralGetter: property " <> pn <> " of resource " <> show r <> " does not have all elements of the required type!" ))
            (Just a) -> pure (Right a)

-- | Returns either a Maybe value, or an error message if the type could not be recognized as the requested type.
getSingleGetter :: forall e a.
  (Json -> Maybe a)
  -> PropertyName
  -> Maybe Resource
  -> AsyncPropDefs e (Either String (Maybe a))
getSingleGetter tofn pn Nothing = pure (Right Nothing)
getSingleGetter tofn pn (Just r) = do
  pde <- getPropDefs r
  case pde of
    (Left err ) -> pure (Left err)
    (Right (PropDefs pd)) ->
      case lookup pn pd of
        Nothing -> pure (Right Nothing)
        -- This must be an array filled with a single value that the tofn recognizes.
        (Just json) -> case toArray json of
          Nothing -> pure (Left ("getSingleGetter: property " <> pn <> " of resource " <> show r <> " is not an array!" ))
          (Just arr) -> case traverse tofn arr of
            Nothing -> pure (Left ("getSingleGetter: property " <> pn <> " of resource " <> show r <> " has an element that is not of the required type" ))
            (Just a) -> pure (Right $ head a)

applyProperty :: forall a b m. Monad m =>
  (a -> m (Either String b))
  ->( Either String a
      -> m (Either String b) )
applyProperty getter = either (pure <<< Left) getter

-- | in AsyncResource, retrieve either a String or an error message.
getString :: forall e. PropertyName -> Either String (Maybe Resource) -> AsyncPropDefs e (Either String (Maybe String))
getString = applyProperty <<< (getSingleGetter toString)

-- | in AsyncResource, retrieve either an Array of Strings or an error message.
getStrings :: forall e. PropertyName -> Either String (Maybe Resource) -> AsyncPropDefs e (Either String (Array String))
getStrings = applyProperty <<< (getPluralGetter toString)

-- | in AsyncResource, retrieve either a Number or an error message.
getNumber :: PropertyName -> Either String (Maybe Resource) -> AsyncPropDefs () (Either String (Maybe Number))
getNumber = applyProperty <<< (getSingleGetter toNumber)

-- | in AsyncResource, retrieve either an Array of Numbers or an error message.
getNumbers :: PropertyName -> Either String (Maybe Resource) -> AsyncPropDefs () (Either String (Array Number))
getNumbers = applyProperty <<< (getPluralGetter toNumber)

-- | in AsyncResource, retrieve either a Boolean value or an error message.
getBoolean :: PropertyName -> Either String (Maybe Resource) -> AsyncPropDefs () (Either String (Maybe Boolean))
getBoolean = applyProperty <<< (getSingleGetter toBoolean)

-- | in AsyncResource, retrieve either a String or an error message.
getResource :: forall e. PropertyName -> Either String (Maybe Resource) -> AsyncPropDefs e (Either String (Maybe Resource))
getResource = applyProperty <<< getResource' where
  getResource' :: forall ef. PropertyName -> Maybe Resource -> AsyncPropDefs ef (Either String (Maybe Resource))
  getResource' pn Nothing = pure (Right Nothing)
  getResource' pn mr = do
    resIdArray <- (getPluralGetter toString) pn mr
    case resIdArray of
      (Left err) -> pure $ Left err
      (Right arr) -> case head arr of
        Nothing -> pure $ Right Nothing
        (Just id) -> liftEff $ Right <$> (Just <$> (representResource $ id))

-- | in AsyncResource, retrieve either an Array of Resources or an error message.
getResources :: forall e. PropertyName -> Either String (Maybe Resource) -> AsyncPropDefs e (Either String (Array Resource))
getResources = applyProperty <<< getResources' where
  getResources' :: forall ef. PropertyName -> Maybe Resource -> AsyncPropDefs ef (Either String (Array Resource))
  getResources' pn Nothing = pure (Right [])
  getResources' pn mr = do
    resIdArray <- (getPluralGetter toString)  pn mr
    case resIdArray of
      (Left err) -> pure $ Left err
      (Right arr) -> Right <$> (liftEff $ (traverse representResource arr))

-- | in AsyncResource, retrieve either a Date property or an error message.
--getDate :: PropertyName -> Resource -> AsyncResource () (Either String (Array JSDate))
--getDate = getGetter (\json -> Just (readDate $ toForeign json ))
