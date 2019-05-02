module Perspectives.QueryCombinators where

import Effect.Class (liftEff)
import Control.Monad.Trans.Class (lift)
import Data.Array (cons, difference, elemIndex, findIndex, foldr, head, intersect, last, null, singleton, filter, union) as Arr
import Data.HeytingAlgebra (not, conj, disj, implies) as HA
import Data.Maybe (Maybe(..), fromJust, maybe)
import Data.Traversable (traverse)
import Partial.Unsafe (unsafePartial)
import Perspectives.CoreTypes (MonadPerspectivesQuery, Triple(..), TripleGetter, TripleRef(..), TypedTripleGetter(..), applyTypedTripleGetterToMaybeObject, putQueryVariable, readQueryVariable, tripleObjects, type (**>))

import Perspectives.PerspectivesTypes (PBool(..), typeWithPerspectivesTypes)
import Perspectives.TripleAdministration (getRef, lookupInTripleIndex, memorize, memorizeQueryResults, setMemorizeQueryResults)
import Perspectives.TripleGetterFromObjectGetter (constructTripleGetterFromEffectExpression, constructTripleGetterFromObjectsGetter)
import Prelude (class Eq, class Show, bind, const, discard, eq, flip, id, map, pure, show, ($), (<<<), (<>), (==), (>=>), (>>=))
import Type.Data.Boolean (kind Boolean)
import Unsafe.Coerce (unsafeCoerce)

-- | Return the last element in the chain
-- | `psp:SingularFunction -> psp:SingularFunction`
closure' :: forall o e.
  Eq o =>
  (o **> o) e ->
  (o **> o) e
closure' (TypedTripleGetter nameOfp p) =
  memorize (getter []) name
  where
    getter :: Array o -> o -> MonadPerspectivesQuery (AjaxAvarCache e) (Triple o o e)
    getter cumulator id = do
      t@(Triple{object : objectsOfP}) <- p id
      case Arr.elemIndex id cumulator of
        Nothing -> do
          case Arr.head objectsOfP of
            Nothing -> pure t
            (Just o) -> do
              pt@(Triple{object:bottom}) <- getter (Arr.cons o cumulator) o
              case Arr.head bottom of
                Nothing -> pure t
                otherwise ->
                  pure $ Triple { subject: id
                                , predicate : name
                                , object : bottom
                                , dependencies : []
                                , supports : [typeWithPerspectivesTypes getRef pt]
                                , tripleGetter : getter cumulator}
        otherwise -> pure t

    name :: String
    name = "(closure' " <>  nameOfp <> ")"

mcons :: forall a. Maybe a -> Array a -> Array a
mcons = maybe id Arr.cons

-- | A selection of the results of the second query using the first (boolean) query as a criterium.
-- | `psp:Constraint -> psp:Function -> psp:Function`
filter :: forall s o e.
  (o **> PBool) e ->
  (s **> o) e ->
  (s **> o) e
filter (TypedTripleGetter nameOfc criterium) (TypedTripleGetter nameOfp p) =
  memorize getter name where
    getter :: TripleGetter s o e
    getter id = do
      t@(Triple{object}) <- p id
      (triples :: Array (Triple o PBool e)) <- traverse criterium object
      (objects :: Array o) <- pure $ Arr.foldr addSubjectIfTrue [] triples
      pure $ Triple { subject: id
                    , predicate : name
                    , object : objects
                    , dependencies : []
                    , supports : Arr.cons (typeWithPerspectivesTypes getRef t)
                      (map (typeWithPerspectivesTypes getRef) triples)
                    , tripleGetter : getter}

    addSubjectIfTrue :: Triple o PBool e -> Array o -> Array o
    addSubjectIfTrue (Triple{subject, object}) arr = case Arr.elemIndex (PBool "true") object of
      Nothing -> arr
      _ -> Arr.cons subject arr

    name :: String
    name = "(filter " <> nameOfc <> " " <> nameOfp <> ")"

-- | A selection of the results of the query using a simple (boolean) function as a criterium.
-- Test.Perspectives.TripleGetterConstructors, via getUnqualifiedRolDefinition
filter_ :: forall s o e.
  (o -> Boolean) ->
  String ->
  (s **> o) e ->
  (s **> o) e
filter_ criterium criteriumName (TypedTripleGetter nameOfp p) =
  memorize getter name where
    getter :: TripleGetter s o e
    getter id = do
      t@(Triple{object}) <- p id
      pure $ Triple { subject: id
                    , predicate : name
                    , object : Arr.filter criterium object
                    , dependencies : []
                    , supports : [(typeWithPerspectivesTypes getRef t)]
                    , tripleGetter : getter}
    name :: String
    name = "(filter_" <> nameOfp <> "_" <> criteriumName <> ")"

