// Generated by purs version 0.11.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad_Aff = require("../Control.Monad.Aff");
var Control_Monad_Aff_AVar = require("../Control.Monad.Aff.AVar");
var Control_Monad_Aff_Console = require("../Control.Monad.Aff.Console");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_Eff_Ref = require("../Control.Monad.Eff.Ref");
var Data_Show = require("../Data.Show");
var Data_Unit = require("../Data.Unit");
var Perspectives_CoreTypes = require("../Perspectives.CoreTypes");
var Perspectives_PerspectivesState = require("../Perspectives.PerspectivesState");
var Prelude = require("../Prelude");
var test9 = ":ContextType :Aangifte -- Commentaar op de regel.\x0a    public :isFunctioneel = true --Commentaar 1\x0a    -- commentaar boven :isVerplicht\x0a    public :isVerplicht = true --Commentaar 1\x0a";
var test8 = ":aangever => :Jansen\x0a    :betrouwbaarheid = 6\x0a";
var test7 = ":aangever => :Jansen\x0a    :betrouwbaarheid = 6";
var test6b = "private :aantekening = \"bla die bla\"\x0a-- Commentaar voor :aangever\x0a";
var test6a = "-- Commentaar voor :aangever\x0a:aangever => :Jansen -- Commentaar bij :aangever\x0a  :betrouwbaarheid = 6 -- Commentaar bij :betrouwbaarheid\x0a";
var test6 = ":Aangifte :Aangifte1\x0a  public :status = \"voltooid\"\x0a  private :aantekening = \"bla die bla\"\x0a  -- Commentaar voor :aangever\x0a  :aangever => :Jansen -- Commentaar bij :aangever\x0a    :betrouwbaarheid = 6 -- Commentaar bij :betrouwbaarheid";
var test5 = "--Commentaar voor :Aangifte1\x0a:Aangifte :Aangifte1 --Commentaar achter :Aangifte1\x0a  public :status = \"voltooid\"\x0a  private :aantekening = \"bla die bla\"\x0a  :aangever => :Jansen";
var test4 = ":Aangifte :Aangifte1 -- Commentaar bij :Aangifte1\x0a  public :status = \"voltooid\" -- Commentaar bij :status\x0a  :aangever => :Jansen -- commentaar bij :aangever";
var test3a = ":Aangifte :Aangifte1\x0a  :aangever (0) => :Jansen\\n\x0a  :aangever (1) => :Pietersen\\n";
var test3 = "$Aangifte $Aangifte1\x0a  $aangever (0) => $Jansen\\n";
var test25 = "-- Dit bestand bevat elke denkbare Perspectives CLR expressie.\x0aText $Mijntekst\x0a$ContextType $Aangifte\x0a\x09-- Commentaar boven $aantekening\x0a\x09public $aantekening = 1 -- Commentaar achter $aantekening";
var test24 = "$ContextType $Aangifte\x0a\x09-- Commentaar boven $aantekening\x0a\x09public $aantekening = 1 -- Commentaar achter $aantekening";
var test23 = "$ContextType $Aangifte\x0a\x09-- Commentaar boven $aantekening\x0a\x09public $aantekening = 1 -- Commentaar achter $aantekening\x0a\x09-- Commentaar boven de binding van $Urgentie\x0a\x09$publicProperty => $Jansen";
var test22 = "$Property $Urgentie\x0a\x09public $isFunctioneel = true\x0a\x09-- Commentaar boven $isVerplicht\x0a\x09public $isVerplicht = false";
var test21 = ":ContextType :Aangifte\x0a\x09:publicProperty => $Urgentie\x0a\x09\x09:rolprop = 3";
var test20 = ":publicProperty =>\x0a\x09:Property $Urgentie\x0a\x09\x09public :prop = 3";
var test2 = ":Aangifte :Aangifte1 -- Commentaar bij :Aangifte1\x0a  public :status = \"voltooid\\n\" -- Commentaar bij status\x0a";
var test19 = ":ContextType :Aangifte\x0a\x09:publicProperty =>\x0a\x09\x09:Property $Urgentie\x0a\x09\x09\x09public :prop = 3";
var test18 = "Text :T\x0a:Aangifte :A1\x0a\x09:aangever (0) => :Jansen\x0a\x09:aangever (1) => :Pietersen\x0a";
var test17 = "Text :A\x0a:Aangifte :B12";
var test16 = "Text :Mytext\x0a:Aangifte :A\x0a\x09:aangever =>\x0a\x09\x09:RolDef :Pietersen\x0a\x09\x09\x09public :betrouwbaarheid = 1";
var test15 = ":Aangifte :A\x0a\x09:aangever =>\x0a\x09\x09:RolDef :Pietersen\x0a\x09\x09  :prop = 1";
var test14 = ":Aangifte :A\x0a\x09:aangever =>\x0a\x09\x09:RolDef :Pietersen\x0a\x09\x09:prop = 1";
var test13 = ":Aangifte :A\x0a\x09:aangever =>\x0a\x09\x09:RolDef :R";
var test12 = "Text :Mysource\x0a:Aangifte :A1\x0a  :aangever => :Jansen\x0a:Aangifte :A2";
var test11 = ":Aangifte :A\x0a\x09--Commentaar voor de properties\x0a\x09public :urgentie = 1 -- Commentaar achter de property\x0a  ";
var test10c = ":ContextType :Aangifte\x0a\x09:rolProperty =>\x0a\x09\x09:Property :Betrouwbaarheid\x0a\x09\x09\x09public :isFunctioneel = true\x0a";
var test10b = ":rolProperty =>\x0a\x09:Property :Betrouwbaarheid\x0a\x09\x09public :isFunctioneel = true\x0a";
var test10a = "-- Commentaar voor rolProperty\x0a:rolProperty =>\x0a\x09:Property :Betrouwbaarheid\x0a\x09\x09public :isFunctioneel = true\x0a";
var test10 = ":ContextType :Aangifte\x0a\x09-- Commentaar voor rolProperty\x0a  :rolProperty =>\x0a\x09\x09:Property :Betrouwbaarheid\x0a\x09\x09\x09public :isFunctioneel = true\x0a";
var test1 = ":Aangifte :Aangifte1\x0a";
var runTest = function (dictShow) {
    return function (t) {
        return Control_Monad_Aff.runAff_(function (v) {
            return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
        })(Control_Bind.bind(Control_Monad_Aff.bindAff)(Perspectives_PerspectivesState.runPerspectives("admin")("admin")(t))(function (r) {
            return Control_Monad_Aff_Console.log(Data_Show.show(dictShow)(r));
        }));
    };
};
module.exports = {
    runTest: runTest,
    test1: test1,
    test2: test2,
    test3: test3,
    test3a: test3a,
    test4: test4,
    test5: test5,
    test6: test6,
    test6a: test6a,
    test6b: test6b,
    test7: test7,
    test8: test8,
    test9: test9,
    test10: test10,
    test10a: test10a,
    test10b: test10b,
    test10c: test10c,
    test11: test11,
    test12: test12,
    test13: test13,
    test14: test14,
    test15: test15,
    test16: test16,
    test17: test17,
    test18: test18,
    test19: test19,
    test20: test20,
    test21: test21,
    test22: test22,
    test23: test23,
    test24: test24,
    test25: test25
};
