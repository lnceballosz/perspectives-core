
-- | NetworkMonad is specialization of Monad.
-- |
-- | **Copyright** Perspectives-IT 2017
-- |
-- | **Author** Joop Ringelberg
-- | test.

module Perspectives.NetworkMonad where

import Control.Monad
import Delta (Delta(..))

-- | Notice the extra parameter of type Update, a function that will produce an Array of Deltas to be performed on m b.
-- | Notice, too, that the Delta is in terms of the type that is wrapped in Monad m. E.g., if a is Array x, we have
-- | Delta Array x and not Delta a!
class Monad m <= NetworkMonad m where
	bindAndUpdate :: forall a b. m a -> (a -> m b) -> (Delta a -> b -> Array (Delta b)) -> m b

type Update a b = Delta a -> b -> Array (Delta b)

-- | Produces an Update function from a function from a to b.
singleValueDelta :: forall a b. (a -> b) -> Delta a -> b -> Array (Delta b)
singleValueDelta f (Erbij a) payload = [Erbij (f a)]
singleValueDelta f (Eraf a) payload = []

{-}
arrayMapDelta :: forall a b. (a -> b) -> Delta a -> b -> Array Delta b
arrayMapDelta f (Erbij [a]) payload = [Erbij [(f a)]]
arrayMapDelta f (Eraf [a]) payload = [Eraf [(f a)]]

arrayBindDelta :: forall a b. ( a -> b) -> Delta a -> b -> b
arrayBindDelta f (Erbij [a]) payload = first <<< map (\d -> nettoAddTo d) (f a)
arrayBindDelta f (Eraf [a]) payload = first <<< map (\d -> removeFrom d) (f a)

foreign import nettoAddTo :: Array a -> a -> Array a
foreign import removeFrom :: Array a -> a -> Array a
-}