-- Returns true iff the results of both TripleGetters applied to the same origin yield exactly the same values in the same order.
-- | `psp:Function -> psp:Function -> psp:Function`
equal :: forall s o e.
  Eq o =>
  (s **> o) e ->
  (s **> o) e ->
  (s **> PBool) e
equal (TypedTripleGetter nameOfp p) (TypedTripleGetter nameOfq q) = do
  memorize getter name
  where
    getter :: TripleGetter s PBool e
    getter id = do
      pt@(Triple{object : ps}) <- p id
      qt@(Triple{object : qs}) <- q id
      pure $ Triple { subject: id
                    , predicate : name
                    , object : [PBool $ show $ ps == qs]
                    , dependencies : []
                    , supports : map (typeWithPerspectivesTypes getRef) [pt, qt]
                    , tripleGetter : typeWithPerspectivesTypes getter}

    name = "(equal " <> nameOfp <> " " <> nameOfq <> ")"

cond :: forall s o e.
  (s **> PBool) e ->
  (s **> o) e ->
  (s **> o) e ->
  (s **> o) e
cond cd@(TypedTripleGetter nameOfCondition condition) (TypedTripleGetter nameOfThenPart thenPart) (TypedTripleGetter nameOfElsePart elsePart) = memorize getter name where

  name :: String
  name = "(cond_" <> nameOfCondition <> "_" <> nameOfThenPart <> "_" <> nameOfElsePart <> ")"

  getter :: TripleGetter s o e
  getter id = do
    c@(Triple{object : cs}) <- condition id
    case Arr.head cs of
      Just (PBool "true") -> do
        (Triple{object, supports}) <- thenPart id
        pure $ Triple { subject: id
                      , predicate : name
                      , object : object
                      , dependencies : []
                      , supports : Arr.cons (getRef c) supports
                      , tripleGetter : typeWithPerspectivesTypes getter}
      otherwise -> do
        (Triple{object, supports}) <- elsePart id
        pure $ Triple { subject: id
                      , predicate : name
                      , object : object
                      , dependencies : []
                      , supports : Arr.cons (getRef c) supports
                      , tripleGetter : typeWithPerspectivesTypes getter}

-- Applies the logical binary operator (such as OR, AND and IMPLIES) to the results of two queries applied to the same origin.
logicalBinaryOperator :: forall s e.
  String ->
  (Boolean -> Boolean -> Boolean) ->
  (s **> PBool) e ->
  (s **> PBool) e ->
  ((s **> PBool) e)
logicalBinaryOperator n op (TypedTripleGetter nameOfp p) (TypedTripleGetter nameOfq q) = do
  memorize getter name
  where
    getter :: TripleGetter s PBool e
    getter id = do
      pt@(Triple{object : ps}) <- p id
      qt@(Triple{object : qs}) <- q id
      pure $ Triple { subject: id
                    , predicate : name
                    , object : fromBool $ op (toBool ps) (toBool qs)
                    , dependencies : []
                    , supports : map (typeWithPerspectivesTypes getRef) [pt, qt]
                    , tripleGetter : typeWithPerspectivesTypes getter}
    name :: String
    name = "(" <> n <> nameOfp <> " " <> nameOfq <> ")"

    fromBool :: Boolean -> Array PBool
    fromBool = Arr.singleton <<< PBool <<< show

    toBool :: Array PBool -> Boolean
    toBool s = maybe false ((==) (PBool "true")) (Arr.head s)

conj :: forall s e. (s **> PBool) e -> (s **> PBool) e -> ((s **> PBool) e)
conj = logicalBinaryOperator "conj" HA.conj

disj :: forall s e. (s **> PBool) e -> (s **> PBool) e -> ((s **> PBool) e)
disj = logicalBinaryOperator "disj" HA.disj

implies :: forall s e. (s **> PBool) e -> (s **> PBool) e -> ((s **> PBool) e)
implies = logicalBinaryOperator "implies" HA.implies

-- A set operation applied to the results of two queries applied to the same origin.
-- | `psp:Function -> psp:Function -> psp:Function`
setOperation :: forall s o e. Eq o =>
  (Array o -> Array o -> Array o) ->
  (s **> o) e ->
  (s **> o) e ->
  (s **> o) e
