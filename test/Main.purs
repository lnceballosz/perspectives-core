module Test.Main where

import Prelude

import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Now (NOW)
import Perspectives.Effects (AjaxAvarCache)
import Test.Perspectives.DataTypeObjectGetters (theSuite) as DTO
import Test.Perspectives.LoadAModel (theSuite) as LAM
import Test.Perspectives.ModelBasedObjectGetters (theSuite) as MBOG
import Test.Perspectives.ModelBasedTripleGetters (theSuite) as MBTG
import Test.Perspectives.ModelBasedStringTripleGetters (theSuite) as MBSTG
import Test.Perspectives.ObjectGetterConstructors (theSuite) as OGC
import Test.Perspectives.QueryCombinators (theSuite) as QC
import Test.Perspectives.TripleGetterConstructors (theSuite) as TGC
import Test.Perspectives.TripleGetterComposition (theSuite) as TGCO
import Test.Perspectives.TypeDefChecker (theSuite) as TDC
import Test.Perspectives.DataTypeTripleGetters as DTG
import Test.Perspectives.Utils (TestModelLoadEffects)
import Test.Unit.Console (TESTOUTPUT)
import Test.Unit.Main (runTest)

main :: forall e. Eff (AjaxAvarCache (now :: NOW, testOutput :: TESTOUTPUT | (TestModelLoadEffects e))) Unit
main = runTest do
  DTO.theSuite
  OGC.theSuite
  MBTG.theSuite
  MBSTG.theSuite
  TGC.theSuite
  MBOG.theSuite
  TDC.theSuite
  DTG.theSuite
  TGCO.theSuite
  LAM.theSuite 
  QC.theSuite

-- Running other tests:
-- main = runAff handleError (runP test)

-- handleError :: forall e a. (Either Error a -> Eff (console :: CONSOLE | e) Unit)
-- handleError (Left e) = log $ "An error condition: " <> (show e)
-- handleError (Right a) = log $ "Perspectives-core has started!"
