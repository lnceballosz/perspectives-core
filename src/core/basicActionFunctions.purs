module Perspectives.BasicActionFunctions where

import Prelude

import Perspectives.CollectDomeinFile (domeinFileFromContext)
import Perspectives.ComputedTripleGetters (parserMessagesM, syntacticStateM)
import Perspectives.CoreTypes (MonadPerspectives)
import Perspectives.DomeinCache (storeDomeinFileInCouchdb)
import Perspectives.Effects (AjaxAvarCache)
import Perspectives.EntiteitAndRDFAliases (ID)
import Perspectives.Resource (getPerspectEntiteit)
import Perspectives.RunMonadPerspectivesQuery ((##>>))

storeDomeinFile :: forall e. ID -> MonadPerspectives (AjaxAvarCache e) Unit
storeDomeinFile textId = do
  syntacticState <- textId ##>> syntacticStateM
  case syntacticState of
    "false" -> pure unit
    otherwise -> do
      contextId <- textId ##>> parserMessagesM
      -- here, because the syntactic state is true, there must be a contextId in the cache.
      ctxt <- getPerspectEntiteit contextId
      df <- domeinFileFromContext ctxt
      storeDomeinFileInCouchdb df
-- TODO: zet een timestamp!