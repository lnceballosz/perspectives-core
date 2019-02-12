module Perspectives.QueryEffect where

import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Class (liftEff)
import Perspectives.CoreTypes (NamedFunction(..), Triple(..), TripleGetter, TypedTripleGetter(..), MonadPerspectivesQuery)
import Perspectives.Effects (AjaxAvarCache)
import Perspectives.TripleAdministration (getRef, registerTriple)
import Prelude (Unit, bind, const, pure, ($), (<>))

type QueryEffect e = NamedFunction (Array String -> Eff (AjaxAvarCache e) Unit)

-- | Make an effect function (QueryEffect) dependent on the objects of a TypedTripleGetter.
-- | Results in a TypedTripleGetter.
-- | Remove the effect function's dependency on the tripleGetter by using unsubscribeFromObjects.
pushesObjectsTo :: forall e. TypedTripleGetter e -> QueryEffect e -> TypedTripleGetter e
pushesObjectsTo (TypedTripleGetter tgName tg) (NamedFunction effectName effect) =
  TypedTripleGetter effectName pushesObjectsTo' where

    pushesObjectsTo' :: TripleGetter e
    pushesObjectsTo' id = do
      t <- tg id
      et <- effectFun t
      liftEff $ registerTriple et
      -- To unsubscribe the effect, de-register the effect triple.

    -- propagateTheoryDeltas will use the tripleGetter to recompute,
    -- i.e. to sort the effect again and it will use the resulting triple to
    --  - set new dependencies based on its supports;
    --  - copy its supports to the triple administration (in the old effect triple)
    effectFun :: Triple e -> MonadPerspectivesQuery (AjaxAvarCache e) (Triple e)
    effectFun queryResult@(Triple{subject, object}) = do
      _ <- liftEff $ effect object
      pure $ Triple { subject: subject
                    , predicate : name
                    , object : object
                    , dependencies : []
                    , supports : [getRef queryResult]
                    , tripleGetter : const (effectFun queryResult)}

    name :: String
    name = "(" <>  tgName <> " ~> " <> effectName <> ")"

-- high precedence!
infixl 9 pushesObjectsTo as ~>