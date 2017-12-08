module Test.PrettyPrinter where

import Control.Monad.Aff (Aff)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.StrMap (lookup)
import Perspectives.ContextRoleParser (context) as CRP
import Perspectives.IndentParser (runIndentParser)
import Perspectives.PrettyPrinter (prettyPrint, context)
import Perspectives.ResourceTypes (DomeinFileEffects)
import Perspectives.Syntax2 (EntityCollection(..), NamedEntityCollection(..), PerspectEntity(..))
import Prelude (pure)

test2 :: Aff (DomeinFileEffects()) String
test2 = case runIndentParser "--Commentaar voor :A1\n:Aangifte :A1" CRP.context of
  (Right (NamedEntityCollection ident (EntityCollection j))) -> case lookup ident j of
    Nothing -> pure "onbekende fout"
    (Just (Context c)) -> prettyPrint c context
    (Just (Rol _)) -> pure "er is geen rol"
  otherwise -> pure "fout in expressie"

-- traverse_
--   :: forall a b f m
--    . Applicative m
--   => Foldable f
--   => (a -> m b)
--   -> f a
--   -> m Unit
-- traverse_ f = foldr ((*>) <<< f) (pure unit)
--
-- instance foldableStrMap :: Foldable StrMap where
--   foldl f = fold (\z _ -> f z)
--   foldr f z m = foldr f z (values m)  -- values m :: Array a
--   foldMap f = foldMap (const f)
--
-- -- | Get a list of the values in a map
-- values :: forall a. StrMap a -> Array a
-- values = toArrayWithKey (\_ v -> v)
--
-- -- | Fold the keys and values of a map
-- fold :: forall a z. (z -> String -> a -> z) -> z -> StrMap a -> z
-- fold = _foldM ((#))
