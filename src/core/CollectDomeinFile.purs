module Perspectives.CollectDomeinFile where

import Prelude
import Control.Monad.Eff (kind Effect)
import Control.Monad.State (StateT, execStateT, lift, modify, get)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), maybe)
import Data.StrMap (insert, lookup)
import Perspectives.ContextAndRole (context_buitenRol, context_id, context_rev, rol_id)
import Perspectives.DomeinFile (DomeinFile(..), defaultDomeinFile)
import Perspectives.Effects (AjaxAvarCache)
import Perspectives.EntiteitAndRDFAliases (ContextID, ID)
import Perspectives.Identifiers (isInNamespace, isSubNamespace)
import Perspectives.PerspectivesState (MonadPerspectives)
import Perspectives.Resource (getPerspectEntiteit)
import Perspectives.ResourceRetrieval (saveEntiteit)
import Perspectives.Syntax (PerspectContext, PerspectRol, revision')
import Perspectives.SystemQueries (boundContexts, iedereRolInContext)
import Perspectives.TripleAdministration (tripleObjects)
import Perspectives.TripleGetter ((##))

-- | From a context, create a DomeinFile (a record that holds an id, maybe a revision and a StrMap of CouchdbResources).
domeinFileFromContext :: forall e. PerspectContext -> MonadPerspectives (AjaxAvarCache e) DomeinFile
domeinFileFromContext enclosingContext = do
  (DomeinFile df) <- execStateT (collect enclosingContext false) defaultDomeinFile
  pure $ DomeinFile $ df {_rev = revision' (context_rev enclosingContext), _id = (context_id enclosingContext)}
  where
    collect :: PerspectContext -> Boolean -> StateT DomeinFile (MonadPerspectives (AjaxAvarCache e)) Unit
    collect c definedAtToplevel =
      ifM (saveContext c definedAtToplevel)
        do
          boundContexts <- lift $ ((context_id c) ## boundContexts)
          -- boundContexts <- lift $ ((context_id c) ## (iedereRolInContext >-> binding))
          for_ (tripleObjects boundContexts) recursiveCollect
        (pure unit)
      where
        recursiveCollect :: ContextID -> StateT DomeinFile (MonadPerspectives (AjaxAvarCache e)) Unit
        recursiveCollect subContextId =
          ifNothing (lift $ getPerspectEntiteit subContextId)
            (pure unit)
            (flip collect ((context_id c) == (context_id enclosingContext)))
        saveContext :: PerspectContext -> Boolean -> StateT DomeinFile (MonadPerspectives (AjaxAvarCache e)) Boolean
        saveContext ctxt definedAtToplevel' = if isSubNamespace (context_id enclosingContext) (context_id ctxt)
          then
            ifM (inDomeinFile (context_id ctxt))
              (pure false)
              do
                modify $ insertContextInDomeinFile ctxt
                ifNothing (lift $ getPerspectEntiteit (context_buitenRol ctxt))
                  (pure unit)
                  (modify <<< insertRolInDomeinFile)
                rollen <- lift $ ((context_id ctxt) ## iedereRolInContext)
                for_ (tripleObjects rollen)
                  \rolID ->
                    ifNothing (lift $ getPerspectEntiteit rolID)
                      (pure unit)
                      (modify <<< insertRolInDomeinFile)
                pure true
          else if definedAtToplevel' && isInNamespace "model:User" (context_id ctxt)
            then if (savedToCouchdb ctxt)
              then pure false
              else
                do
                lift $ void ((saveEntiteit (context_buitenRol ctxt)) :: MonadPerspectives (AjaxAvarCache e) PerspectRol)
                rollen <- lift $ ((context_id ctxt) ## iedereRolInContext)
                for_ (tripleObjects rollen)
                  \rolID -> lift ((saveEntiteit rolID)  :: MonadPerspectives (AjaxAvarCache e) PerspectRol)
                lift $ void ((saveEntiteit (context_id ctxt)) :: MonadPerspectives (AjaxAvarCache e) PerspectContext)
                pure true
            else pure false

        -- The same context may be inserted multiple times without consequence; it is an idempotent operation.
        insertContextInDomeinFile :: PerspectContext -> DomeinFile -> DomeinFile
        insertContextInDomeinFile ctxt (DomeinFile dfc@{contexts}) = DomeinFile $ dfc {contexts = insert (context_id ctxt) ctxt contexts}

        insertRolInDomeinFile :: PerspectRol -> DomeinFile -> DomeinFile
        insertRolInDomeinFile r (DomeinFile dfc@{roles}) = DomeinFile $ dfc {roles = insert (rol_id r) r roles}

        inDomeinFile :: ID -> StateT DomeinFile (MonadPerspectives (AjaxAvarCache e)) Boolean
        inDomeinFile id = do
          (DomeinFile {contexts, roles}) <- get
          case lookup id contexts of
            (Just _) -> pure true
            Nothing -> case lookup id roles of
              (Just _) -> pure true
              otherwise -> pure false

        savedToCouchdb :: PerspectContext -> Boolean
        savedToCouchdb ctxt = maybe false (const true) (context_rev ctxt)

maybeM :: forall a b m. Monad m => m a -> (b -> m a) -> m (Maybe b) -> m a
maybeM default fromJust monadicValue = do
  mv <- monadicValue
  case mv of
    Nothing -> default
    (Just v) -> fromJust v

ifNothing :: forall a b m. Monad m => m (Maybe b) -> m a -> (b -> m a) -> m a
ifNothing monadicValue default fromJust = maybeM default fromJust monadicValue