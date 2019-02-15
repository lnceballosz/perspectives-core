module Perspectives.TripleGetterConstructors where

import Perspectives.EntiteitAndRDFAliases

import Control.Monad.Aff.Class (liftAff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.State (lift)
import Data.Array (elemIndex, foldMap)
import Data.Maybe (Maybe(..), maybe)
import Data.Monoid.Disj (Disj(..))
import Data.Newtype (alaF)
import Perspectives.CoreTypes (MonadPerspectivesQuery, ObjectsGetter, Triple(..), TripleGetter, TripleRef(..), TypedTripleGetter(..))
import Perspectives.DataTypeObjectGetters (rolType)
import Perspectives.Effects (AjaxAvarCache)
import Perspectives.Identifiers (LocalName, deconstructLocalNameFromDomeinURI)
import Perspectives.ObjectGetterConstructors (searchExternalProperty, getGebondenAls, getInternalProperty, getProperty, getRol, getRolFromPrototypeHierarchy, searchExternalProperty, searchInternalProperty, getRolWithPropertyFromRolTelescope)
import Perspectives.ObjectsGetterComposition (composeMonoidal)
import Perspectives.TripleAdministration (addToTripleIndex, lookupInTripleIndex, memorizeQueryResults)
import Perspectives.TripleGetterComposition ((>->))
import Prelude (bind, const, pure, ($), (<<<), (<>), (>=>), (==))

constructTripleGetterFromEffectExpression :: forall e.
  PropertyName ->
  (ID -> MonadPerspectivesQuery (AjaxAvarCache e) (Array String)) ->
  TypedTripleGetter e
constructTripleGetterFromEffectExpression pn objectsGetter = TypedTripleGetter pn tripleGetter where
  tripleGetter :: TripleGetter e
  tripleGetter id = do
    b <- memorizeQueryResults
    if b
      then do
        mt <- lift $ liftAff $ liftEff (lookupInTripleIndex id pn)
        case mt of
          Nothing -> do
            (object :: Array String) <- objectsGetter id
            lift $ liftAff $ liftEff (addToTripleIndex id pn object [] [] tripleGetter)
          (Just t) -> pure t
      else do
        (object :: Array String) <- objectsGetter id
        pure (Triple{ subject: id
                  , predicate: pn
                  , object: object
                  , dependencies: []
                  , supports : []
                  , tripleGetter: tripleGetter
                  })

-- | Construct a TripleGetter from an ObjectsGetter, that is supported by a Triple returned by an arbitrary
-- | TripleGetter. In this way we can insert a computed (rather than calculated by a query) Triple in the
-- | dependency tracking store and have it recomputed when the support changes value.
constructTripleGetterWithArbitrarySupport :: forall e.
  PropertyName ->
  (ID -> MonadPerspectivesQuery (AjaxAvarCache e) (Array String)) ->
  TypedTripleGetter e ->
  TypedTripleGetter e
constructTripleGetterWithArbitrarySupport pn objectsGetter (TypedTripleGetter _ supportGetter) = TypedTripleGetter pn tripleGetter where
  tripleGetter :: TripleGetter e
  tripleGetter id = do
    b <- memorizeQueryResults
    if b
      then do
        mt <- lift $ liftAff $ liftEff (lookupInTripleIndex id pn)
        case mt of
          Nothing -> do
            (object :: Array String) <- objectsGetter id
            (Triple{subject, predicate}) <- supportGetter id
            lift $ liftAff $ liftEff (addToTripleIndex id pn object [] [TripleRef {subject: subject, predicate: predicate}] tripleGetter)
          (Just t) -> pure t
      else do
        (object :: Array String) <- objectsGetter id
        pure (Triple{ subject: id
                  , predicate: pn
                  , object: object
                  , dependencies: []
                  , supports : []
                  , tripleGetter: tripleGetter
                  })

-- | Construct a memorizing triple getter from an arbitrary ObjectsGetter. This function is used, a.o.,
-- | to construct getters for the properties of contexts and roles that are not roles or properties, such as
-- | psp:type, psp:binding, psp:label and psp:context. Furthermore, for psp:identity, psp:buitenRol, psp:binnenRol,
-- | psp:iedereRolInContext and psp:typeVanIedereRolInContext.
constructTripleGetterFromObjectsGetter :: forall e.
  PropertyName ->
  ObjectsGetter e ->
  TypedTripleGetter e
constructTripleGetterFromObjectsGetter pn objGetter = constructTripleGetterFromEffectExpression pn (lift <<< objGetter)

-- | Use this function to construct property getters that memorize in the triple administration. Use with:
-- | - getRol
-- | - searchExternalProperty
-- | - getInternalProperty
-- | - getProperty
constructTripleGetter :: forall e.
  (String -> ObjectsGetter e) ->
  PropertyName ->
  TypedTripleGetter e
constructTripleGetter objectsGetterConstructor pn = constructTripleGetterFromObjectsGetter pn $ objectsGetterConstructor pn

constructExternalPropertyGetter :: forall e.
  PropertyName ->
  TypedTripleGetter e
constructExternalPropertyGetter pn = constructTripleGetter searchExternalProperty pn

constructExternalPropertyLookup :: forall e.
  LocalName ->
  TypedTripleGetter e
constructExternalPropertyLookup ln = constructTripleGetter searchExternalProperty ln

constructInternalPropertyGetter :: forall e.
  PropertyName ->
  TypedTripleGetter e
constructInternalPropertyGetter pn = constructTripleGetter getInternalProperty pn

constructInternalPropertyLookup :: forall e.
  LocalName ->
  TypedTripleGetter e
constructInternalPropertyLookup ln = constructTripleGetter searchInternalProperty ln

constructRolPropertyGetter :: forall e.
  PropertyName ->
  TypedTripleGetter e
constructRolPropertyGetter pn = constructTripleGetter getProperty pn

constructRolPropertyLookup :: forall e.
  RolName ->
  TypedTripleGetter e
constructRolPropertyLookup qn = (constructTripleGetterFromObjectsGetter ("constructRolPropertyLookup" <> qn) (getRolWithPropertyFromRolTelescope qn)) >-> (constructRolPropertyGetter qn)

constructRolGetter :: forall e.
  RolName ->
  TypedTripleGetter e
constructRolGetter rn = constructTripleGetter getRol rn

constructRolLookup :: forall e.
  RolName ->
  TypedTripleGetter e
constructRolLookup rn = constructTripleGetter getRolFromPrototypeHierarchy rn

constructInverseRolGetter :: forall e.
  RolName ->
  TypedTripleGetter e
constructInverseRolGetter pn = constructTripleGetterFromObjectsGetter (pn <> "_inverse") $ getGebondenAls pn

-- | A combinator from the type name of a Rol to a query that takes the instance of a Rol
-- | and returns a boolean value showing if the instance has the given type.
-- | NOTE: makes no use of Aspects!
-- | `psp:Rol -> psp:RolInstance -> psp:Boolean`
rolHasType :: forall e. ID -> TypedTripleGetter e
rolHasType typeId = constructTripleGetterFromObjectsGetter ("model:Perspectives$rolHasType" <> "_" <> typeId)
  (rolType >=> \(objs::Array String) -> pure (maybe ["false"] (const ["true"]) (elemIndex typeId objs)))

-- | Tests whether the type of the Rol has a specific local name. Used to test if a Rol is a BuitenRol type or a BinnenRol type.
-- | `psp:Rol -> psp:RolInstance -> psp:Boolean`
rolHasTypeWithLocalName :: forall e. ID -> TypedTripleGetter e
rolHasTypeWithLocalName localName = constructTripleGetterFromObjectsGetter
  ("model:Perspectives$rolHasTypeWithLocalName" <> "_" <> localName)
  (rolType `composeMonoidal` f)
  where
    f :: Array String -> Boolean
    f = alaF Disj foldMap (maybe false ((==) localName) <<< deconstructLocalNameFromDomeinURI)