setOperation op (TypedTripleGetter nameOfp p) (TypedTripleGetter nameOfq q) =
  memorize getter name where
    getter :: TripleGetter s o e
    getter id = do
      pt@(Triple{object : ps}) <- p id
      qt@(Triple{object : qs}) <- q id
      pure $ Triple { subject: id
                    , predicate : name
                    , object : (op ps qs)
                    , dependencies : []
                    , supports : map (typeWithPerspectivesTypes getRef) [pt, qt]
                    , tripleGetter : getter}
    name = "(intersect " <> nameOfp <> " " <> nameOfq <> ")"

intersect :: forall s o e. Eq o =>
  (s **> o) e ->
  (s **> o) e ->
  (s **> o) e
intersect = setOperation Arr.intersect

difference :: forall s o e. Eq o =>
  (s **> o) e ->
  (s **> o) e ->
  (s **> o) e
difference = setOperation Arr.difference

union :: forall s o e. Eq o =>
  (s **> o) e ->
  (s **> o) e ->
  (s **> o) e
union = setOperation Arr.union

-- | This function is not a TripleGetter. It can be used to turn a tripleGetter into another
-- | TripleGetter, that returns a boolean value. It does no dependency tracking,
-- | nor memorisation.
isSomething :: forall s o e. Triple s o e -> MonadPerspectivesQuery (AjaxAvarCache e) (Triple s PBool e)
isSomething (Triple r@{subject, predicate, object, dependencies, supports, tripleGetter}) = pure $ Triple
  { subject: subject
  , predicate: predicate
  , object: [PBool $ show (HA.not $ Arr.null object)]
  , dependencies: dependencies
  , supports: supports
  , tripleGetter: typeWithPerspectivesTypes tripleGetter
}

-- | A constraint constructed by checking whether the value of the query is empty.
-- | psp:Function -> psp:Constraint
notEmpty :: forall s o e. (s **> o) e -> (s **> PBool) e
notEmpty (TypedTripleGetter nameOfp p) = memorize getter name where

  getter :: TripleGetter s PBool e
  getter = p >=> isSomething >=> \(Triple t) -> pure (Triple(t {predicate = name, tripleGetter = getter}))

  name :: String
  name = "(notEmpty " <> nameOfp <> ")"

-- | Construct a function that returns a bool in MonadPerspectivesQuery, from a TypedTripleGetter.
toBoolean :: forall s e. (s **> PBool) e -> s -> MonadPerspectivesQuery (AjaxAvarCache e) Boolean
toBoolean tg = flip applyTypedTripleGetterToMaybeObject tg >=> pure <<< maybe false (eq (PBool "true"))

-- | This query constructor takes an argument that can be an PerspectEntiteit id or a simpleValue, and returns
-- | a triple whose object is boolean value.
contains :: forall s o e.
  Eq o => Show s =>
  o ->
  TypedTripleGetter s o e ->
  TypedTripleGetter s PBool e
-- Test.Perspectives.TripleGetterConstructors
contains id' (TypedTripleGetter nameOfp p) = constructTripleGetterFromEffectExpression ("model:Perspectives$contains_" <> typeWithPerspectivesTypes id') f where
  f :: (s -> MonadPerspectivesQuery (AjaxAvarCache e) (Array PBool))
  f id = do
    (Triple{object}) <- p id
    case Arr.elemIndex id' object of
      Nothing -> pure [PBool "false"]
      otherwise -> pure [PBool "true"]

containsMatching :: forall s o e. Show s => (s -> o -> Boolean) -> String -> TypedTripleGetter s o e -> TypedTripleGetter s PBool e
containsMatching criterium criteriumName (TypedTripleGetter nameOfp p) = constructTripleGetterFromEffectExpression ("model:Perspectives$contains" <> criteriumName) f where
  f :: (s -> MonadPerspectivesQuery (AjaxAvarCache e) (Array PBool))
  f subject = do
    (Triple{object}) <- p subject
    pure $ maybe [PBool "true"] (const [PBool "false"]) (Arr.findIndex (criterium subject) object)

-- | Apply to a query and retrieve a boolean query that returns true iff its subject occurs in its result.
-- | `psp:Function -> psp:Constraint`
containedIn :: forall o e. Eq o => Show o => (o **> o) e -> (o **> PBool) e
containedIn (TypedTripleGetter nameOfp p) = constructTripleGetterFromEffectExpression ("model:Perspectives$containedIn_" <> nameOfp) f where
  f :: (o -> MonadPerspectivesQuery (AjaxAvarCache e) (Array PBool))
  f id = do
    (Triple{object}) <- p id
    case Arr.elemIndex id object of
      Nothing -> pure [PBool "false"]
      otherwise -> pure [PBool "true"]

