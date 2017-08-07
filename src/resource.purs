module Perspectives.Resource where

import Prelude
import Control.Monad.Aff (Aff)
import Control.Monad.Aff.AVar (AVar, makeVar, putVar, peekVar, AVAR)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.ST (ST)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, empty, lookup)
import Data.StrMap.ST (poke, STStrMap)
import Network.HTTP.Affjax (AJAX)
import Partial.Unsafe (unsafePartial)
import Perspectives.Location (Location, THEORYDELTA, locate, setLocationValue)
import Perspectives.ResourceRetrieval (fetchPropDefs)
import Perspectives.ResourceTypes(ResourceLocation(..), Resource(..), PropDefs, ResourceId)

-- | The global index of all Resource-Location pairs, indexed by ResourceId.
type ResourceIndex = StrMap ResourceLocation
resourceIndex :: ResourceIndex
resourceIndex = empty

-- | From a Resource, find its Location.
resourceLocation :: Resource -> Location Resource
resourceLocation (Resource{id}) = unsafePartial resourceLocation' id where
    resourceLocation' :: Partial => String -> Location Resource
    resourceLocation' rid = case lookup id resourceIndex of
      (Just (ResourceLocation{ loc })) -> loc

-- | Look up a resource or create a new resource without definition and store it in the index.
representResource :: forall e. ResourceId -> Eff (st :: ST ResourceIndex | e) Resource
representResource id = case lookup id resourceIndex of
  Nothing -> storeResourceInIndex $ Resource{ id: id, propDefs: Nothing}
  (Just (ResourceLocation {res})) -> pure res

-- | Create a new resource with definitions and store it in the index.
newResource :: ResourceId -> PropDefs -> Aff ( st :: ST ResourceIndex, avar :: AVAR ) Resource
newResource id defs = do
    v <- makeVar
    _ <- putVar v defs
    res <- pure (Resource{ id: id, propDefs: Just v})
    _ <- liftEff $ storeResourceInIndex res
    pure res

storeResourceInIndex :: forall e. Resource -> Eff (st :: ST ResourceIndex | e) Resource
storeResourceInIndex res@(Resource{id}) =
  let loc = locate res
  in do
    ri <- thawST' resourceIndex
    poke ri id (ResourceLocation{ res: res, loc: loc}) *> pure res

-- | A version of thawST that does not copy.
foreign import thawST' :: forall a h r. StrMap a -> Eff (st :: ST h | r) (STStrMap h a)

addPropertyDefinitions :: forall e. Resource -> AVar PropDefs -> Eff (td :: THEORYDELTA, st :: ST ResourceIndex | e) Unit
addPropertyDefinitions r@(Resource{id}) av =
  let
    loc = resourceLocation r
    newR = Resource{ id: id, propDefs: (Just av)}
    newResourceLocation = ResourceLocation{ res: r, loc: loc }
  in do
    _ <- setLocationValue loc newR
    ri <- thawST' resourceIndex
    _ <- poke ri id newResourceLocation
    pure unit

type AsyncPropDefs e a = Aff (td :: THEORYDELTA, st :: ST ResourceIndex, avar :: AVAR, ajax :: AJAX | e) a

-- | Get the property definitions of a Resource.
getPropDefs :: forall e. Resource -> AsyncPropDefs e (Either String PropDefs)
getPropDefs r@(Resource {id, propDefs}) = case propDefs of
  Nothing -> do
              def <- fetchPropDefs id
              case def of
                (Left err) -> pure (Left err)
                (Right pd ) -> do
                    av <- makeVar
                    -- set av as the value of propDefs in the resource!
                    _ <- liftEff $ (addPropertyDefinitions r av)
                    putVar av pd
                    pure (Right pd)
  (Just avar) -> do
                  pd <- peekVar avar
                  pure (Right pd)

-----------------------------------------------------------------------------------------------
-- | EXAMPLES
-----------------------------------------------------------------------------------------------
{-r1 :: Resource
r1 = Resource{
  id : "r1",
  propDefs : PropDefs $ fromFoldable [ (Tuple "maten" (toForeign [ 1, 2])), (Tuple "naam" (toForeign ["Joop", "Johannes"]))]
}

j :: Resource
j = representResource "Joop" Nothing

r1Stored :: Resource
r1Stored = representResource "r1" (Just propDefs) where (Resource{propDefs}) = r1
-}