module Perspectives.Representation.ADT where

import Data.Array (elemIndex, filter, head, intersect, uncons, union)
import Data.Foldable (foldMap, foldl)
import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Eq (genericEq)
import Data.Generic.Rep.Show (genericShow)
import Data.Maybe (Maybe(..))
import Data.Monoid.Conj (Conj(..))
import Data.Monoid.Disj (Disj(..))
import Data.Newtype (unwrap)
import Data.Traversable (traverse)
import Foreign (unsafeFromForeign, unsafeToForeign)
import Perspectives.Representation.TypeIdentifiers (EnumeratedRoleType)
import Prelude (class Eq, class Monad, class Show, bind, flip, map, notEq, pure, ($), (==))
import Simple.JSON (class ReadForeign, class WriteForeign, readJSON', writeJSON)

-- | An Algebraic Data Type to represent the type of roles with more than one type of binding.
-- | `a` invariably is a newtype representing entities on the type level of Perspectives.
-- | The dataconstructor ST is by construction used just with `EnumeratedRoleType`.
-- | SUM x NOTYPE = NOTYPE.
-- | PROD x NOTYPE = x
data ADT a = ST a | SUM (Array (ADT a)) | PROD (Array (ADT a)) | NOTYPE

derive instance genericRepBinding :: Generic (ADT a) _

instance showBinding :: (Show a) => Show (ADT a) where
  show b = genericShow b

instance eqBinding :: (Eq a) => Eq (ADT a) where
  eq b1 b2 = genericEq b1 b2

instance writeForeignBinding :: (WriteForeign a) => WriteForeign (ADT a) where
  writeImpl b = unsafeToForeign (writeJSON b)

instance readForeignBinding :: (ReadForeign a) => ReadForeign (ADT a) where
  readImpl b = readJSON' (unsafeFromForeign b)

class Reducible a b where
  reduce :: forall m. Monad m => (a -> m b) -> ADT a -> m b

-- | Reduce an `ADT EnumeratedRoleType` with `f :: EnumeratedRoleType -> MP Boolean`
-- | Does **not** take the binding of a role into account.
instance reducibleToBool :: Reducible EnumeratedRoleType Boolean where
  reduce f (ST a) = f a
  reduce f (SUM adts) = do
    (bools :: Array Boolean) <- traverse (reduce f) adts
    pure $ unwrap $ foldMap Conj bools
  reduce f (PROD adts) = do
    (bools :: Array Boolean) <- traverse (reduce f) adts
    pure $ unwrap $ foldMap Disj bools
  reduce f NOTYPE = pure false

-- | Reduce an `ADT a` with `f :: a -> MP (Array b)`
-- | Includes the binding of a role: this means that the computation recurses on the binding.
-- | This is expected behaviour for functions like propertiesOfADT, viewsOfADT and roleAspectsOfADT.
instance reducibleToArray :: Eq b => Reducible a (Array b) where
  reduce f (ST a) = f a
  reduce f (SUM adts) = do
    (arrays :: Array (Array b)) <- traverse (reduce f) adts
    pure $ foldl intersect [] arrays
  reduce f (PROD adts) = do
    (arrays :: Array (Array b)) <- traverse (reduce f) adts
    pure $ foldl union [] arrays
  reduce f NOTYPE = pure []

-- | Reduce an `ADT a` with `f :: a -> MP (ADT b)`
-- | `reduce f` then has type `ADT a` -> MP (ADT b)`.
instance reducibletoADT :: Eq b => Reducible a (ADT b) where
  reduce f (ST et) = f et
  reduce f (SUM adts) = do
    (x :: Array (ADT b)) <- traverse (reduce f) adts
    -- Simplify: all members of the SUM must have a binding, otherwise the binding of the SUM is NOTYPE.
    case elemIndex NOTYPE x of
      Nothing -> pure NOTYPE
      otherwise -> pure $ SUM x
  reduce f (PROD adts) = do
    (x :: Array (ADT b)) <- traverse (reduce f) adts
    -- Simplify: remove all NOTYPE's.
    r <- pure $ filter (notEq NOTYPE) x
    case uncons r of
      -- SUM [] == NOTYPE
      Nothing -> pure NOTYPE
      (Just {head : hd, tail}) -> case head tail of
        -- SUM [a] = a
        Nothing -> pure hd
        otherwise -> pure $ PROD r
  reduce f NOTYPE = pure NOTYPE

-- | `p lessThenOrEqualTo q` means: p is less specific than q.
-- | This function is semantically correct only on a fully expanded type: use `Perspectives.Representation.Class.Role.fullType`.
lessThenOrEqualTo :: forall a. Eq a => ADT a -> ADT a -> Boolean
lessThenOrEqualTo (ST x) (ST y) = x == y
lessThenOrEqualTo (SUM adts) q = let
  (bools :: Array Boolean) = map (flip lessThenOrEqualTo q) adts
  in unwrap $ foldMap Conj bools
lessThenOrEqualTo (PROD adts) q = let
  (bools :: Array Boolean) = map (flip lessThenOrEqualTo q) adts
  in unwrap $ foldMap Disj bools
-- p = NOTYPE
-- q = _
-- lessThenOrEqualTo _ NOTYPE = false
-- (q <= p) = false
-- not (q <= p) = true
-- not (q <= p) ==> q > p ==> p <= q
lessThenOrEqualTo NOTYPE _ = true
-- p must be equal to every member of q (note that lessThenOrEqualTo is in effect 'equalTo' when p or q is an ST).
lessThenOrEqualTo p@(ST _) (SUM adts) = let
  (bools :: Array Boolean) = map (lessThenOrEqualTo p) adts
  in unwrap $ foldMap Conj bools
-- p must be equal to one of the members of q.
lessThenOrEqualTo p@(ST _) (PROD adts) = let
  (bools :: Array Boolean) = map (lessThenOrEqualTo p) adts
  in unwrap $ foldMap Disj bools
-- NOTYPE is not equal to (ST _).
lessThenOrEqualTo (ST _) NOTYPE = false