-- | The logical negation of a Constraint.
-- | `psp:Constraint -> psp:Constraint`
not :: forall s e. Show s => (s **> PBool) e -> (s **> PBool) e
not (TypedTripleGetter nameOfp p) = constructTripleGetterFromEffectExpression ("model:Perspectives$not_" <> nameOfp) f where
  f :: (s -> MonadPerspectivesQuery (AjaxAvarCache e) (Array PBool))
  f id = do
    (Triple{object}) <- p id
    case Arr.head object of
      (Just (PBool "true")) -> pure [PBool "false"]
      otherwise -> pure [PBool "true"] -- NOTE: type checking guarantees we only have two values.

not' :: forall s e.  Show s => (s **> String) e -> (s **> String) e
not' (TypedTripleGetter nameOfp p) = constructTripleGetterFromEffectExpression ("model:Perspectives$not_" <> nameOfp) f where
  f :: (s -> MonadPerspectivesQuery (AjaxAvarCache e) (Array String))
  f id = do
    (Triple{object}) <- p id
    case Arr.head object of
      (Just "true") -> pure ["false"]
      otherwise -> pure ["true"] -- NOTE: type checking guarantees we only have two values.

-- | Turn a query of many arguments into a query of a single element.
-- | The selected element depends on the ordering returned by the query.
-- | `psp:Function -> psp:SingularFunction`
lastElement :: forall s o e.  Show s => (s **> o) e -> (s **> o) e
lastElement (TypedTripleGetter nameOfp (p :: TripleGetter s o e)) = constructTripleGetterFromEffectExpression
  ("(lastElement_" <> nameOfp <> ")")
  (p >=> pure <<< (maybe [] Arr.singleton) <<< Arr.last <<< tripleObjects)

-- | Ignore the cache of query results for the given named function, i.e. always compute.
-- | The resulting query returns exactly the same result as the argument query.
-- | `psp:Function -> psp:Function`
ignoreCache :: forall s o e. (s **> o) e -> (s **> o) e
ignoreCache (TypedTripleGetter nameOfp p) = TypedTripleGetter nameOfp go where
  go r =
    do
      remember <- memorizeQueryResults
      setMemorizeQueryResults false
      result <- p r
      setMemorizeQueryResults remember
      pure result


-- | Use the cache of query results for the given named function.
-- | The resulting query returns exactly the same result as the argument query.
-- | `psp:Function -> psp:Function`
useCache :: forall s o e. (s **> o) e -> (s **> o) e
useCache (TypedTripleGetter nameOfp p) = TypedTripleGetter nameOfp go where
  go r =
    do
      remember <- memorizeQueryResults
      setMemorizeQueryResults true
      result <- p r
      setMemorizeQueryResults remember
      pure result

constant :: forall s e. Show s => s -> TypedTripleGetter s s e
constant subject = constructTripleGetterFromObjectsGetter
  ("model:Perspectives$constant$_" <> unsafeCoerce subject)
  (\_ -> pure [subject])

-----------------------------------------------------------
-- VARIABLES
-----------------------------------------------------------
-- | Save the query result under the given name in the query execution environment for future use.
-- | The resulting query returns exactly the same result as the argument query.
-- | `String -> psp:Function -> psp:Function`
var :: forall s o e. String -> (s **> o) e -> (s **> o) e
var name (TypedTripleGetter nameOfp p) = TypedTripleGetter nameOfp go where
  go subject = do
    r <- p subject
    putQueryVariable name $ (typeWithPerspectivesTypes getRef) r
    pure r

-- | Retrieve the result stored in the query environment under the given name.
-- | Returns exactly the same value as the query used to store the value.
-- | `String -> psp:Function`
ref :: forall s o e. String -> TypedTripleGetter s o e
ref name = TypedTripleGetter name (ref' name)

ref' :: forall s o e. String -> s -> MonadPerspectivesQuery (AjaxAvarCache e) (Triple s o e)
ref' name ignore = readQueryVariable name >>= \(TripleRef{subject, predicate}) ->
    do
      mref <- lift $ liftEff $ lookupInTripleIndex subject predicate
      unsafePartial $ pure $ fromJust $ mref

-- | Save the query variable value and restore it after computing the query.
-- | Use this combinator to protect a query variable value.
-- | `String -> psp:Function -> psp:Function`
saveVar :: forall s o e. String -> (s **> o) e -> (s **> o) e
saveVar name (TypedTripleGetter nameOfp p) = TypedTripleGetter ("saveVar_" <> name <> nameOfp) go where
  go subject = do
    variableValue <- readQueryVariable name
    r <- p subject
    putQueryVariable name variableValue
    pure r
