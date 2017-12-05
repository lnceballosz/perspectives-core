(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
// Generated by psc-bundle 0.11.4
var PS = {};
(function(exports) {
    "use strict";

  exports.ace = ace;

  exports.editNodeImpl = function (el, self) {
    return function () {
      return self.edit(el);
    };
  };
})(PS["Ace"] = PS["Ace"] || {});
(function(exports) {
    "use strict";

  exports.pureE = function (a) {
    return function () {
      return a;
    };
  };

  exports.bindE = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };

  exports.runPure = function (f) {
    return f();
  };

  exports.foreachE = function (as) {
    return function (f) {
      return function () {
        for (var i = 0, l = as.length; i < l; i++) {
          f(as[i])();
        }
      };
    };
  };
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Semigroupoid = function (compose) {
      this.compose = compose;
  };
  var semigroupoidFn = new Semigroupoid(function (f) {
      return function (g) {
          return function (x) {
              return f(g(x));
          };
      };
  });
  var compose = function (dict) {
      return dict.compose;
  };
  exports["Semigroupoid"] = Semigroupoid;
  exports["compose"] = compose;
  exports["semigroupoidFn"] = semigroupoidFn;
})(PS["Control.Semigroupoid"] = PS["Control.Semigroupoid"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];        
  var Category = function (Semigroupoid0, id) {
      this.Semigroupoid0 = Semigroupoid0;
      this.id = id;
  };
  var id = function (dict) {
      return dict.id;
  };
  var categoryFn = new Category(function () {
      return Control_Semigroupoid.semigroupoidFn;
  }, function (x) {
      return x;
  });
  exports["Category"] = Category;
  exports["id"] = id;
  exports["categoryFn"] = categoryFn;
})(PS["Control.Category"] = PS["Control.Category"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Category = PS["Control.Category"];        
  var on = function (f) {
      return function (g) {
          return function (x) {
              return function (y) {
                  return f(g(x))(g(y));
              };
          };
      };
  };
  var flip = function (f) {
      return function (b) {
          return function (a) {
              return f(a)(b);
          };
      };
  };
  var $$const = function (a) {
      return function (v) {
          return a;
      };
  };
  exports["const"] = $$const;
  exports["flip"] = flip;
  exports["on"] = on;
})(PS["Data.Function"] = PS["Data.Function"] || {});
(function(exports) {
    "use strict";

  exports.arrayMap = function (f) {
    return function (arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function(exports) {
    "use strict";

  exports.unit = {};
})(PS["Data.Unit"] = PS["Data.Unit"] || {});
(function(exports) {
    "use strict";

  exports.showIntImpl = function (n) {
    return n.toString();
  };

  exports.showCharImpl = function (c) {
    var code = c.charCodeAt(0);
    if (code < 0x20 || code === 0x7F) {
      switch (c) {
        case "\x07": return "'\\a'";
        case "\b": return "'\\b'";
        case "\f": return "'\\f'";
        case "\n": return "'\\n'";
        case "\r": return "'\\r'";
        case "\t": return "'\\t'";
        case "\v": return "'\\v'";
      }
      return "'\\" + code.toString(10) + "'";
    }
    return c === "'" || c === "\\" ? "'\\" + c + "'" : "'" + c + "'";
  };

  exports.showStringImpl = function (s) {
    var l = s.length;
    return "\"" + s.replace(
      /[\0-\x1F\x7F"\\]/g, // eslint-disable-line no-control-regex
      function (c, i) {
        switch (c) {
          case "\"":
          case "\\":
            return "\\" + c;
          case "\x07": return "\\a";
          case "\b": return "\\b";
          case "\f": return "\\f";
          case "\n": return "\\n";
          case "\r": return "\\r";
          case "\t": return "\\t";
          case "\v": return "\\v";
        }
        var k = i + 1;
        var empty = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
        return "\\" + c.charCodeAt(0).toString(10) + empty;
      }
    ) + "\"";
  };

  exports.showArrayImpl = function (f) {
    return function (xs) {
      var ss = [];
      for (var i = 0, l = xs.length; i < l; i++) {
        ss[i] = f(xs[i]);
      }
      return "[" + ss.join(",") + "]";
    };
  };
})(PS["Data.Show"] = PS["Data.Show"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Show"];     
  var Show = function (show) {
      this.show = show;
  };
  var showString = new Show($foreign.showStringImpl);
  var showInt = new Show($foreign.showIntImpl);
  var showChar = new Show($foreign.showCharImpl);
  var showBoolean = new Show(function (v) {
      if (v) {
          return "true";
      };
      if (!v) {
          return "false";
      };
      throw new Error("Failed pattern match at Data.Show line 13, column 3 - line 14, column 3: " + [ v.constructor.name ]);
  });
  var show = function (dict) {
      return dict.show;
  };
  var showArray = function (dictShow) {
      return new Show($foreign.showArrayImpl(show(dictShow)));
  };
  exports["Show"] = Show;
  exports["show"] = show;
  exports["showBoolean"] = showBoolean;
  exports["showInt"] = showInt;
  exports["showChar"] = showChar;
  exports["showString"] = showString;
  exports["showArray"] = showArray;
})(PS["Data.Show"] = PS["Data.Show"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Unit"];
  var Data_Show = PS["Data.Show"];
  exports["unit"] = $foreign.unit;
})(PS["Data.Unit"] = PS["Data.Unit"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Function = PS["Data.Function"];
  var Data_Unit = PS["Data.Unit"];        
  var Functor = function (map) {
      this.map = map;
  };
  var map = function (dict) {
      return dict.map;
  };
  var $$void = function (dictFunctor) {
      return map(dictFunctor)(Data_Function["const"](Data_Unit.unit));
  };
  var voidLeft = function (dictFunctor) {
      return function (f) {
          return function (x) {
              return map(dictFunctor)(Data_Function["const"](x))(f);
          };
      };
  };
  var functorFn = new Functor(Control_Semigroupoid.compose(Control_Semigroupoid.semigroupoidFn));
  var functorArray = new Functor($foreign.arrayMap);
  exports["Functor"] = Functor;
  exports["map"] = map;
  exports["void"] = $$void;
  exports["voidLeft"] = voidLeft;
  exports["functorFn"] = functorFn;
  exports["functorArray"] = functorArray;
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];        
  var Apply = function (Functor0, apply) {
      this.Functor0 = Functor0;
      this.apply = apply;
  };                      
  var apply = function (dict) {
      return dict.apply;
  };
  var applyFirst = function (dictApply) {
      return function (a) {
          return function (b) {
              return apply(dictApply)(Data_Functor.map(dictApply.Functor0())(Data_Function["const"])(a))(b);
          };
      };
  };
  var applySecond = function (dictApply) {
      return function (a) {
          return function (b) {
              return apply(dictApply)(Data_Functor.map(dictApply.Functor0())(Data_Function["const"](Control_Category.id(Control_Category.categoryFn)))(a))(b);
          };
      };
  };
  var lift2 = function (dictApply) {
      return function (f) {
          return function (a) {
              return function (b) {
                  return apply(dictApply)(Data_Functor.map(dictApply.Functor0())(f)(a))(b);
              };
          };
      };
  };
  exports["Apply"] = Apply;
  exports["apply"] = apply;
  exports["applyFirst"] = applyFirst;
  exports["applySecond"] = applySecond;
  exports["lift2"] = lift2;
})(PS["Control.Apply"] = PS["Control.Apply"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var Applicative = function (Apply0, pure) {
      this.Apply0 = Apply0;
      this.pure = pure;
  };
  var pure = function (dict) {
      return dict.pure;
  };
  var when = function (dictApplicative) {
      return function (v) {
          return function (v1) {
              if (v) {
                  return v1;
              };
              if (!v) {
                  return pure(dictApplicative)(Data_Unit.unit);
              };
              throw new Error("Failed pattern match at Control.Applicative line 58, column 1 - line 58, column 16: " + [ v.constructor.name, v1.constructor.name ]);
          };
      };
  };
  var liftA1 = function (dictApplicative) {
      return function (f) {
          return function (a) {
              return Control_Apply.apply(dictApplicative.Apply0())(pure(dictApplicative)(f))(a);
          };
      };
  };
  exports["Applicative"] = Applicative;
  exports["liftA1"] = liftA1;
  exports["pure"] = pure;
  exports["when"] = when;
})(PS["Control.Applicative"] = PS["Control.Applicative"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Control.Bind"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var Bind = function (Apply0, bind) {
      this.Apply0 = Apply0;
      this.bind = bind;
  };
  var Discard = function (discard) {
      this.discard = discard;
  };
  var discard = function (dict) {
      return dict.discard;
  };                     
  var bind = function (dict) {
      return dict.bind;
  };
  var bindFlipped = function (dictBind) {
      return Data_Function.flip(bind(dictBind));
  };
  var composeKleisliFlipped = function (dictBind) {
      return function (f) {
          return function (g) {
              return function (a) {
                  return bindFlipped(dictBind)(f)(g(a));
              };
          };
      };
  };
  var discardUnit = new Discard(function (dictBind) {
      return bind(dictBind);
  });
  exports["Bind"] = Bind;
  exports["Discard"] = Discard;
  exports["bind"] = bind;
  exports["bindFlipped"] = bindFlipped;
  exports["composeKleisliFlipped"] = composeKleisliFlipped;
  exports["discard"] = discard;
  exports["discardUnit"] = discardUnit;
})(PS["Control.Bind"] = PS["Control.Bind"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var Monad = function (Applicative0, Bind1) {
      this.Applicative0 = Applicative0;
      this.Bind1 = Bind1;
  };
  var ap = function (dictMonad) {
      return function (f) {
          return function (a) {
              return Control_Bind.bind(dictMonad.Bind1())(f)(function (v) {
                  return Control_Bind.bind(dictMonad.Bind1())(a)(function (v1) {
                      return Control_Applicative.pure(dictMonad.Applicative0())(v(v1));
                  });
              });
          };
      };
  };
  exports["Monad"] = Monad;
  exports["ap"] = ap;
})(PS["Control.Monad"] = PS["Control.Monad"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Control.Monad.Eff"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var monadEff = new Control_Monad.Monad(function () {
      return applicativeEff;
  }, function () {
      return bindEff;
  });
  var bindEff = new Control_Bind.Bind(function () {
      return applyEff;
  }, $foreign.bindE);
  var applyEff = new Control_Apply.Apply(function () {
      return functorEff;
  }, Control_Monad.ap(monadEff));
  var applicativeEff = new Control_Applicative.Applicative(function () {
      return applyEff;
  }, $foreign.pureE);
  var functorEff = new Data_Functor.Functor(Control_Applicative.liftA1(applicativeEff));
  exports["functorEff"] = functorEff;
  exports["applyEff"] = applyEff;
  exports["applicativeEff"] = applicativeEff;
  exports["bindEff"] = bindEff;
  exports["monadEff"] = monadEff;
  exports["foreachE"] = $foreign.foreachE;
  exports["runPure"] = $foreign.runPure;
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
    "use strict";

  exports._readHTMLElement = function (failure) {
    return function (success) {
      return function (value) {
        var tag = Object.prototype.toString.call(value);
        if (tag.indexOf("[object HTML") === 0 && tag.indexOf("Element]") === tag.length - 8) {
          return success(value);
        } else {
          return failure(tag);
        }
      };
    };
  };
})(PS["DOM.HTML.Types"] = PS["DOM.HTML.Types"] || {});
(function(exports) {
    "use strict";

  exports.concatString = function (s1) {
    return function (s2) {
      return s1 + s2;
    };
  };

  exports.concatArray = function (xs) {
    return function (ys) {
      if (xs.length === 0) return ys;
      if (ys.length === 0) return xs;
      return xs.concat(ys);
    };
  };
})(PS["Data.Semigroup"] = PS["Data.Semigroup"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Semigroup"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];        
  var Semigroup = function (append) {
      this.append = append;
  }; 
  var semigroupString = new Semigroup($foreign.concatString);
  var semigroupArray = new Semigroup($foreign.concatArray);
  var append = function (dict) {
      return dict.append;
  };
  exports["Semigroup"] = Semigroup;
  exports["append"] = append;
  exports["semigroupString"] = semigroupString;
  exports["semigroupArray"] = semigroupArray;
})(PS["Data.Semigroup"] = PS["Data.Semigroup"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Data_Functor = PS["Data.Functor"];
  var Data_Semigroup = PS["Data.Semigroup"];        
  var Alt = function (Functor0, alt) {
      this.Functor0 = Functor0;
      this.alt = alt;
  };                                                       
  var alt = function (dict) {
      return dict.alt;
  };
  exports["Alt"] = Alt;
  exports["alt"] = alt;
})(PS["Control.Alt"] = PS["Control.Alt"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Data_Functor = PS["Data.Functor"];        
  var Plus = function (Alt0, empty) {
      this.Alt0 = Alt0;
      this.empty = empty;
  };       
  var empty = function (dict) {
      return dict.empty;
  };
  exports["Plus"] = Plus;
  exports["empty"] = empty;
})(PS["Control.Plus"] = PS["Control.Plus"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Functor = PS["Data.Functor"];        
  var Alternative = function (Applicative0, Plus1) {
      this.Applicative0 = Applicative0;
      this.Plus1 = Plus1;
  };
  exports["Alternative"] = Alternative;
})(PS["Control.Alternative"] = PS["Control.Alternative"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Category = PS["Control.Category"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];        
  var MonadEff = function (Monad0, liftEff) {
      this.Monad0 = Monad0;
      this.liftEff = liftEff;
  };
  var monadEffEff = new MonadEff(function () {
      return Control_Monad_Eff.monadEff;
  }, Control_Category.id(Control_Category.categoryFn));
  var liftEff = function (dict) {
      return dict.liftEff;
  };
  exports["MonadEff"] = MonadEff;
  exports["liftEff"] = liftEff;
  exports["monadEffEff"] = monadEffEff;
})(PS["Control.Monad.Eff.Class"] = PS["Control.Monad.Eff.Class"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Category = PS["Control.Category"];        
  var Bifunctor = function (bimap) {
      this.bimap = bimap;
  };
  var bimap = function (dict) {
      return dict.bimap;
  };
  var rmap = function (dictBifunctor) {
      return bimap(dictBifunctor)(Control_Category.id(Control_Category.categoryFn));
  };
  exports["Bifunctor"] = Bifunctor;
  exports["bimap"] = bimap;
  exports["rmap"] = rmap;
})(PS["Data.Bifunctor"] = PS["Data.Bifunctor"] || {});
(function(exports) {
    "use strict";

  exports.topInt = 2147483647;
  exports.bottomInt = -2147483648;
})(PS["Data.Bounded"] = PS["Data.Bounded"] || {});
(function(exports) {
    "use strict";

  exports.refEq = function (r1) {
    return function (r2) {
      return r1 === r2;
    };
  };
})(PS["Data.Eq"] = PS["Data.Eq"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Eq"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];        
  var Eq = function (eq) {
      this.eq = eq;
  };
  var eqVoid = new Eq(function (v) {
      return function (v1) {
          return true;
      };
  });
  var eqString = new Eq($foreign.refEq);
  var eqInt = new Eq($foreign.refEq);
  var eqChar = new Eq($foreign.refEq);
  var eq = function (dict) {
      return dict.eq;
  };
  exports["Eq"] = Eq;
  exports["eq"] = eq;
  exports["eqInt"] = eqInt;
  exports["eqChar"] = eqChar;
  exports["eqString"] = eqString;
  exports["eqVoid"] = eqVoid;
})(PS["Data.Eq"] = PS["Data.Eq"] || {});
(function(exports) {
    "use strict";

  exports.unsafeCompareImpl = function (lt) {
    return function (eq) {
      return function (gt) {
        return function (x) {
          return function (y) {
            return x < y ? lt : x === y ? eq : gt;
          };
        };
      };
    };
  };
})(PS["Data.Ord.Unsafe"] = PS["Data.Ord.Unsafe"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Data_Eq = PS["Data.Eq"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];        
  var LT = (function () {
      function LT() {

      };
      LT.value = new LT();
      return LT;
  })();
  var GT = (function () {
      function GT() {

      };
      GT.value = new GT();
      return GT;
  })();
  var EQ = (function () {
      function EQ() {

      };
      EQ.value = new EQ();
      return EQ;
  })();
  exports["LT"] = LT;
  exports["GT"] = GT;
  exports["EQ"] = EQ;
})(PS["Data.Ordering"] = PS["Data.Ordering"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Ord.Unsafe"];
  var Data_Ordering = PS["Data.Ordering"];        
  var unsafeCompare = $foreign.unsafeCompareImpl(Data_Ordering.LT.value)(Data_Ordering.EQ.value)(Data_Ordering.GT.value);
  exports["unsafeCompare"] = unsafeCompare;
})(PS["Data.Ord.Unsafe"] = PS["Data.Ord.Unsafe"] || {});
(function(exports) {
    "use strict";

  exports.intSub = function (x) {
    return function (y) {
      /* jshint bitwise: false */
      return x - y | 0;
    };
  };
})(PS["Data.Ring"] = PS["Data.Ring"] || {});
(function(exports) {
    "use strict";

  exports.intAdd = function (x) {
    return function (y) {
      /* jshint bitwise: false */
      return x + y | 0;
    };
  };

  exports.intMul = function (x) {
    return function (y) {
      /* jshint bitwise: false */
      return x * y | 0;
    };
  };
})(PS["Data.Semiring"] = PS["Data.Semiring"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Semiring"];
  var Data_Unit = PS["Data.Unit"];        
  var Semiring = function (add, mul, one, zero) {
      this.add = add;
      this.mul = mul;
      this.one = one;
      this.zero = zero;
  };
  var zero = function (dict) {
      return dict.zero;
  };                                                                            
  var semiringInt = new Semiring($foreign.intAdd, $foreign.intMul, 1, 0);
  var one = function (dict) {
      return dict.one;
  };
  var mul = function (dict) {
      return dict.mul;
  };
  var add = function (dict) {
      return dict.add;
  };
  exports["Semiring"] = Semiring;
  exports["add"] = add;
  exports["mul"] = mul;
  exports["one"] = one;
  exports["zero"] = zero;
  exports["semiringInt"] = semiringInt;
})(PS["Data.Semiring"] = PS["Data.Semiring"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Ring"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Unit = PS["Data.Unit"];        
  var Ring = function (Semiring0, sub) {
      this.Semiring0 = Semiring0;
      this.sub = sub;
  };
  var sub = function (dict) {
      return dict.sub;
  };                  
  var ringInt = new Ring(function () {
      return Data_Semiring.semiringInt;
  }, $foreign.intSub);
  var negate = function (dictRing) {
      return function (a) {
          return sub(dictRing)(Data_Semiring.zero(dictRing.Semiring0()))(a);
      };
  };
  exports["Ring"] = Ring;
  exports["negate"] = negate;
  exports["sub"] = sub;
  exports["ringInt"] = ringInt;
})(PS["Data.Ring"] = PS["Data.Ring"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Ord"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Ord_Unsafe = PS["Data.Ord.Unsafe"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];        
  var Ord = function (Eq0, compare) {
      this.Eq0 = Eq0;
      this.compare = compare;
  };
  var ordVoid = new Ord(function () {
      return Data_Eq.eqVoid;
  }, function (v) {
      return function (v1) {
          return Data_Ordering.EQ.value;
      };
  });
  var ordString = new Ord(function () {
      return Data_Eq.eqString;
  }, Data_Ord_Unsafe.unsafeCompare);
  var ordInt = new Ord(function () {
      return Data_Eq.eqInt;
  }, Data_Ord_Unsafe.unsafeCompare);
  var compare = function (dict) {
      return dict.compare;
  };
  var lessThanOrEq = function (dictOrd) {
      return function (a1) {
          return function (a2) {
              var v = compare(dictOrd)(a1)(a2);
              if (v instanceof Data_Ordering.GT) {
                  return false;
              };
              return true;
          };
      };
  };
  exports["Ord"] = Ord;
  exports["compare"] = compare;
  exports["lessThanOrEq"] = lessThanOrEq;
  exports["ordInt"] = ordInt;
  exports["ordString"] = ordString;
  exports["ordVoid"] = ordVoid;
})(PS["Data.Ord"] = PS["Data.Ord"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Bounded"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Unit = PS["Data.Unit"];        
  var Bounded = function (Ord0, bottom, top) {
      this.Ord0 = Ord0;
      this.bottom = bottom;
      this.top = top;
  };
  var top = function (dict) {
      return dict.top;
  };                                                 
  var boundedInt = new Bounded(function () {
      return Data_Ord.ordInt;
  }, $foreign.bottomInt, $foreign.topInt);
  var bottom = function (dict) {
      return dict.bottom;
  };
  exports["Bounded"] = Bounded;
  exports["bottom"] = bottom;
  exports["top"] = top;
  exports["boundedInt"] = boundedInt;
})(PS["Data.Bounded"] = PS["Data.Bounded"] || {});
(function(exports) {
    "use strict";

  exports.foldrArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = len - 1; i >= 0; i--) {
          acc = f(xs[i])(acc);
        }
        return acc;
      };
    };
  };

  exports.foldlArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = 0; i < len; i++) {
          acc = f(acc)(xs[i]);
        }
        return acc;
      };
    };
  };
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function(exports) {
    "use strict";

  exports.boolConj = function (b1) {
    return function (b2) {
      return b1 && b2;
    };
  };

  exports.boolDisj = function (b1) {
    return function (b2) {
      return b1 || b2;
    };
  };

  exports.boolNot = function (b) {
    return !b;
  };
})(PS["Data.HeytingAlgebra"] = PS["Data.HeytingAlgebra"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.HeytingAlgebra"];
  var Data_Unit = PS["Data.Unit"];        
  var HeytingAlgebra = function (conj, disj, ff, implies, not, tt) {
      this.conj = conj;
      this.disj = disj;
      this.ff = ff;
      this.implies = implies;
      this.not = not;
      this.tt = tt;
  };
  var tt = function (dict) {
      return dict.tt;
  };
  var not = function (dict) {
      return dict.not;
  };
  var implies = function (dict) {
      return dict.implies;
  };                 
  var ff = function (dict) {
      return dict.ff;
  };
  var disj = function (dict) {
      return dict.disj;
  };
  var heytingAlgebraBoolean = new HeytingAlgebra($foreign.boolConj, $foreign.boolDisj, false, function (a) {
      return function (b) {
          return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a))(b);
      };
  }, $foreign.boolNot, true);
  var conj = function (dict) {
      return dict.conj;
  };
  var heytingAlgebraFunction = function (dictHeytingAlgebra) {
      return new HeytingAlgebra(function (f) {
          return function (g) {
              return function (a) {
                  return conj(dictHeytingAlgebra)(f(a))(g(a));
              };
          };
      }, function (f) {
          return function (g) {
              return function (a) {
                  return disj(dictHeytingAlgebra)(f(a))(g(a));
              };
          };
      }, function (v) {
          return ff(dictHeytingAlgebra);
      }, function (f) {
          return function (g) {
              return function (a) {
                  return implies(dictHeytingAlgebra)(f(a))(g(a));
              };
          };
      }, function (f) {
          return function (a) {
              return not(dictHeytingAlgebra)(f(a));
          };
      }, function (v) {
          return tt(dictHeytingAlgebra);
      });
  };
  exports["HeytingAlgebra"] = HeytingAlgebra;
  exports["conj"] = conj;
  exports["disj"] = disj;
  exports["ff"] = ff;
  exports["implies"] = implies;
  exports["not"] = not;
  exports["tt"] = tt;
  exports["heytingAlgebraBoolean"] = heytingAlgebraBoolean;
  exports["heytingAlgebraFunction"] = heytingAlgebraFunction;
})(PS["Data.HeytingAlgebra"] = PS["Data.HeytingAlgebra"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var otherwise = true;
  exports["otherwise"] = otherwise;
})(PS["Data.Boolean"] = PS["Data.Boolean"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Function = PS["Data.Function"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var Monoid = function (Semigroup0, mempty) {
      this.Semigroup0 = Semigroup0;
      this.mempty = mempty;
  };                 
  var monoidString = new Monoid(function () {
      return Data_Semigroup.semigroupString;
  }, "");  
  var mempty = function (dict) {
      return dict.mempty;
  };
  exports["Monoid"] = Monoid;
  exports["mempty"] = mempty;
  exports["monoidString"] = monoidString;
})(PS["Data.Monoid"] = PS["Data.Monoid"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Monad = PS["Control.Monad"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var Nothing = (function () {
      function Nothing() {

      };
      Nothing.value = new Nothing();
      return Nothing;
  })();
  var Just = (function () {
      function Just(value0) {
          this.value0 = value0;
      };
      Just.create = function (value0) {
          return new Just(value0);
      };
      return Just;
  })();
  var maybe = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Nothing) {
                  return v;
              };
              if (v2 instanceof Just) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Maybe line 220, column 1 - line 220, column 22: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var isNothing = maybe(true)(Data_Function["const"](false));
  var isJust = maybe(false)(Data_Function["const"](true));
  var functorMaybe = new Data_Functor.Functor(function (v) {
      return function (v1) {
          if (v1 instanceof Just) {
              return new Just(v(v1.value0));
          };
          return Nothing.value;
      };
  });
  var fromMaybe = function (a) {
      return maybe(a)(Control_Category.id(Control_Category.categoryFn));
  };
  var fromJust = function (dictPartial) {
      return function (v) {
          var __unused = function (dictPartial1) {
              return function ($dollar34) {
                  return $dollar34;
              };
          };
          return __unused(dictPartial)((function () {
              if (v instanceof Just) {
                  return v.value0;
              };
              throw new Error("Failed pattern match at Data.Maybe line 271, column 1 - line 271, column 21: " + [ v.constructor.name ]);
          })());
      };
  };
  var applyMaybe = new Control_Apply.Apply(function () {
      return functorMaybe;
  }, function (v) {
      return function (v1) {
          if (v instanceof Just) {
              return Data_Functor.map(functorMaybe)(v.value0)(v1);
          };
          if (v instanceof Nothing) {
              return Nothing.value;
          };
          throw new Error("Failed pattern match at Data.Maybe line 69, column 3 - line 69, column 31: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var bindMaybe = new Control_Bind.Bind(function () {
      return applyMaybe;
  }, function (v) {
      return function (v1) {
          if (v instanceof Just) {
              return v1(v.value0);
          };
          if (v instanceof Nothing) {
              return Nothing.value;
          };
          throw new Error("Failed pattern match at Data.Maybe line 128, column 3 - line 128, column 24: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var applicativeMaybe = new Control_Applicative.Applicative(function () {
      return applyMaybe;
  }, Just.create);
  exports["Nothing"] = Nothing;
  exports["Just"] = Just;
  exports["fromJust"] = fromJust;
  exports["fromMaybe"] = fromMaybe;
  exports["isJust"] = isJust;
  exports["isNothing"] = isNothing;
  exports["maybe"] = maybe;
  exports["functorMaybe"] = functorMaybe;
  exports["applyMaybe"] = applyMaybe;
  exports["applicativeMaybe"] = applicativeMaybe;
  exports["bindMaybe"] = bindMaybe;
})(PS["Data.Maybe"] = PS["Data.Maybe"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Prelude = PS["Prelude"];        
  var Newtype = function (unwrap, wrap) {
      this.unwrap = unwrap;
      this.wrap = wrap;
  };
  var wrap = function (dict) {
      return dict.wrap;
  };
  var unwrap = function (dict) {
      return dict.unwrap;
  };
  var alaF = function (dictFunctor) {
      return function (dictFunctor1) {
          return function (dictNewtype) {
              return function (dictNewtype1) {
                  return function (v) {
                      return function (f) {
                          return function ($64) {
                              return Data_Functor.map(dictFunctor1)(unwrap(dictNewtype1))(f(Data_Functor.map(dictFunctor)(wrap(dictNewtype))($64)));
                          };
                      };
                  };
              };
          };
      };
  };
  exports["Newtype"] = Newtype;
  exports["alaF"] = alaF;
  exports["unwrap"] = unwrap;
  exports["wrap"] = wrap;
})(PS["Data.Newtype"] = PS["Data.Newtype"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];        
  var Disj = function (x) {
      return x;
  };
  var semigroupDisj = function (dictHeytingAlgebra) {
      return new Data_Semigroup.Semigroup(function (v) {
          return function (v1) {
              return Data_HeytingAlgebra.disj(dictHeytingAlgebra)(v)(v1);
          };
      });
  };
  var newtypeDisj = new Data_Newtype.Newtype(function (n) {
      return n;
  }, Disj);
  var monoidDisj = function (dictHeytingAlgebra) {
      return new Data_Monoid.Monoid(function () {
          return semigroupDisj(dictHeytingAlgebra);
      }, Data_HeytingAlgebra.ff(dictHeytingAlgebra));
  };
  exports["Disj"] = Disj;
  exports["newtypeDisj"] = newtypeDisj;
  exports["semigroupDisj"] = semigroupDisj;
  exports["monoidDisj"] = monoidDisj;
})(PS["Data.Monoid.Disj"] = PS["Data.Monoid.Disj"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Foldable"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Endo = PS["Data.Monoid.Endo"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var Foldable = function (foldMap, foldl, foldr) {
      this.foldMap = foldMap;
      this.foldl = foldl;
      this.foldr = foldr;
  };
  var foldr = function (dict) {
      return dict.foldr;
  };
  var traverse_ = function (dictApplicative) {
      return function (dictFoldable) {
          return function (f) {
              return foldr(dictFoldable)(function ($184) {
                  return Control_Apply.applySecond(dictApplicative.Apply0())(f($184));
              })(Control_Applicative.pure(dictApplicative)(Data_Unit.unit));
          };
      };
  };
  var for_ = function (dictApplicative) {
      return function (dictFoldable) {
          return Data_Function.flip(traverse_(dictApplicative)(dictFoldable));
      };
  };
  var sequence_ = function (dictApplicative) {
      return function (dictFoldable) {
          return traverse_(dictApplicative)(dictFoldable)(Control_Category.id(Control_Category.categoryFn));
      };
  };
  var foldl = function (dict) {
      return dict.foldl;
  };
  var intercalate = function (dictFoldable) {
      return function (dictMonoid) {
          return function (sep) {
              return function (xs) {
                  var go = function (v) {
                      return function (x) {
                          if (v.init) {
                              return {
                                  init: false, 
                                  acc: x
                              };
                          };
                          return {
                              init: false, 
                              acc: Data_Semigroup.append(dictMonoid.Semigroup0())(v.acc)(Data_Semigroup.append(dictMonoid.Semigroup0())(sep)(x))
                          };
                      };
                  };
                  return (foldl(dictFoldable)(go)({
                      init: true, 
                      acc: Data_Monoid.mempty(dictMonoid)
                  })(xs)).acc;
              };
          };
      };
  }; 
  var foldableMaybe = new Foldable(function (dictMonoid) {
      return function (f) {
          return function (v) {
              if (v instanceof Data_Maybe.Nothing) {
                  return Data_Monoid.mempty(dictMonoid);
              };
              if (v instanceof Data_Maybe.Just) {
                  return f(v.value0);
              };
              throw new Error("Failed pattern match at Data.Foldable line 134, column 3 - line 134, column 30: " + [ f.constructor.name, v.constructor.name ]);
          };
      };
  }, function (v) {
      return function (z) {
          return function (v1) {
              if (v1 instanceof Data_Maybe.Nothing) {
                  return z;
              };
              if (v1 instanceof Data_Maybe.Just) {
                  return v(z)(v1.value0);
              };
              throw new Error("Failed pattern match at Data.Foldable line 132, column 3 - line 132, column 25: " + [ v.constructor.name, z.constructor.name, v1.constructor.name ]);
          };
      };
  }, function (v) {
      return function (z) {
          return function (v1) {
              if (v1 instanceof Data_Maybe.Nothing) {
                  return z;
              };
              if (v1 instanceof Data_Maybe.Just) {
                  return v(v1.value0)(z);
              };
              throw new Error("Failed pattern match at Data.Foldable line 130, column 3 - line 130, column 25: " + [ v.constructor.name, z.constructor.name, v1.constructor.name ]);
          };
      };
  });
  var foldMapDefaultR = function (dictFoldable) {
      return function (dictMonoid) {
          return function (f) {
              return foldr(dictFoldable)(function (x) {
                  return function (acc) {
                      return Data_Semigroup.append(dictMonoid.Semigroup0())(f(x))(acc);
                  };
              })(Data_Monoid.mempty(dictMonoid));
          };
      };
  };
  var foldableArray = new Foldable(function (dictMonoid) {
      return foldMapDefaultR(foldableArray)(dictMonoid);
  }, $foreign.foldlArray, $foreign.foldrArray);
  var foldMap = function (dict) {
      return dict.foldMap;
  };
  var any = function (dictFoldable) {
      return function (dictHeytingAlgebra) {
          return Data_Newtype.alaF(Data_Functor.functorFn)(Data_Functor.functorFn)(Data_Monoid_Disj.newtypeDisj)(Data_Monoid_Disj.newtypeDisj)(Data_Monoid_Disj.Disj)(foldMap(dictFoldable)(Data_Monoid_Disj.monoidDisj(dictHeytingAlgebra)));
      };
  };
  var elem = function (dictFoldable) {
      return function (dictEq) {
          return function ($187) {
              return any(dictFoldable)(Data_HeytingAlgebra.heytingAlgebraBoolean)(Data_Eq.eq(dictEq)($187));
          };
      };
  };
  var notElem = function (dictFoldable) {
      return function (dictEq) {
          return function (x) {
              return function ($188) {
                  return !elem(dictFoldable)(dictEq)(x)($188);
              };
          };
      };
  };
  exports["Foldable"] = Foldable;
  exports["any"] = any;
  exports["elem"] = elem;
  exports["foldMap"] = foldMap;
  exports["foldMapDefaultR"] = foldMapDefaultR;
  exports["foldl"] = foldl;
  exports["foldr"] = foldr;
  exports["for_"] = for_;
  exports["intercalate"] = intercalate;
  exports["notElem"] = notElem;
  exports["sequence_"] = sequence_;
  exports["traverse_"] = traverse_;
  exports["foldableArray"] = foldableArray;
  exports["foldableMaybe"] = foldableMaybe;
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Bifoldable = PS["Data.Bifoldable"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Bitraversable = PS["Data.Bitraversable"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];        
  var Left = (function () {
      function Left(value0) {
          this.value0 = value0;
      };
      Left.create = function (value0) {
          return new Left(value0);
      };
      return Left;
  })();
  var Right = (function () {
      function Right(value0) {
          this.value0 = value0;
      };
      Right.create = function (value0) {
          return new Right(value0);
      };
      return Right;
  })();
  var showEither = function (dictShow) {
      return function (dictShow1) {
          return new Data_Show.Show(function (v) {
              if (v instanceof Left) {
                  return "(Left " + (Data_Show.show(dictShow)(v.value0) + ")");
              };
              if (v instanceof Right) {
                  return "(Right " + (Data_Show.show(dictShow1)(v.value0) + ")");
              };
              throw new Error("Failed pattern match at Data.Either line 161, column 3 - line 162, column 3: " + [ v.constructor.name ]);
          });
      };
  };
  var functorEither = new Data_Functor.Functor(function (v) {
      return function (v1) {
          if (v1 instanceof Left) {
              return new Left(v1.value0);
          };
          if (v1 instanceof Right) {
              return new Right(v(v1.value0));
          };
          throw new Error("Failed pattern match at Data.Either line 37, column 3 - line 37, column 26: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var either = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Left) {
                  return v(v2.value0);
              };
              if (v2 instanceof Right) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Either line 230, column 1 - line 230, column 26: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var bifunctorEither = new Data_Bifunctor.Bifunctor(function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Left) {
                  return new Left(v(v2.value0));
              };
              if (v2 instanceof Right) {
                  return new Right(v1(v2.value0));
              };
              throw new Error("Failed pattern match at Data.Either line 44, column 3 - line 44, column 34: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  });
  var applyEither = new Control_Apply.Apply(function () {
      return functorEither;
  }, function (v) {
      return function (v1) {
          if (v instanceof Left) {
              return new Left(v.value0);
          };
          if (v instanceof Right) {
              return Data_Functor.map(functorEither)(v.value0)(v1);
          };
          throw new Error("Failed pattern match at Data.Either line 80, column 3 - line 80, column 28: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  exports["Left"] = Left;
  exports["Right"] = Right;
  exports["either"] = either;
  exports["functorEither"] = functorEither;
  exports["bifunctorEither"] = bifunctorEither;
  exports["applyEither"] = applyEither;
  exports["showEither"] = showEither;
})(PS["Data.Either"] = PS["Data.Either"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var MonadThrow = function (Monad0, throwError) {
      this.Monad0 = Monad0;
      this.throwError = throwError;
  };
  var MonadError = function (MonadThrow0, catchError) {
      this.MonadThrow0 = MonadThrow0;
      this.catchError = catchError;
  };
  var throwError = function (dict) {
      return dict.throwError;
  }; 
  var catchError = function (dict) {
      return dict.catchError;
  };
  var $$try = function (dictMonadError) {
      return function (a) {
          return catchError(dictMonadError)(Data_Functor.map(((((dictMonadError.MonadThrow0()).Monad0()).Bind1()).Apply0()).Functor0())(Data_Either.Right.create)(a))(function ($21) {
              return Control_Applicative.pure(((dictMonadError.MonadThrow0()).Monad0()).Applicative0())(Data_Either.Left.create($21));
          });
      };
  };
  exports["MonadError"] = MonadError;
  exports["MonadThrow"] = MonadThrow;
  exports["catchError"] = catchError;
  exports["throwError"] = throwError;
  exports["try"] = $$try;
})(PS["Control.Monad.Error.Class"] = PS["Control.Monad.Error.Class"] || {});
(function(exports) {
    "use strict";

  exports.unsafeCoerceEff = function (f) {
    return f;
  };
})(PS["Control.Monad.Eff.Unsafe"] = PS["Control.Monad.Eff.Unsafe"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Unsafe"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];        
  var unsafePerformEff = function ($0) {
      return Control_Monad_Eff.runPure($foreign.unsafeCoerceEff($0));
  };
  exports["unsafePerformEff"] = unsafePerformEff;
  exports["unsafeCoerceEff"] = $foreign.unsafeCoerceEff;
})(PS["Control.Monad.Eff.Unsafe"] = PS["Control.Monad.Eff.Unsafe"] || {});
(function(exports) {
    "use strict";

  exports.newSTRef = function (val) {
    return function () {
      return { value: val };
    };
  };

  exports.readSTRef = function (ref) {
    return function () {
      return ref.value;
    };
  };
})(PS["Control.Monad.ST"] = PS["Control.Monad.ST"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Control.Monad.ST"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  exports["newSTRef"] = $foreign.newSTRef;
  exports["readSTRef"] = $foreign.readSTRef;
})(PS["Control.Monad.ST"] = PS["Control.Monad.ST"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Data_Unit = PS["Data.Unit"];        
  var Lazy = function (defer) {
      this.defer = defer;
  }; 
  var defer = function (dict) {
      return dict.defer;
  };
  var fix = function (dictLazy) {
      return function (f) {
          return defer(dictLazy)(function (v) {
              return f(fix(dictLazy)(f));
          });
      };
  };
  exports["Lazy"] = Lazy;
  exports["defer"] = defer;
  exports["fix"] = fix;
})(PS["Control.Lazy"] = PS["Control.Lazy"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad = PS["Control.Monad"];
  var Data_BooleanAlgebra = PS["Data.BooleanAlgebra"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_CommutativeRing = PS["Data.CommutativeRing"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Field = PS["Data.Field"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];        
  var Identity = function (x) {
      return x;
  };
  var newtypeIdentity = new Data_Newtype.Newtype(function (n) {
      return n;
  }, Identity);
  var functorIdentity = new Data_Functor.Functor(function (f) {
      return function (v) {
          return f(v);
      };
  });
  var applyIdentity = new Control_Apply.Apply(function () {
      return functorIdentity;
  }, function (v) {
      return function (v1) {
          return v(v1);
      };
  });
  var bindIdentity = new Control_Bind.Bind(function () {
      return applyIdentity;
  }, function (v) {
      return function (f) {
          return f(v);
      };
  });
  var applicativeIdentity = new Control_Applicative.Applicative(function () {
      return applyIdentity;
  }, Identity);
  var monadIdentity = new Control_Monad.Monad(function () {
      return applicativeIdentity;
  }, function () {
      return bindIdentity;
  });
  exports["Identity"] = Identity;
  exports["newtypeIdentity"] = newtypeIdentity;
  exports["functorIdentity"] = functorIdentity;
  exports["applyIdentity"] = applyIdentity;
  exports["applicativeIdentity"] = applicativeIdentity;
  exports["bindIdentity"] = bindIdentity;
  exports["monadIdentity"] = monadIdentity;
})(PS["Data.Identity"] = PS["Data.Identity"] || {});
(function(exports) {
    "use strict";

  // module Partial.Unsafe

  exports.unsafePartial = function (f) {
    return f();
  };
})(PS["Partial.Unsafe"] = PS["Partial.Unsafe"] || {});
(function(exports) {
    "use strict";

  // module Partial

  exports.crashWith = function () {
    return function (msg) {
      throw new Error(msg);
    };
  };
})(PS["Partial"] = PS["Partial"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Partial"];
  exports["crashWith"] = $foreign.crashWith;
})(PS["Partial"] = PS["Partial"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Partial.Unsafe"];
  var Partial = PS["Partial"];
  var unsafeCrashWith = function (msg) {
      return $foreign.unsafePartial(function (dictPartial) {
          return Partial.crashWith(dictPartial)(msg);
      });
  };
  exports["unsafeCrashWith"] = unsafeCrashWith;
})(PS["Partial.Unsafe"] = PS["Partial.Unsafe"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Unsafe = PS["Control.Monad.Eff.Unsafe"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Either = PS["Data.Either"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Unit = PS["Data.Unit"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
  var Loop = (function () {
      function Loop(value0) {
          this.value0 = value0;
      };
      Loop.create = function (value0) {
          return new Loop(value0);
      };
      return Loop;
  })();
  var Done = (function () {
      function Done(value0) {
          this.value0 = value0;
      };
      Done.create = function (value0) {
          return new Done(value0);
      };
      return Done;
  })();
  var MonadRec = function (Monad0, tailRecM) {
      this.Monad0 = Monad0;
      this.tailRecM = tailRecM;
  };
  var tailRecM = function (dict) {
      return dict.tailRecM;
  };
  var tailRecEff = function (f) {
      return function (a) {
          var fromDone = function (v) {
              var __unused = function (dictPartial1) {
                  return function ($dollar16) {
                      return $dollar16;
                  };
              };
              return __unused()((function () {
                  if (v instanceof Done) {
                      return v.value0;
                  };
                  throw new Error("Failed pattern match at Control.Monad.Rec.Class line 141, column 28 - line 141, column 42: " + [ v.constructor.name ]);
              })());
          };
          var f$prime = function ($52) {
              return Control_Monad_Eff_Unsafe.unsafeCoerceEff(f($52));
          };
          return function __do() {
              var v = Control_Bind.bindFlipped(Control_Monad_Eff.bindEff)(Control_Monad_ST.newSTRef)(f$prime(a))();
              (function () {
                  while (!(function __do() {
                      var v1 = v.value;
                      if (v1 instanceof Loop) {
                          var v2 = f$prime(v1.value0)();
                          var v3 = v.value = v2;
                          return false;
                      };
                      if (v1 instanceof Done) {
                          return true;
                      };
                      throw new Error("Failed pattern match at Control.Monad.Rec.Class line 130, column 5 - line 135, column 26: " + [ v1.constructor.name ]);
                  })()) {

                  };
                  return {};
              })();
              return Data_Functor.map(Control_Monad_Eff.functorEff)(fromDone)(Control_Monad_ST.readSTRef(v))();
          };
      };
  }; 
  var monadRecEff = new MonadRec(function () {
      return Control_Monad_Eff.monadEff;
  }, tailRecEff);
  exports["Loop"] = Loop;
  exports["Done"] = Done;
  exports["MonadRec"] = MonadRec;
  exports["tailRecM"] = tailRecM;
  exports["monadRecEff"] = monadRecEff;
})(PS["Control.Monad.Rec.Class"] = PS["Control.Monad.Rec.Class"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Biapplicative = PS["Control.Biapplicative"];
  var Control_Biapply = PS["Control.Biapply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifoldable = PS["Data.Bifoldable"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Bitraversable = PS["Data.Bitraversable"];
  var Data_BooleanAlgebra = PS["Data.BooleanAlgebra"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_CommutativeRing = PS["Data.CommutativeRing"];
  var Data_Distributive = PS["Data.Distributive"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Type_Equality = PS["Type.Equality"];        
  var Tuple = (function () {
      function Tuple(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Tuple.create = function (value0) {
          return function (value1) {
              return new Tuple(value0, value1);
          };
      };
      return Tuple;
  })();
  var snd = function (v) {
      return v.value1;
  };
  var functorTuple = new Data_Functor.Functor(function (f) {
      return function (v) {
          return new Tuple(v.value0, f(v.value1));
      };
  });                                                                                                   
  var fst = function (v) {
      return v.value0;
  };
  exports["Tuple"] = Tuple;
  exports["fst"] = fst;
  exports["snd"] = snd;
  exports["functorTuple"] = functorTuple;
})(PS["Data.Tuple"] = PS["Data.Tuple"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var MonadState = function (Monad0, state) {
      this.Monad0 = Monad0;
      this.state = state;
  };
  var state = function (dict) {
      return dict.state;
  };
  var put = function (dictMonadState) {
      return function (s) {
          return state(dictMonadState)(function (v) {
              return new Data_Tuple.Tuple(Data_Unit.unit, s);
          });
      };
  };
  var modify = function (dictMonadState) {
      return function (f) {
          return state(dictMonadState)(function (s) {
              return new Data_Tuple.Tuple(Data_Unit.unit, f(s));
          });
      };
  };
  var gets = function (dictMonadState) {
      return function (f) {
          return state(dictMonadState)(function (s) {
              return new Data_Tuple.Tuple(f(s), s);
          });
      };
  };
  var get = function (dictMonadState) {
      return state(dictMonadState)(function (s) {
          return new Data_Tuple.Tuple(s, s);
      });
  };
  exports["MonadState"] = MonadState;
  exports["get"] = get;
  exports["gets"] = gets;
  exports["modify"] = modify;
  exports["put"] = put;
  exports["state"] = state;
})(PS["Control.Monad.State.Class"] = PS["Control.Monad.State.Class"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Prelude = PS["Prelude"];        
  var MonadTrans = function (lift) {
      this.lift = lift;
  };
  var lift = function (dict) {
      return dict.lift;
  };
  exports["MonadTrans"] = MonadTrans;
  exports["lift"] = lift;
})(PS["Control.Monad.Trans.Class"] = PS["Control.Monad.Trans.Class"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Cont_Class = PS["Control.Monad.Cont.Class"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Reader_Class = PS["Control.Monad.Reader.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Monad_Writer_Class = PS["Control.Monad.Writer.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Tuple = PS["Data.Tuple"];
  var Prelude = PS["Prelude"];        
  var ExceptT = function (x) {
      return x;
  };
  var runExceptT = function (v) {
      return v;
  };          
  var monadTransExceptT = new Control_Monad_Trans_Class.MonadTrans(function (dictMonad) {
      return function (m) {
          return Control_Bind.bind(dictMonad.Bind1())(m)(function (v) {
              return Control_Applicative.pure(dictMonad.Applicative0())(new Data_Either.Right(v));
          });
      };
  });
  var mapExceptT = function (f) {
      return function (v) {
          return f(v);
      };
  };
  var functorExceptT = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return mapExceptT(Data_Functor.map(dictFunctor)(Data_Functor.map(Data_Either.functorEither)(f)));
      });
  };
  var except = function (dictApplicative) {
      return function ($96) {
          return ExceptT(Control_Applicative.pure(dictApplicative)($96));
      };
  };
  var monadExceptT = function (dictMonad) {
      return new Control_Monad.Monad(function () {
          return applicativeExceptT(dictMonad);
      }, function () {
          return bindExceptT(dictMonad);
      });
  };
  var bindExceptT = function (dictMonad) {
      return new Control_Bind.Bind(function () {
          return applyExceptT(dictMonad);
      }, function (v) {
          return function (k) {
              return Control_Bind.bind(dictMonad.Bind1())(v)(Data_Either.either(function ($97) {
                  return Control_Applicative.pure(dictMonad.Applicative0())(Data_Either.Left.create($97));
              })(function (a) {
                  var v1 = k(a);
                  return v1;
              }));
          };
      });
  };
  var applyExceptT = function (dictMonad) {
      return new Control_Apply.Apply(function () {
          return functorExceptT(((dictMonad.Bind1()).Apply0()).Functor0());
      }, Control_Monad.ap(monadExceptT(dictMonad)));
  };
  var applicativeExceptT = function (dictMonad) {
      return new Control_Applicative.Applicative(function () {
          return applyExceptT(dictMonad);
      }, function ($98) {
          return ExceptT(Control_Applicative.pure(dictMonad.Applicative0())(Data_Either.Right.create($98)));
      });
  };
  var monadStateExceptT = function (dictMonadState) {
      return new Control_Monad_State_Class.MonadState(function () {
          return monadExceptT(dictMonadState.Monad0());
      }, function (f) {
          return Control_Monad_Trans_Class.lift(monadTransExceptT)(dictMonadState.Monad0())(Control_Monad_State_Class.state(dictMonadState)(f));
      });
  };
  var monadThrowExceptT = function (dictMonad) {
      return new Control_Monad_Error_Class.MonadThrow(function () {
          return monadExceptT(dictMonad);
      }, function ($102) {
          return ExceptT(Control_Applicative.pure(dictMonad.Applicative0())(Data_Either.Left.create($102)));
      });
  };
  exports["ExceptT"] = ExceptT;
  exports["except"] = except;
  exports["mapExceptT"] = mapExceptT;
  exports["runExceptT"] = runExceptT;
  exports["functorExceptT"] = functorExceptT;
  exports["applyExceptT"] = applyExceptT;
  exports["applicativeExceptT"] = applicativeExceptT;
  exports["bindExceptT"] = bindExceptT;
  exports["monadExceptT"] = monadExceptT;
  exports["monadTransExceptT"] = monadTransExceptT;
  exports["monadThrowExceptT"] = monadThrowExceptT;
  exports["monadStateExceptT"] = monadStateExceptT;
})(PS["Control.Monad.Except.Trans"] = PS["Control.Monad.Except.Trans"] || {});
(function(exports) {
    "use strict";

  exports.toForeign = function (value) {
    return value;
  };

  exports.unsafeFromForeign = function (value) {
    return value;
  };

  exports.typeOf = function (value) {
    return typeof value;
  };

  exports.tagOf = function (value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  };
})(PS["Data.Foreign"] = PS["Data.Foreign"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Newtype = PS["Data.Newtype"];
  var Prelude = PS["Prelude"];                                                           
  var runExcept = function ($0) {
      return Data_Newtype.unwrap(Data_Identity.newtypeIdentity)(Control_Monad_Except_Trans.runExceptT($0));
  };
  exports["runExcept"] = runExcept;
})(PS["Control.Monad.Except"] = PS["Control.Monad.Except"] || {});
(function(exports) {
    "use strict";

  // module Data.Int

  exports.fromNumberImpl = function (just) {
    return function (nothing) {
      return function (n) {
        /* jshint bitwise: false */
        return (n | 0) === n ? just(n) : nothing;
      };
    };
  };

  exports.toNumber = function (n) {
    return n;
  };
})(PS["Data.Int"] = PS["Data.Int"] || {});
(function(exports) {
  /* globals exports */
  "use strict";         

  exports.infinity = Infinity;
})(PS["Global"] = PS["Global"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Global"];
  exports["infinity"] = $foreign.infinity;
})(PS["Global"] = PS["Global"] || {});
(function(exports) {
    "use strict";        

  exports.floor = Math.floor;

  exports.pow = function (n) {
    return function (p) {
      return Math.pow(n, p);
    };
  };
})(PS["Math"] = PS["Math"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Math"];
  exports["floor"] = $foreign.floor;
  exports["pow"] = $foreign.pow;
})(PS["Math"] = PS["Math"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Int"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Eq = PS["Data.Eq"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Int_Bits = PS["Data.Int.Bits"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Show = PS["Data.Show"];
  var Global = PS["Global"];
  var $$Math = PS["Math"];
  var Prelude = PS["Prelude"];      
  var fromNumber = $foreign.fromNumberImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
  var unsafeClamp = function (x) {
      if (x === Global.infinity) {
          return 0;
      };
      if (x === -Global.infinity) {
          return 0;
      };
      if (x >= $foreign.toNumber(Data_Bounded.top(Data_Bounded.boundedInt))) {
          return Data_Bounded.top(Data_Bounded.boundedInt);
      };
      if (x <= $foreign.toNumber(Data_Bounded.bottom(Data_Bounded.boundedInt))) {
          return Data_Bounded.bottom(Data_Bounded.boundedInt);
      };
      if (Data_Boolean.otherwise) {
          return Data_Maybe.fromMaybe(0)(fromNumber(x));
      };
      throw new Error("Failed pattern match at Data.Int line 65, column 1 - line 70, column 43: " + [ x.constructor.name ]);
  };
  var floor = function ($14) {
      return unsafeClamp($$Math.floor($14));
  };
  exports["floor"] = floor;
  exports["fromNumber"] = fromNumber;
  exports["toNumber"] = $foreign.toNumber;
})(PS["Data.Int"] = PS["Data.Int"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];        
  var NonEmpty = (function () {
      function NonEmpty(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      NonEmpty.create = function (value0) {
          return function (value1) {
              return new NonEmpty(value0, value1);
          };
      };
      return NonEmpty;
  })();
  var singleton = function (dictPlus) {
      return function (a) {
          return new NonEmpty(a, Control_Plus.empty(dictPlus));
      };
  };
  var showNonEmpty = function (dictShow) {
      return function (dictShow1) {
          return new Data_Show.Show(function (v) {
              return "(NonEmpty " + (Data_Show.show(dictShow)(v.value0) + (" " + (Data_Show.show(dictShow1)(v.value1) + ")")));
          });
      };
  };
  var functorNonEmpty = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return function (v) {
              return new NonEmpty(f(v.value0), Data_Functor.map(dictFunctor)(f)(v.value1));
          };
      });
  };
  exports["NonEmpty"] = NonEmpty;
  exports["singleton"] = singleton;
  exports["showNonEmpty"] = showNonEmpty;
  exports["functorNonEmpty"] = functorNonEmpty;
})(PS["Data.NonEmpty"] = PS["Data.NonEmpty"] || {});
(function(exports) {
    "use strict";

  exports.unfoldrArrayImpl = function (isNothing) {
    return function (fromJust) {
      return function (fst) {
        return function (snd) {
          return function (f) {
            return function (b) {
              var result = [];
              var value = b;
              while (true) { // eslint-disable-line no-constant-condition
                var maybe = f(value);
                if (isNothing(maybe)) return result;
                var tuple = fromJust(maybe);
                result.push(fst(tuple));
                value = snd(tuple);
              }
            };
          };
        };
      };
    };
  };
})(PS["Data.Unfoldable"] = PS["Data.Unfoldable"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Unfoldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
  var Unfoldable = function (unfoldr) {
      this.unfoldr = unfoldr;
  };
  var unfoldr = function (dict) {
      return dict.unfoldr;
  };
  var unfoldableArray = new Unfoldable($foreign.unfoldrArrayImpl(Data_Maybe.isNothing)(Data_Maybe.fromJust())(Data_Tuple.fst)(Data_Tuple.snd));
  exports["Unfoldable"] = Unfoldable;
  exports["unfoldr"] = unfoldr;
  exports["unfoldableArray"] = unfoldableArray;
})(PS["Data.Unfoldable"] = PS["Data.Unfoldable"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Monad = PS["Control.Monad"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semigroup_Foldable = PS["Data.Semigroup.Foldable"];
  var Data_Semigroup_Traversable = PS["Data.Semigroup.Traversable"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Prelude = PS["Prelude"];        
  var Nil = (function () {
      function Nil() {

      };
      Nil.value = new Nil();
      return Nil;
  })();
  var Cons = (function () {
      function Cons(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Cons.create = function (value0) {
          return function (value1) {
              return new Cons(value0, value1);
          };
      };
      return Cons;
  })();
  var NonEmptyList = function (x) {
      return x;
  };
  var foldableList = new Data_Foldable.Foldable(function (dictMonoid) {
      return function (f) {
          return Data_Foldable.foldl(foldableList)(function (acc) {
              return function ($143) {
                  return Data_Semigroup.append(dictMonoid.Semigroup0())(acc)(f($143));
              };
          })(Data_Monoid.mempty(dictMonoid));
      };
  }, function (f) {
      var go = function (__copy_b) {
          return function (__copy_v) {
              var __tco_b = __copy_b;
              var __tco_done = false;
              var __tco_result;
              function __tco_loop(b, v) {
                  if (v instanceof Nil) {
                      __tco_done = true;
                      return b;
                  };
                  if (v instanceof Cons) {
                      __tco_b = f(b)(v.value0);
                      __copy_v = v.value1;
                      return;
                  };
                  throw new Error("Failed pattern match at Data.List.Types line 78, column 12 - line 80, column 30: " + [ v.constructor.name ]);
              };
              while (!__tco_done) {
                  __tco_result = __tco_loop(__tco_b, __copy_v);
              };
              return __tco_result;
          };
      };
      return go;
  }, function (f) {
      return function (b) {
          var rev = function (__copy_acc) {
              return function (__copy_v) {
                  var __tco_acc = __copy_acc;
                  var __tco_done = false;
                  var __tco_result;
                  function __tco_loop(acc, v) {
                      if (v instanceof Nil) {
                          __tco_done = true;
                          return acc;
                      };
                      if (v instanceof Cons) {
                          __tco_acc = new Cons(v.value0, acc);
                          __copy_v = v.value1;
                          return;
                      };
                      throw new Error("Failed pattern match at Data.List.Types line 73, column 15 - line 75, column 33: " + [ v.constructor.name ]);
                  };
                  while (!__tco_done) {
                      __tco_result = __tco_loop(__tco_acc, __copy_v);
                  };
                  return __tco_result;
              };
          };
          return function ($144) {
              return Data_Foldable.foldl(foldableList)(Data_Function.flip(f))(b)(rev(Nil.value)($144));
          };
      };
  });                                                                     
  var functorList = new Data_Functor.Functor(function (f) {
      return Data_Foldable.foldr(foldableList)(function (x) {
          return function (acc) {
              return new Cons(f(x), acc);
          };
      })(Nil.value);
  });
  var functorNonEmptyList = Data_NonEmpty.functorNonEmpty(functorList);
  var semigroupList = new Data_Semigroup.Semigroup(function (xs) {
      return function (ys) {
          return Data_Foldable.foldr(foldableList)(Cons.create)(ys)(xs);
      };
  });
  var showList = function (dictShow) {
      return new Data_Show.Show(function (v) {
          if (v instanceof Nil) {
              return "Nil";
          };
          return "(" + (Data_Foldable.intercalate(foldableList)(Data_Monoid.monoidString)(" : ")(Data_Functor.map(functorList)(Data_Show.show(dictShow))(v)) + " : Nil)");
      });
  };
  var showNonEmptyList = function (dictShow) {
      return new Data_Show.Show(function (v) {
          return "(NonEmptyList " + (Data_Show.show(Data_NonEmpty.showNonEmpty(dictShow)(showList(dictShow)))(v) + ")");
      });
  }; 
  var applyList = new Control_Apply.Apply(function () {
      return functorList;
  }, function (v) {
      return function (v1) {
          if (v instanceof Nil) {
              return Nil.value;
          };
          if (v instanceof Cons) {
              return Data_Semigroup.append(semigroupList)(Data_Functor.map(functorList)(v.value0)(v1))(Control_Apply.apply(applyList)(v.value1)(v1));
          };
          throw new Error("Failed pattern match at Data.List.Types line 95, column 3 - line 95, column 20: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var applyNonEmptyList = new Control_Apply.Apply(function () {
      return functorNonEmptyList;
  }, function (v) {
      return function (v1) {
          return new Data_NonEmpty.NonEmpty(v.value0(v1.value0), Data_Semigroup.append(semigroupList)(Control_Apply.apply(applyList)(v.value1)(new Cons(v1.value0, Nil.value)))(Control_Apply.apply(applyList)(new Cons(v.value0, v.value1))(v1.value1)));
      };
  });
  var applicativeList = new Control_Applicative.Applicative(function () {
      return applyList;
  }, function (a) {
      return new Cons(a, Nil.value);
  });                                              
  var altList = new Control_Alt.Alt(function () {
      return functorList;
  }, Data_Semigroup.append(semigroupList));
  var plusList = new Control_Plus.Plus(function () {
      return altList;
  }, Nil.value);
  var applicativeNonEmptyList = new Control_Applicative.Applicative(function () {
      return applyNonEmptyList;
  }, function ($149) {
      return NonEmptyList(Data_NonEmpty.singleton(plusList)($149));
  });
  exports["Nil"] = Nil;
  exports["Cons"] = Cons;
  exports["NonEmptyList"] = NonEmptyList;
  exports["showList"] = showList;
  exports["semigroupList"] = semigroupList;
  exports["functorList"] = functorList;
  exports["foldableList"] = foldableList;
  exports["applyList"] = applyList;
  exports["applicativeList"] = applicativeList;
  exports["altList"] = altList;
  exports["plusList"] = plusList;
  exports["showNonEmptyList"] = showNonEmptyList;
  exports["functorNonEmptyList"] = functorNonEmptyList;
  exports["applyNonEmptyList"] = applyNonEmptyList;
  exports["applicativeNonEmptyList"] = applicativeNonEmptyList;
})(PS["Data.List.Types"] = PS["Data.List.Types"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];                                                   
  var uncons = function (v) {
      if (v instanceof Data_List_Types.Nil) {
          return Data_Maybe.Nothing.value;
      };
      if (v instanceof Data_List_Types.Cons) {
          return new Data_Maybe.Just({
              head: v.value0, 
              tail: v.value1
          });
      };
      throw new Error("Failed pattern match at Data.List line 259, column 1 - line 259, column 21: " + [ v.constructor.name ]);
  };
  var toUnfoldable = function (dictUnfoldable) {
      return Data_Unfoldable.unfoldr(dictUnfoldable)(function (xs) {
          return Data_Functor.map(Data_Maybe.functorMaybe)(function (rec) {
              return new Data_Tuple.Tuple(rec.head, rec.tail);
          })(uncons(xs));
      });
  };
  var tail = function (v) {
      if (v instanceof Data_List_Types.Nil) {
          return Data_Maybe.Nothing.value;
      };
      if (v instanceof Data_List_Types.Cons) {
          return new Data_Maybe.Just(v.value1);
      };
      throw new Error("Failed pattern match at Data.List line 245, column 1 - line 245, column 19: " + [ v.constructor.name ]);
  };
  var reverse = (function () {
      var go = function (__copy_acc) {
          return function (__copy_v) {
              var __tco_acc = __copy_acc;
              var __tco_done = false;
              var __tco_result;
              function __tco_loop(acc, v) {
                  if (v instanceof Data_List_Types.Nil) {
                      __tco_done = true;
                      return acc;
                  };
                  if (v instanceof Data_List_Types.Cons) {
                      __tco_acc = new Data_List_Types.Cons(v.value0, acc);
                      __copy_v = v.value1;
                      return;
                  };
                  throw new Error("Failed pattern match at Data.List line 365, column 11 - line 368, column 36: " + [ acc.constructor.name, v.constructor.name ]);
              };
              while (!__tco_done) {
                  __tco_result = __tco_loop(__tco_acc, __copy_v);
              };
              return __tco_result;
          };
      };
      return go(Data_List_Types.Nil.value);
  })();
  var $$null = function (v) {
      if (v instanceof Data_List_Types.Nil) {
          return true;
      };
      return false;
  };
  var some = function (dictAlternative) {
      return function (dictLazy) {
          return function (v) {
              return Control_Apply.apply((dictAlternative.Applicative0()).Apply0())(Data_Functor.map(((dictAlternative.Plus1()).Alt0()).Functor0())(Data_List_Types.Cons.create)(v))(Control_Lazy.defer(dictLazy)(function (v1) {
                  return many(dictAlternative)(dictLazy)(v);
              }));
          };
      };
  };
  var many = function (dictAlternative) {
      return function (dictLazy) {
          return function (v) {
              return Control_Alt.alt((dictAlternative.Plus1()).Alt0())(some(dictAlternative)(dictLazy)(v))(Control_Applicative.pure(dictAlternative.Applicative0())(Data_List_Types.Nil.value));
          };
      };
  };
  var head = function (v) {
      if (v instanceof Data_List_Types.Nil) {
          return Data_Maybe.Nothing.value;
      };
      if (v instanceof Data_List_Types.Cons) {
          return new Data_Maybe.Just(v.value0);
      };
      throw new Error("Failed pattern match at Data.List line 230, column 1 - line 230, column 19: " + [ v.constructor.name ]);
  };
  exports["head"] = head;
  exports["many"] = many;
  exports["null"] = $$null;
  exports["reverse"] = reverse;
  exports["some"] = some;
  exports["tail"] = tail;
  exports["toUnfoldable"] = toUnfoldable;
  exports["uncons"] = uncons;
})(PS["Data.List"] = PS["Data.List"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semigroup_Foldable = PS["Data.Semigroup.Foldable"];
  var Data_Semigroup_Traversable = PS["Data.Semigroup.Traversable"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];
  var singleton = function ($160) {
      return Data_List_Types.NonEmptyList(Data_NonEmpty.singleton(Data_List_Types.plusList)($160));
  };
  exports["singleton"] = singleton;
})(PS["Data.List.NonEmpty"] = PS["Data.List.NonEmpty"] || {});
(function(exports) {
    "use strict";

  exports._charAt = function (just) {
    return function (nothing) {
      return function (i) {
        return function (s) {
          return i >= 0 && i < s.length ? just(s.charAt(i)) : nothing;
        };
      };
    };
  };

  exports.singleton = function (c) {
    return c;
  };

  exports.fromCharArray = function (a) {
    return a.join("");
  };

  exports._indexOf = function (just) {
    return function (nothing) {
      return function (x) {
        return function (s) {
          var i = s.indexOf(x);
          return i === -1 ? nothing : just(i);
        };
      };
    };
  };

  exports.length = function (s) {
    return s.length;
  };

  exports.drop = function (n) {
    return function (s) {
      return s.substring(n);
    };
  };

  exports.split = function (sep) {
    return function (s) {
      return s.split(sep);
    };
  };

  exports.toCharArray = function (s) {
    return s.split("");
  };

  exports.toLower = function (s) {
    return s.toLowerCase();
  };
})(PS["Data.String"] = PS["Data.String"] || {});
(function(exports) {
    "use strict";

  exports.charAt = function (i) {
    return function (s) {
      if (i >= 0 && i < s.length) return s.charAt(i);
      throw new Error("Data.String.Unsafe.charAt: Invalid index.");
    };
  };
})(PS["Data.String.Unsafe"] = PS["Data.String.Unsafe"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.String.Unsafe"];
  exports["charAt"] = $foreign.charAt;
})(PS["Data.String.Unsafe"] = PS["Data.String.Unsafe"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.String"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_String_Unsafe = PS["Data.String.Unsafe"];
  var Prelude = PS["Prelude"];
  var Pattern = function (x) {
      return x;
  };
  var uncons = function (v) {
      if (v === "") {
          return Data_Maybe.Nothing.value;
      };
      return new Data_Maybe.Just({
          head: Data_String_Unsafe.charAt(0)(v), 
          tail: $foreign.drop(1)(v)
      });
  }; 
  var $$null = function (s) {
      return s === "";
  };              
  var newtypePattern = new Data_Newtype.Newtype(function (n) {
      return n;
  }, Pattern);                                                                                
  var indexOf = $foreign._indexOf(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);      
  var charAt = $foreign._charAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
  exports["Pattern"] = Pattern;
  exports["charAt"] = charAt;
  exports["indexOf"] = indexOf;
  exports["null"] = $$null;
  exports["uncons"] = uncons;
  exports["newtypePattern"] = newtypePattern;
  exports["drop"] = $foreign.drop;
  exports["fromCharArray"] = $foreign.fromCharArray;
  exports["length"] = $foreign.length;
  exports["singleton"] = $foreign.singleton;
  exports["split"] = $foreign.split;
  exports["toCharArray"] = $foreign.toCharArray;
  exports["toLower"] = $foreign.toLower;
})(PS["Data.String"] = PS["Data.String"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Foreign"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Int = PS["Data.Int"];
  var Data_List_NonEmpty = PS["Data.List.NonEmpty"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_String = PS["Data.String"];
  var Prelude = PS["Prelude"];        
  var ForeignError = (function () {
      function ForeignError(value0) {
          this.value0 = value0;
      };
      ForeignError.create = function (value0) {
          return new ForeignError(value0);
      };
      return ForeignError;
  })();
  var TypeMismatch = (function () {
      function TypeMismatch(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      TypeMismatch.create = function (value0) {
          return function (value1) {
              return new TypeMismatch(value0, value1);
          };
      };
      return TypeMismatch;
  })();
  var ErrorAtIndex = (function () {
      function ErrorAtIndex(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ErrorAtIndex.create = function (value0) {
          return function (value1) {
              return new ErrorAtIndex(value0, value1);
          };
      };
      return ErrorAtIndex;
  })();
  var ErrorAtProperty = (function () {
      function ErrorAtProperty(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ErrorAtProperty.create = function (value0) {
          return function (value1) {
              return new ErrorAtProperty(value0, value1);
          };
      };
      return ErrorAtProperty;
  })();
  var JSONError = (function () {
      function JSONError(value0) {
          this.value0 = value0;
      };
      JSONError.create = function (value0) {
          return new JSONError(value0);
      };
      return JSONError;
  })();
  var showForeignError = new Data_Show.Show(function (v) {
      if (v instanceof ForeignError) {
          return "(ForeignError " + (Data_Show.show(Data_Show.showString)(v.value0) + ")");
      };
      if (v instanceof ErrorAtIndex) {
          return "(ErrorAtIndex " + (Data_Show.show(Data_Show.showInt)(v.value0) + (" " + (Data_Show.show(showForeignError)(v.value1) + ")")));
      };
      if (v instanceof ErrorAtProperty) {
          return "(ErrorAtProperty " + (Data_Show.show(Data_Show.showString)(v.value0) + (" " + (Data_Show.show(showForeignError)(v.value1) + ")")));
      };
      if (v instanceof JSONError) {
          return "(JSONError " + (Data_Show.show(Data_Show.showString)(v.value0) + ")");
      };
      if (v instanceof TypeMismatch) {
          return "(TypeMismatch " + (Data_Show.show(Data_Show.showString)(v.value0) + (" " + (Data_Show.show(Data_Show.showString)(v.value1) + ")")));
      };
      throw new Error("Failed pattern match at Data.Foreign line 65, column 3 - line 66, column 3: " + [ v.constructor.name ]);
  });
  var fail = function ($121) {
      return Control_Monad_Error_Class.throwError(Control_Monad_Except_Trans.monadThrowExceptT(Data_Identity.monadIdentity))(Data_List_NonEmpty.singleton($121));
  };
  var unsafeReadTagged = function (tag) {
      return function (value) {
          if ($foreign.tagOf(value) === tag) {
              return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))($foreign.unsafeFromForeign(value));
          };
          if (Data_Boolean.otherwise) {
              return fail(new TypeMismatch(tag, $foreign.tagOf(value)));
          };
          throw new Error("Failed pattern match at Data.Foreign line 105, column 1 - line 107, column 54: " + [ tag.constructor.name, value.constructor.name ]);
      };
  };
  var readString = unsafeReadTagged("String");
  exports["ForeignError"] = ForeignError;
  exports["TypeMismatch"] = TypeMismatch;
  exports["ErrorAtIndex"] = ErrorAtIndex;
  exports["ErrorAtProperty"] = ErrorAtProperty;
  exports["JSONError"] = JSONError;
  exports["fail"] = fail;
  exports["readString"] = readString;
  exports["unsafeReadTagged"] = unsafeReadTagged;
  exports["showForeignError"] = showForeignError;
  exports["toForeign"] = $foreign.toForeign;
  exports["typeOf"] = $foreign.typeOf;
})(PS["Data.Foreign"] = PS["Data.Foreign"] || {});
(function(exports) {
    "use strict";

  // module Unsafe.Coerce

  exports.unsafeCoerce = function (x) {
    return x;
  };
})(PS["Unsafe.Coerce"] = PS["Unsafe.Coerce"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Unsafe.Coerce"];
  exports["unsafeCoerce"] = $foreign.unsafeCoerce;
})(PS["Unsafe.Coerce"] = PS["Unsafe.Coerce"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var DOM_Event_Types = PS["DOM.Event.Types"];
  var DOM_Util_FFI = PS["DOM.Util.FFI"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];                           
  var elementToNode = Unsafe_Coerce.unsafeCoerce;
  exports["elementToNode"] = elementToNode;
})(PS["DOM.Node.Types"] = PS["DOM.Node.Types"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["DOM.HTML.Types"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM_Event_Types = PS["DOM.Event.Types"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Data_Either = PS["Data.Either"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Identity = PS["Data.Identity"];
  var Data_List_Types = PS["Data.List.Types"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var windowToEventTarget = Unsafe_Coerce.unsafeCoerce;                        
  var readHTMLElement = $foreign._readHTMLElement(function ($0) {
      return Control_Monad_Except_Trans.except(Data_Identity.applicativeIdentity)(Data_Either.Left.create(Control_Applicative.pure(Data_List_Types.applicativeNonEmptyList)(Data_Foreign.TypeMismatch.create("HTMLElement")($0))));
  })(function ($1) {
      return Control_Monad_Except_Trans.except(Data_Identity.applicativeIdentity)(Data_Either.Right.create($1));
  });                                                                    
  var htmlElementToNode = Unsafe_Coerce.unsafeCoerce;   
  var htmlDocumentToParentNode = Unsafe_Coerce.unsafeCoerce; 
  var htmlDocumentToDocument = Unsafe_Coerce.unsafeCoerce;
  exports["htmlDocumentToDocument"] = htmlDocumentToDocument;
  exports["htmlDocumentToParentNode"] = htmlDocumentToParentNode;
  exports["htmlElementToNode"] = htmlElementToNode;
  exports["readHTMLElement"] = readHTMLElement;
  exports["windowToEventTarget"] = windowToEventTarget;
})(PS["DOM.HTML.Types"] = PS["DOM.HTML.Types"] || {});
(function(exports) {
    "use strict";

  exports.runFn4 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return function (d) {
            return fn(a, b, c, d);
          };
        };
      };
    };
  };
})(PS["Data.Function.Uncurried"] = PS["Data.Function.Uncurried"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Function.Uncurried"];
  var Data_Unit = PS["Data.Unit"];
  exports["runFn4"] = $foreign.runFn4;
})(PS["Data.Function.Uncurried"] = PS["Data.Function.Uncurried"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Ace"];
  var Ace_Types = PS["Ace.Types"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];        
  var editNode = function (el) {
      return function (self) {
          return $foreign.editNodeImpl(el, self);
      };
  };
  exports["editNode"] = editNode;
  exports["ace"] = $foreign.ace;
})(PS["Ace"] = PS["Ace"] || {});
(function(exports) {
    "use strict";

  exports.onImpl = function (event, fn, self) {
    return function () {
      return self.on(event, function (e) {
        fn(e)();
      });
    };
  };

  exports.setModeImpl = function (mode, self) {
    return function () {
      return self.setMode(mode);
    };
  };

  function  create(text, mode) {
    return function () {
      var EditSession = ace.require("ace/edit_session").EditSession;
      return new EditSession(text, mode);
    };
  }
})(PS["Ace.EditSession"] = PS["Ace.EditSession"] || {});
(function(exports) {
    "use strict";

  exports["null"] = null;

  exports.nullable = function (a, r, f) {
    return a == null ? r : f(a);
  };

  exports.notNull = function (x) {
    return x;
  };
})(PS["Data.Nullable"] = PS["Data.Nullable"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Nullable"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];        
  var toNullable = Data_Maybe.maybe($foreign["null"])($foreign.notNull);
  var toMaybe = function (n) {
      return $foreign.nullable(n, Data_Maybe.Nothing.value, Data_Maybe.Just.create);
  };
  exports["toMaybe"] = toMaybe;
  exports["toNullable"] = toNullable;
})(PS["Data.Nullable"] = PS["Data.Nullable"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Ace.EditSession"];
  var Ace_Types = PS["Ace.Types"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var Data_Array_ST = PS["Data.Array.ST"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Nullable = PS["Data.Nullable"];
  var Prelude = PS["Prelude"];
  var setMode = function (mode$prime) {
      return function (self) {
          return $foreign.setModeImpl(mode$prime, self);
      };
  };
  var onChange = function (self) {
      return function (fn) {
          return $foreign.onImpl("change", function (v) {
              return fn;
          }, self);
      };
  };
  exports["onChange"] = onChange;
  exports["setMode"] = setMode;
})(PS["Ace.EditSession"] = PS["Ace.EditSession"] || {});
(function(exports) {
    "use strict";

  function effize(method) {
    return function () {
      var me = arguments[arguments.length - 1];
      var args = Array.prototype.slice.call(arguments, 0, -1);
      return function () {
        return me[method].apply(me, args);
      };
    };
  }

  function effGet(field) {
    return function (self) {
      return function () {
        return self[field];
      };
    };
  }

  function effSet(field) {
    return function (val, self) {
      return function () {
        self[field] = val;
      };
    };
  }                                             
  exports.getSession = effize("getSession");
  exports.setValueImpl = effize("setValue");
  exports.getValue = effize("getValue");
  exports.setThemeImpl = effize("setTheme");
})(PS["Ace.Editor"] = PS["Ace.Editor"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Ace.Editor"];
  var Ace_Types = PS["Ace.Types"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Nullable = PS["Data.Nullable"];
  var Prelude = PS["Prelude"];
  var setValue = function (val) {
      return function (cursorPos) {
          return function (self) {
              return $foreign.setValueImpl(val, Data_Nullable.toNullable(cursorPos), self);
          };
      };
  };
  var setTheme = function (theme) {
      return function (self) {
          return $foreign.setThemeImpl(theme, self);
      };
  };
  exports["setTheme"] = setTheme;
  exports["setValue"] = setValue;
  exports["getSession"] = $foreign.getSession;
  exports["getValue"] = $foreign.getValue;
})(PS["Ace.Editor"] = PS["Ace.Editor"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var runExists = Unsafe_Coerce.unsafeCoerce;
  var mkExists = Unsafe_Coerce.unsafeCoerce;
  exports["mkExists"] = mkExists;
  exports["runExists"] = runExists;
})(PS["Data.Exists"] = PS["Data.Exists"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Const = PS["Data.Const"];
  var Data_Exists = PS["Data.Exists"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var ApF = (function () {
      function ApF(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ApF.create = function (value0) {
          return function (value1) {
              return new ApF(value0, value1);
          };
      };
      return ApF;
  })();
  var Pure = (function () {
      function Pure(value0) {
          this.value0 = value0;
      };
      Pure.create = function (value0) {
          return new Pure(value0);
      };
      return Pure;
  })();
  var Ap = (function () {
      function Ap(value0) {
          this.value0 = value0;
      };
      Ap.create = function (value0) {
          return new Ap(value0);
      };
      return Ap;
  })();
  var retractFreeAp = function (dictApplicative) {
      return function (v) {
          if (v instanceof Pure) {
              return Control_Applicative.pure(dictApplicative)(v.value0);
          };
          if (v instanceof Ap) {
              return Data_Exists.runExists(function (v1) {
                  return Control_Apply.apply(dictApplicative.Apply0())(retractFreeAp(dictApplicative)(v1.value1(Data_Unit.unit)))(v1.value0(Data_Unit.unit));
              })(v.value0);
          };
          throw new Error("Failed pattern match at Control.Applicative.Free line 33, column 1 - line 33, column 32: " + [ v.constructor.name ]);
      };
  };
  var ap = function (v) {
      return function (k) {
          return new Ap(Data_Exists.mkExists(new ApF(v, k)));
      };
  };              
  var hoistFreeAp = function (k) {
      return function (v) {
          if (v instanceof Pure) {
              return new Pure(v.value0);
          };
          if (v instanceof Ap) {
              return Data_Exists.runExists(function (v1) {
                  return ap(function (v3) {
                      return k(v1.value0(Data_Unit.unit));
                  })(function (v3) {
                      return hoistFreeAp(k)(v1.value1(Data_Unit.unit));
                  });
              })(v.value0);
          };
          throw new Error("Failed pattern match at Control.Applicative.Free line 45, column 1 - line 45, column 32: " + [ k.constructor.name, v.constructor.name ]);
      };
  };
  exports["hoistFreeAp"] = hoistFreeAp;
  exports["retractFreeAp"] = retractFreeAp;
})(PS["Control.Applicative.Free"] = PS["Control.Applicative.Free"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Reader_Class = PS["Control.Monad.Reader.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Monad_Writer_Class = PS["Control.Monad.Writer.Class"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Either = PS["Data.Either"];
  var Data_Exists = PS["Data.Exists"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var Bound = (function () {
      function Bound(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Bound.create = function (value0) {
          return function (value1) {
              return new Bound(value0, value1);
          };
      };
      return Bound;
  })();
  var FreeT = (function () {
      function FreeT(value0) {
          this.value0 = value0;
      };
      FreeT.create = function (value0) {
          return new FreeT(value0);
      };
      return FreeT;
  })();
  var Bind = (function () {
      function Bind(value0) {
          this.value0 = value0;
      };
      Bind.create = function (value0) {
          return new Bind(value0);
      };
      return Bind;
  })();
  var monadTransFreeT = function (dictFunctor) {
      return new Control_Monad_Trans_Class.MonadTrans(function (dictMonad) {
          return function (ma) {
              return new FreeT(function (v) {
                  return Data_Functor.map(((dictMonad.Bind1()).Apply0()).Functor0())(Data_Either.Left.create)(ma);
              });
          };
      });
  };
  var freeT = FreeT.create;
  var bound = function (m) {
      return function (f) {
          return new Bind(Data_Exists.mkExists(new Bound(m, f)));
      };
  };
  var functorFreeT = function (dictFunctor) {
      return function (dictFunctor1) {
          return new Data_Functor.Functor(function (f) {
              return function (v) {
                  if (v instanceof FreeT) {
                      return new FreeT(function (v1) {
                          return Data_Functor.map(dictFunctor1)(Data_Bifunctor.bimap(Data_Either.bifunctorEither)(f)(Data_Functor.map(dictFunctor)(Data_Functor.map(functorFreeT(dictFunctor)(dictFunctor1))(f))))(v.value0(Data_Unit.unit));
                      });
                  };
                  if (v instanceof Bind) {
                      return Data_Exists.runExists(function (v1) {
                          return bound(v1.value0)(function ($104) {
                              return Data_Functor.map(functorFreeT(dictFunctor)(dictFunctor1))(f)(v1.value1($104));
                          });
                      })(v.value0);
                  };
                  throw new Error("Failed pattern match at Control.Monad.Free.Trans line 59, column 3 - line 59, column 69: " + [ f.constructor.name, v.constructor.name ]);
              };
          });
      };
  };
  var bimapFreeT = function (dictFunctor) {
      return function (dictFunctor1) {
          return function (nf) {
              return function (nm) {
                  return function (v) {
                      if (v instanceof Bind) {
                          return Data_Exists.runExists(function (v1) {
                              return bound(function ($105) {
                                  return bimapFreeT(dictFunctor)(dictFunctor1)(nf)(nm)(v1.value0($105));
                              })(function ($106) {
                                  return bimapFreeT(dictFunctor)(dictFunctor1)(nf)(nm)(v1.value1($106));
                              });
                          })(v.value0);
                      };
                      if (v instanceof FreeT) {
                          return new FreeT(function (v1) {
                              return Data_Functor.map(dictFunctor1)(Data_Functor.map(Data_Either.functorEither)(function ($107) {
                                  return nf(Data_Functor.map(dictFunctor)(bimapFreeT(dictFunctor)(dictFunctor1)(nf)(nm))($107));
                              }))(nm(v.value0(Data_Unit.unit)));
                          });
                      };
                      throw new Error("Failed pattern match at Control.Monad.Free.Trans line 120, column 1 - line 120, column 114: " + [ nf.constructor.name, nm.constructor.name, v.constructor.name ]);
                  };
              };
          };
      };
  };
  var hoistFreeT = function (dictFunctor) {
      return function (dictFunctor1) {
          return bimapFreeT(dictFunctor)(dictFunctor1)(Control_Category.id(Control_Category.categoryFn));
      };
  };
  var monadFreeT = function (dictFunctor) {
      return function (dictMonad) {
          return new Control_Monad.Monad(function () {
              return applicativeFreeT(dictFunctor)(dictMonad);
          }, function () {
              return bindFreeT(dictFunctor)(dictMonad);
          });
      };
  };
  var bindFreeT = function (dictFunctor) {
      return function (dictMonad) {
          return new Control_Bind.Bind(function () {
              return applyFreeT(dictFunctor)(dictMonad);
          }, function (v) {
              return function (f) {
                  if (v instanceof Bind) {
                      return Data_Exists.runExists(function (v1) {
                          return bound(v1.value0)(function (x) {
                              return bound(function (v2) {
                                  return v1.value1(x);
                              })(f);
                          });
                      })(v.value0);
                  };
                  return bound(function (v1) {
                      return v;
                  })(f);
              };
          });
      };
  };
  var applyFreeT = function (dictFunctor) {
      return function (dictMonad) {
          return new Control_Apply.Apply(function () {
              return functorFreeT(dictFunctor)(((dictMonad.Bind1()).Apply0()).Functor0());
          }, Control_Monad.ap(monadFreeT(dictFunctor)(dictMonad)));
      };
  };
  var applicativeFreeT = function (dictFunctor) {
      return function (dictMonad) {
          return new Control_Applicative.Applicative(function () {
              return applyFreeT(dictFunctor)(dictMonad);
          }, function (a) {
              return new FreeT(function (v) {
                  return Control_Applicative.pure(dictMonad.Applicative0())(new Data_Either.Left(a));
              });
          });
      };
  };
  var liftFreeT = function (dictFunctor) {
      return function (dictMonad) {
          return function (fa) {
              return new FreeT(function (v) {
                  return Control_Applicative.pure(dictMonad.Applicative0())(new Data_Either.Right(Data_Functor.map(dictFunctor)(Control_Applicative.pure(applicativeFreeT(dictFunctor)(dictMonad)))(fa)));
              });
          };
      };
  };
  var resume = function (dictFunctor) {
      return function (dictMonadRec) {
          var go = function (v) {
              if (v instanceof FreeT) {
                  return Data_Functor.map((((dictMonadRec.Monad0()).Bind1()).Apply0()).Functor0())(Control_Monad_Rec_Class.Done.create)(v.value0(Data_Unit.unit));
              };
              if (v instanceof Bind) {
                  return Data_Exists.runExists(function (v1) {
                      var v2 = v1.value0(Data_Unit.unit);
                      if (v2 instanceof FreeT) {
                          return Control_Bind.bind((dictMonadRec.Monad0()).Bind1())(v2.value0(Data_Unit.unit))(function (v3) {
                              if (v3 instanceof Data_Either.Left) {
                                  return Control_Applicative.pure((dictMonadRec.Monad0()).Applicative0())(new Control_Monad_Rec_Class.Loop(v1.value1(v3.value0)));
                              };
                              if (v3 instanceof Data_Either.Right) {
                                  return Control_Applicative.pure((dictMonadRec.Monad0()).Applicative0())(new Control_Monad_Rec_Class.Done(new Data_Either.Right(Data_Functor.map(dictFunctor)(function (h) {
                                      return Control_Bind.bind(bindFreeT(dictFunctor)(dictMonadRec.Monad0()))(h)(v1.value1);
                                  })(v3.value0))));
                              };
                              throw new Error("Failed pattern match at Control.Monad.Free.Trans line 53, column 20 - line 55, column 67: " + [ v3.constructor.name ]);
                          });
                      };
                      if (v2 instanceof Bind) {
                          return Data_Exists.runExists(function (v3) {
                              return Control_Applicative.pure((dictMonadRec.Monad0()).Applicative0())(new Control_Monad_Rec_Class.Loop(Control_Bind.bind(bindFreeT(dictFunctor)(dictMonadRec.Monad0()))(v3.value0(Data_Unit.unit))(function (z) {
                                  return Control_Bind.bind(bindFreeT(dictFunctor)(dictMonadRec.Monad0()))(v3.value1(z))(v1.value1);
                              })));
                          })(v2.value0);
                      };
                      throw new Error("Failed pattern match at Control.Monad.Free.Trans line 51, column 5 - line 56, column 98: " + [ v2.constructor.name ]);
                  })(v.value0);
              };
              throw new Error("Failed pattern match at Control.Monad.Free.Trans line 49, column 3 - line 49, column 35: " + [ v.constructor.name ]);
          };
          return Control_Monad_Rec_Class.tailRecM(dictMonadRec)(go);
      };
  };
  var runFreeT = function (dictFunctor) {
      return function (dictMonadRec) {
          return function (interp) {
              var go = function (v) {
                  if (v instanceof Data_Either.Left) {
                      return Control_Applicative.pure((dictMonadRec.Monad0()).Applicative0())(new Control_Monad_Rec_Class.Done(v.value0));
                  };
                  if (v instanceof Data_Either.Right) {
                      return Data_Functor.map((((dictMonadRec.Monad0()).Bind1()).Apply0()).Functor0())(Control_Monad_Rec_Class.Loop.create)(interp(v.value0));
                  };
                  throw new Error("Failed pattern match at Control.Monad.Free.Trans line 128, column 3 - line 128, column 30: " + [ v.constructor.name ]);
              };
              return Control_Monad_Rec_Class.tailRecM(dictMonadRec)(Control_Bind.composeKleisliFlipped((dictMonadRec.Monad0()).Bind1())(go)(resume(dictFunctor)(dictMonadRec)));
          };
      };
  };
  var monadRecFreeT = function (dictFunctor) {
      return function (dictMonad) {
          return new Control_Monad_Rec_Class.MonadRec(function () {
              return monadFreeT(dictFunctor)(dictMonad);
          }, function (f) {
              var go = function (s) {
                  return Control_Bind.bind(bindFreeT(dictFunctor)(dictMonad))(f(s))(function (v) {
                      if (v instanceof Control_Monad_Rec_Class.Loop) {
                          return go(v.value0);
                      };
                      if (v instanceof Control_Monad_Rec_Class.Done) {
                          return Control_Applicative.pure(applicativeFreeT(dictFunctor)(dictMonad))(v.value0);
                      };
                      throw new Error("Failed pattern match at Control.Monad.Free.Trans line 81, column 15 - line 83, column 25: " + [ v.constructor.name ]);
                  });
              };
              return go;
          });
      };
  };
  exports["bimapFreeT"] = bimapFreeT;
  exports["freeT"] = freeT;
  exports["hoistFreeT"] = hoistFreeT;
  exports["liftFreeT"] = liftFreeT;
  exports["resume"] = resume;
  exports["runFreeT"] = runFreeT;
  exports["functorFreeT"] = functorFreeT;
  exports["applyFreeT"] = applyFreeT;
  exports["applicativeFreeT"] = applicativeFreeT;
  exports["bindFreeT"] = bindFreeT;
  exports["monadFreeT"] = monadFreeT;
  exports["monadTransFreeT"] = monadTransFreeT;
  exports["monadRecFreeT"] = monadRecFreeT;
})(PS["Control.Monad.Free.Trans"] = PS["Control.Monad.Free.Trans"] || {});
(function(exports) {
    "use strict";

  exports.newRef = function (val) {
    return function () {
      return { value: val };
    };
  };

  exports.readRef = function (ref) {
    return function () {
      return ref.value;
    };
  };

  exports["modifyRef'"] = function (ref) {
    return function (f) {
      return function () {
        var t = f(ref.value);
        ref.value = t.state;
        return t.value;
      };
    };
  };

  exports.writeRef = function (ref) {
    return function (val) {
      return function () {
        ref.value = val;
        return {};
      };
    };
  };
})(PS["Control.Monad.Eff.Ref"] = PS["Control.Monad.Eff.Ref"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Ref"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var modifyRef = function (ref) {
      return function (f) {
          return $foreign["modifyRef'"](ref)(function (s) {
              return {
                  state: f(s), 
                  value: Data_Unit.unit
              };
          });
      };
  };
  exports["modifyRef"] = modifyRef;
  exports["modifyRef'"] = $foreign["modifyRef'"];
  exports["newRef"] = $foreign.newRef;
  exports["readRef"] = $foreign.readRef;
  exports["writeRef"] = $foreign.writeRef;
})(PS["Control.Monad.Eff.Ref"] = PS["Control.Monad.Eff.Ref"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Cont_Trans = PS["Control.Monad.Cont.Trans"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Ref = PS["Control.Monad.Eff.Ref"];
  var Control_Monad_Eff_Unsafe = PS["Control.Monad.Eff.Unsafe"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Monad_Maybe_Trans = PS["Control.Monad.Maybe.Trans"];
  var Control_Monad_Reader_Trans = PS["Control.Monad.Reader.Trans"];
  var Control_Monad_Writer_Trans = PS["Control.Monad.Writer.Trans"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Compose = PS["Data.Functor.Compose"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Parallel = function (Applicative1, Monad0, parallel, sequential) {
      this.Applicative1 = Applicative1;
      this.Monad0 = Monad0;
      this.parallel = parallel;
      this.sequential = sequential;
  };                                                           
  var sequential = function (dict) {
      return dict.sequential;
  };
  var parallel = function (dict) {
      return dict.parallel;
  };
  exports["Parallel"] = Parallel;
  exports["parallel"] = parallel;
  exports["sequential"] = sequential;
})(PS["Control.Parallel.Class"] = PS["Control.Parallel.Class"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Control_Parallel_Class = PS["Control.Parallel.Class"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Traversable = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];        
  var parTraverse_ = function (dictParallel) {
      return function (dictFoldable) {
          return function (f) {
              return function ($17) {
                  return Control_Parallel_Class.sequential(dictParallel)(Data_Foldable.traverse_(dictParallel.Applicative1())(dictFoldable)(function ($18) {
                      return Control_Parallel_Class.parallel(dictParallel)(f($18));
                  })($17));
              };
          };
      };
  };
  var parSequence_ = function (dictParallel) {
      return function (dictFoldable) {
          return parTraverse_(dictParallel)(dictFoldable)(Control_Category.id(Control_Category.categoryFn));
      };
  };
  exports["parSequence_"] = parSequence_;
  exports["parTraverse_"] = parTraverse_;
})(PS["Control.Parallel"] = PS["Control.Parallel"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Category = PS["Control.Category"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Prelude = PS["Prelude"];        
  var Profunctor = function (dimap) {
      this.dimap = dimap;
  };
  var profunctorFn = new Profunctor(function (a2b) {
      return function (c2d) {
          return function (b2c) {
              return function ($9) {
                  return c2d(b2c(a2b($9)));
              };
          };
      };
  });
  var dimap = function (dict) {
      return dict.dimap;
  };
  var rmap = function (dictProfunctor) {
      return function (b2c) {
          return dimap(dictProfunctor)(Control_Category.id(Control_Category.categoryFn))(b2c);
      };
  };
  exports["Profunctor"] = Profunctor;
  exports["dimap"] = dimap;
  exports["rmap"] = rmap;
  exports["profunctorFn"] = profunctorFn;
})(PS["Data.Profunctor"] = PS["Data.Profunctor"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Monad_Free_Trans = PS["Control.Monad.Free.Trans"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Parallel = PS["Control.Parallel"];
  var Control_Parallel_Class = PS["Control.Parallel.Class"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Either = PS["Data.Either"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Profunctor = PS["Data.Profunctor"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Emit = (function () {
      function Emit(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Emit.create = function (value0) {
          return function (value1) {
              return new Emit(value0, value1);
          };
      };
      return Emit;
  })();
  var runProcess = function (dictMonadRec) {
      return Control_Monad_Free_Trans.runFreeT(Data_Identity.functorIdentity)(dictMonadRec)(function ($186) {
          return Control_Applicative.pure((dictMonadRec.Monad0()).Applicative0())(Data_Newtype.unwrap(Data_Identity.newtypeIdentity)($186));
      });
  };
  var profunctorAwait = new Data_Profunctor.Profunctor(function (f) {
      return function (g) {
          return function (v) {
              return Data_Profunctor.dimap(Data_Profunctor.profunctorFn)(f)(g)(v);
          };
      };
  });
  var loop = function (dictFunctor) {
      return function (dictMonad) {
          return function (me) {
              return Control_Monad_Rec_Class.tailRecM(Control_Monad_Free_Trans.monadRecFreeT(dictFunctor)(dictMonad))(function (v) {
                  return Data_Functor.map(Control_Monad_Free_Trans.functorFreeT(dictFunctor)(((dictMonad.Bind1()).Apply0()).Functor0()))(Data_Maybe.maybe(new Control_Monad_Rec_Class.Loop(Data_Unit.unit))(Control_Monad_Rec_Class.Done.create))(me);
              })(Data_Unit.unit);
          };
      };
  };
  var fuseWithL = function (dictFunctor) {
      return function (dictFunctor1) {
          return function (dictFunctor2) {
              return function (dictMonadRec) {
                  return function (zap) {
                      return function (fs) {
                          return function (gs) {
                              var go = function (v) {
                                  return Control_Monad_Except_Trans.runExceptT(Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(dictMonadRec.Monad0()))(Control_Monad_Except_Trans.ExceptT(Control_Monad_Free_Trans.resume(dictFunctor)(dictMonadRec)(v.value0)))(function (v1) {
                                      return Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(dictMonadRec.Monad0()))(Control_Monad_Except_Trans.ExceptT(Control_Monad_Free_Trans.resume(dictFunctor1)(dictMonadRec)(v.value1)))(function (v2) {
                                          return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(dictMonadRec.Monad0()))(Data_Functor.map(dictFunctor2)(function (t) {
                                              return Control_Monad_Free_Trans.freeT(function (v3) {
                                                  return go(t);
                                              });
                                          })(zap(Data_Tuple.Tuple.create)(v1)(v2)));
                                      });
                                  }));
                              };
                              return Control_Monad_Free_Trans.freeT(function (v) {
                                  return go(new Data_Tuple.Tuple(fs, gs));
                              });
                          };
                      };
                  };
              };
          };
      };
  };
  var fuseWith = function (dictFunctor) {
      return function (dictFunctor1) {
          return function (dictFunctor2) {
              return function (dictMonadRec) {
                  return function (dictParallel) {
                      return function (zap) {
                          return function (fs) {
                              return function (gs) {
                                  var go = function (v) {
                                      return Control_Bind.bind((dictMonadRec.Monad0()).Bind1())(Control_Parallel_Class.sequential(dictParallel)(Control_Apply.apply((dictParallel.Applicative1()).Apply0())(Data_Functor.map(((dictParallel.Applicative1()).Apply0()).Functor0())(Control_Apply.lift2(Data_Either.applyEither)(zap(Data_Tuple.Tuple.create)))(Control_Parallel_Class.parallel(dictParallel)(Control_Monad_Free_Trans.resume(dictFunctor)(dictMonadRec)(v.value0))))(Control_Parallel_Class.parallel(dictParallel)(Control_Monad_Free_Trans.resume(dictFunctor1)(dictMonadRec)(v.value1)))))(function (v1) {
                                          if (v1 instanceof Data_Either.Left) {
                                              return Control_Applicative.pure((dictMonadRec.Monad0()).Applicative0())(new Data_Either.Left(v1.value0));
                                          };
                                          if (v1 instanceof Data_Either.Right) {
                                              return Control_Applicative.pure((dictMonadRec.Monad0()).Applicative0())(new Data_Either.Right(Data_Functor.map(dictFunctor2)(function (t) {
                                                  return Control_Monad_Free_Trans.freeT(function (v2) {
                                                      return go(t);
                                                  });
                                              })(v1.value0)));
                                          };
                                          throw new Error("Failed pattern match at Control.Coroutine line 80, column 5 - line 82, column 63: " + [ v1.constructor.name ]);
                                      });
                                  };
                                  return Control_Monad_Free_Trans.freeT(function (v) {
                                      return go(new Data_Tuple.Tuple(fs, gs));
                                  });
                              };
                          };
                      };
                  };
              };
          };
      };
  };
  var functorAwait = new Data_Functor.Functor(Data_Profunctor.rmap(profunctorAwait));
  var bifunctorEmit = new Data_Bifunctor.Bifunctor(function (f) {
      return function (g) {
          return function (v) {
              return new Emit(f(v.value0), g(v.value1));
          };
      };
  });
  var functorEmit = new Data_Functor.Functor(Data_Bifunctor.rmap(bifunctorEmit));
  var connect = function (dictMonadRec) {
      return function (dictParallel) {
          return fuseWith(functorEmit)(functorAwait)(Data_Identity.functorIdentity)(dictMonadRec)(dictParallel)(function (f) {
              return function (v) {
                  return function (v1) {
                      return f(v.value1)(v1(v.value0));
                  };
              };
          });
      };
  };
  var emit = function (dictMonad) {
      return function (o) {
          return Control_Monad_Free_Trans.liftFreeT(functorEmit)(dictMonad)(new Emit(o, Data_Unit.unit));
      };
  };
  var producer = function (dictMonad) {
      return function (recv) {
          return loop(functorEmit)(dictMonad)(Control_Bind.bind(Control_Monad_Free_Trans.bindFreeT(functorEmit)(dictMonad))(Control_Monad_Trans_Class.lift(Control_Monad_Free_Trans.monadTransFreeT(functorEmit))(dictMonad)(recv))(function (v) {
              if (v instanceof Data_Either.Left) {
                  return Data_Functor.voidLeft(Control_Monad_Free_Trans.functorFreeT(functorEmit)(((dictMonad.Bind1()).Apply0()).Functor0()))(emit(dictMonad)(v.value0))(Data_Maybe.Nothing.value);
              };
              if (v instanceof Data_Either.Right) {
                  return Control_Applicative.pure(Control_Monad_Free_Trans.applicativeFreeT(functorEmit)(dictMonad))(new Data_Maybe.Just(v.value0));
              };
              throw new Error("Failed pattern match at Control.Coroutine line 126, column 3 - line 128, column 29: " + [ v.constructor.name ]);
          }));
      };
  };
  var pullFrom = function (dictMonadRec) {
      return fuseWithL(functorAwait)(functorEmit)(Data_Identity.functorIdentity)(dictMonadRec)(function (f) {
          return function (v) {
              return function (v1) {
                  return Control_Applicative.pure(Data_Identity.applicativeIdentity)(f(v(v1.value0))(v1.value1));
              };
          };
      });
  };
  var $$await = function (dictMonad) {
      return Control_Monad_Free_Trans.liftFreeT(functorAwait)(dictMonad)(Control_Category.id(Control_Category.categoryFn));
  };
  exports["Emit"] = Emit;
  exports["await"] = $$await;
  exports["connect"] = connect;
  exports["emit"] = emit;
  exports["fuseWith"] = fuseWith;
  exports["fuseWithL"] = fuseWithL;
  exports["loop"] = loop;
  exports["producer"] = producer;
  exports["pullFrom"] = pullFrom;
  exports["runProcess"] = runProcess;
  exports["bifunctorEmit"] = bifunctorEmit;
  exports["functorEmit"] = functorEmit;
  exports["profunctorAwait"] = profunctorAwait;
  exports["functorAwait"] = functorAwait;
})(PS["Control.Coroutine"] = PS["Control.Coroutine"] || {});
(function(exports) {
  /* globals setImmediate, clearImmediate, setTimeout, clearTimeout */
  /* jshint -W083, -W098, -W003 */
  "use strict";

  var Aff = function () {
    // A unique value for empty.
    var EMPTY = {};

    /*

  An awkward approximation. We elide evidence we would otherwise need in PS for
  efficiency sake.

  data Aff eff a
    = Pure a
    | Throw Error
    | Catch (Aff eff a) (Error -> Aff eff a)
    | Sync (Eff eff a)
    | Async ((Either Error a -> Eff eff Unit) -> Eff eff (Canceler eff))
    | forall b. Bind (Aff eff b) (b -> Aff eff a)
    | forall b. Bracket (Aff eff b) (BracketConditions eff b) (b -> Aff eff a)
    | forall b. Fork Boolean (Aff eff b) ?(Thread eff b -> a)
    | Sequential (ParAff aff a)

  */  
    var PURE    = "Pure";
    var THROW   = "Throw";
    var CATCH   = "Catch";
    var SYNC    = "Sync";
    var ASYNC   = "Async";
    var BIND    = "Bind";
    var BRACKET = "Bracket";
    var FORK    = "Fork";
    var SEQ     = "Sequential";

    /*

  data ParAff eff a
    = forall b. Map (b -> a) (ParAff eff b)
    | forall b. Apply (ParAff eff (b -> a)) (ParAff eff b)
    | Alt (ParAff eff a) (ParAff eff a)
    | ?Par (Aff eff a)

  */  
    var MAP   = "Map";
    var APPLY = "Apply";
    var ALT   = "Alt";

    // Various constructors used in interpretation
    var CONS      = "Cons";      // Cons-list, for stacks
    var RESUME    = "Resume";    // Continue indiscriminately
    var RELEASE   = "Release";   // Continue with bracket finalizers
    var FINALIZER = "Finalizer"; // A non-interruptible effect
    var FINALIZED = "Finalized"; // Marker for finalization
    var FORKED    = "Forked";    // Reference to a forked fiber, with resumption stack
    var FIBER     = "Fiber";     // Actual fiber reference
    var THUNK     = "Thunk";     // Primed effect, ready to invoke

    function Aff(tag, _1, _2, _3) {
      this.tag = tag;
      this._1  = _1;
      this._2  = _2;
      this._3  = _3;
    }

    function AffCtr(tag) {
      var fn = function (_1, _2, _3) {
        return new Aff(tag, _1, _2, _3);
      };
      fn.tag = tag;
      return fn;
    }

    function nonCanceler(error) {
      return new Aff(PURE, void 0);
    }

    function runEff(eff) {
      try {
        eff();
      } catch (error) {
        setTimeout(function () {
          throw error;
        }, 0);
      }
    }

    function runSync(left, right, eff) {
      try {
        return right(eff());
      } catch (error) {
        return left(error);
      }
    }

    function runAsync(left, eff, k) {
      try {
        return eff(k)();
      } catch (error) {
        k(left(error))();
        return nonCanceler;
      }
    }

    var Scheduler = function () {
      var limit    = 1024;
      var size     = 0;
      var ix       = 0;
      var queue    = new Array(limit);
      var draining = false;

      function drain() {
        var thunk;
        draining = true;
        while (size !== 0) {
          size--;
          thunk     = queue[ix];
          queue[ix] = void 0;
          ix        = (ix + 1) % limit;
          thunk();
        }
        draining = false;
      }

      return {
        isDraining: function () {
          return draining;
        },
        enqueue: function (cb) {
          var i, tmp;
          if (size === limit) {
            tmp = draining;
            drain();
            draining = tmp;
          }

          queue[(ix + size) % limit] = cb;
          size++;

          if (!draining) {
            drain();
          }
        }
      };
    }();

    function Supervisor(util) {
      var fibers  = {};
      var fiberId = 0;
      var count   = 0;

      return {
        register: function (fiber) {
          var fid = fiberId++;
          fiber.onComplete({
            rethrow: true,
            handler: function (result) {
              return function () {
                count--;
                delete fibers[fid];
              };
            }
          });
          fibers[fid] = fiber;
          count++;
        },
        isEmpty: function () {
          return count === 0;
        },
        killAll: function (killError, cb) {
          return function () {
            var killCount = 0;
            var kills     = {};

            function kill(fid) {
              kills[fid] = fibers[fid].kill(killError, function (result) {
                return function () {
                  delete kills[fid];
                  killCount--;
                  if (util.isLeft(result) && util.fromLeft(result)) {
                    setTimeout(function () {
                      throw util.fromLeft(result);
                    }, 0);
                  }
                  if (killCount === 0) {
                    cb();
                  }
                };
              })();
            }

            for (var k in fibers) {
              if (fibers.hasOwnProperty(k)) {
                killCount++;
                kill(k);
              }
            }

            fibers  = {};
            fiberId = 0;
            count   = 0;

            return function (error) {
              return new Aff(SYNC, function () {
                for (var k in kills) {
                  if (kills.hasOwnProperty(k)) {
                    kills[k]();
                  }
                }
              });
            };
          };
        }
      };
    }

    // Fiber state machine
    var SUSPENDED   = 0; // Suspended, pending a join.
    var CONTINUE    = 1; // Interpret the next instruction.
    var STEP_BIND   = 2; // Apply the next bind.
    var STEP_RESULT = 3; // Handle potential failure from a result.
    var PENDING     = 4; // An async effect is running.
    var RETURN      = 5; // The current stack has returned.
    var COMPLETED   = 6; // The entire fiber has completed.

    function Fiber(util, supervisor, aff) {
      // Monotonically increasing tick, increased on each asynchronous turn.
      var runTick = 0;

      // The current branch of the state machine.
      var status = SUSPENDED;

      // The current point of interest for the state machine branch.
      var step      = aff;  // Successful step
      var fail      = null; // Failure step
      var interrupt = null; // Asynchronous interrupt

      // Stack of continuations for the current fiber.
      var bhead = null;
      var btail = null;

      // Stack of attempts and finalizers for error recovery. Every `Cons` is also
      // tagged with current `interrupt` state. We use this to track which items
      // should be ignored or evaluated as a result of a kill.
      var attempts = null;

      // A special state is needed for Bracket, because it cannot be killed. When
      // we enter a bracket acquisition or finalizer, we increment the counter,
      // and then decrement once complete.
      var bracketCount = 0;

      // Each join gets a new id so they can be revoked.
      var joinId  = 0;
      var joins   = null;
      var rethrow = true;

      // Each invocation of `run` requires a tick. When an asynchronous effect is
      // resolved, we must check that the local tick coincides with the fiber
      // tick before resuming. This prevents multiple async continuations from
      // accidentally resuming the same fiber. A common example may be invoking
      // the provided callback in `makeAff` more than once, but it may also be an
      // async effect resuming after the fiber was already cancelled.
      function run(localRunTick) {
        var tmp, result, attempt, canceler;
        while (true) {
          tmp       = null;
          result    = null;
          attempt   = null;
          canceler  = null;

          switch (status) {
          case STEP_BIND:
            status = CONTINUE;
            step   = bhead(step);
            if (btail === null) {
              bhead = null;
            } else {
              bhead = btail._1;
              btail = btail._2;
            }
            break;

          case STEP_RESULT:
            if (util.isLeft(step)) {
              status = RETURN;
              fail   = step;
              step   = null;
            } else if (bhead === null) {
              status = RETURN;
            } else {
              status = STEP_BIND;
              step   = util.fromRight(step);
            }
            break;

          case CONTINUE:
            switch (step.tag) {
            case BIND:
              if (bhead) {
                btail = new Aff(CONS, bhead, btail);
              }
              bhead  = step._2;
              status = CONTINUE;
              step   = step._1;
              break;

            case PURE:
              if (bhead === null) {
                status = RETURN;
                step   = util.right(step._1);
              } else {
                status = STEP_BIND;
                step   = step._1;
              }
              break;

            case SYNC:
              status = STEP_RESULT;
              step   = runSync(util.left, util.right, step._1);
              break;

            case ASYNC:
              status = PENDING;
              step   = runAsync(util.left, step._1, function (result) {
                return function () {
                  if (runTick !== localRunTick) {
                    return;
                  }
                  runTick++;
                  Scheduler.enqueue(function () {
                    status = STEP_RESULT;
                    step   = result;
                    run(runTick);
                  });
                };
              });
              return;

            case THROW:
              status = RETURN;
              fail   = util.left(step._1);
              step   = null;
              break;

            // Enqueue the Catch so that we can call the error handler later on
            // in case of an exception.
            case CATCH:
              if (bhead === null) {
                attempts = new Aff(CONS, step, attempts, interrupt);
              } else {
                attempts = new Aff(CONS, step, new Aff(CONS, new Aff(RESUME, bhead, btail), attempts, interrupt), interrupt);
              }
              bhead    = null;
              btail    = null;
              status   = CONTINUE;
              step     = step._1;
              break;

            // Enqueue the Bracket so that we can call the appropriate handlers
            // after resource acquisition.
            case BRACKET:
              bracketCount++;
              if (bhead === null) {
                attempts = new Aff(CONS, step, attempts, interrupt);
              } else {
                attempts = new Aff(CONS, step, new Aff(CONS, new Aff(RESUME, bhead, btail), attempts, interrupt), interrupt);
              }
              bhead  = null;
              btail  = null;
              status = CONTINUE;
              step   = step._1;
              break;

            case FORK:
              status = STEP_BIND;
              tmp    = Fiber(util, supervisor, step._2);
              if (supervisor) {
                supervisor.register(tmp);
              }
              if (step._1) {
                tmp.run();
              }
              step = tmp;
              break;

            case SEQ:
              status = CONTINUE;
              step   = sequential(util, supervisor, step._1);
              break;
            }
            break;

          case RETURN:
            bhead = null;
            btail = null;
            // If the current stack has returned, and we have no other stacks to
            // resume or finalizers to run, the fiber has halted and we can
            // invoke all join callbacks. Otherwise we need to resume.
            if (attempts === null) {
              status = COMPLETED;
              step   = interrupt || fail || step;
            } else {
              // The interrupt status for the enqueued item.
              tmp      = attempts._3;
              attempt  = attempts._1;
              attempts = attempts._2;

              switch (attempt.tag) {
              // We cannot recover from an interrupt. Otherwise we should
              // continue stepping, or run the exception handler if an exception
              // was raised.
              case CATCH:
                // We should compare the interrupt status as well because we
                // only want it to apply if there has been an interrupt since
                // enqueuing the catch.
                if (interrupt && interrupt !== tmp) {
                  status = RETURN;
                } else if (fail) {
                  status = CONTINUE;
                  step   = attempt._2(util.fromLeft(fail));
                  fail   = null;
                }
                break;

              // We cannot resume from an interrupt or exception.
              case RESUME:
                // As with Catch, we only want to ignore in the case of an
                // interrupt since enqueing the item.
                if (interrupt && interrupt !== tmp || fail) {
                  status = RETURN;
                } else {
                  bhead  = attempt._1;
                  btail  = attempt._2;
                  status = STEP_BIND;
                  step   = util.fromRight(step);
                }
                break;

              // If we have a bracket, we should enqueue the handlers,
              // and continue with the success branch only if the fiber has
              // not been interrupted. If the bracket acquisition failed, we
              // should not run either.
              case BRACKET:
                bracketCount--;
                if (fail === null) {
                  result   = util.fromRight(step);
                  // We need to enqueue the Release with the same interrupt
                  // status as the Bracket that is initiating it.
                  attempts = new Aff(CONS, new Aff(RELEASE, attempt._2, result), attempts, tmp);
                  // We should only coninue as long as the interrupt status has not changed or
                  // we are currently within a non-interruptable finalizer.
                  if (interrupt === tmp || bracketCount > 0) {
                    status = CONTINUE;
                    step   = attempt._3(result);
                  }
                }
                break;

              // Enqueue the appropriate handler. We increase the bracket count
              // because it should not be cancelled.
              case RELEASE:
                bracketCount++;
                attempts = new Aff(CONS, new Aff(FINALIZED, step), attempts, interrupt);
                status   = CONTINUE;
                // It has only been killed if the interrupt status has changed
                // since we enqueued the item.
                if (interrupt && interrupt !== tmp) {
                  step = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                } else if (fail) {
                  step = attempt._1.failed(util.fromLeft(fail))(attempt._2);
                } else {
                  step = attempt._1.completed(util.fromRight(step))(attempt._2);
                }
                break;

              case FINALIZER:
                bracketCount++;
                attempts = new Aff(CONS, new Aff(FINALIZED, step), attempts, interrupt);
                status   = CONTINUE;
                step     = attempt._1;
                break;

              case FINALIZED:
                bracketCount--;
                status = RETURN;
                step   = attempt._1;
                break;
              }
            }
            break;

          case COMPLETED:
            for (var k in joins) {
              if (joins.hasOwnProperty(k)) {
                rethrow = rethrow && joins[k].rethrow;
                runEff(joins[k].handler(step));
              }
            }
            joins = null;
            // If we have an interrupt and a fail, then the thread threw while
            // running finalizers. This should always rethrow in a fresh stack.
            if (interrupt && fail) {
              setTimeout(function () {
                throw util.fromLeft(fail);
              }, 0);
            // If we have an unhandled exception, and no other fiber has joined
            // then we need to throw the exception in a fresh stack.
            } else if (util.isLeft(step) && rethrow) {
              setTimeout(function () {
                // Guard on reathrow because a completely synchronous fiber can
                // still have an observer which was added after-the-fact.
                if (rethrow) {
                  throw util.fromLeft(step);
                }
              }, 0);
            }
            return;
          case SUSPENDED:
            status = CONTINUE;
            break;
          case PENDING: return;
          }
        }
      }

      function onComplete(join) {
        return function () {
          if (status === COMPLETED) {
            rethrow = rethrow && join.rethrow;
            join.handler(step)();
            return function () {};
          }

          var jid    = joinId++;
          joins      = joins || {};
          joins[jid] = join;

          return function() {
            delete joins[jid];
          };
        };
      }

      function kill(error, cb) {
        return function () {
          if (status === COMPLETED) {
            cb(util.right(void 0))();
            return function () {};
          }

          var canceler = onComplete({
            rethrow: false,
            handler: function (/* unused */) {
              return cb(util.right(void 0));
            }
          })();

          switch (status) {
          case SUSPENDED:
            interrupt = util.left(error);
            status    = COMPLETED;
            step      = interrupt;
            run(runTick);
            break;
          case PENDING:
            if (interrupt === null) {
              interrupt = util.left(error);
            }
            if (bracketCount === 0) {
              if (status === PENDING) {
                attempts = new Aff(CONS, new Aff(FINALIZER, step(error)), attempts, interrupt);
              }
              status   = RETURN;
              step     = null;
              fail     = null;
              run(++runTick);
            }
            break;
          default:
            if (interrupt === null) {
              interrupt = util.left(error);
            }
            if (bracketCount === 0) {
              status = RETURN;
              step   = null;
              fail   = null;
            }
          }

          return canceler;
        };
      }

      function join(cb) {
        return function () {
          var canceler = onComplete({
            rethrow: false,
            handler: cb
          })();
          if (status === SUSPENDED) {
            run(runTick);
          }
          return canceler;
        };
      }

      return {
        kill: kill,
        join: join,
        onComplete: onComplete,
        isSuspended: function () {
          return status === SUSPENDED;
        },
        run: function () {
          if (status === SUSPENDED) {
            if (!Scheduler.isDraining()) {
              Scheduler.enqueue(function () {
                run(runTick);
              });
            } else {
              run(runTick);
            }
          }
        }
      };
    }

    function runPar(util, supervisor, par, cb) {
      // Table of all forked fibers.
      var fiberId   = 0;
      var fibers    = {};

      // Table of currently running cancelers, as a product of `Alt` behavior.
      var killId    = 0;
      var kills     = {};

      // Error used for early cancelation on Alt branches.
      var early     = new Error("[ParAff] Early exit");

      // Error used to kill the entire tree.
      var interrupt = null;

      // The root pointer of the tree.
      var root      = EMPTY;

      // Walks a tree, invoking all the cancelers. Returns the table of pending
      // cancellation fibers.
      function kill(error, par, cb) {
        var step  = par;
        var head  = null;
        var tail  = null;
        var count = 0;
        var kills = {};
        var tmp, kid;

        loop: while (true) {
          tmp = null;

          switch (step.tag) {
          case FORKED:
            if (step._3 === EMPTY) {
              tmp = fibers[step._1];
              kills[count++] = tmp.kill(error, function (result) {
                return function () {
                  count--;
                  if (count === 0) {
                    cb(result)();
                  }
                };
              });
            }
            // Terminal case.
            if (head === null) {
              break loop;
            }
            // Go down the right side of the tree.
            step = head._2;
            if (tail === null) {
              head = null;
            } else {
              head = tail._1;
              tail = tail._2;
            }
            break;
          case MAP:
            step = step._2;
            break;
          case APPLY:
          case ALT:
            if (head) {
              tail = new Aff(CONS, head, tail);
            }
            head = step;
            step = step._1;
            break;
          }
        }

        if (count === 0) {
          cb(util.right(void 0))();
        } else {
          // Run the cancelation effects. We alias `count` because it's mutable.
          kid = 0;
          tmp = count;
          for (; kid < tmp; kid++) {
            kills[kid] = kills[kid]();
          }
        }

        return kills;
      }

      // When a fiber resolves, we need to bubble back up the tree with the
      // result, computing the applicative nodes.
      function join(result, head, tail) {
        var fail, step, lhs, rhs, tmp, kid;

        if (util.isLeft(result)) {
          fail = result;
          step = null;
        } else {
          step = result;
          fail = null;
        }

        loop: while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;

          // We should never continue if the entire tree has been interrupted.
          if (interrupt !== null) {
            return;
          }

          // We've made it all the way to the root of the tree, which means
          // the tree has fully evaluated.
          if (head === null) {
            cb(fail || step)();
            return;
          }

          // The tree has already been computed, so we shouldn't try to do it
          // again. This should never happen.
          // TODO: Remove this?
          if (head._3 !== EMPTY) {
            return;
          }

          switch (head.tag) {
          case MAP:
            if (fail === null) {
              head._3 = util.right(head._1(util.fromRight(step)));
              step    = head._3;
            } else {
              head._3 = fail;
            }
            break;
          case APPLY:
            lhs = head._1._3;
            rhs = head._2._3;
            // We can only proceed if both sides have resolved.
            if (lhs === EMPTY || rhs === EMPTY) {
              return;
            }
            // If either side resolve with an error, we should continue with
            // the first error.
            if (util.isLeft(lhs)) {
              if (util.isLeft(rhs)) {
                if (fail === lhs) {
                  fail = rhs;
                }
              } else {
                fail = lhs;
              }
              step    = null;
              head._3 = fail;
            } else if (util.isLeft(rhs)) {
              step    = null;
              fail    = rhs;
              head._3 = fail;
            } else {
              step    = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
              head._3 = step;
            }
            break;
          case ALT:
            lhs = head._1._3;
            rhs = head._2._3;
            // We can only proceed if both have resolved or we have a success
            if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
              return;
            }
            // If both sides resolve with an error, we should continue with the
            // first error
            if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
              fail    = step === lhs ? rhs : lhs;
              step    = null;
              head._3 = fail;
            } else {
              head._3 = step;
              tmp     = true;
              kid     = killId++;
              // Once a side has resolved, we need to cancel the side that is still
              // pending before we can continue.
              kills[kid] = kill(early, step === lhs ? head._2 : head._1, function (/* unused */) {
                return function () {
                  delete kills[kid];
                  if (tmp) {
                    tmp = false;
                  } else if (tail === null) {
                    join(step, null, null);
                  } else {
                    join(step, tail._1, tail._2);
                  }
                };
              });

              if (tmp) {
                tmp = false;
                return;
              }
            }
            break;
          }

          if (tail === null) {
            head = null;
          } else {
            head = tail._1;
            tail = tail._2;
          }
        }
      }

      function resolve(fiber) {
        return function (result) {
          return function () {
            delete fibers[fiber._1];
            fiber._3 = result;
            join(result, fiber._2._1, fiber._2._2);
          };
        };
      }

      // Walks the applicative tree, substituting non-applicative nodes with
      // `FORKED` nodes. In this tree, all applicative nodes use the `_3` slot
      // as a mutable slot for memoization. In an unresolved state, the `_3`
      // slot is `EMPTY`. In the cases of `ALT` and `APPLY`, we always walk
      // the left side first, because both operations are left-associative. As
      // we `RETURN` from those branches, we then walk the right side.
      function run() {
        var status = CONTINUE;
        var step   = par;
        var head   = null;
        var tail   = null;
        var tmp, fid;

        loop: while (true) {
          tmp = null;
          fid = null;

          switch (status) {
          case CONTINUE:
            switch (step.tag) {
            case MAP:
              if (head) {
                tail = new Aff(CONS, head, tail);
              }
              head = new Aff(MAP, step._1, EMPTY, EMPTY);
              step = step._2;
              break;
            case APPLY:
              if (head) {
                tail = new Aff(CONS, head, tail);
              }
              head = new Aff(APPLY, EMPTY, step._2, EMPTY);
              step = step._1;
              break;
            case ALT:
              if (head) {
                tail = new Aff(CONS, head, tail);
              }
              head = new Aff(ALT, EMPTY, step._2, EMPTY);
              step = step._1;
              break;
            default:
              // When we hit a leaf value, we suspend the stack in the `FORKED`.
              // When the fiber resolves, it can bubble back up the tree.
              fid    = fiberId++;
              status = RETURN;
              tmp    = step;
              step   = new Aff(FORKED, fid, new Aff(CONS, head, tail), EMPTY);
              tmp    = Fiber(util, supervisor, tmp);
              tmp.onComplete({
                rethrow: false,
                handler: resolve(step)
              })();
              fibers[fid] = tmp;
              if (supervisor) {
                supervisor.register(tmp);
              }
            }
            break;
          case RETURN:
            // Terminal case, we are back at the root.
            if (head === null) {
              break loop;
            }
            // If we are done with the right side, we need to continue down the
            // left. Otherwise we should continue up the stack.
            if (head._1 === EMPTY) {
              head._1 = step;
              status  = CONTINUE;
              step    = head._2;
              head._2 = EMPTY;
            } else {
              head._2 = step;
              step    = head;
              if (tail === null) {
                head  = null;
              } else {
                head  = tail._1;
                tail  = tail._2;
              }
            }
          }
        }

        // Keep a reference to the tree root so it can be cancelled.
        root = step;

        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }

      // Cancels the entire tree. If there are already subtrees being canceled,
      // we need to first cancel those joins. This is important so that errors
      // don't accidentally get swallowed by irrelevant join callbacks.
      function cancel(error, cb) {
        interrupt = util.left(error);

        for (var kid in kills) {
          if (kills.hasOwnProperty(kid)) {
            kills[kid]();
          }
        }

        kills = null;
        var newKills = kill(error, root, cb);

        return function (killError) {
          return new Aff(ASYNC, function (killCb) {
            return function () {
              for (var kid in newKills) {
                if (newKills.hasOwnProperty(kid)) {
                  newKills[kid]();
                }
              }
              return nonCanceler;
            };
          });
        };
      }

      run();

      return function (killError) {
        return new Aff(ASYNC, function (killCb) {
          return function () {
            return cancel(killError, killCb);
          };
        });
      };
    }

    function sequential(util, supervisor, par) {
      return new Aff(ASYNC, function (cb) {
        return function () {
          return runPar(util, supervisor, par, cb);
        };
      });
    }

    Aff.EMPTY       = EMPTY;
    Aff.Pure        = AffCtr(PURE);
    Aff.Throw       = AffCtr(THROW);
    Aff.Catch       = AffCtr(CATCH);
    Aff.Sync        = AffCtr(SYNC);
    Aff.Async       = AffCtr(ASYNC);
    Aff.Bind        = AffCtr(BIND);
    Aff.Bracket     = AffCtr(BRACKET);
    Aff.Fork        = AffCtr(FORK);
    Aff.Seq         = AffCtr(SEQ);
    Aff.ParMap      = AffCtr(MAP);
    Aff.ParApply    = AffCtr(APPLY);
    Aff.ParAlt      = AffCtr(ALT);
    Aff.Fiber       = Fiber;
    Aff.Supervisor  = Supervisor;
    Aff.Scheduler   = Scheduler;
    Aff.nonCanceler = nonCanceler;

    return Aff;
  }();

  exports._pure = Aff.Pure;

  exports._throwError = Aff.Throw;

  exports._catchError = function (aff) {
    return function (k) {
      return Aff.Catch(aff, k);
    };
  };

  exports._map = function (f) {
    return function (aff) {
      if (aff.tag === Aff.Pure.tag) {
        return Aff.Pure(f(aff._1));
      } else {
        return Aff.Bind(aff, function (value) {
          return Aff.Pure(f(value));
        });
      }
    };
  };

  exports._bind = function (aff) {
    return function (k) {
      return Aff.Bind(aff, k);
    };
  };

  exports._fork = function (immediate) {
    return function (aff) {
      return Aff.Fork(immediate, aff);
    };
  };

  exports._liftEff = Aff.Sync;

  exports._parAffMap = function (f) {
    return function (aff) {
      return Aff.ParMap(f, aff);
    };
  };

  exports._parAffApply = function (aff1) {
    return function (aff2) {
      return Aff.ParApply(aff1, aff2);
    };
  };

  exports.makeAff = Aff.Async;

  exports._makeFiber = function (util, aff) {
    return function () {
      return Aff.Fiber(util, null, aff);
    };
  };  

  exports._sequential = Aff.Seq;
})(PS["Control.Monad.Aff"] = PS["Control.Monad.Aff"] || {});
(function(exports) {
    "use strict";

  exports.error = function (msg) {
    return new Error(msg);
  };

  exports.throwException = function (e) {
    return function () {
      throw e;
    };
  };
})(PS["Control.Monad.Eff.Exception"] = PS["Control.Monad.Eff.Exception"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Exception"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];
  var $$throw = function ($1) {
      return $foreign.throwException($foreign.error($1));
  };
  exports["throw"] = $$throw;
  exports["error"] = $foreign.error;
  exports["throwException"] = $foreign.throwException;
})(PS["Control.Monad.Eff.Exception"] = PS["Control.Monad.Eff.Exception"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Control.Monad.Aff"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Eff_Unsafe = PS["Control.Monad.Eff.Unsafe"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Parallel = PS["Control.Parallel"];
  var Control_Parallel_Class = PS["Control.Parallel.Class"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Time_Duration = PS["Data.Time.Duration"];
  var Data_Unit = PS["Data.Unit"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Canceler = function (x) {
      return x;
  };
  var suspendAff = $foreign._fork(false);
  var functorParAff = new Data_Functor.Functor($foreign._parAffMap);
  var functorAff = new Data_Functor.Functor($foreign._map);
  var forkAff = $foreign._fork(true);
  var ffiUtil = (function () {
      var unsafeFromRight = function (v) {
          if (v instanceof Data_Either.Right) {
              return v.value0;
          };
          if (v instanceof Data_Either.Left) {
              return Partial_Unsafe.unsafeCrashWith("unsafeFromRight: Left");
          };
          throw new Error("Failed pattern match at Control.Monad.Aff line 398, column 21 - line 400, column 31: " + [ v.constructor.name ]);
      };
      var unsafeFromLeft = function (v) {
          if (v instanceof Data_Either.Left) {
              return v.value0;
          };
          if (v instanceof Data_Either.Right) {
              return Partial_Unsafe.unsafeCrashWith("unsafeFromLeft: Right");
          };
          throw new Error("Failed pattern match at Control.Monad.Aff line 393, column 20 - line 397, column 3: " + [ v.constructor.name ]);
      };
      var isLeft = function (v) {
          if (v instanceof Data_Either.Left) {
              return true;
          };
          if (v instanceof Data_Either.Right) {
              return false;
          };
          throw new Error("Failed pattern match at Control.Monad.Aff line 388, column 12 - line 390, column 20: " + [ v.constructor.name ]);
      };
      return {
          isLeft: isLeft, 
          fromLeft: unsafeFromLeft, 
          fromRight: unsafeFromRight, 
          left: Data_Either.Left.create, 
          right: Data_Either.Right.create
      };
  })();
  var makeFiber = function (aff) {
      return $foreign._makeFiber(ffiUtil, aff);
  };
  var launchAff = function (aff) {
      return function __do() {
          var v = makeFiber(aff)();
          v.run();
          return v;
      };
  };
  var applyParAff = new Control_Apply.Apply(function () {
      return functorParAff;
  }, $foreign._parAffApply);
  var monadAff = new Control_Monad.Monad(function () {
      return applicativeAff;
  }, function () {
      return bindAff;
  });
  var bindAff = new Control_Bind.Bind(function () {
      return applyAff;
  }, $foreign._bind);
  var applyAff = new Control_Apply.Apply(function () {
      return functorAff;
  }, Control_Monad.ap(monadAff));
  var applicativeAff = new Control_Applicative.Applicative(function () {
      return applyAff;
  }, $foreign._pure);
  var monadEffAff = new Control_Monad_Eff_Class.MonadEff(function () {
      return monadAff;
  }, $foreign._liftEff);
  var effCanceler = function ($50) {
      return Canceler(Data_Function["const"](Control_Monad_Eff_Class.liftEff(monadEffAff)($50)));
  };
  var joinFiber = function (v) {
      return $foreign.makeAff(function (k) {
          return Data_Functor.map(Control_Monad_Eff.functorEff)(effCanceler)(v.join(k));
      });
  };
  var functorFiber = new Data_Functor.Functor(function (f) {
      return function (t) {
          return Control_Monad_Eff_Unsafe.unsafePerformEff(makeFiber(Data_Functor.map(functorAff)(f)(joinFiber(t))));
      };
  });
  var killFiber = function (e) {
      return function (v) {
          return Control_Bind.bind(bindAff)(Control_Monad_Eff_Class.liftEff(monadEffAff)(v.isSuspended))(function (v1) {
              if (v1) {
                  return Control_Monad_Eff_Class.liftEff(monadEffAff)(Data_Functor["void"](Control_Monad_Eff.functorEff)(v.kill(e, Data_Function["const"](Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit)))));
              };
              return $foreign.makeAff(function (k) {
                  return Data_Functor.map(Control_Monad_Eff.functorEff)(effCanceler)(v.kill(e, k));
              });
          });
      };
  };
  var monadThrowAff = new Control_Monad_Error_Class.MonadThrow(function () {
      return monadAff;
  }, $foreign._throwError);
  var monadErrorAff = new Control_Monad_Error_Class.MonadError(function () {
      return monadThrowAff;
  }, $foreign._catchError);                                     
  var runAff = function (k) {
      return function (aff) {
          return launchAff(Control_Bind.bindFlipped(bindAff)(function ($52) {
              return Control_Monad_Eff_Class.liftEff(monadEffAff)(k($52));
          })(Control_Monad_Error_Class["try"](monadErrorAff)(aff)));
      };
  };
  var runAff_ = function (k) {
      return function (aff) {
          return Data_Functor["void"](Control_Monad_Eff.functorEff)(runAff(k)(aff));
      };
  };
  var parallelAff = new Control_Parallel_Class.Parallel(function () {
      return applicativeParAff;
  }, function () {
      return monadAff;
  }, Unsafe_Coerce.unsafeCoerce, $foreign._sequential);
  var applicativeParAff = new Control_Applicative.Applicative(function () {
      return applyParAff;
  }, function ($54) {
      return Control_Parallel_Class.parallel(parallelAff)(Control_Applicative.pure(applicativeAff)($54));
  });
  var monadRecAff = new Control_Monad_Rec_Class.MonadRec(function () {
      return monadAff;
  }, function (k) {
      var go = function (a) {
          return Control_Bind.bind(bindAff)(k(a))(function (v) {
              if (v instanceof Control_Monad_Rec_Class.Done) {
                  return Control_Applicative.pure(applicativeAff)(v.value0);
              };
              if (v instanceof Control_Monad_Rec_Class.Loop) {
                  return go(v.value0);
              };
              throw new Error("Failed pattern match at Control.Monad.Aff line 100, column 7 - line 102, column 22: " + [ v.constructor.name ]);
          });
      };
      return go;
  });
  var nonCanceler = Data_Function["const"](Control_Applicative.pure(applicativeAff)(Data_Unit.unit));
  exports["Canceler"] = Canceler;
  exports["effCanceler"] = effCanceler;
  exports["forkAff"] = forkAff;
  exports["joinFiber"] = joinFiber;
  exports["killFiber"] = killFiber;
  exports["launchAff"] = launchAff;
  exports["nonCanceler"] = nonCanceler;
  exports["runAff"] = runAff;
  exports["runAff_"] = runAff_;
  exports["suspendAff"] = suspendAff;
  exports["functorAff"] = functorAff;
  exports["applyAff"] = applyAff;
  exports["applicativeAff"] = applicativeAff;
  exports["bindAff"] = bindAff;
  exports["monadAff"] = monadAff;
  exports["monadRecAff"] = monadRecAff;
  exports["monadThrowAff"] = monadThrowAff;
  exports["monadErrorAff"] = monadErrorAff;
  exports["monadEffAff"] = monadEffAff;
  exports["functorParAff"] = functorParAff;
  exports["applyParAff"] = applyParAff;
  exports["applicativeParAff"] = applicativeParAff;
  exports["parallelAff"] = parallelAff;
  exports["functorFiber"] = functorFiber;
  exports["makeAff"] = $foreign.makeAff;
})(PS["Control.Monad.Aff"] = PS["Control.Monad.Aff"] || {});
(function(exports) {
  /* globals exports, setTimeout */
  /* jshint -W097 */

  "use strict";

  var AVar = function () {
    function MutableQueue () {
      this.head = null;
      this.last = null;
      this.size = 0;
    }

    function MutableCell (queue, value) {
      this.queue = queue;
      this.value = value;
      this.next  = null;
      this.prev  = null;
    }

    function AVar (value) {
      this.draining = false;
      this.error    = null;
      this.value    = value;
      this.takes    = new MutableQueue();
      this.reads    = new MutableQueue();
      this.puts     = new MutableQueue();
    }

    var EMPTY = {};

    function putLast (queue, value) {
      var cell = new MutableCell(queue, value);
      switch (queue.size) {
      case 0:
        queue.head = cell;
        break;
      case 1:
        cell.prev = queue.head;
        queue.head.next = cell;
        queue.last = cell;
        break;
      default:
        cell.prev = queue.last;
        queue.last.next = cell;
        queue.last = cell;
      }
      queue.size++;
      return cell;
    }

    function takeLast (queue) {
      var cell;
      switch (queue.size) {
      case 0:
        return null;
      case 1:
        cell = queue.head;
        queue.head = null;
        break;
      case 2:
        cell = queue.last;
        queue.head.next = null;
        queue.last = null;
        break;
      default:
        cell = queue.last;
        queue.last = cell.prev;
        queue.last.next = null;
      }
      cell.prev = null;
      cell.queue = null;
      queue.size--;
      return cell.value;
    }

    function takeHead (queue) {
      var cell;
      switch (queue.size) {
      case 0:
        return null;
      case 1:
        cell = queue.head;
        queue.head = null;
        break;
      case 2:
        cell = queue.head;
        queue.last.prev = null;
        queue.head = queue.last;
        queue.last = null;
        break;
      default:
        cell = queue.head;
        queue.head = cell.next;
        queue.head.prev = null;
      }
      cell.next = null;
      cell.queue = null;
      queue.size--;
      return cell.value;
    }

    function deleteCell (cell) {
      if (cell.queue === null) {
        return;
      }
      if (cell.queue.last === cell) {
        takeLast(cell.queue);
        return;
      }
      if (cell.queue.head === cell) {
        takeHead(cell.queue);
        return;
      }
      if (cell.prev) {
        cell.prev.next = cell.next;
      }
      if (cell.next) {
        cell.next.prev = cell.prev;
      }
      cell.queue.size--;
      cell.queue = null;
      cell.value = null;
      cell.next  = null;
      cell.prev  = null;
    }

    function drainVar (util, avar) {
      if (avar.draining) {
        return;
      }

      var ps = avar.puts;
      var ts = avar.takes;
      var rs = avar.reads;
      var p, r, t, value, rsize;

      avar.draining = true;

      /* jshint -W084 */
      while (1) {
        p = null;
        r = null;
        t = null;
        value = avar.value;
        rsize = rs.size;

        if (avar.error !== null) {
          value = util.left(avar.error);
          while (p = takeHead(ps)) {
            runEff(p.cb(value));
          }
          while (r = takeHead(rs)) {
            runEff(r(value));
          }
          while (t = takeHead(ts)) {
            runEff(t(value));
          }
          break;
        }

        // Process the next put. We do not immediately invoke the callback
        // because we want to preserve ordering. If there are takes/reads
        // we want to run those first.
        if (value === EMPTY && (p = takeHead(ps))) {
          avar.value = value = p.value;
        }

        if (value !== EMPTY) {
          // We go ahead and queue up the next take for the same reasons as
          // above. Invoking the read callbacks can affect the mutable queue.
          t = takeHead(ts);
          // We only want to process the reads queued up before running these
          // callbacks so we guard on rsize.
          while (rsize-- && (r = takeHead(rs))) {
            runEff(r(util.right(value)));
          }
          if (t !== null) {
            avar.value = EMPTY;
            runEff(t(util.right(value)));
          }
        }

        if (p !== null) {
          runEff(p.cb(util.right(void 0)));
        }

        // Callbacks could have queued up more items so we need to guard on the
        // actual mutable properties.
        if (avar.value === EMPTY && ps.size === 0 || avar.value !== EMPTY && ts.size === 0) {
          break;
        }
      }
      /* jshint +W084 */

      avar.draining = false;
    }

    function runEff(eff) {
      try {
        eff();
      } catch (error) {
        setTimeout(function () {
          throw error;
        }, 0);
      }
    }

    AVar.EMPTY      = EMPTY;
    AVar.putLast    = putLast;
    AVar.takeLast   = takeLast;
    AVar.takeHead   = takeHead;
    AVar.deleteCell = deleteCell;
    AVar.drainVar   = drainVar;

    return AVar;
  }();

  exports.makeEmptyVar = function () {
    return new AVar(AVar.EMPTY);
  };

  exports._killVar = function (util, error, avar) {
    return function () {
      if (avar.error === null) {
        avar.error = error;
        avar.value = AVar.EMPTY;
        AVar.drainVar(util, avar);
      }
    };
  };

  exports._putVar = function (util, value, avar, cb) {
    return function () {
      var cell = AVar.putLast(avar.puts, { cb: cb, value: value });
      AVar.drainVar(util, avar);
      return function () {
        AVar.deleteCell(cell);
      };
    };
  };

  exports._takeVar = function (util, avar, cb) {
    return function () {
      var cell = AVar.putLast(avar.takes, cb);
      AVar.drainVar(util, avar);
      return function () {
        AVar.deleteCell(cell);
      };
    };
  };
})(PS["Control.Monad.Eff.AVar"] = PS["Control.Monad.Eff.AVar"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Control.Monad.Eff.AVar"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Prelude = PS["Prelude"];        
  var Killed = (function () {
      function Killed(value0) {
          this.value0 = value0;
      };
      Killed.create = function (value0) {
          return new Killed(value0);
      };
      return Killed;
  })();
  var Filled = (function () {
      function Filled(value0) {
          this.value0 = value0;
      };
      Filled.create = function (value0) {
          return new Filled(value0);
      };
      return Filled;
  })();
  var Empty = (function () {
      function Empty() {

      };
      Empty.value = new Empty();
      return Empty;
  })();
  var ffiUtil = {
      left: Data_Either.Left.create, 
      right: Data_Either.Right.create, 
      nothing: Data_Maybe.Nothing.value, 
      just: Data_Maybe.Just.create, 
      killed: Killed.create, 
      filled: Filled.create, 
      empty: Empty.value
  };
  var killVar = function (err) {
      return function (avar) {
          return $foreign._killVar(ffiUtil, err, avar);
      };
  };
  var putVar = function (value) {
      return function (avar) {
          return function (cb) {
              return $foreign._putVar(ffiUtil, value, avar, cb);
          };
      };
  };
  var takeVar = function (avar) {
      return function (cb) {
          return $foreign._takeVar(ffiUtil, avar, cb);
      };
  };
  exports["Killed"] = Killed;
  exports["Filled"] = Filled;
  exports["Empty"] = Empty;
  exports["killVar"] = killVar;
  exports["putVar"] = putVar;
  exports["takeVar"] = takeVar;
  exports["makeEmptyVar"] = $foreign.makeEmptyVar;
})(PS["Control.Monad.Eff.AVar"] = PS["Control.Monad.Eff.AVar"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_AVar = PS["Control.Monad.Eff.AVar"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Maybe = PS["Data.Maybe"];
  var Prelude = PS["Prelude"];
  var takeVar = function (avar) {
      return Control_Monad_Aff.makeAff(function (k) {
          return function __do() {
              var v = Control_Monad_Eff_AVar.takeVar(avar)(k)();
              return Control_Monad_Aff.effCanceler(v);
          };
      });
  };
  var putVar = function (value) {
      return function (avar) {
          return Control_Monad_Aff.makeAff(function (k) {
              return function __do() {
                  var v = Control_Monad_Eff_AVar.putVar(value)(avar)(k)();
                  return Control_Monad_Aff.effCanceler(v);
              };
          });
      };
  };
  var makeEmptyVar = Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_AVar.makeEmptyVar);
  var killVar = function (error) {
      return function ($11) {
          return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_AVar.killVar(error)($11));
      };
  };
  exports["killVar"] = killVar;
  exports["makeEmptyVar"] = makeEmptyVar;
  exports["putVar"] = putVar;
  exports["takeVar"] = takeVar;
})(PS["Control.Monad.Aff.AVar"] = PS["Control.Monad.Aff.AVar"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Cont_Class = PS["Control.Monad.Cont.Class"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Reader_Class = PS["Control.Monad.Reader.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Monad_Writer_Class = PS["Control.Monad.Writer.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var StateT = function (x) {
      return x;
  };
  var runStateT = function (v) {
      return v;
  };         
  var monadTransStateT = new Control_Monad_Trans_Class.MonadTrans(function (dictMonad) {
      return function (m) {
          return function (s) {
              return Control_Bind.bind(dictMonad.Bind1())(m)(function (v) {
                  return Control_Applicative.pure(dictMonad.Applicative0())(new Data_Tuple.Tuple(v, s));
              });
          };
      };
  });
  var lazyStateT = new Control_Lazy.Lazy(function (f) {
      return function (s) {
          var v = f(Data_Unit.unit);
          return v(s);
      };
  });
  var functorStateT = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return function (v) {
              return function (s) {
                  return Data_Functor.map(dictFunctor)(function (v1) {
                      return new Data_Tuple.Tuple(f(v1.value0), v1.value1);
                  })(v(s));
              };
          };
      });
  };
  var evalStateT = function (dictFunctor) {
      return function (v) {
          return function (s) {
              return Data_Functor.map(dictFunctor)(Data_Tuple.fst)(v(s));
          };
      };
  };
  var monadStateT = function (dictMonad) {
      return new Control_Monad.Monad(function () {
          return applicativeStateT(dictMonad);
      }, function () {
          return bindStateT(dictMonad);
      });
  };
  var bindStateT = function (dictMonad) {
      return new Control_Bind.Bind(function () {
          return applyStateT(dictMonad);
      }, function (v) {
          return function (f) {
              return function (s) {
                  return Control_Bind.bind(dictMonad.Bind1())(v(s))(function (v1) {
                      var v3 = f(v1.value0);
                      return v3(v1.value1);
                  });
              };
          };
      });
  };
  var applyStateT = function (dictMonad) {
      return new Control_Apply.Apply(function () {
          return functorStateT(((dictMonad.Bind1()).Apply0()).Functor0());
      }, Control_Monad.ap(monadStateT(dictMonad)));
  };
  var applicativeStateT = function (dictMonad) {
      return new Control_Applicative.Applicative(function () {
          return applyStateT(dictMonad);
      }, function (a) {
          return function (s) {
              return Control_Applicative.pure(dictMonad.Applicative0())(new Data_Tuple.Tuple(a, s));
          };
      });
  };
  var monadStateStateT = function (dictMonad) {
      return new Control_Monad_State_Class.MonadState(function () {
          return monadStateT(dictMonad);
      }, function (f) {
          return StateT(function ($111) {
              return Control_Applicative.pure(dictMonad.Applicative0())(f($111));
          });
      });
  };
  exports["StateT"] = StateT;
  exports["evalStateT"] = evalStateT;
  exports["runStateT"] = runStateT;
  exports["functorStateT"] = functorStateT;
  exports["applyStateT"] = applyStateT;
  exports["applicativeStateT"] = applicativeStateT;
  exports["bindStateT"] = bindStateT;
  exports["monadStateT"] = monadStateT;
  exports["monadTransStateT"] = monadTransStateT;
  exports["lazyStateT"] = lazyStateT;
  exports["monadStateStateT"] = monadStateStateT;
})(PS["Control.Monad.State.Trans"] = PS["Control.Monad.State.Trans"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Category = PS["Control.Category"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Cont_Trans = PS["Control.Monad.Cont.Trans"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Monad_List_Trans = PS["Control.Monad.List.Trans"];
  var Control_Monad_Maybe_Trans = PS["Control.Monad.Maybe.Trans"];
  var Control_Monad_RWS_Trans = PS["Control.Monad.RWS.Trans"];
  var Control_Monad_Reader_Trans = PS["Control.Monad.Reader.Trans"];
  var Control_Monad_State_Trans = PS["Control.Monad.State.Trans"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Monad_Writer_Trans = PS["Control.Monad.Writer.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Monoid = PS["Data.Monoid"];
  var Prelude = PS["Prelude"];        
  var MonadAff = function (MonadEff0, liftAff) {
      this.MonadEff0 = MonadEff0;
      this.liftAff = liftAff;
  };
  var monadAffAff = new MonadAff(function () {
      return Control_Monad_Aff.monadEffAff;
  }, Control_Category.id(Control_Category.categoryFn));
  var liftAff = function (dict) {
      return dict.liftAff;
  };
  exports["MonadAff"] = MonadAff;
  exports["liftAff"] = liftAff;
  exports["monadAffAff"] = monadAffAff;
})(PS["Control.Monad.Aff.Class"] = PS["Control.Monad.Aff.Class"] || {});
(function(exports) {
    "use strict";

  exports.mkEffFn1 = function mkEffFn1(fn) {
    return function(x) {
      return fn(x)();
    };
  };

  exports.runEffFn2 = function runEffFn2(fn) {
    return function(a) {
      return function(b) {
        return function() {
          return fn(a, b);
        };
      };
    };
  };

  exports.runEffFn3 = function runEffFn3(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function() {
            return fn(a, b, c);
          };
        };
      };
    };
  };
})(PS["Control.Monad.Eff.Uncurried"] = PS["Control.Monad.Eff.Uncurried"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Uncurried"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  exports["mkEffFn1"] = $foreign.mkEffFn1;
  exports["runEffFn2"] = $foreign.runEffFn2;
  exports["runEffFn3"] = $foreign.runEffFn3;
})(PS["Control.Monad.Eff.Uncurried"] = PS["Control.Monad.Eff.Uncurried"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Eff_Uncurried = PS["Control.Monad.Eff.Uncurried"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Function = PS["Data.Function"];
  var Prelude = PS["Prelude"];
  var fromEffFnAff = function (v) {
      return Control_Monad_Aff.makeAff(function (k) {
          return function __do() {
              var v1 = Control_Monad_Eff_Uncurried.runEffFn2(v)(Control_Monad_Eff_Uncurried.mkEffFn1(function ($4) {
                  return k(Data_Either.Left.create($4));
              }))(Control_Monad_Eff_Uncurried.mkEffFn1(function ($5) {
                  return k(Data_Either.Right.create($5));
              }))();
              return function (e) {
                  return Control_Monad_Aff.makeAff(function (k2) {
                      return function __do() {
                          Control_Monad_Eff_Uncurried.runEffFn3(v1)(e)(Control_Monad_Eff_Uncurried.mkEffFn1(function ($6) {
                              return k2(Data_Either.Left.create($6));
                          }))(Control_Monad_Eff_Uncurried.mkEffFn1(function ($7) {
                              return k2(Data_Either.Right.create($7));
                          }))();
                          return Control_Monad_Aff.nonCanceler;
                      };
                  });
              };
          };
      });
  };
  exports["fromEffFnAff"] = fromEffFnAff;
})(PS["Control.Monad.Aff.Compat"] = PS["Control.Monad.Aff.Compat"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var unsafeCoerceAff = Unsafe_Coerce.unsafeCoerce;
  exports["unsafeCoerceAff"] = unsafeCoerceAff;
})(PS["Control.Monad.Aff.Unsafe"] = PS["Control.Monad.Aff.Unsafe"] || {});
(function(exports) {
    "use strict";

  exports.warn = function (s) {
    return function () {
      console.warn(s);
      return {};
    };
  };
})(PS["Control.Monad.Eff.Console"] = PS["Control.Monad.Eff.Console"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Console"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  exports["warn"] = $foreign.warn;
})(PS["Control.Monad.Eff.Console"] = PS["Control.Monad.Eff.Console"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Reader_Trans = PS["Control.Monad.Reader.Trans"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Prelude = PS["Prelude"];
  var MonadFork = function (Functor1, Monad0, fork, join, suspend) {
      this.Functor1 = Functor1;
      this.Monad0 = Monad0;
      this.fork = fork;
      this.join = join;
      this.suspend = suspend;
  };
  var suspend = function (dict) {
      return dict.suspend;
  };
  var monadForkAff = new MonadFork(function () {
      return Control_Monad_Aff.functorFiber;
  }, function () {
      return Control_Monad_Aff.monadAff;
  }, Control_Monad_Aff.forkAff, Control_Monad_Aff.joinFiber, Control_Monad_Aff.suspendAff);
  var join = function (dict) {
      return dict.join;
  };
  var fork = function (dict) {
      return dict.fork;
  };
  exports["MonadFork"] = MonadFork;
  exports["fork"] = fork;
  exports["join"] = join;
  exports["suspend"] = suspend;
  exports["monadForkAff"] = monadForkAff;
})(PS["Control.Monad.Fork.Class"] = PS["Control.Monad.Fork.Class"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Tuple = PS["Data.Tuple"];        
  var CatQueue = (function () {
      function CatQueue(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      CatQueue.create = function (value0) {
          return function (value1) {
              return new CatQueue(value0, value1);
          };
      };
      return CatQueue;
  })();
  var uncons = function (__copy_v) {
      var __tco_done = false;
      var __tco_result;
      function __tco_loop(v) {
          if (v.value0 instanceof Data_List_Types.Nil && v.value1 instanceof Data_List_Types.Nil) {
              __tco_done = true;
              return Data_Maybe.Nothing.value;
          };
          if (v.value0 instanceof Data_List_Types.Nil) {
              __copy_v = new CatQueue(Data_List.reverse(v.value1), Data_List_Types.Nil.value);
              return;
          };
          if (v.value0 instanceof Data_List_Types.Cons) {
              __tco_done = true;
              return new Data_Maybe.Just(new Data_Tuple.Tuple(v.value0.value0, new CatQueue(v.value0.value1, v.value1)));
          };
          throw new Error("Failed pattern match at Data.CatQueue line 51, column 1 - line 51, column 36: " + [ v.constructor.name ]);
      };
      while (!__tco_done) {
          __tco_result = __tco_loop(__copy_v);
      };
      return __tco_result;
  };
  var snoc = function (v) {
      return function (a) {
          return new CatQueue(v.value0, new Data_List_Types.Cons(a, v.value1));
      };
  };
  var $$null = function (v) {
      if (v.value0 instanceof Data_List_Types.Nil && v.value1 instanceof Data_List_Types.Nil) {
          return true;
      };
      return false;
  };
  var empty = new CatQueue(Data_List_Types.Nil.value, Data_List_Types.Nil.value);
  exports["CatQueue"] = CatQueue;
  exports["empty"] = empty;
  exports["null"] = $$null;
  exports["snoc"] = snoc;
  exports["uncons"] = uncons;
})(PS["Data.CatQueue"] = PS["Data.CatQueue"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_CatQueue = PS["Data.CatQueue"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_NaturalTransformation = PS["Data.NaturalTransformation"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];        
  var CatNil = (function () {
      function CatNil() {

      };
      CatNil.value = new CatNil();
      return CatNil;
  })();
  var CatCons = (function () {
      function CatCons(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      CatCons.create = function (value0) {
          return function (value1) {
              return new CatCons(value0, value1);
          };
      };
      return CatCons;
  })();
  var link = function (v) {
      return function (cat) {
          if (v instanceof CatNil) {
              return cat;
          };
          if (v instanceof CatCons) {
              return new CatCons(v.value0, Data_CatQueue.snoc(v.value1)(cat));
          };
          throw new Error("Failed pattern match at Data.CatList line 111, column 1 - line 111, column 22: " + [ v.constructor.name, cat.constructor.name ]);
      };
  };
  var foldr = function (k) {
      return function (b) {
          return function (q) {
              var foldl = function (__copy_v) {
                  return function (__copy_c) {
                      return function (__copy_v1) {
                          var __tco_v = __copy_v;
                          var __tco_c = __copy_c;
                          var __tco_done = false;
                          var __tco_result;
                          function __tco_loop(v, c, v1) {
                              if (v1 instanceof Data_List_Types.Nil) {
                                  __tco_done = true;
                                  return c;
                              };
                              if (v1 instanceof Data_List_Types.Cons) {
                                  __tco_v = v;
                                  __tco_c = v(c)(v1.value0);
                                  __copy_v1 = v1.value1;
                                  return;
                              };
                              throw new Error("Failed pattern match at Data.CatList line 126, column 3 - line 126, column 22: " + [ v.constructor.name, c.constructor.name, v1.constructor.name ]);
                          };
                          while (!__tco_done) {
                              __tco_result = __tco_loop(__tco_v, __tco_c, __copy_v1);
                          };
                          return __tco_result;
                      };
                  };
              };
              var go = function (__copy_xs) {
                  return function (__copy_ys) {
                      var __tco_xs = __copy_xs;
                      var __tco_done = false;
                      var __tco_result;
                      function __tco_loop(xs, ys) {
                          var v = Data_CatQueue.uncons(xs);
                          if (v instanceof Data_Maybe.Nothing) {
                              __tco_done = true;
                              return foldl(function (x) {
                                  return function (i) {
                                      return i(x);
                                  };
                              })(b)(ys);
                          };
                          if (v instanceof Data_Maybe.Just) {
                              __tco_xs = v.value0.value1;
                              __copy_ys = new Data_List_Types.Cons(k(v.value0.value0), ys);
                              return;
                          };
                          throw new Error("Failed pattern match at Data.CatList line 121, column 14 - line 123, column 67: " + [ v.constructor.name ]);
                      };
                      while (!__tco_done) {
                          __tco_result = __tco_loop(__tco_xs, __copy_ys);
                      };
                      return __tco_result;
                  };
              };
              return go(q)(Data_List_Types.Nil.value);
          };
      };
  };
  var uncons = function (v) {
      if (v instanceof CatNil) {
          return Data_Maybe.Nothing.value;
      };
      if (v instanceof CatCons) {
          return new Data_Maybe.Just(new Data_Tuple.Tuple(v.value0, (function () {
              var $41 = Data_CatQueue["null"](v.value1);
              if ($41) {
                  return CatNil.value;
              };
              return foldr(link)(CatNil.value)(v.value1);
          })()));
      };
      throw new Error("Failed pattern match at Data.CatList line 102, column 1 - line 102, column 24: " + [ v.constructor.name ]);
  }; 
  var empty = CatNil.value;
  var append = function (v) {
      return function (v1) {
          if (v1 instanceof CatNil) {
              return v;
          };
          if (v instanceof CatNil) {
              return v1;
          };
          return link(v)(v1);
      };
  }; 
  var semigroupCatList = new Data_Semigroup.Semigroup(append);
  var snoc = function (cat) {
      return function (a) {
          return append(cat)(new CatCons(a, Data_CatQueue.empty));
      };
  };
  exports["CatNil"] = CatNil;
  exports["CatCons"] = CatCons;
  exports["append"] = append;
  exports["empty"] = empty;
  exports["snoc"] = snoc;
  exports["uncons"] = uncons;
  exports["semigroupCatList"] = semigroupCatList;
})(PS["Data.CatList"] = PS["Data.CatList"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_CatList = PS["Data.CatList"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Free = (function () {
      function Free(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Free.create = function (value0) {
          return function (value1) {
              return new Free(value0, value1);
          };
      };
      return Free;
  })();
  var Return = (function () {
      function Return(value0) {
          this.value0 = value0;
      };
      Return.create = function (value0) {
          return new Return(value0);
      };
      return Return;
  })();
  var Bind = (function () {
      function Bind(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Bind.create = function (value0) {
          return function (value1) {
              return new Bind(value0, value1);
          };
      };
      return Bind;
  })();
  var toView = function (__copy_v) {
      var __tco_done = false;
      var __tco_result;
      function __tco_loop(v) {
          var runExpF = function (v2) {
              return v2;
          };
          var concatF = function (v2) {
              return function (r) {
                  return new Free(v2.value0, Data_Semigroup.append(Data_CatList.semigroupCatList)(v2.value1)(r));
              };
          };
          if (v.value0 instanceof Return) {
              var v2 = Data_CatList.uncons(v.value1);
              if (v2 instanceof Data_Maybe.Nothing) {
                  __tco_done = true;
                  return new Return(Unsafe_Coerce.unsafeCoerce(v.value0.value0));
              };
              if (v2 instanceof Data_Maybe.Just) {
                  __copy_v = Unsafe_Coerce.unsafeCoerce(concatF(runExpF(v2.value0.value0)(v.value0.value0))(v2.value0.value1));
                  return;
              };
              throw new Error("Failed pattern match at Control.Monad.Free line 215, column 7 - line 219, column 64: " + [ v2.constructor.name ]);
          };
          if (v.value0 instanceof Bind) {
              __tco_done = true;
              return new Bind(v.value0.value0, function (a) {
                  return Unsafe_Coerce.unsafeCoerce(concatF(v.value0.value1(a))(v.value1));
              });
          };
          throw new Error("Failed pattern match at Control.Monad.Free line 213, column 3 - line 221, column 56: " + [ v.value0.constructor.name ]);
      };
      while (!__tco_done) {
          __tco_result = __tco_loop(__copy_v);
      };
      return __tco_result;
  };
  var fromView = function (f) {
      return new Free(Unsafe_Coerce.unsafeCoerce(f), Data_CatList.empty);
  };
  var freeMonad = new Control_Monad.Monad(function () {
      return freeApplicative;
  }, function () {
      return freeBind;
  });
  var freeFunctor = new Data_Functor.Functor(function (k) {
      return function (f) {
          return Control_Bind.bindFlipped(freeBind)(function ($118) {
              return Control_Applicative.pure(freeApplicative)(k($118));
          })(f);
      };
  });
  var freeBind = new Control_Bind.Bind(function () {
      return freeApply;
  }, function (v) {
      return function (k) {
          return new Free(v.value0, Data_CatList.snoc(v.value1)(Unsafe_Coerce.unsafeCoerce(k)));
      };
  });
  var freeApply = new Control_Apply.Apply(function () {
      return freeFunctor;
  }, Control_Monad.ap(freeMonad));
  var freeApplicative = new Control_Applicative.Applicative(function () {
      return freeApply;
  }, function ($119) {
      return fromView(Return.create($119));
  });
  var liftF = function (f) {
      return fromView(new Bind(Unsafe_Coerce.unsafeCoerce(f), function ($120) {
          return Control_Applicative.pure(freeApplicative)(Unsafe_Coerce.unsafeCoerce($120));
      }));
  };
  var foldFree = function (dictMonadRec) {
      return function (k) {
          var go = function (f) {
              var v = toView(f);
              if (v instanceof Return) {
                  return Data_Functor.map((((dictMonadRec.Monad0()).Bind1()).Apply0()).Functor0())(Control_Monad_Rec_Class.Done.create)(Control_Applicative.pure((dictMonadRec.Monad0()).Applicative0())(v.value0));
              };
              if (v instanceof Bind) {
                  return Data_Functor.map((((dictMonadRec.Monad0()).Bind1()).Apply0()).Functor0())(function ($127) {
                      return Control_Monad_Rec_Class.Loop.create(v.value1($127));
                  })(k(v.value0));
              };
              throw new Error("Failed pattern match at Control.Monad.Free line 146, column 10 - line 148, column 37: " + [ v.constructor.name ]);
          };
          return Control_Monad_Rec_Class.tailRecM(dictMonadRec)(go);
      };
  };
  exports["foldFree"] = foldFree;
  exports["liftF"] = liftF;
  exports["freeFunctor"] = freeFunctor;
  exports["freeBind"] = freeBind;
  exports["freeApplicative"] = freeApplicative;
  exports["freeApply"] = freeApply;
  exports["freeMonad"] = freeMonad;
})(PS["Control.Monad.Free"] = PS["Control.Monad.Free"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_State_Trans = PS["Control.Monad.State.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Tuple = PS["Data.Tuple"];
  var Prelude = PS["Prelude"];
  var evalState = function (v) {
      return function (s) {
          var v1 = v(s);
          return v1.value0;
      };
  };
  exports["evalState"] = evalState;
})(PS["Control.Monad.State"] = PS["Control.Monad.State"] || {});
(function(exports) {
    "use strict";

  exports.eventListener = function (fn) {
    return function (event) {
      return fn(event)();
    };
  };

  exports.addEventListener = function (type) {
    return function (listener) {
      return function (useCapture) {
        return function (target) {
          return function () {
            target.addEventListener(type, listener, useCapture);
            return {};
          };
        };
      };
    };
  };

  exports.removeEventListener = function (type) {
    return function (listener) {
      return function (useCapture) {
        return function (target) {
          return function () {
            target.removeEventListener(type, listener, useCapture);
            return {};
          };
        };
      };
    };
  };
})(PS["DOM.Event.EventTarget"] = PS["DOM.Event.EventTarget"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["DOM.Event.EventTarget"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var DOM = PS["DOM"];
  var DOM_Event_Types = PS["DOM.Event.Types"];
  var Prelude = PS["Prelude"];
  exports["addEventListener"] = $foreign.addEventListener;
  exports["eventListener"] = $foreign.eventListener;
  exports["removeEventListener"] = $foreign.removeEventListener;
})(PS["DOM.Event.EventTarget"] = PS["DOM.Event.EventTarget"] || {});
(function(exports) {
  /* global window */
  "use strict";

  exports.window = function () {
    return window;
  };
})(PS["DOM.HTML"] = PS["DOM.HTML"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["DOM.HTML"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var DOM = PS["DOM"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  exports["window"] = $foreign.window;
})(PS["DOM.HTML"] = PS["DOM.HTML"] || {});
(function(exports) {
    "use strict";

  exports._readyState = function (doc) {
    return function () {
      return doc.readyState;
    };
  };
})(PS["DOM.HTML.Document"] = PS["DOM.HTML.Document"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Enum = PS["Data.Enum"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];        
  var Loading = (function () {
      function Loading() {

      };
      Loading.value = new Loading();
      return Loading;
  })();
  var Interactive = (function () {
      function Interactive() {

      };
      Interactive.value = new Interactive();
      return Interactive;
  })();
  var Complete = (function () {
      function Complete() {

      };
      Complete.value = new Complete();
      return Complete;
  })();
  var parseReadyState = function (v) {
      if (v === "loading") {
          return new Data_Maybe.Just(Loading.value);
      };
      if (v === "interactive") {
          return new Data_Maybe.Just(Interactive.value);
      };
      if (v === "complete") {
          return new Data_Maybe.Just(Complete.value);
      };
      return Data_Maybe.Nothing.value;
  };
  exports["Loading"] = Loading;
  exports["Interactive"] = Interactive;
  exports["Complete"] = Complete;
  exports["parseReadyState"] = parseReadyState;
})(PS["DOM.HTML.Document.ReadyState"] = PS["DOM.HTML.Document.ReadyState"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["DOM.HTML.Document"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM = PS["DOM"];
  var DOM_HTML_Document_ReadyState = PS["DOM.HTML.Document.ReadyState"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Nullable = PS["Data.Nullable"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
  var readyState = function ($1) {
      return Data_Functor.map(Control_Monad_Eff.functorEff)(function ($2) {
          return Data_Maybe.fromJust()(DOM_HTML_Document_ReadyState.parseReadyState($2));
      })($foreign._readyState($1));
  };
  exports["readyState"] = readyState;
})(PS["DOM.HTML.Document"] = PS["DOM.HTML.Document"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var DOM_Event_Types = PS["DOM.Event.Types"];
  var load = "load";        
  var click = "click";
  exports["click"] = click;
  exports["load"] = load;
})(PS["DOM.HTML.Event.EventTypes"] = PS["DOM.HTML.Event.EventTypes"] || {});
(function(exports) {
    "use strict";

  exports.document = function (window) {
    return function () {
      return window.document;
    };
  };
})(PS["DOM.HTML.Window"] = PS["DOM.HTML.Window"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["DOM.HTML.Window"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM = PS["DOM"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var DOM_WebStorage_Types = PS["DOM.WebStorage.Types"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Nullable = PS["Data.Nullable"];
  var Data_Ord = PS["Data.Ord"];
  var Prelude = PS["Prelude"];
  exports["document"] = $foreign.document;
})(PS["DOM.HTML.Window"] = PS["DOM.HTML.Window"] || {});
(function(exports) {
    "use strict";

  var getEffProp = function (name) {
    return function (node) {
      return function () {
        return node[name];
      };
    };
  };                                                   

  exports._parentNode = getEffProp("parentNode");          

  exports._nextSibling = getEffProp("nextSibling");

  exports.insertBefore = function (node1) {
    return function (node2) {
      return function (parent) {
        return function () {
          return parent.insertBefore(node1, node2);
        };
      };
    };
  };

  exports.appendChild = function (node) {
    return function (parent) {
      return function () {
        return parent.appendChild(node);
      };
    };
  };

  exports.removeChild = function (node) {
    return function (parent) {
      return function () {
        return parent.removeChild(node);
      };
    };
  };
})(PS["DOM.Node.Node"] = PS["DOM.Node.Node"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["DOM.Node.Node"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM = PS["DOM"];
  var DOM_Node_NodeType = PS["DOM.Node.NodeType"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Data_Enum = PS["Data.Enum"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Nullable = PS["Data.Nullable"];
  var Prelude = PS["Prelude"];
  var parentNode = function ($2) {
      return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Nullable.toMaybe)($foreign._parentNode($2));
  };
  var nextSibling = function ($6) {
      return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Nullable.toMaybe)($foreign._nextSibling($6));
  };
  exports["nextSibling"] = nextSibling;
  exports["parentNode"] = parentNode;
  exports["appendChild"] = $foreign.appendChild;
  exports["insertBefore"] = $foreign.insertBefore;
  exports["removeChild"] = $foreign.removeChild;
})(PS["DOM.Node.Node"] = PS["DOM.Node.Node"] || {});
(function(exports) {
    "use strict";                                             

  exports._querySelector = function (selector) {
    return function (node) {
      return function () {
        return node.querySelector(selector);
      };
    };
  };
})(PS["DOM.Node.ParentNode"] = PS["DOM.Node.ParentNode"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["DOM.Node.ParentNode"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM = PS["DOM"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Nullable = PS["Data.Nullable"];
  var Data_Ord = PS["Data.Ord"];
  var Prelude = PS["Prelude"];
  var querySelector = function (qs) {
      return function ($3) {
          return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Nullable.toMaybe)($foreign._querySelector(qs)($3));
      };
  };
  exports["querySelector"] = querySelector;
})(PS["DOM.Node.ParentNode"] = PS["DOM.Node.ParentNode"] || {});
(function(exports) {
    "use strict";

  exports._jsonParser = function (fail, succ, s) {
    try {
      return succ(JSON.parse(s));
    }
    catch (e) {
      return fail(e.message);
    }
  };
})(PS["Data.Argonaut.Parser"] = PS["Data.Argonaut.Parser"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Argonaut.Parser"];
  var Data_Argonaut_Core = PS["Data.Argonaut.Core"];
  var Data_Either = PS["Data.Either"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];        
  var jsonParser = function (j) {
      return $foreign._jsonParser(Data_Either.Left.create, Data_Either.Right.create, j);
  };
  exports["jsonParser"] = jsonParser;
})(PS["Data.Argonaut.Parser"] = PS["Data.Argonaut.Parser"] || {});
(function(exports) {
    "use strict";       

  exports.fromFoldableImpl = (function () {
    // jshint maxparams: 2
    function Cons(head, tail) {
      this.head = head;
      this.tail = tail;
    }
    var emptyList = {};

    function curryCons(head) {
      return function (tail) {
        return new Cons(head, tail);
      };
    }

    function listToArray(list) {
      var result = [];
      var count = 0;
      var xs = list;
      while (xs !== emptyList) {
        result[count++] = xs.head;
        xs = xs.tail;
      }
      return result;
    }

    return function (foldr) {
      return function (xs) {
        return listToArray(foldr(curryCons)(emptyList)(xs));
      };
    };
  })();

  //------------------------------------------------------------------------------
  // Array size ------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.length = function (xs) {
    return xs.length;
  };

  //------------------------------------------------------------------------------
  // Extending arrays ------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.cons = function (e) {
    return function (l) {
      return [e].concat(l);
    };
  };

  exports.snoc = function (l) {
    return function (e) {
      var l1 = l.slice();
      l1.push(e);
      return l1;
    };
  };

  //------------------------------------------------------------------------------
  // Non-indexed reads -----------------------------------------------------------
  //------------------------------------------------------------------------------

  exports["uncons'"] = function (empty) {
    return function (next) {
      return function (xs) {
        return xs.length === 0 ? empty({}) : next(xs[0])(xs.slice(1));
      };
    };
  };

  exports.findIndexImpl = function (just) {
    return function (nothing) {
      return function (f) {
        return function (xs) {
          for (var i = 0, l = xs.length; i < l; i++) {
            if (f(xs[i])) return just(i);
          }
          return nothing;
        };
      };
    };
  };

  exports.concat = function (xss) {
    if (xss.length <= 10000) {
      // This method is faster, but it crashes on big arrays.
      // So we use it when can and fallback to simple variant otherwise.
      return Array.prototype.concat.apply([], xss);
    }

    var result = [];
    for (var i = 0, l = xss.length; i < l; i++) {
      var xs = xss[i];
      for (var j = 0, m = xs.length; j < m; j++) {
        result.push(xs[j]);
      }
    }
    return result;
  };

  //------------------------------------------------------------------------------
  // Sorting ---------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.sortImpl = function (f) {
    return function (l) {
      // jshint maxparams: 2
      return l.slice().sort(function (x, y) {
        return f(x)(y);
      });
    };
  };

  //------------------------------------------------------------------------------
  // Subarrays -------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.slice = function (s) {
    return function (e) {
      return function (l) {
        return l.slice(s, e);
      };
    };
  };

  //------------------------------------------------------------------------------
  // Zipping ---------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.zipWith = function (f) {
    return function (xs) {
      return function (ys) {
        var l = xs.length < ys.length ? xs.length : ys.length;
        var result = new Array(l);
        for (var i = 0; i < l; i++) {
          result[i] = f(xs[i])(ys[i]);
        }
        return result;
      };
    };
  };
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Array"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Array_ST = PS["Data.Array.ST"];
  var Data_Array_ST_Iterator = PS["Data.Array.ST.Iterator"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];
  var zip = $foreign.zipWith(Data_Tuple.Tuple.create);
  var uncons = $foreign["uncons'"](Data_Function["const"](Data_Maybe.Nothing.value))(function (x) {
      return function (xs) {
          return new Data_Maybe.Just({
              head: x, 
              tail: xs
          });
      };
  });
  var sortBy = function (comp) {
      return function (xs) {
          var comp$prime = function (x) {
              return function (y) {
                  var v = comp(x)(y);
                  if (v instanceof Data_Ordering.GT) {
                      return 1;
                  };
                  if (v instanceof Data_Ordering.EQ) {
                      return 0;
                  };
                  if (v instanceof Data_Ordering.LT) {
                      return -1 | 0;
                  };
                  throw new Error("Failed pattern match at Data.Array line 477, column 15 - line 482, column 1: " + [ v.constructor.name ]);
              };
          };
          return $foreign.sortImpl(comp$prime)(xs);
      };
  };
  var sort = function (dictOrd) {
      return function (xs) {
          return sortBy(Data_Ord.compare(dictOrd))(xs);
      };
  };
  var some = function (dictAlternative) {
      return function (dictLazy) {
          return function (v) {
              return Control_Apply.apply((dictAlternative.Applicative0()).Apply0())(Data_Functor.map(((dictAlternative.Plus1()).Alt0()).Functor0())($foreign.cons)(v))(Control_Lazy.defer(dictLazy)(function (v1) {
                  return many(dictAlternative)(dictLazy)(v);
              }));
          };
      };
  };
  var many = function (dictAlternative) {
      return function (dictLazy) {
          return function (v) {
              return Control_Alt.alt((dictAlternative.Plus1()).Alt0())(some(dictAlternative)(dictLazy)(v))(Control_Applicative.pure(dictAlternative.Applicative0())([  ]));
          };
      };
  };
  var fromFoldable = function (dictFoldable) {
      return $foreign.fromFoldableImpl(Data_Foldable.foldr(dictFoldable));
  };
  var findIndex = $foreign.findIndexImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
  var elemIndex = function (dictEq) {
      return function (x) {
          return findIndex(function (v) {
              return Data_Eq.eq(dictEq)(v)(x);
          });
      };
  };
  exports["elemIndex"] = elemIndex;
  exports["findIndex"] = findIndex;
  exports["fromFoldable"] = fromFoldable;
  exports["many"] = many;
  exports["some"] = some;
  exports["sort"] = sort;
  exports["sortBy"] = sortBy;
  exports["uncons"] = uncons;
  exports["zip"] = zip;
  exports["cons"] = $foreign.cons;
  exports["length"] = $foreign.length;
  exports["snoc"] = $foreign.snoc;
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function(exports) {
    "use strict";

  exports.toCharCode = function (c) {
    return c.charCodeAt(0);
  };

  exports.fromCharCode = function (c) {
    return String.fromCharCode(c);
  };
})(PS["Data.Char"] = PS["Data.Char"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.Char"];
  exports["fromCharCode"] = $foreign.fromCharCode;
  exports["toCharCode"] = $foreign.toCharCode;
})(PS["Data.Char"] = PS["Data.Char"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Data_Array = PS["Data.Array"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Int = PS["Data.Int"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
  var NUMCAT_LU = (function () {
      function NUMCAT_LU() {

      };
      NUMCAT_LU.value = new NUMCAT_LU();
      return NUMCAT_LU;
  })();
  var NUMCAT_LL = (function () {
      function NUMCAT_LL() {

      };
      NUMCAT_LL.value = new NUMCAT_LL();
      return NUMCAT_LL;
  })();
  var NUMCAT_LT = (function () {
      function NUMCAT_LT() {

      };
      NUMCAT_LT.value = new NUMCAT_LT();
      return NUMCAT_LT;
  })();
  var NUMCAT_LM = (function () {
      function NUMCAT_LM() {

      };
      NUMCAT_LM.value = new NUMCAT_LM();
      return NUMCAT_LM;
  })();
  var NUMCAT_LO = (function () {
      function NUMCAT_LO() {

      };
      NUMCAT_LO.value = new NUMCAT_LO();
      return NUMCAT_LO;
  })();
  var NUMCAT_MN = (function () {
      function NUMCAT_MN() {

      };
      NUMCAT_MN.value = new NUMCAT_MN();
      return NUMCAT_MN;
  })();
  var NUMCAT_MC = (function () {
      function NUMCAT_MC() {

      };
      NUMCAT_MC.value = new NUMCAT_MC();
      return NUMCAT_MC;
  })();
  var NUMCAT_ME = (function () {
      function NUMCAT_ME() {

      };
      NUMCAT_ME.value = new NUMCAT_ME();
      return NUMCAT_ME;
  })();
  var NUMCAT_ND = (function () {
      function NUMCAT_ND() {

      };
      NUMCAT_ND.value = new NUMCAT_ND();
      return NUMCAT_ND;
  })();
  var NUMCAT_NL = (function () {
      function NUMCAT_NL() {

      };
      NUMCAT_NL.value = new NUMCAT_NL();
      return NUMCAT_NL;
  })();
  var NUMCAT_NO = (function () {
      function NUMCAT_NO() {

      };
      NUMCAT_NO.value = new NUMCAT_NO();
      return NUMCAT_NO;
  })();
  var NUMCAT_PC = (function () {
      function NUMCAT_PC() {

      };
      NUMCAT_PC.value = new NUMCAT_PC();
      return NUMCAT_PC;
  })();
  var NUMCAT_PD = (function () {
      function NUMCAT_PD() {

      };
      NUMCAT_PD.value = new NUMCAT_PD();
      return NUMCAT_PD;
  })();
  var NUMCAT_PS = (function () {
      function NUMCAT_PS() {

      };
      NUMCAT_PS.value = new NUMCAT_PS();
      return NUMCAT_PS;
  })();
  var NUMCAT_PE = (function () {
      function NUMCAT_PE() {

      };
      NUMCAT_PE.value = new NUMCAT_PE();
      return NUMCAT_PE;
  })();
  var NUMCAT_PI = (function () {
      function NUMCAT_PI() {

      };
      NUMCAT_PI.value = new NUMCAT_PI();
      return NUMCAT_PI;
  })();
  var NUMCAT_PF = (function () {
      function NUMCAT_PF() {

      };
      NUMCAT_PF.value = new NUMCAT_PF();
      return NUMCAT_PF;
  })();
  var NUMCAT_PO = (function () {
      function NUMCAT_PO() {

      };
      NUMCAT_PO.value = new NUMCAT_PO();
      return NUMCAT_PO;
  })();
  var NUMCAT_SM = (function () {
      function NUMCAT_SM() {

      };
      NUMCAT_SM.value = new NUMCAT_SM();
      return NUMCAT_SM;
  })();
  var NUMCAT_SC = (function () {
      function NUMCAT_SC() {

      };
      NUMCAT_SC.value = new NUMCAT_SC();
      return NUMCAT_SC;
  })();
  var NUMCAT_SK = (function () {
      function NUMCAT_SK() {

      };
      NUMCAT_SK.value = new NUMCAT_SK();
      return NUMCAT_SK;
  })();
  var NUMCAT_SO = (function () {
      function NUMCAT_SO() {

      };
      NUMCAT_SO.value = new NUMCAT_SO();
      return NUMCAT_SO;
  })();
  var NUMCAT_ZS = (function () {
      function NUMCAT_ZS() {

      };
      NUMCAT_ZS.value = new NUMCAT_ZS();
      return NUMCAT_ZS;
  })();
  var NUMCAT_ZL = (function () {
      function NUMCAT_ZL() {

      };
      NUMCAT_ZL.value = new NUMCAT_ZL();
      return NUMCAT_ZL;
  })();
  var NUMCAT_ZP = (function () {
      function NUMCAT_ZP() {

      };
      NUMCAT_ZP.value = new NUMCAT_ZP();
      return NUMCAT_ZP;
  })();
  var NUMCAT_CC = (function () {
      function NUMCAT_CC() {

      };
      NUMCAT_CC.value = new NUMCAT_CC();
      return NUMCAT_CC;
  })();
  var NUMCAT_CF = (function () {
      function NUMCAT_CF() {

      };
      NUMCAT_CF.value = new NUMCAT_CF();
      return NUMCAT_CF;
  })();
  var NUMCAT_CS = (function () {
      function NUMCAT_CS() {

      };
      NUMCAT_CS.value = new NUMCAT_CS();
      return NUMCAT_CS;
  })();
  var NUMCAT_CO = (function () {
      function NUMCAT_CO() {

      };
      NUMCAT_CO.value = new NUMCAT_CO();
      return NUMCAT_CO;
  })();
  var NUMCAT_CN = (function () {
      function NUMCAT_CN() {

      };
      NUMCAT_CN.value = new NUMCAT_CN();
      return NUMCAT_CN;
  })();
  var numSpaceBlocks = 8;
  var numLat1Blocks = 63;
  var numConvBlocks = 1230;
  var numBlocks = 2783;    
  var gencatZS = 2;
  var rule1 = {
      category: gencatZS, 
      unicodeCat: NUMCAT_ZS.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var spacechars = [ {
      start: 32, 
      length: 1, 
      convRule: rule1
  }, {
      start: 160, 
      length: 1, 
      convRule: rule1
  }, {
      start: 5760, 
      length: 1, 
      convRule: rule1
  }, {
      start: 6158, 
      length: 1, 
      convRule: rule1
  }, {
      start: 8192, 
      length: 11, 
      convRule: rule1
  }, {
      start: 8239, 
      length: 1, 
      convRule: rule1
  }, {
      start: 8287, 
      length: 1, 
      convRule: rule1
  }, {
      start: 12288, 
      length: 1, 
      convRule: rule1
  } ];
  var gencatZP = 67108864;
  var rule140 = {
      category: gencatZP, 
      unicodeCat: NUMCAT_ZP.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatZL = 33554432;
  var rule139 = {
      category: gencatZL, 
      unicodeCat: NUMCAT_ZL.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatSO = 8192;
  var rule13 = {
      category: gencatSO, 
      unicodeCat: NUMCAT_SO.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var rule148 = {
      category: gencatSO, 
      unicodeCat: NUMCAT_SO.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 26, 
      titledist: 0
  };
  var rule149 = {
      category: gencatSO, 
      unicodeCat: NUMCAT_SO.value, 
      possible: 1, 
      updist: -26 | 0, 
      lowdist: 0, 
      titledist: -26 | 0
  };
  var gencatSM = 64;
  var rule6 = {
      category: gencatSM, 
      unicodeCat: NUMCAT_SM.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatSK = 1024;
  var rule10 = {
      category: gencatSK, 
      unicodeCat: NUMCAT_SK.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatSC = 8;
  var rule3 = {
      category: gencatSC, 
      unicodeCat: NUMCAT_SC.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatPS = 16;
  var rule4 = {
      category: gencatPS, 
      unicodeCat: NUMCAT_PS.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatPO = 4;
  var rule2 = {
      category: gencatPO, 
      unicodeCat: NUMCAT_PO.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatPI = 16384;
  var rule15 = {
      category: gencatPI, 
      unicodeCat: NUMCAT_PI.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatPF = 131072;
  var rule19 = {
      category: gencatPF, 
      unicodeCat: NUMCAT_PF.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatPE = 32;
  var rule5 = {
      category: gencatPE, 
      unicodeCat: NUMCAT_PE.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatPD = 128;
  var rule7 = {
      category: gencatPD, 
      unicodeCat: NUMCAT_PD.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatPC = 2048;
  var rule11 = {
      category: gencatPC, 
      unicodeCat: NUMCAT_PC.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatNO = 65536;
  var rule17 = {
      category: gencatNO, 
      unicodeCat: NUMCAT_NO.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatNL = 16777216;
  var rule116 = {
      category: gencatNL, 
      unicodeCat: NUMCAT_NL.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var rule146 = {
      category: gencatNL, 
      unicodeCat: NUMCAT_NL.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 16, 
      titledist: 0
  };
  var rule147 = {
      category: gencatNL, 
      unicodeCat: NUMCAT_NL.value, 
      possible: 1, 
      updist: -16 | 0, 
      lowdist: 0, 
      titledist: -16 | 0
  };
  var gencatND = 256;
  var rule8 = {
      category: gencatND, 
      unicodeCat: NUMCAT_ND.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatMN = 2097152;
  var rule84 = {
      category: gencatMN, 
      unicodeCat: NUMCAT_MN.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var rule85 = {
      category: gencatMN, 
      unicodeCat: NUMCAT_MN.value, 
      possible: 1, 
      updist: 84, 
      lowdist: 0, 
      titledist: 84
  };
  var gencatME = 4194304;
  var rule109 = {
      category: gencatME, 
      unicodeCat: NUMCAT_ME.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatMC = 8388608;
  var rule114 = {
      category: gencatMC, 
      unicodeCat: NUMCAT_MC.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatLU = 512;
  var nullrule = {
      category: gencatLU, 
      unicodeCat: NUMCAT_CN.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var rule105 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -60 | 0, 
      titledist: 0
  };
  var rule107 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -7 | 0, 
      titledist: 0
  };
  var rule108 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 80, 
      titledist: 0
  };
  var rule110 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 15, 
      titledist: 0
  };
  var rule112 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 48, 
      titledist: 0
  };
  var rule115 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 7264, 
      titledist: 0
  };
  var rule120 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -7615 | 0, 
      titledist: 0
  };
  var rule122 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -8 | 0, 
      titledist: 0
  };
  var rule131 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -74 | 0, 
      titledist: 0
  };
  var rule134 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -86 | 0, 
      titledist: 0
  };
  var rule135 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -100 | 0, 
      titledist: 0
  };
  var rule136 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -112 | 0, 
      titledist: 0
  };
  var rule137 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -128 | 0, 
      titledist: 0
  };
  var rule138 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -126 | 0, 
      titledist: 0
  };
  var rule141 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -7517 | 0, 
      titledist: 0
  };
  var rule142 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -8383 | 0, 
      titledist: 0
  };
  var rule143 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -8262 | 0, 
      titledist: 0
  };
  var rule144 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 28, 
      titledist: 0
  };
  var rule150 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -10743 | 0, 
      titledist: 0
  };
  var rule151 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -3814 | 0, 
      titledist: 0
  };
  var rule152 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -10727 | 0, 
      titledist: 0
  };
  var rule155 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -10780 | 0, 
      titledist: 0
  };
  var rule156 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -10749 | 0, 
      titledist: 0
  };
  var rule157 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -10783 | 0, 
      titledist: 0
  };
  var rule158 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -10782 | 0, 
      titledist: 0
  };
  var rule159 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -10815 | 0, 
      titledist: 0
  };
  var rule161 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -35332 | 0, 
      titledist: 0
  };
  var rule162 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -42280 | 0, 
      titledist: 0
  };
  var rule165 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 40, 
      titledist: 0
  };
  var rule21 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 1, 
      titledist: 0
  };
  var rule23 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -199 | 0, 
      titledist: 0
  };
  var rule25 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -121 | 0, 
      titledist: 0
  };
  var rule28 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 210, 
      titledist: 0
  };
  var rule29 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 206, 
      titledist: 0
  };
  var rule30 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 205, 
      titledist: 0
  };
  var rule31 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 79, 
      titledist: 0
  };
  var rule32 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 202, 
      titledist: 0
  };
  var rule33 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 203, 
      titledist: 0
  };
  var rule34 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 207, 
      titledist: 0
  };
  var rule36 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 211, 
      titledist: 0
  };
  var rule37 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 209, 
      titledist: 0
  };
  var rule39 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 213, 
      titledist: 0
  };
  var rule41 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 214, 
      titledist: 0
  };
  var rule42 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 218, 
      titledist: 0
  };
  var rule43 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 217, 
      titledist: 0
  };
  var rule44 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 219, 
      titledist: 0
  };
  var rule47 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 2, 
      titledist: 1
  };
  var rule51 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -97 | 0, 
      titledist: 0
  };
  var rule52 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -56 | 0, 
      titledist: 0
  };
  var rule53 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -130 | 0, 
      titledist: 0
  };
  var rule54 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 10795, 
      titledist: 0
  };
  var rule55 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -163 | 0, 
      titledist: 0
  };
  var rule56 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 10792, 
      titledist: 0
  };
  var rule58 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -195 | 0, 
      titledist: 0
  };
  var rule59 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 69, 
      titledist: 0
  };
  var rule60 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 71, 
      titledist: 0
  };
  var rule86 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 38, 
      titledist: 0
  };
  var rule87 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 37, 
      titledist: 0
  };
  var rule88 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 64, 
      titledist: 0
  };
  var rule89 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 63, 
      titledist: 0
  };
  var rule9 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 32, 
      titledist: 0
  };
  var rule95 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 1, 
      updist: 0, 
      lowdist: 8, 
      titledist: 0
  };
  var rule98 = {
      category: gencatLU, 
      unicodeCat: NUMCAT_LU.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatLT = 524288;
  var rule129 = {
      category: gencatLT, 
      unicodeCat: NUMCAT_LT.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -8 | 0, 
      titledist: 0
  };
  var rule132 = {
      category: gencatLT, 
      unicodeCat: NUMCAT_LT.value, 
      possible: 1, 
      updist: 0, 
      lowdist: -9 | 0, 
      titledist: 0
  };
  var rule48 = {
      category: gencatLT, 
      unicodeCat: NUMCAT_LT.value, 
      possible: 1, 
      updist: -1 | 0, 
      lowdist: 1, 
      titledist: 0
  };
  var gencatLO = 262144;
  var rule45 = {
      category: gencatLO, 
      unicodeCat: NUMCAT_LO.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatLM = 1048576;
  var rule83 = {
      category: gencatLM, 
      unicodeCat: NUMCAT_LM.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatLL = 4096;
  var rule100 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -54 | 0, 
      lowdist: 0, 
      titledist: -54 | 0
  };
  var rule101 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -8 | 0, 
      lowdist: 0, 
      titledist: -8 | 0
  };
  var rule102 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -86 | 0, 
      lowdist: 0, 
      titledist: -86 | 0
  };
  var rule103 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -80 | 0, 
      lowdist: 0, 
      titledist: -80 | 0
  };
  var rule104 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 7, 
      lowdist: 0, 
      titledist: 7
  };
  var rule106 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -96 | 0, 
      lowdist: 0, 
      titledist: -96 | 0
  };
  var rule111 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -15 | 0, 
      lowdist: 0, 
      titledist: -15 | 0
  };
  var rule113 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -48 | 0, 
      lowdist: 0, 
      titledist: -48 | 0
  };
  var rule117 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 35332, 
      lowdist: 0, 
      titledist: 35332
  };
  var rule118 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 3814, 
      lowdist: 0, 
      titledist: 3814
  };
  var rule119 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -59 | 0, 
      lowdist: 0, 
      titledist: -59 | 0
  };
  var rule12 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -32 | 0, 
      lowdist: 0, 
      titledist: -32 | 0
  };
  var rule121 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 8, 
      lowdist: 0, 
      titledist: 8
  };
  var rule123 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 74, 
      lowdist: 0, 
      titledist: 74
  };
  var rule124 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 86, 
      lowdist: 0, 
      titledist: 86
  };
  var rule125 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 100, 
      lowdist: 0, 
      titledist: 100
  };
  var rule126 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 128, 
      lowdist: 0, 
      titledist: 128
  };
  var rule127 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 112, 
      lowdist: 0, 
      titledist: 112
  };
  var rule128 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 126, 
      lowdist: 0, 
      titledist: 126
  };
  var rule130 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 9, 
      lowdist: 0, 
      titledist: 9
  };
  var rule133 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -7205 | 0, 
      lowdist: 0, 
      titledist: -7205 | 0
  };
  var rule14 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var rule145 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -28 | 0, 
      lowdist: 0, 
      titledist: -28 | 0
  };
  var rule153 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -10795 | 0, 
      lowdist: 0, 
      titledist: -10795 | 0
  };
  var rule154 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -10792 | 0, 
      lowdist: 0, 
      titledist: -10792 | 0
  };
  var rule160 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -7264 | 0, 
      lowdist: 0, 
      titledist: -7264 | 0
  };
  var rule166 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -40 | 0, 
      lowdist: 0, 
      titledist: -40 | 0
  };
  var rule18 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 743, 
      lowdist: 0, 
      titledist: 743
  };
  var rule20 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 121, 
      lowdist: 0, 
      titledist: 121
  };
  var rule22 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -1 | 0, 
      lowdist: 0, 
      titledist: -1 | 0
  };
  var rule24 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -232 | 0, 
      lowdist: 0, 
      titledist: -232 | 0
  };
  var rule26 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -300 | 0, 
      lowdist: 0, 
      titledist: -300 | 0
  };
  var rule27 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 195, 
      lowdist: 0, 
      titledist: 195
  };
  var rule35 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 97, 
      lowdist: 0, 
      titledist: 97
  };
  var rule38 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 163, 
      lowdist: 0, 
      titledist: 163
  };
  var rule40 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 130, 
      lowdist: 0, 
      titledist: 130
  };
  var rule46 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 56, 
      lowdist: 0, 
      titledist: 56
  };
  var rule49 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -2 | 0, 
      lowdist: 0, 
      titledist: -1 | 0
  };
  var rule50 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -79 | 0, 
      lowdist: 0, 
      titledist: -79 | 0
  };
  var rule57 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 10815, 
      lowdist: 0, 
      titledist: 10815
  };
  var rule61 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 10783, 
      lowdist: 0, 
      titledist: 10783
  };
  var rule62 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 10780, 
      lowdist: 0, 
      titledist: 10780
  };
  var rule63 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 10782, 
      lowdist: 0, 
      titledist: 10782
  };
  var rule64 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -210 | 0, 
      lowdist: 0, 
      titledist: -210 | 0
  };
  var rule65 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -206 | 0, 
      lowdist: 0, 
      titledist: -206 | 0
  };
  var rule66 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -205 | 0, 
      lowdist: 0, 
      titledist: -205 | 0
  };
  var rule67 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -202 | 0, 
      lowdist: 0, 
      titledist: -202 | 0
  };
  var rule68 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -203 | 0, 
      lowdist: 0, 
      titledist: -203 | 0
  };
  var rule69 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -207 | 0, 
      lowdist: 0, 
      titledist: -207 | 0
  };
  var rule70 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 42280, 
      lowdist: 0, 
      titledist: 42280
  };
  var rule71 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -209 | 0, 
      lowdist: 0, 
      titledist: -209 | 0
  };
  var rule72 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -211 | 0, 
      lowdist: 0, 
      titledist: -211 | 0
  };
  var rule73 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 10743, 
      lowdist: 0, 
      titledist: 10743
  };
  var rule74 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 10749, 
      lowdist: 0, 
      titledist: 10749
  };
  var rule75 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -213 | 0, 
      lowdist: 0, 
      titledist: -213 | 0
  };
  var rule76 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -214 | 0, 
      lowdist: 0, 
      titledist: -214 | 0
  };
  var rule77 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: 10727, 
      lowdist: 0, 
      titledist: 10727
  };
  var rule78 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -218 | 0, 
      lowdist: 0, 
      titledist: -218 | 0
  };
  var rule79 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -69 | 0, 
      lowdist: 0, 
      titledist: -69 | 0
  };
  var rule80 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -217 | 0, 
      lowdist: 0, 
      titledist: -217 | 0
  };
  var rule81 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -71 | 0, 
      lowdist: 0, 
      titledist: -71 | 0
  };
  var rule82 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -219 | 0, 
      lowdist: 0, 
      titledist: -219 | 0
  };
  var rule90 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -38 | 0, 
      lowdist: 0, 
      titledist: -38 | 0
  };
  var rule91 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -37 | 0, 
      lowdist: 0, 
      titledist: -37 | 0
  };
  var rule92 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -31 | 0, 
      lowdist: 0, 
      titledist: -31 | 0
  };
  var rule93 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -64 | 0, 
      lowdist: 0, 
      titledist: -64 | 0
  };
  var rule94 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -63 | 0, 
      lowdist: 0, 
      titledist: -63 | 0
  };
  var rule96 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -62 | 0, 
      lowdist: 0, 
      titledist: -62 | 0
  };
  var rule97 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -57 | 0, 
      lowdist: 0, 
      titledist: -57 | 0
  };
  var rule99 = {
      category: gencatLL, 
      unicodeCat: NUMCAT_LL.value, 
      possible: 1, 
      updist: -47 | 0, 
      lowdist: 0, 
      titledist: -47 | 0
  };
  var gencatCS = 134217728;
  var rule163 = {
      category: gencatCS, 
      unicodeCat: NUMCAT_CS.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatCO = 268435456;
  var rule164 = {
      category: gencatCO, 
      unicodeCat: NUMCAT_CO.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatCF = 32768;
  var rule16 = {
      category: gencatCF, 
      unicodeCat: NUMCAT_CF.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var gencatCC = 1;
  var rule0 = {
      category: gencatCC, 
      unicodeCat: NUMCAT_CC.value, 
      possible: 0, 
      updist: 0, 
      lowdist: 0, 
      titledist: 0
  };
  var convchars = [ {
      start: 65, 
      length: 26, 
      convRule: rule9
  }, {
      start: 97, 
      length: 26, 
      convRule: rule12
  }, {
      start: 181, 
      length: 1, 
      convRule: rule18
  }, {
      start: 192, 
      length: 23, 
      convRule: rule9
  }, {
      start: 216, 
      length: 7, 
      convRule: rule9
  }, {
      start: 224, 
      length: 23, 
      convRule: rule12
  }, {
      start: 248, 
      length: 7, 
      convRule: rule12
  }, {
      start: 255, 
      length: 1, 
      convRule: rule20
  }, {
      start: 256, 
      length: 1, 
      convRule: rule21
  }, {
      start: 257, 
      length: 1, 
      convRule: rule22
  }, {
      start: 258, 
      length: 1, 
      convRule: rule21
  }, {
      start: 259, 
      length: 1, 
      convRule: rule22
  }, {
      start: 260, 
      length: 1, 
      convRule: rule21
  }, {
      start: 261, 
      length: 1, 
      convRule: rule22
  }, {
      start: 262, 
      length: 1, 
      convRule: rule21
  }, {
      start: 263, 
      length: 1, 
      convRule: rule22
  }, {
      start: 264, 
      length: 1, 
      convRule: rule21
  }, {
      start: 265, 
      length: 1, 
      convRule: rule22
  }, {
      start: 266, 
      length: 1, 
      convRule: rule21
  }, {
      start: 267, 
      length: 1, 
      convRule: rule22
  }, {
      start: 268, 
      length: 1, 
      convRule: rule21
  }, {
      start: 269, 
      length: 1, 
      convRule: rule22
  }, {
      start: 270, 
      length: 1, 
      convRule: rule21
  }, {
      start: 271, 
      length: 1, 
      convRule: rule22
  }, {
      start: 272, 
      length: 1, 
      convRule: rule21
  }, {
      start: 273, 
      length: 1, 
      convRule: rule22
  }, {
      start: 274, 
      length: 1, 
      convRule: rule21
  }, {
      start: 275, 
      length: 1, 
      convRule: rule22
  }, {
      start: 276, 
      length: 1, 
      convRule: rule21
  }, {
      start: 277, 
      length: 1, 
      convRule: rule22
  }, {
      start: 278, 
      length: 1, 
      convRule: rule21
  }, {
      start: 279, 
      length: 1, 
      convRule: rule22
  }, {
      start: 280, 
      length: 1, 
      convRule: rule21
  }, {
      start: 281, 
      length: 1, 
      convRule: rule22
  }, {
      start: 282, 
      length: 1, 
      convRule: rule21
  }, {
      start: 283, 
      length: 1, 
      convRule: rule22
  }, {
      start: 284, 
      length: 1, 
      convRule: rule21
  }, {
      start: 285, 
      length: 1, 
      convRule: rule22
  }, {
      start: 286, 
      length: 1, 
      convRule: rule21
  }, {
      start: 287, 
      length: 1, 
      convRule: rule22
  }, {
      start: 288, 
      length: 1, 
      convRule: rule21
  }, {
      start: 289, 
      length: 1, 
      convRule: rule22
  }, {
      start: 290, 
      length: 1, 
      convRule: rule21
  }, {
      start: 291, 
      length: 1, 
      convRule: rule22
  }, {
      start: 292, 
      length: 1, 
      convRule: rule21
  }, {
      start: 293, 
      length: 1, 
      convRule: rule22
  }, {
      start: 294, 
      length: 1, 
      convRule: rule21
  }, {
      start: 295, 
      length: 1, 
      convRule: rule22
  }, {
      start: 296, 
      length: 1, 
      convRule: rule21
  }, {
      start: 297, 
      length: 1, 
      convRule: rule22
  }, {
      start: 298, 
      length: 1, 
      convRule: rule21
  }, {
      start: 299, 
      length: 1, 
      convRule: rule22
  }, {
      start: 300, 
      length: 1, 
      convRule: rule21
  }, {
      start: 301, 
      length: 1, 
      convRule: rule22
  }, {
      start: 302, 
      length: 1, 
      convRule: rule21
  }, {
      start: 303, 
      length: 1, 
      convRule: rule22
  }, {
      start: 304, 
      length: 1, 
      convRule: rule23
  }, {
      start: 305, 
      length: 1, 
      convRule: rule24
  }, {
      start: 306, 
      length: 1, 
      convRule: rule21
  }, {
      start: 307, 
      length: 1, 
      convRule: rule22
  }, {
      start: 308, 
      length: 1, 
      convRule: rule21
  }, {
      start: 309, 
      length: 1, 
      convRule: rule22
  }, {
      start: 310, 
      length: 1, 
      convRule: rule21
  }, {
      start: 311, 
      length: 1, 
      convRule: rule22
  }, {
      start: 313, 
      length: 1, 
      convRule: rule21
  }, {
      start: 314, 
      length: 1, 
      convRule: rule22
  }, {
      start: 315, 
      length: 1, 
      convRule: rule21
  }, {
      start: 316, 
      length: 1, 
      convRule: rule22
  }, {
      start: 317, 
      length: 1, 
      convRule: rule21
  }, {
      start: 318, 
      length: 1, 
      convRule: rule22
  }, {
      start: 319, 
      length: 1, 
      convRule: rule21
  }, {
      start: 320, 
      length: 1, 
      convRule: rule22
  }, {
      start: 321, 
      length: 1, 
      convRule: rule21
  }, {
      start: 322, 
      length: 1, 
      convRule: rule22
  }, {
      start: 323, 
      length: 1, 
      convRule: rule21
  }, {
      start: 324, 
      length: 1, 
      convRule: rule22
  }, {
      start: 325, 
      length: 1, 
      convRule: rule21
  }, {
      start: 326, 
      length: 1, 
      convRule: rule22
  }, {
      start: 327, 
      length: 1, 
      convRule: rule21
  }, {
      start: 328, 
      length: 1, 
      convRule: rule22
  }, {
      start: 330, 
      length: 1, 
      convRule: rule21
  }, {
      start: 331, 
      length: 1, 
      convRule: rule22
  }, {
      start: 332, 
      length: 1, 
      convRule: rule21
  }, {
      start: 333, 
      length: 1, 
      convRule: rule22
  }, {
      start: 334, 
      length: 1, 
      convRule: rule21
  }, {
      start: 335, 
      length: 1, 
      convRule: rule22
  }, {
      start: 336, 
      length: 1, 
      convRule: rule21
  }, {
      start: 337, 
      length: 1, 
      convRule: rule22
  }, {
      start: 338, 
      length: 1, 
      convRule: rule21
  }, {
      start: 339, 
      length: 1, 
      convRule: rule22
  }, {
      start: 340, 
      length: 1, 
      convRule: rule21
  }, {
      start: 341, 
      length: 1, 
      convRule: rule22
  }, {
      start: 342, 
      length: 1, 
      convRule: rule21
  }, {
      start: 343, 
      length: 1, 
      convRule: rule22
  }, {
      start: 344, 
      length: 1, 
      convRule: rule21
  }, {
      start: 345, 
      length: 1, 
      convRule: rule22
  }, {
      start: 346, 
      length: 1, 
      convRule: rule21
  }, {
      start: 347, 
      length: 1, 
      convRule: rule22
  }, {
      start: 348, 
      length: 1, 
      convRule: rule21
  }, {
      start: 349, 
      length: 1, 
      convRule: rule22
  }, {
      start: 350, 
      length: 1, 
      convRule: rule21
  }, {
      start: 351, 
      length: 1, 
      convRule: rule22
  }, {
      start: 352, 
      length: 1, 
      convRule: rule21
  }, {
      start: 353, 
      length: 1, 
      convRule: rule22
  }, {
      start: 354, 
      length: 1, 
      convRule: rule21
  }, {
      start: 355, 
      length: 1, 
      convRule: rule22
  }, {
      start: 356, 
      length: 1, 
      convRule: rule21
  }, {
      start: 357, 
      length: 1, 
      convRule: rule22
  }, {
      start: 358, 
      length: 1, 
      convRule: rule21
  }, {
      start: 359, 
      length: 1, 
      convRule: rule22
  }, {
      start: 360, 
      length: 1, 
      convRule: rule21
  }, {
      start: 361, 
      length: 1, 
      convRule: rule22
  }, {
      start: 362, 
      length: 1, 
      convRule: rule21
  }, {
      start: 363, 
      length: 1, 
      convRule: rule22
  }, {
      start: 364, 
      length: 1, 
      convRule: rule21
  }, {
      start: 365, 
      length: 1, 
      convRule: rule22
  }, {
      start: 366, 
      length: 1, 
      convRule: rule21
  }, {
      start: 367, 
      length: 1, 
      convRule: rule22
  }, {
      start: 368, 
      length: 1, 
      convRule: rule21
  }, {
      start: 369, 
      length: 1, 
      convRule: rule22
  }, {
      start: 370, 
      length: 1, 
      convRule: rule21
  }, {
      start: 371, 
      length: 1, 
      convRule: rule22
  }, {
      start: 372, 
      length: 1, 
      convRule: rule21
  }, {
      start: 373, 
      length: 1, 
      convRule: rule22
  }, {
      start: 374, 
      length: 1, 
      convRule: rule21
  }, {
      start: 375, 
      length: 1, 
      convRule: rule22
  }, {
      start: 376, 
      length: 1, 
      convRule: rule25
  }, {
      start: 377, 
      length: 1, 
      convRule: rule21
  }, {
      start: 378, 
      length: 1, 
      convRule: rule22
  }, {
      start: 379, 
      length: 1, 
      convRule: rule21
  }, {
      start: 380, 
      length: 1, 
      convRule: rule22
  }, {
      start: 381, 
      length: 1, 
      convRule: rule21
  }, {
      start: 382, 
      length: 1, 
      convRule: rule22
  }, {
      start: 383, 
      length: 1, 
      convRule: rule26
  }, {
      start: 384, 
      length: 1, 
      convRule: rule27
  }, {
      start: 385, 
      length: 1, 
      convRule: rule28
  }, {
      start: 386, 
      length: 1, 
      convRule: rule21
  }, {
      start: 387, 
      length: 1, 
      convRule: rule22
  }, {
      start: 388, 
      length: 1, 
      convRule: rule21
  }, {
      start: 389, 
      length: 1, 
      convRule: rule22
  }, {
      start: 390, 
      length: 1, 
      convRule: rule29
  }, {
      start: 391, 
      length: 1, 
      convRule: rule21
  }, {
      start: 392, 
      length: 1, 
      convRule: rule22
  }, {
      start: 393, 
      length: 2, 
      convRule: rule30
  }, {
      start: 395, 
      length: 1, 
      convRule: rule21
  }, {
      start: 396, 
      length: 1, 
      convRule: rule22
  }, {
      start: 398, 
      length: 1, 
      convRule: rule31
  }, {
      start: 399, 
      length: 1, 
      convRule: rule32
  }, {
      start: 400, 
      length: 1, 
      convRule: rule33
  }, {
      start: 401, 
      length: 1, 
      convRule: rule21
  }, {
      start: 402, 
      length: 1, 
      convRule: rule22
  }, {
      start: 403, 
      length: 1, 
      convRule: rule30
  }, {
      start: 404, 
      length: 1, 
      convRule: rule34
  }, {
      start: 405, 
      length: 1, 
      convRule: rule35
  }, {
      start: 406, 
      length: 1, 
      convRule: rule36
  }, {
      start: 407, 
      length: 1, 
      convRule: rule37
  }, {
      start: 408, 
      length: 1, 
      convRule: rule21
  }, {
      start: 409, 
      length: 1, 
      convRule: rule22
  }, {
      start: 410, 
      length: 1, 
      convRule: rule38
  }, {
      start: 412, 
      length: 1, 
      convRule: rule36
  }, {
      start: 413, 
      length: 1, 
      convRule: rule39
  }, {
      start: 414, 
      length: 1, 
      convRule: rule40
  }, {
      start: 415, 
      length: 1, 
      convRule: rule41
  }, {
      start: 416, 
      length: 1, 
      convRule: rule21
  }, {
      start: 417, 
      length: 1, 
      convRule: rule22
  }, {
      start: 418, 
      length: 1, 
      convRule: rule21
  }, {
      start: 419, 
      length: 1, 
      convRule: rule22
  }, {
      start: 420, 
      length: 1, 
      convRule: rule21
  }, {
      start: 421, 
      length: 1, 
      convRule: rule22
  }, {
      start: 422, 
      length: 1, 
      convRule: rule42
  }, {
      start: 423, 
      length: 1, 
      convRule: rule21
  }, {
      start: 424, 
      length: 1, 
      convRule: rule22
  }, {
      start: 425, 
      length: 1, 
      convRule: rule42
  }, {
      start: 428, 
      length: 1, 
      convRule: rule21
  }, {
      start: 429, 
      length: 1, 
      convRule: rule22
  }, {
      start: 430, 
      length: 1, 
      convRule: rule42
  }, {
      start: 431, 
      length: 1, 
      convRule: rule21
  }, {
      start: 432, 
      length: 1, 
      convRule: rule22
  }, {
      start: 433, 
      length: 2, 
      convRule: rule43
  }, {
      start: 435, 
      length: 1, 
      convRule: rule21
  }, {
      start: 436, 
      length: 1, 
      convRule: rule22
  }, {
      start: 437, 
      length: 1, 
      convRule: rule21
  }, {
      start: 438, 
      length: 1, 
      convRule: rule22
  }, {
      start: 439, 
      length: 1, 
      convRule: rule44
  }, {
      start: 440, 
      length: 1, 
      convRule: rule21
  }, {
      start: 441, 
      length: 1, 
      convRule: rule22
  }, {
      start: 444, 
      length: 1, 
      convRule: rule21
  }, {
      start: 445, 
      length: 1, 
      convRule: rule22
  }, {
      start: 447, 
      length: 1, 
      convRule: rule46
  }, {
      start: 452, 
      length: 1, 
      convRule: rule47
  }, {
      start: 453, 
      length: 1, 
      convRule: rule48
  }, {
      start: 454, 
      length: 1, 
      convRule: rule49
  }, {
      start: 455, 
      length: 1, 
      convRule: rule47
  }, {
      start: 456, 
      length: 1, 
      convRule: rule48
  }, {
      start: 457, 
      length: 1, 
      convRule: rule49
  }, {
      start: 458, 
      length: 1, 
      convRule: rule47
  }, {
      start: 459, 
      length: 1, 
      convRule: rule48
  }, {
      start: 460, 
      length: 1, 
      convRule: rule49
  }, {
      start: 461, 
      length: 1, 
      convRule: rule21
  }, {
      start: 462, 
      length: 1, 
      convRule: rule22
  }, {
      start: 463, 
      length: 1, 
      convRule: rule21
  }, {
      start: 464, 
      length: 1, 
      convRule: rule22
  }, {
      start: 465, 
      length: 1, 
      convRule: rule21
  }, {
      start: 466, 
      length: 1, 
      convRule: rule22
  }, {
      start: 467, 
      length: 1, 
      convRule: rule21
  }, {
      start: 468, 
      length: 1, 
      convRule: rule22
  }, {
      start: 469, 
      length: 1, 
      convRule: rule21
  }, {
      start: 470, 
      length: 1, 
      convRule: rule22
  }, {
      start: 471, 
      length: 1, 
      convRule: rule21
  }, {
      start: 472, 
      length: 1, 
      convRule: rule22
  }, {
      start: 473, 
      length: 1, 
      convRule: rule21
  }, {
      start: 474, 
      length: 1, 
      convRule: rule22
  }, {
      start: 475, 
      length: 1, 
      convRule: rule21
  }, {
      start: 476, 
      length: 1, 
      convRule: rule22
  }, {
      start: 477, 
      length: 1, 
      convRule: rule50
  }, {
      start: 478, 
      length: 1, 
      convRule: rule21
  }, {
      start: 479, 
      length: 1, 
      convRule: rule22
  }, {
      start: 480, 
      length: 1, 
      convRule: rule21
  }, {
      start: 481, 
      length: 1, 
      convRule: rule22
  }, {
      start: 482, 
      length: 1, 
      convRule: rule21
  }, {
      start: 483, 
      length: 1, 
      convRule: rule22
  }, {
      start: 484, 
      length: 1, 
      convRule: rule21
  }, {
      start: 485, 
      length: 1, 
      convRule: rule22
  }, {
      start: 486, 
      length: 1, 
      convRule: rule21
  }, {
      start: 487, 
      length: 1, 
      convRule: rule22
  }, {
      start: 488, 
      length: 1, 
      convRule: rule21
  }, {
      start: 489, 
      length: 1, 
      convRule: rule22
  }, {
      start: 490, 
      length: 1, 
      convRule: rule21
  }, {
      start: 491, 
      length: 1, 
      convRule: rule22
  }, {
      start: 492, 
      length: 1, 
      convRule: rule21
  }, {
      start: 493, 
      length: 1, 
      convRule: rule22
  }, {
      start: 494, 
      length: 1, 
      convRule: rule21
  }, {
      start: 495, 
      length: 1, 
      convRule: rule22
  }, {
      start: 497, 
      length: 1, 
      convRule: rule47
  }, {
      start: 498, 
      length: 1, 
      convRule: rule48
  }, {
      start: 499, 
      length: 1, 
      convRule: rule49
  }, {
      start: 500, 
      length: 1, 
      convRule: rule21
  }, {
      start: 501, 
      length: 1, 
      convRule: rule22
  }, {
      start: 502, 
      length: 1, 
      convRule: rule51
  }, {
      start: 503, 
      length: 1, 
      convRule: rule52
  }, {
      start: 504, 
      length: 1, 
      convRule: rule21
  }, {
      start: 505, 
      length: 1, 
      convRule: rule22
  }, {
      start: 506, 
      length: 1, 
      convRule: rule21
  }, {
      start: 507, 
      length: 1, 
      convRule: rule22
  }, {
      start: 508, 
      length: 1, 
      convRule: rule21
  }, {
      start: 509, 
      length: 1, 
      convRule: rule22
  }, {
      start: 510, 
      length: 1, 
      convRule: rule21
  }, {
      start: 511, 
      length: 1, 
      convRule: rule22
  }, {
      start: 512, 
      length: 1, 
      convRule: rule21
  }, {
      start: 513, 
      length: 1, 
      convRule: rule22
  }, {
      start: 514, 
      length: 1, 
      convRule: rule21
  }, {
      start: 515, 
      length: 1, 
      convRule: rule22
  }, {
      start: 516, 
      length: 1, 
      convRule: rule21
  }, {
      start: 517, 
      length: 1, 
      convRule: rule22
  }, {
      start: 518, 
      length: 1, 
      convRule: rule21
  }, {
      start: 519, 
      length: 1, 
      convRule: rule22
  }, {
      start: 520, 
      length: 1, 
      convRule: rule21
  }, {
      start: 521, 
      length: 1, 
      convRule: rule22
  }, {
      start: 522, 
      length: 1, 
      convRule: rule21
  }, {
      start: 523, 
      length: 1, 
      convRule: rule22
  }, {
      start: 524, 
      length: 1, 
      convRule: rule21
  }, {
      start: 525, 
      length: 1, 
      convRule: rule22
  }, {
      start: 526, 
      length: 1, 
      convRule: rule21
  }, {
      start: 527, 
      length: 1, 
      convRule: rule22
  }, {
      start: 528, 
      length: 1, 
      convRule: rule21
  }, {
      start: 529, 
      length: 1, 
      convRule: rule22
  }, {
      start: 530, 
      length: 1, 
      convRule: rule21
  }, {
      start: 531, 
      length: 1, 
      convRule: rule22
  }, {
      start: 532, 
      length: 1, 
      convRule: rule21
  }, {
      start: 533, 
      length: 1, 
      convRule: rule22
  }, {
      start: 534, 
      length: 1, 
      convRule: rule21
  }, {
      start: 535, 
      length: 1, 
      convRule: rule22
  }, {
      start: 536, 
      length: 1, 
      convRule: rule21
  }, {
      start: 537, 
      length: 1, 
      convRule: rule22
  }, {
      start: 538, 
      length: 1, 
      convRule: rule21
  }, {
      start: 539, 
      length: 1, 
      convRule: rule22
  }, {
      start: 540, 
      length: 1, 
      convRule: rule21
  }, {
      start: 541, 
      length: 1, 
      convRule: rule22
  }, {
      start: 542, 
      length: 1, 
      convRule: rule21
  }, {
      start: 543, 
      length: 1, 
      convRule: rule22
  }, {
      start: 544, 
      length: 1, 
      convRule: rule53
  }, {
      start: 546, 
      length: 1, 
      convRule: rule21
  }, {
      start: 547, 
      length: 1, 
      convRule: rule22
  }, {
      start: 548, 
      length: 1, 
      convRule: rule21
  }, {
      start: 549, 
      length: 1, 
      convRule: rule22
  }, {
      start: 550, 
      length: 1, 
      convRule: rule21
  }, {
      start: 551, 
      length: 1, 
      convRule: rule22
  }, {
      start: 552, 
      length: 1, 
      convRule: rule21
  }, {
      start: 553, 
      length: 1, 
      convRule: rule22
  }, {
      start: 554, 
      length: 1, 
      convRule: rule21
  }, {
      start: 555, 
      length: 1, 
      convRule: rule22
  }, {
      start: 556, 
      length: 1, 
      convRule: rule21
  }, {
      start: 557, 
      length: 1, 
      convRule: rule22
  }, {
      start: 558, 
      length: 1, 
      convRule: rule21
  }, {
      start: 559, 
      length: 1, 
      convRule: rule22
  }, {
      start: 560, 
      length: 1, 
      convRule: rule21
  }, {
      start: 561, 
      length: 1, 
      convRule: rule22
  }, {
      start: 562, 
      length: 1, 
      convRule: rule21
  }, {
      start: 563, 
      length: 1, 
      convRule: rule22
  }, {
      start: 570, 
      length: 1, 
      convRule: rule54
  }, {
      start: 571, 
      length: 1, 
      convRule: rule21
  }, {
      start: 572, 
      length: 1, 
      convRule: rule22
  }, {
      start: 573, 
      length: 1, 
      convRule: rule55
  }, {
      start: 574, 
      length: 1, 
      convRule: rule56
  }, {
      start: 575, 
      length: 2, 
      convRule: rule57
  }, {
      start: 577, 
      length: 1, 
      convRule: rule21
  }, {
      start: 578, 
      length: 1, 
      convRule: rule22
  }, {
      start: 579, 
      length: 1, 
      convRule: rule58
  }, {
      start: 580, 
      length: 1, 
      convRule: rule59
  }, {
      start: 581, 
      length: 1, 
      convRule: rule60
  }, {
      start: 582, 
      length: 1, 
      convRule: rule21
  }, {
      start: 583, 
      length: 1, 
      convRule: rule22
  }, {
      start: 584, 
      length: 1, 
      convRule: rule21
  }, {
      start: 585, 
      length: 1, 
      convRule: rule22
  }, {
      start: 586, 
      length: 1, 
      convRule: rule21
  }, {
      start: 587, 
      length: 1, 
      convRule: rule22
  }, {
      start: 588, 
      length: 1, 
      convRule: rule21
  }, {
      start: 589, 
      length: 1, 
      convRule: rule22
  }, {
      start: 590, 
      length: 1, 
      convRule: rule21
  }, {
      start: 591, 
      length: 1, 
      convRule: rule22
  }, {
      start: 592, 
      length: 1, 
      convRule: rule61
  }, {
      start: 593, 
      length: 1, 
      convRule: rule62
  }, {
      start: 594, 
      length: 1, 
      convRule: rule63
  }, {
      start: 595, 
      length: 1, 
      convRule: rule64
  }, {
      start: 596, 
      length: 1, 
      convRule: rule65
  }, {
      start: 598, 
      length: 2, 
      convRule: rule66
  }, {
      start: 601, 
      length: 1, 
      convRule: rule67
  }, {
      start: 603, 
      length: 1, 
      convRule: rule68
  }, {
      start: 608, 
      length: 1, 
      convRule: rule66
  }, {
      start: 611, 
      length: 1, 
      convRule: rule69
  }, {
      start: 613, 
      length: 1, 
      convRule: rule70
  }, {
      start: 616, 
      length: 1, 
      convRule: rule71
  }, {
      start: 617, 
      length: 1, 
      convRule: rule72
  }, {
      start: 619, 
      length: 1, 
      convRule: rule73
  }, {
      start: 623, 
      length: 1, 
      convRule: rule72
  }, {
      start: 625, 
      length: 1, 
      convRule: rule74
  }, {
      start: 626, 
      length: 1, 
      convRule: rule75
  }, {
      start: 629, 
      length: 1, 
      convRule: rule76
  }, {
      start: 637, 
      length: 1, 
      convRule: rule77
  }, {
      start: 640, 
      length: 1, 
      convRule: rule78
  }, {
      start: 643, 
      length: 1, 
      convRule: rule78
  }, {
      start: 648, 
      length: 1, 
      convRule: rule78
  }, {
      start: 649, 
      length: 1, 
      convRule: rule79
  }, {
      start: 650, 
      length: 2, 
      convRule: rule80
  }, {
      start: 652, 
      length: 1, 
      convRule: rule81
  }, {
      start: 658, 
      length: 1, 
      convRule: rule82
  }, {
      start: 837, 
      length: 1, 
      convRule: rule85
  }, {
      start: 880, 
      length: 1, 
      convRule: rule21
  }, {
      start: 881, 
      length: 1, 
      convRule: rule22
  }, {
      start: 882, 
      length: 1, 
      convRule: rule21
  }, {
      start: 883, 
      length: 1, 
      convRule: rule22
  }, {
      start: 886, 
      length: 1, 
      convRule: rule21
  }, {
      start: 887, 
      length: 1, 
      convRule: rule22
  }, {
      start: 891, 
      length: 3, 
      convRule: rule40
  }, {
      start: 902, 
      length: 1, 
      convRule: rule86
  }, {
      start: 904, 
      length: 3, 
      convRule: rule87
  }, {
      start: 908, 
      length: 1, 
      convRule: rule88
  }, {
      start: 910, 
      length: 2, 
      convRule: rule89
  }, {
      start: 913, 
      length: 17, 
      convRule: rule9
  }, {
      start: 931, 
      length: 9, 
      convRule: rule9
  }, {
      start: 940, 
      length: 1, 
      convRule: rule90
  }, {
      start: 941, 
      length: 3, 
      convRule: rule91
  }, {
      start: 945, 
      length: 17, 
      convRule: rule12
  }, {
      start: 962, 
      length: 1, 
      convRule: rule92
  }, {
      start: 963, 
      length: 9, 
      convRule: rule12
  }, {
      start: 972, 
      length: 1, 
      convRule: rule93
  }, {
      start: 973, 
      length: 2, 
      convRule: rule94
  }, {
      start: 975, 
      length: 1, 
      convRule: rule95
  }, {
      start: 976, 
      length: 1, 
      convRule: rule96
  }, {
      start: 977, 
      length: 1, 
      convRule: rule97
  }, {
      start: 981, 
      length: 1, 
      convRule: rule99
  }, {
      start: 982, 
      length: 1, 
      convRule: rule100
  }, {
      start: 983, 
      length: 1, 
      convRule: rule101
  }, {
      start: 984, 
      length: 1, 
      convRule: rule21
  }, {
      start: 985, 
      length: 1, 
      convRule: rule22
  }, {
      start: 986, 
      length: 1, 
      convRule: rule21
  }, {
      start: 987, 
      length: 1, 
      convRule: rule22
  }, {
      start: 988, 
      length: 1, 
      convRule: rule21
  }, {
      start: 989, 
      length: 1, 
      convRule: rule22
  }, {
      start: 990, 
      length: 1, 
      convRule: rule21
  }, {
      start: 991, 
      length: 1, 
      convRule: rule22
  }, {
      start: 992, 
      length: 1, 
      convRule: rule21
  }, {
      start: 993, 
      length: 1, 
      convRule: rule22
  }, {
      start: 994, 
      length: 1, 
      convRule: rule21
  }, {
      start: 995, 
      length: 1, 
      convRule: rule22
  }, {
      start: 996, 
      length: 1, 
      convRule: rule21
  }, {
      start: 997, 
      length: 1, 
      convRule: rule22
  }, {
      start: 998, 
      length: 1, 
      convRule: rule21
  }, {
      start: 999, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1000, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1001, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1002, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1003, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1004, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1005, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1006, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1007, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1008, 
      length: 1, 
      convRule: rule102
  }, {
      start: 1009, 
      length: 1, 
      convRule: rule103
  }, {
      start: 1010, 
      length: 1, 
      convRule: rule104
  }, {
      start: 1012, 
      length: 1, 
      convRule: rule105
  }, {
      start: 1013, 
      length: 1, 
      convRule: rule106
  }, {
      start: 1015, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1016, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1017, 
      length: 1, 
      convRule: rule107
  }, {
      start: 1018, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1019, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1021, 
      length: 3, 
      convRule: rule53
  }, {
      start: 1024, 
      length: 16, 
      convRule: rule108
  }, {
      start: 1040, 
      length: 32, 
      convRule: rule9
  }, {
      start: 1072, 
      length: 32, 
      convRule: rule12
  }, {
      start: 1104, 
      length: 16, 
      convRule: rule103
  }, {
      start: 1120, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1121, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1122, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1123, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1124, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1125, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1126, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1127, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1128, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1129, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1130, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1131, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1132, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1133, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1134, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1135, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1136, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1137, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1138, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1139, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1140, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1141, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1142, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1143, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1144, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1145, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1146, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1147, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1148, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1149, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1150, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1151, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1152, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1153, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1162, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1163, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1164, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1165, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1166, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1167, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1168, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1169, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1170, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1171, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1172, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1173, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1174, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1175, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1176, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1177, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1178, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1179, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1180, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1181, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1182, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1183, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1184, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1185, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1186, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1187, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1188, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1189, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1190, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1191, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1192, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1193, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1194, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1195, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1196, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1197, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1198, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1199, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1200, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1201, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1202, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1203, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1204, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1205, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1206, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1207, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1208, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1209, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1210, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1211, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1212, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1213, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1214, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1215, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1216, 
      length: 1, 
      convRule: rule110
  }, {
      start: 1217, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1218, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1219, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1220, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1221, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1222, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1223, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1224, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1225, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1226, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1227, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1228, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1229, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1230, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1231, 
      length: 1, 
      convRule: rule111
  }, {
      start: 1232, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1233, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1234, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1235, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1236, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1237, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1238, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1239, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1240, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1241, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1242, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1243, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1244, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1245, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1246, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1247, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1248, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1249, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1250, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1251, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1252, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1253, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1254, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1255, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1256, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1257, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1258, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1259, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1260, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1261, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1262, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1263, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1264, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1265, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1266, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1267, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1268, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1269, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1270, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1271, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1272, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1273, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1274, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1275, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1276, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1277, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1278, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1279, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1280, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1281, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1282, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1283, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1284, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1285, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1286, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1287, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1288, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1289, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1290, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1291, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1292, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1293, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1294, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1295, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1296, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1297, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1298, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1299, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1300, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1301, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1302, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1303, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1304, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1305, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1306, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1307, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1308, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1309, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1310, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1311, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1312, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1313, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1314, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1315, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1316, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1317, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1318, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1319, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1329, 
      length: 38, 
      convRule: rule112
  }, {
      start: 1377, 
      length: 38, 
      convRule: rule113
  }, {
      start: 4256, 
      length: 38, 
      convRule: rule115
  }, {
      start: 7545, 
      length: 1, 
      convRule: rule117
  }, {
      start: 7549, 
      length: 1, 
      convRule: rule118
  }, {
      start: 7680, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7681, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7682, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7683, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7684, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7685, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7686, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7687, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7688, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7689, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7690, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7691, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7692, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7693, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7694, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7695, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7696, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7697, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7698, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7699, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7700, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7701, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7702, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7703, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7704, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7705, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7706, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7707, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7708, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7709, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7710, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7711, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7712, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7713, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7714, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7715, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7716, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7717, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7718, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7719, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7720, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7721, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7722, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7723, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7724, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7725, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7726, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7727, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7728, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7729, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7730, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7731, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7732, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7733, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7734, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7735, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7736, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7737, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7738, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7739, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7740, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7741, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7742, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7743, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7744, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7745, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7746, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7747, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7748, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7749, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7750, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7751, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7752, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7753, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7754, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7755, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7756, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7757, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7758, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7759, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7760, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7761, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7762, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7763, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7764, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7765, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7766, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7767, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7768, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7769, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7770, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7771, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7772, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7773, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7774, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7775, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7776, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7777, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7778, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7779, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7780, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7781, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7782, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7783, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7784, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7785, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7786, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7787, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7788, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7789, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7790, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7791, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7792, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7793, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7794, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7795, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7796, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7797, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7798, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7799, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7800, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7801, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7802, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7803, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7804, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7805, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7806, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7807, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7808, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7809, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7810, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7811, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7812, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7813, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7814, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7815, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7816, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7817, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7818, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7819, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7820, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7821, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7822, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7823, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7824, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7825, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7826, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7827, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7828, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7829, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7835, 
      length: 1, 
      convRule: rule119
  }, {
      start: 7838, 
      length: 1, 
      convRule: rule120
  }, {
      start: 7840, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7841, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7842, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7843, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7844, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7845, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7846, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7847, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7848, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7849, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7850, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7851, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7852, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7853, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7854, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7855, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7856, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7857, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7858, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7859, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7860, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7861, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7862, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7863, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7864, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7865, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7866, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7867, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7868, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7869, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7870, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7871, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7872, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7873, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7874, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7875, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7876, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7877, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7878, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7879, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7880, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7881, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7882, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7883, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7884, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7885, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7886, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7887, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7888, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7889, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7890, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7891, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7892, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7893, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7894, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7895, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7896, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7897, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7898, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7899, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7900, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7901, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7902, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7903, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7904, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7905, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7906, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7907, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7908, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7909, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7910, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7911, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7912, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7913, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7914, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7915, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7916, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7917, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7918, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7919, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7920, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7921, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7922, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7923, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7924, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7925, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7926, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7927, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7928, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7929, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7930, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7931, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7932, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7933, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7934, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7935, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7936, 
      length: 8, 
      convRule: rule121
  }, {
      start: 7944, 
      length: 8, 
      convRule: rule122
  }, {
      start: 7952, 
      length: 6, 
      convRule: rule121
  }, {
      start: 7960, 
      length: 6, 
      convRule: rule122
  }, {
      start: 7968, 
      length: 8, 
      convRule: rule121
  }, {
      start: 7976, 
      length: 8, 
      convRule: rule122
  }, {
      start: 7984, 
      length: 8, 
      convRule: rule121
  }, {
      start: 7992, 
      length: 8, 
      convRule: rule122
  }, {
      start: 8000, 
      length: 6, 
      convRule: rule121
  }, {
      start: 8008, 
      length: 6, 
      convRule: rule122
  }, {
      start: 8017, 
      length: 1, 
      convRule: rule121
  }, {
      start: 8019, 
      length: 1, 
      convRule: rule121
  }, {
      start: 8021, 
      length: 1, 
      convRule: rule121
  }, {
      start: 8023, 
      length: 1, 
      convRule: rule121
  }, {
      start: 8025, 
      length: 1, 
      convRule: rule122
  }, {
      start: 8027, 
      length: 1, 
      convRule: rule122
  }, {
      start: 8029, 
      length: 1, 
      convRule: rule122
  }, {
      start: 8031, 
      length: 1, 
      convRule: rule122
  }, {
      start: 8032, 
      length: 8, 
      convRule: rule121
  }, {
      start: 8040, 
      length: 8, 
      convRule: rule122
  }, {
      start: 8048, 
      length: 2, 
      convRule: rule123
  }, {
      start: 8050, 
      length: 4, 
      convRule: rule124
  }, {
      start: 8054, 
      length: 2, 
      convRule: rule125
  }, {
      start: 8056, 
      length: 2, 
      convRule: rule126
  }, {
      start: 8058, 
      length: 2, 
      convRule: rule127
  }, {
      start: 8060, 
      length: 2, 
      convRule: rule128
  }, {
      start: 8064, 
      length: 8, 
      convRule: rule121
  }, {
      start: 8072, 
      length: 8, 
      convRule: rule129
  }, {
      start: 8080, 
      length: 8, 
      convRule: rule121
  }, {
      start: 8088, 
      length: 8, 
      convRule: rule129
  }, {
      start: 8096, 
      length: 8, 
      convRule: rule121
  }, {
      start: 8104, 
      length: 8, 
      convRule: rule129
  }, {
      start: 8112, 
      length: 2, 
      convRule: rule121
  }, {
      start: 8115, 
      length: 1, 
      convRule: rule130
  }, {
      start: 8120, 
      length: 2, 
      convRule: rule122
  }, {
      start: 8122, 
      length: 2, 
      convRule: rule131
  }, {
      start: 8124, 
      length: 1, 
      convRule: rule132
  }, {
      start: 8126, 
      length: 1, 
      convRule: rule133
  }, {
      start: 8131, 
      length: 1, 
      convRule: rule130
  }, {
      start: 8136, 
      length: 4, 
      convRule: rule134
  }, {
      start: 8140, 
      length: 1, 
      convRule: rule132
  }, {
      start: 8144, 
      length: 2, 
      convRule: rule121
  }, {
      start: 8152, 
      length: 2, 
      convRule: rule122
  }, {
      start: 8154, 
      length: 2, 
      convRule: rule135
  }, {
      start: 8160, 
      length: 2, 
      convRule: rule121
  }, {
      start: 8165, 
      length: 1, 
      convRule: rule104
  }, {
      start: 8168, 
      length: 2, 
      convRule: rule122
  }, {
      start: 8170, 
      length: 2, 
      convRule: rule136
  }, {
      start: 8172, 
      length: 1, 
      convRule: rule107
  }, {
      start: 8179, 
      length: 1, 
      convRule: rule130
  }, {
      start: 8184, 
      length: 2, 
      convRule: rule137
  }, {
      start: 8186, 
      length: 2, 
      convRule: rule138
  }, {
      start: 8188, 
      length: 1, 
      convRule: rule132
  }, {
      start: 8486, 
      length: 1, 
      convRule: rule141
  }, {
      start: 8490, 
      length: 1, 
      convRule: rule142
  }, {
      start: 8491, 
      length: 1, 
      convRule: rule143
  }, {
      start: 8498, 
      length: 1, 
      convRule: rule144
  }, {
      start: 8526, 
      length: 1, 
      convRule: rule145
  }, {
      start: 8544, 
      length: 16, 
      convRule: rule146
  }, {
      start: 8560, 
      length: 16, 
      convRule: rule147
  }, {
      start: 8579, 
      length: 1, 
      convRule: rule21
  }, {
      start: 8580, 
      length: 1, 
      convRule: rule22
  }, {
      start: 9398, 
      length: 26, 
      convRule: rule148
  }, {
      start: 9424, 
      length: 26, 
      convRule: rule149
  }, {
      start: 11264, 
      length: 47, 
      convRule: rule112
  }, {
      start: 11312, 
      length: 47, 
      convRule: rule113
  }, {
      start: 11360, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11361, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11362, 
      length: 1, 
      convRule: rule150
  }, {
      start: 11363, 
      length: 1, 
      convRule: rule151
  }, {
      start: 11364, 
      length: 1, 
      convRule: rule152
  }, {
      start: 11365, 
      length: 1, 
      convRule: rule153
  }, {
      start: 11366, 
      length: 1, 
      convRule: rule154
  }, {
      start: 11367, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11368, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11369, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11370, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11371, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11372, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11373, 
      length: 1, 
      convRule: rule155
  }, {
      start: 11374, 
      length: 1, 
      convRule: rule156
  }, {
      start: 11375, 
      length: 1, 
      convRule: rule157
  }, {
      start: 11376, 
      length: 1, 
      convRule: rule158
  }, {
      start: 11378, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11379, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11381, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11382, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11390, 
      length: 2, 
      convRule: rule159
  }, {
      start: 11392, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11393, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11394, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11395, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11396, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11397, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11398, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11399, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11400, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11401, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11402, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11403, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11404, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11405, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11406, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11407, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11408, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11409, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11410, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11411, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11412, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11413, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11414, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11415, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11416, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11417, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11418, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11419, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11420, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11421, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11422, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11423, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11424, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11425, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11426, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11427, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11428, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11429, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11430, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11431, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11432, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11433, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11434, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11435, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11436, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11437, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11438, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11439, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11440, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11441, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11442, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11443, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11444, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11445, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11446, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11447, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11448, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11449, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11450, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11451, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11452, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11453, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11454, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11455, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11456, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11457, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11458, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11459, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11460, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11461, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11462, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11463, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11464, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11465, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11466, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11467, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11468, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11469, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11470, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11471, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11472, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11473, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11474, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11475, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11476, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11477, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11478, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11479, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11480, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11481, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11482, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11483, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11484, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11485, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11486, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11487, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11488, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11489, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11490, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11491, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11499, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11500, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11501, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11502, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11520, 
      length: 38, 
      convRule: rule160
  }, {
      start: 42560, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42561, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42562, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42563, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42564, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42565, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42566, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42567, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42568, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42569, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42570, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42571, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42572, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42573, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42574, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42575, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42576, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42577, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42578, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42579, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42580, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42581, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42582, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42583, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42584, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42585, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42586, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42587, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42588, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42589, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42590, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42591, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42592, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42593, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42594, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42595, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42596, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42597, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42598, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42599, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42600, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42601, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42602, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42603, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42604, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42605, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42624, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42625, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42626, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42627, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42628, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42629, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42630, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42631, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42632, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42633, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42634, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42635, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42636, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42637, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42638, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42639, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42640, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42641, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42642, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42643, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42644, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42645, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42646, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42647, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42786, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42787, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42788, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42789, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42790, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42791, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42792, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42793, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42794, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42795, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42796, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42797, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42798, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42799, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42802, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42803, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42804, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42805, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42806, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42807, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42808, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42809, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42810, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42811, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42812, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42813, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42814, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42815, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42816, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42817, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42818, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42819, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42820, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42821, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42822, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42823, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42824, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42825, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42826, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42827, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42828, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42829, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42830, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42831, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42832, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42833, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42834, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42835, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42836, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42837, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42838, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42839, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42840, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42841, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42842, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42843, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42844, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42845, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42846, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42847, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42848, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42849, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42850, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42851, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42852, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42853, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42854, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42855, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42856, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42857, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42858, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42859, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42860, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42861, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42862, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42863, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42873, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42874, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42875, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42876, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42877, 
      length: 1, 
      convRule: rule161
  }, {
      start: 42878, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42879, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42880, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42881, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42882, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42883, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42884, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42885, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42886, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42887, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42891, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42892, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42893, 
      length: 1, 
      convRule: rule162
  }, {
      start: 42896, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42897, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42912, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42913, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42914, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42915, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42916, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42917, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42918, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42919, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42920, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42921, 
      length: 1, 
      convRule: rule22
  }, {
      start: 65313, 
      length: 26, 
      convRule: rule9
  }, {
      start: 65345, 
      length: 26, 
      convRule: rule12
  }, {
      start: 66560, 
      length: 40, 
      convRule: rule165
  }, {
      start: 66600, 
      length: 40, 
      convRule: rule166
  } ];
  var bsearch = function (a) {
      return function (array) {
          return function (size) {
              return function (compare) {
                  var go = function (__copy_i) {
                      return function (__copy_k) {
                          var __tco_i = __copy_i;
                          var __tco_done = false;
                          var __tco_result;
                          function __tco_loop(i, k) {
                              if (i > k) {
                                  __tco_done = true;
                                  return Data_Maybe.Nothing.value;
                              };
                              if (Data_Boolean.otherwise) {
                                  var j = Data_Int.floor(Data_Int.toNumber(i + k | 0) / 2.0);
                                  var v = compare(a)(array[j]);
                                  if (v instanceof Data_Ordering.EQ) {
                                      __tco_done = true;
                                      return new Data_Maybe.Just(array[j]);
                                  };
                                  if (v instanceof Data_Ordering.GT) {
                                      __tco_i = j + 1 | 0;
                                      __copy_k = k;
                                      return;
                                  };
                                  __tco_i = i;
                                  __copy_k = j - 1 | 0;
                                  return;
                              };
                              throw new Error("Failed pattern match at Data.Char.Unicode.Internal line 4781, column 32 - line 4789, column 49: " + [ i.constructor.name, k.constructor.name ]);
                          };
                          while (!__tco_done) {
                              __tco_result = __tco_loop(__tco_i, __copy_k);
                          };
                          return __tco_result;
                      };
                  };
                  return go(0)(size);
              };
          };
      };
  };
  var blkCmp = function (v) {
      return function (v1) {
          if (v.start >= v1.start && v.start < (v1.start + v1.length | 0)) {
              return Data_Ordering.EQ.value;
          };
          if (v.start > v1.start) {
              return Data_Ordering.GT.value;
          };
          if (Data_Boolean.otherwise) {
              return Data_Ordering.LT.value;
          };
          throw new Error("Failed pattern match at Data.Char.Unicode.Internal line 4761, column 1 - line 4764, column 74: " + [ v.constructor.name, v1.constructor.name ]);
      };
  };
  var getRule = function (blocks) {
      return function (unichar) {
          return function (size) {
              var key = {
                  start: unichar, 
                  length: 1, 
                  convRule: nullrule
              };
              var maybeCharBlock = bsearch(key)(blocks)(size)(blkCmp);
              if (maybeCharBlock instanceof Data_Maybe.Nothing) {
                  return Data_Maybe.Nothing.value;
              };
              if (maybeCharBlock instanceof Data_Maybe.Just) {
                  return new Data_Maybe.Just(maybeCharBlock.value0.convRule);
              };
              throw new Error("Failed pattern match at Data.Char.Unicode.Internal line 4773, column 8 - line 4775, column 62: " + [ maybeCharBlock.constructor.name ]);
          };
      };
  };
  var caseConv = function (f) {
      return function ($$char) {
          var maybeConversionRule = getRule(convchars)($$char)(numConvBlocks);
          if (maybeConversionRule instanceof Data_Maybe.Nothing) {
              return $$char;
          };
          if (maybeConversionRule instanceof Data_Maybe.Just) {
              return $$char + f(maybeConversionRule.value0) | 0;
          };
          throw new Error("Failed pattern match at Data.Char.Unicode.Internal line 4850, column 8 - line 4852, column 55: " + [ maybeConversionRule.constructor.name ]);
      };
  };
  var uTowlower = caseConv(function (v) {
      return v.lowdist;
  });
  var uTowupper = caseConv(function (v) {
      return v.updist;
  });
  var checkAttrS = function (categories) {
      return function ($$char) {
          var maybeConversionRule = getRule(spacechars)($$char)(numSpaceBlocks);
          if (maybeConversionRule instanceof Data_Maybe.Nothing) {
              return false;
          };
          if (maybeConversionRule instanceof Data_Maybe.Just) {
              return Data_Maybe.isJust(Data_Array.elemIndex(Data_Eq.eqInt)(maybeConversionRule.value0.category)(categories));
          };
          throw new Error("Failed pattern match at Data.Char.Unicode.Internal line 4807, column 8 - line 4809, column 92: " + [ maybeConversionRule.constructor.name ]);
      };
  };
  var uIswspace = checkAttrS([ gencatZS ]);
  var allchars = [ {
      start: 0, 
      length: 32, 
      convRule: rule0
  }, {
      start: 32, 
      length: 1, 
      convRule: rule1
  }, {
      start: 33, 
      length: 3, 
      convRule: rule2
  }, {
      start: 36, 
      length: 1, 
      convRule: rule3
  }, {
      start: 37, 
      length: 3, 
      convRule: rule2
  }, {
      start: 40, 
      length: 1, 
      convRule: rule4
  }, {
      start: 41, 
      length: 1, 
      convRule: rule5
  }, {
      start: 42, 
      length: 1, 
      convRule: rule2
  }, {
      start: 43, 
      length: 1, 
      convRule: rule6
  }, {
      start: 44, 
      length: 1, 
      convRule: rule2
  }, {
      start: 45, 
      length: 1, 
      convRule: rule7
  }, {
      start: 46, 
      length: 2, 
      convRule: rule2
  }, {
      start: 48, 
      length: 10, 
      convRule: rule8
  }, {
      start: 58, 
      length: 2, 
      convRule: rule2
  }, {
      start: 60, 
      length: 3, 
      convRule: rule6
  }, {
      start: 63, 
      length: 2, 
      convRule: rule2
  }, {
      start: 65, 
      length: 26, 
      convRule: rule9
  }, {
      start: 91, 
      length: 1, 
      convRule: rule4
  }, {
      start: 92, 
      length: 1, 
      convRule: rule2
  }, {
      start: 93, 
      length: 1, 
      convRule: rule5
  }, {
      start: 94, 
      length: 1, 
      convRule: rule10
  }, {
      start: 95, 
      length: 1, 
      convRule: rule11
  }, {
      start: 96, 
      length: 1, 
      convRule: rule10
  }, {
      start: 97, 
      length: 26, 
      convRule: rule12
  }, {
      start: 123, 
      length: 1, 
      convRule: rule4
  }, {
      start: 124, 
      length: 1, 
      convRule: rule6
  }, {
      start: 125, 
      length: 1, 
      convRule: rule5
  }, {
      start: 126, 
      length: 1, 
      convRule: rule6
  }, {
      start: 127, 
      length: 33, 
      convRule: rule0
  }, {
      start: 160, 
      length: 1, 
      convRule: rule1
  }, {
      start: 161, 
      length: 1, 
      convRule: rule2
  }, {
      start: 162, 
      length: 4, 
      convRule: rule3
  }, {
      start: 166, 
      length: 2, 
      convRule: rule13
  }, {
      start: 168, 
      length: 1, 
      convRule: rule10
  }, {
      start: 169, 
      length: 1, 
      convRule: rule13
  }, {
      start: 170, 
      length: 1, 
      convRule: rule14
  }, {
      start: 171, 
      length: 1, 
      convRule: rule15
  }, {
      start: 172, 
      length: 1, 
      convRule: rule6
  }, {
      start: 173, 
      length: 1, 
      convRule: rule16
  }, {
      start: 174, 
      length: 1, 
      convRule: rule13
  }, {
      start: 175, 
      length: 1, 
      convRule: rule10
  }, {
      start: 176, 
      length: 1, 
      convRule: rule13
  }, {
      start: 177, 
      length: 1, 
      convRule: rule6
  }, {
      start: 178, 
      length: 2, 
      convRule: rule17
  }, {
      start: 180, 
      length: 1, 
      convRule: rule10
  }, {
      start: 181, 
      length: 1, 
      convRule: rule18
  }, {
      start: 182, 
      length: 1, 
      convRule: rule13
  }, {
      start: 183, 
      length: 1, 
      convRule: rule2
  }, {
      start: 184, 
      length: 1, 
      convRule: rule10
  }, {
      start: 185, 
      length: 1, 
      convRule: rule17
  }, {
      start: 186, 
      length: 1, 
      convRule: rule14
  }, {
      start: 187, 
      length: 1, 
      convRule: rule19
  }, {
      start: 188, 
      length: 3, 
      convRule: rule17
  }, {
      start: 191, 
      length: 1, 
      convRule: rule2
  }, {
      start: 192, 
      length: 23, 
      convRule: rule9
  }, {
      start: 215, 
      length: 1, 
      convRule: rule6
  }, {
      start: 216, 
      length: 7, 
      convRule: rule9
  }, {
      start: 223, 
      length: 1, 
      convRule: rule14
  }, {
      start: 224, 
      length: 23, 
      convRule: rule12
  }, {
      start: 247, 
      length: 1, 
      convRule: rule6
  }, {
      start: 248, 
      length: 7, 
      convRule: rule12
  }, {
      start: 255, 
      length: 1, 
      convRule: rule20
  }, {
      start: 256, 
      length: 1, 
      convRule: rule21
  }, {
      start: 257, 
      length: 1, 
      convRule: rule22
  }, {
      start: 258, 
      length: 1, 
      convRule: rule21
  }, {
      start: 259, 
      length: 1, 
      convRule: rule22
  }, {
      start: 260, 
      length: 1, 
      convRule: rule21
  }, {
      start: 261, 
      length: 1, 
      convRule: rule22
  }, {
      start: 262, 
      length: 1, 
      convRule: rule21
  }, {
      start: 263, 
      length: 1, 
      convRule: rule22
  }, {
      start: 264, 
      length: 1, 
      convRule: rule21
  }, {
      start: 265, 
      length: 1, 
      convRule: rule22
  }, {
      start: 266, 
      length: 1, 
      convRule: rule21
  }, {
      start: 267, 
      length: 1, 
      convRule: rule22
  }, {
      start: 268, 
      length: 1, 
      convRule: rule21
  }, {
      start: 269, 
      length: 1, 
      convRule: rule22
  }, {
      start: 270, 
      length: 1, 
      convRule: rule21
  }, {
      start: 271, 
      length: 1, 
      convRule: rule22
  }, {
      start: 272, 
      length: 1, 
      convRule: rule21
  }, {
      start: 273, 
      length: 1, 
      convRule: rule22
  }, {
      start: 274, 
      length: 1, 
      convRule: rule21
  }, {
      start: 275, 
      length: 1, 
      convRule: rule22
  }, {
      start: 276, 
      length: 1, 
      convRule: rule21
  }, {
      start: 277, 
      length: 1, 
      convRule: rule22
  }, {
      start: 278, 
      length: 1, 
      convRule: rule21
  }, {
      start: 279, 
      length: 1, 
      convRule: rule22
  }, {
      start: 280, 
      length: 1, 
      convRule: rule21
  }, {
      start: 281, 
      length: 1, 
      convRule: rule22
  }, {
      start: 282, 
      length: 1, 
      convRule: rule21
  }, {
      start: 283, 
      length: 1, 
      convRule: rule22
  }, {
      start: 284, 
      length: 1, 
      convRule: rule21
  }, {
      start: 285, 
      length: 1, 
      convRule: rule22
  }, {
      start: 286, 
      length: 1, 
      convRule: rule21
  }, {
      start: 287, 
      length: 1, 
      convRule: rule22
  }, {
      start: 288, 
      length: 1, 
      convRule: rule21
  }, {
      start: 289, 
      length: 1, 
      convRule: rule22
  }, {
      start: 290, 
      length: 1, 
      convRule: rule21
  }, {
      start: 291, 
      length: 1, 
      convRule: rule22
  }, {
      start: 292, 
      length: 1, 
      convRule: rule21
  }, {
      start: 293, 
      length: 1, 
      convRule: rule22
  }, {
      start: 294, 
      length: 1, 
      convRule: rule21
  }, {
      start: 295, 
      length: 1, 
      convRule: rule22
  }, {
      start: 296, 
      length: 1, 
      convRule: rule21
  }, {
      start: 297, 
      length: 1, 
      convRule: rule22
  }, {
      start: 298, 
      length: 1, 
      convRule: rule21
  }, {
      start: 299, 
      length: 1, 
      convRule: rule22
  }, {
      start: 300, 
      length: 1, 
      convRule: rule21
  }, {
      start: 301, 
      length: 1, 
      convRule: rule22
  }, {
      start: 302, 
      length: 1, 
      convRule: rule21
  }, {
      start: 303, 
      length: 1, 
      convRule: rule22
  }, {
      start: 304, 
      length: 1, 
      convRule: rule23
  }, {
      start: 305, 
      length: 1, 
      convRule: rule24
  }, {
      start: 306, 
      length: 1, 
      convRule: rule21
  }, {
      start: 307, 
      length: 1, 
      convRule: rule22
  }, {
      start: 308, 
      length: 1, 
      convRule: rule21
  }, {
      start: 309, 
      length: 1, 
      convRule: rule22
  }, {
      start: 310, 
      length: 1, 
      convRule: rule21
  }, {
      start: 311, 
      length: 1, 
      convRule: rule22
  }, {
      start: 312, 
      length: 1, 
      convRule: rule14
  }, {
      start: 313, 
      length: 1, 
      convRule: rule21
  }, {
      start: 314, 
      length: 1, 
      convRule: rule22
  }, {
      start: 315, 
      length: 1, 
      convRule: rule21
  }, {
      start: 316, 
      length: 1, 
      convRule: rule22
  }, {
      start: 317, 
      length: 1, 
      convRule: rule21
  }, {
      start: 318, 
      length: 1, 
      convRule: rule22
  }, {
      start: 319, 
      length: 1, 
      convRule: rule21
  }, {
      start: 320, 
      length: 1, 
      convRule: rule22
  }, {
      start: 321, 
      length: 1, 
      convRule: rule21
  }, {
      start: 322, 
      length: 1, 
      convRule: rule22
  }, {
      start: 323, 
      length: 1, 
      convRule: rule21
  }, {
      start: 324, 
      length: 1, 
      convRule: rule22
  }, {
      start: 325, 
      length: 1, 
      convRule: rule21
  }, {
      start: 326, 
      length: 1, 
      convRule: rule22
  }, {
      start: 327, 
      length: 1, 
      convRule: rule21
  }, {
      start: 328, 
      length: 1, 
      convRule: rule22
  }, {
      start: 329, 
      length: 1, 
      convRule: rule14
  }, {
      start: 330, 
      length: 1, 
      convRule: rule21
  }, {
      start: 331, 
      length: 1, 
      convRule: rule22
  }, {
      start: 332, 
      length: 1, 
      convRule: rule21
  }, {
      start: 333, 
      length: 1, 
      convRule: rule22
  }, {
      start: 334, 
      length: 1, 
      convRule: rule21
  }, {
      start: 335, 
      length: 1, 
      convRule: rule22
  }, {
      start: 336, 
      length: 1, 
      convRule: rule21
  }, {
      start: 337, 
      length: 1, 
      convRule: rule22
  }, {
      start: 338, 
      length: 1, 
      convRule: rule21
  }, {
      start: 339, 
      length: 1, 
      convRule: rule22
  }, {
      start: 340, 
      length: 1, 
      convRule: rule21
  }, {
      start: 341, 
      length: 1, 
      convRule: rule22
  }, {
      start: 342, 
      length: 1, 
      convRule: rule21
  }, {
      start: 343, 
      length: 1, 
      convRule: rule22
  }, {
      start: 344, 
      length: 1, 
      convRule: rule21
  }, {
      start: 345, 
      length: 1, 
      convRule: rule22
  }, {
      start: 346, 
      length: 1, 
      convRule: rule21
  }, {
      start: 347, 
      length: 1, 
      convRule: rule22
  }, {
      start: 348, 
      length: 1, 
      convRule: rule21
  }, {
      start: 349, 
      length: 1, 
      convRule: rule22
  }, {
      start: 350, 
      length: 1, 
      convRule: rule21
  }, {
      start: 351, 
      length: 1, 
      convRule: rule22
  }, {
      start: 352, 
      length: 1, 
      convRule: rule21
  }, {
      start: 353, 
      length: 1, 
      convRule: rule22
  }, {
      start: 354, 
      length: 1, 
      convRule: rule21
  }, {
      start: 355, 
      length: 1, 
      convRule: rule22
  }, {
      start: 356, 
      length: 1, 
      convRule: rule21
  }, {
      start: 357, 
      length: 1, 
      convRule: rule22
  }, {
      start: 358, 
      length: 1, 
      convRule: rule21
  }, {
      start: 359, 
      length: 1, 
      convRule: rule22
  }, {
      start: 360, 
      length: 1, 
      convRule: rule21
  }, {
      start: 361, 
      length: 1, 
      convRule: rule22
  }, {
      start: 362, 
      length: 1, 
      convRule: rule21
  }, {
      start: 363, 
      length: 1, 
      convRule: rule22
  }, {
      start: 364, 
      length: 1, 
      convRule: rule21
  }, {
      start: 365, 
      length: 1, 
      convRule: rule22
  }, {
      start: 366, 
      length: 1, 
      convRule: rule21
  }, {
      start: 367, 
      length: 1, 
      convRule: rule22
  }, {
      start: 368, 
      length: 1, 
      convRule: rule21
  }, {
      start: 369, 
      length: 1, 
      convRule: rule22
  }, {
      start: 370, 
      length: 1, 
      convRule: rule21
  }, {
      start: 371, 
      length: 1, 
      convRule: rule22
  }, {
      start: 372, 
      length: 1, 
      convRule: rule21
  }, {
      start: 373, 
      length: 1, 
      convRule: rule22
  }, {
      start: 374, 
      length: 1, 
      convRule: rule21
  }, {
      start: 375, 
      length: 1, 
      convRule: rule22
  }, {
      start: 376, 
      length: 1, 
      convRule: rule25
  }, {
      start: 377, 
      length: 1, 
      convRule: rule21
  }, {
      start: 378, 
      length: 1, 
      convRule: rule22
  }, {
      start: 379, 
      length: 1, 
      convRule: rule21
  }, {
      start: 380, 
      length: 1, 
      convRule: rule22
  }, {
      start: 381, 
      length: 1, 
      convRule: rule21
  }, {
      start: 382, 
      length: 1, 
      convRule: rule22
  }, {
      start: 383, 
      length: 1, 
      convRule: rule26
  }, {
      start: 384, 
      length: 1, 
      convRule: rule27
  }, {
      start: 385, 
      length: 1, 
      convRule: rule28
  }, {
      start: 386, 
      length: 1, 
      convRule: rule21
  }, {
      start: 387, 
      length: 1, 
      convRule: rule22
  }, {
      start: 388, 
      length: 1, 
      convRule: rule21
  }, {
      start: 389, 
      length: 1, 
      convRule: rule22
  }, {
      start: 390, 
      length: 1, 
      convRule: rule29
  }, {
      start: 391, 
      length: 1, 
      convRule: rule21
  }, {
      start: 392, 
      length: 1, 
      convRule: rule22
  }, {
      start: 393, 
      length: 2, 
      convRule: rule30
  }, {
      start: 395, 
      length: 1, 
      convRule: rule21
  }, {
      start: 396, 
      length: 1, 
      convRule: rule22
  }, {
      start: 397, 
      length: 1, 
      convRule: rule14
  }, {
      start: 398, 
      length: 1, 
      convRule: rule31
  }, {
      start: 399, 
      length: 1, 
      convRule: rule32
  }, {
      start: 400, 
      length: 1, 
      convRule: rule33
  }, {
      start: 401, 
      length: 1, 
      convRule: rule21
  }, {
      start: 402, 
      length: 1, 
      convRule: rule22
  }, {
      start: 403, 
      length: 1, 
      convRule: rule30
  }, {
      start: 404, 
      length: 1, 
      convRule: rule34
  }, {
      start: 405, 
      length: 1, 
      convRule: rule35
  }, {
      start: 406, 
      length: 1, 
      convRule: rule36
  }, {
      start: 407, 
      length: 1, 
      convRule: rule37
  }, {
      start: 408, 
      length: 1, 
      convRule: rule21
  }, {
      start: 409, 
      length: 1, 
      convRule: rule22
  }, {
      start: 410, 
      length: 1, 
      convRule: rule38
  }, {
      start: 411, 
      length: 1, 
      convRule: rule14
  }, {
      start: 412, 
      length: 1, 
      convRule: rule36
  }, {
      start: 413, 
      length: 1, 
      convRule: rule39
  }, {
      start: 414, 
      length: 1, 
      convRule: rule40
  }, {
      start: 415, 
      length: 1, 
      convRule: rule41
  }, {
      start: 416, 
      length: 1, 
      convRule: rule21
  }, {
      start: 417, 
      length: 1, 
      convRule: rule22
  }, {
      start: 418, 
      length: 1, 
      convRule: rule21
  }, {
      start: 419, 
      length: 1, 
      convRule: rule22
  }, {
      start: 420, 
      length: 1, 
      convRule: rule21
  }, {
      start: 421, 
      length: 1, 
      convRule: rule22
  }, {
      start: 422, 
      length: 1, 
      convRule: rule42
  }, {
      start: 423, 
      length: 1, 
      convRule: rule21
  }, {
      start: 424, 
      length: 1, 
      convRule: rule22
  }, {
      start: 425, 
      length: 1, 
      convRule: rule42
  }, {
      start: 426, 
      length: 2, 
      convRule: rule14
  }, {
      start: 428, 
      length: 1, 
      convRule: rule21
  }, {
      start: 429, 
      length: 1, 
      convRule: rule22
  }, {
      start: 430, 
      length: 1, 
      convRule: rule42
  }, {
      start: 431, 
      length: 1, 
      convRule: rule21
  }, {
      start: 432, 
      length: 1, 
      convRule: rule22
  }, {
      start: 433, 
      length: 2, 
      convRule: rule43
  }, {
      start: 435, 
      length: 1, 
      convRule: rule21
  }, {
      start: 436, 
      length: 1, 
      convRule: rule22
  }, {
      start: 437, 
      length: 1, 
      convRule: rule21
  }, {
      start: 438, 
      length: 1, 
      convRule: rule22
  }, {
      start: 439, 
      length: 1, 
      convRule: rule44
  }, {
      start: 440, 
      length: 1, 
      convRule: rule21
  }, {
      start: 441, 
      length: 1, 
      convRule: rule22
  }, {
      start: 442, 
      length: 1, 
      convRule: rule14
  }, {
      start: 443, 
      length: 1, 
      convRule: rule45
  }, {
      start: 444, 
      length: 1, 
      convRule: rule21
  }, {
      start: 445, 
      length: 1, 
      convRule: rule22
  }, {
      start: 446, 
      length: 1, 
      convRule: rule14
  }, {
      start: 447, 
      length: 1, 
      convRule: rule46
  }, {
      start: 448, 
      length: 4, 
      convRule: rule45
  }, {
      start: 452, 
      length: 1, 
      convRule: rule47
  }, {
      start: 453, 
      length: 1, 
      convRule: rule48
  }, {
      start: 454, 
      length: 1, 
      convRule: rule49
  }, {
      start: 455, 
      length: 1, 
      convRule: rule47
  }, {
      start: 456, 
      length: 1, 
      convRule: rule48
  }, {
      start: 457, 
      length: 1, 
      convRule: rule49
  }, {
      start: 458, 
      length: 1, 
      convRule: rule47
  }, {
      start: 459, 
      length: 1, 
      convRule: rule48
  }, {
      start: 460, 
      length: 1, 
      convRule: rule49
  }, {
      start: 461, 
      length: 1, 
      convRule: rule21
  }, {
      start: 462, 
      length: 1, 
      convRule: rule22
  }, {
      start: 463, 
      length: 1, 
      convRule: rule21
  }, {
      start: 464, 
      length: 1, 
      convRule: rule22
  }, {
      start: 465, 
      length: 1, 
      convRule: rule21
  }, {
      start: 466, 
      length: 1, 
      convRule: rule22
  }, {
      start: 467, 
      length: 1, 
      convRule: rule21
  }, {
      start: 468, 
      length: 1, 
      convRule: rule22
  }, {
      start: 469, 
      length: 1, 
      convRule: rule21
  }, {
      start: 470, 
      length: 1, 
      convRule: rule22
  }, {
      start: 471, 
      length: 1, 
      convRule: rule21
  }, {
      start: 472, 
      length: 1, 
      convRule: rule22
  }, {
      start: 473, 
      length: 1, 
      convRule: rule21
  }, {
      start: 474, 
      length: 1, 
      convRule: rule22
  }, {
      start: 475, 
      length: 1, 
      convRule: rule21
  }, {
      start: 476, 
      length: 1, 
      convRule: rule22
  }, {
      start: 477, 
      length: 1, 
      convRule: rule50
  }, {
      start: 478, 
      length: 1, 
      convRule: rule21
  }, {
      start: 479, 
      length: 1, 
      convRule: rule22
  }, {
      start: 480, 
      length: 1, 
      convRule: rule21
  }, {
      start: 481, 
      length: 1, 
      convRule: rule22
  }, {
      start: 482, 
      length: 1, 
      convRule: rule21
  }, {
      start: 483, 
      length: 1, 
      convRule: rule22
  }, {
      start: 484, 
      length: 1, 
      convRule: rule21
  }, {
      start: 485, 
      length: 1, 
      convRule: rule22
  }, {
      start: 486, 
      length: 1, 
      convRule: rule21
  }, {
      start: 487, 
      length: 1, 
      convRule: rule22
  }, {
      start: 488, 
      length: 1, 
      convRule: rule21
  }, {
      start: 489, 
      length: 1, 
      convRule: rule22
  }, {
      start: 490, 
      length: 1, 
      convRule: rule21
  }, {
      start: 491, 
      length: 1, 
      convRule: rule22
  }, {
      start: 492, 
      length: 1, 
      convRule: rule21
  }, {
      start: 493, 
      length: 1, 
      convRule: rule22
  }, {
      start: 494, 
      length: 1, 
      convRule: rule21
  }, {
      start: 495, 
      length: 1, 
      convRule: rule22
  }, {
      start: 496, 
      length: 1, 
      convRule: rule14
  }, {
      start: 497, 
      length: 1, 
      convRule: rule47
  }, {
      start: 498, 
      length: 1, 
      convRule: rule48
  }, {
      start: 499, 
      length: 1, 
      convRule: rule49
  }, {
      start: 500, 
      length: 1, 
      convRule: rule21
  }, {
      start: 501, 
      length: 1, 
      convRule: rule22
  }, {
      start: 502, 
      length: 1, 
      convRule: rule51
  }, {
      start: 503, 
      length: 1, 
      convRule: rule52
  }, {
      start: 504, 
      length: 1, 
      convRule: rule21
  }, {
      start: 505, 
      length: 1, 
      convRule: rule22
  }, {
      start: 506, 
      length: 1, 
      convRule: rule21
  }, {
      start: 507, 
      length: 1, 
      convRule: rule22
  }, {
      start: 508, 
      length: 1, 
      convRule: rule21
  }, {
      start: 509, 
      length: 1, 
      convRule: rule22
  }, {
      start: 510, 
      length: 1, 
      convRule: rule21
  }, {
      start: 511, 
      length: 1, 
      convRule: rule22
  }, {
      start: 512, 
      length: 1, 
      convRule: rule21
  }, {
      start: 513, 
      length: 1, 
      convRule: rule22
  }, {
      start: 514, 
      length: 1, 
      convRule: rule21
  }, {
      start: 515, 
      length: 1, 
      convRule: rule22
  }, {
      start: 516, 
      length: 1, 
      convRule: rule21
  }, {
      start: 517, 
      length: 1, 
      convRule: rule22
  }, {
      start: 518, 
      length: 1, 
      convRule: rule21
  }, {
      start: 519, 
      length: 1, 
      convRule: rule22
  }, {
      start: 520, 
      length: 1, 
      convRule: rule21
  }, {
      start: 521, 
      length: 1, 
      convRule: rule22
  }, {
      start: 522, 
      length: 1, 
      convRule: rule21
  }, {
      start: 523, 
      length: 1, 
      convRule: rule22
  }, {
      start: 524, 
      length: 1, 
      convRule: rule21
  }, {
      start: 525, 
      length: 1, 
      convRule: rule22
  }, {
      start: 526, 
      length: 1, 
      convRule: rule21
  }, {
      start: 527, 
      length: 1, 
      convRule: rule22
  }, {
      start: 528, 
      length: 1, 
      convRule: rule21
  }, {
      start: 529, 
      length: 1, 
      convRule: rule22
  }, {
      start: 530, 
      length: 1, 
      convRule: rule21
  }, {
      start: 531, 
      length: 1, 
      convRule: rule22
  }, {
      start: 532, 
      length: 1, 
      convRule: rule21
  }, {
      start: 533, 
      length: 1, 
      convRule: rule22
  }, {
      start: 534, 
      length: 1, 
      convRule: rule21
  }, {
      start: 535, 
      length: 1, 
      convRule: rule22
  }, {
      start: 536, 
      length: 1, 
      convRule: rule21
  }, {
      start: 537, 
      length: 1, 
      convRule: rule22
  }, {
      start: 538, 
      length: 1, 
      convRule: rule21
  }, {
      start: 539, 
      length: 1, 
      convRule: rule22
  }, {
      start: 540, 
      length: 1, 
      convRule: rule21
  }, {
      start: 541, 
      length: 1, 
      convRule: rule22
  }, {
      start: 542, 
      length: 1, 
      convRule: rule21
  }, {
      start: 543, 
      length: 1, 
      convRule: rule22
  }, {
      start: 544, 
      length: 1, 
      convRule: rule53
  }, {
      start: 545, 
      length: 1, 
      convRule: rule14
  }, {
      start: 546, 
      length: 1, 
      convRule: rule21
  }, {
      start: 547, 
      length: 1, 
      convRule: rule22
  }, {
      start: 548, 
      length: 1, 
      convRule: rule21
  }, {
      start: 549, 
      length: 1, 
      convRule: rule22
  }, {
      start: 550, 
      length: 1, 
      convRule: rule21
  }, {
      start: 551, 
      length: 1, 
      convRule: rule22
  }, {
      start: 552, 
      length: 1, 
      convRule: rule21
  }, {
      start: 553, 
      length: 1, 
      convRule: rule22
  }, {
      start: 554, 
      length: 1, 
      convRule: rule21
  }, {
      start: 555, 
      length: 1, 
      convRule: rule22
  }, {
      start: 556, 
      length: 1, 
      convRule: rule21
  }, {
      start: 557, 
      length: 1, 
      convRule: rule22
  }, {
      start: 558, 
      length: 1, 
      convRule: rule21
  }, {
      start: 559, 
      length: 1, 
      convRule: rule22
  }, {
      start: 560, 
      length: 1, 
      convRule: rule21
  }, {
      start: 561, 
      length: 1, 
      convRule: rule22
  }, {
      start: 562, 
      length: 1, 
      convRule: rule21
  }, {
      start: 563, 
      length: 1, 
      convRule: rule22
  }, {
      start: 564, 
      length: 6, 
      convRule: rule14
  }, {
      start: 570, 
      length: 1, 
      convRule: rule54
  }, {
      start: 571, 
      length: 1, 
      convRule: rule21
  }, {
      start: 572, 
      length: 1, 
      convRule: rule22
  }, {
      start: 573, 
      length: 1, 
      convRule: rule55
  }, {
      start: 574, 
      length: 1, 
      convRule: rule56
  }, {
      start: 575, 
      length: 2, 
      convRule: rule57
  }, {
      start: 577, 
      length: 1, 
      convRule: rule21
  }, {
      start: 578, 
      length: 1, 
      convRule: rule22
  }, {
      start: 579, 
      length: 1, 
      convRule: rule58
  }, {
      start: 580, 
      length: 1, 
      convRule: rule59
  }, {
      start: 581, 
      length: 1, 
      convRule: rule60
  }, {
      start: 582, 
      length: 1, 
      convRule: rule21
  }, {
      start: 583, 
      length: 1, 
      convRule: rule22
  }, {
      start: 584, 
      length: 1, 
      convRule: rule21
  }, {
      start: 585, 
      length: 1, 
      convRule: rule22
  }, {
      start: 586, 
      length: 1, 
      convRule: rule21
  }, {
      start: 587, 
      length: 1, 
      convRule: rule22
  }, {
      start: 588, 
      length: 1, 
      convRule: rule21
  }, {
      start: 589, 
      length: 1, 
      convRule: rule22
  }, {
      start: 590, 
      length: 1, 
      convRule: rule21
  }, {
      start: 591, 
      length: 1, 
      convRule: rule22
  }, {
      start: 592, 
      length: 1, 
      convRule: rule61
  }, {
      start: 593, 
      length: 1, 
      convRule: rule62
  }, {
      start: 594, 
      length: 1, 
      convRule: rule63
  }, {
      start: 595, 
      length: 1, 
      convRule: rule64
  }, {
      start: 596, 
      length: 1, 
      convRule: rule65
  }, {
      start: 597, 
      length: 1, 
      convRule: rule14
  }, {
      start: 598, 
      length: 2, 
      convRule: rule66
  }, {
      start: 600, 
      length: 1, 
      convRule: rule14
  }, {
      start: 601, 
      length: 1, 
      convRule: rule67
  }, {
      start: 602, 
      length: 1, 
      convRule: rule14
  }, {
      start: 603, 
      length: 1, 
      convRule: rule68
  }, {
      start: 604, 
      length: 4, 
      convRule: rule14
  }, {
      start: 608, 
      length: 1, 
      convRule: rule66
  }, {
      start: 609, 
      length: 2, 
      convRule: rule14
  }, {
      start: 611, 
      length: 1, 
      convRule: rule69
  }, {
      start: 612, 
      length: 1, 
      convRule: rule14
  }, {
      start: 613, 
      length: 1, 
      convRule: rule70
  }, {
      start: 614, 
      length: 2, 
      convRule: rule14
  }, {
      start: 616, 
      length: 1, 
      convRule: rule71
  }, {
      start: 617, 
      length: 1, 
      convRule: rule72
  }, {
      start: 618, 
      length: 1, 
      convRule: rule14
  }, {
      start: 619, 
      length: 1, 
      convRule: rule73
  }, {
      start: 620, 
      length: 3, 
      convRule: rule14
  }, {
      start: 623, 
      length: 1, 
      convRule: rule72
  }, {
      start: 624, 
      length: 1, 
      convRule: rule14
  }, {
      start: 625, 
      length: 1, 
      convRule: rule74
  }, {
      start: 626, 
      length: 1, 
      convRule: rule75
  }, {
      start: 627, 
      length: 2, 
      convRule: rule14
  }, {
      start: 629, 
      length: 1, 
      convRule: rule76
  }, {
      start: 630, 
      length: 7, 
      convRule: rule14
  }, {
      start: 637, 
      length: 1, 
      convRule: rule77
  }, {
      start: 638, 
      length: 2, 
      convRule: rule14
  }, {
      start: 640, 
      length: 1, 
      convRule: rule78
  }, {
      start: 641, 
      length: 2, 
      convRule: rule14
  }, {
      start: 643, 
      length: 1, 
      convRule: rule78
  }, {
      start: 644, 
      length: 4, 
      convRule: rule14
  }, {
      start: 648, 
      length: 1, 
      convRule: rule78
  }, {
      start: 649, 
      length: 1, 
      convRule: rule79
  }, {
      start: 650, 
      length: 2, 
      convRule: rule80
  }, {
      start: 652, 
      length: 1, 
      convRule: rule81
  }, {
      start: 653, 
      length: 5, 
      convRule: rule14
  }, {
      start: 658, 
      length: 1, 
      convRule: rule82
  }, {
      start: 659, 
      length: 1, 
      convRule: rule14
  }, {
      start: 660, 
      length: 1, 
      convRule: rule45
  }, {
      start: 661, 
      length: 27, 
      convRule: rule14
  }, {
      start: 688, 
      length: 18, 
      convRule: rule83
  }, {
      start: 706, 
      length: 4, 
      convRule: rule10
  }, {
      start: 710, 
      length: 12, 
      convRule: rule83
  }, {
      start: 722, 
      length: 14, 
      convRule: rule10
  }, {
      start: 736, 
      length: 5, 
      convRule: rule83
  }, {
      start: 741, 
      length: 7, 
      convRule: rule10
  }, {
      start: 748, 
      length: 1, 
      convRule: rule83
  }, {
      start: 749, 
      length: 1, 
      convRule: rule10
  }, {
      start: 750, 
      length: 1, 
      convRule: rule83
  }, {
      start: 751, 
      length: 17, 
      convRule: rule10
  }, {
      start: 768, 
      length: 69, 
      convRule: rule84
  }, {
      start: 837, 
      length: 1, 
      convRule: rule85
  }, {
      start: 838, 
      length: 42, 
      convRule: rule84
  }, {
      start: 880, 
      length: 1, 
      convRule: rule21
  }, {
      start: 881, 
      length: 1, 
      convRule: rule22
  }, {
      start: 882, 
      length: 1, 
      convRule: rule21
  }, {
      start: 883, 
      length: 1, 
      convRule: rule22
  }, {
      start: 884, 
      length: 1, 
      convRule: rule83
  }, {
      start: 885, 
      length: 1, 
      convRule: rule10
  }, {
      start: 886, 
      length: 1, 
      convRule: rule21
  }, {
      start: 887, 
      length: 1, 
      convRule: rule22
  }, {
      start: 890, 
      length: 1, 
      convRule: rule83
  }, {
      start: 891, 
      length: 3, 
      convRule: rule40
  }, {
      start: 894, 
      length: 1, 
      convRule: rule2
  }, {
      start: 900, 
      length: 2, 
      convRule: rule10
  }, {
      start: 902, 
      length: 1, 
      convRule: rule86
  }, {
      start: 903, 
      length: 1, 
      convRule: rule2
  }, {
      start: 904, 
      length: 3, 
      convRule: rule87
  }, {
      start: 908, 
      length: 1, 
      convRule: rule88
  }, {
      start: 910, 
      length: 2, 
      convRule: rule89
  }, {
      start: 912, 
      length: 1, 
      convRule: rule14
  }, {
      start: 913, 
      length: 17, 
      convRule: rule9
  }, {
      start: 931, 
      length: 9, 
      convRule: rule9
  }, {
      start: 940, 
      length: 1, 
      convRule: rule90
  }, {
      start: 941, 
      length: 3, 
      convRule: rule91
  }, {
      start: 944, 
      length: 1, 
      convRule: rule14
  }, {
      start: 945, 
      length: 17, 
      convRule: rule12
  }, {
      start: 962, 
      length: 1, 
      convRule: rule92
  }, {
      start: 963, 
      length: 9, 
      convRule: rule12
  }, {
      start: 972, 
      length: 1, 
      convRule: rule93
  }, {
      start: 973, 
      length: 2, 
      convRule: rule94
  }, {
      start: 975, 
      length: 1, 
      convRule: rule95
  }, {
      start: 976, 
      length: 1, 
      convRule: rule96
  }, {
      start: 977, 
      length: 1, 
      convRule: rule97
  }, {
      start: 978, 
      length: 3, 
      convRule: rule98
  }, {
      start: 981, 
      length: 1, 
      convRule: rule99
  }, {
      start: 982, 
      length: 1, 
      convRule: rule100
  }, {
      start: 983, 
      length: 1, 
      convRule: rule101
  }, {
      start: 984, 
      length: 1, 
      convRule: rule21
  }, {
      start: 985, 
      length: 1, 
      convRule: rule22
  }, {
      start: 986, 
      length: 1, 
      convRule: rule21
  }, {
      start: 987, 
      length: 1, 
      convRule: rule22
  }, {
      start: 988, 
      length: 1, 
      convRule: rule21
  }, {
      start: 989, 
      length: 1, 
      convRule: rule22
  }, {
      start: 990, 
      length: 1, 
      convRule: rule21
  }, {
      start: 991, 
      length: 1, 
      convRule: rule22
  }, {
      start: 992, 
      length: 1, 
      convRule: rule21
  }, {
      start: 993, 
      length: 1, 
      convRule: rule22
  }, {
      start: 994, 
      length: 1, 
      convRule: rule21
  }, {
      start: 995, 
      length: 1, 
      convRule: rule22
  }, {
      start: 996, 
      length: 1, 
      convRule: rule21
  }, {
      start: 997, 
      length: 1, 
      convRule: rule22
  }, {
      start: 998, 
      length: 1, 
      convRule: rule21
  }, {
      start: 999, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1000, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1001, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1002, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1003, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1004, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1005, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1006, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1007, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1008, 
      length: 1, 
      convRule: rule102
  }, {
      start: 1009, 
      length: 1, 
      convRule: rule103
  }, {
      start: 1010, 
      length: 1, 
      convRule: rule104
  }, {
      start: 1011, 
      length: 1, 
      convRule: rule14
  }, {
      start: 1012, 
      length: 1, 
      convRule: rule105
  }, {
      start: 1013, 
      length: 1, 
      convRule: rule106
  }, {
      start: 1014, 
      length: 1, 
      convRule: rule6
  }, {
      start: 1015, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1016, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1017, 
      length: 1, 
      convRule: rule107
  }, {
      start: 1018, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1019, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1020, 
      length: 1, 
      convRule: rule14
  }, {
      start: 1021, 
      length: 3, 
      convRule: rule53
  }, {
      start: 1024, 
      length: 16, 
      convRule: rule108
  }, {
      start: 1040, 
      length: 32, 
      convRule: rule9
  }, {
      start: 1072, 
      length: 32, 
      convRule: rule12
  }, {
      start: 1104, 
      length: 16, 
      convRule: rule103
  }, {
      start: 1120, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1121, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1122, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1123, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1124, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1125, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1126, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1127, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1128, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1129, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1130, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1131, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1132, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1133, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1134, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1135, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1136, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1137, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1138, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1139, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1140, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1141, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1142, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1143, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1144, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1145, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1146, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1147, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1148, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1149, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1150, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1151, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1152, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1153, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1154, 
      length: 1, 
      convRule: rule13
  }, {
      start: 1155, 
      length: 5, 
      convRule: rule84
  }, {
      start: 1160, 
      length: 2, 
      convRule: rule109
  }, {
      start: 1162, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1163, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1164, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1165, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1166, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1167, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1168, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1169, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1170, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1171, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1172, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1173, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1174, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1175, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1176, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1177, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1178, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1179, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1180, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1181, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1182, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1183, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1184, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1185, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1186, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1187, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1188, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1189, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1190, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1191, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1192, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1193, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1194, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1195, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1196, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1197, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1198, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1199, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1200, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1201, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1202, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1203, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1204, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1205, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1206, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1207, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1208, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1209, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1210, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1211, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1212, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1213, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1214, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1215, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1216, 
      length: 1, 
      convRule: rule110
  }, {
      start: 1217, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1218, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1219, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1220, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1221, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1222, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1223, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1224, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1225, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1226, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1227, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1228, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1229, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1230, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1231, 
      length: 1, 
      convRule: rule111
  }, {
      start: 1232, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1233, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1234, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1235, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1236, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1237, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1238, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1239, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1240, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1241, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1242, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1243, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1244, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1245, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1246, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1247, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1248, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1249, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1250, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1251, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1252, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1253, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1254, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1255, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1256, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1257, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1258, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1259, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1260, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1261, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1262, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1263, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1264, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1265, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1266, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1267, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1268, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1269, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1270, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1271, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1272, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1273, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1274, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1275, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1276, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1277, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1278, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1279, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1280, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1281, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1282, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1283, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1284, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1285, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1286, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1287, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1288, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1289, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1290, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1291, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1292, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1293, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1294, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1295, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1296, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1297, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1298, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1299, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1300, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1301, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1302, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1303, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1304, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1305, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1306, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1307, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1308, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1309, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1310, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1311, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1312, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1313, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1314, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1315, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1316, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1317, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1318, 
      length: 1, 
      convRule: rule21
  }, {
      start: 1319, 
      length: 1, 
      convRule: rule22
  }, {
      start: 1329, 
      length: 38, 
      convRule: rule112
  }, {
      start: 1369, 
      length: 1, 
      convRule: rule83
  }, {
      start: 1370, 
      length: 6, 
      convRule: rule2
  }, {
      start: 1377, 
      length: 38, 
      convRule: rule113
  }, {
      start: 1415, 
      length: 1, 
      convRule: rule14
  }, {
      start: 1417, 
      length: 1, 
      convRule: rule2
  }, {
      start: 1418, 
      length: 1, 
      convRule: rule7
  }, {
      start: 1425, 
      length: 45, 
      convRule: rule84
  }, {
      start: 1470, 
      length: 1, 
      convRule: rule7
  }, {
      start: 1471, 
      length: 1, 
      convRule: rule84
  }, {
      start: 1472, 
      length: 1, 
      convRule: rule2
  }, {
      start: 1473, 
      length: 2, 
      convRule: rule84
  }, {
      start: 1475, 
      length: 1, 
      convRule: rule2
  }, {
      start: 1476, 
      length: 2, 
      convRule: rule84
  }, {
      start: 1478, 
      length: 1, 
      convRule: rule2
  }, {
      start: 1479, 
      length: 1, 
      convRule: rule84
  }, {
      start: 1488, 
      length: 27, 
      convRule: rule45
  }, {
      start: 1520, 
      length: 3, 
      convRule: rule45
  }, {
      start: 1523, 
      length: 2, 
      convRule: rule2
  }, {
      start: 1536, 
      length: 4, 
      convRule: rule16
  }, {
      start: 1542, 
      length: 3, 
      convRule: rule6
  }, {
      start: 1545, 
      length: 2, 
      convRule: rule2
  }, {
      start: 1547, 
      length: 1, 
      convRule: rule3
  }, {
      start: 1548, 
      length: 2, 
      convRule: rule2
  }, {
      start: 1550, 
      length: 2, 
      convRule: rule13
  }, {
      start: 1552, 
      length: 11, 
      convRule: rule84
  }, {
      start: 1563, 
      length: 1, 
      convRule: rule2
  }, {
      start: 1566, 
      length: 2, 
      convRule: rule2
  }, {
      start: 1568, 
      length: 32, 
      convRule: rule45
  }, {
      start: 1600, 
      length: 1, 
      convRule: rule83
  }, {
      start: 1601, 
      length: 10, 
      convRule: rule45
  }, {
      start: 1611, 
      length: 21, 
      convRule: rule84
  }, {
      start: 1632, 
      length: 10, 
      convRule: rule8
  }, {
      start: 1642, 
      length: 4, 
      convRule: rule2
  }, {
      start: 1646, 
      length: 2, 
      convRule: rule45
  }, {
      start: 1648, 
      length: 1, 
      convRule: rule84
  }, {
      start: 1649, 
      length: 99, 
      convRule: rule45
  }, {
      start: 1748, 
      length: 1, 
      convRule: rule2
  }, {
      start: 1749, 
      length: 1, 
      convRule: rule45
  }, {
      start: 1750, 
      length: 7, 
      convRule: rule84
  }, {
      start: 1757, 
      length: 1, 
      convRule: rule16
  }, {
      start: 1758, 
      length: 1, 
      convRule: rule13
  }, {
      start: 1759, 
      length: 6, 
      convRule: rule84
  }, {
      start: 1765, 
      length: 2, 
      convRule: rule83
  }, {
      start: 1767, 
      length: 2, 
      convRule: rule84
  }, {
      start: 1769, 
      length: 1, 
      convRule: rule13
  }, {
      start: 1770, 
      length: 4, 
      convRule: rule84
  }, {
      start: 1774, 
      length: 2, 
      convRule: rule45
  }, {
      start: 1776, 
      length: 10, 
      convRule: rule8
  }, {
      start: 1786, 
      length: 3, 
      convRule: rule45
  }, {
      start: 1789, 
      length: 2, 
      convRule: rule13
  }, {
      start: 1791, 
      length: 1, 
      convRule: rule45
  }, {
      start: 1792, 
      length: 14, 
      convRule: rule2
  }, {
      start: 1807, 
      length: 1, 
      convRule: rule16
  }, {
      start: 1808, 
      length: 1, 
      convRule: rule45
  }, {
      start: 1809, 
      length: 1, 
      convRule: rule84
  }, {
      start: 1810, 
      length: 30, 
      convRule: rule45
  }, {
      start: 1840, 
      length: 27, 
      convRule: rule84
  }, {
      start: 1869, 
      length: 89, 
      convRule: rule45
  }, {
      start: 1958, 
      length: 11, 
      convRule: rule84
  }, {
      start: 1969, 
      length: 1, 
      convRule: rule45
  }, {
      start: 1984, 
      length: 10, 
      convRule: rule8
  }, {
      start: 1994, 
      length: 33, 
      convRule: rule45
  }, {
      start: 2027, 
      length: 9, 
      convRule: rule84
  }, {
      start: 2036, 
      length: 2, 
      convRule: rule83
  }, {
      start: 2038, 
      length: 1, 
      convRule: rule13
  }, {
      start: 2039, 
      length: 3, 
      convRule: rule2
  }, {
      start: 2042, 
      length: 1, 
      convRule: rule83
  }, {
      start: 2048, 
      length: 22, 
      convRule: rule45
  }, {
      start: 2070, 
      length: 4, 
      convRule: rule84
  }, {
      start: 2074, 
      length: 1, 
      convRule: rule83
  }, {
      start: 2075, 
      length: 9, 
      convRule: rule84
  }, {
      start: 2084, 
      length: 1, 
      convRule: rule83
  }, {
      start: 2085, 
      length: 3, 
      convRule: rule84
  }, {
      start: 2088, 
      length: 1, 
      convRule: rule83
  }, {
      start: 2089, 
      length: 5, 
      convRule: rule84
  }, {
      start: 2096, 
      length: 15, 
      convRule: rule2
  }, {
      start: 2112, 
      length: 25, 
      convRule: rule45
  }, {
      start: 2137, 
      length: 3, 
      convRule: rule84
  }, {
      start: 2142, 
      length: 1, 
      convRule: rule2
  }, {
      start: 2304, 
      length: 3, 
      convRule: rule84
  }, {
      start: 2307, 
      length: 1, 
      convRule: rule114
  }, {
      start: 2308, 
      length: 54, 
      convRule: rule45
  }, {
      start: 2362, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2363, 
      length: 1, 
      convRule: rule114
  }, {
      start: 2364, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2365, 
      length: 1, 
      convRule: rule45
  }, {
      start: 2366, 
      length: 3, 
      convRule: rule114
  }, {
      start: 2369, 
      length: 8, 
      convRule: rule84
  }, {
      start: 2377, 
      length: 4, 
      convRule: rule114
  }, {
      start: 2381, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2382, 
      length: 2, 
      convRule: rule114
  }, {
      start: 2384, 
      length: 1, 
      convRule: rule45
  }, {
      start: 2385, 
      length: 7, 
      convRule: rule84
  }, {
      start: 2392, 
      length: 10, 
      convRule: rule45
  }, {
      start: 2402, 
      length: 2, 
      convRule: rule84
  }, {
      start: 2404, 
      length: 2, 
      convRule: rule2
  }, {
      start: 2406, 
      length: 10, 
      convRule: rule8
  }, {
      start: 2416, 
      length: 1, 
      convRule: rule2
  }, {
      start: 2417, 
      length: 1, 
      convRule: rule83
  }, {
      start: 2418, 
      length: 6, 
      convRule: rule45
  }, {
      start: 2425, 
      length: 7, 
      convRule: rule45
  }, {
      start: 2433, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2434, 
      length: 2, 
      convRule: rule114
  }, {
      start: 2437, 
      length: 8, 
      convRule: rule45
  }, {
      start: 2447, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2451, 
      length: 22, 
      convRule: rule45
  }, {
      start: 2474, 
      length: 7, 
      convRule: rule45
  }, {
      start: 2482, 
      length: 1, 
      convRule: rule45
  }, {
      start: 2486, 
      length: 4, 
      convRule: rule45
  }, {
      start: 2492, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2493, 
      length: 1, 
      convRule: rule45
  }, {
      start: 2494, 
      length: 3, 
      convRule: rule114
  }, {
      start: 2497, 
      length: 4, 
      convRule: rule84
  }, {
      start: 2503, 
      length: 2, 
      convRule: rule114
  }, {
      start: 2507, 
      length: 2, 
      convRule: rule114
  }, {
      start: 2509, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2510, 
      length: 1, 
      convRule: rule45
  }, {
      start: 2519, 
      length: 1, 
      convRule: rule114
  }, {
      start: 2524, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2527, 
      length: 3, 
      convRule: rule45
  }, {
      start: 2530, 
      length: 2, 
      convRule: rule84
  }, {
      start: 2534, 
      length: 10, 
      convRule: rule8
  }, {
      start: 2544, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2546, 
      length: 2, 
      convRule: rule3
  }, {
      start: 2548, 
      length: 6, 
      convRule: rule17
  }, {
      start: 2554, 
      length: 1, 
      convRule: rule13
  }, {
      start: 2555, 
      length: 1, 
      convRule: rule3
  }, {
      start: 2561, 
      length: 2, 
      convRule: rule84
  }, {
      start: 2563, 
      length: 1, 
      convRule: rule114
  }, {
      start: 2565, 
      length: 6, 
      convRule: rule45
  }, {
      start: 2575, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2579, 
      length: 22, 
      convRule: rule45
  }, {
      start: 2602, 
      length: 7, 
      convRule: rule45
  }, {
      start: 2610, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2613, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2616, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2620, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2622, 
      length: 3, 
      convRule: rule114
  }, {
      start: 2625, 
      length: 2, 
      convRule: rule84
  }, {
      start: 2631, 
      length: 2, 
      convRule: rule84
  }, {
      start: 2635, 
      length: 3, 
      convRule: rule84
  }, {
      start: 2641, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2649, 
      length: 4, 
      convRule: rule45
  }, {
      start: 2654, 
      length: 1, 
      convRule: rule45
  }, {
      start: 2662, 
      length: 10, 
      convRule: rule8
  }, {
      start: 2672, 
      length: 2, 
      convRule: rule84
  }, {
      start: 2674, 
      length: 3, 
      convRule: rule45
  }, {
      start: 2677, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2689, 
      length: 2, 
      convRule: rule84
  }, {
      start: 2691, 
      length: 1, 
      convRule: rule114
  }, {
      start: 2693, 
      length: 9, 
      convRule: rule45
  }, {
      start: 2703, 
      length: 3, 
      convRule: rule45
  }, {
      start: 2707, 
      length: 22, 
      convRule: rule45
  }, {
      start: 2730, 
      length: 7, 
      convRule: rule45
  }, {
      start: 2738, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2741, 
      length: 5, 
      convRule: rule45
  }, {
      start: 2748, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2749, 
      length: 1, 
      convRule: rule45
  }, {
      start: 2750, 
      length: 3, 
      convRule: rule114
  }, {
      start: 2753, 
      length: 5, 
      convRule: rule84
  }, {
      start: 2759, 
      length: 2, 
      convRule: rule84
  }, {
      start: 2761, 
      length: 1, 
      convRule: rule114
  }, {
      start: 2763, 
      length: 2, 
      convRule: rule114
  }, {
      start: 2765, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2768, 
      length: 1, 
      convRule: rule45
  }, {
      start: 2784, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2786, 
      length: 2, 
      convRule: rule84
  }, {
      start: 2790, 
      length: 10, 
      convRule: rule8
  }, {
      start: 2801, 
      length: 1, 
      convRule: rule3
  }, {
      start: 2817, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2818, 
      length: 2, 
      convRule: rule114
  }, {
      start: 2821, 
      length: 8, 
      convRule: rule45
  }, {
      start: 2831, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2835, 
      length: 22, 
      convRule: rule45
  }, {
      start: 2858, 
      length: 7, 
      convRule: rule45
  }, {
      start: 2866, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2869, 
      length: 5, 
      convRule: rule45
  }, {
      start: 2876, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2877, 
      length: 1, 
      convRule: rule45
  }, {
      start: 2878, 
      length: 1, 
      convRule: rule114
  }, {
      start: 2879, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2880, 
      length: 1, 
      convRule: rule114
  }, {
      start: 2881, 
      length: 4, 
      convRule: rule84
  }, {
      start: 2887, 
      length: 2, 
      convRule: rule114
  }, {
      start: 2891, 
      length: 2, 
      convRule: rule114
  }, {
      start: 2893, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2902, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2903, 
      length: 1, 
      convRule: rule114
  }, {
      start: 2908, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2911, 
      length: 3, 
      convRule: rule45
  }, {
      start: 2914, 
      length: 2, 
      convRule: rule84
  }, {
      start: 2918, 
      length: 10, 
      convRule: rule8
  }, {
      start: 2928, 
      length: 1, 
      convRule: rule13
  }, {
      start: 2929, 
      length: 1, 
      convRule: rule45
  }, {
      start: 2930, 
      length: 6, 
      convRule: rule17
  }, {
      start: 2946, 
      length: 1, 
      convRule: rule84
  }, {
      start: 2947, 
      length: 1, 
      convRule: rule45
  }, {
      start: 2949, 
      length: 6, 
      convRule: rule45
  }, {
      start: 2958, 
      length: 3, 
      convRule: rule45
  }, {
      start: 2962, 
      length: 4, 
      convRule: rule45
  }, {
      start: 2969, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2972, 
      length: 1, 
      convRule: rule45
  }, {
      start: 2974, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2979, 
      length: 2, 
      convRule: rule45
  }, {
      start: 2984, 
      length: 3, 
      convRule: rule45
  }, {
      start: 2990, 
      length: 12, 
      convRule: rule45
  }, {
      start: 3006, 
      length: 2, 
      convRule: rule114
  }, {
      start: 3008, 
      length: 1, 
      convRule: rule84
  }, {
      start: 3009, 
      length: 2, 
      convRule: rule114
  }, {
      start: 3014, 
      length: 3, 
      convRule: rule114
  }, {
      start: 3018, 
      length: 3, 
      convRule: rule114
  }, {
      start: 3021, 
      length: 1, 
      convRule: rule84
  }, {
      start: 3024, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3031, 
      length: 1, 
      convRule: rule114
  }, {
      start: 3046, 
      length: 10, 
      convRule: rule8
  }, {
      start: 3056, 
      length: 3, 
      convRule: rule17
  }, {
      start: 3059, 
      length: 6, 
      convRule: rule13
  }, {
      start: 3065, 
      length: 1, 
      convRule: rule3
  }, {
      start: 3066, 
      length: 1, 
      convRule: rule13
  }, {
      start: 3073, 
      length: 3, 
      convRule: rule114
  }, {
      start: 3077, 
      length: 8, 
      convRule: rule45
  }, {
      start: 3086, 
      length: 3, 
      convRule: rule45
  }, {
      start: 3090, 
      length: 23, 
      convRule: rule45
  }, {
      start: 3114, 
      length: 10, 
      convRule: rule45
  }, {
      start: 3125, 
      length: 5, 
      convRule: rule45
  }, {
      start: 3133, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3134, 
      length: 3, 
      convRule: rule84
  }, {
      start: 3137, 
      length: 4, 
      convRule: rule114
  }, {
      start: 3142, 
      length: 3, 
      convRule: rule84
  }, {
      start: 3146, 
      length: 4, 
      convRule: rule84
  }, {
      start: 3157, 
      length: 2, 
      convRule: rule84
  }, {
      start: 3160, 
      length: 2, 
      convRule: rule45
  }, {
      start: 3168, 
      length: 2, 
      convRule: rule45
  }, {
      start: 3170, 
      length: 2, 
      convRule: rule84
  }, {
      start: 3174, 
      length: 10, 
      convRule: rule8
  }, {
      start: 3192, 
      length: 7, 
      convRule: rule17
  }, {
      start: 3199, 
      length: 1, 
      convRule: rule13
  }, {
      start: 3202, 
      length: 2, 
      convRule: rule114
  }, {
      start: 3205, 
      length: 8, 
      convRule: rule45
  }, {
      start: 3214, 
      length: 3, 
      convRule: rule45
  }, {
      start: 3218, 
      length: 23, 
      convRule: rule45
  }, {
      start: 3242, 
      length: 10, 
      convRule: rule45
  }, {
      start: 3253, 
      length: 5, 
      convRule: rule45
  }, {
      start: 3260, 
      length: 1, 
      convRule: rule84
  }, {
      start: 3261, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3262, 
      length: 1, 
      convRule: rule114
  }, {
      start: 3263, 
      length: 1, 
      convRule: rule84
  }, {
      start: 3264, 
      length: 5, 
      convRule: rule114
  }, {
      start: 3270, 
      length: 1, 
      convRule: rule84
  }, {
      start: 3271, 
      length: 2, 
      convRule: rule114
  }, {
      start: 3274, 
      length: 2, 
      convRule: rule114
  }, {
      start: 3276, 
      length: 2, 
      convRule: rule84
  }, {
      start: 3285, 
      length: 2, 
      convRule: rule114
  }, {
      start: 3294, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3296, 
      length: 2, 
      convRule: rule45
  }, {
      start: 3298, 
      length: 2, 
      convRule: rule84
  }, {
      start: 3302, 
      length: 10, 
      convRule: rule8
  }, {
      start: 3313, 
      length: 2, 
      convRule: rule45
  }, {
      start: 3330, 
      length: 2, 
      convRule: rule114
  }, {
      start: 3333, 
      length: 8, 
      convRule: rule45
  }, {
      start: 3342, 
      length: 3, 
      convRule: rule45
  }, {
      start: 3346, 
      length: 41, 
      convRule: rule45
  }, {
      start: 3389, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3390, 
      length: 3, 
      convRule: rule114
  }, {
      start: 3393, 
      length: 4, 
      convRule: rule84
  }, {
      start: 3398, 
      length: 3, 
      convRule: rule114
  }, {
      start: 3402, 
      length: 3, 
      convRule: rule114
  }, {
      start: 3405, 
      length: 1, 
      convRule: rule84
  }, {
      start: 3406, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3415, 
      length: 1, 
      convRule: rule114
  }, {
      start: 3424, 
      length: 2, 
      convRule: rule45
  }, {
      start: 3426, 
      length: 2, 
      convRule: rule84
  }, {
      start: 3430, 
      length: 10, 
      convRule: rule8
  }, {
      start: 3440, 
      length: 6, 
      convRule: rule17
  }, {
      start: 3449, 
      length: 1, 
      convRule: rule13
  }, {
      start: 3450, 
      length: 6, 
      convRule: rule45
  }, {
      start: 3458, 
      length: 2, 
      convRule: rule114
  }, {
      start: 3461, 
      length: 18, 
      convRule: rule45
  }, {
      start: 3482, 
      length: 24, 
      convRule: rule45
  }, {
      start: 3507, 
      length: 9, 
      convRule: rule45
  }, {
      start: 3517, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3520, 
      length: 7, 
      convRule: rule45
  }, {
      start: 3530, 
      length: 1, 
      convRule: rule84
  }, {
      start: 3535, 
      length: 3, 
      convRule: rule114
  }, {
      start: 3538, 
      length: 3, 
      convRule: rule84
  }, {
      start: 3542, 
      length: 1, 
      convRule: rule84
  }, {
      start: 3544, 
      length: 8, 
      convRule: rule114
  }, {
      start: 3570, 
      length: 2, 
      convRule: rule114
  }, {
      start: 3572, 
      length: 1, 
      convRule: rule2
  }, {
      start: 3585, 
      length: 48, 
      convRule: rule45
  }, {
      start: 3633, 
      length: 1, 
      convRule: rule84
  }, {
      start: 3634, 
      length: 2, 
      convRule: rule45
  }, {
      start: 3636, 
      length: 7, 
      convRule: rule84
  }, {
      start: 3647, 
      length: 1, 
      convRule: rule3
  }, {
      start: 3648, 
      length: 6, 
      convRule: rule45
  }, {
      start: 3654, 
      length: 1, 
      convRule: rule83
  }, {
      start: 3655, 
      length: 8, 
      convRule: rule84
  }, {
      start: 3663, 
      length: 1, 
      convRule: rule2
  }, {
      start: 3664, 
      length: 10, 
      convRule: rule8
  }, {
      start: 3674, 
      length: 2, 
      convRule: rule2
  }, {
      start: 3713, 
      length: 2, 
      convRule: rule45
  }, {
      start: 3716, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3719, 
      length: 2, 
      convRule: rule45
  }, {
      start: 3722, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3725, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3732, 
      length: 4, 
      convRule: rule45
  }, {
      start: 3737, 
      length: 7, 
      convRule: rule45
  }, {
      start: 3745, 
      length: 3, 
      convRule: rule45
  }, {
      start: 3749, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3751, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3754, 
      length: 2, 
      convRule: rule45
  }, {
      start: 3757, 
      length: 4, 
      convRule: rule45
  }, {
      start: 3761, 
      length: 1, 
      convRule: rule84
  }, {
      start: 3762, 
      length: 2, 
      convRule: rule45
  }, {
      start: 3764, 
      length: 6, 
      convRule: rule84
  }, {
      start: 3771, 
      length: 2, 
      convRule: rule84
  }, {
      start: 3773, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3776, 
      length: 5, 
      convRule: rule45
  }, {
      start: 3782, 
      length: 1, 
      convRule: rule83
  }, {
      start: 3784, 
      length: 6, 
      convRule: rule84
  }, {
      start: 3792, 
      length: 10, 
      convRule: rule8
  }, {
      start: 3804, 
      length: 2, 
      convRule: rule45
  }, {
      start: 3840, 
      length: 1, 
      convRule: rule45
  }, {
      start: 3841, 
      length: 3, 
      convRule: rule13
  }, {
      start: 3844, 
      length: 15, 
      convRule: rule2
  }, {
      start: 3859, 
      length: 5, 
      convRule: rule13
  }, {
      start: 3864, 
      length: 2, 
      convRule: rule84
  }, {
      start: 3866, 
      length: 6, 
      convRule: rule13
  }, {
      start: 3872, 
      length: 10, 
      convRule: rule8
  }, {
      start: 3882, 
      length: 10, 
      convRule: rule17
  }, {
      start: 3892, 
      length: 1, 
      convRule: rule13
  }, {
      start: 3893, 
      length: 1, 
      convRule: rule84
  }, {
      start: 3894, 
      length: 1, 
      convRule: rule13
  }, {
      start: 3895, 
      length: 1, 
      convRule: rule84
  }, {
      start: 3896, 
      length: 1, 
      convRule: rule13
  }, {
      start: 3897, 
      length: 1, 
      convRule: rule84
  }, {
      start: 3898, 
      length: 1, 
      convRule: rule4
  }, {
      start: 3899, 
      length: 1, 
      convRule: rule5
  }, {
      start: 3900, 
      length: 1, 
      convRule: rule4
  }, {
      start: 3901, 
      length: 1, 
      convRule: rule5
  }, {
      start: 3902, 
      length: 2, 
      convRule: rule114
  }, {
      start: 3904, 
      length: 8, 
      convRule: rule45
  }, {
      start: 3913, 
      length: 36, 
      convRule: rule45
  }, {
      start: 3953, 
      length: 14, 
      convRule: rule84
  }, {
      start: 3967, 
      length: 1, 
      convRule: rule114
  }, {
      start: 3968, 
      length: 5, 
      convRule: rule84
  }, {
      start: 3973, 
      length: 1, 
      convRule: rule2
  }, {
      start: 3974, 
      length: 2, 
      convRule: rule84
  }, {
      start: 3976, 
      length: 5, 
      convRule: rule45
  }, {
      start: 3981, 
      length: 11, 
      convRule: rule84
  }, {
      start: 3993, 
      length: 36, 
      convRule: rule84
  }, {
      start: 4030, 
      length: 8, 
      convRule: rule13
  }, {
      start: 4038, 
      length: 1, 
      convRule: rule84
  }, {
      start: 4039, 
      length: 6, 
      convRule: rule13
  }, {
      start: 4046, 
      length: 2, 
      convRule: rule13
  }, {
      start: 4048, 
      length: 5, 
      convRule: rule2
  }, {
      start: 4053, 
      length: 4, 
      convRule: rule13
  }, {
      start: 4057, 
      length: 2, 
      convRule: rule2
  }, {
      start: 4096, 
      length: 43, 
      convRule: rule45
  }, {
      start: 4139, 
      length: 2, 
      convRule: rule114
  }, {
      start: 4141, 
      length: 4, 
      convRule: rule84
  }, {
      start: 4145, 
      length: 1, 
      convRule: rule114
  }, {
      start: 4146, 
      length: 6, 
      convRule: rule84
  }, {
      start: 4152, 
      length: 1, 
      convRule: rule114
  }, {
      start: 4153, 
      length: 2, 
      convRule: rule84
  }, {
      start: 4155, 
      length: 2, 
      convRule: rule114
  }, {
      start: 4157, 
      length: 2, 
      convRule: rule84
  }, {
      start: 4159, 
      length: 1, 
      convRule: rule45
  }, {
      start: 4160, 
      length: 10, 
      convRule: rule8
  }, {
      start: 4170, 
      length: 6, 
      convRule: rule2
  }, {
      start: 4176, 
      length: 6, 
      convRule: rule45
  }, {
      start: 4182, 
      length: 2, 
      convRule: rule114
  }, {
      start: 4184, 
      length: 2, 
      convRule: rule84
  }, {
      start: 4186, 
      length: 4, 
      convRule: rule45
  }, {
      start: 4190, 
      length: 3, 
      convRule: rule84
  }, {
      start: 4193, 
      length: 1, 
      convRule: rule45
  }, {
      start: 4194, 
      length: 3, 
      convRule: rule114
  }, {
      start: 4197, 
      length: 2, 
      convRule: rule45
  }, {
      start: 4199, 
      length: 7, 
      convRule: rule114
  }, {
      start: 4206, 
      length: 3, 
      convRule: rule45
  }, {
      start: 4209, 
      length: 4, 
      convRule: rule84
  }, {
      start: 4213, 
      length: 13, 
      convRule: rule45
  }, {
      start: 4226, 
      length: 1, 
      convRule: rule84
  }, {
      start: 4227, 
      length: 2, 
      convRule: rule114
  }, {
      start: 4229, 
      length: 2, 
      convRule: rule84
  }, {
      start: 4231, 
      length: 6, 
      convRule: rule114
  }, {
      start: 4237, 
      length: 1, 
      convRule: rule84
  }, {
      start: 4238, 
      length: 1, 
      convRule: rule45
  }, {
      start: 4239, 
      length: 1, 
      convRule: rule114
  }, {
      start: 4240, 
      length: 10, 
      convRule: rule8
  }, {
      start: 4250, 
      length: 3, 
      convRule: rule114
  }, {
      start: 4253, 
      length: 1, 
      convRule: rule84
  }, {
      start: 4254, 
      length: 2, 
      convRule: rule13
  }, {
      start: 4256, 
      length: 38, 
      convRule: rule115
  }, {
      start: 4304, 
      length: 43, 
      convRule: rule45
  }, {
      start: 4347, 
      length: 1, 
      convRule: rule2
  }, {
      start: 4348, 
      length: 1, 
      convRule: rule83
  }, {
      start: 4352, 
      length: 329, 
      convRule: rule45
  }, {
      start: 4682, 
      length: 4, 
      convRule: rule45
  }, {
      start: 4688, 
      length: 7, 
      convRule: rule45
  }, {
      start: 4696, 
      length: 1, 
      convRule: rule45
  }, {
      start: 4698, 
      length: 4, 
      convRule: rule45
  }, {
      start: 4704, 
      length: 41, 
      convRule: rule45
  }, {
      start: 4746, 
      length: 4, 
      convRule: rule45
  }, {
      start: 4752, 
      length: 33, 
      convRule: rule45
  }, {
      start: 4786, 
      length: 4, 
      convRule: rule45
  }, {
      start: 4792, 
      length: 7, 
      convRule: rule45
  }, {
      start: 4800, 
      length: 1, 
      convRule: rule45
  }, {
      start: 4802, 
      length: 4, 
      convRule: rule45
  }, {
      start: 4808, 
      length: 15, 
      convRule: rule45
  }, {
      start: 4824, 
      length: 57, 
      convRule: rule45
  }, {
      start: 4882, 
      length: 4, 
      convRule: rule45
  }, {
      start: 4888, 
      length: 67, 
      convRule: rule45
  }, {
      start: 4957, 
      length: 3, 
      convRule: rule84
  }, {
      start: 4960, 
      length: 1, 
      convRule: rule13
  }, {
      start: 4961, 
      length: 8, 
      convRule: rule2
  }, {
      start: 4969, 
      length: 20, 
      convRule: rule17
  }, {
      start: 4992, 
      length: 16, 
      convRule: rule45
  }, {
      start: 5008, 
      length: 10, 
      convRule: rule13
  }, {
      start: 5024, 
      length: 85, 
      convRule: rule45
  }, {
      start: 5120, 
      length: 1, 
      convRule: rule7
  }, {
      start: 5121, 
      length: 620, 
      convRule: rule45
  }, {
      start: 5741, 
      length: 2, 
      convRule: rule2
  }, {
      start: 5743, 
      length: 17, 
      convRule: rule45
  }, {
      start: 5760, 
      length: 1, 
      convRule: rule1
  }, {
      start: 5761, 
      length: 26, 
      convRule: rule45
  }, {
      start: 5787, 
      length: 1, 
      convRule: rule4
  }, {
      start: 5788, 
      length: 1, 
      convRule: rule5
  }, {
      start: 5792, 
      length: 75, 
      convRule: rule45
  }, {
      start: 5867, 
      length: 3, 
      convRule: rule2
  }, {
      start: 5870, 
      length: 3, 
      convRule: rule116
  }, {
      start: 5888, 
      length: 13, 
      convRule: rule45
  }, {
      start: 5902, 
      length: 4, 
      convRule: rule45
  }, {
      start: 5906, 
      length: 3, 
      convRule: rule84
  }, {
      start: 5920, 
      length: 18, 
      convRule: rule45
  }, {
      start: 5938, 
      length: 3, 
      convRule: rule84
  }, {
      start: 5941, 
      length: 2, 
      convRule: rule2
  }, {
      start: 5952, 
      length: 18, 
      convRule: rule45
  }, {
      start: 5970, 
      length: 2, 
      convRule: rule84
  }, {
      start: 5984, 
      length: 13, 
      convRule: rule45
  }, {
      start: 5998, 
      length: 3, 
      convRule: rule45
  }, {
      start: 6002, 
      length: 2, 
      convRule: rule84
  }, {
      start: 6016, 
      length: 52, 
      convRule: rule45
  }, {
      start: 6068, 
      length: 2, 
      convRule: rule16
  }, {
      start: 6070, 
      length: 1, 
      convRule: rule114
  }, {
      start: 6071, 
      length: 7, 
      convRule: rule84
  }, {
      start: 6078, 
      length: 8, 
      convRule: rule114
  }, {
      start: 6086, 
      length: 1, 
      convRule: rule84
  }, {
      start: 6087, 
      length: 2, 
      convRule: rule114
  }, {
      start: 6089, 
      length: 11, 
      convRule: rule84
  }, {
      start: 6100, 
      length: 3, 
      convRule: rule2
  }, {
      start: 6103, 
      length: 1, 
      convRule: rule83
  }, {
      start: 6104, 
      length: 3, 
      convRule: rule2
  }, {
      start: 6107, 
      length: 1, 
      convRule: rule3
  }, {
      start: 6108, 
      length: 1, 
      convRule: rule45
  }, {
      start: 6109, 
      length: 1, 
      convRule: rule84
  }, {
      start: 6112, 
      length: 10, 
      convRule: rule8
  }, {
      start: 6128, 
      length: 10, 
      convRule: rule17
  }, {
      start: 6144, 
      length: 6, 
      convRule: rule2
  }, {
      start: 6150, 
      length: 1, 
      convRule: rule7
  }, {
      start: 6151, 
      length: 4, 
      convRule: rule2
  }, {
      start: 6155, 
      length: 3, 
      convRule: rule84
  }, {
      start: 6158, 
      length: 1, 
      convRule: rule1
  }, {
      start: 6160, 
      length: 10, 
      convRule: rule8
  }, {
      start: 6176, 
      length: 35, 
      convRule: rule45
  }, {
      start: 6211, 
      length: 1, 
      convRule: rule83
  }, {
      start: 6212, 
      length: 52, 
      convRule: rule45
  }, {
      start: 6272, 
      length: 41, 
      convRule: rule45
  }, {
      start: 6313, 
      length: 1, 
      convRule: rule84
  }, {
      start: 6314, 
      length: 1, 
      convRule: rule45
  }, {
      start: 6320, 
      length: 70, 
      convRule: rule45
  }, {
      start: 6400, 
      length: 29, 
      convRule: rule45
  }, {
      start: 6432, 
      length: 3, 
      convRule: rule84
  }, {
      start: 6435, 
      length: 4, 
      convRule: rule114
  }, {
      start: 6439, 
      length: 2, 
      convRule: rule84
  }, {
      start: 6441, 
      length: 3, 
      convRule: rule114
  }, {
      start: 6448, 
      length: 2, 
      convRule: rule114
  }, {
      start: 6450, 
      length: 1, 
      convRule: rule84
  }, {
      start: 6451, 
      length: 6, 
      convRule: rule114
  }, {
      start: 6457, 
      length: 3, 
      convRule: rule84
  }, {
      start: 6464, 
      length: 1, 
      convRule: rule13
  }, {
      start: 6468, 
      length: 2, 
      convRule: rule2
  }, {
      start: 6470, 
      length: 10, 
      convRule: rule8
  }, {
      start: 6480, 
      length: 30, 
      convRule: rule45
  }, {
      start: 6512, 
      length: 5, 
      convRule: rule45
  }, {
      start: 6528, 
      length: 44, 
      convRule: rule45
  }, {
      start: 6576, 
      length: 17, 
      convRule: rule114
  }, {
      start: 6593, 
      length: 7, 
      convRule: rule45
  }, {
      start: 6600, 
      length: 2, 
      convRule: rule114
  }, {
      start: 6608, 
      length: 10, 
      convRule: rule8
  }, {
      start: 6618, 
      length: 1, 
      convRule: rule17
  }, {
      start: 6622, 
      length: 34, 
      convRule: rule13
  }, {
      start: 6656, 
      length: 23, 
      convRule: rule45
  }, {
      start: 6679, 
      length: 2, 
      convRule: rule84
  }, {
      start: 6681, 
      length: 3, 
      convRule: rule114
  }, {
      start: 6686, 
      length: 2, 
      convRule: rule2
  }, {
      start: 6688, 
      length: 53, 
      convRule: rule45
  }, {
      start: 6741, 
      length: 1, 
      convRule: rule114
  }, {
      start: 6742, 
      length: 1, 
      convRule: rule84
  }, {
      start: 6743, 
      length: 1, 
      convRule: rule114
  }, {
      start: 6744, 
      length: 7, 
      convRule: rule84
  }, {
      start: 6752, 
      length: 1, 
      convRule: rule84
  }, {
      start: 6753, 
      length: 1, 
      convRule: rule114
  }, {
      start: 6754, 
      length: 1, 
      convRule: rule84
  }, {
      start: 6755, 
      length: 2, 
      convRule: rule114
  }, {
      start: 6757, 
      length: 8, 
      convRule: rule84
  }, {
      start: 6765, 
      length: 6, 
      convRule: rule114
  }, {
      start: 6771, 
      length: 10, 
      convRule: rule84
  }, {
      start: 6783, 
      length: 1, 
      convRule: rule84
  }, {
      start: 6784, 
      length: 10, 
      convRule: rule8
  }, {
      start: 6800, 
      length: 10, 
      convRule: rule8
  }, {
      start: 6816, 
      length: 7, 
      convRule: rule2
  }, {
      start: 6823, 
      length: 1, 
      convRule: rule83
  }, {
      start: 6824, 
      length: 6, 
      convRule: rule2
  }, {
      start: 6912, 
      length: 4, 
      convRule: rule84
  }, {
      start: 6916, 
      length: 1, 
      convRule: rule114
  }, {
      start: 6917, 
      length: 47, 
      convRule: rule45
  }, {
      start: 6964, 
      length: 1, 
      convRule: rule84
  }, {
      start: 6965, 
      length: 1, 
      convRule: rule114
  }, {
      start: 6966, 
      length: 5, 
      convRule: rule84
  }, {
      start: 6971, 
      length: 1, 
      convRule: rule114
  }, {
      start: 6972, 
      length: 1, 
      convRule: rule84
  }, {
      start: 6973, 
      length: 5, 
      convRule: rule114
  }, {
      start: 6978, 
      length: 1, 
      convRule: rule84
  }, {
      start: 6979, 
      length: 2, 
      convRule: rule114
  }, {
      start: 6981, 
      length: 7, 
      convRule: rule45
  }, {
      start: 6992, 
      length: 10, 
      convRule: rule8
  }, {
      start: 7002, 
      length: 7, 
      convRule: rule2
  }, {
      start: 7009, 
      length: 10, 
      convRule: rule13
  }, {
      start: 7019, 
      length: 9, 
      convRule: rule84
  }, {
      start: 7028, 
      length: 9, 
      convRule: rule13
  }, {
      start: 7040, 
      length: 2, 
      convRule: rule84
  }, {
      start: 7042, 
      length: 1, 
      convRule: rule114
  }, {
      start: 7043, 
      length: 30, 
      convRule: rule45
  }, {
      start: 7073, 
      length: 1, 
      convRule: rule114
  }, {
      start: 7074, 
      length: 4, 
      convRule: rule84
  }, {
      start: 7078, 
      length: 2, 
      convRule: rule114
  }, {
      start: 7080, 
      length: 2, 
      convRule: rule84
  }, {
      start: 7082, 
      length: 1, 
      convRule: rule114
  }, {
      start: 7086, 
      length: 2, 
      convRule: rule45
  }, {
      start: 7088, 
      length: 10, 
      convRule: rule8
  }, {
      start: 7104, 
      length: 38, 
      convRule: rule45
  }, {
      start: 7142, 
      length: 1, 
      convRule: rule84
  }, {
      start: 7143, 
      length: 1, 
      convRule: rule114
  }, {
      start: 7144, 
      length: 2, 
      convRule: rule84
  }, {
      start: 7146, 
      length: 3, 
      convRule: rule114
  }, {
      start: 7149, 
      length: 1, 
      convRule: rule84
  }, {
      start: 7150, 
      length: 1, 
      convRule: rule114
  }, {
      start: 7151, 
      length: 3, 
      convRule: rule84
  }, {
      start: 7154, 
      length: 2, 
      convRule: rule114
  }, {
      start: 7164, 
      length: 4, 
      convRule: rule2
  }, {
      start: 7168, 
      length: 36, 
      convRule: rule45
  }, {
      start: 7204, 
      length: 8, 
      convRule: rule114
  }, {
      start: 7212, 
      length: 8, 
      convRule: rule84
  }, {
      start: 7220, 
      length: 2, 
      convRule: rule114
  }, {
      start: 7222, 
      length: 2, 
      convRule: rule84
  }, {
      start: 7227, 
      length: 5, 
      convRule: rule2
  }, {
      start: 7232, 
      length: 10, 
      convRule: rule8
  }, {
      start: 7245, 
      length: 3, 
      convRule: rule45
  }, {
      start: 7248, 
      length: 10, 
      convRule: rule8
  }, {
      start: 7258, 
      length: 30, 
      convRule: rule45
  }, {
      start: 7288, 
      length: 6, 
      convRule: rule83
  }, {
      start: 7294, 
      length: 2, 
      convRule: rule2
  }, {
      start: 7376, 
      length: 3, 
      convRule: rule84
  }, {
      start: 7379, 
      length: 1, 
      convRule: rule2
  }, {
      start: 7380, 
      length: 13, 
      convRule: rule84
  }, {
      start: 7393, 
      length: 1, 
      convRule: rule114
  }, {
      start: 7394, 
      length: 7, 
      convRule: rule84
  }, {
      start: 7401, 
      length: 4, 
      convRule: rule45
  }, {
      start: 7405, 
      length: 1, 
      convRule: rule84
  }, {
      start: 7406, 
      length: 4, 
      convRule: rule45
  }, {
      start: 7410, 
      length: 1, 
      convRule: rule114
  }, {
      start: 7424, 
      length: 44, 
      convRule: rule14
  }, {
      start: 7468, 
      length: 54, 
      convRule: rule83
  }, {
      start: 7522, 
      length: 22, 
      convRule: rule14
  }, {
      start: 7544, 
      length: 1, 
      convRule: rule83
  }, {
      start: 7545, 
      length: 1, 
      convRule: rule117
  }, {
      start: 7546, 
      length: 3, 
      convRule: rule14
  }, {
      start: 7549, 
      length: 1, 
      convRule: rule118
  }, {
      start: 7550, 
      length: 29, 
      convRule: rule14
  }, {
      start: 7579, 
      length: 37, 
      convRule: rule83
  }, {
      start: 7616, 
      length: 39, 
      convRule: rule84
  }, {
      start: 7676, 
      length: 4, 
      convRule: rule84
  }, {
      start: 7680, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7681, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7682, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7683, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7684, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7685, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7686, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7687, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7688, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7689, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7690, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7691, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7692, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7693, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7694, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7695, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7696, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7697, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7698, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7699, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7700, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7701, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7702, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7703, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7704, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7705, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7706, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7707, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7708, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7709, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7710, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7711, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7712, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7713, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7714, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7715, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7716, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7717, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7718, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7719, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7720, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7721, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7722, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7723, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7724, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7725, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7726, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7727, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7728, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7729, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7730, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7731, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7732, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7733, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7734, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7735, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7736, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7737, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7738, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7739, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7740, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7741, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7742, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7743, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7744, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7745, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7746, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7747, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7748, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7749, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7750, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7751, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7752, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7753, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7754, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7755, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7756, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7757, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7758, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7759, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7760, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7761, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7762, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7763, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7764, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7765, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7766, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7767, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7768, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7769, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7770, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7771, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7772, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7773, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7774, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7775, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7776, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7777, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7778, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7779, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7780, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7781, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7782, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7783, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7784, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7785, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7786, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7787, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7788, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7789, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7790, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7791, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7792, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7793, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7794, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7795, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7796, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7797, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7798, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7799, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7800, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7801, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7802, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7803, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7804, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7805, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7806, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7807, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7808, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7809, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7810, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7811, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7812, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7813, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7814, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7815, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7816, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7817, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7818, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7819, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7820, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7821, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7822, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7823, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7824, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7825, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7826, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7827, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7828, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7829, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7830, 
      length: 5, 
      convRule: rule14
  }, {
      start: 7835, 
      length: 1, 
      convRule: rule119
  }, {
      start: 7836, 
      length: 2, 
      convRule: rule14
  }, {
      start: 7838, 
      length: 1, 
      convRule: rule120
  }, {
      start: 7839, 
      length: 1, 
      convRule: rule14
  }, {
      start: 7840, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7841, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7842, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7843, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7844, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7845, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7846, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7847, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7848, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7849, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7850, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7851, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7852, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7853, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7854, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7855, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7856, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7857, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7858, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7859, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7860, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7861, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7862, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7863, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7864, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7865, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7866, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7867, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7868, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7869, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7870, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7871, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7872, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7873, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7874, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7875, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7876, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7877, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7878, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7879, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7880, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7881, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7882, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7883, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7884, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7885, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7886, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7887, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7888, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7889, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7890, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7891, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7892, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7893, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7894, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7895, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7896, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7897, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7898, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7899, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7900, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7901, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7902, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7903, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7904, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7905, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7906, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7907, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7908, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7909, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7910, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7911, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7912, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7913, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7914, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7915, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7916, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7917, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7918, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7919, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7920, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7921, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7922, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7923, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7924, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7925, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7926, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7927, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7928, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7929, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7930, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7931, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7932, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7933, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7934, 
      length: 1, 
      convRule: rule21
  }, {
      start: 7935, 
      length: 1, 
      convRule: rule22
  }, {
      start: 7936, 
      length: 8, 
      convRule: rule121
  }, {
      start: 7944, 
      length: 8, 
      convRule: rule122
  }, {
      start: 7952, 
      length: 6, 
      convRule: rule121
  }, {
      start: 7960, 
      length: 6, 
      convRule: rule122
  }, {
      start: 7968, 
      length: 8, 
      convRule: rule121
  }, {
      start: 7976, 
      length: 8, 
      convRule: rule122
  }, {
      start: 7984, 
      length: 8, 
      convRule: rule121
  }, {
      start: 7992, 
      length: 8, 
      convRule: rule122
  }, {
      start: 8000, 
      length: 6, 
      convRule: rule121
  }, {
      start: 8008, 
      length: 6, 
      convRule: rule122
  }, {
      start: 8016, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8017, 
      length: 1, 
      convRule: rule121
  }, {
      start: 8018, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8019, 
      length: 1, 
      convRule: rule121
  }, {
      start: 8020, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8021, 
      length: 1, 
      convRule: rule121
  }, {
      start: 8022, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8023, 
      length: 1, 
      convRule: rule121
  }, {
      start: 8025, 
      length: 1, 
      convRule: rule122
  }, {
      start: 8027, 
      length: 1, 
      convRule: rule122
  }, {
      start: 8029, 
      length: 1, 
      convRule: rule122
  }, {
      start: 8031, 
      length: 1, 
      convRule: rule122
  }, {
      start: 8032, 
      length: 8, 
      convRule: rule121
  }, {
      start: 8040, 
      length: 8, 
      convRule: rule122
  }, {
      start: 8048, 
      length: 2, 
      convRule: rule123
  }, {
      start: 8050, 
      length: 4, 
      convRule: rule124
  }, {
      start: 8054, 
      length: 2, 
      convRule: rule125
  }, {
      start: 8056, 
      length: 2, 
      convRule: rule126
  }, {
      start: 8058, 
      length: 2, 
      convRule: rule127
  }, {
      start: 8060, 
      length: 2, 
      convRule: rule128
  }, {
      start: 8064, 
      length: 8, 
      convRule: rule121
  }, {
      start: 8072, 
      length: 8, 
      convRule: rule129
  }, {
      start: 8080, 
      length: 8, 
      convRule: rule121
  }, {
      start: 8088, 
      length: 8, 
      convRule: rule129
  }, {
      start: 8096, 
      length: 8, 
      convRule: rule121
  }, {
      start: 8104, 
      length: 8, 
      convRule: rule129
  }, {
      start: 8112, 
      length: 2, 
      convRule: rule121
  }, {
      start: 8114, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8115, 
      length: 1, 
      convRule: rule130
  }, {
      start: 8116, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8118, 
      length: 2, 
      convRule: rule14
  }, {
      start: 8120, 
      length: 2, 
      convRule: rule122
  }, {
      start: 8122, 
      length: 2, 
      convRule: rule131
  }, {
      start: 8124, 
      length: 1, 
      convRule: rule132
  }, {
      start: 8125, 
      length: 1, 
      convRule: rule10
  }, {
      start: 8126, 
      length: 1, 
      convRule: rule133
  }, {
      start: 8127, 
      length: 3, 
      convRule: rule10
  }, {
      start: 8130, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8131, 
      length: 1, 
      convRule: rule130
  }, {
      start: 8132, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8134, 
      length: 2, 
      convRule: rule14
  }, {
      start: 8136, 
      length: 4, 
      convRule: rule134
  }, {
      start: 8140, 
      length: 1, 
      convRule: rule132
  }, {
      start: 8141, 
      length: 3, 
      convRule: rule10
  }, {
      start: 8144, 
      length: 2, 
      convRule: rule121
  }, {
      start: 8146, 
      length: 2, 
      convRule: rule14
  }, {
      start: 8150, 
      length: 2, 
      convRule: rule14
  }, {
      start: 8152, 
      length: 2, 
      convRule: rule122
  }, {
      start: 8154, 
      length: 2, 
      convRule: rule135
  }, {
      start: 8157, 
      length: 3, 
      convRule: rule10
  }, {
      start: 8160, 
      length: 2, 
      convRule: rule121
  }, {
      start: 8162, 
      length: 3, 
      convRule: rule14
  }, {
      start: 8165, 
      length: 1, 
      convRule: rule104
  }, {
      start: 8166, 
      length: 2, 
      convRule: rule14
  }, {
      start: 8168, 
      length: 2, 
      convRule: rule122
  }, {
      start: 8170, 
      length: 2, 
      convRule: rule136
  }, {
      start: 8172, 
      length: 1, 
      convRule: rule107
  }, {
      start: 8173, 
      length: 3, 
      convRule: rule10
  }, {
      start: 8178, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8179, 
      length: 1, 
      convRule: rule130
  }, {
      start: 8180, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8182, 
      length: 2, 
      convRule: rule14
  }, {
      start: 8184, 
      length: 2, 
      convRule: rule137
  }, {
      start: 8186, 
      length: 2, 
      convRule: rule138
  }, {
      start: 8188, 
      length: 1, 
      convRule: rule132
  }, {
      start: 8189, 
      length: 2, 
      convRule: rule10
  }, {
      start: 8192, 
      length: 11, 
      convRule: rule1
  }, {
      start: 8203, 
      length: 5, 
      convRule: rule16
  }, {
      start: 8208, 
      length: 6, 
      convRule: rule7
  }, {
      start: 8214, 
      length: 2, 
      convRule: rule2
  }, {
      start: 8216, 
      length: 1, 
      convRule: rule15
  }, {
      start: 8217, 
      length: 1, 
      convRule: rule19
  }, {
      start: 8218, 
      length: 1, 
      convRule: rule4
  }, {
      start: 8219, 
      length: 2, 
      convRule: rule15
  }, {
      start: 8221, 
      length: 1, 
      convRule: rule19
  }, {
      start: 8222, 
      length: 1, 
      convRule: rule4
  }, {
      start: 8223, 
      length: 1, 
      convRule: rule15
  }, {
      start: 8224, 
      length: 8, 
      convRule: rule2
  }, {
      start: 8232, 
      length: 1, 
      convRule: rule139
  }, {
      start: 8233, 
      length: 1, 
      convRule: rule140
  }, {
      start: 8234, 
      length: 5, 
      convRule: rule16
  }, {
      start: 8239, 
      length: 1, 
      convRule: rule1
  }, {
      start: 8240, 
      length: 9, 
      convRule: rule2
  }, {
      start: 8249, 
      length: 1, 
      convRule: rule15
  }, {
      start: 8250, 
      length: 1, 
      convRule: rule19
  }, {
      start: 8251, 
      length: 4, 
      convRule: rule2
  }, {
      start: 8255, 
      length: 2, 
      convRule: rule11
  }, {
      start: 8257, 
      length: 3, 
      convRule: rule2
  }, {
      start: 8260, 
      length: 1, 
      convRule: rule6
  }, {
      start: 8261, 
      length: 1, 
      convRule: rule4
  }, {
      start: 8262, 
      length: 1, 
      convRule: rule5
  }, {
      start: 8263, 
      length: 11, 
      convRule: rule2
  }, {
      start: 8274, 
      length: 1, 
      convRule: rule6
  }, {
      start: 8275, 
      length: 1, 
      convRule: rule2
  }, {
      start: 8276, 
      length: 1, 
      convRule: rule11
  }, {
      start: 8277, 
      length: 10, 
      convRule: rule2
  }, {
      start: 8287, 
      length: 1, 
      convRule: rule1
  }, {
      start: 8288, 
      length: 5, 
      convRule: rule16
  }, {
      start: 8298, 
      length: 6, 
      convRule: rule16
  }, {
      start: 8304, 
      length: 1, 
      convRule: rule17
  }, {
      start: 8305, 
      length: 1, 
      convRule: rule83
  }, {
      start: 8308, 
      length: 6, 
      convRule: rule17
  }, {
      start: 8314, 
      length: 3, 
      convRule: rule6
  }, {
      start: 8317, 
      length: 1, 
      convRule: rule4
  }, {
      start: 8318, 
      length: 1, 
      convRule: rule5
  }, {
      start: 8319, 
      length: 1, 
      convRule: rule83
  }, {
      start: 8320, 
      length: 10, 
      convRule: rule17
  }, {
      start: 8330, 
      length: 3, 
      convRule: rule6
  }, {
      start: 8333, 
      length: 1, 
      convRule: rule4
  }, {
      start: 8334, 
      length: 1, 
      convRule: rule5
  }, {
      start: 8336, 
      length: 13, 
      convRule: rule83
  }, {
      start: 8352, 
      length: 26, 
      convRule: rule3
  }, {
      start: 8400, 
      length: 13, 
      convRule: rule84
  }, {
      start: 8413, 
      length: 4, 
      convRule: rule109
  }, {
      start: 8417, 
      length: 1, 
      convRule: rule84
  }, {
      start: 8418, 
      length: 3, 
      convRule: rule109
  }, {
      start: 8421, 
      length: 12, 
      convRule: rule84
  }, {
      start: 8448, 
      length: 2, 
      convRule: rule13
  }, {
      start: 8450, 
      length: 1, 
      convRule: rule98
  }, {
      start: 8451, 
      length: 4, 
      convRule: rule13
  }, {
      start: 8455, 
      length: 1, 
      convRule: rule98
  }, {
      start: 8456, 
      length: 2, 
      convRule: rule13
  }, {
      start: 8458, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8459, 
      length: 3, 
      convRule: rule98
  }, {
      start: 8462, 
      length: 2, 
      convRule: rule14
  }, {
      start: 8464, 
      length: 3, 
      convRule: rule98
  }, {
      start: 8467, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8468, 
      length: 1, 
      convRule: rule13
  }, {
      start: 8469, 
      length: 1, 
      convRule: rule98
  }, {
      start: 8470, 
      length: 2, 
      convRule: rule13
  }, {
      start: 8472, 
      length: 1, 
      convRule: rule6
  }, {
      start: 8473, 
      length: 5, 
      convRule: rule98
  }, {
      start: 8478, 
      length: 6, 
      convRule: rule13
  }, {
      start: 8484, 
      length: 1, 
      convRule: rule98
  }, {
      start: 8485, 
      length: 1, 
      convRule: rule13
  }, {
      start: 8486, 
      length: 1, 
      convRule: rule141
  }, {
      start: 8487, 
      length: 1, 
      convRule: rule13
  }, {
      start: 8488, 
      length: 1, 
      convRule: rule98
  }, {
      start: 8489, 
      length: 1, 
      convRule: rule13
  }, {
      start: 8490, 
      length: 1, 
      convRule: rule142
  }, {
      start: 8491, 
      length: 1, 
      convRule: rule143
  }, {
      start: 8492, 
      length: 2, 
      convRule: rule98
  }, {
      start: 8494, 
      length: 1, 
      convRule: rule13
  }, {
      start: 8495, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8496, 
      length: 2, 
      convRule: rule98
  }, {
      start: 8498, 
      length: 1, 
      convRule: rule144
  }, {
      start: 8499, 
      length: 1, 
      convRule: rule98
  }, {
      start: 8500, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8501, 
      length: 4, 
      convRule: rule45
  }, {
      start: 8505, 
      length: 1, 
      convRule: rule14
  }, {
      start: 8506, 
      length: 2, 
      convRule: rule13
  }, {
      start: 8508, 
      length: 2, 
      convRule: rule14
  }, {
      start: 8510, 
      length: 2, 
      convRule: rule98
  }, {
      start: 8512, 
      length: 5, 
      convRule: rule6
  }, {
      start: 8517, 
      length: 1, 
      convRule: rule98
  }, {
      start: 8518, 
      length: 4, 
      convRule: rule14
  }, {
      start: 8522, 
      length: 1, 
      convRule: rule13
  }, {
      start: 8523, 
      length: 1, 
      convRule: rule6
  }, {
      start: 8524, 
      length: 2, 
      convRule: rule13
  }, {
      start: 8526, 
      length: 1, 
      convRule: rule145
  }, {
      start: 8527, 
      length: 1, 
      convRule: rule13
  }, {
      start: 8528, 
      length: 16, 
      convRule: rule17
  }, {
      start: 8544, 
      length: 16, 
      convRule: rule146
  }, {
      start: 8560, 
      length: 16, 
      convRule: rule147
  }, {
      start: 8576, 
      length: 3, 
      convRule: rule116
  }, {
      start: 8579, 
      length: 1, 
      convRule: rule21
  }, {
      start: 8580, 
      length: 1, 
      convRule: rule22
  }, {
      start: 8581, 
      length: 4, 
      convRule: rule116
  }, {
      start: 8585, 
      length: 1, 
      convRule: rule17
  }, {
      start: 8592, 
      length: 5, 
      convRule: rule6
  }, {
      start: 8597, 
      length: 5, 
      convRule: rule13
  }, {
      start: 8602, 
      length: 2, 
      convRule: rule6
  }, {
      start: 8604, 
      length: 4, 
      convRule: rule13
  }, {
      start: 8608, 
      length: 1, 
      convRule: rule6
  }, {
      start: 8609, 
      length: 2, 
      convRule: rule13
  }, {
      start: 8611, 
      length: 1, 
      convRule: rule6
  }, {
      start: 8612, 
      length: 2, 
      convRule: rule13
  }, {
      start: 8614, 
      length: 1, 
      convRule: rule6
  }, {
      start: 8615, 
      length: 7, 
      convRule: rule13
  }, {
      start: 8622, 
      length: 1, 
      convRule: rule6
  }, {
      start: 8623, 
      length: 31, 
      convRule: rule13
  }, {
      start: 8654, 
      length: 2, 
      convRule: rule6
  }, {
      start: 8656, 
      length: 2, 
      convRule: rule13
  }, {
      start: 8658, 
      length: 1, 
      convRule: rule6
  }, {
      start: 8659, 
      length: 1, 
      convRule: rule13
  }, {
      start: 8660, 
      length: 1, 
      convRule: rule6
  }, {
      start: 8661, 
      length: 31, 
      convRule: rule13
  }, {
      start: 8692, 
      length: 268, 
      convRule: rule6
  }, {
      start: 8960, 
      length: 8, 
      convRule: rule13
  }, {
      start: 8968, 
      length: 4, 
      convRule: rule6
  }, {
      start: 8972, 
      length: 20, 
      convRule: rule13
  }, {
      start: 8992, 
      length: 2, 
      convRule: rule6
  }, {
      start: 8994, 
      length: 7, 
      convRule: rule13
  }, {
      start: 9001, 
      length: 1, 
      convRule: rule4
  }, {
      start: 9002, 
      length: 1, 
      convRule: rule5
  }, {
      start: 9003, 
      length: 81, 
      convRule: rule13
  }, {
      start: 9084, 
      length: 1, 
      convRule: rule6
  }, {
      start: 9085, 
      length: 30, 
      convRule: rule13
  }, {
      start: 9115, 
      length: 25, 
      convRule: rule6
  }, {
      start: 9140, 
      length: 40, 
      convRule: rule13
  }, {
      start: 9180, 
      length: 6, 
      convRule: rule6
  }, {
      start: 9186, 
      length: 18, 
      convRule: rule13
  }, {
      start: 9216, 
      length: 39, 
      convRule: rule13
  }, {
      start: 9280, 
      length: 11, 
      convRule: rule13
  }, {
      start: 9312, 
      length: 60, 
      convRule: rule17
  }, {
      start: 9372, 
      length: 26, 
      convRule: rule13
  }, {
      start: 9398, 
      length: 26, 
      convRule: rule148
  }, {
      start: 9424, 
      length: 26, 
      convRule: rule149
  }, {
      start: 9450, 
      length: 22, 
      convRule: rule17
  }, {
      start: 9472, 
      length: 183, 
      convRule: rule13
  }, {
      start: 9655, 
      length: 1, 
      convRule: rule6
  }, {
      start: 9656, 
      length: 9, 
      convRule: rule13
  }, {
      start: 9665, 
      length: 1, 
      convRule: rule6
  }, {
      start: 9666, 
      length: 54, 
      convRule: rule13
  }, {
      start: 9720, 
      length: 8, 
      convRule: rule6
  }, {
      start: 9728, 
      length: 111, 
      convRule: rule13
  }, {
      start: 9839, 
      length: 1, 
      convRule: rule6
  }, {
      start: 9840, 
      length: 144, 
      convRule: rule13
  }, {
      start: 9985, 
      length: 103, 
      convRule: rule13
  }, {
      start: 10088, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10089, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10090, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10091, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10092, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10093, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10094, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10095, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10096, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10097, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10098, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10099, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10100, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10101, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10102, 
      length: 30, 
      convRule: rule17
  }, {
      start: 10132, 
      length: 44, 
      convRule: rule13
  }, {
      start: 10176, 
      length: 5, 
      convRule: rule6
  }, {
      start: 10181, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10182, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10183, 
      length: 4, 
      convRule: rule6
  }, {
      start: 10188, 
      length: 1, 
      convRule: rule6
  }, {
      start: 10190, 
      length: 24, 
      convRule: rule6
  }, {
      start: 10214, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10215, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10216, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10217, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10218, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10219, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10220, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10221, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10222, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10223, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10224, 
      length: 16, 
      convRule: rule6
  }, {
      start: 10240, 
      length: 256, 
      convRule: rule13
  }, {
      start: 10496, 
      length: 131, 
      convRule: rule6
  }, {
      start: 10627, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10628, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10629, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10630, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10631, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10632, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10633, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10634, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10635, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10636, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10637, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10638, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10639, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10640, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10641, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10642, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10643, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10644, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10645, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10646, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10647, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10648, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10649, 
      length: 63, 
      convRule: rule6
  }, {
      start: 10712, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10713, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10714, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10715, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10716, 
      length: 32, 
      convRule: rule6
  }, {
      start: 10748, 
      length: 1, 
      convRule: rule4
  }, {
      start: 10749, 
      length: 1, 
      convRule: rule5
  }, {
      start: 10750, 
      length: 258, 
      convRule: rule6
  }, {
      start: 11008, 
      length: 48, 
      convRule: rule13
  }, {
      start: 11056, 
      length: 21, 
      convRule: rule6
  }, {
      start: 11077, 
      length: 2, 
      convRule: rule13
  }, {
      start: 11079, 
      length: 6, 
      convRule: rule6
  }, {
      start: 11088, 
      length: 10, 
      convRule: rule13
  }, {
      start: 11264, 
      length: 47, 
      convRule: rule112
  }, {
      start: 11312, 
      length: 47, 
      convRule: rule113
  }, {
      start: 11360, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11361, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11362, 
      length: 1, 
      convRule: rule150
  }, {
      start: 11363, 
      length: 1, 
      convRule: rule151
  }, {
      start: 11364, 
      length: 1, 
      convRule: rule152
  }, {
      start: 11365, 
      length: 1, 
      convRule: rule153
  }, {
      start: 11366, 
      length: 1, 
      convRule: rule154
  }, {
      start: 11367, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11368, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11369, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11370, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11371, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11372, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11373, 
      length: 1, 
      convRule: rule155
  }, {
      start: 11374, 
      length: 1, 
      convRule: rule156
  }, {
      start: 11375, 
      length: 1, 
      convRule: rule157
  }, {
      start: 11376, 
      length: 1, 
      convRule: rule158
  }, {
      start: 11377, 
      length: 1, 
      convRule: rule14
  }, {
      start: 11378, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11379, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11380, 
      length: 1, 
      convRule: rule14
  }, {
      start: 11381, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11382, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11383, 
      length: 6, 
      convRule: rule14
  }, {
      start: 11389, 
      length: 1, 
      convRule: rule83
  }, {
      start: 11390, 
      length: 2, 
      convRule: rule159
  }, {
      start: 11392, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11393, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11394, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11395, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11396, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11397, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11398, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11399, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11400, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11401, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11402, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11403, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11404, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11405, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11406, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11407, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11408, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11409, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11410, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11411, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11412, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11413, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11414, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11415, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11416, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11417, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11418, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11419, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11420, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11421, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11422, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11423, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11424, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11425, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11426, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11427, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11428, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11429, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11430, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11431, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11432, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11433, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11434, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11435, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11436, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11437, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11438, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11439, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11440, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11441, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11442, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11443, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11444, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11445, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11446, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11447, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11448, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11449, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11450, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11451, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11452, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11453, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11454, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11455, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11456, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11457, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11458, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11459, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11460, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11461, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11462, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11463, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11464, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11465, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11466, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11467, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11468, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11469, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11470, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11471, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11472, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11473, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11474, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11475, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11476, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11477, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11478, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11479, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11480, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11481, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11482, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11483, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11484, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11485, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11486, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11487, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11488, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11489, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11490, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11491, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11492, 
      length: 1, 
      convRule: rule14
  }, {
      start: 11493, 
      length: 6, 
      convRule: rule13
  }, {
      start: 11499, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11500, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11501, 
      length: 1, 
      convRule: rule21
  }, {
      start: 11502, 
      length: 1, 
      convRule: rule22
  }, {
      start: 11503, 
      length: 3, 
      convRule: rule84
  }, {
      start: 11513, 
      length: 4, 
      convRule: rule2
  }, {
      start: 11517, 
      length: 1, 
      convRule: rule17
  }, {
      start: 11518, 
      length: 2, 
      convRule: rule2
  }, {
      start: 11520, 
      length: 38, 
      convRule: rule160
  }, {
      start: 11568, 
      length: 54, 
      convRule: rule45
  }, {
      start: 11631, 
      length: 1, 
      convRule: rule83
  }, {
      start: 11632, 
      length: 1, 
      convRule: rule2
  }, {
      start: 11647, 
      length: 1, 
      convRule: rule84
  }, {
      start: 11648, 
      length: 23, 
      convRule: rule45
  }, {
      start: 11680, 
      length: 7, 
      convRule: rule45
  }, {
      start: 11688, 
      length: 7, 
      convRule: rule45
  }, {
      start: 11696, 
      length: 7, 
      convRule: rule45
  }, {
      start: 11704, 
      length: 7, 
      convRule: rule45
  }, {
      start: 11712, 
      length: 7, 
      convRule: rule45
  }, {
      start: 11720, 
      length: 7, 
      convRule: rule45
  }, {
      start: 11728, 
      length: 7, 
      convRule: rule45
  }, {
      start: 11736, 
      length: 7, 
      convRule: rule45
  }, {
      start: 11744, 
      length: 32, 
      convRule: rule84
  }, {
      start: 11776, 
      length: 2, 
      convRule: rule2
  }, {
      start: 11778, 
      length: 1, 
      convRule: rule15
  }, {
      start: 11779, 
      length: 1, 
      convRule: rule19
  }, {
      start: 11780, 
      length: 1, 
      convRule: rule15
  }, {
      start: 11781, 
      length: 1, 
      convRule: rule19
  }, {
      start: 11782, 
      length: 3, 
      convRule: rule2
  }, {
      start: 11785, 
      length: 1, 
      convRule: rule15
  }, {
      start: 11786, 
      length: 1, 
      convRule: rule19
  }, {
      start: 11787, 
      length: 1, 
      convRule: rule2
  }, {
      start: 11788, 
      length: 1, 
      convRule: rule15
  }, {
      start: 11789, 
      length: 1, 
      convRule: rule19
  }, {
      start: 11790, 
      length: 9, 
      convRule: rule2
  }, {
      start: 11799, 
      length: 1, 
      convRule: rule7
  }, {
      start: 11800, 
      length: 2, 
      convRule: rule2
  }, {
      start: 11802, 
      length: 1, 
      convRule: rule7
  }, {
      start: 11803, 
      length: 1, 
      convRule: rule2
  }, {
      start: 11804, 
      length: 1, 
      convRule: rule15
  }, {
      start: 11805, 
      length: 1, 
      convRule: rule19
  }, {
      start: 11806, 
      length: 2, 
      convRule: rule2
  }, {
      start: 11808, 
      length: 1, 
      convRule: rule15
  }, {
      start: 11809, 
      length: 1, 
      convRule: rule19
  }, {
      start: 11810, 
      length: 1, 
      convRule: rule4
  }, {
      start: 11811, 
      length: 1, 
      convRule: rule5
  }, {
      start: 11812, 
      length: 1, 
      convRule: rule4
  }, {
      start: 11813, 
      length: 1, 
      convRule: rule5
  }, {
      start: 11814, 
      length: 1, 
      convRule: rule4
  }, {
      start: 11815, 
      length: 1, 
      convRule: rule5
  }, {
      start: 11816, 
      length: 1, 
      convRule: rule4
  }, {
      start: 11817, 
      length: 1, 
      convRule: rule5
  }, {
      start: 11818, 
      length: 5, 
      convRule: rule2
  }, {
      start: 11823, 
      length: 1, 
      convRule: rule83
  }, {
      start: 11824, 
      length: 2, 
      convRule: rule2
  }, {
      start: 11904, 
      length: 26, 
      convRule: rule13
  }, {
      start: 11931, 
      length: 89, 
      convRule: rule13
  }, {
      start: 12032, 
      length: 214, 
      convRule: rule13
  }, {
      start: 12272, 
      length: 12, 
      convRule: rule13
  }, {
      start: 12288, 
      length: 1, 
      convRule: rule1
  }, {
      start: 12289, 
      length: 3, 
      convRule: rule2
  }, {
      start: 12292, 
      length: 1, 
      convRule: rule13
  }, {
      start: 12293, 
      length: 1, 
      convRule: rule83
  }, {
      start: 12294, 
      length: 1, 
      convRule: rule45
  }, {
      start: 12295, 
      length: 1, 
      convRule: rule116
  }, {
      start: 12296, 
      length: 1, 
      convRule: rule4
  }, {
      start: 12297, 
      length: 1, 
      convRule: rule5
  }, {
      start: 12298, 
      length: 1, 
      convRule: rule4
  }, {
      start: 12299, 
      length: 1, 
      convRule: rule5
  }, {
      start: 12300, 
      length: 1, 
      convRule: rule4
  }, {
      start: 12301, 
      length: 1, 
      convRule: rule5
  }, {
      start: 12302, 
      length: 1, 
      convRule: rule4
  }, {
      start: 12303, 
      length: 1, 
      convRule: rule5
  }, {
      start: 12304, 
      length: 1, 
      convRule: rule4
  }, {
      start: 12305, 
      length: 1, 
      convRule: rule5
  }, {
      start: 12306, 
      length: 2, 
      convRule: rule13
  }, {
      start: 12308, 
      length: 1, 
      convRule: rule4
  }, {
      start: 12309, 
      length: 1, 
      convRule: rule5
  }, {
      start: 12310, 
      length: 1, 
      convRule: rule4
  }, {
      start: 12311, 
      length: 1, 
      convRule: rule5
  }, {
      start: 12312, 
      length: 1, 
      convRule: rule4
  }, {
      start: 12313, 
      length: 1, 
      convRule: rule5
  }, {
      start: 12314, 
      length: 1, 
      convRule: rule4
  }, {
      start: 12315, 
      length: 1, 
      convRule: rule5
  }, {
      start: 12316, 
      length: 1, 
      convRule: rule7
  }, {
      start: 12317, 
      length: 1, 
      convRule: rule4
  }, {
      start: 12318, 
      length: 2, 
      convRule: rule5
  }, {
      start: 12320, 
      length: 1, 
      convRule: rule13
  }, {
      start: 12321, 
      length: 9, 
      convRule: rule116
  }, {
      start: 12330, 
      length: 6, 
      convRule: rule84
  }, {
      start: 12336, 
      length: 1, 
      convRule: rule7
  }, {
      start: 12337, 
      length: 5, 
      convRule: rule83
  }, {
      start: 12342, 
      length: 2, 
      convRule: rule13
  }, {
      start: 12344, 
      length: 3, 
      convRule: rule116
  }, {
      start: 12347, 
      length: 1, 
      convRule: rule83
  }, {
      start: 12348, 
      length: 1, 
      convRule: rule45
  }, {
      start: 12349, 
      length: 1, 
      convRule: rule2
  }, {
      start: 12350, 
      length: 2, 
      convRule: rule13
  }, {
      start: 12353, 
      length: 86, 
      convRule: rule45
  }, {
      start: 12441, 
      length: 2, 
      convRule: rule84
  }, {
      start: 12443, 
      length: 2, 
      convRule: rule10
  }, {
      start: 12445, 
      length: 2, 
      convRule: rule83
  }, {
      start: 12447, 
      length: 1, 
      convRule: rule45
  }, {
      start: 12448, 
      length: 1, 
      convRule: rule7
  }, {
      start: 12449, 
      length: 90, 
      convRule: rule45
  }, {
      start: 12539, 
      length: 1, 
      convRule: rule2
  }, {
      start: 12540, 
      length: 3, 
      convRule: rule83
  }, {
      start: 12543, 
      length: 1, 
      convRule: rule45
  }, {
      start: 12549, 
      length: 41, 
      convRule: rule45
  }, {
      start: 12593, 
      length: 94, 
      convRule: rule45
  }, {
      start: 12688, 
      length: 2, 
      convRule: rule13
  }, {
      start: 12690, 
      length: 4, 
      convRule: rule17
  }, {
      start: 12694, 
      length: 10, 
      convRule: rule13
  }, {
      start: 12704, 
      length: 27, 
      convRule: rule45
  }, {
      start: 12736, 
      length: 36, 
      convRule: rule13
  }, {
      start: 12784, 
      length: 16, 
      convRule: rule45
  }, {
      start: 12800, 
      length: 31, 
      convRule: rule13
  }, {
      start: 12832, 
      length: 10, 
      convRule: rule17
  }, {
      start: 12842, 
      length: 39, 
      convRule: rule13
  }, {
      start: 12881, 
      length: 15, 
      convRule: rule17
  }, {
      start: 12896, 
      length: 32, 
      convRule: rule13
  }, {
      start: 12928, 
      length: 10, 
      convRule: rule17
  }, {
      start: 12938, 
      length: 39, 
      convRule: rule13
  }, {
      start: 12977, 
      length: 15, 
      convRule: rule17
  }, {
      start: 12992, 
      length: 63, 
      convRule: rule13
  }, {
      start: 13056, 
      length: 256, 
      convRule: rule13
  }, {
      start: 13312, 
      length: 6582, 
      convRule: rule45
  }, {
      start: 19904, 
      length: 64, 
      convRule: rule13
  }, {
      start: 19968, 
      length: 20940, 
      convRule: rule45
  }, {
      start: 40960, 
      length: 21, 
      convRule: rule45
  }, {
      start: 40981, 
      length: 1, 
      convRule: rule83
  }, {
      start: 40982, 
      length: 1143, 
      convRule: rule45
  }, {
      start: 42128, 
      length: 55, 
      convRule: rule13
  }, {
      start: 42192, 
      length: 40, 
      convRule: rule45
  }, {
      start: 42232, 
      length: 6, 
      convRule: rule83
  }, {
      start: 42238, 
      length: 2, 
      convRule: rule2
  }, {
      start: 42240, 
      length: 268, 
      convRule: rule45
  }, {
      start: 42508, 
      length: 1, 
      convRule: rule83
  }, {
      start: 42509, 
      length: 3, 
      convRule: rule2
  }, {
      start: 42512, 
      length: 16, 
      convRule: rule45
  }, {
      start: 42528, 
      length: 10, 
      convRule: rule8
  }, {
      start: 42538, 
      length: 2, 
      convRule: rule45
  }, {
      start: 42560, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42561, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42562, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42563, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42564, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42565, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42566, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42567, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42568, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42569, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42570, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42571, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42572, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42573, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42574, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42575, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42576, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42577, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42578, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42579, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42580, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42581, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42582, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42583, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42584, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42585, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42586, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42587, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42588, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42589, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42590, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42591, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42592, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42593, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42594, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42595, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42596, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42597, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42598, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42599, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42600, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42601, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42602, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42603, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42604, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42605, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42606, 
      length: 1, 
      convRule: rule45
  }, {
      start: 42607, 
      length: 1, 
      convRule: rule84
  }, {
      start: 42608, 
      length: 3, 
      convRule: rule109
  }, {
      start: 42611, 
      length: 1, 
      convRule: rule2
  }, {
      start: 42620, 
      length: 2, 
      convRule: rule84
  }, {
      start: 42622, 
      length: 1, 
      convRule: rule2
  }, {
      start: 42623, 
      length: 1, 
      convRule: rule83
  }, {
      start: 42624, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42625, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42626, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42627, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42628, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42629, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42630, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42631, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42632, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42633, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42634, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42635, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42636, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42637, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42638, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42639, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42640, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42641, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42642, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42643, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42644, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42645, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42646, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42647, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42656, 
      length: 70, 
      convRule: rule45
  }, {
      start: 42726, 
      length: 10, 
      convRule: rule116
  }, {
      start: 42736, 
      length: 2, 
      convRule: rule84
  }, {
      start: 42738, 
      length: 6, 
      convRule: rule2
  }, {
      start: 42752, 
      length: 23, 
      convRule: rule10
  }, {
      start: 42775, 
      length: 9, 
      convRule: rule83
  }, {
      start: 42784, 
      length: 2, 
      convRule: rule10
  }, {
      start: 42786, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42787, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42788, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42789, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42790, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42791, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42792, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42793, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42794, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42795, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42796, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42797, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42798, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42799, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42800, 
      length: 2, 
      convRule: rule14
  }, {
      start: 42802, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42803, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42804, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42805, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42806, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42807, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42808, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42809, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42810, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42811, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42812, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42813, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42814, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42815, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42816, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42817, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42818, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42819, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42820, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42821, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42822, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42823, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42824, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42825, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42826, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42827, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42828, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42829, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42830, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42831, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42832, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42833, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42834, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42835, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42836, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42837, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42838, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42839, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42840, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42841, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42842, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42843, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42844, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42845, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42846, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42847, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42848, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42849, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42850, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42851, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42852, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42853, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42854, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42855, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42856, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42857, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42858, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42859, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42860, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42861, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42862, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42863, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42864, 
      length: 1, 
      convRule: rule83
  }, {
      start: 42865, 
      length: 8, 
      convRule: rule14
  }, {
      start: 42873, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42874, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42875, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42876, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42877, 
      length: 1, 
      convRule: rule161
  }, {
      start: 42878, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42879, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42880, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42881, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42882, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42883, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42884, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42885, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42886, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42887, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42888, 
      length: 1, 
      convRule: rule83
  }, {
      start: 42889, 
      length: 2, 
      convRule: rule10
  }, {
      start: 42891, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42892, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42893, 
      length: 1, 
      convRule: rule162
  }, {
      start: 42894, 
      length: 1, 
      convRule: rule14
  }, {
      start: 42896, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42897, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42912, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42913, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42914, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42915, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42916, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42917, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42918, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42919, 
      length: 1, 
      convRule: rule22
  }, {
      start: 42920, 
      length: 1, 
      convRule: rule21
  }, {
      start: 42921, 
      length: 1, 
      convRule: rule22
  }, {
      start: 43002, 
      length: 1, 
      convRule: rule14
  }, {
      start: 43003, 
      length: 7, 
      convRule: rule45
  }, {
      start: 43010, 
      length: 1, 
      convRule: rule84
  }, {
      start: 43011, 
      length: 3, 
      convRule: rule45
  }, {
      start: 43014, 
      length: 1, 
      convRule: rule84
  }, {
      start: 43015, 
      length: 4, 
      convRule: rule45
  }, {
      start: 43019, 
      length: 1, 
      convRule: rule84
  }, {
      start: 43020, 
      length: 23, 
      convRule: rule45
  }, {
      start: 43043, 
      length: 2, 
      convRule: rule114
  }, {
      start: 43045, 
      length: 2, 
      convRule: rule84
  }, {
      start: 43047, 
      length: 1, 
      convRule: rule114
  }, {
      start: 43048, 
      length: 4, 
      convRule: rule13
  }, {
      start: 43056, 
      length: 6, 
      convRule: rule17
  }, {
      start: 43062, 
      length: 2, 
      convRule: rule13
  }, {
      start: 43064, 
      length: 1, 
      convRule: rule3
  }, {
      start: 43065, 
      length: 1, 
      convRule: rule13
  }, {
      start: 43072, 
      length: 52, 
      convRule: rule45
  }, {
      start: 43124, 
      length: 4, 
      convRule: rule2
  }, {
      start: 43136, 
      length: 2, 
      convRule: rule114
  }, {
      start: 43138, 
      length: 50, 
      convRule: rule45
  }, {
      start: 43188, 
      length: 16, 
      convRule: rule114
  }, {
      start: 43204, 
      length: 1, 
      convRule: rule84
  }, {
      start: 43214, 
      length: 2, 
      convRule: rule2
  }, {
      start: 43216, 
      length: 10, 
      convRule: rule8
  }, {
      start: 43232, 
      length: 18, 
      convRule: rule84
  }, {
      start: 43250, 
      length: 6, 
      convRule: rule45
  }, {
      start: 43256, 
      length: 3, 
      convRule: rule2
  }, {
      start: 43259, 
      length: 1, 
      convRule: rule45
  }, {
      start: 43264, 
      length: 10, 
      convRule: rule8
  }, {
      start: 43274, 
      length: 28, 
      convRule: rule45
  }, {
      start: 43302, 
      length: 8, 
      convRule: rule84
  }, {
      start: 43310, 
      length: 2, 
      convRule: rule2
  }, {
      start: 43312, 
      length: 23, 
      convRule: rule45
  }, {
      start: 43335, 
      length: 11, 
      convRule: rule84
  }, {
      start: 43346, 
      length: 2, 
      convRule: rule114
  }, {
      start: 43359, 
      length: 1, 
      convRule: rule2
  }, {
      start: 43360, 
      length: 29, 
      convRule: rule45
  }, {
      start: 43392, 
      length: 3, 
      convRule: rule84
  }, {
      start: 43395, 
      length: 1, 
      convRule: rule114
  }, {
      start: 43396, 
      length: 47, 
      convRule: rule45
  }, {
      start: 43443, 
      length: 1, 
      convRule: rule84
  }, {
      start: 43444, 
      length: 2, 
      convRule: rule114
  }, {
      start: 43446, 
      length: 4, 
      convRule: rule84
  }, {
      start: 43450, 
      length: 2, 
      convRule: rule114
  }, {
      start: 43452, 
      length: 1, 
      convRule: rule84
  }, {
      start: 43453, 
      length: 4, 
      convRule: rule114
  }, {
      start: 43457, 
      length: 13, 
      convRule: rule2
  }, {
      start: 43471, 
      length: 1, 
      convRule: rule83
  }, {
      start: 43472, 
      length: 10, 
      convRule: rule8
  }, {
      start: 43486, 
      length: 2, 
      convRule: rule2
  }, {
      start: 43520, 
      length: 41, 
      convRule: rule45
  }, {
      start: 43561, 
      length: 6, 
      convRule: rule84
  }, {
      start: 43567, 
      length: 2, 
      convRule: rule114
  }, {
      start: 43569, 
      length: 2, 
      convRule: rule84
  }, {
      start: 43571, 
      length: 2, 
      convRule: rule114
  }, {
      start: 43573, 
      length: 2, 
      convRule: rule84
  }, {
      start: 43584, 
      length: 3, 
      convRule: rule45
  }, {
      start: 43587, 
      length: 1, 
      convRule: rule84
  }, {
      start: 43588, 
      length: 8, 
      convRule: rule45
  }, {
      start: 43596, 
      length: 1, 
      convRule: rule84
  }, {
      start: 43597, 
      length: 1, 
      convRule: rule114
  }, {
      start: 43600, 
      length: 10, 
      convRule: rule8
  }, {
      start: 43612, 
      length: 4, 
      convRule: rule2
  }, {
      start: 43616, 
      length: 16, 
      convRule: rule45
  }, {
      start: 43632, 
      length: 1, 
      convRule: rule83
  }, {
      start: 43633, 
      length: 6, 
      convRule: rule45
  }, {
      start: 43639, 
      length: 3, 
      convRule: rule13
  }, {
      start: 43642, 
      length: 1, 
      convRule: rule45
  }, {
      start: 43643, 
      length: 1, 
      convRule: rule114
  }, {
      start: 43648, 
      length: 48, 
      convRule: rule45
  }, {
      start: 43696, 
      length: 1, 
      convRule: rule84
  }, {
      start: 43697, 
      length: 1, 
      convRule: rule45
  }, {
      start: 43698, 
      length: 3, 
      convRule: rule84
  }, {
      start: 43701, 
      length: 2, 
      convRule: rule45
  }, {
      start: 43703, 
      length: 2, 
      convRule: rule84
  }, {
      start: 43705, 
      length: 5, 
      convRule: rule45
  }, {
      start: 43710, 
      length: 2, 
      convRule: rule84
  }, {
      start: 43712, 
      length: 1, 
      convRule: rule45
  }, {
      start: 43713, 
      length: 1, 
      convRule: rule84
  }, {
      start: 43714, 
      length: 1, 
      convRule: rule45
  }, {
      start: 43739, 
      length: 2, 
      convRule: rule45
  }, {
      start: 43741, 
      length: 1, 
      convRule: rule83
  }, {
      start: 43742, 
      length: 2, 
      convRule: rule2
  }, {
      start: 43777, 
      length: 6, 
      convRule: rule45
  }, {
      start: 43785, 
      length: 6, 
      convRule: rule45
  }, {
      start: 43793, 
      length: 6, 
      convRule: rule45
  }, {
      start: 43808, 
      length: 7, 
      convRule: rule45
  }, {
      start: 43816, 
      length: 7, 
      convRule: rule45
  }, {
      start: 43968, 
      length: 35, 
      convRule: rule45
  }, {
      start: 44003, 
      length: 2, 
      convRule: rule114
  }, {
      start: 44005, 
      length: 1, 
      convRule: rule84
  }, {
      start: 44006, 
      length: 2, 
      convRule: rule114
  }, {
      start: 44008, 
      length: 1, 
      convRule: rule84
  }, {
      start: 44009, 
      length: 2, 
      convRule: rule114
  }, {
      start: 44011, 
      length: 1, 
      convRule: rule2
  }, {
      start: 44012, 
      length: 1, 
      convRule: rule114
  }, {
      start: 44013, 
      length: 1, 
      convRule: rule84
  }, {
      start: 44016, 
      length: 10, 
      convRule: rule8
  }, {
      start: 44032, 
      length: 11172, 
      convRule: rule45
  }, {
      start: 55216, 
      length: 23, 
      convRule: rule45
  }, {
      start: 55243, 
      length: 49, 
      convRule: rule45
  }, {
      start: 55296, 
      length: 896, 
      convRule: rule163
  }, {
      start: 56192, 
      length: 128, 
      convRule: rule163
  }, {
      start: 56320, 
      length: 1024, 
      convRule: rule163
  }, {
      start: 57344, 
      length: 6400, 
      convRule: rule164
  }, {
      start: 63744, 
      length: 302, 
      convRule: rule45
  }, {
      start: 64048, 
      length: 62, 
      convRule: rule45
  }, {
      start: 64112, 
      length: 106, 
      convRule: rule45
  }, {
      start: 64256, 
      length: 7, 
      convRule: rule14
  }, {
      start: 64275, 
      length: 5, 
      convRule: rule14
  }, {
      start: 64285, 
      length: 1, 
      convRule: rule45
  }, {
      start: 64286, 
      length: 1, 
      convRule: rule84
  }, {
      start: 64287, 
      length: 10, 
      convRule: rule45
  }, {
      start: 64297, 
      length: 1, 
      convRule: rule6
  }, {
      start: 64298, 
      length: 13, 
      convRule: rule45
  }, {
      start: 64312, 
      length: 5, 
      convRule: rule45
  }, {
      start: 64318, 
      length: 1, 
      convRule: rule45
  }, {
      start: 64320, 
      length: 2, 
      convRule: rule45
  }, {
      start: 64323, 
      length: 2, 
      convRule: rule45
  }, {
      start: 64326, 
      length: 108, 
      convRule: rule45
  }, {
      start: 64434, 
      length: 16, 
      convRule: rule10
  }, {
      start: 64467, 
      length: 363, 
      convRule: rule45
  }, {
      start: 64830, 
      length: 1, 
      convRule: rule4
  }, {
      start: 64831, 
      length: 1, 
      convRule: rule5
  }, {
      start: 64848, 
      length: 64, 
      convRule: rule45
  }, {
      start: 64914, 
      length: 54, 
      convRule: rule45
  }, {
      start: 65008, 
      length: 12, 
      convRule: rule45
  }, {
      start: 65020, 
      length: 1, 
      convRule: rule3
  }, {
      start: 65021, 
      length: 1, 
      convRule: rule13
  }, {
      start: 65024, 
      length: 16, 
      convRule: rule84
  }, {
      start: 65040, 
      length: 7, 
      convRule: rule2
  }, {
      start: 65047, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65048, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65049, 
      length: 1, 
      convRule: rule2
  }, {
      start: 65056, 
      length: 7, 
      convRule: rule84
  }, {
      start: 65072, 
      length: 1, 
      convRule: rule2
  }, {
      start: 65073, 
      length: 2, 
      convRule: rule7
  }, {
      start: 65075, 
      length: 2, 
      convRule: rule11
  }, {
      start: 65077, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65078, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65079, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65080, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65081, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65082, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65083, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65084, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65085, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65086, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65087, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65088, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65089, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65090, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65091, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65092, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65093, 
      length: 2, 
      convRule: rule2
  }, {
      start: 65095, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65096, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65097, 
      length: 4, 
      convRule: rule2
  }, {
      start: 65101, 
      length: 3, 
      convRule: rule11
  }, {
      start: 65104, 
      length: 3, 
      convRule: rule2
  }, {
      start: 65108, 
      length: 4, 
      convRule: rule2
  }, {
      start: 65112, 
      length: 1, 
      convRule: rule7
  }, {
      start: 65113, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65114, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65115, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65116, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65117, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65118, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65119, 
      length: 3, 
      convRule: rule2
  }, {
      start: 65122, 
      length: 1, 
      convRule: rule6
  }, {
      start: 65123, 
      length: 1, 
      convRule: rule7
  }, {
      start: 65124, 
      length: 3, 
      convRule: rule6
  }, {
      start: 65128, 
      length: 1, 
      convRule: rule2
  }, {
      start: 65129, 
      length: 1, 
      convRule: rule3
  }, {
      start: 65130, 
      length: 2, 
      convRule: rule2
  }, {
      start: 65136, 
      length: 5, 
      convRule: rule45
  }, {
      start: 65142, 
      length: 135, 
      convRule: rule45
  }, {
      start: 65279, 
      length: 1, 
      convRule: rule16
  }, {
      start: 65281, 
      length: 3, 
      convRule: rule2
  }, {
      start: 65284, 
      length: 1, 
      convRule: rule3
  }, {
      start: 65285, 
      length: 3, 
      convRule: rule2
  }, {
      start: 65288, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65289, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65290, 
      length: 1, 
      convRule: rule2
  }, {
      start: 65291, 
      length: 1, 
      convRule: rule6
  }, {
      start: 65292, 
      length: 1, 
      convRule: rule2
  }, {
      start: 65293, 
      length: 1, 
      convRule: rule7
  }, {
      start: 65294, 
      length: 2, 
      convRule: rule2
  }, {
      start: 65296, 
      length: 10, 
      convRule: rule8
  }, {
      start: 65306, 
      length: 2, 
      convRule: rule2
  }, {
      start: 65308, 
      length: 3, 
      convRule: rule6
  }, {
      start: 65311, 
      length: 2, 
      convRule: rule2
  }, {
      start: 65313, 
      length: 26, 
      convRule: rule9
  }, {
      start: 65339, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65340, 
      length: 1, 
      convRule: rule2
  }, {
      start: 65341, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65342, 
      length: 1, 
      convRule: rule10
  }, {
      start: 65343, 
      length: 1, 
      convRule: rule11
  }, {
      start: 65344, 
      length: 1, 
      convRule: rule10
  }, {
      start: 65345, 
      length: 26, 
      convRule: rule12
  }, {
      start: 65371, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65372, 
      length: 1, 
      convRule: rule6
  }, {
      start: 65373, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65374, 
      length: 1, 
      convRule: rule6
  }, {
      start: 65375, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65376, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65377, 
      length: 1, 
      convRule: rule2
  }, {
      start: 65378, 
      length: 1, 
      convRule: rule4
  }, {
      start: 65379, 
      length: 1, 
      convRule: rule5
  }, {
      start: 65380, 
      length: 2, 
      convRule: rule2
  }, {
      start: 65382, 
      length: 10, 
      convRule: rule45
  }, {
      start: 65392, 
      length: 1, 
      convRule: rule83
  }, {
      start: 65393, 
      length: 45, 
      convRule: rule45
  }, {
      start: 65438, 
      length: 2, 
      convRule: rule83
  }, {
      start: 65440, 
      length: 31, 
      convRule: rule45
  }, {
      start: 65474, 
      length: 6, 
      convRule: rule45
  }, {
      start: 65482, 
      length: 6, 
      convRule: rule45
  }, {
      start: 65490, 
      length: 6, 
      convRule: rule45
  }, {
      start: 65498, 
      length: 3, 
      convRule: rule45
  }, {
      start: 65504, 
      length: 2, 
      convRule: rule3
  }, {
      start: 65506, 
      length: 1, 
      convRule: rule6
  }, {
      start: 65507, 
      length: 1, 
      convRule: rule10
  }, {
      start: 65508, 
      length: 1, 
      convRule: rule13
  }, {
      start: 65509, 
      length: 2, 
      convRule: rule3
  }, {
      start: 65512, 
      length: 1, 
      convRule: rule13
  }, {
      start: 65513, 
      length: 4, 
      convRule: rule6
  }, {
      start: 65517, 
      length: 2, 
      convRule: rule13
  }, {
      start: 65529, 
      length: 3, 
      convRule: rule16
  }, {
      start: 65532, 
      length: 2, 
      convRule: rule13
  }, {
      start: 65536, 
      length: 12, 
      convRule: rule45
  }, {
      start: 65549, 
      length: 26, 
      convRule: rule45
  }, {
      start: 65576, 
      length: 19, 
      convRule: rule45
  }, {
      start: 65596, 
      length: 2, 
      convRule: rule45
  }, {
      start: 65599, 
      length: 15, 
      convRule: rule45
  }, {
      start: 65616, 
      length: 14, 
      convRule: rule45
  }, {
      start: 65664, 
      length: 123, 
      convRule: rule45
  }, {
      start: 65792, 
      length: 2, 
      convRule: rule2
  }, {
      start: 65794, 
      length: 1, 
      convRule: rule13
  }, {
      start: 65799, 
      length: 45, 
      convRule: rule17
  }, {
      start: 65847, 
      length: 9, 
      convRule: rule13
  }, {
      start: 65856, 
      length: 53, 
      convRule: rule116
  }, {
      start: 65909, 
      length: 4, 
      convRule: rule17
  }, {
      start: 65913, 
      length: 17, 
      convRule: rule13
  }, {
      start: 65930, 
      length: 1, 
      convRule: rule17
  }, {
      start: 65936, 
      length: 12, 
      convRule: rule13
  }, {
      start: 66000, 
      length: 45, 
      convRule: rule13
  }, {
      start: 66045, 
      length: 1, 
      convRule: rule84
  }, {
      start: 66176, 
      length: 29, 
      convRule: rule45
  }, {
      start: 66208, 
      length: 49, 
      convRule: rule45
  }, {
      start: 66304, 
      length: 31, 
      convRule: rule45
  }, {
      start: 66336, 
      length: 4, 
      convRule: rule17
  }, {
      start: 66352, 
      length: 17, 
      convRule: rule45
  }, {
      start: 66369, 
      length: 1, 
      convRule: rule116
  }, {
      start: 66370, 
      length: 8, 
      convRule: rule45
  }, {
      start: 66378, 
      length: 1, 
      convRule: rule116
  }, {
      start: 66432, 
      length: 30, 
      convRule: rule45
  }, {
      start: 66463, 
      length: 1, 
      convRule: rule2
  }, {
      start: 66464, 
      length: 36, 
      convRule: rule45
  }, {
      start: 66504, 
      length: 8, 
      convRule: rule45
  }, {
      start: 66512, 
      length: 1, 
      convRule: rule2
  }, {
      start: 66513, 
      length: 5, 
      convRule: rule116
  }, {
      start: 66560, 
      length: 40, 
      convRule: rule165
  }, {
      start: 66600, 
      length: 40, 
      convRule: rule166
  }, {
      start: 66640, 
      length: 78, 
      convRule: rule45
  }, {
      start: 66720, 
      length: 10, 
      convRule: rule8
  }, {
      start: 67584, 
      length: 6, 
      convRule: rule45
  }, {
      start: 67592, 
      length: 1, 
      convRule: rule45
  }, {
      start: 67594, 
      length: 44, 
      convRule: rule45
  }, {
      start: 67639, 
      length: 2, 
      convRule: rule45
  }, {
      start: 67644, 
      length: 1, 
      convRule: rule45
  }, {
      start: 67647, 
      length: 23, 
      convRule: rule45
  }, {
      start: 67671, 
      length: 1, 
      convRule: rule2
  }, {
      start: 67672, 
      length: 8, 
      convRule: rule17
  }, {
      start: 67840, 
      length: 22, 
      convRule: rule45
  }, {
      start: 67862, 
      length: 6, 
      convRule: rule17
  }, {
      start: 67871, 
      length: 1, 
      convRule: rule2
  }, {
      start: 67872, 
      length: 26, 
      convRule: rule45
  }, {
      start: 67903, 
      length: 1, 
      convRule: rule2
  }, {
      start: 68096, 
      length: 1, 
      convRule: rule45
  }, {
      start: 68097, 
      length: 3, 
      convRule: rule84
  }, {
      start: 68101, 
      length: 2, 
      convRule: rule84
  }, {
      start: 68108, 
      length: 4, 
      convRule: rule84
  }, {
      start: 68112, 
      length: 4, 
      convRule: rule45
  }, {
      start: 68117, 
      length: 3, 
      convRule: rule45
  }, {
      start: 68121, 
      length: 27, 
      convRule: rule45
  }, {
      start: 68152, 
      length: 3, 
      convRule: rule84
  }, {
      start: 68159, 
      length: 1, 
      convRule: rule84
  }, {
      start: 68160, 
      length: 8, 
      convRule: rule17
  }, {
      start: 68176, 
      length: 9, 
      convRule: rule2
  }, {
      start: 68192, 
      length: 29, 
      convRule: rule45
  }, {
      start: 68221, 
      length: 2, 
      convRule: rule17
  }, {
      start: 68223, 
      length: 1, 
      convRule: rule2
  }, {
      start: 68352, 
      length: 54, 
      convRule: rule45
  }, {
      start: 68409, 
      length: 7, 
      convRule: rule2
  }, {
      start: 68416, 
      length: 22, 
      convRule: rule45
  }, {
      start: 68440, 
      length: 8, 
      convRule: rule17
  }, {
      start: 68448, 
      length: 19, 
      convRule: rule45
  }, {
      start: 68472, 
      length: 8, 
      convRule: rule17
  }, {
      start: 68608, 
      length: 73, 
      convRule: rule45
  }, {
      start: 69216, 
      length: 31, 
      convRule: rule17
  }, {
      start: 69632, 
      length: 1, 
      convRule: rule114
  }, {
      start: 69633, 
      length: 1, 
      convRule: rule84
  }, {
      start: 69634, 
      length: 1, 
      convRule: rule114
  }, {
      start: 69635, 
      length: 53, 
      convRule: rule45
  }, {
      start: 69688, 
      length: 15, 
      convRule: rule84
  }, {
      start: 69703, 
      length: 7, 
      convRule: rule2
  }, {
      start: 69714, 
      length: 20, 
      convRule: rule17
  }, {
      start: 69734, 
      length: 10, 
      convRule: rule8
  }, {
      start: 69760, 
      length: 2, 
      convRule: rule84
  }, {
      start: 69762, 
      length: 1, 
      convRule: rule114
  }, {
      start: 69763, 
      length: 45, 
      convRule: rule45
  }, {
      start: 69808, 
      length: 3, 
      convRule: rule114
  }, {
      start: 69811, 
      length: 4, 
      convRule: rule84
  }, {
      start: 69815, 
      length: 2, 
      convRule: rule114
  }, {
      start: 69817, 
      length: 2, 
      convRule: rule84
  }, {
      start: 69819, 
      length: 2, 
      convRule: rule2
  }, {
      start: 69821, 
      length: 1, 
      convRule: rule16
  }, {
      start: 69822, 
      length: 4, 
      convRule: rule2
  }, {
      start: 73728, 
      length: 879, 
      convRule: rule45
  }, {
      start: 74752, 
      length: 99, 
      convRule: rule116
  }, {
      start: 74864, 
      length: 4, 
      convRule: rule2
  }, {
      start: 77824, 
      length: 1071, 
      convRule: rule45
  }, {
      start: 92160, 
      length: 569, 
      convRule: rule45
  }, {
      start: 110592, 
      length: 2, 
      convRule: rule45
  }, {
      start: 118784, 
      length: 246, 
      convRule: rule13
  }, {
      start: 119040, 
      length: 39, 
      convRule: rule13
  }, {
      start: 119081, 
      length: 60, 
      convRule: rule13
  }, {
      start: 119141, 
      length: 2, 
      convRule: rule114
  }, {
      start: 119143, 
      length: 3, 
      convRule: rule84
  }, {
      start: 119146, 
      length: 3, 
      convRule: rule13
  }, {
      start: 119149, 
      length: 6, 
      convRule: rule114
  }, {
      start: 119155, 
      length: 8, 
      convRule: rule16
  }, {
      start: 119163, 
      length: 8, 
      convRule: rule84
  }, {
      start: 119171, 
      length: 2, 
      convRule: rule13
  }, {
      start: 119173, 
      length: 7, 
      convRule: rule84
  }, {
      start: 119180, 
      length: 30, 
      convRule: rule13
  }, {
      start: 119210, 
      length: 4, 
      convRule: rule84
  }, {
      start: 119214, 
      length: 48, 
      convRule: rule13
  }, {
      start: 119296, 
      length: 66, 
      convRule: rule13
  }, {
      start: 119362, 
      length: 3, 
      convRule: rule84
  }, {
      start: 119365, 
      length: 1, 
      convRule: rule13
  }, {
      start: 119552, 
      length: 87, 
      convRule: rule13
  }, {
      start: 119648, 
      length: 18, 
      convRule: rule17
  }, {
      start: 119808, 
      length: 26, 
      convRule: rule98
  }, {
      start: 119834, 
      length: 26, 
      convRule: rule14
  }, {
      start: 119860, 
      length: 26, 
      convRule: rule98
  }, {
      start: 119886, 
      length: 7, 
      convRule: rule14
  }, {
      start: 119894, 
      length: 18, 
      convRule: rule14
  }, {
      start: 119912, 
      length: 26, 
      convRule: rule98
  }, {
      start: 119938, 
      length: 26, 
      convRule: rule14
  }, {
      start: 119964, 
      length: 1, 
      convRule: rule98
  }, {
      start: 119966, 
      length: 2, 
      convRule: rule98
  }, {
      start: 119970, 
      length: 1, 
      convRule: rule98
  }, {
      start: 119973, 
      length: 2, 
      convRule: rule98
  }, {
      start: 119977, 
      length: 4, 
      convRule: rule98
  }, {
      start: 119982, 
      length: 8, 
      convRule: rule98
  }, {
      start: 119990, 
      length: 4, 
      convRule: rule14
  }, {
      start: 119995, 
      length: 1, 
      convRule: rule14
  }, {
      start: 119997, 
      length: 7, 
      convRule: rule14
  }, {
      start: 120005, 
      length: 11, 
      convRule: rule14
  }, {
      start: 120016, 
      length: 26, 
      convRule: rule98
  }, {
      start: 120042, 
      length: 26, 
      convRule: rule14
  }, {
      start: 120068, 
      length: 2, 
      convRule: rule98
  }, {
      start: 120071, 
      length: 4, 
      convRule: rule98
  }, {
      start: 120077, 
      length: 8, 
      convRule: rule98
  }, {
      start: 120086, 
      length: 7, 
      convRule: rule98
  }, {
      start: 120094, 
      length: 26, 
      convRule: rule14
  }, {
      start: 120120, 
      length: 2, 
      convRule: rule98
  }, {
      start: 120123, 
      length: 4, 
      convRule: rule98
  }, {
      start: 120128, 
      length: 5, 
      convRule: rule98
  }, {
      start: 120134, 
      length: 1, 
      convRule: rule98
  }, {
      start: 120138, 
      length: 7, 
      convRule: rule98
  }, {
      start: 120146, 
      length: 26, 
      convRule: rule14
  }, {
      start: 120172, 
      length: 26, 
      convRule: rule98
  }, {
      start: 120198, 
      length: 26, 
      convRule: rule14
  }, {
      start: 120224, 
      length: 26, 
      convRule: rule98
  }, {
      start: 120250, 
      length: 26, 
      convRule: rule14
  }, {
      start: 120276, 
      length: 26, 
      convRule: rule98
  }, {
      start: 120302, 
      length: 26, 
      convRule: rule14
  }, {
      start: 120328, 
      length: 26, 
      convRule: rule98
  }, {
      start: 120354, 
      length: 26, 
      convRule: rule14
  }, {
      start: 120380, 
      length: 26, 
      convRule: rule98
  }, {
      start: 120406, 
      length: 26, 
      convRule: rule14
  }, {
      start: 120432, 
      length: 26, 
      convRule: rule98
  }, {
      start: 120458, 
      length: 28, 
      convRule: rule14
  }, {
      start: 120488, 
      length: 25, 
      convRule: rule98
  }, {
      start: 120513, 
      length: 1, 
      convRule: rule6
  }, {
      start: 120514, 
      length: 25, 
      convRule: rule14
  }, {
      start: 120539, 
      length: 1, 
      convRule: rule6
  }, {
      start: 120540, 
      length: 6, 
      convRule: rule14
  }, {
      start: 120546, 
      length: 25, 
      convRule: rule98
  }, {
      start: 120571, 
      length: 1, 
      convRule: rule6
  }, {
      start: 120572, 
      length: 25, 
      convRule: rule14
  }, {
      start: 120597, 
      length: 1, 
      convRule: rule6
  }, {
      start: 120598, 
      length: 6, 
      convRule: rule14
  }, {
      start: 120604, 
      length: 25, 
      convRule: rule98
  }, {
      start: 120629, 
      length: 1, 
      convRule: rule6
  }, {
      start: 120630, 
      length: 25, 
      convRule: rule14
  }, {
      start: 120655, 
      length: 1, 
      convRule: rule6
  }, {
      start: 120656, 
      length: 6, 
      convRule: rule14
  }, {
      start: 120662, 
      length: 25, 
      convRule: rule98
  }, {
      start: 120687, 
      length: 1, 
      convRule: rule6
  }, {
      start: 120688, 
      length: 25, 
      convRule: rule14
  }, {
      start: 120713, 
      length: 1, 
      convRule: rule6
  }, {
      start: 120714, 
      length: 6, 
      convRule: rule14
  }, {
      start: 120720, 
      length: 25, 
      convRule: rule98
  }, {
      start: 120745, 
      length: 1, 
      convRule: rule6
  }, {
      start: 120746, 
      length: 25, 
      convRule: rule14
  }, {
      start: 120771, 
      length: 1, 
      convRule: rule6
  }, {
      start: 120772, 
      length: 6, 
      convRule: rule14
  }, {
      start: 120778, 
      length: 1, 
      convRule: rule98
  }, {
      start: 120779, 
      length: 1, 
      convRule: rule14
  }, {
      start: 120782, 
      length: 50, 
      convRule: rule8
  }, {
      start: 126976, 
      length: 44, 
      convRule: rule13
  }, {
      start: 127024, 
      length: 100, 
      convRule: rule13
  }, {
      start: 127136, 
      length: 15, 
      convRule: rule13
  }, {
      start: 127153, 
      length: 14, 
      convRule: rule13
  }, {
      start: 127169, 
      length: 15, 
      convRule: rule13
  }, {
      start: 127185, 
      length: 15, 
      convRule: rule13
  }, {
      start: 127232, 
      length: 11, 
      convRule: rule17
  }, {
      start: 127248, 
      length: 31, 
      convRule: rule13
  }, {
      start: 127280, 
      length: 58, 
      convRule: rule13
  }, {
      start: 127344, 
      length: 43, 
      convRule: rule13
  }, {
      start: 127462, 
      length: 29, 
      convRule: rule13
  }, {
      start: 127504, 
      length: 43, 
      convRule: rule13
  }, {
      start: 127552, 
      length: 9, 
      convRule: rule13
  }, {
      start: 127568, 
      length: 2, 
      convRule: rule13
  }, {
      start: 127744, 
      length: 33, 
      convRule: rule13
  }, {
      start: 127792, 
      length: 6, 
      convRule: rule13
  }, {
      start: 127799, 
      length: 70, 
      convRule: rule13
  }, {
      start: 127872, 
      length: 20, 
      convRule: rule13
  }, {
      start: 127904, 
      length: 37, 
      convRule: rule13
  }, {
      start: 127942, 
      length: 5, 
      convRule: rule13
  }, {
      start: 127968, 
      length: 17, 
      convRule: rule13
  }, {
      start: 128000, 
      length: 63, 
      convRule: rule13
  }, {
      start: 128064, 
      length: 1, 
      convRule: rule13
  }, {
      start: 128066, 
      length: 182, 
      convRule: rule13
  }, {
      start: 128249, 
      length: 4, 
      convRule: rule13
  }, {
      start: 128256, 
      length: 62, 
      convRule: rule13
  }, {
      start: 128336, 
      length: 24, 
      convRule: rule13
  }, {
      start: 128507, 
      length: 5, 
      convRule: rule13
  }, {
      start: 128513, 
      length: 16, 
      convRule: rule13
  }, {
      start: 128530, 
      length: 3, 
      convRule: rule13
  }, {
      start: 128534, 
      length: 1, 
      convRule: rule13
  }, {
      start: 128536, 
      length: 1, 
      convRule: rule13
  }, {
      start: 128538, 
      length: 1, 
      convRule: rule13
  }, {
      start: 128540, 
      length: 3, 
      convRule: rule13
  }, {
      start: 128544, 
      length: 6, 
      convRule: rule13
  }, {
      start: 128552, 
      length: 4, 
      convRule: rule13
  }, {
      start: 128557, 
      length: 1, 
      convRule: rule13
  }, {
      start: 128560, 
      length: 4, 
      convRule: rule13
  }, {
      start: 128565, 
      length: 12, 
      convRule: rule13
  }, {
      start: 128581, 
      length: 11, 
      convRule: rule13
  }, {
      start: 128640, 
      length: 70, 
      convRule: rule13
  }, {
      start: 128768, 
      length: 116, 
      convRule: rule13
  }, {
      start: 131072, 
      length: 42711, 
      convRule: rule45
  }, {
      start: 173824, 
      length: 4149, 
      convRule: rule45
  }, {
      start: 177984, 
      length: 222, 
      convRule: rule45
  }, {
      start: 194560, 
      length: 542, 
      convRule: rule45
  }, {
      start: 917505, 
      length: 1, 
      convRule: rule16
  }, {
      start: 917536, 
      length: 96, 
      convRule: rule16
  }, {
      start: 917760, 
      length: 240, 
      convRule: rule84
  }, {
      start: 983040, 
      length: 65534, 
      convRule: rule164
  }, {
      start: 1048576, 
      length: 65534, 
      convRule: rule164
  } ];
  var checkAttr = function (categories) {
      return function ($$char) {
          var numOfBlocks = (function () {
              var $28 = $$char < 256;
              if ($28) {
                  return numLat1Blocks;
              };
              return numBlocks;
          })();
          var maybeConversionRule = getRule(allchars)($$char)(numOfBlocks);
          if (maybeConversionRule instanceof Data_Maybe.Nothing) {
              return false;
          };
          if (maybeConversionRule instanceof Data_Maybe.Just) {
              return Data_Maybe.isJust(Data_Array.elemIndex(Data_Eq.eqInt)(maybeConversionRule.value0.category)(categories));
          };
          throw new Error("Failed pattern match at Data.Char.Unicode.Internal line 4800, column 8 - line 4802, column 92: " + [ maybeConversionRule.constructor.name ]);
      };
  };
  var uIswalnum = checkAttr([ gencatLT, gencatLU, gencatLL, gencatLM, gencatLO, gencatMC, gencatME, gencatMN, gencatNO, gencatND, gencatNL ]);
  var uIswalpha = checkAttr([ gencatLL, gencatLU, gencatLT, gencatLM, gencatLO ]);
  var uIswlower = checkAttr([ gencatLL ]);                                                                                                                                                                                                                            
  var uIswupper = checkAttr([ gencatLU, gencatLT ]);
  exports["NUMCAT_LU"] = NUMCAT_LU;
  exports["NUMCAT_LL"] = NUMCAT_LL;
  exports["NUMCAT_LT"] = NUMCAT_LT;
  exports["NUMCAT_LM"] = NUMCAT_LM;
  exports["NUMCAT_LO"] = NUMCAT_LO;
  exports["NUMCAT_MN"] = NUMCAT_MN;
  exports["NUMCAT_MC"] = NUMCAT_MC;
  exports["NUMCAT_ME"] = NUMCAT_ME;
  exports["NUMCAT_ND"] = NUMCAT_ND;
  exports["NUMCAT_NL"] = NUMCAT_NL;
  exports["NUMCAT_NO"] = NUMCAT_NO;
  exports["NUMCAT_PC"] = NUMCAT_PC;
  exports["NUMCAT_PD"] = NUMCAT_PD;
  exports["NUMCAT_PS"] = NUMCAT_PS;
  exports["NUMCAT_PE"] = NUMCAT_PE;
  exports["NUMCAT_PI"] = NUMCAT_PI;
  exports["NUMCAT_PF"] = NUMCAT_PF;
  exports["NUMCAT_PO"] = NUMCAT_PO;
  exports["NUMCAT_SM"] = NUMCAT_SM;
  exports["NUMCAT_SC"] = NUMCAT_SC;
  exports["NUMCAT_SK"] = NUMCAT_SK;
  exports["NUMCAT_SO"] = NUMCAT_SO;
  exports["NUMCAT_ZS"] = NUMCAT_ZS;
  exports["NUMCAT_ZL"] = NUMCAT_ZL;
  exports["NUMCAT_ZP"] = NUMCAT_ZP;
  exports["NUMCAT_CC"] = NUMCAT_CC;
  exports["NUMCAT_CF"] = NUMCAT_CF;
  exports["NUMCAT_CS"] = NUMCAT_CS;
  exports["NUMCAT_CO"] = NUMCAT_CO;
  exports["NUMCAT_CN"] = NUMCAT_CN;
  exports["allchars"] = allchars;
  exports["blkCmp"] = blkCmp;
  exports["bsearch"] = bsearch;
  exports["caseConv"] = caseConv;
  exports["checkAttr"] = checkAttr;
  exports["checkAttrS"] = checkAttrS;
  exports["convchars"] = convchars;
  exports["gencatCC"] = gencatCC;
  exports["gencatCF"] = gencatCF;
  exports["gencatCO"] = gencatCO;
  exports["gencatCS"] = gencatCS;
  exports["gencatLL"] = gencatLL;
  exports["gencatLM"] = gencatLM;
  exports["gencatLO"] = gencatLO;
  exports["gencatLT"] = gencatLT;
  exports["gencatLU"] = gencatLU;
  exports["gencatMC"] = gencatMC;
  exports["gencatME"] = gencatME;
  exports["gencatMN"] = gencatMN;
  exports["gencatND"] = gencatND;
  exports["gencatNL"] = gencatNL;
  exports["gencatNO"] = gencatNO;
  exports["gencatPC"] = gencatPC;
  exports["gencatPD"] = gencatPD;
  exports["gencatPE"] = gencatPE;
  exports["gencatPF"] = gencatPF;
  exports["gencatPI"] = gencatPI;
  exports["gencatPO"] = gencatPO;
  exports["gencatPS"] = gencatPS;
  exports["gencatSC"] = gencatSC;
  exports["gencatSK"] = gencatSK;
  exports["gencatSM"] = gencatSM;
  exports["gencatSO"] = gencatSO;
  exports["gencatZL"] = gencatZL;
  exports["gencatZP"] = gencatZP;
  exports["gencatZS"] = gencatZS;
  exports["getRule"] = getRule;
  exports["nullrule"] = nullrule;
  exports["numBlocks"] = numBlocks;
  exports["numConvBlocks"] = numConvBlocks;
  exports["numLat1Blocks"] = numLat1Blocks;
  exports["numSpaceBlocks"] = numSpaceBlocks;
  exports["rule0"] = rule0;
  exports["rule1"] = rule1;
  exports["rule10"] = rule10;
  exports["rule100"] = rule100;
  exports["rule101"] = rule101;
  exports["rule102"] = rule102;
  exports["rule103"] = rule103;
  exports["rule104"] = rule104;
  exports["rule105"] = rule105;
  exports["rule106"] = rule106;
  exports["rule107"] = rule107;
  exports["rule108"] = rule108;
  exports["rule109"] = rule109;
  exports["rule11"] = rule11;
  exports["rule110"] = rule110;
  exports["rule111"] = rule111;
  exports["rule112"] = rule112;
  exports["rule113"] = rule113;
  exports["rule114"] = rule114;
  exports["rule115"] = rule115;
  exports["rule116"] = rule116;
  exports["rule117"] = rule117;
  exports["rule118"] = rule118;
  exports["rule119"] = rule119;
  exports["rule12"] = rule12;
  exports["rule120"] = rule120;
  exports["rule121"] = rule121;
  exports["rule122"] = rule122;
  exports["rule123"] = rule123;
  exports["rule124"] = rule124;
  exports["rule125"] = rule125;
  exports["rule126"] = rule126;
  exports["rule127"] = rule127;
  exports["rule128"] = rule128;
  exports["rule129"] = rule129;
  exports["rule13"] = rule13;
  exports["rule130"] = rule130;
  exports["rule131"] = rule131;
  exports["rule132"] = rule132;
  exports["rule133"] = rule133;
  exports["rule134"] = rule134;
  exports["rule135"] = rule135;
  exports["rule136"] = rule136;
  exports["rule137"] = rule137;
  exports["rule138"] = rule138;
  exports["rule139"] = rule139;
  exports["rule14"] = rule14;
  exports["rule140"] = rule140;
  exports["rule141"] = rule141;
  exports["rule142"] = rule142;
  exports["rule143"] = rule143;
  exports["rule144"] = rule144;
  exports["rule145"] = rule145;
  exports["rule146"] = rule146;
  exports["rule147"] = rule147;
  exports["rule148"] = rule148;
  exports["rule149"] = rule149;
  exports["rule15"] = rule15;
  exports["rule150"] = rule150;
  exports["rule151"] = rule151;
  exports["rule152"] = rule152;
  exports["rule153"] = rule153;
  exports["rule154"] = rule154;
  exports["rule155"] = rule155;
  exports["rule156"] = rule156;
  exports["rule157"] = rule157;
  exports["rule158"] = rule158;
  exports["rule159"] = rule159;
  exports["rule16"] = rule16;
  exports["rule160"] = rule160;
  exports["rule161"] = rule161;
  exports["rule162"] = rule162;
  exports["rule163"] = rule163;
  exports["rule164"] = rule164;
  exports["rule165"] = rule165;
  exports["rule166"] = rule166;
  exports["rule17"] = rule17;
  exports["rule18"] = rule18;
  exports["rule19"] = rule19;
  exports["rule2"] = rule2;
  exports["rule20"] = rule20;
  exports["rule21"] = rule21;
  exports["rule22"] = rule22;
  exports["rule23"] = rule23;
  exports["rule24"] = rule24;
  exports["rule25"] = rule25;
  exports["rule26"] = rule26;
  exports["rule27"] = rule27;
  exports["rule28"] = rule28;
  exports["rule29"] = rule29;
  exports["rule3"] = rule3;
  exports["rule30"] = rule30;
  exports["rule31"] = rule31;
  exports["rule32"] = rule32;
  exports["rule33"] = rule33;
  exports["rule34"] = rule34;
  exports["rule35"] = rule35;
  exports["rule36"] = rule36;
  exports["rule37"] = rule37;
  exports["rule38"] = rule38;
  exports["rule39"] = rule39;
  exports["rule4"] = rule4;
  exports["rule40"] = rule40;
  exports["rule41"] = rule41;
  exports["rule42"] = rule42;
  exports["rule43"] = rule43;
  exports["rule44"] = rule44;
  exports["rule45"] = rule45;
  exports["rule46"] = rule46;
  exports["rule47"] = rule47;
  exports["rule48"] = rule48;
  exports["rule49"] = rule49;
  exports["rule5"] = rule5;
  exports["rule50"] = rule50;
  exports["rule51"] = rule51;
  exports["rule52"] = rule52;
  exports["rule53"] = rule53;
  exports["rule54"] = rule54;
  exports["rule55"] = rule55;
  exports["rule56"] = rule56;
  exports["rule57"] = rule57;
  exports["rule58"] = rule58;
  exports["rule59"] = rule59;
  exports["rule6"] = rule6;
  exports["rule60"] = rule60;
  exports["rule61"] = rule61;
  exports["rule62"] = rule62;
  exports["rule63"] = rule63;
  exports["rule64"] = rule64;
  exports["rule65"] = rule65;
  exports["rule66"] = rule66;
  exports["rule67"] = rule67;
  exports["rule68"] = rule68;
  exports["rule69"] = rule69;
  exports["rule7"] = rule7;
  exports["rule70"] = rule70;
  exports["rule71"] = rule71;
  exports["rule72"] = rule72;
  exports["rule73"] = rule73;
  exports["rule74"] = rule74;
  exports["rule75"] = rule75;
  exports["rule76"] = rule76;
  exports["rule77"] = rule77;
  exports["rule78"] = rule78;
  exports["rule79"] = rule79;
  exports["rule8"] = rule8;
  exports["rule80"] = rule80;
  exports["rule81"] = rule81;
  exports["rule82"] = rule82;
  exports["rule83"] = rule83;
  exports["rule84"] = rule84;
  exports["rule85"] = rule85;
  exports["rule86"] = rule86;
  exports["rule87"] = rule87;
  exports["rule88"] = rule88;
  exports["rule89"] = rule89;
  exports["rule9"] = rule9;
  exports["rule90"] = rule90;
  exports["rule91"] = rule91;
  exports["rule92"] = rule92;
  exports["rule93"] = rule93;
  exports["rule94"] = rule94;
  exports["rule95"] = rule95;
  exports["rule96"] = rule96;
  exports["rule97"] = rule97;
  exports["rule98"] = rule98;
  exports["rule99"] = rule99;
  exports["spacechars"] = spacechars;
  exports["uIswalnum"] = uIswalnum;
  exports["uIswalpha"] = uIswalpha;
  exports["uIswlower"] = uIswlower;
  exports["uIswspace"] = uIswspace;
  exports["uIswupper"] = uIswupper;
  exports["uTowlower"] = uTowlower;
  exports["uTowupper"] = uTowupper;
})(PS["Data.Char.Unicode.Internal"] = PS["Data.Char.Unicode.Internal"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Char = PS["Data.Char"];
  var Data_Char_Unicode_Internal = PS["Data.Char.Unicode.Internal"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];
  var toUpper = function ($50) {
      return Data_Char.fromCharCode(Data_Char_Unicode_Internal.uTowupper(Data_Char.toCharCode($50)));
  };
  var toLower = function ($52) {
      return Data_Char.fromCharCode(Data_Char_Unicode_Internal.uTowlower(Data_Char.toCharCode($52)));
  }; 
  var isUpper = function ($53) {
      return Data_Char_Unicode_Internal.uIswupper(Data_Char.toCharCode($53));
  };
  var isSpace = function (c) {
      var uc = Data_Char.toCharCode(c);
      var $14 = uc <= 823;
      if ($14) {
          return uc === 32 || (uc >= 9 && uc <= 13 || uc === 160);
      };
      return Data_Char_Unicode_Internal.uIswspace(Data_Char.toCharCode(c));
  };
  var isOctDigit = function (c) {
      var diff = Data_Char.toCharCode(c) - Data_Char.toCharCode("0") | 0;
      return diff <= 7 && diff >= 0;
  };
  var isLower = function ($55) {
      return Data_Char_Unicode_Internal.uIswlower(Data_Char.toCharCode($55));
  };
  var isDigit = function (c) {
      var diff = Data_Char.toCharCode(c) - Data_Char.toCharCode("0") | 0;
      return diff <= 9 && diff >= 0;
  };
  var isHexDigit = function (c) {
      return isDigit(c) || ((function () {
          var diff = Data_Char.toCharCode(c) - Data_Char.toCharCode("A") | 0;
          return diff <= 5 && diff >= 0;
      })() || (function () {
          var diff = Data_Char.toCharCode(c) - Data_Char.toCharCode("a") | 0;
          return diff <= 5 && diff >= 0;
      })());
  };
  var isAlphaNum = function ($57) {
      return Data_Char_Unicode_Internal.uIswalnum(Data_Char.toCharCode($57));
  };
  var isAlpha = function ($58) {
      return Data_Char_Unicode_Internal.uIswalpha(Data_Char.toCharCode($58));
  }; 
  var digitToInt = function (c) {
      var hexUpper = Data_Char.toCharCode(c) - Data_Char.toCharCode("A") | 0;
      var hexLower = Data_Char.toCharCode(c) - Data_Char.toCharCode("a") | 0;
      var dec = Data_Char.toCharCode(c) - Data_Char.toCharCode("0") | 0;
      var result = (function () {
          if (dec <= 9 && dec >= 0) {
              return new Data_Maybe.Just(dec);
          };
          if (hexLower <= 5 && hexLower >= 0) {
              return Data_Maybe.Just.create(hexLower + 10 | 0);
          };
          if (hexUpper <= 5 && hexUpper >= 0) {
              return Data_Maybe.Just.create(hexUpper + 10 | 0);
          };
          if (Data_Boolean.otherwise) {
              return Data_Maybe.Nothing.value;
          };
          throw new Error("Failed pattern match at Data.Char.Unicode line 519, column 5 - line 523, column 49: " + [  ]);
      })();
      return result;
  };
  exports["digitToInt"] = digitToInt;
  exports["isAlpha"] = isAlpha;
  exports["isAlphaNum"] = isAlphaNum;
  exports["isDigit"] = isDigit;
  exports["isHexDigit"] = isHexDigit;
  exports["isLower"] = isLower;
  exports["isOctDigit"] = isOctDigit;
  exports["isSpace"] = isSpace;
  exports["isUpper"] = isUpper;
  exports["toLower"] = toLower;
  exports["toUpper"] = toUpper;
})(PS["Data.Char.Unicode"] = PS["Data.Char.Unicode"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Exists = PS["Data.Exists"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Ord = PS["Data.Ord"];
  var Prelude = PS["Prelude"];        
  var CoyonedaF = (function () {
      function CoyonedaF(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      CoyonedaF.create = function (value0) {
          return function (value1) {
              return new CoyonedaF(value0, value1);
          };
      };
      return CoyonedaF;
  })();
  var Coyoneda = function (x) {
      return x;
  };
  var unCoyoneda = function (f) {
      return function (v) {
          return Data_Exists.runExists(function (v1) {
              return f(v1.value0)(v1.value1);
          })(v);
      };
  };
  var coyoneda = function (k) {
      return function (fi) {
          return Coyoneda(Data_Exists.mkExists(new CoyonedaF(k, fi)));
      };
  };
  exports["Coyoneda"] = Coyoneda;
  exports["coyoneda"] = coyoneda;
  exports["unCoyoneda"] = unCoyoneda;
})(PS["Data.Coyoneda"] = PS["Data.Coyoneda"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Generic = PS["Data.Generic"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_String = PS["Data.String"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var OPTIONS = (function () {
      function OPTIONS() {

      };
      OPTIONS.value = new OPTIONS();
      return OPTIONS;
  })();
  var GET = (function () {
      function GET() {

      };
      GET.value = new GET();
      return GET;
  })();
  var HEAD = (function () {
      function HEAD() {

      };
      HEAD.value = new HEAD();
      return HEAD;
  })();
  var POST = (function () {
      function POST() {

      };
      POST.value = new POST();
      return POST;
  })();
  var PUT = (function () {
      function PUT() {

      };
      PUT.value = new PUT();
      return PUT;
  })();
  var DELETE = (function () {
      function DELETE() {

      };
      DELETE.value = new DELETE();
      return DELETE;
  })();
  var TRACE = (function () {
      function TRACE() {

      };
      TRACE.value = new TRACE();
      return TRACE;
  })();
  var CONNECT = (function () {
      function CONNECT() {

      };
      CONNECT.value = new CONNECT();
      return CONNECT;
  })();
  var PROPFIND = (function () {
      function PROPFIND() {

      };
      PROPFIND.value = new PROPFIND();
      return PROPFIND;
  })();
  var PROPPATCH = (function () {
      function PROPPATCH() {

      };
      PROPPATCH.value = new PROPPATCH();
      return PROPPATCH;
  })();
  var MKCOL = (function () {
      function MKCOL() {

      };
      MKCOL.value = new MKCOL();
      return MKCOL;
  })();
  var COPY = (function () {
      function COPY() {

      };
      COPY.value = new COPY();
      return COPY;
  })();
  var MOVE = (function () {
      function MOVE() {

      };
      MOVE.value = new MOVE();
      return MOVE;
  })();
  var LOCK = (function () {
      function LOCK() {

      };
      LOCK.value = new LOCK();
      return LOCK;
  })();
  var UNLOCK = (function () {
      function UNLOCK() {

      };
      UNLOCK.value = new UNLOCK();
      return UNLOCK;
  })();
  var PATCH = (function () {
      function PATCH() {

      };
      PATCH.value = new PATCH();
      return PATCH;
  })();
  var unCustomMethod = function (v) {
      return v;
  };
  var showMethod = new Data_Show.Show(function (v) {
      if (v instanceof OPTIONS) {
          return "OPTIONS";
      };
      if (v instanceof GET) {
          return "GET";
      };
      if (v instanceof HEAD) {
          return "HEAD";
      };
      if (v instanceof POST) {
          return "POST";
      };
      if (v instanceof PUT) {
          return "PUT";
      };
      if (v instanceof DELETE) {
          return "DELETE";
      };
      if (v instanceof TRACE) {
          return "TRACE";
      };
      if (v instanceof CONNECT) {
          return "CONNECT";
      };
      if (v instanceof PROPFIND) {
          return "PROPFIND";
      };
      if (v instanceof PROPPATCH) {
          return "PROPPATCH";
      };
      if (v instanceof MKCOL) {
          return "MKCOL";
      };
      if (v instanceof COPY) {
          return "COPY";
      };
      if (v instanceof MOVE) {
          return "MOVE";
      };
      if (v instanceof LOCK) {
          return "LOCK";
      };
      if (v instanceof UNLOCK) {
          return "UNLOCK";
      };
      if (v instanceof PATCH) {
          return "PATCH";
      };
      throw new Error("Failed pattern match at Data.HTTP.Method line 43, column 3 - line 44, column 3: " + [ v.constructor.name ]);
  });
  var print = Data_Either.either(Data_Show.show(showMethod))(unCustomMethod);
  exports["OPTIONS"] = OPTIONS;
  exports["GET"] = GET;
  exports["HEAD"] = HEAD;
  exports["POST"] = POST;
  exports["PUT"] = PUT;
  exports["DELETE"] = DELETE;
  exports["TRACE"] = TRACE;
  exports["CONNECT"] = CONNECT;
  exports["PROPFIND"] = PROPFIND;
  exports["PROPPATCH"] = PROPPATCH;
  exports["MKCOL"] = MKCOL;
  exports["COPY"] = COPY;
  exports["MOVE"] = MOVE;
  exports["LOCK"] = LOCK;
  exports["UNLOCK"] = UNLOCK;
  exports["PATCH"] = PATCH;
  exports["print"] = print;
  exports["unCustomMethod"] = unCustomMethod;
  exports["showMethod"] = showMethod;
})(PS["Data.HTTP.Method"] = PS["Data.HTTP.Method"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_List = PS["Data.List"];
  var Data_List_Lazy = PS["Data.List.Lazy"];
  var Data_List_Lazy_Types = PS["Data.List.Lazy.Types"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
  var Leaf = (function () {
      function Leaf() {

      };
      Leaf.value = new Leaf();
      return Leaf;
  })();
  var Two = (function () {
      function Two(value0, value1, value2, value3) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
      };
      Two.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return new Two(value0, value1, value2, value3);
                  };
              };
          };
      };
      return Two;
  })();
  var Three = (function () {
      function Three(value0, value1, value2, value3, value4, value5, value6) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
          this.value5 = value5;
          this.value6 = value6;
      };
      Three.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return function (value4) {
                          return function (value5) {
                              return function (value6) {
                                  return new Three(value0, value1, value2, value3, value4, value5, value6);
                              };
                          };
                      };
                  };
              };
          };
      };
      return Three;
  })();
  var TwoLeft = (function () {
      function TwoLeft(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      TwoLeft.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new TwoLeft(value0, value1, value2);
              };
          };
      };
      return TwoLeft;
  })();
  var TwoRight = (function () {
      function TwoRight(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      TwoRight.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new TwoRight(value0, value1, value2);
              };
          };
      };
      return TwoRight;
  })();
  var ThreeLeft = (function () {
      function ThreeLeft(value0, value1, value2, value3, value4, value5) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
          this.value5 = value5;
      };
      ThreeLeft.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return function (value4) {
                          return function (value5) {
                              return new ThreeLeft(value0, value1, value2, value3, value4, value5);
                          };
                      };
                  };
              };
          };
      };
      return ThreeLeft;
  })();
  var ThreeMiddle = (function () {
      function ThreeMiddle(value0, value1, value2, value3, value4, value5) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
          this.value5 = value5;
      };
      ThreeMiddle.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return function (value4) {
                          return function (value5) {
                              return new ThreeMiddle(value0, value1, value2, value3, value4, value5);
                          };
                      };
                  };
              };
          };
      };
      return ThreeMiddle;
  })();
  var ThreeRight = (function () {
      function ThreeRight(value0, value1, value2, value3, value4, value5) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
          this.value5 = value5;
      };
      ThreeRight.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return function (value4) {
                          return function (value5) {
                              return new ThreeRight(value0, value1, value2, value3, value4, value5);
                          };
                      };
                  };
              };
          };
      };
      return ThreeRight;
  })();
  var KickUp = (function () {
      function KickUp(value0, value1, value2, value3) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
      };
      KickUp.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return new KickUp(value0, value1, value2, value3);
                  };
              };
          };
      };
      return KickUp;
  })();
  var values = function (v) {
      if (v instanceof Leaf) {
          return Data_List_Types.Nil.value;
      };
      if (v instanceof Two) {
          return Data_Semigroup.append(Data_List_Types.semigroupList)(values(v.value0))(Data_Semigroup.append(Data_List_Types.semigroupList)(Control_Applicative.pure(Data_List_Types.applicativeList)(v.value2))(values(v.value3)));
      };
      if (v instanceof Three) {
          return Data_Semigroup.append(Data_List_Types.semigroupList)(values(v.value0))(Data_Semigroup.append(Data_List_Types.semigroupList)(Control_Applicative.pure(Data_List_Types.applicativeList)(v.value2))(Data_Semigroup.append(Data_List_Types.semigroupList)(values(v.value3))(Data_Semigroup.append(Data_List_Types.semigroupList)(Control_Applicative.pure(Data_List_Types.applicativeList)(v.value5))(values(v.value6)))));
      };
      throw new Error("Failed pattern match at Data.Map line 558, column 1 - line 558, column 18: " + [ v.constructor.name ]);
  };
  var lookup = function (dictOrd) {
      return function (k) {
          var comp = Data_Ord.compare(dictOrd);
          var go = function (__copy_v) {
              var __tco_done = false;
              var __tco_result;
              function __tco_loop(v) {
                  if (v instanceof Leaf) {
                      __tco_done = true;
                      return Data_Maybe.Nothing.value;
                  };
                  if (v instanceof Two) {
                      var v2 = comp(k)(v.value1);
                      if (v2 instanceof Data_Ordering.EQ) {
                          __tco_done = true;
                          return new Data_Maybe.Just(v.value2);
                      };
                      if (v2 instanceof Data_Ordering.LT) {
                          __copy_v = v.value0;
                          return;
                      };
                      __copy_v = v.value3;
                      return;
                  };
                  if (v instanceof Three) {
                      var v3 = comp(k)(v.value1);
                      if (v3 instanceof Data_Ordering.EQ) {
                          __tco_done = true;
                          return new Data_Maybe.Just(v.value2);
                      };
                      var v4 = comp(k)(v.value4);
                      if (v4 instanceof Data_Ordering.EQ) {
                          __tco_done = true;
                          return new Data_Maybe.Just(v.value5);
                      };
                      if (v3 instanceof Data_Ordering.LT) {
                          __copy_v = v.value0;
                          return;
                      };
                      if (v4 instanceof Data_Ordering.GT) {
                          __copy_v = v.value6;
                          return;
                      };
                      __copy_v = v.value3;
                      return;
                  };
                  throw new Error("Failed pattern match at Data.Map line 157, column 12 - line 176, column 29: " + [ v.constructor.name ]);
              };
              while (!__tco_done) {
                  __tco_result = __tco_loop(__copy_v);
              };
              return __tco_result;
          };
          return go;
      };
  };
  var member = function (dictOrd) {
      return function (k) {
          return function (m) {
              return Data_Maybe.isJust(lookup(dictOrd)(k)(m));
          };
      };
  };
  var keys = function (v) {
      if (v instanceof Leaf) {
          return Data_List_Types.Nil.value;
      };
      if (v instanceof Two) {
          return Data_Semigroup.append(Data_List_Types.semigroupList)(keys(v.value0))(Data_Semigroup.append(Data_List_Types.semigroupList)(Control_Applicative.pure(Data_List_Types.applicativeList)(v.value1))(keys(v.value3)));
      };
      if (v instanceof Three) {
          return Data_Semigroup.append(Data_List_Types.semigroupList)(keys(v.value0))(Data_Semigroup.append(Data_List_Types.semigroupList)(Control_Applicative.pure(Data_List_Types.applicativeList)(v.value1))(Data_Semigroup.append(Data_List_Types.semigroupList)(keys(v.value3))(Data_Semigroup.append(Data_List_Types.semigroupList)(Control_Applicative.pure(Data_List_Types.applicativeList)(v.value4))(keys(v.value6)))));
      };
      throw new Error("Failed pattern match at Data.Map line 552, column 1 - line 552, column 16: " + [ v.constructor.name ]);
  };
  var functorMap = new Data_Functor.Functor(function (v) {
      return function (v1) {
          if (v1 instanceof Leaf) {
              return Leaf.value;
          };
          if (v1 instanceof Two) {
              return new Two(Data_Functor.map(functorMap)(v)(v1.value0), v1.value1, v(v1.value2), Data_Functor.map(functorMap)(v)(v1.value3));
          };
          if (v1 instanceof Three) {
              return new Three(Data_Functor.map(functorMap)(v)(v1.value0), v1.value1, v(v1.value2), Data_Functor.map(functorMap)(v)(v1.value3), v1.value4, v(v1.value5), Data_Functor.map(functorMap)(v)(v1.value6));
          };
          throw new Error("Failed pattern match at Data.Map line 88, column 3 - line 88, column 20: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var fromZipper = function (__copy_dictOrd) {
      return function (__copy_v) {
          return function (__copy_tree) {
              var __tco_dictOrd = __copy_dictOrd;
              var __tco_v = __copy_v;
              var __tco_done = false;
              var __tco_result;
              function __tco_loop(dictOrd, v, tree) {
                  if (v instanceof Data_List_Types.Nil) {
                      __tco_done = true;
                      return tree;
                  };
                  if (v instanceof Data_List_Types.Cons) {
                      if (v.value0 instanceof TwoLeft) {
                          __tco_dictOrd = dictOrd;
                          __tco_v = v.value1;
                          __copy_tree = new Two(tree, v.value0.value0, v.value0.value1, v.value0.value2);
                          return;
                      };
                      if (v.value0 instanceof TwoRight) {
                          __tco_dictOrd = dictOrd;
                          __tco_v = v.value1;
                          __copy_tree = new Two(v.value0.value0, v.value0.value1, v.value0.value2, tree);
                          return;
                      };
                      if (v.value0 instanceof ThreeLeft) {
                          __tco_dictOrd = dictOrd;
                          __tco_v = v.value1;
                          __copy_tree = new Three(tree, v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5);
                          return;
                      };
                      if (v.value0 instanceof ThreeMiddle) {
                          __tco_dictOrd = dictOrd;
                          __tco_v = v.value1;
                          __copy_tree = new Three(v.value0.value0, v.value0.value1, v.value0.value2, tree, v.value0.value3, v.value0.value4, v.value0.value5);
                          return;
                      };
                      if (v.value0 instanceof ThreeRight) {
                          __tco_dictOrd = dictOrd;
                          __tco_v = v.value1;
                          __copy_tree = new Three(v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5, tree);
                          return;
                      };
                      throw new Error("Failed pattern match at Data.Map line 380, column 3 - line 385, column 88: " + [ v.value0.constructor.name ]);
                  };
                  throw new Error("Failed pattern match at Data.Map line 378, column 1 - line 378, column 27: " + [ v.constructor.name, tree.constructor.name ]);
              };
              while (!__tco_done) {
                  __tco_result = __tco_loop(__tco_dictOrd, __tco_v, __copy_tree);
              };
              return __tco_result;
          };
      };
  };
  var insert = function (dictOrd) {
      return function (k) {
          return function (v) {
              var up = function (__copy_v1) {
                  return function (__copy_v2) {
                      var __tco_v1 = __copy_v1;
                      var __tco_done = false;
                      var __tco_result;
                      function __tco_loop(v1, v2) {
                          if (v1 instanceof Data_List_Types.Nil) {
                              __tco_done = true;
                              return new Two(v2.value0, v2.value1, v2.value2, v2.value3);
                          };
                          if (v1 instanceof Data_List_Types.Cons) {
                              if (v1.value0 instanceof TwoLeft) {
                                  __tco_done = true;
                                  return fromZipper(dictOrd)(v1.value1)(new Three(v2.value0, v2.value1, v2.value2, v2.value3, v1.value0.value0, v1.value0.value1, v1.value0.value2));
                              };
                              if (v1.value0 instanceof TwoRight) {
                                  __tco_done = true;
                                  return fromZipper(dictOrd)(v1.value1)(new Three(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0, v2.value1, v2.value2, v2.value3));
                              };
                              if (v1.value0 instanceof ThreeLeft) {
                                  __tco_v1 = v1.value1;
                                  __copy_v2 = new KickUp(new Two(v2.value0, v2.value1, v2.value2, v2.value3), v1.value0.value0, v1.value0.value1, new Two(v1.value0.value2, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                                  return;
                              };
                              if (v1.value0 instanceof ThreeMiddle) {
                                  __tco_v1 = v1.value1;
                                  __copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0), v2.value1, v2.value2, new Two(v2.value3, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                                  return;
                              };
                              if (v1.value0 instanceof ThreeRight) {
                                  __tco_v1 = v1.value1;
                                  __copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v1.value0.value3), v1.value0.value4, v1.value0.value5, new Two(v2.value0, v2.value1, v2.value2, v2.value3));
                                  return;
                              };
                              throw new Error("Failed pattern match at Data.Map line 416, column 5 - line 421, column 108: " + [ v1.value0.constructor.name, v2.constructor.name ]);
                          };
                          throw new Error("Failed pattern match at Data.Map line 414, column 3 - line 414, column 58: " + [ v1.constructor.name, v2.constructor.name ]);
                      };
                      while (!__tco_done) {
                          __tco_result = __tco_loop(__tco_v1, __copy_v2);
                      };
                      return __tco_result;
                  };
              };
              var comp = Data_Ord.compare(dictOrd);
              var down = function (__copy_ctx) {
                  return function (__copy_v1) {
                      var __tco_ctx = __copy_ctx;
                      var __tco_done = false;
                      var __tco_result;
                      function __tco_loop(ctx, v1) {
                          if (v1 instanceof Leaf) {
                              __tco_done = true;
                              return up(ctx)(new KickUp(Leaf.value, k, v, Leaf.value));
                          };
                          if (v1 instanceof Two) {
                              var v2 = comp(k)(v1.value1);
                              if (v2 instanceof Data_Ordering.EQ) {
                                  __tco_done = true;
                                  return fromZipper(dictOrd)(ctx)(new Two(v1.value0, k, v, v1.value3));
                              };
                              if (v2 instanceof Data_Ordering.LT) {
                                  __tco_ctx = new Data_List_Types.Cons(new TwoLeft(v1.value1, v1.value2, v1.value3), ctx);
                                  __copy_v1 = v1.value0;
                                  return;
                              };
                              __tco_ctx = new Data_List_Types.Cons(new TwoRight(v1.value0, v1.value1, v1.value2), ctx);
                              __copy_v1 = v1.value3;
                              return;
                          };
                          if (v1 instanceof Three) {
                              var v3 = comp(k)(v1.value1);
                              if (v3 instanceof Data_Ordering.EQ) {
                                  __tco_done = true;
                                  return fromZipper(dictOrd)(ctx)(new Three(v1.value0, k, v, v1.value3, v1.value4, v1.value5, v1.value6));
                              };
                              var v4 = comp(k)(v1.value4);
                              if (v4 instanceof Data_Ordering.EQ) {
                                  __tco_done = true;
                                  return fromZipper(dictOrd)(ctx)(new Three(v1.value0, v1.value1, v1.value2, v1.value3, k, v, v1.value6));
                              };
                              if (v3 instanceof Data_Ordering.LT) {
                                  __tco_ctx = new Data_List_Types.Cons(new ThreeLeft(v1.value1, v1.value2, v1.value3, v1.value4, v1.value5, v1.value6), ctx);
                                  __copy_v1 = v1.value0;
                                  return;
                              };
                              if (v3 instanceof Data_Ordering.GT && v4 instanceof Data_Ordering.LT) {
                                  __tco_ctx = new Data_List_Types.Cons(new ThreeMiddle(v1.value0, v1.value1, v1.value2, v1.value4, v1.value5, v1.value6), ctx);
                                  __copy_v1 = v1.value3;
                                  return;
                              };
                              __tco_ctx = new Data_List_Types.Cons(new ThreeRight(v1.value0, v1.value1, v1.value2, v1.value3, v1.value4, v1.value5), ctx);
                              __copy_v1 = v1.value6;
                              return;
                          };
                          throw new Error("Failed pattern match at Data.Map line 397, column 3 - line 397, column 48: " + [ ctx.constructor.name, v1.constructor.name ]);
                      };
                      while (!__tco_done) {
                          __tco_result = __tco_loop(__tco_ctx, __copy_v1);
                      };
                      return __tco_result;
                  };
              };
              return down(Data_List_Types.Nil.value);
          };
      };
  };
  var pop = function (dictOrd) {
      return function (k) {
          var up = function (ctxs) {
              return function (tree) {
                  if (ctxs instanceof Data_List_Types.Nil) {
                      return tree;
                  };
                  if (ctxs instanceof Data_List_Types.Cons) {
                      var __unused = function (dictPartial1) {
                          return function ($dollar53) {
                              return $dollar53;
                          };
                      };
                      return __unused()((function () {
                          if (ctxs.value0 instanceof TwoLeft && (ctxs.value0.value2 instanceof Leaf && tree instanceof Leaf)) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(Leaf.value, ctxs.value0.value0, ctxs.value0.value1, Leaf.value));
                          };
                          if (ctxs.value0 instanceof TwoRight && (ctxs.value0.value0 instanceof Leaf && tree instanceof Leaf)) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value));
                          };
                          if (ctxs.value0 instanceof TwoLeft && ctxs.value0.value2 instanceof Two) {
                              return up(ctxs.value1)(new Three(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0, ctxs.value0.value2.value1, ctxs.value0.value2.value2, ctxs.value0.value2.value3));
                          };
                          if (ctxs.value0 instanceof TwoRight && ctxs.value0.value0 instanceof Two) {
                              return up(ctxs.value1)(new Three(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3, ctxs.value0.value1, ctxs.value0.value2, tree));
                          };
                          if (ctxs.value0 instanceof TwoLeft && ctxs.value0.value2 instanceof Three) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(new Two(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0), ctxs.value0.value2.value1, ctxs.value0.value2.value2, new Two(ctxs.value0.value2.value3, ctxs.value0.value2.value4, ctxs.value0.value2.value5, ctxs.value0.value2.value6)));
                          };
                          if (ctxs.value0 instanceof TwoRight && ctxs.value0.value0 instanceof Three) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(new Two(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3), ctxs.value0.value0.value4, ctxs.value0.value0.value5, new Two(ctxs.value0.value0.value6, ctxs.value0.value1, ctxs.value0.value2, tree)));
                          };
                          if (ctxs.value0 instanceof ThreeLeft && (ctxs.value0.value2 instanceof Leaf && (ctxs.value0.value5 instanceof Leaf && tree instanceof Leaf))) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value0, ctxs.value0.value1, Leaf.value, ctxs.value0.value3, ctxs.value0.value4, Leaf.value));
                          };
                          if (ctxs.value0 instanceof ThreeMiddle && (ctxs.value0.value0 instanceof Leaf && (ctxs.value0.value5 instanceof Leaf && tree instanceof Leaf))) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value, ctxs.value0.value3, ctxs.value0.value4, Leaf.value));
                          };
                          if (ctxs.value0 instanceof ThreeRight && (ctxs.value0.value0 instanceof Leaf && (ctxs.value0.value3 instanceof Leaf && tree instanceof Leaf))) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value, ctxs.value0.value4, ctxs.value0.value5, Leaf.value));
                          };
                          if (ctxs.value0 instanceof ThreeLeft && ctxs.value0.value2 instanceof Two) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(new Three(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0, ctxs.value0.value2.value1, ctxs.value0.value2.value2, ctxs.value0.value2.value3), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
                          };
                          if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value0 instanceof Two) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(new Three(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3, ctxs.value0.value1, ctxs.value0.value2, tree), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
                          };
                          if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value5 instanceof Two) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Three(tree, ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5.value0, ctxs.value0.value5.value1, ctxs.value0.value5.value2, ctxs.value0.value5.value3)));
                          };
                          if (ctxs.value0 instanceof ThreeRight && ctxs.value0.value3 instanceof Two) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Three(ctxs.value0.value3.value0, ctxs.value0.value3.value1, ctxs.value0.value3.value2, ctxs.value0.value3.value3, ctxs.value0.value4, ctxs.value0.value5, tree)));
                          };
                          if (ctxs.value0 instanceof ThreeLeft && ctxs.value0.value2 instanceof Three) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(new Two(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0), ctxs.value0.value2.value1, ctxs.value0.value2.value2, new Two(ctxs.value0.value2.value3, ctxs.value0.value2.value4, ctxs.value0.value2.value5, ctxs.value0.value2.value6), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
                          };
                          if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value0 instanceof Three) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(new Two(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3), ctxs.value0.value0.value4, ctxs.value0.value0.value5, new Two(ctxs.value0.value0.value6, ctxs.value0.value1, ctxs.value0.value2, tree), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
                          };
                          if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value5 instanceof Three) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Two(tree, ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5.value0), ctxs.value0.value5.value1, ctxs.value0.value5.value2, new Two(ctxs.value0.value5.value3, ctxs.value0.value5.value4, ctxs.value0.value5.value5, ctxs.value0.value5.value6)));
                          };
                          if (ctxs.value0 instanceof ThreeRight && ctxs.value0.value3 instanceof Three) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Two(ctxs.value0.value3.value0, ctxs.value0.value3.value1, ctxs.value0.value3.value2, ctxs.value0.value3.value3), ctxs.value0.value3.value4, ctxs.value0.value3.value5, new Two(ctxs.value0.value3.value6, ctxs.value0.value4, ctxs.value0.value5, tree)));
                          };
                          throw new Error("Failed pattern match at Data.Map line 466, column 9 - line 483, column 136: " + [ ctxs.value0.constructor.name, tree.constructor.name ]);
                      })());
                  };
                  throw new Error("Failed pattern match at Data.Map line 463, column 5 - line 483, column 136: " + [ ctxs.constructor.name ]);
              };
          };
          var removeMaxNode = function (ctx) {
              return function (m) {
                  var __unused = function (dictPartial1) {
                      return function ($dollar55) {
                          return $dollar55;
                      };
                  };
                  return __unused()((function () {
                      if (m instanceof Two && (m.value0 instanceof Leaf && m.value3 instanceof Leaf)) {
                          return up(ctx)(Leaf.value);
                      };
                      if (m instanceof Two) {
                          return removeMaxNode(new Data_List_Types.Cons(new TwoRight(m.value0, m.value1, m.value2), ctx))(m.value3);
                      };
                      if (m instanceof Three && (m.value0 instanceof Leaf && (m.value3 instanceof Leaf && m.value6 instanceof Leaf))) {
                          return up(new Data_List_Types.Cons(new TwoRight(Leaf.value, m.value1, m.value2), ctx))(Leaf.value);
                      };
                      if (m instanceof Three) {
                          return removeMaxNode(new Data_List_Types.Cons(new ThreeRight(m.value0, m.value1, m.value2, m.value3, m.value4, m.value5), ctx))(m.value6);
                      };
                      throw new Error("Failed pattern match at Data.Map line 495, column 5 - line 499, column 107: " + [ m.constructor.name ]);
                  })());
              };
          };
          var maxNode = function (m) {
              var __unused = function (dictPartial1) {
                  return function ($dollar57) {
                      return $dollar57;
                  };
              };
              return __unused()((function () {
                  if (m instanceof Two && m.value3 instanceof Leaf) {
                      return {
                          key: m.value1, 
                          value: m.value2
                      };
                  };
                  if (m instanceof Two) {
                      return maxNode(m.value3);
                  };
                  if (m instanceof Three && m.value6 instanceof Leaf) {
                      return {
                          key: m.value4, 
                          value: m.value5
                      };
                  };
                  if (m instanceof Three) {
                      return maxNode(m.value6);
                  };
                  throw new Error("Failed pattern match at Data.Map line 486, column 33 - line 490, column 45: " + [ m.constructor.name ]);
              })());
          };
          var comp = Data_Ord.compare(dictOrd);
          var down = function (__copy_ctx) {
              return function (__copy_m) {
                  var __tco_ctx = __copy_ctx;
                  var __tco_done = false;
                  var __tco_result;
                  function __tco_loop(ctx, m) {
                      if (m instanceof Leaf) {
                          __tco_done = true;
                          return Data_Maybe.Nothing.value;
                      };
                      if (m instanceof Two) {
                          var v = comp(k)(m.value1);
                          if (m.value3 instanceof Leaf && v instanceof Data_Ordering.EQ) {
                              __tco_done = true;
                              return new Data_Maybe.Just(new Data_Tuple.Tuple(m.value2, up(ctx)(Leaf.value)));
                          };
                          if (v instanceof Data_Ordering.EQ) {
                              var max = maxNode(m.value0);
                              __tco_done = true;
                              return new Data_Maybe.Just(new Data_Tuple.Tuple(m.value2, removeMaxNode(new Data_List_Types.Cons(new TwoLeft(max.key, max.value, m.value3), ctx))(m.value0)));
                          };
                          if (v instanceof Data_Ordering.LT) {
                              __tco_ctx = new Data_List_Types.Cons(new TwoLeft(m.value1, m.value2, m.value3), ctx);
                              __copy_m = m.value0;
                              return;
                          };
                          __tco_ctx = new Data_List_Types.Cons(new TwoRight(m.value0, m.value1, m.value2), ctx);
                          __copy_m = m.value3;
                          return;
                      };
                      if (m instanceof Three) {
                          var leaves = (function () {
                              if (m.value0 instanceof Leaf && (m.value3 instanceof Leaf && m.value6 instanceof Leaf)) {
                                  return true;
                              };
                              return false;
                          })();
                          var v = comp(k)(m.value4);
                          var v3 = comp(k)(m.value1);
                          if (leaves && v3 instanceof Data_Ordering.EQ) {
                              __tco_done = true;
                              return new Data_Maybe.Just(new Data_Tuple.Tuple(m.value2, fromZipper(dictOrd)(ctx)(new Two(Leaf.value, m.value4, m.value5, Leaf.value))));
                          };
                          if (leaves && v instanceof Data_Ordering.EQ) {
                              __tco_done = true;
                              return new Data_Maybe.Just(new Data_Tuple.Tuple(m.value5, fromZipper(dictOrd)(ctx)(new Two(Leaf.value, m.value1, m.value2, Leaf.value))));
                          };
                          if (v3 instanceof Data_Ordering.EQ) {
                              var max = maxNode(m.value0);
                              __tco_done = true;
                              return new Data_Maybe.Just(new Data_Tuple.Tuple(m.value2, removeMaxNode(new Data_List_Types.Cons(new ThreeLeft(max.key, max.value, m.value3, m.value4, m.value5, m.value6), ctx))(m.value0)));
                          };
                          if (v instanceof Data_Ordering.EQ) {
                              var max = maxNode(m.value3);
                              __tco_done = true;
                              return new Data_Maybe.Just(new Data_Tuple.Tuple(m.value5, removeMaxNode(new Data_List_Types.Cons(new ThreeMiddle(m.value0, m.value1, m.value2, max.key, max.value, m.value6), ctx))(m.value3)));
                          };
                          if (v3 instanceof Data_Ordering.LT) {
                              __tco_ctx = new Data_List_Types.Cons(new ThreeLeft(m.value1, m.value2, m.value3, m.value4, m.value5, m.value6), ctx);
                              __copy_m = m.value0;
                              return;
                          };
                          if (v3 instanceof Data_Ordering.GT && v instanceof Data_Ordering.LT) {
                              __tco_ctx = new Data_List_Types.Cons(new ThreeMiddle(m.value0, m.value1, m.value2, m.value4, m.value5, m.value6), ctx);
                              __copy_m = m.value3;
                              return;
                          };
                          __tco_ctx = new Data_List_Types.Cons(new ThreeRight(m.value0, m.value1, m.value2, m.value3, m.value4, m.value5), ctx);
                          __copy_m = m.value6;
                          return;
                      };
                      throw new Error("Failed pattern match at Data.Map line 436, column 34 - line 459, column 80: " + [ m.constructor.name ]);
                  };
                  while (!__tco_done) {
                      __tco_result = __tco_loop(__tco_ctx, __copy_m);
                  };
                  return __tco_result;
              };
          };
          return down(Data_List_Types.Nil.value);
      };
  };
  var foldableMap = new Data_Foldable.Foldable(function (dictMonoid) {
      return function (f) {
          return function (m) {
              return Data_Foldable.foldMap(Data_List_Types.foldableList)(dictMonoid)(f)(values(m));
          };
      };
  }, function (f) {
      return function (z) {
          return function (m) {
              return Data_Foldable.foldl(Data_List_Types.foldableList)(f)(z)(values(m));
          };
      };
  }, function (f) {
      return function (z) {
          return function (m) {
              return Data_Foldable.foldr(Data_List_Types.foldableList)(f)(z)(values(m));
          };
      };
  });
  var empty = Leaf.value;
  var $$delete = function (dictOrd) {
      return function (k) {
          return function (m) {
              return Data_Maybe.maybe(m)(Data_Tuple.snd)(pop(dictOrd)(k)(m));
          };
      };
  };
  exports["delete"] = $$delete;
  exports["empty"] = empty;
  exports["insert"] = insert;
  exports["keys"] = keys;
  exports["lookup"] = lookup;
  exports["member"] = member;
  exports["pop"] = pop;
  exports["values"] = values;
  exports["functorMap"] = functorMap;
  exports["foldableMap"] = foldableMap;
})(PS["Data.Map"] = PS["Data.Map"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Generic = PS["Data.Generic"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var MediaType = function (x) {
      return x;
  }; 
  var newtypeMediaType = new Data_Newtype.Newtype(function (n) {
      return n;
  }, MediaType);
  exports["MediaType"] = MediaType;
  exports["newtypeMediaType"] = newtypeMediaType;
})(PS["Data.MediaType"] = PS["Data.MediaType"] || {});
(function(exports) {
    "use strict";

  exports._copyEff = function (m) {
    return function () {
      var r = {};
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r[k] = m[k];
        }
      }
      return r;
    };
  };

  exports.empty = {};

  exports.runST = function (f) {
    return f;
  };

  exports._foldM = function (bind) {
    return function (f) {
      return function (mz) {
        return function (m) {
          var acc = mz;
          function g(k) {
            return function (z) {
              return f(z)(k)(m[k]);
            };
          }
          for (var k in m) {
            if (hasOwnProperty.call(m, k)) {
              acc = bind(acc)(g(k));
            }
          }
          return acc;
        };
      };
    };
  };

  exports._lookup = function (no, yes, k, m) {
    return k in m ? yes(m[k]) : no;
  };

  function toArrayWithKey(f) {
    return function (m) {
      var r = [];
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r.push(f(k)(m[k]));
        }
      }
      return r;
    };
  }

  exports.toArrayWithKey = toArrayWithKey;
})(PS["Data.StrMap"] = PS["Data.StrMap"] || {});
(function(exports) {
    "use strict";

  exports["new"] = function () {
    return {};
  };

  exports.poke = function (m) {
    return function (k) {
      return function (v) {
        return function () {
          m[k] = v;
          return m;
        };
      };
    };
  };

  exports["delete"] = function (m) {
    return function (k) {
      return function () {
        delete m[k];
        return m;
      };
    };
  };
})(PS["Data.StrMap.ST"] = PS["Data.StrMap.ST"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.StrMap.ST"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Data_Maybe = PS["Data.Maybe"];
  exports["delete"] = $foreign["delete"];
  exports["new"] = $foreign["new"];
  exports["poke"] = $foreign.poke;
})(PS["Data.StrMap.ST"] = PS["Data.StrMap.ST"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Data.StrMap"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Array = PS["Data.Array"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_FoldableWithIndex = PS["Data.FoldableWithIndex"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Functor = PS["Data.Functor"];
  var Data_FunctorWithIndex = PS["Data.FunctorWithIndex"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_StrMap_ST = PS["Data.StrMap.ST"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_TraversableWithIndex = PS["Data.TraversableWithIndex"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Prelude = PS["Prelude"];        
  var values = $foreign.toArrayWithKey(function (v) {
      return function (v1) {
          return v1;
      };
  });                                                            
  var thawST = $foreign._copyEff;
  var pureST = function (f) {
      return Control_Monad_Eff.runPure($foreign.runST(f));
  };
  var singleton = function (k) {
      return function (v) {
          return pureST(function __do() {
              var v1 = Data_StrMap_ST["new"]();
              return Data_StrMap_ST.poke(v1)(k)(v)();
          });
      };
  };
  var mutate = function (f) {
      return function (m) {
          return pureST(function __do() {
              var v = thawST(m)();
              var v1 = f(v)();
              return v;
          });
      };
  };
  var lookup = Data_Function_Uncurried.runFn4($foreign._lookup)(Data_Maybe.Nothing.value)(Data_Maybe.Just.create);
  var insert = function (k) {
      return function (v) {
          return mutate(function (s) {
              return Data_Functor["void"](Control_Monad_Eff.functorEff)(Data_StrMap_ST.poke(s)(k)(v));
          });
      };
  };
  var fromFoldable = function (dictFoldable) {
      return function (l) {
          return pureST(function __do() {
              var v = Data_StrMap_ST["new"]();
              Control_Monad_Eff.foreachE(Data_Array.fromFoldable(dictFoldable)(l))(function (v1) {
                  return Data_Functor["void"](Control_Monad_Eff.functorEff)(Data_StrMap_ST.poke(v)(v1.value0)(v1.value1));
              })();
              return v;
          });
      };
  };
  var foldM = function (dictMonad) {
      return function (f) {
          return function (z) {
              return $foreign._foldM(Control_Bind.bind(dictMonad.Bind1()))(f)(Control_Applicative.pure(dictMonad.Applicative0())(z));
          };
      };
  };
  var union = function (m) {
      return mutate(function (s) {
          return Data_Functor["void"](Control_Monad_Eff.functorEff)(foldM(Control_Monad_Eff.monadEff)(Data_StrMap_ST.poke)(s)(m));
      });
  };
  var unions = function (dictFoldable) {
      return Data_Foldable.foldl(dictFoldable)(union)($foreign.empty);
  }; 
  var $$delete = function (k) {
      return mutate(function (s) {
          return Data_Functor["void"](Control_Monad_Eff.functorEff)(Data_StrMap_ST["delete"](s)(k));
      });
  };
  var alter = function (f) {
      return function (k) {
          return function (m) {
              var v = f(lookup(k)(m));
              if (v instanceof Data_Maybe.Nothing) {
                  return $$delete(k)(m);
              };
              if (v instanceof Data_Maybe.Just) {
                  return insert(k)(v.value0)(m);
              };
              throw new Error("Failed pattern match at Data.StrMap line 213, column 15 - line 215, column 25: " + [ v.constructor.name ]);
          };
      };
  };
  exports["alter"] = alter;
  exports["foldM"] = foldM;
  exports["fromFoldable"] = fromFoldable;
  exports["insert"] = insert;
  exports["lookup"] = lookup;
  exports["pureST"] = pureST;
  exports["singleton"] = singleton;
  exports["thawST"] = thawST;
  exports["union"] = union;
  exports["unions"] = unions;
  exports["values"] = values;
  exports["empty"] = $foreign.empty;
})(PS["Data.StrMap"] = PS["Data.StrMap"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Prelude = PS["Prelude"];        
  var OrdBox = (function () {
      function OrdBox(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      OrdBox.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new OrdBox(value0, value1, value2);
              };
          };
      };
      return OrdBox;
  })();
  var unOrdBox = function (v) {
      return v.value2;
  };
  var mkOrdBox = function (dictOrd) {
      return OrdBox.create(Data_Eq.eq(dictOrd.Eq0()))(Data_Ord.compare(dictOrd));
  };
  var eqOrdBox = new Data_Eq.Eq(function (v) {
      return function (v1) {
          return v.value0(v.value2)(v1.value2);
      };
  });
  var ordOrdBox = new Data_Ord.Ord(function () {
      return eqOrdBox;
  }, function (v) {
      return function (v1) {
          return v.value1(v.value2)(v1.value2);
      };
  });
  exports["mkOrdBox"] = mkOrdBox;
  exports["unOrdBox"] = unOrdBox;
  exports["eqOrdBox"] = eqOrdBox;
  exports["ordOrdBox"] = ordOrdBox;
})(PS["Halogen.Data.OrdBox"] = PS["Halogen.Data.OrdBox"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Prelude = PS["Prelude"];
  var RefUpdate = (function () {
      function RefUpdate(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      RefUpdate.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new RefUpdate(value0, value1, value2);
              };
          };
      };
      return RefUpdate;
  })();
  var Query = (function () {
      function Query(value0) {
          this.value0 = value0;
      };
      Query.create = function (value0) {
          return new Query(value0);
      };
      return Query;
  })();                             
  var bifunctorInputF = new Data_Bifunctor.Bifunctor(function (f) {
      return function (g) {
          return function (v) {
              if (v instanceof RefUpdate) {
                  return new RefUpdate(v.value0, v.value1, f(v.value2));
              };
              if (v instanceof Query) {
                  return new Query(g(v.value0));
              };
              throw new Error("Failed pattern match at Halogen.Query.InputF line 21, column 15 - line 23, column 27: " + [ v.constructor.name ]);
          };
      };
  });
  var functorInputF = new Data_Functor.Functor(Data_Bifunctor.rmap(bifunctorInputF));
  exports["RefUpdate"] = RefUpdate;
  exports["Query"] = Query;
  exports["bifunctorInputF"] = bifunctorInputF;
  exports["functorInputF"] = functorInputF;
})(PS["Halogen.Query.InputF"] = PS["Halogen.Query.InputF"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];
  var Prelude = PS["Prelude"];        
  var Step = (function () {
      function Step(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      Step.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new Step(value0, value1, value2);
              };
          };
      };
      return Step;
  })();
  var step = function (v) {
      return v.value1;
  };
  var halt = function (v) {
      return v.value2;
  };
  var extract = function (v) {
      return v.value0;
  };
  exports["Step"] = Step;
  exports["extract"] = extract;
  exports["halt"] = halt;
  exports["step"] = step;
})(PS["Halogen.VDom.Machine"] = PS["Halogen.VDom.Machine"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Generic = PS["Data.Generic"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var ElemSpec = (function () {
      function ElemSpec(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      ElemSpec.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new ElemSpec(value0, value1, value2);
              };
          };
      };
      return ElemSpec;
  })();
  var Text = (function () {
      function Text(value0) {
          this.value0 = value0;
      };
      Text.create = function (value0) {
          return new Text(value0);
      };
      return Text;
  })();
  var Elem = (function () {
      function Elem(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Elem.create = function (value0) {
          return function (value1) {
              return new Elem(value0, value1);
          };
      };
      return Elem;
  })();
  var Keyed = (function () {
      function Keyed(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Keyed.create = function (value0) {
          return function (value1) {
              return new Keyed(value0, value1);
          };
      };
      return Keyed;
  })();
  var Widget = (function () {
      function Widget(value0) {
          this.value0 = value0;
      };
      Widget.create = function (value0) {
          return new Widget(value0);
      };
      return Widget;
  })();
  var Grafted = (function () {
      function Grafted(value0) {
          this.value0 = value0;
      };
      Grafted.create = function (value0) {
          return new Grafted(value0);
      };
      return Grafted;
  })();
  var Graft = (function () {
      function Graft(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      Graft.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new Graft(value0, value1, value2);
              };
          };
      };
      return Graft;
  })();
  var unGraft = function (f) {
      return function ($124) {
          return f(Unsafe_Coerce.unsafeCoerce($124));
      };
  };           
  var graft = Unsafe_Coerce.unsafeCoerce;
  var functorElemSpec = new Data_Functor.Functor(function (f) {
      return function (v) {
          return new ElemSpec(v.value0, v.value1, f(v.value2));
      };
  });                                
  var eqElemName = Data_Eq.eqString;
  var bifunctorGraft = new Data_Bifunctor.Bifunctor(function (f) {
      return function (g) {
          return unGraft(function (v) {
              return graft(new Graft(function ($126) {
                  return f(v.value0($126));
              }, function ($127) {
                  return g(v.value1($127));
              }, v.value2));
          });
      };
  });
  var bifunctorVDom = new Data_Bifunctor.Bifunctor(function (f) {
      return function (g) {
          return function (v) {
              if (v instanceof Text) {
                  return new Text(v.value0);
              };
              if (v instanceof Grafted) {
                  return new Grafted(Data_Bifunctor.bimap(bifunctorGraft)(f)(g)(v.value0));
              };
              return new Grafted(graft(new Graft(f, g, v)));
          };
      };
  });
  var runGraft = unGraft(function (v) {
      var go = function (v2) {
          if (v2 instanceof Text) {
              return new Text(v2.value0);
          };
          if (v2 instanceof Elem) {
              return new Elem(Data_Functor.map(functorElemSpec)(v.value0)(v2.value0), Data_Functor.map(Data_Functor.functorArray)(go)(v2.value1));
          };
          if (v2 instanceof Keyed) {
              return new Keyed(Data_Functor.map(functorElemSpec)(v.value0)(v2.value0), Data_Functor.map(Data_Functor.functorArray)(Data_Functor.map(Data_Tuple.functorTuple)(go))(v2.value1));
          };
          if (v2 instanceof Widget) {
              return new Widget(v.value1(v2.value0));
          };
          if (v2 instanceof Grafted) {
              return new Grafted(Data_Bifunctor.bimap(bifunctorGraft)(v.value0)(v.value1)(v2.value0));
          };
          throw new Error("Failed pattern match at Halogen.VDom.Types line 74, column 5 - line 81, column 11: " + [ v2.constructor.name ]);
      };
      return go(v.value2);
  });
  exports["ElemSpec"] = ElemSpec;
  exports["Graft"] = Graft;
  exports["Text"] = Text;
  exports["Elem"] = Elem;
  exports["Keyed"] = Keyed;
  exports["Widget"] = Widget;
  exports["Grafted"] = Grafted;
  exports["graft"] = graft;
  exports["runGraft"] = runGraft;
  exports["unGraft"] = unGraft;
  exports["bifunctorVDom"] = bifunctorVDom;
  exports["bifunctorGraft"] = bifunctorGraft;
  exports["functorElemSpec"] = functorElemSpec;
  exports["eqElemName"] = eqElemName;
})(PS["Halogen.VDom.Types"] = PS["Halogen.VDom.Types"] || {});
(function(exports) {
    "use strict";

  exports.unsafeGetAny = function (key, obj) {
    return obj[key];
  };

  exports.unsafeHasAny = function (key, obj) {
    return obj.hasOwnProperty(key);
  };

  exports.unsafeSetAny = function (key, val, obj) {
    return function () {
      obj[key] = val;
    };
  };

  exports.forE = function (a, f) {
    return function () {
      var b = [];
      for (var i = 0; i < a.length; i++) {
        b.push(f(i, a[i])());
      }
      return b;
    };
  };

  exports.forInE = function (o, f) {
    return function () {
      var ks = Object.keys(o);
      for (var i = 0; i < ks.length; i++) {
        var k = ks[i];
        f(k, o[k])();
      }
    };
  };

  exports.diffWithIxE = function (a1, a2, f1, f2, f3) {
    return function () {
      var a3 = [];
      var l1 = a1.length;
      var l2 = a2.length;
      var i  = 0;
      while (1) {
        if (i < l1) {
          if (i < l2) {
            a3.push(f1(i, a1[i], a2[i])());
          } else {
            f2(i, a1[i])();
          }
        } else if (i < l2) {
          a3.push(f3(i, a2[i])());
        } else {
          break;
        }
        i++;
      }
      return a3;
    };
  };

  exports.strMapWithIxE = function (as, fk, f) {
    return function () {
      var o = {};
      for (var i = 0; i < as.length; i++) {
        var a = as[i];
        var k = fk(a);
        o[k] = f(k, i, a)();
      }
      return o;
    };
  };

  exports.diffWithKeyAndIxE = function (o1, as, fk, f1, f2, f3) {
    return function () {
      var o2 = {};
      for (var i = 0; i < as.length; i++) {
        var a = as[i];
        var k = fk(a);
        if (o1.hasOwnProperty(k)) {
          o2[k] = f1(k, i, o1[k], a)();
        } else {
          o2[k] = f3(k, i, a)();
        }
      }
      for (var k in o1) {
        if (k in o2) {
          continue;
        }
        f2(k, o1[k])();
      }
      return o2;
    };
  };

  exports.refEq = function (a, b) {
    return a === b;
  };

  exports.createTextNode = function (s, doc) {
    return function () {
      return doc.createTextNode(s);
    };
  };

  exports.setTextContent = function (s, n) {
    return function () {
      n.textContent = s;
    };
  };

  exports.createElement = function (ns, name, doc) {
    return function () {
      if (ns != null) {
        return doc.createElementNS(ns, name);
      } else {
        return doc.createElement(name)
      }
    };
  };

  exports.insertChildIx = function (i, a, b) {
    return function () {
      var n = b.childNodes.item(i) || null;
      if (n !== a) {
        b.insertBefore(a, n);
      }
    };
  };

  exports.removeChild = function (a, b) {
    return function () {
      if (b && a.parentNode === b) {
        b.removeChild(a);
      }
    };
  };

  exports.unsafeParent = function (a) {
    return a.parentNode;
  };

  exports.setAttribute = function (ns, attr, val, el) {
    return function () {
      if (ns != null) {
        el.setAttributeNS(ns, attr, val);
      } else {
        el.setAttribute(attr, val);
      }
    };
  };

  exports.removeAttribute = function (ns, attr, el) {
    return function () {
      if (ns != null) {
        el.removeAttributeNS(ns, attr);
      } else {
        el.removeAttribute(attr);
      }
    };
  };

  exports.addEventListener = function (ev, listener, el) {
    return function () {
      el.addEventListener(ev, listener, false);
    };
  };

  exports.removeEventListener = function (ev, listener, el) {
    return function () {
      el.removeEventListener(ev, listener, false);
    };
  };

  exports.jsUndefined = void 0;
})(PS["Halogen.VDom.Util"] = PS["Halogen.VDom.Util"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Halogen.VDom.Util"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Ref = PS["Control.Monad.Eff.Ref"];
  var DOM = PS["DOM"];
  var DOM_Event_EventTarget = PS["DOM.Event.EventTarget"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Nullable = PS["Data.Nullable"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_StrMap_ST = PS["Data.StrMap.ST"];
  var Data_Unit = PS["Data.Unit"];
  var Halogen_VDom_Types = PS["Halogen.VDom.Types"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var unsafeLookup = $foreign.unsafeGetAny;
  var unsafeFreeze = Unsafe_Coerce.unsafeCoerce;
  var pokeMutMap = $foreign.unsafeSetAny;
  var newMutMap = Unsafe_Coerce.unsafeCoerce(Data_StrMap_ST["new"]);
  var effUnit = Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
  var effPure = Control_Applicative.pure(Control_Monad_Eff.applicativeEff);
  exports["effPure"] = effPure;
  exports["effUnit"] = effUnit;
  exports["newMutMap"] = newMutMap;
  exports["pokeMutMap"] = pokeMutMap;
  exports["unsafeFreeze"] = unsafeFreeze;
  exports["unsafeLookup"] = unsafeLookup;
  exports["addEventListener"] = $foreign.addEventListener;
  exports["createElement"] = $foreign.createElement;
  exports["createTextNode"] = $foreign.createTextNode;
  exports["diffWithIxE"] = $foreign.diffWithIxE;
  exports["diffWithKeyAndIxE"] = $foreign.diffWithKeyAndIxE;
  exports["forE"] = $foreign.forE;
  exports["forInE"] = $foreign.forInE;
  exports["insertChildIx"] = $foreign.insertChildIx;
  exports["jsUndefined"] = $foreign.jsUndefined;
  exports["refEq"] = $foreign.refEq;
  exports["removeAttribute"] = $foreign.removeAttribute;
  exports["removeChild"] = $foreign.removeChild;
  exports["removeEventListener"] = $foreign.removeEventListener;
  exports["setAttribute"] = $foreign.setAttribute;
  exports["setTextContent"] = $foreign.setTextContent;
  exports["strMapWithIxE"] = $foreign.strMapWithIxE;
  exports["unsafeGetAny"] = $foreign.unsafeGetAny;
  exports["unsafeHasAny"] = $foreign.unsafeHasAny;
  exports["unsafeParent"] = $foreign.unsafeParent;
  exports["unsafeSetAny"] = $foreign.unsafeSetAny;
})(PS["Halogen.VDom.Util"] = PS["Halogen.VDom.Util"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Ref = PS["Control.Monad.Eff.Ref"];
  var DOM = PS["DOM"];
  var DOM_Event_EventTarget = PS["DOM.Event.EventTarget"];
  var DOM_Event_Types = PS["DOM.Event.Types"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Nullable = PS["Data.Nullable"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Halogen_VDom = PS["Halogen.VDom"];
  var Halogen_VDom_Machine = PS["Halogen.VDom.Machine"];
  var Halogen_VDom_Types = PS["Halogen.VDom.Types"];
  var Halogen_VDom_Util = PS["Halogen.VDom.Util"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var Created = (function () {
      function Created(value0) {
          this.value0 = value0;
      };
      Created.create = function (value0) {
          return new Created(value0);
      };
      return Created;
  })();
  var Removed = (function () {
      function Removed(value0) {
          this.value0 = value0;
      };
      Removed.create = function (value0) {
          return new Removed(value0);
      };
      return Removed;
  })();
  var Attribute = (function () {
      function Attribute(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      Attribute.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new Attribute(value0, value1, value2);
              };
          };
      };
      return Attribute;
  })();
  var Property = (function () {
      function Property(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Property.create = function (value0) {
          return function (value1) {
              return new Property(value0, value1);
          };
      };
      return Property;
  })();
  var Handler = (function () {
      function Handler(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Handler.create = function (value0) {
          return function (value1) {
              return new Handler(value0, value1);
          };
      };
      return Handler;
  })();
  var Ref = (function () {
      function Ref(value0) {
          this.value0 = value0;
      };
      Ref.create = function (value0) {
          return new Ref(value0);
      };
      return Ref;
  })();
  var unsafeGetProperty = Halogen_VDom_Util.unsafeGetAny;
  var setProperty = Halogen_VDom_Util.unsafeSetAny;
  var removeProperty = function (key, el) {
      var v = Data_Foreign.typeOf(Halogen_VDom_Util.unsafeGetAny(key, el));
      if (v === "string") {
          return Halogen_VDom_Util.unsafeSetAny(key, "", el);
      };
      return Halogen_VDom_Util.unsafeSetAny(key, Halogen_VDom_Util.jsUndefined, el);
  };
  var propToStrKey = function (v) {
      if (v instanceof Attribute && v.value0 instanceof Data_Maybe.Just) {
          return "attr/" + (v.value0.value0 + (":" + v.value1));
      };
      if (v instanceof Attribute) {
          return "attr/:" + v.value1;
      };
      if (v instanceof Property) {
          return "prop/" + v.value0;
      };
      if (v instanceof Handler) {
          return "handler/" + v.value0;
      };
      if (v instanceof Ref) {
          return "ref";
      };
      throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop line 179, column 16 - line 186, column 1: " + [ v.constructor.name ]);
  };                                               
  var functorProp = new Data_Functor.Functor(function (f) {
      return function (v) {
          if (v instanceof Handler) {
              return new Handler(v.value0, Data_Functor.map(Data_Functor.functorFn)(Data_Functor.map(Data_Maybe.functorMaybe)(f))(v.value1));
          };
          if (v instanceof Ref) {
              return new Ref(Data_Functor.map(Data_Functor.functorFn)(Data_Functor.map(Data_Maybe.functorMaybe)(f))(v.value0));
          };
          return Unsafe_Coerce.unsafeCoerce(v);
      };
  });
  var buildProp = function (emit) {
      return function (el) {
          var removeProp = function (prevEvents) {
              return function (v, v1) {
                  if (v1 instanceof Attribute) {
                      return Halogen_VDom_Util.removeAttribute(Data_Nullable.toNullable(v1.value0), v1.value1, el);
                  };
                  if (v1 instanceof Property) {
                      return removeProperty(v1.value0, el);
                  };
                  if (v1 instanceof Handler) {
                      var handler = Halogen_VDom_Util.unsafeLookup(v1.value0, prevEvents);
                      return Halogen_VDom_Util.removeEventListener(v1.value0, Data_Tuple.fst(handler), el);
                  };
                  if (v1 instanceof Ref) {
                      return Halogen_VDom_Util.effUnit;
                  };
                  throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop line 166, column 5 - line 176, column 21: " + [ v1.constructor.name ]);
              };
          };
          var mbEmit = Data_Maybe.maybe(Halogen_VDom_Util.effUnit)(emit);
          var done = function (ps) {
              var v = Data_StrMap.lookup("ref")(ps);
              if (v instanceof Data_Maybe.Just && v.value0 instanceof Ref) {
                  return mbEmit(v.value0.value0(new Removed(el)));
              };
              return Halogen_VDom_Util.effUnit;
          };
          var diffProp = function (prevEvents, events) {
              return function (v, v1, v11, v2) {
                  if (v11 instanceof Attribute && v2 instanceof Attribute) {
                      var v3 = v11.value2 !== v2.value2;
                      if (v3) {
                          return function __do() {
                              Halogen_VDom_Util.setAttribute(Data_Nullable.toNullable(v2.value0), v2.value1, v2.value2, el)();
                              return v2;
                          };
                      };
                      return Halogen_VDom_Util.effPure(v2);
                  };
                  if (v11 instanceof Property && v2 instanceof Property) {
                      var v4 = Halogen_VDom_Util.refEq(v11.value1, v2.value1);
                      if (v4) {
                          return Halogen_VDom_Util.effPure(v2);
                      };
                      if (v2.value0 === "value") {
                          var elVal = unsafeGetProperty("value", el);
                          var v5 = !Halogen_VDom_Util.refEq(elVal, v2.value1);
                          if (v5) {
                              return function __do() {
                                  setProperty(v2.value0, v2.value1, el)();
                                  return v2;
                              };
                          };
                          return Halogen_VDom_Util.effPure(v2);
                      };
                      return function __do() {
                          setProperty(v2.value0, v2.value1, el)();
                          return v2;
                      };
                  };
                  if (v11 instanceof Handler && v2 instanceof Handler) {
                      var handler = Halogen_VDom_Util.unsafeLookup(v2.value0, prevEvents);
                      return function __do() {
                          Control_Monad_Eff_Ref.writeRef(Data_Tuple.snd(handler))(v2.value1)();
                          Halogen_VDom_Util.pokeMutMap(v2.value0, handler, events)();
                          return v2;
                      };
                  };
                  return Halogen_VDom_Util.effPure(v2);
              };
          };
          var applyProp = function (events) {
              return function (v, v1, v2) {
                  if (v2 instanceof Attribute) {
                      return function __do() {
                          Halogen_VDom_Util.setAttribute(Data_Nullable.toNullable(v2.value0), v2.value1, v2.value2, el)();
                          return v2;
                      };
                  };
                  if (v2 instanceof Property) {
                      return function __do() {
                          setProperty(v2.value0, v2.value1, el)();
                          return v2;
                      };
                  };
                  if (v2 instanceof Handler) {
                      var v3 = Halogen_VDom_Util.unsafeGetAny(v2.value0, events);
                      if (Halogen_VDom_Util.unsafeHasAny(v2.value0, events)) {
                          return function __do() {
                              Control_Monad_Eff_Ref.writeRef(Data_Tuple.snd(v3))(v2.value1)();
                              return v2;
                          };
                      };
                      return function __do() {
                          var v4 = Control_Monad_Eff_Ref.newRef(v2.value1)();
                          var listener = DOM_Event_EventTarget.eventListener(function (ev) {
                              return function __do() {
                                  var v5 = Control_Monad_Eff_Ref.readRef(v4)();
                                  return mbEmit(v5(ev))();
                              };
                          });
                          Halogen_VDom_Util.pokeMutMap(v2.value0, new Data_Tuple.Tuple(listener, v4), events)();
                          Halogen_VDom_Util.addEventListener(v2.value0, listener, el)();
                          return v2;
                      };
                  };
                  if (v2 instanceof Ref) {
                      return function __do() {
                          mbEmit(v2.value0(new Created(el)))();
                          return v2;
                      };
                  };
                  throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop line 107, column 5 - line 130, column 15: " + [ v2.constructor.name ]);
              };
          };
          var patch = function (prevEvents, ps1) {
              return function (ps2) {
                  return function __do() {
                      var v = Halogen_VDom_Util.newMutMap();
                      var onThis = removeProp(prevEvents);
                      var onThese = diffProp(prevEvents, v);
                      var onThat = applyProp(v);
                      var v1 = Halogen_VDom_Util.diffWithKeyAndIxE(ps1, ps2, propToStrKey, onThese, onThis, onThat)();
                      return new Halogen_VDom_Machine.Step(Data_Unit.unit, patch(Halogen_VDom_Util.unsafeFreeze(v), v1), done(v1));
                  };
              };
          };
          var render = function (ps1) {
              return function __do() {
                  var v = Halogen_VDom_Util.newMutMap();
                  var v1 = Halogen_VDom_Util.strMapWithIxE(ps1, propToStrKey, applyProp(v))();
                  return new Halogen_VDom_Machine.Step(Data_Unit.unit, patch(Halogen_VDom_Util.unsafeFreeze(v), v1), done(v1));
              };
          };
          return render;
      };
  };
  exports["Created"] = Created;
  exports["Removed"] = Removed;
  exports["Attribute"] = Attribute;
  exports["Property"] = Property;
  exports["Handler"] = Handler;
  exports["Ref"] = Ref;
  exports["buildProp"] = buildProp;
  exports["functorProp"] = functorProp;
})(PS["Halogen.VDom.DOM.Prop"] = PS["Halogen.VDom.DOM.Prop"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM_Event_Types = PS["DOM.Event.Types"];
  var DOM_HTML_Indexed_ButtonType = PS["DOM.HTML.Indexed.ButtonType"];
  var DOM_HTML_Indexed_CrossOriginValue = PS["DOM.HTML.Indexed.CrossOriginValue"];
  var DOM_HTML_Indexed_DirValue = PS["DOM.HTML.Indexed.DirValue"];
  var DOM_HTML_Indexed_FormMethod = PS["DOM.HTML.Indexed.FormMethod"];
  var DOM_HTML_Indexed_InputType = PS["DOM.HTML.Indexed.InputType"];
  var DOM_HTML_Indexed_KindValue = PS["DOM.HTML.Indexed.KindValue"];
  var DOM_HTML_Indexed_MenuType = PS["DOM.HTML.Indexed.MenuType"];
  var DOM_HTML_Indexed_MenuitemType = PS["DOM.HTML.Indexed.MenuitemType"];
  var DOM_HTML_Indexed_OnOff = PS["DOM.HTML.Indexed.OnOff"];
  var DOM_HTML_Indexed_OrderedListType = PS["DOM.HTML.Indexed.OrderedListType"];
  var DOM_HTML_Indexed_PreloadValue = PS["DOM.HTML.Indexed.PreloadValue"];
  var DOM_HTML_Indexed_ScopeValue = PS["DOM.HTML.Indexed.ScopeValue"];
  var DOM_HTML_Indexed_StepValue = PS["DOM.HTML.Indexed.StepValue"];
  var DOM_HTML_Indexed_WrapValue = PS["DOM.HTML.Indexed.WrapValue"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Generic = PS["Data.Generic"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Halogen_Query_InputF = PS["Halogen.Query.InputF"];
  var Halogen_VDom = PS["Halogen.VDom"];
  var Halogen_VDom_DOM_Prop = PS["Halogen.VDom.DOM.Prop"];
  var Halogen_VDom_Types = PS["Halogen.VDom.Types"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var HTML = function (x) {
      return x;
  };
  var text = function ($54) {
      return HTML(Halogen_VDom_Types.Text.create($54));
  }; 
  var slot = function ($56) {
      return HTML(Halogen_VDom_Types.Widget.create($56));
  }; 
  var ref = function (f) {
      return Halogen_VDom_DOM_Prop.Ref.create(function ($58) {
          return f((function (v) {
              if (v instanceof Halogen_VDom_DOM_Prop.Created) {
                  return new Data_Maybe.Just(v.value0);
              };
              if (v instanceof Halogen_VDom_DOM_Prop.Removed) {
                  return Data_Maybe.Nothing.value;
              };
              throw new Error("Failed pattern match at Halogen.HTML.Core line 104, column 21 - line 106, column 23: " + [ v.constructor.name ]);
          })($58));
      });
  }; 
  var handler = Halogen_VDom_DOM_Prop.Handler.create;
  var element = function (ns) {
      return Unsafe_Coerce.unsafeCoerce(function (name) {
          return function (props) {
              return function (children) {
                  return new Halogen_VDom_Types.Elem(new Halogen_VDom_Types.ElemSpec(ns, name, props), children);
              };
          };
      });
  };                                                                    
  var bifunctorHTML = new Data_Bifunctor.Bifunctor(function (f) {
      return function (g) {
          return function (v) {
              return Data_Bifunctor.bimap(Halogen_VDom_Types.bifunctorVDom)(Data_Functor.map(Data_Functor.functorArray)(Data_Functor.map(Halogen_VDom_DOM_Prop.functorProp)(Data_Functor.map(Halogen_Query_InputF.functorInputF)(g))))(f)(v);
          };
      };
  });
  exports["HTML"] = HTML;
  exports["element"] = element;
  exports["handler"] = handler;
  exports["ref"] = ref;
  exports["slot"] = slot;
  exports["text"] = text;
  exports["bifunctorHTML"] = bifunctorHTML;
})(PS["Halogen.HTML.Core"] = PS["Halogen.HTML.Core"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Coroutine = PS["Control.Coroutine"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Aff_AVar = PS["Control.Monad.Aff.AVar"];
  var Control_Monad_Aff_Class = PS["Control.Monad.Aff.Class"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Free_Trans = PS["Control.Monad.Free.Trans"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var Listening = (function () {
      function Listening() {

      };
      Listening.value = new Listening();
      return Listening;
  })();
  var Done = (function () {
      function Done() {

      };
      Done.value = new Done();
      return Done;
  })();
  var unEventSource = function (v) {
      return v;
  };
  var runAff$prime = Control_Monad_Aff.runAff_(Data_Either.either(Data_Function["const"](Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit)))(Control_Applicative.pure(Control_Monad_Eff.applicativeEff)));
  var produceAff = function (dictMonadAff) {
      return function (recv) {
          return Control_Bind.bind(Control_Monad_Free_Trans.bindFreeT(Control_Coroutine.functorEmit)((dictMonadAff.MonadEff0()).Monad0()))(Control_Monad_Trans_Class.lift(Control_Monad_Free_Trans.monadTransFreeT(Control_Coroutine.functorEmit))((dictMonadAff.MonadEff0()).Monad0())(Control_Monad_Aff_Class.liftAff(dictMonadAff)(Control_Monad_Aff_AVar.makeEmptyVar)))(function (v) {
              return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Free_Trans.bindFreeT(Control_Coroutine.functorEmit)((dictMonadAff.MonadEff0()).Monad0()))(Data_Functor["void"](Control_Monad_Free_Trans.functorFreeT(Control_Coroutine.functorEmit)(((((dictMonadAff.MonadEff0()).Monad0()).Bind1()).Apply0()).Functor0()))(Control_Monad_Trans_Class.lift(Control_Monad_Free_Trans.monadTransFreeT(Control_Coroutine.functorEmit))((dictMonadAff.MonadEff0()).Monad0())(Control_Monad_Aff_Class.liftAff(dictMonadAff)(Control_Monad_Aff.forkAff(recv(Data_Function.flip(Control_Monad_Aff_AVar.putVar)(v)))))))(function () {
                  return Control_Coroutine.producer((dictMonadAff.MonadEff0()).Monad0())(Control_Monad_Aff_Class.liftAff(dictMonadAff)(Control_Monad_Aff_AVar.takeVar(v)));
              });
          });
      };
  };
  var produce = function (recv) {
      return produceAff(Control_Monad_Aff_Class.monadAffAff)(function (send) {
          return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(recv(function ($51) {
              return Data_Functor["void"](Control_Monad_Eff.functorEff)(runAff$prime(send($51)));
          }));
      });
  };
  var eventSource_ = function (dictMonadAff) {
      return function (attach) {
          return function (query) {
              var producer = produce(function (emit) {
                  return attach(emit(new Data_Either.Left(query)));
              });
              return Control_Applicative.pure(((dictMonadAff.MonadEff0()).Monad0()).Applicative0())({
                  producer: Control_Monad_Free_Trans.hoistFreeT(Control_Coroutine.functorEmit)(((((dictMonadAff.MonadEff0()).Monad0()).Bind1()).Apply0()).Functor0())(Control_Monad_Aff_Class.liftAff(dictMonadAff))(producer), 
                  done: Control_Applicative.pure(((dictMonadAff.MonadEff0()).Monad0()).Applicative0())(Data_Unit.unit)
              });
          };
      };
  };
  var eqSubscribeStatus = new Data_Eq.Eq(function (x) {
      return function (y) {
          if (x instanceof Listening && y instanceof Listening) {
              return true;
          };
          if (x instanceof Done && y instanceof Done) {
              return true;
          };
          return false;
      };
  });
  exports["Listening"] = Listening;
  exports["Done"] = Done;
  exports["eventSource_"] = eventSource_;
  exports["produce"] = produce;
  exports["produceAff"] = produceAff;
  exports["unEventSource"] = unEventSource;
  exports["eqSubscribeStatus"] = eqSubscribeStatus;
})(PS["Halogen.Query.EventSource"] = PS["Halogen.Query.EventSource"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Category = PS["Control.Category"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var unFork = Unsafe_Coerce.unsafeCoerce;
  exports["unFork"] = unFork;
})(PS["Halogen.Query.ForkF"] = PS["Halogen.Query.ForkF"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Applicative_Free = PS["Control.Applicative.Free"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Aff_Class = PS["Control.Monad.Aff.Class"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Free = PS["Control.Monad.Free"];
  var Control_Monad_Reader_Class = PS["Control.Monad.Reader.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Monad_Writer_Class = PS["Control.Monad.Writer.Class"];
  var Control_Parallel_Class = PS["Control.Parallel.Class"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Coyoneda = PS["Data.Coyoneda"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Halogen_Query_EventSource = PS["Halogen.Query.EventSource"];
  var Halogen_Query_ForkF = PS["Halogen.Query.ForkF"];
  var Halogen_Query_InputF = PS["Halogen.Query.InputF"];
  var Prelude = PS["Prelude"];
  var HalogenM = function (x) {
      return x;
  };
  var State = (function () {
      function State(value0) {
          this.value0 = value0;
      };
      State.create = function (value0) {
          return new State(value0);
      };
      return State;
  })();
  var Subscribe = (function () {
      function Subscribe(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Subscribe.create = function (value0) {
          return function (value1) {
              return new Subscribe(value0, value1);
          };
      };
      return Subscribe;
  })();
  var Lift = (function () {
      function Lift(value0) {
          this.value0 = value0;
      };
      Lift.create = function (value0) {
          return new Lift(value0);
      };
      return Lift;
  })();
  var Halt = (function () {
      function Halt(value0) {
          this.value0 = value0;
      };
      Halt.create = function (value0) {
          return new Halt(value0);
      };
      return Halt;
  })();
  var GetSlots = (function () {
      function GetSlots(value0) {
          this.value0 = value0;
      };
      GetSlots.create = function (value0) {
          return new GetSlots(value0);
      };
      return GetSlots;
  })();
  var CheckSlot = (function () {
      function CheckSlot(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      CheckSlot.create = function (value0) {
          return function (value1) {
              return new CheckSlot(value0, value1);
          };
      };
      return CheckSlot;
  })();
  var ChildQuery = (function () {
      function ChildQuery(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ChildQuery.create = function (value0) {
          return function (value1) {
              return new ChildQuery(value0, value1);
          };
      };
      return ChildQuery;
  })();
  var Raise = (function () {
      function Raise(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Raise.create = function (value0) {
          return function (value1) {
              return new Raise(value0, value1);
          };
      };
      return Raise;
  })();
  var Par = (function () {
      function Par(value0) {
          this.value0 = value0;
      };
      Par.create = function (value0) {
          return new Par(value0);
      };
      return Par;
  })();
  var Fork = (function () {
      function Fork(value0) {
          this.value0 = value0;
      };
      Fork.create = function (value0) {
          return new Fork(value0);
      };
      return Fork;
  })();
  var GetRef = (function () {
      function GetRef(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      GetRef.create = function (value0) {
          return function (value1) {
              return new GetRef(value0, value1);
          };
      };
      return GetRef;
  })();
  var subscribe = function (es) {
      return HalogenM(Control_Monad_Free.liftF(new Subscribe(es, Data_Unit.unit)));
  };
  var raise = function (o) {
      return HalogenM(Control_Monad_Free.liftF(new Raise(o, Data_Unit.unit)));
  }; 
  var mkQuery = function (dictEq) {
      return function (p) {
          return function ($176) {
              return HalogenM(Control_Monad_Free.liftF(ChildQuery.create(p)(Data_Coyoneda.coyoneda(Control_Category.id(Control_Category.categoryFn))($176))));
          };
      };
  };                                                                                                                
  var getRef = function (p) {
      return HalogenM(Control_Monad_Free.liftF(new GetRef(p, Control_Category.id(Control_Category.categoryFn))));
  };
  var functorHalogenM = new Data_Functor.Functor(function (f) {
      return function (v) {
          return Data_Functor.map(Control_Monad_Free.freeFunctor)(f)(v);
      };
  });
  var checkSlot = function (p) {
      return HalogenM(Control_Monad_Free.liftF(new CheckSlot(p, Control_Category.id(Control_Category.categoryFn))));
  };
  var applyHalogenM = new Control_Apply.Apply(function () {
      return functorHalogenM;
  }, function (v) {
      return function (v1) {
          return Control_Apply.apply(Control_Monad_Free.freeApply)(v)(v1);
      };
  });
  var bindHalogenM = new Control_Bind.Bind(function () {
      return applyHalogenM;
  }, function (v) {
      return function (f) {
          return Control_Bind.bind(Control_Monad_Free.freeBind)(v)(function (x) {
              var v1 = f(x);
              return v1;
          });
      };
  });                                                       
  var applicativeHalogenM = new Control_Applicative.Applicative(function () {
      return applyHalogenM;
  }, function (a) {
      return Control_Applicative.pure(Control_Monad_Free.freeApplicative)(a);
  });
  var monadHalogenM = new Control_Monad.Monad(function () {
      return applicativeHalogenM;
  }, function () {
      return bindHalogenM;
  });
  var monadEffHalogenM = function (dictMonadEff) {
      return new Control_Monad_Eff_Class.MonadEff(function () {
          return monadHalogenM;
      }, function (eff) {
          return HalogenM(Control_Monad_Free.liftF(Lift.create(Control_Monad_Eff_Class.liftEff(dictMonadEff)(eff))));
      });
  };
  var monadAffHalogenM = function (dictMonadAff) {
      return new Control_Monad_Aff_Class.MonadAff(function () {
          return monadEffHalogenM(dictMonadAff.MonadEff0());
      }, function (aff) {
          return HalogenM(Control_Monad_Free.liftF(Lift.create(Control_Monad_Aff_Class.liftAff(dictMonadAff)(aff))));
      });
  };
  var monadStateHalogenM = new Control_Monad_State_Class.MonadState(function () {
      return monadHalogenM;
  }, function ($180) {
      return HalogenM(Control_Monad_Free.liftF(State.create($180)));
  });
  exports["State"] = State;
  exports["Subscribe"] = Subscribe;
  exports["Lift"] = Lift;
  exports["Halt"] = Halt;
  exports["GetSlots"] = GetSlots;
  exports["CheckSlot"] = CheckSlot;
  exports["ChildQuery"] = ChildQuery;
  exports["Raise"] = Raise;
  exports["Par"] = Par;
  exports["Fork"] = Fork;
  exports["GetRef"] = GetRef;
  exports["HalogenM"] = HalogenM;
  exports["checkSlot"] = checkSlot;
  exports["getRef"] = getRef;
  exports["mkQuery"] = mkQuery;
  exports["raise"] = raise;
  exports["subscribe"] = subscribe;
  exports["functorHalogenM"] = functorHalogenM;
  exports["applyHalogenM"] = applyHalogenM;
  exports["applicativeHalogenM"] = applicativeHalogenM;
  exports["bindHalogenM"] = bindHalogenM;
  exports["monadHalogenM"] = monadHalogenM;
  exports["monadEffHalogenM"] = monadEffHalogenM;
  exports["monadAffHalogenM"] = monadAffHalogenM;
  exports["monadStateHalogenM"] = monadStateHalogenM;
})(PS["Halogen.Query.HalogenM"] = PS["Halogen.Query.HalogenM"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Const = PS["Data.Const"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Halogen_Data_OrdBox = PS["Halogen.Data.OrdBox"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_Query_HalogenM = PS["Halogen.Query.HalogenM"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var ComponentSlot = (function () {
      function ComponentSlot(value0, value1, value2, value3, value4, value5) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
          this.value5 = value5;
      };
      ComponentSlot.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return function (value4) {
                          return function (value5) {
                              return new ComponentSlot(value0, value1, value2, value3, value4, value5);
                          };
                      };
                  };
              };
          };
      };
      return ComponentSlot;
  })();
  var unComponentSlot = function (f) {
      return function (cs) {
          var v = Unsafe_Coerce.unsafeCoerce(cs);
          return f(v.value0)(v.value1)(v.value2)(v.value3)(v.value4)(v.value5);
      };
  };
  var unComponent = Unsafe_Coerce.unsafeCoerce;
  var mkComponentSlot = Unsafe_Coerce.unsafeCoerce(ComponentSlot.create);
  var mkComponent = Unsafe_Coerce.unsafeCoerce;
  var parentComponent = function (dictOrd) {
      return function (spec) {
          return mkComponent({
              initialState: spec.initialState, 
              render: spec.render, 
              "eval": spec["eval"], 
              receiver: spec.receiver, 
              initializer: Data_Maybe.Nothing.value, 
              finalizer: Data_Maybe.Nothing.value, 
              mkOrdBox: Halogen_Data_OrdBox.mkOrdBox(dictOrd)
          });
      };
  };
  var lifecycleComponent = function (dictBifunctor) {
      return function (spec) {
          return mkComponent({
              initialState: spec.initialState, 
              render: Unsafe_Coerce.unsafeCoerce(spec.render), 
              "eval": spec["eval"], 
              receiver: spec.receiver, 
              initializer: spec.initializer, 
              finalizer: spec.finalizer, 
              mkOrdBox: Halogen_Data_OrdBox.mkOrdBox(Data_Ord.ordVoid)
          });
      };
  };
  exports["lifecycleComponent"] = lifecycleComponent;
  exports["mkComponent"] = mkComponent;
  exports["mkComponentSlot"] = mkComponentSlot;
  exports["parentComponent"] = parentComponent;
  exports["unComponent"] = unComponent;
  exports["unComponentSlot"] = unComponentSlot;
})(PS["Halogen.Component"] = PS["Halogen.Component"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Ref = PS["Control.Monad.Eff.Ref"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Map = PS["Data.Map"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_Traversable = PS["Data.Traversable"];
  var Halogen_Aff_Effects = PS["Halogen.Aff.Effects"];
  var Halogen_Component = PS["Halogen.Component"];
  var Halogen_Data_OrdBox = PS["Halogen.Data.OrdBox"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var unRenderStateX = Unsafe_Coerce.unsafeCoerce;
  var unDriverStateX = Unsafe_Coerce.unsafeCoerce;
  var renderStateX_ = function (dictApplicative) {
      return function (f) {
          return unDriverStateX(function (st) {
              return Data_Foldable.traverse_(dictApplicative)(Data_Foldable.foldableMaybe)(f)(st.rendering);
          });
      };
  };
  var mkRenderStateX = function (v) {
      return Unsafe_Coerce.unsafeCoerce;
  };
  var renderStateX = function (dictFunctor) {
      return function (f) {
          return unDriverStateX(function (st) {
              return mkRenderStateX(st.prjQuery)(f(st.rendering));
          });
      };
  };
  var mkDriverStateXRef = Unsafe_Coerce.unsafeCoerce;
  var initDriverState = function (component) {
      return function (input) {
          return function (handler) {
              return function (prjQuery) {
                  return function (lchs) {
                      return function __do() {
                          var v = Control_Monad_Eff_Ref.newRef(Unsafe_Coerce.unsafeCoerce({}))();
                          var v1 = Control_Monad_Eff_Ref.newRef(Data_Map.empty)();
                          var v2 = Control_Monad_Eff_Ref.newRef(Data_Map.empty)();
                          var v3 = Control_Monad_Eff_Ref.newRef(Data_Functor.voidLeft(Data_Maybe.functorMaybe)(component.initializer)(Data_List_Types.Nil.value))();
                          var v4 = Control_Monad_Eff_Ref.newRef(new Data_Maybe.Just(Data_List_Types.Nil.value))();
                          var v5 = Control_Monad_Eff_Ref.newRef(Data_Maybe.Nothing.value)();
                          var v6 = Control_Monad_Eff_Ref.newRef(0)();
                          var v7 = Control_Monad_Eff_Ref.newRef(new Data_Maybe.Just(Data_Map.empty))();
                          var ds = {
                              component: component, 
                              state: component.initialState(input), 
                              refs: Data_StrMap.empty, 
                              children: Data_Map.empty, 
                              childrenIn: v1, 
                              childrenOut: v2, 
                              selfRef: v, 
                              handler: handler, 
                              pendingQueries: v3, 
                              pendingOuts: v4, 
                              pendingHandlers: v5, 
                              rendering: Data_Maybe.Nothing.value, 
                              prjQuery: prjQuery, 
                              fresh: v6, 
                              subscriptions: v7, 
                              lifecycleHandlers: lchs
                          };
                          Control_Monad_Eff_Ref.writeRef(v)(ds)();
                          return mkDriverStateXRef(v);
                      };
                  };
              };
          };
      };
  };
  exports["initDriverState"] = initDriverState;
  exports["mkDriverStateXRef"] = mkDriverStateXRef;
  exports["renderStateX"] = renderStateX;
  exports["renderStateX_"] = renderStateX_;
  exports["unDriverStateX"] = unDriverStateX;
  exports["unRenderStateX"] = unRenderStateX;
})(PS["Halogen.Aff.Driver.State"] = PS["Halogen.Aff.Driver.State"] || {});
(function(exports) {
    "use strict";

  exports.reallyUnsafeRefEq = function (a) {
    return function (b) {
      return a === b;
    };
  };
})(PS["Unsafe.Reference"] = PS["Unsafe.Reference"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Unsafe.Reference"];
  var unsafeRefEq = $foreign.reallyUnsafeRefEq;
  exports["unsafeRefEq"] = unsafeRefEq;
})(PS["Unsafe.Reference"] = PS["Unsafe.Reference"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Applicative_Free = PS["Control.Applicative.Free"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Coroutine = PS["Control.Coroutine"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Aff_Unsafe = PS["Control.Monad.Aff.Unsafe"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Eff_Ref = PS["Control.Monad.Eff.Ref"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Fork_Class = PS["Control.Monad.Fork.Class"];
  var Control_Monad_Free = PS["Control.Monad.Free"];
  var Control_Monad_Free_Trans = PS["Control.Monad.Free.Trans"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Parallel = PS["Control.Parallel"];
  var Control_Parallel_Class = PS["Control.Parallel.Class"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Coyoneda = PS["Data.Coyoneda"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Map = PS["Data.Map"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_Tuple = PS["Data.Tuple"];
  var Halogen_Aff_Driver_State = PS["Halogen.Aff.Driver.State"];
  var Halogen_Aff_Effects = PS["Halogen.Aff.Effects"];
  var Halogen_Data_OrdBox = PS["Halogen.Data.OrdBox"];
  var Halogen_Query_EventSource = PS["Halogen.Query.EventSource"];
  var Halogen_Query_ForkF = PS["Halogen.Query.ForkF"];
  var Halogen_Query_HalogenM = PS["Halogen.Query.HalogenM"];
  var Halogen_Query_InputF = PS["Halogen.Query.InputF"];
  var Prelude = PS["Prelude"];
  var Unsafe_Reference = PS["Unsafe.Reference"];        
  var queuingHandler = function (handler) {
      return function (ref) {
          return function (message) {
              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(ref)))(function (v) {
                  if (v instanceof Data_Maybe.Nothing) {
                      return handler(message);
                  };
                  if (v instanceof Data_Maybe.Just) {
                      return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.writeRef(ref)(new Data_Maybe.Just(new Data_List_Types.Cons(handler(message), v.value0))));
                  };
                  throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval line 174, column 3 - line 178, column 57: " + [ v.constructor.name ]);
              });
          };
      };
  };
  var handleLifecycle = function (lchs) {
      return function (f) {
          return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.writeRef(lchs)({
              initializers: Data_List_Types.Nil.value, 
              finalizers: Data_List_Types.Nil.value
          })))(function () {
              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(f))(function (v) {
                  return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(lchs)))(function (v1) {
                      return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(Data_Foldable.traverse_(Control_Monad_Aff.applicativeAff)(Data_List_Types.foldableList)(Control_Monad_Fork_Class.fork(Control_Monad_Fork_Class.monadForkAff))(v1.finalizers))(function () {
                          return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(Control_Parallel.parSequence_(Control_Monad_Aff.parallelAff)(Data_List_Types.foldableList)(v1.initializers))(function () {
                              return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v);
                          });
                      });
                  });
              });
          });
      };
  };
  var $$eval = function (render) {
      return function (r) {
          var go = function (ref) {
              return function (v) {
                  if (v instanceof Halogen_Query_HalogenM.State) {
                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(ref)))(function (v1) {
                          var v2 = v.value0(v1.state);
                          if (Unsafe_Reference.unsafeRefEq(v1.state)(v2.value1)) {
                              return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v2.value0);
                          };
                          if (Data_Boolean.otherwise) {
                              return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.writeRef(ref)((function () {
                                  var $41 = {};
                                  for (var $42 in v1) {
                                      if ({}.hasOwnProperty.call(v1, $42)) {
                                          $41[$42] = v1[$42];
                                      };
                                  };
                                  $41.state = v2.value1;
                                  return $41;
                              })())))(function () {
                                  return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(handleLifecycle(v1.lifecycleHandlers)(render(v1.lifecycleHandlers)(ref)))(function () {
                                      return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v2.value0);
                                  });
                              });
                          };
                          throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval line 78, column 7 - line 84, column 21: " + [ v2.constructor.name ]);
                      });
                  };
                  if (v instanceof Halogen_Query_HalogenM.Subscribe) {
                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(ref)))(function (v1) {
                          return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Fork_Class.fork(Control_Monad_Fork_Class.monadForkAff)(Control_Bind.bind(Control_Monad_Aff.bindAff)(Halogen_Query_EventSource.unEventSource(v.value0))(function (v2) {
                              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref["modifyRef'"](v1.fresh)(function (i) {
                                  return {
                                      state: i + 1 | 0, 
                                      value: i
                                  };
                              })))(function (v3) {
                                  var done$prime = Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(v1.subscriptions)))(function (v4) {
                                      return Control_Applicative.when(Control_Monad_Aff.applicativeAff)(Data_Maybe.maybe(false)(Data_Map.member(Data_Ord.ordInt)(v3))(v4))(Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(v2.done)(function () {
                                          return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.modifyRef(v1.subscriptions)(Data_Functor.map(Data_Maybe.functorMaybe)(Data_Map["delete"](Data_Ord.ordInt)(v3))));
                                      }));
                                  });
                                  return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.modifyRef(v1.subscriptions)(Data_Functor.map(Data_Maybe.functorMaybe)(Data_Map.insert(Data_Ord.ordInt)(v3)(done$prime)))))(function () {
                                      var consumer = Control_Bind.bind(Control_Monad_Free_Trans.bindFreeT(Control_Coroutine.functorAwait)(Control_Monad_Aff.monadAff))(Control_Coroutine["await"](Control_Monad_Aff.monadAff))(function (v4) {
                                          return Control_Bind.bind(Control_Monad_Free_Trans.bindFreeT(Control_Coroutine.functorAwait)(Control_Monad_Aff.monadAff))(Control_Monad_Trans_Class.lift(Control_Monad_Free_Trans.monadTransFreeT(Control_Coroutine.functorAwait))(Control_Monad_Aff.monadAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(v1.subscriptions))))(function (v5) {
                                              return Control_Applicative.when(Control_Monad_Free_Trans.applicativeFreeT(Control_Coroutine.functorAwait)(Control_Monad_Aff.monadAff))(Data_Maybe.isJust(v5))(Control_Bind.bind(Control_Monad_Free_Trans.bindFreeT(Control_Coroutine.functorAwait)(Control_Monad_Aff.monadAff))(Control_Monad_Trans_Class.lift(Control_Monad_Free_Trans.monadTransFreeT(Control_Coroutine.functorAwait))(Control_Monad_Aff.monadAff)(evalF(ref)(v4)))(function (v6) {
                                                  return Control_Applicative.when(Control_Monad_Free_Trans.applicativeFreeT(Control_Coroutine.functorAwait)(Control_Monad_Aff.monadAff))(Data_Eq.eq(Halogen_Query_EventSource.eqSubscribeStatus)(v6)(Halogen_Query_EventSource.Listening.value))(consumer);
                                              }));
                                          });
                                      });
                                      return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(Control_Coroutine.runProcess(Control_Monad_Aff.monadRecAff)(Control_Coroutine.pullFrom(Control_Monad_Aff.monadRecAff)(consumer)(v2.producer)))(function () {
                                          return done$prime;
                                      });
                                  });
                              });
                          })))(function (v2) {
                              return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v.value1);
                          });
                      });
                  };
                  if (v instanceof Halogen_Query_HalogenM.Lift) {
                      return v.value0;
                  };
                  if (v instanceof Halogen_Query_HalogenM.Halt) {
                      return Control_Monad_Error_Class.throwError(Control_Monad_Aff.monadThrowAff)(Control_Monad_Eff_Exception.error(v.value0));
                  };
                  if (v instanceof Halogen_Query_HalogenM.GetSlots) {
                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(ref)))(function (v1) {
                          return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v.value0(Data_Functor.map(Data_List_Types.functorList)(Halogen_Data_OrdBox.unOrdBox)(Data_Map.keys(v1.children))));
                      });
                  };
                  if (v instanceof Halogen_Query_HalogenM.CheckSlot) {
                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(ref)))(function (v1) {
                          return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v.value1(Data_Map.member(Halogen_Data_OrdBox.ordOrdBox)(v1.component.mkOrdBox(v.value0))(v1.children)));
                      });
                  };
                  if (v instanceof Halogen_Query_HalogenM.ChildQuery) {
                      return evalChildQuery(ref)(v.value0)(v.value1);
                  };
                  if (v instanceof Halogen_Query_HalogenM.Raise) {
                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(ref)))(function (v1) {
                          return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(queuingHandler(v1.handler)(v1.pendingOuts)(v.value0))(function () {
                              return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v.value1);
                          });
                      });
                  };
                  if (v instanceof Halogen_Query_HalogenM.Par) {
                      return Control_Parallel_Class.sequential(Control_Monad_Aff.parallelAff)(Control_Applicative_Free.retractFreeAp(Control_Monad_Aff.applicativeParAff)(Control_Applicative_Free.hoistFreeAp(function ($109) {
                          return Control_Parallel_Class.parallel(Control_Monad_Aff.parallelAff)(evalM(ref)($109));
                      })(v.value0)));
                  };
                  if (v instanceof Halogen_Query_HalogenM.Fork) {
                      return Halogen_Query_ForkF.unFork(function (v1) {
                          return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Fork_Class.fork(Control_Monad_Fork_Class.monadForkAff)(evalM(ref)(v1.value0)))(function (v2) {
                              return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v1.value1(function ($110) {
                                  return Control_Monad_Aff_Unsafe.unsafeCoerceAff(Data_Function.flip(Control_Monad_Aff.killFiber)(v2)($110));
                              }));
                          });
                      })(v.value0);
                  };
                  if (v instanceof Halogen_Query_HalogenM.GetRef) {
                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(ref)))(function (v1) {
                          return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v.value1(Data_StrMap.lookup(v.value0)(v1.refs)));
                      });
                  };
                  throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval line 75, column 12 - line 131, column 34: " + [ v.constructor.name ]);
              };
          };
          var evalM = function (ref) {
              return function (v) {
                  return Control_Monad_Free.foldFree(Control_Monad_Aff.monadRecAff)(go(ref))(v);
              };
          };
          var evalF = function (ref) {
              return function (q) {
                  return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(ref)))(function (v) {
                      var v1 = v["component"]["eval"](q);
                      return Control_Monad_Free.foldFree(Control_Monad_Aff.monadRecAff)(go(ref))(v1);
                  });
              };
          };
          var evalChildQuery = function (ref) {
              return function (p) {
                  return Data_Coyoneda.unCoyoneda(function (k) {
                      return function (q) {
                          return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(ref)))(function (v) {
                              var v1 = Data_Map.lookup(Halogen_Data_OrdBox.ordOrdBox)(v.component.mkOrdBox(p))(v.children);
                              if (v1 instanceof Data_Maybe.Just) {
                                  return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(v1.value0)))(function (v2) {
                                      return Halogen_Aff_Driver_State.unDriverStateX(function (ds) {
                                          var v3 = ds.prjQuery(q);
                                          if (v3 instanceof Data_Maybe.Just) {
                                              return Data_Functor.map(Control_Monad_Aff.functorAff)(k)(evalF(ds.selfRef)(v3.value0));
                                          };
                                          if (v3 instanceof Data_Maybe.Nothing) {
                                              return Control_Monad_Error_Class.throwError(Control_Monad_Aff.monadThrowAff)(Control_Monad_Eff_Exception.error("Query projection failed for child query"));
                                          };
                                          throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval line 144, column 32 - line 146, column 82: " + [ v3.constructor.name ]);
                                      })(v2);
                                  });
                              };
                              if (v1 instanceof Data_Maybe.Nothing) {
                                  return Control_Monad_Error_Class.throwError(Control_Monad_Aff.monadThrowAff)(Control_Monad_Eff_Exception.error("Slot lookup failed for child query"));
                              };
                              throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval line 141, column 5 - line 147, column 73: " + [ v1.constructor.name ]);
                          });
                      };
                  });
              };
          };
          return function (v) {
              if (v instanceof Halogen_Query_InputF.RefUpdate) {
                  return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.modifyRef(r)(function (v1) {
                      var $102 = {};
                      for (var $103 in v1) {
                          if ({}.hasOwnProperty.call(v1, $103)) {
                              $102[$103] = v1[$103];
                          };
                      };
                      $102.refs = Data_StrMap.alter(Data_Function["const"](v.value1))(v.value0)(v1.refs);
                      return $102;
                  })))(function () {
                      return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v.value2);
                  });
              };
              if (v instanceof Halogen_Query_InputF.Query) {
                  return evalF(r)(v.value0);
              };
              throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval line 61, column 3 - line 66, column 25: " + [ v.constructor.name ]);
          };
      };
  };
  exports["eval"] = $$eval;
  exports["handleLifecycle"] = handleLifecycle;
  exports["queuingHandler"] = queuingHandler;
})(PS["Halogen.Aff.Driver.Eval"] = PS["Halogen.Aff.Driver.Eval"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Coroutine = PS["Control.Coroutine"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Aff_AVar = PS["Control.Monad.Aff.AVar"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Console = PS["Control.Monad.Eff.Console"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Eff_Ref = PS["Control.Monad.Eff.Ref"];
  var Control_Monad_Eff_Unsafe = PS["Control.Monad.Eff.Unsafe"];
  var Control_Monad_Fork_Class = PS["Control.Monad.Fork.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Parallel = PS["Control.Parallel"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Map = PS["Data.Map"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Halogen = PS["Halogen"];
  var Halogen_Aff_Driver_Eval = PS["Halogen.Aff.Driver.Eval"];
  var Halogen_Aff_Driver_State = PS["Halogen.Aff.Driver.State"];
  var Halogen_Aff_Effects = PS["Halogen.Aff.Effects"];
  var Halogen_Component = PS["Halogen.Component"];
  var Halogen_Data_OrdBox = PS["Halogen.Data.OrdBox"];
  var Halogen_Query_InputF = PS["Halogen.Query.InputF"];
  var Prelude = PS["Prelude"];        
  var newLifecycleHandlers = Control_Monad_Eff_Ref.newRef({
      initializers: Data_List_Types.Nil.value, 
      finalizers: Data_List_Types.Nil.value
  });
  var handleAff = Control_Monad_Aff.runAff_(Data_Either.either(Control_Monad_Eff_Exception.throwException)(Data_Function["const"](Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit))));
  var runUI = function (renderSpec) {
      return function (component) {
          return function (i) {
              var subscribe = function (fresh) {
                  return function (ref) {
                      return function (consumer) {
                          return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.makeEmptyVar)(function (v) {
                              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(function __do() {
                                  var v1 = Control_Monad_Eff_Ref.readRef(fresh)();
                                  Control_Monad_Eff_Ref.modifyRef(fresh)(function (v2) {
                                      return v2 + 1 | 0;
                                  })();
                                  Control_Monad_Eff_Ref.modifyRef(ref)(Data_Map.insert(Data_Ord.ordInt)(v1)(v))();
                                  return v1;
                              }))(function (v1) {
                                  var producer = Control_Coroutine.producer(Control_Monad_Aff.monadAff)(Data_Functor.map(Control_Monad_Aff.functorAff)(Data_Either.Left.create)(Control_Monad_Aff_AVar.takeVar(v)));
                                  return Data_Functor["void"](Control_Monad_Aff.functorAff)(Control_Monad_Fork_Class.fork(Control_Monad_Fork_Class.monadForkAff)(Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(Control_Coroutine.runProcess(Control_Monad_Aff.monadRecAff)(Control_Coroutine.connect(Control_Monad_Aff.monadRecAff)(Control_Monad_Aff.parallelAff)(producer)(consumer)))(function () {
                                      return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.modifyRef(ref)(Data_Map["delete"](Data_Ord.ordInt)(v1))))(function () {
                                          return Control_Monad_Aff_AVar.killVar(Control_Monad_Eff_Exception.error("ended"))(v);
                                      });
                                  })));
                              });
                          });
                      };
                  };
              };
              var rootHandler = function (ref) {
                  return function (message) {
                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.readRef(ref)))(function (v) {
                          return Data_Foldable.traverse_(Control_Monad_Aff.applicativeAff)(Data_Map.foldableMap)(Control_Monad_Fork_Class.fork(Control_Monad_Fork_Class.monadForkAff))(Data_Functor.map(Data_Map.functorMap)(Control_Monad_Aff_AVar.putVar(message))(v));
                      });
                  };
              };
              var handlePending = function (ref) {
                  return function __do() {
                      var v = Control_Monad_Eff_Ref.readRef(ref)();
                      Control_Monad_Eff_Ref.writeRef(ref)(Data_Maybe.Nothing.value)();
                      return Data_Foldable.for_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableMaybe)(v)(function ($63) {
                          return handleAff(Data_Foldable.traverse_(Control_Monad_Aff.applicativeAff)(Data_List_Types.foldableList)(Control_Monad_Fork_Class.fork(Control_Monad_Fork_Class.monadForkAff))(Data_List.reverse($63)));
                      })();
                  };
              };
              var cleanupSubscriptions = function (v) {
                  return function __do() {
                      Control_Bind.bindFlipped(Control_Monad_Eff.bindEff)(Data_Foldable.traverse_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableMaybe)(function ($64) {
                          return handleAff(Data_Foldable.traverse_(Control_Monad_Aff.applicativeAff)(Data_Map.foldableMap)(Control_Monad_Fork_Class.fork(Control_Monad_Fork_Class.monadForkAff))($64));
                      }))(Control_Monad_Eff_Ref.readRef(v.subscriptions))();
                      return Control_Monad_Eff_Ref.writeRef(v.subscriptions)(Data_Maybe.Nothing.value)();
                  };
              };
              var squashChildInitializers = function (lchs) {
                  return function (preInits) {
                      return Halogen_Aff_Driver_State.unDriverStateX(function (st) {
                          var parentInitializer = Data_Functor.map(Data_Maybe.functorMaybe)(function ($65) {
                              return evalF(st.selfRef)(Halogen_Query_InputF.Query.create($65));
                          })(st.component.initializer);
                          return Control_Monad_Eff_Ref.modifyRef(lchs)(function (handlers) {
                              return {
                                  initializers: new Data_List_Types.Cons(Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(Control_Parallel.parSequence_(Control_Monad_Aff.parallelAff)(Data_List_Types.foldableList)(Data_List.reverse(handlers.initializers)))(function () {
                                      return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(Data_Foldable.sequence_(Control_Monad_Aff.applicativeAff)(Data_Foldable.foldableMaybe)(parentInitializer))(function () {
                                          return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(function __do() {
                                              handlePending(st.pendingQueries)();
                                              return handlePending(st.pendingOuts)();
                                          });
                                      });
                                  }), preInits), 
                                  finalizers: handlers.finalizers
                              };
                          });
                      });
                  };
              };
              var runComponent = function (lchs) {
                  return function (handler) {
                      return function (j) {
                          return function (prjQuery) {
                              return Halogen_Component.unComponent(function (c) {
                                  return function __do() {
                                      var v = newLifecycleHandlers();
                                      var v1 = Halogen_Aff_Driver_State.initDriverState(c)(j)(handler)(prjQuery)(v)();
                                      var v2 = Control_Monad_Eff_Ref.readRef(lchs)();
                                      Control_Monad_Eff_Ref.writeRef(lchs)({
                                          initializers: Data_List_Types.Nil.value, 
                                          finalizers: v2.finalizers
                                      })();
                                      Control_Bind.bindFlipped(Control_Monad_Eff.bindEff)(Halogen_Aff_Driver_State.unDriverStateX(function ($66) {
                                          return render(lchs)((function (v3) {
                                              return v3.selfRef;
                                          })($66));
                                      }))(Control_Monad_Eff_Ref.readRef(v1))();
                                      Control_Bind.bindFlipped(Control_Monad_Eff.bindEff)(squashChildInitializers(lchs)(v2.initializers))(Control_Monad_Eff_Ref.readRef(v1))();
                                      return v1;
                                  };
                              });
                          };
                      };
                  };
              };
              var renderChild = function (lchs) {
                  return function (handler) {
                      return function (mkOrdBox) {
                          return function (childrenInRef) {
                              return function (childrenOutRef) {
                                  return Halogen_Component.unComponentSlot(function (p) {
                                      return function (ctor) {
                                          return function (input) {
                                              return function (inputQuery) {
                                                  return function (outputQuery) {
                                                      return function (prjQuery) {
                                                          var ordP = mkOrdBox(p);
                                                          return function __do() {
                                                              var v = Control_Monad_Eff_Ref.readRef(childrenInRef)();
                                                              var v1 = (function () {
                                                                  var v1 = Data_Map.pop(Halogen_Data_OrdBox.ordOrdBox)(ordP)(v);
                                                                  if (v1 instanceof Data_Maybe.Just) {
                                                                      return function __do() {
                                                                          Control_Monad_Eff_Ref.writeRef(childrenInRef)(v1.value0.value1)();
                                                                          Data_Foldable.for_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableMaybe)(inputQuery(input))(function (q) {
                                                                              return function __do() {
                                                                                  var v2 = Control_Monad_Eff_Ref.readRef(v1.value0.value0)();
                                                                                  return Halogen_Aff_Driver_State.unDriverStateX(function (st) {
                                                                                      return Data_Foldable.for_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableMaybe)(st.prjQuery(q))(function ($67) {
                                                                                          return handleAff(evalF(st.selfRef)(Halogen_Query_InputF.Query.create($67)));
                                                                                      });
                                                                                  })(v2)();
                                                                              };
                                                                          })();
                                                                          return v1.value0.value0;
                                                                      };
                                                                  };
                                                                  if (v1 instanceof Data_Maybe.Nothing) {
                                                                      return runComponent(lchs)(function ($68) {
                                                                          return Data_Maybe.maybe(Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(Data_Unit.unit))(handler)(outputQuery($68));
                                                                      })(input)(prjQuery)(ctor);
                                                                  };
                                                                  throw new Error("Failed pattern match at Halogen.Aff.Driver line 260, column 14 - line 268, column 92: " + [ v1.constructor.name ]);
                                                              })()();
                                                              var v2 = Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Map.member(Halogen_Data_OrdBox.ordOrdBox)(ordP))(Control_Monad_Eff_Ref.readRef(childrenOutRef))();
                                                              Control_Applicative.when(Control_Monad_Eff.applicativeEff)(v2)(Control_Monad_Eff_Unsafe.unsafeCoerceEff(Control_Monad_Eff_Console.warn("Halogen: Duplicate slot address was detected during rendering, unexpected results may occur")))();
                                                              Control_Monad_Eff_Ref.modifyRef(childrenOutRef)(Data_Map.insert(Halogen_Data_OrdBox.ordOrdBox)(ordP)(v1))();
                                                              return Control_Bind.bind(Control_Monad_Eff.bindEff)(Control_Monad_Eff_Ref.readRef(v1))(Halogen_Aff_Driver_State.renderStateX(Control_Monad_Eff.functorEff)(function (v3) {
                                                                  if (v3 instanceof Data_Maybe.Nothing) {
                                                                      return Control_Monad_Eff_Exception["throw"]("Halogen internal error: child was not initialized in renderChild");
                                                                  };
                                                                  if (v3 instanceof Data_Maybe.Just) {
                                                                      return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(renderSpec.renderChild(v3.value0));
                                                                  };
                                                                  throw new Error("Failed pattern match at Halogen.Aff.Driver line 274, column 36 - line 276, column 50: " + [ v3.constructor.name ]);
                                                              }))();
                                                          };
                                                      };
                                                  };
                                              };
                                          };
                                      };
                                  });
                              };
                          };
                      };
                  };
              };
              var render = function (lchs) {
                  return function ($$var) {
                      return function __do() {
                          var v = Control_Monad_Eff_Ref.readRef($$var)();
                          var v1 = Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Maybe.isNothing)(Control_Monad_Eff_Ref.readRef(v.pendingHandlers))();
                          Control_Applicative.when(Control_Monad_Eff.applicativeEff)(v1)(Control_Monad_Eff_Ref.writeRef(v.pendingHandlers)(new Data_Maybe.Just(Data_List_Types.Nil.value)))();
                          Control_Monad_Eff_Ref.writeRef(v.childrenOut)(Data_Map.empty)();
                          Control_Monad_Eff_Ref.writeRef(v.childrenIn)(v.children)();
                          var handler = Halogen_Aff_Driver_Eval.queuingHandler(function ($69) {
                              return Data_Functor["void"](Control_Monad_Aff.functorAff)(evalF(v.selfRef)($69));
                          })(v.pendingHandlers);
                          var childHandler = Halogen_Aff_Driver_Eval.queuingHandler(function ($70) {
                              return handler(Halogen_Query_InputF.Query.create($70));
                          })(v.pendingQueries);
                          var v2 = renderSpec.render(function ($71) {
                              return handleAff(handler($71));
                          })(renderChild(lchs)(childHandler)(v.component.mkOrdBox)(v.childrenIn)(v.childrenOut))(v.component.render(v.state))(v.rendering)();
                          var v3 = Control_Monad_Eff_Ref.readRef(v.childrenOut)();
                          Control_Bind.bind(Control_Monad_Eff.bindEff)(Control_Monad_Eff_Ref.readRef(v.childrenIn))(Data_Foldable.traverse_(Control_Monad_Eff.applicativeEff)(Data_Map.foldableMap)(function (childVar) {
                              return function __do() {
                                  var v4 = Control_Monad_Eff_Ref.readRef(childVar)();
                                  Halogen_Aff_Driver_State.renderStateX_(Control_Monad_Eff.applicativeEff)(renderSpec.removeChild)(v4)();
                                  return finalize(lchs)(v4)();
                              };
                          }))();
                          Control_Monad_Eff_Ref.modifyRef(v.selfRef)(function (v4) {
                              return {
                                  rendering: new Data_Maybe.Just(v2), 
                                  children: v3, 
                                  component: v4.component, 
                                  state: v4.state, 
                                  refs: v4.refs, 
                                  childrenIn: v4.childrenIn, 
                                  childrenOut: v4.childrenOut, 
                                  selfRef: v4.selfRef, 
                                  handler: v4.handler, 
                                  pendingQueries: v4.pendingQueries, 
                                  pendingOuts: v4.pendingOuts, 
                                  pendingHandlers: v4.pendingHandlers, 
                                  prjQuery: v4.prjQuery, 
                                  fresh: v4.fresh, 
                                  subscriptions: v4.subscriptions, 
                                  lifecycleHandlers: v4.lifecycleHandlers
                              };
                          })();
                          return Control_Applicative.when(Control_Monad_Eff.applicativeEff)(v1)(Data_Function.flip(Control_Monad_Rec_Class.tailRecM(Control_Monad_Rec_Class.monadRecEff))(Data_Unit.unit)(function (v4) {
                              return function __do() {
                                  var v5 = Control_Monad_Eff_Ref.readRef(v.pendingHandlers)();
                                  Control_Monad_Eff_Ref.writeRef(v.pendingHandlers)(new Data_Maybe.Just(Data_List_Types.Nil.value))();
                                  Data_Foldable.traverse_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableMaybe)(function ($72) {
                                      return handleAff(Data_Foldable.traverse_(Control_Monad_Aff.applicativeAff)(Data_List_Types.foldableList)(Control_Monad_Fork_Class.fork(Control_Monad_Fork_Class.monadForkAff))(Data_List.reverse($72)));
                                  })(v5)();
                                  var v6 = Control_Monad_Eff_Ref.readRef(v.pendingHandlers)();
                                  var $57 = Data_Maybe.maybe(false)(Data_List["null"])(v6);
                                  if ($57) {
                                      return Data_Functor.voidLeft(Control_Monad_Eff.functorEff)(Control_Monad_Eff_Ref.writeRef(v.pendingHandlers)(Data_Maybe.Nothing.value))(new Control_Monad_Rec_Class.Done(Data_Unit.unit))();
                                  };
                                  return new Control_Monad_Rec_Class.Loop(Data_Unit.unit);
                              };
                          }))();
                      };
                  };
              };
              var finalize = function (lchs) {
                  return Halogen_Aff_Driver_State.unDriverStateX(function (st) {
                      return function __do() {
                          cleanupSubscriptions(st)();
                          Data_Foldable.for_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableMaybe)(Data_Functor.map(Data_Maybe.functorMaybe)(function ($73) {
                              return evalF(st.selfRef)(Halogen_Query_InputF.Query.create($73));
                          })(st.component.finalizer))(function (f) {
                              return Control_Monad_Eff_Ref.modifyRef(lchs)(function (handlers) {
                                  return {
                                      initializers: handlers.initializers, 
                                      finalizers: new Data_List_Types.Cons(f, handlers.finalizers)
                                  };
                              });
                          })();
                          return Data_Foldable.for_(Control_Monad_Eff.applicativeEff)(Data_Map.foldableMap)(st.children)(Control_Bind.composeKleisliFlipped(Control_Monad_Eff.bindEff)(finalize(lchs))(Control_Monad_Eff_Ref.readRef))();
                      };
                  });
              };
              var evalF = function (ref) {
                  return Halogen_Aff_Driver_Eval["eval"](render)(ref);
              };
              var evalDriver = function (ref) {
                  return function (prjQuery) {
                      return function (q) {
                          var v = prjQuery(q);
                          if (v instanceof Data_Maybe.Just) {
                              return evalF(ref)(new Halogen_Query_InputF.Query(v.value0));
                          };
                          if (v instanceof Data_Maybe.Nothing) {
                              return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Exception.throwException(Control_Monad_Eff_Exception.error("Halogen internal error: query projection failed in runUI'")));
                          };
                          throw new Error("Failed pattern match at Halogen.Aff.Driver line 138, column 5 - line 140, column 110: " + [ v.constructor.name ]);
                      };
                  };
              };
              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(newLifecycleHandlers))(function (v) {
                  return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Ref.newRef(0)))(function (v1) {
                      return Halogen_Aff_Driver_Eval.handleLifecycle(v)(function __do() {
                          var v2 = Control_Monad_Eff_Ref.newRef(Data_Map.empty)();
                          return Control_Bind.bind(Control_Monad_Eff.bindEff)(Control_Bind.bind(Control_Monad_Eff.bindEff)(runComponent(v)(rootHandler(v2))(i)(Data_Maybe.Just.create)(component))(Control_Monad_Eff_Ref.readRef))(Halogen_Aff_Driver_State.unDriverStateX(function (st) {
                              return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)({
                                  query: evalDriver(st.selfRef)(st.prjQuery), 
                                  subscribe: subscribe(v1)(v2)
                              });
                          }))();
                      });
                  });
              });
          };
      };
  };
  exports["runUI"] = runUI;
})(PS["Halogen.Aff.Driver"] = PS["Halogen.Aff.Driver"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM = PS["DOM"];
  var DOM_Event_EventTarget = PS["DOM.Event.EventTarget"];
  var DOM_HTML = PS["DOM.HTML"];
  var DOM_HTML_Document = PS["DOM.HTML.Document"];
  var DOM_HTML_Document_ReadyState = PS["DOM.HTML.Document.ReadyState"];
  var DOM_HTML_Event_EventTypes = PS["DOM.HTML.Event.EventTypes"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var DOM_HTML_Window = PS["DOM.HTML.Window"];
  var DOM_Node_ParentNode = PS["DOM.Node.ParentNode"];
  var Data_Either = PS["Data.Either"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Unit = PS["Data.Unit"];
  var Halogen_Aff_Effects = PS["Halogen.Aff.Effects"];
  var Prelude = PS["Prelude"];        
  var selectElement = function (query) {
      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Bind.bindFlipped(Control_Monad_Eff.bindEff)(Control_Bind.composeKleisliFlipped(Control_Monad_Eff.bindEff)(function ($13) {
          return DOM_Node_ParentNode.querySelector(query)(DOM_HTML_Types.htmlDocumentToParentNode($13));
      })(DOM_HTML_Window.document))(DOM_HTML.window)))(function (v) {
          return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)((function () {
              if (v instanceof Data_Maybe.Nothing) {
                  return Data_Maybe.Nothing.value;
              };
              if (v instanceof Data_Maybe.Just) {
                  return Data_Either.either(Data_Function["const"](Data_Maybe.Nothing.value))(Data_Maybe.Just.create)(Control_Monad_Except.runExcept(DOM_HTML_Types.readHTMLElement(Data_Foreign.toForeign(v.value0))));
              };
              throw new Error("Failed pattern match at Halogen.Aff.Util line 58, column 8 - line 60, column 88: " + [ v.constructor.name ]);
          })());
      });
  };
  var runHalogenAff = Control_Monad_Aff.runAff_(Data_Either.either(Control_Monad_Eff_Exception.throwException)(Data_Function["const"](Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit))));
  var awaitLoad = Control_Monad_Aff.makeAff(function (callback) {
      return Control_Monad_Eff_Class.liftEff(Control_Monad_Eff_Class.monadEffEff)(function __do() {
          var v = Control_Bind.bindFlipped(Control_Monad_Eff.bindEff)(DOM_HTML_Document.readyState)(Control_Bind.bindFlipped(Control_Monad_Eff.bindEff)(DOM_HTML_Window.document)(DOM_HTML.window))();
          if (v instanceof DOM_HTML_Document_ReadyState.Complete) {
              callback(new Data_Either.Right(Data_Unit.unit))();
              return Control_Monad_Aff.nonCanceler;
          };
          var v1 = Data_Functor.map(Control_Monad_Eff.functorEff)(DOM_HTML_Types.windowToEventTarget)(DOM_HTML.window)();
          var listener = DOM_Event_EventTarget.eventListener(function (v2) {
              return callback(new Data_Either.Right(Data_Unit.unit));
          });
          DOM_Event_EventTarget.addEventListener(DOM_HTML_Event_EventTypes.load)(listener)(false)(v1)();
          return function (v2) {
              return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(DOM_Event_EventTarget.removeEventListener(DOM_HTML_Event_EventTypes.load)(listener)(false)(v1));
          };
      });
  });
  var awaitBody = Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Aff.bindAff)(awaitLoad)(function () {
      return Control_Bind.bind(Control_Monad_Aff.bindAff)(selectElement("body"))(function (v) {
          return Data_Maybe.maybe(Control_Monad_Error_Class.throwError(Control_Monad_Aff.monadThrowAff)(Control_Monad_Eff_Exception.error("Could not find body")))(Control_Applicative.pure(Control_Monad_Aff.applicativeAff))(v);
      });
  });
  exports["awaitBody"] = awaitBody;
  exports["awaitLoad"] = awaitLoad;
  exports["runHalogenAff"] = runHalogenAff;
  exports["selectElement"] = selectElement;
})(PS["Halogen.Aff.Util"] = PS["Halogen.Aff.Util"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM_HTML_Indexed = PS["DOM.HTML.Indexed"];
  var DOM_HTML_Indexed_ButtonType = PS["DOM.HTML.Indexed.ButtonType"];
  var DOM_HTML_Indexed_FormMethod = PS["DOM.HTML.Indexed.FormMethod"];
  var DOM_HTML_Indexed_InputType = PS["DOM.HTML.Indexed.InputType"];
  var DOM_HTML_Indexed_MenuType = PS["DOM.HTML.Indexed.MenuType"];
  var DOM_HTML_Indexed_MenuitemType = PS["DOM.HTML.Indexed.MenuitemType"];
  var DOM_HTML_Indexed_OnOff = PS["DOM.HTML.Indexed.OnOff"];
  var DOM_HTML_Indexed_OrderedListType = PS["DOM.HTML.Indexed.OrderedListType"];
  var DOM_HTML_Indexed_PreloadValue = PS["DOM.HTML.Indexed.PreloadValue"];
  var DOM_HTML_Indexed_StepValue = PS["DOM.HTML.Indexed.StepValue"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_String = PS["Data.String"];
  var Data_Unit = PS["Data.Unit"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_Query_InputF = PS["Halogen.Query.InputF"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var ref = (function () {
      var go = function (p) {
          return function (mel) {
              return Data_Maybe.Just.create(new Halogen_Query_InputF.RefUpdate(p, Data_Functor.map(Data_Maybe.functorMaybe)(Data_Foreign.toForeign)(mel), Data_Unit.unit));
          };
      };
      return function ($6) {
          return Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Core.ref)(go($6));
      };
  })();
  exports["ref"] = ref;
})(PS["Halogen.HTML.Properties"] = PS["Halogen.HTML.Properties"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM_HTML_Indexed = PS["DOM.HTML.Indexed"];
  var Data_Function = PS["Data.Function"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Tuple = PS["Data.Tuple"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_HTML_Properties = PS["Halogen.HTML.Properties"];
  var Halogen_Query_InputF = PS["Halogen.Query.InputF"];
  var Halogen_VDom = PS["Halogen.VDom"];
  var Halogen_VDom_Types = PS["Halogen.VDom.Types"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var element = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Core.element(Data_Maybe.Nothing.value));
  var h1 = element("h1");
  var h1_ = h1([  ]);        
  var p = element("p");
  var p_ = p([  ]);
  var pre = element("pre");
  var pre_ = pre([  ]);
  var div = element("div");
  var div_ = div([  ]);
  var button = element("button");
  exports["button"] = button;
  exports["div"] = div;
  exports["div_"] = div_;
  exports["element"] = element;
  exports["h1"] = h1;
  exports["h1_"] = h1_;
  exports["p"] = p;
  exports["p_"] = p_;
  exports["pre"] = pre;
  exports["pre_"] = pre_;
})(PS["Halogen.HTML.Elements"] = PS["Halogen.HTML.Elements"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Halogen_Component = PS["Halogen.Component"];
  var Halogen_Component_ChildPath = PS["Halogen.Component.ChildPath"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_HTML_Elements = PS["Halogen.HTML.Elements"];
  var Halogen_HTML_Properties = PS["Halogen.HTML.Properties"];
  var Prelude = PS["Prelude"];
  var slot = function (p) {
      return function (component) {
          return function (input) {
              return function (outputQuery) {
                  var f = Halogen_Component.unComponent(function (v) {
                      return v.receiver;
                  })(component);
                  return Halogen_HTML_Core.slot(Halogen_Component.mkComponentSlot(p)(component)(input)(f)(outputQuery)(Data_Maybe.Just.create));
              };
          };
      };
  };
  exports["slot"] = slot;
})(PS["Halogen.HTML"] = PS["Halogen.HTML"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad_Aff_Class = PS["Control.Monad.Aff.Class"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Parallel = PS["Control.Parallel"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var Data_Either = PS["Data.Either"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Map = PS["Data.Map"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Halogen_Component_ChildPath = PS["Halogen.Component.ChildPath"];
  var Halogen_Query_EventSource = PS["Halogen.Query.EventSource"];
  var Halogen_Query_HalogenM = PS["Halogen.Query.HalogenM"];
  var Halogen_Query_InputF = PS["Halogen.Query.InputF"];
  var Prelude = PS["Prelude"];        
  var request = function (req) {
      return req(Control_Category.id(Control_Category.categoryFn));
  };
  var query = function (dictEq) {
      return function (p) {
          return function (q) {
              return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Halogen_Query_HalogenM.checkSlot(p))(function (v) {
                  if (v) {
                      return Data_Functor.map(Halogen_Query_HalogenM.functorHalogenM)(Data_Maybe.Just.create)(Halogen_Query_HalogenM.mkQuery(dictEq)(p)(q));
                  };
                  return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(Data_Maybe.Nothing.value);
              });
          };
      };
  };
  var getHTMLElementRef = (function () {
      var go = function ($10) {
          return Data_Either.either(Data_Function["const"](Data_Maybe.Nothing.value))(Data_Maybe.Just.create)(Control_Monad_Except.runExcept(DOM_HTML_Types.readHTMLElement($10)));
      };
      return function ($11) {
          return Data_Functor.map(Halogen_Query_HalogenM.functorHalogenM)(function (v) {
              return Control_Bind.bindFlipped(Data_Maybe.bindMaybe)(go)(v);
          })(Halogen_Query_HalogenM.getRef($11));
      };
  })();
  var action = function (act) {
      return act(Data_Unit.unit);
  };
  exports["action"] = action;
  exports["getHTMLElementRef"] = getHTMLElementRef;
  exports["query"] = query;
  exports["request"] = request;
})(PS["Halogen.Query"] = PS["Halogen.Query"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM_Event_Event = PS["DOM.Event.Event"];
  var DOM_Event_Types = PS["DOM.Event.Types"];
  var DOM_HTML_Event_EventTypes = PS["DOM.HTML.Event.EventTypes"];
  var DOM_HTML_Event_Types = PS["DOM.HTML.Event.Types"];
  var Data_Either = PS["Data.Either"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Foreign_Index = PS["Data.Foreign.Index"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Maybe = PS["Data.Maybe"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_HTML_Properties = PS["Halogen.HTML.Properties"];
  var Halogen_Query = PS["Halogen.Query"];
  var Halogen_Query_InputF = PS["Halogen.Query.InputF"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];      
  var mouseHandler = Unsafe_Coerce.unsafeCoerce;
  var input_ = function (f) {
      return function (v) {
          return Data_Maybe.Just.create(Halogen_Query.action(f));
      };
  };
  var handler = function (et) {
      return function ($1) {
          return Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Core.handler)(et)(Data_Functor.map(Data_Functor.functorFn)(Data_Functor.map(Data_Maybe.functorMaybe)(Halogen_Query_InputF.Query.create))($1));
      };
  };                                                       
  var onClick = function ($2) {
      return handler(DOM_HTML_Event_EventTypes.click)(mouseHandler($2));
  };
  exports["handler"] = handler;
  exports["input_"] = input_;
  exports["onClick"] = onClick;
})(PS["Halogen.HTML.Events"] = PS["Halogen.HTML.Events"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var DOM = PS["DOM"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Data_Array = PS["Data.Array"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Nullable = PS["Data.Nullable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Halogen_VDom_Machine = PS["Halogen.VDom.Machine"];
  var Halogen_VDom_Types = PS["Halogen.VDom.Types"];
  var Halogen_VDom_Util = PS["Halogen.VDom.Util"];
  var Prelude = PS["Prelude"];
  var eqElemSpec = function (a, b) {
      if (Data_Eq.eq(Halogen_VDom_Types.eqElemName)(a.value1)(b.value1)) {
          if (a.value0 instanceof Data_Maybe.Just && (b.value0 instanceof Data_Maybe.Just && a.value0.value0 === b.value0.value0)) {
              return true;
          };
          if (a.value0 instanceof Data_Maybe.Nothing && b.value0 instanceof Data_Maybe.Nothing) {
              return true;
          };
          return false;
      };
      return false;
  };
  var buildWidget = function (v) {
      var patch = function (v1) {
          return function (v2) {
              if (v2 instanceof Halogen_VDom_Types.Grafted) {
                  return patch(v1)(Halogen_VDom_Types.runGraft(v2.value0));
              };
              if (v2 instanceof Halogen_VDom_Types.Widget) {
                  return function __do() {
                      var v3 = v1.value1(v2.value0)();
                      return new Halogen_VDom_Machine.Step(v3.value0, patch(v3), v3.value2);
                  };
              };
              return function __do() {
                  v1.value2();
                  return buildVDom(v)(v2)();
              };
          };
      };
      var render = function (w) {
          return function __do() {
              var v1 = v.buildWidget(v)(w)();
              return new Halogen_VDom_Machine.Step(v1.value0, patch(v1), v1.value2);
          };
      };
      return render;
  };
  var buildVDom = function (spec) {
      var render = function (v) {
          if (v instanceof Halogen_VDom_Types.Text) {
              return buildText(spec)(v.value0);
          };
          if (v instanceof Halogen_VDom_Types.Elem) {
              return buildElem(spec)(v.value0)(v.value1);
          };
          if (v instanceof Halogen_VDom_Types.Keyed) {
              return buildKeyed(spec)(v.value0)(v.value1);
          };
          if (v instanceof Halogen_VDom_Types.Widget) {
              return buildWidget(spec)(v.value0);
          };
          if (v instanceof Halogen_VDom_Types.Grafted) {
              return buildVDom(spec)(Halogen_VDom_Types.runGraft(v.value0));
          };
          throw new Error("Failed pattern match at Halogen.VDom.DOM line 58, column 12 - line 63, column 44: " + [ v.constructor.name ]);
      };
      return render;
  };
  var buildText = function (v) {
      var done = function (node) {
          return function __do() {
              var v1 = Halogen_VDom_Util.unsafeParent(node);
              return Halogen_VDom_Util.removeChild(node, v1)();
          };
      };
      var patch = function (node, s1) {
          return function (v1) {
              if (v1 instanceof Halogen_VDom_Types.Grafted) {
                  return patch(node, s1)(Halogen_VDom_Types.runGraft(v1.value0));
              };
              if (v1 instanceof Halogen_VDom_Types.Text) {
                  var res = new Halogen_VDom_Machine.Step(node, patch(node, v1.value0), done(node));
                  var v2 = s1 === v1.value0;
                  if (v2) {
                      return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(res);
                  };
                  return function __do() {
                      Halogen_VDom_Util.setTextContent(v1.value0, node)();
                      return res;
                  };
              };
              return function __do() {
                  done(node)();
                  return buildVDom(v)(v1)();
              };
          };
      };
      var render = function (s) {
          return function __do() {
              var v1 = Halogen_VDom_Util.createTextNode(s, v.document)();
              return new Halogen_VDom_Machine.Step(v1, patch(v1, s), done(v1));
          };
      };
      return render;
  };
  var buildKeyed = function (v) {
      var done = function (node, attrs, steps) {
          return function __do() {
              var v1 = Halogen_VDom_Util.unsafeParent(node);
              Halogen_VDom_Util.removeChild(node, v1)();
              Halogen_VDom_Util.forInE(steps, function (v2, v3) {
                  return v3.value2;
              })();
              return Halogen_VDom_Machine.halt(attrs)();
          };
      };
      var patch = function (node, attrs, v1, ch1, len1) {
          return function (v2) {
              if (v2 instanceof Halogen_VDom_Types.Grafted) {
                  return patch(node, attrs, v1, ch1, len1)(Halogen_VDom_Types.runGraft(v2.value0));
              };
              if (v2 instanceof Halogen_VDom_Types.Keyed && eqElemSpec(v1, v2.value0)) {
                  var v3 = Data_Array.length(v2.value1);
                  if (len1 === 0 && v3 === 0) {
                      return function __do() {
                          var v5 = Halogen_VDom_Machine.step(attrs)(v2.value0.value2)();
                          return new Halogen_VDom_Machine.Step(node, patch(node, v5, v2.value0, ch1, 0), done(node, v5, ch1));
                      };
                  };
                  var onThis = function (k, v5) {
                      return v5.value2;
                  };
                  var onThese = function (k, ix$prime, v5, v6) {
                      return function __do() {
                          var v7 = v5.value1(v6.value1)();
                          Halogen_VDom_Util.insertChildIx(ix$prime, v7.value0, node)();
                          return v7;
                      };
                  };
                  var onThat = function (k, ix, v5) {
                      return function __do() {
                          var v6 = buildVDom(v)(v5.value1)();
                          Halogen_VDom_Util.insertChildIx(ix, v6.value0, node)();
                          return v6;
                      };
                  };
                  return function __do() {
                      var v5 = Halogen_VDom_Util.diffWithKeyAndIxE(ch1, v2.value1, Data_Tuple.fst, onThese, onThis, onThat)();
                      var v6 = Halogen_VDom_Machine.step(attrs)(v2.value0.value2)();
                      return new Halogen_VDom_Machine.Step(node, patch(node, v6, v2.value0, v5, v3), done(node, v6, v5));
                  };
              };
              return function __do() {
                  done(node, attrs, ch1)();
                  return buildVDom(v)(v2)();
              };
          };
      };
      var render = function (v1) {
          return function (ch1) {
              return function __do() {
                  var v2 = Halogen_VDom_Util.createElement(Data_Nullable.toNullable(v1.value0), v1.value1, v.document)();
                  var node = DOM_Node_Types.elementToNode(v2);
                  var onChild = function (k, ix, v3) {
                      return function __do() {
                          var v4 = buildVDom(v)(v3.value1)();
                          Halogen_VDom_Util.insertChildIx(ix, v4.value0, node)();
                          return v4;
                      };
                  };
                  var v3 = Halogen_VDom_Util.strMapWithIxE(ch1, Data_Tuple.fst, onChild)();
                  var v4 = v.buildAttributes(v2)(v1.value2)();
                  return new Halogen_VDom_Machine.Step(node, patch(node, v4, v1, v3, Data_Array.length(ch1)), done(node, v4, v3));
              };
          };
      };
      return render;
  };
  var buildElem = function (v) {
      var done = function (node, attrs, steps) {
          return function __do() {
              var v1 = Halogen_VDom_Util.unsafeParent(node);
              Halogen_VDom_Util.removeChild(node, v1)();
              Control_Monad_Eff.foreachE(steps)(Halogen_VDom_Machine.halt)();
              return Halogen_VDom_Machine.halt(attrs)();
          };
      };
      var patch = function (node, attrs, v1, ch1) {
          return function (v2) {
              if (v2 instanceof Halogen_VDom_Types.Grafted) {
                  return patch(node, attrs, v1, ch1)(Halogen_VDom_Types.runGraft(v2.value0));
              };
              if (v2 instanceof Halogen_VDom_Types.Elem && eqElemSpec(v1, v2.value0)) {
                  var v3 = Data_Array.length(v2.value1);
                  var v4 = Data_Array.length(ch1);
                  if (v4 === 0 && v3 === 0) {
                      return function __do() {
                          var v5 = Halogen_VDom_Machine.step(attrs)(v2.value0.value2)();
                          return new Halogen_VDom_Machine.Step(node, patch(node, v5, v2.value0, ch1), done(node, v5, ch1));
                      };
                  };
                  var onThis = function (ix, v5) {
                      return v5.value2;
                  };
                  var onThese = function (ix, v5, vdom) {
                      return function __do() {
                          var v6 = v5.value1(vdom)();
                          Halogen_VDom_Util.insertChildIx(ix, v6.value0, node)();
                          return v6;
                      };
                  };
                  var onThat = function (ix, vdom) {
                      return function __do() {
                          var v5 = buildVDom(v)(vdom)();
                          Halogen_VDom_Util.insertChildIx(ix, v5.value0, node)();
                          return v5;
                      };
                  };
                  return function __do() {
                      var v5 = Halogen_VDom_Util.diffWithIxE(ch1, v2.value1, onThese, onThis, onThat)();
                      var v6 = Halogen_VDom_Machine.step(attrs)(v2.value0.value2)();
                      return new Halogen_VDom_Machine.Step(node, patch(node, v6, v2.value0, v5), done(node, v6, v5));
                  };
              };
              return function __do() {
                  done(node, attrs, ch1)();
                  return buildVDom(v)(v2)();
              };
          };
      };
      var render = function (v1) {
          return function (ch1) {
              return function __do() {
                  var v2 = Halogen_VDom_Util.createElement(Data_Nullable.toNullable(v1.value0), v1.value1, v.document)();
                  var node = DOM_Node_Types.elementToNode(v2);
                  var onChild = function (ix, child) {
                      return function __do() {
                          var v3 = buildVDom(v)(child)();
                          Halogen_VDom_Util.insertChildIx(ix, v3.value0, node)();
                          return v3;
                      };
                  };
                  var v3 = Halogen_VDom_Util.forE(ch1, onChild)();
                  var v4 = v.buildAttributes(v2)(v1.value2)();
                  return new Halogen_VDom_Machine.Step(node, patch(node, v4, v1, v3), done(node, v4, v3));
              };
          };
      };
      return render;
  };
  exports["buildElem"] = buildElem;
  exports["buildKeyed"] = buildKeyed;
  exports["buildText"] = buildText;
  exports["buildVDom"] = buildVDom;
  exports["buildWidget"] = buildWidget;
})(PS["Halogen.VDom.DOM"] = PS["Halogen.VDom.DOM"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Ref = PS["Control.Monad.Eff.Ref"];
  var DOM = PS["DOM"];
  var DOM_HTML = PS["DOM.HTML"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var DOM_HTML_Window = PS["DOM.HTML.Window"];
  var DOM_Node_Node = PS["DOM.Node.Node"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Unit = PS["Data.Unit"];
  var Halogen_Aff_Driver = PS["Halogen.Aff.Driver"];
  var Halogen_Aff_Driver_State = PS["Halogen.Aff.Driver.State"];
  var Halogen_Aff_Effects = PS["Halogen.Aff.Effects"];
  var Halogen_Component = PS["Halogen.Component"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_Query_InputF = PS["Halogen.Query.InputF"];
  var Halogen_VDom = PS["Halogen.VDom"];
  var Halogen_VDom_DOM = PS["Halogen.VDom.DOM"];
  var Halogen_VDom_DOM_Prop = PS["Halogen.VDom.DOM.Prop"];
  var Halogen_VDom_Machine = PS["Halogen.VDom.Machine"];
  var Prelude = PS["Prelude"];
  var Unsafe_Reference = PS["Unsafe.Reference"];
  var substInParent = function (v) {
      return function (v1) {
          return function (v2) {
              if (v1 instanceof Data_Maybe.Just && v2 instanceof Data_Maybe.Just) {
                  return Data_Functor["void"](Control_Monad_Eff.functorEff)(DOM_Node_Node.insertBefore(v)(v1.value0)(v2.value0));
              };
              if (v1 instanceof Data_Maybe.Nothing && v2 instanceof Data_Maybe.Just) {
                  return Data_Functor["void"](Control_Monad_Eff.functorEff)(DOM_Node_Node.appendChild(v)(v2.value0));
              };
              return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
          };
      };
  };
  var removeChild = function (v) {
      return function __do() {
          var v1 = DOM_Node_Node.parentNode(v.node)();
          return Data_Foldable.traverse_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableMaybe)(function (pn) {
              return DOM_Node_Node.removeChild(v.node)(pn);
          })(v1)();
      };
  };
  var mkSpec = function (handler) {
      return function (renderChildRef) {
          return function (document) {
              var getNode = Halogen_Aff_Driver_State.unRenderStateX(function (v) {
                  return v.node;
              });
              var done = Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
              var patch = function (slot) {
                  return function __do() {
                      var v = Control_Monad_Eff_Ref.readRef(renderChildRef)();
                      var v1 = v(slot)();
                      var node = getNode(v1);
                      return new Halogen_VDom_Machine.Step(node, patch, done);
                  };
              };
              var buildWidget = function (spec) {
                  return function (slot) {
                      return function __do() {
                          var v = Control_Monad_Eff_Ref.readRef(renderChildRef)();
                          var v1 = v(slot)();
                          var node = getNode(v1);
                          return new Halogen_VDom_Machine.Step(node, patch, done);
                      };
                  };
              };
              var buildAttributes = Halogen_VDom_DOM_Prop.buildProp(handler);
              return {
                  buildWidget: buildWidget, 
                  buildAttributes: buildAttributes, 
                  document: document
              };
          };
      };
  };
  var renderSpec = function (document) {
      return function (container) {
          var render = function (handler) {
              return function (child) {
                  return function (v) {
                      return function (v1) {
                          if (v1 instanceof Data_Maybe.Nothing) {
                              return function __do() {
                                  var v2 = Control_Monad_Eff_Ref.newRef(child)();
                                  var spec = mkSpec(handler)(v2)(document);
                                  var v3 = Halogen_VDom_DOM.buildVDom(spec)(v)();
                                  var node = Halogen_VDom_Machine.extract(v3);
                                  Data_Functor["void"](Control_Monad_Eff.functorEff)(DOM_Node_Node.appendChild(node)(DOM_HTML_Types.htmlElementToNode(container)))();
                                  return {
                                      machine: v3, 
                                      node: node, 
                                      renderChildRef: v2
                                  };
                              };
                          };
                          if (v1 instanceof Data_Maybe.Just) {
                              return function __do() {
                                  Control_Monad_Eff_Ref.writeRef(v1.value0.renderChildRef)(child)();
                                  var v2 = DOM_Node_Node.parentNode(v1.value0.node)();
                                  var v3 = DOM_Node_Node.nextSibling(v1.value0.node)();
                                  var v4 = Halogen_VDom_Machine.step(v1.value0.machine)(v)();
                                  var newNode = Halogen_VDom_Machine.extract(v4);
                                  Control_Applicative.when(Control_Monad_Eff.applicativeEff)(Data_HeytingAlgebra.not(Data_HeytingAlgebra.heytingAlgebraFunction(Data_HeytingAlgebra.heytingAlgebraFunction(Data_HeytingAlgebra.heytingAlgebraBoolean)))(Unsafe_Reference.unsafeRefEq)(v1.value0.node)(newNode))(substInParent(newNode)(v3)(v2))();
                                  return {
                                      machine: v4, 
                                      node: newNode, 
                                      renderChildRef: v1.value0.renderChildRef
                                  };
                              };
                          };
                          throw new Error("Failed pattern match at Halogen.VDom.Driver line 121, column 5 - line 137, column 80: " + [ v1.constructor.name ]);
                      };
                  };
              };
          };
          return {
              render: render, 
              renderChild: Control_Category.id(Control_Category.categoryFn), 
              removeChild: removeChild
          };
      };
  };
  var runUI = function (component) {
      return function (i) {
          return function (element) {
              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Data_Functor.map(Control_Monad_Eff.functorEff)(DOM_HTML_Types.htmlDocumentToDocument)(Control_Bind.bindFlipped(Control_Monad_Eff.bindEff)(DOM_HTML_Window.document)(DOM_HTML.window))))(function (v) {
                  return Halogen_Aff_Driver.runUI(renderSpec(v)(element))(component)(i);
              });
          };
      };
  };
  exports["runUI"] = runUI;
})(PS["Halogen.VDom.Driver"] = PS["Halogen.VDom.Driver"] || {});
(function(exports) {
  /* global exports */
  /* global XMLHttpRequest */
  /* global module */
  /* global process */
  "use strict";

  exports._ajax = function () {
    var platformSpecific = { };
    if (typeof module !== "undefined" && module.require && !(typeof process !== "undefined" && process.versions["electron"])) {
      // We are on node.js
      platformSpecific.newXHR = function () {
        var XHR = module.require("xhr2");
        return new XHR();
      };

      platformSpecific.fixupUrl = function (url) {
        var urllib = module.require("url");
        var u = urllib.parse(url);
        u.protocol = u.protocol || "http:";
        u.hostname = u.hostname || "localhost";
        return urllib.format(u);
      };

      platformSpecific.getResponse = function (xhr) {
        return xhr.response;
      };
    } else {
      // We are in the browser
      platformSpecific.newXHR = function () {
        return new XMLHttpRequest();
      };

      platformSpecific.fixupUrl = function (url) {
        return url || "/";
      };

      platformSpecific.getResponse = function (xhr) {
        return xhr.response;
      };
    }

    return function (mkHeader, options) {
      return function (errback, callback) {
        var xhr = platformSpecific.newXHR();
        var fixedUrl = platformSpecific.fixupUrl(options.url);
        xhr.open(options.method || "GET", fixedUrl, true, options.username, options.password);
        if (options.headers) {
          try {
            for (var i = 0, header; (header = options.headers[i]) != null; i++) {
              xhr.setRequestHeader(header.field, header.value);
            }
          } catch (e) {
            errback(e);
          }
        }
        xhr.onerror = function () {
          errback(new Error("AJAX request failed: " + options.method + " " + options.url));
        };
        xhr.onload = function () {
          callback({
            status: xhr.status,
            headers: xhr.getAllResponseHeaders().split("\r\n")
              .filter(function (header) {
                return header.length > 0;
              })
              .map(function (header) {
                var i = header.indexOf(":");
                return mkHeader(header.substring(0, i))(header.substring(i + 2));
              }),
            response: platformSpecific.getResponse(xhr)
          });
        };
        xhr.responseType = options.responseType;
        xhr.withCredentials = options.withCredentials;
        xhr.send(options.content);

        return function (/* error */) {
          return function (cancelErrback, cancelCallback) {
            try {
              xhr.abort();
            } catch (e) {
              return cancelErrback(e);
            }
            return cancelCallback();
          };
        };
      };
    };
  }();
})(PS["Network.HTTP.Affjax"] = PS["Network.HTTP.Affjax"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM_File_Types = PS["DOM.File.Types"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var DOM_XHR_Types = PS["DOM.XHR.Types"];
  var Data_Argonaut_Core = PS["Data.Argonaut.Core"];
  var Data_ArrayBuffer_Types = PS["Data.ArrayBuffer.Types"];
  var Data_FormURLEncoded = PS["Data.FormURLEncoded"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_MediaType_Common = PS["Data.MediaType.Common"];
  var Data_Show = PS["Data.Show"];
  var Data_Tuple = PS["Data.Tuple"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var Requestable = function (toRequest) {
      this.toRequest = toRequest;
  };
  var toRequest = function (dict) {
      return dict.toRequest;
  }; 
  var defaultToRequest = function ($0) {
      return Data_Tuple.Tuple.create(Data_Maybe.Nothing.value)(Unsafe_Coerce.unsafeCoerce($0));
  };                                                                   
  var requestableUnit = new Requestable(defaultToRequest);
  exports["Requestable"] = Requestable;
  exports["toRequest"] = toRequest;
  exports["requestableUnit"] = requestableUnit;
})(PS["Network.HTTP.Affjax.Request"] = PS["Network.HTTP.Affjax.Request"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM_File_Types = PS["DOM.File.Types"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Data_Argonaut_Core = PS["Data.Argonaut.Core"];
  var Data_ArrayBuffer_Types = PS["Data.ArrayBuffer.Types"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function = PS["Data.Function"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_MediaType_Common = PS["Data.MediaType.Common"];
  var Data_Show = PS["Data.Show"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var ArrayBufferResponse = (function () {
      function ArrayBufferResponse() {

      };
      ArrayBufferResponse.value = new ArrayBufferResponse();
      return ArrayBufferResponse;
  })();
  var BlobResponse = (function () {
      function BlobResponse() {

      };
      BlobResponse.value = new BlobResponse();
      return BlobResponse;
  })();
  var DocumentResponse = (function () {
      function DocumentResponse() {

      };
      DocumentResponse.value = new DocumentResponse();
      return DocumentResponse;
  })();
  var JSONResponse = (function () {
      function JSONResponse() {

      };
      JSONResponse.value = new JSONResponse();
      return JSONResponse;
  })();
  var StringResponse = (function () {
      function StringResponse() {

      };
      StringResponse.value = new StringResponse();
      return StringResponse;
  })();
  var Respondable = function (fromResponse, responseType) {
      this.fromResponse = fromResponse;
      this.responseType = responseType;
  }; 
  var responseTypeToString = function (v) {
      if (v instanceof ArrayBufferResponse) {
          return "arraybuffer";
      };
      if (v instanceof BlobResponse) {
          return "blob";
      };
      if (v instanceof DocumentResponse) {
          return "document";
      };
      if (v instanceof JSONResponse) {
          return "text";
      };
      if (v instanceof StringResponse) {
          return "text";
      };
      throw new Error("Failed pattern match at Network.HTTP.Affjax.Response line 49, column 1 - line 50, column 1: " + [ v.constructor.name ]);
  };
  var responseType = function (dict) {
      return dict.responseType;
  };                                                                                                                                                                                                                                                        
  var responsableString = new Respondable(Data_Foreign.readString, new Data_Tuple.Tuple(Data_Maybe.Nothing.value, StringResponse.value));                               
  var fromResponse = function (dict) {
      return dict.fromResponse;
  };
  exports["ArrayBufferResponse"] = ArrayBufferResponse;
  exports["BlobResponse"] = BlobResponse;
  exports["DocumentResponse"] = DocumentResponse;
  exports["JSONResponse"] = JSONResponse;
  exports["StringResponse"] = StringResponse;
  exports["Respondable"] = Respondable;
  exports["fromResponse"] = fromResponse;
  exports["responseType"] = responseType;
  exports["responseTypeToString"] = responseTypeToString;
  exports["responsableString"] = responsableString;
})(PS["Network.HTTP.Affjax.Response"] = PS["Network.HTTP.Affjax.Response"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Data_Eq = PS["Data.Eq"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];        
  var Accept = (function () {
      function Accept(value0) {
          this.value0 = value0;
      };
      Accept.create = function (value0) {
          return new Accept(value0);
      };
      return Accept;
  })();
  var ContentType = (function () {
      function ContentType(value0) {
          this.value0 = value0;
      };
      ContentType.create = function (value0) {
          return new ContentType(value0);
      };
      return ContentType;
  })();
  var RequestHeader = (function () {
      function RequestHeader(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      RequestHeader.create = function (value0) {
          return function (value1) {
              return new RequestHeader(value0, value1);
          };
      };
      return RequestHeader;
  })();
  var requestHeaderValue = function (v) {
      if (v instanceof Accept) {
          return Data_Newtype.unwrap(Data_MediaType.newtypeMediaType)(v.value0);
      };
      if (v instanceof ContentType) {
          return Data_Newtype.unwrap(Data_MediaType.newtypeMediaType)(v.value0);
      };
      if (v instanceof RequestHeader) {
          return v.value1;
      };
      throw new Error("Failed pattern match at Network.HTTP.RequestHeader line 30, column 1 - line 30, column 41: " + [ v.constructor.name ]);
  };
  var requestHeaderName = function (v) {
      if (v instanceof Accept) {
          return "Accept";
      };
      if (v instanceof ContentType) {
          return "Content-Type";
      };
      if (v instanceof RequestHeader) {
          return v.value0;
      };
      throw new Error("Failed pattern match at Network.HTTP.RequestHeader line 25, column 1 - line 26, column 1: " + [ v.constructor.name ]);
  };
  exports["Accept"] = Accept;
  exports["ContentType"] = ContentType;
  exports["RequestHeader"] = RequestHeader;
  exports["requestHeaderName"] = requestHeaderName;
  exports["requestHeaderValue"] = requestHeaderValue;
})(PS["Network.HTTP.RequestHeader"] = PS["Network.HTTP.RequestHeader"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Generic = PS["Data.Generic"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var ResponseHeader = (function () {
      function ResponseHeader(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ResponseHeader.create = function (value0) {
          return function (value1) {
              return new ResponseHeader(value0, value1);
          };
      };
      return ResponseHeader;
  })();
  var responseHeader = function (field) {
      return function (value) {
          return new ResponseHeader(field, value);
      };
  };
  exports["responseHeader"] = responseHeader;
})(PS["Network.HTTP.ResponseHeader"] = PS["Network.HTTP.ResponseHeader"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var $foreign = PS["Network.HTTP.Affjax"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Aff_Compat = PS["Control.Monad.Aff.Compat"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Eff_Ref = PS["Control.Monad.Eff.Ref"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Parallel = PS["Control.Parallel"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Argonaut_Parser = PS["Data.Argonaut.Parser"];
  var Data_Array = PS["Data.Array"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HTTP_Method = PS["Data.HTTP.Method"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Int = PS["Data.Int"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_Nullable = PS["Data.Nullable"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Time_Duration = PS["Data.Time.Duration"];
  var Data_Tuple = PS["Data.Tuple"];
  var $$Math = PS["Math"];
  var Network_HTTP_Affjax_Request = PS["Network.HTTP.Affjax.Request"];
  var Network_HTTP_Affjax_Response = PS["Network.HTTP.Affjax.Response"];
  var Network_HTTP_RequestHeader = PS["Network.HTTP.RequestHeader"];
  var Network_HTTP_ResponseHeader = PS["Network.HTTP.ResponseHeader"];
  var Network_HTTP_StatusCode = PS["Network.HTTP.StatusCode"];
  var Prelude = PS["Prelude"];
  var defaultRequest = {
      method: new Data_Either.Left(Data_HTTP_Method.GET.value), 
      url: "/", 
      headers: [  ], 
      content: Data_Maybe.Nothing.value, 
      username: Data_Maybe.Nothing.value, 
      password: Data_Maybe.Nothing.value, 
      withCredentials: false
  };
  var affjax = function (dictRequestable) {
      return function (dictRespondable) {
          return function (req) {
              var responseSettings = Network_HTTP_Affjax_Response.responseType(dictRespondable);
              var requestSettings = (function () {
                  var v = Data_Functor.map(Data_Maybe.functorMaybe)(Network_HTTP_Affjax_Request.toRequest(dictRequestable))(req.content);
                  if (v instanceof Data_Maybe.Nothing) {
                      return new Data_Tuple.Tuple(Data_Maybe.Nothing.value, Data_Maybe.Nothing.value);
                  };
                  if (v instanceof Data_Maybe.Just) {
                      return new Data_Tuple.Tuple(v.value0.value0, new Data_Maybe.Just(v.value0.value1));
                  };
                  throw new Error("Failed pattern match at Network.HTTP.Affjax line 250, column 21 - line 252, column 49: " + [ v.constructor.name ]);
              })();
              var parseJSON = function ($98) {
                  return Data_Either.either(function ($99) {
                      return Data_Foreign.fail(Data_Foreign.JSONError.create($99));
                  })(function ($100) {
                      return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(Data_Foreign.toForeign($100));
                  })(Data_Argonaut_Parser.jsonParser($98));
              };
              var fromResponse$prime = (function () {
                  var v = Data_Tuple.snd(responseSettings);
                  if (v instanceof Network_HTTP_Affjax_Response.JSONResponse) {
                      return Control_Bind.composeKleisliFlipped(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Network_HTTP_Affjax_Response.fromResponse(dictRespondable))(Control_Bind.composeKleisliFlipped(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(parseJSON)(Data_Foreign.readString));
                  };
                  return Network_HTTP_Affjax_Response.fromResponse(dictRespondable);
              })();
              var addHeader = function (mh) {
                  return function (hs) {
                      if (mh instanceof Data_Maybe.Just && !Data_Foldable.any(Data_Foldable.foldableArray)(Data_HeytingAlgebra.heytingAlgebraBoolean)(Data_Function.on(Data_Eq.eq(Data_Eq.eqString))(Network_HTTP_RequestHeader.requestHeaderName)(mh.value0))(hs)) {
                          return Data_Array.snoc(hs)(mh.value0);
                      };
                      return hs;
                  };
              };
              var headers = addHeader(Data_Functor.map(Data_Maybe.functorMaybe)(Network_HTTP_RequestHeader.ContentType.create)(Data_Tuple.fst(requestSettings)))(addHeader(Data_Functor.map(Data_Maybe.functorMaybe)(Network_HTTP_RequestHeader.Accept.create)(Data_Tuple.fst(responseSettings)))(req.headers));
              var req$prime = {
                  method: Data_HTTP_Method.print(req.method), 
                  url: req.url, 
                  headers: Data_Functor.map(Data_Functor.functorArray)(function (h) {
                      return {
                          field: Network_HTTP_RequestHeader.requestHeaderName(h), 
                          value: Network_HTTP_RequestHeader.requestHeaderValue(h)
                      };
                  })(headers), 
                  content: Data_Nullable.toNullable(Data_Tuple.snd(requestSettings)), 
                  responseType: Network_HTTP_Affjax_Response.responseTypeToString(Data_Tuple.snd(responseSettings)), 
                  username: Data_Nullable.toNullable(req.username), 
                  password: Data_Nullable.toNullable(req.password), 
                  withCredentials: req.withCredentials
              };
              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_Compat.fromEffFnAff($foreign._ajax(Network_HTTP_ResponseHeader.responseHeader, req$prime)))(function (v) {
                  var v1 = Data_Functor.map(Data_Either.functorEither)(function (v2) {
                      var $68 = {};
                      for (var $69 in v) {
                          if ({}.hasOwnProperty.call(v, $69)) {
                              $68[$69] = v[$69];
                          };
                      };
                      $68.response = v2;
                      return $68;
                  })(Control_Monad_Except.runExcept(fromResponse$prime(v.response)));
                  if (v1 instanceof Data_Either.Left) {
                      return Control_Monad_Error_Class.throwError(Control_Monad_Aff.monadThrowAff)(Control_Monad_Eff_Exception.error(Data_Show.show(Data_List_Types.showNonEmptyList(Data_Foreign.showForeignError))(v1.value0)));
                  };
                  if (v1 instanceof Data_Either.Right) {
                      return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v1.value0);
                  };
                  throw new Error("Failed pattern match at Network.HTTP.Affjax line 232, column 3 - line 234, column 28: " + [ v1.constructor.name ]);
              });
          };
      };
  };                                                                   
  var get = function (dictRespondable) {
      return function (u) {
          return affjax(Network_HTTP_Affjax_Request.requestableUnit)(dictRespondable)((function () {
              var $77 = {};
              for (var $78 in defaultRequest) {
                  if ({}.hasOwnProperty.call(defaultRequest, $78)) {
                      $77[$78] = defaultRequest[$78];
                  };
              };
              $77.url = u;
              return $77;
          })());
      };
  };
  exports["affjax"] = affjax;
  exports["defaultRequest"] = defaultRequest;
  exports["get"] = get;
})(PS["Network.HTTP.Affjax"] = PS["Network.HTTP.Affjax"] || {});
(function(exports) {
    "use strict";
  var Ace = PS["Ace"];
  var Ace_EditSession = PS["Ace.EditSession"];
  var Ace_Editor = PS["Ace.Editor"];
  var Ace_Types = PS["Ace.Types"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Aff_AVar = PS["Control.Monad.Aff.AVar"];
  var Control_Monad_Aff_Class = PS["Control.Monad.Aff.Class"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Unit = PS["Data.Unit"];
  var Halogen = PS["Halogen"];
  var Halogen_Component = PS["Halogen.Component"];
  var Halogen_HTML = PS["Halogen.HTML"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_HTML_Elements = PS["Halogen.HTML.Elements"];
  var Halogen_HTML_Properties = PS["Halogen.HTML.Properties"];
  var Halogen_Query = PS["Halogen.Query"];
  var Halogen_Query_EventSource = PS["Halogen.Query.EventSource"];
  var Halogen_Query_HalogenM = PS["Halogen.Query.HalogenM"];
  var Halogen_Query_InputF = PS["Halogen.Query.InputF"];
  var Prelude = PS["Prelude"];        

  // | A basic query algebra for the Ace component.
  var Initialize = (function () {
      function Initialize(value0) {
          this.value0 = value0;
      };
      Initialize.create = function (value0) {
          return new Initialize(value0);
      };
      return Initialize;
  })();

  // | A basic query algebra for the Ace component.
  var Finalize = (function () {
      function Finalize(value0) {
          this.value0 = value0;
      };
      Finalize.create = function (value0) {
          return new Finalize(value0);
      };
      return Finalize;
  })();

  // | A basic query algebra for the Ace component.
  var ChangeText = (function () {
      function ChangeText(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ChangeText.create = function (value0) {
          return function (value1) {
              return new ChangeText(value0, value1);
          };
      };
      return ChangeText;
  })();

  // | A basic query algebra for the Ace component.
  var HandleChange = (function () {
      function HandleChange(value0) {
          this.value0 = value0;
      };
      HandleChange.create = function (value0) {
          return new HandleChange(value0);
      };
      return HandleChange;
  })();
  var TextChanged = (function () {
      function TextChanged(value0) {
          this.value0 = value0;
      };
      TextChanged.create = function (value0) {
          return new TextChanged(value0);
      };
      return TextChanged;
  })();

  // | The Ace component definition.
  var aceComponent = (function () {
    
      // As we're embedding a 3rd party component we only need to create a

      // placeholder div here and attach the ref property which will let us reference

      // the element in eval.

      // The query algebra for the component handles the initialization of the Ace

      // editor as well as responding to the `ChangeText` action that allows us to

      // alter the editor's state.
  var render = Data_Function["const"](Halogen_HTML_Elements.div([ Halogen_HTML_Properties.ref("ace") ])([  ]));
      var initialState = {
          editor: Data_Maybe.Nothing.value
      };
      var $$eval = function (v) {
          if (v instanceof Initialize) {
              return Control_Bind.discard(Control_Bind.discardUnit)(Halogen_Query_HalogenM.bindHalogenM)(Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Halogen_Query.getHTMLElementRef("ace"))(function (v1) {
                  if (v1 instanceof Data_Maybe.Nothing) {
                      return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(Data_Unit.unit);
                  };
                  if (v1 instanceof Data_Maybe.Just) {
                      return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_Eff_Class.liftEff(Halogen_Query_HalogenM.monadEffHalogenM(Control_Monad_Aff.monadEffAff))(Ace.editNode(v1.value0)(Ace.ace)))(function (v2) {
                          return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_Eff_Class.liftEff(Halogen_Query_HalogenM.monadEffHalogenM(Control_Monad_Aff.monadEffAff))(Ace_Editor.getSession(v2)))(function (v3) {
                              return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_Eff_Class.liftEff(Halogen_Query_HalogenM.monadEffHalogenM(Control_Monad_Aff.monadEffAff))(Ace_EditSession.setMode("ace/mode/perspectives")(v3)))(function (v4) {
                                  return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_Eff_Class.liftEff(Halogen_Query_HalogenM.monadEffHalogenM(Control_Monad_Aff.monadEffAff))(Ace_Editor.setTheme("ace/theme/ambiance")(v2)))(function (v5) {
                                      return Control_Bind.discard(Control_Bind.discardUnit)(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.modify(Halogen_Query_HalogenM.monadStateHalogenM)(function (v6) {
                                          var $18 = {};
                                          for (var $19 in v6) {
                                              if ({}.hasOwnProperty.call(v6, $19)) {
                                                  $18[$19] = v6[$19];
                                              };
                                          };
                                          $18.editor = new Data_Maybe.Just(v2);
                                          return $18;
                                      }))(function () {
                                          return Halogen_Query_HalogenM.subscribe(Halogen_Query_EventSource.eventSource_(Control_Monad_Aff_Class.monadAffAff)(Ace_EditSession.onChange(v3))(Halogen_Query.request(HandleChange.create)));
                                      });
                                  });
                              });
                          });
                      });
                  };
                  throw new Error("Failed pattern match at PerspectAceComponent line 60, column 50 - line 68, column 91: " + [ v1.constructor.name ]);
              }))(function () {
                  return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(v.value0);
              });
          };
          if (v instanceof Finalize) {
              return Control_Bind.discard(Control_Bind.discardUnit)(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.modify(Halogen_Query_HalogenM.monadStateHalogenM)(function (v1) {
                  var $23 = {};
                  for (var $24 in v1) {
                      if ({}.hasOwnProperty.call(v1, $24)) {
                          $23[$24] = v1[$24];
                      };
                  };
                  $23.editor = Data_Maybe.Nothing.value;
                  return $23;
              }))(function () {
                  return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(v.value0);
              });
          };
          if (v instanceof ChangeText) {
              return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.gets(Halogen_Query_HalogenM.monadStateHalogenM)(function (v1) {
                  return v1.editor;
              }))(function (v1) {
                  return Control_Bind.discard(Control_Bind.discardUnit)(Halogen_Query_HalogenM.bindHalogenM)((function () {
                      if (v1 instanceof Data_Maybe.Nothing) {
                          return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(Data_Unit.unit);
                      };
                      if (v1 instanceof Data_Maybe.Just) {
                          return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_Eff_Class.liftEff(Halogen_Query_HalogenM.monadEffHalogenM(Control_Monad_Aff.monadEffAff))(Ace_Editor.getValue(v1.value0)))(function (v2) {
                              return Control_Applicative.when(Halogen_Query_HalogenM.applicativeHalogenM)(v.value0 !== v2)(Data_Functor["void"](Halogen_Query_HalogenM.functorHalogenM)(Control_Monad_Eff_Class.liftEff(Halogen_Query_HalogenM.monadEffHalogenM(Control_Monad_Aff.monadEffAff))(Ace_Editor.setValue(v.value0)(Data_Maybe.Nothing.value)(v1.value0))));
                          });
                      };
                      throw new Error("Failed pattern match at PerspectAceComponent line 77, column 7 - line 82, column 67: " + [ v1.constructor.name ]);
                  })())(function () {
                      return Control_Bind.discard(Control_Bind.discardUnit)(Halogen_Query_HalogenM.bindHalogenM)(Halogen_Query_HalogenM.raise(new TextChanged(v.value0)))(function () {
                          return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(v.value1);
                      });
                  });
              });
          };
          if (v instanceof HandleChange) {
              return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.gets(Halogen_Query_HalogenM.monadStateHalogenM)(function (v1) {
                  return v1.editor;
              }))(function (v1) {
                  return Control_Bind.discard(Control_Bind.discardUnit)(Halogen_Query_HalogenM.bindHalogenM)((function () {
                      if (v1 instanceof Data_Maybe.Nothing) {
                          return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(Data_Unit.unit);
                      };
                      if (v1 instanceof Data_Maybe.Just) {
                          return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_Eff_Class.liftEff(Halogen_Query_HalogenM.monadEffHalogenM(Control_Monad_Aff.monadEffAff))(Ace_Editor.getValue(v1.value0)))(function (v2) {
                              return Halogen_Query_HalogenM.raise(new TextChanged(v2));
                          });
                      };
                      throw new Error("Failed pattern match at PerspectAceComponent line 87, column 7 - line 91, column 37: " + [ v1.constructor.name ]);
                  })())(function () {
                      return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(v.value0(Halogen_Query_EventSource.Listening.value));
                  });
              });
          };
          throw new Error("Failed pattern match at PerspectAceComponent line 58, column 10 - line 92, column 30: " + [ v.constructor.name ]);
      };
      return Halogen_Component.lifecycleComponent(Halogen_HTML_Core.bifunctorHTML)({
          initialState: Data_Function["const"](initialState), 
          render: render, 
          "eval": $$eval, 
          initializer: new Data_Maybe.Just(Halogen_Query.action(Initialize.create)), 
          finalizer: new Data_Maybe.Just(Halogen_Query.action(Finalize.create)), 
          receiver: Data_Function["const"](Data_Maybe.Nothing.value)
      });
  })();
  exports["TextChanged"] = TextChanged;
  exports["Initialize"] = Initialize;
  exports["Finalize"] = Finalize;
  exports["ChangeText"] = ChangeText;
  exports["HandleChange"] = HandleChange;
  exports["aceComponent"] = aceComponent;
})(PS["PerspectAceComponent"] = PS["PerspectAceComponent"] || {});
(function(exports) {
    'use strict';
  /*
 Generate a guid (taken from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript)
 */  
  exports.guid = function()
  {
	  return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(
		  /[xy]/g, function( c )
		  {
			  //noinspection MagicNumberJS
			  var r = Math.random() * 16 | 0, v = c === 'x' ? r : (
				  r & 0x3 | 0x8
				  );
			  return v.toString( 16 );
		  } );
  };
})(PS["Perspectives.Guid"] = PS["Perspectives.Guid"] || {});
(function(exports) {
    "use strict";
  var $foreign = PS["Perspectives.Guid"];
  var Prelude = PS["Prelude"];
  exports["guid"] = $foreign.guid;
})(PS["Perspectives.Guid"] = PS["Perspectives.Guid"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_String = PS["Data.String"];
  var Prelude = PS["Prelude"];
  var updatePosString = function (pos$prime) {
      return function (str) {
          var updatePosChar = function (v) {
              return function (c) {
                  if (c === "\x0a") {
                      return {
                          line: v.line + 1 | 0, 
                          column: 1
                      };
                  };
                  if (c === "\x0d") {
                      return {
                          line: v.line + 1 | 0, 
                          column: 1
                      };
                  };
                  if (c === "\x09") {
                      return {
                          line: v.line, 
                          column: (v.column + 8 | 0) - (v.column - 1 | 0) % 8 | 0
                      };
                  };
                  return {
                      line: v.line, 
                      column: v.column + 1 | 0
                  };
              };
          };
          return Data_Foldable.foldl(Data_Foldable.foldableArray)(updatePosChar)(pos$prime)(Data_String.split(Data_Newtype.wrap(Data_String.newtypePattern)(""))(str));
      };
  };
  var showPosition = new Data_Show.Show(function (v) {
      return "(Position { line: " + (Data_Show.show(Data_Show.showInt)(v.line) + (", column: " + (Data_Show.show(Data_Show.showInt)(v.column) + " })")));
  });
  var initialPos = {
      line: 1, 
      column: 1
  };
  exports["initialPos"] = initialPos;
  exports["updatePosString"] = updatePosString;
  exports["showPosition"] = showPosition;
})(PS["Text.Parsing.Parser.Pos"] = PS["Text.Parsing.Parser.Pos"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_State = PS["Control.Monad.State"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_State_Trans = PS["Control.Monad.State.Trans"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Tuple = PS["Data.Tuple"];
  var Prelude = PS["Prelude"];
  var Text_Parsing_Parser_Pos = PS["Text.Parsing.Parser.Pos"];        
  var ParseState = (function () {
      function ParseState(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      ParseState.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new ParseState(value0, value1, value2);
              };
          };
      };
      return ParseState;
  })();
  var ParseError = (function () {
      function ParseError(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ParseError.create = function (value0) {
          return function (value1) {
              return new ParseError(value0, value1);
          };
      };
      return ParseError;
  })();
  var ParserT = function (x) {
      return x;
  };
  var showParseError = new Data_Show.Show(function (v) {
      return "(ParseError " + (Data_Show.show(Data_Show.showString)(v.value0) + (" " + (Data_Show.show(Text_Parsing_Parser_Pos.showPosition)(v.value1) + ")")));
  });
  var newtypeParserT = new Data_Newtype.Newtype(function (n) {
      return n;
  }, ParserT);
  var runParserT = function (dictMonad) {
      return function (s) {
          return function (p) {
              var initialState = new ParseState(s, Text_Parsing_Parser_Pos.initialPos, false);
              return Control_Monad_State_Trans.evalStateT(((dictMonad.Bind1()).Apply0()).Functor0())(Control_Monad_Except_Trans.runExceptT(Data_Newtype.unwrap(newtypeParserT)(p)))(initialState);
          };
      };
  };
  var monadTransParserT = new Control_Monad_Trans_Class.MonadTrans(function (dictMonad) {
      return function ($91) {
          return ParserT(Control_Monad_Trans_Class.lift(Control_Monad_Except_Trans.monadTransExceptT)(Control_Monad_State_Trans.monadStateT(dictMonad))(Control_Monad_Trans_Class.lift(Control_Monad_State_Trans.monadTransStateT)(dictMonad)($91)));
      };
  });
  var monadThrowParserT = function (dictMonad) {
      return Control_Monad_Except_Trans.monadThrowExceptT(Control_Monad_State_Trans.monadStateT(dictMonad));
  };
  var monadStateParserT = function (dictMonad) {
      return Control_Monad_Except_Trans.monadStateExceptT(Control_Monad_State_Trans.monadStateStateT(dictMonad));
  };
  var position = function (dictMonad) {
      return Control_Monad_State_Class.gets(monadStateParserT(dictMonad))(function (v) {
          return v.value1;
      });
  };
  var lazyParserT = new Control_Lazy.Lazy(function (f) {
      return Control_Lazy.defer(Control_Monad_State_Trans.lazyStateT)(function ($93) {
          return Control_Monad_Except_Trans.runExceptT(Data_Newtype.unwrap(newtypeParserT)(f($93)));
      });
  });                           
  var functorParserT = function (dictFunctor) {
      return Control_Monad_Except_Trans.functorExceptT(Control_Monad_State_Trans.functorStateT(dictFunctor));
  };
  var failWithPosition = function (dictMonad) {
      return function (message) {
          return function (pos) {
              return Control_Monad_Error_Class.throwError(monadThrowParserT(dictMonad))(new ParseError(message, pos));
          };
      };
  };
  var bindParserT = function (dictMonad) {
      return Control_Monad_Except_Trans.bindExceptT(Control_Monad_State_Trans.monadStateT(dictMonad));
  };
  var fail = function (dictMonad) {
      return function (message) {
          return Control_Bind.bindFlipped(bindParserT(dictMonad))(failWithPosition(dictMonad)(message))(position(dictMonad));
      };
  };
  var applyParserT = function (dictMonad) {
      return Control_Monad_Except_Trans.applyExceptT(Control_Monad_State_Trans.monadStateT(dictMonad));
  };
  var applicativeParserT = function (dictMonad) {
      return Control_Monad_Except_Trans.applicativeExceptT(Control_Monad_State_Trans.monadStateT(dictMonad));
  };
  var altParserT = function (dictMonad) {
      return new Control_Alt.Alt(function () {
          return functorParserT(((dictMonad.Bind1()).Apply0()).Functor0());
      }, function (p1) {
          return function (p2) {
              return ParserT(Control_Monad_Except_Trans.ExceptT(Control_Monad_State_Trans.StateT(function (v) {
                  return Control_Bind.bind(dictMonad.Bind1())(Control_Monad_State_Trans.runStateT(Control_Monad_Except_Trans.runExceptT(Data_Newtype.unwrap(newtypeParserT)(p1)))(new ParseState(v.value0, v.value1, false)))(function (v1) {
                      if (v1.value0 instanceof Data_Either.Left && !v1.value1.value2) {
                          return Control_Monad_State_Trans.runStateT(Control_Monad_Except_Trans.runExceptT(Data_Newtype.unwrap(newtypeParserT)(p2)))(v);
                      };
                      return Control_Applicative.pure(dictMonad.Applicative0())(new Data_Tuple.Tuple(v1.value0, v1.value1));
                  });
              })));
          };
      });
  };
  var plusParserT = function (dictMonad) {
      return new Control_Plus.Plus(function () {
          return altParserT(dictMonad);
      }, fail(dictMonad)("No alternative"));
  };
  var alternativeParserT = function (dictMonad) {
      return new Control_Alternative.Alternative(function () {
          return applicativeParserT(dictMonad);
      }, function () {
          return plusParserT(dictMonad);
      });
  };
  exports["ParseError"] = ParseError;
  exports["ParseState"] = ParseState;
  exports["ParserT"] = ParserT;
  exports["fail"] = fail;
  exports["failWithPosition"] = failWithPosition;
  exports["position"] = position;
  exports["runParserT"] = runParserT;
  exports["showParseError"] = showParseError;
  exports["newtypeParserT"] = newtypeParserT;
  exports["lazyParserT"] = lazyParserT;
  exports["functorParserT"] = functorParserT;
  exports["applyParserT"] = applyParserT;
  exports["applicativeParserT"] = applicativeParserT;
  exports["bindParserT"] = bindParserT;
  exports["monadStateParserT"] = monadStateParserT;
  exports["monadThrowParserT"] = monadThrowParserT;
  exports["altParserT"] = altParserT;
  exports["plusParserT"] = plusParserT;
  exports["alternativeParserT"] = alternativeParserT;
  exports["monadTransParserT"] = monadTransParserT;
})(PS["Text.Parsing.Parser"] = PS["Text.Parsing.Parser"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Monad_State = PS["Control.Monad.State"];
  var Control_Monad_State_Trans = PS["Control.Monad.State.Trans"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Text_Parsing_Parser = PS["Text.Parsing.Parser"];        
  var withErrorMessage = function (dictMonad) {
      return function (p) {
          return function (msg) {
              return Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(p)(Text_Parsing_Parser.fail(dictMonad)("Expected " + msg));
          };
      };
  };
  var tryRethrow = function (dictMonad) {
      return function (p) {
          return Text_Parsing_Parser.ParserT(Control_Monad_Except_Trans.ExceptT(Control_Monad_State_Trans.StateT(function (v) {
              return Control_Bind.bind(dictMonad.Bind1())(Control_Monad_State_Trans.runStateT(Control_Monad_Except_Trans.runExceptT(Data_Newtype.unwrap(Text_Parsing_Parser.newtypeParserT)(p)))(v))(function (v1) {
                  if (v1.value0 instanceof Data_Either.Left) {
                      return Control_Applicative.pure(dictMonad.Applicative0())(new Data_Tuple.Tuple(new Data_Either.Left(new Text_Parsing_Parser.ParseError(v1.value0.value0.value0, v.value1)), new Text_Parsing_Parser.ParseState(v1.value1.value0, v1.value1.value1, v.value2)));
                  };
                  return Control_Applicative.pure(dictMonad.Applicative0())(new Data_Tuple.Tuple(v1.value0, v1.value1));
              });
          })));
      };
  };
  var $$try = function (dictMonad) {
      return function (p) {
          return Text_Parsing_Parser.ParserT(Control_Monad_Except_Trans.ExceptT(Control_Monad_State_Trans.StateT(function (v) {
              return Control_Bind.bind(dictMonad.Bind1())(Control_Monad_State_Trans.runStateT(Control_Monad_Except_Trans.runExceptT(Data_Newtype.unwrap(Text_Parsing_Parser.newtypeParserT)(p)))(v))(function (v1) {
                  if (v1.value0 instanceof Data_Either.Left) {
                      return Control_Applicative.pure(dictMonad.Applicative0())(new Data_Tuple.Tuple(v1.value0, new Text_Parsing_Parser.ParseState(v1.value1.value0, v1.value1.value1, v.value2)));
                  };
                  return Control_Applicative.pure(dictMonad.Applicative0())(new Data_Tuple.Tuple(v1.value0, v1.value1));
              });
          })));
      };
  };
  var skipMany1 = function (dictMonad) {
      return function (p) {
          return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(p)(function (v) {
              return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(skipMany(dictMonad)(p))(function (v1) {
                  return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(Data_Unit.unit);
              });
          });
      };
  };
  var skipMany = function (dictMonad) {
      return function (p) {
          return Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(skipMany1(dictMonad)(p))(Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(Data_Unit.unit));
      };
  };
  var sepBy1 = function (dictMonad) {
      return function (p) {
          return function (sep) {
              return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(p)(function (v) {
                  return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Data_List.many(Text_Parsing_Parser.alternativeParserT(dictMonad))(Text_Parsing_Parser.lazyParserT)(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(sep)(p)))(function (v1) {
                      return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(new Data_List_Types.Cons(v, v1));
                  });
              });
          };
      };
  };
  var sepBy = function (dictMonad) {
      return function (p) {
          return function (sep) {
              return Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(sepBy1(dictMonad)(p)(sep))(Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(Data_List_Types.Nil.value));
          };
      };
  };
  var option = function (dictMonad) {
      return function (a) {
          return function (p) {
              return Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(p)(Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(a));
          };
      };
  };
  var notFollowedBy = function (dictMonad) {
      return function (p) {
          return $$try(dictMonad)(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))($$try(dictMonad)(p))(Text_Parsing_Parser.fail(dictMonad)("Negated parser succeeded")))(Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(Data_Unit.unit)));
      };
  };
  var choice = function (dictFoldable) {
      return function (dictMonad) {
          return Data_Foldable.foldl(dictFoldable)(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad)))(Control_Plus.empty(Text_Parsing_Parser.plusParserT(dictMonad)));
      };
  };
  var between = function (dictMonad) {
      return function (open) {
          return function (close) {
              return function (p) {
                  return Control_Apply.applyFirst(Text_Parsing_Parser.applyParserT(dictMonad))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(open)(p))(close);
              };
          };
      };
  };
  var asErrorMessage = function (dictMonad) {
      return Data_Function.flip(withErrorMessage(dictMonad));
  };
  exports["asErrorMessage"] = asErrorMessage;
  exports["between"] = between;
  exports["choice"] = choice;
  exports["notFollowedBy"] = notFollowedBy;
  exports["option"] = option;
  exports["sepBy"] = sepBy;
  exports["sepBy1"] = sepBy1;
  exports["skipMany"] = skipMany;
  exports["skipMany1"] = skipMany1;
  exports["try"] = $$try;
  exports["tryRethrow"] = tryRethrow;
  exports["withErrorMessage"] = withErrorMessage;
})(PS["Text.Parsing.Parser.Combinators"] = PS["Text.Parsing.Parser.Combinators"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_State = PS["Control.Monad.State"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Data_Array = PS["Data.Array"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_String = PS["Data.String"];
  var Prelude = PS["Prelude"];
  var Text_Parsing_Parser = PS["Text.Parsing.Parser"];
  var Text_Parsing_Parser_Combinators = PS["Text.Parsing.Parser.Combinators"];
  var Text_Parsing_Parser_Pos = PS["Text.Parsing.Parser.Pos"];        
  var StringLike = function (drop, indexOf, $$null, uncons) {
      this.drop = drop;
      this.indexOf = indexOf;
      this["null"] = $$null;
      this.uncons = uncons;
  };
  var uncons = function (dict) {
      return dict.uncons;
  };
  var stringLikeString = new StringLike(Data_String.drop, Data_String.indexOf, Data_String["null"], Data_String.uncons);
  var $$null = function (dict) {
      return dict["null"];
  };
  var indexOf = function (dict) {
      return dict.indexOf;
  };
  var drop = function (dict) {
      return dict.drop;
  };
  var string = function (dictStringLike) {
      return function (dictMonad) {
          return function (str) {
              return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Control_Monad_State_Class.gets(Text_Parsing_Parser.monadStateParserT(dictMonad))(function (v) {
                  return v.value0;
              }))(function (v) {
                  var v1 = indexOf(dictStringLike)(Data_Newtype.wrap(Data_String.newtypePattern)(str))(v);
                  if (v1 instanceof Data_Maybe.Just && v1.value0 === 0) {
                      return Control_Bind.discard(Control_Bind.discardUnit)(Text_Parsing_Parser.bindParserT(dictMonad))(Control_Monad_State_Class.modify(Text_Parsing_Parser.monadStateParserT(dictMonad))(function (v2) {
                          return new Text_Parsing_Parser.ParseState(drop(dictStringLike)(Data_String.length(str))(v), Text_Parsing_Parser_Pos.updatePosString(v2.value1)(str), true);
                      }))(function () {
                          return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(str);
                      });
                  };
                  return Text_Parsing_Parser.fail(dictMonad)("Expected " + Data_Show.show(Data_Show.showString)(str));
              });
          };
      };
  };
  var anyChar = function (dictStringLike) {
      return function (dictMonad) {
          return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Control_Monad_State_Class.gets(Text_Parsing_Parser.monadStateParserT(dictMonad))(function (v) {
              return v.value0;
          }))(function (v) {
              var v1 = uncons(dictStringLike)(v);
              if (v1 instanceof Data_Maybe.Nothing) {
                  return Text_Parsing_Parser.fail(dictMonad)("Unexpected EOF");
              };
              if (v1 instanceof Data_Maybe.Just) {
                  return Control_Bind.discard(Control_Bind.discardUnit)(Text_Parsing_Parser.bindParserT(dictMonad))(Control_Monad_State_Class.modify(Text_Parsing_Parser.monadStateParserT(dictMonad))(function (v2) {
                      return new Text_Parsing_Parser.ParseState(v1.value0.tail, Text_Parsing_Parser_Pos.updatePosString(v2.value1)(Data_String.singleton(v1.value0.head)), true);
                  }))(function () {
                      return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(v1.value0.head);
                  });
              };
              throw new Error("Failed pattern match at Text.Parsing.Parser.String line 54, column 3 - line 61, column 16: " + [ v1.constructor.name ]);
          });
      };
  };
  var satisfy = function (dictStringLike) {
      return function (dictMonad) {
          return function (f) {
              return Text_Parsing_Parser_Combinators.tryRethrow(dictMonad)(Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(anyChar(dictStringLike)(dictMonad))(function (v) {
                  var $61 = f(v);
                  if ($61) {
                      return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(v);
                  };
                  return Text_Parsing_Parser.fail(dictMonad)("Character '" + (Data_String.singleton(v) + "' did not satisfy predicate"));
              }));
          };
      };
  };
  var $$char = function (dictStringLike) {
      return function (dictMonad) {
          return function (c) {
              return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(satisfy(dictStringLike)(dictMonad)(function (v) {
                  return v === c;
              }))(Data_Show.show(Data_Show.showChar)(c));
          };
      };
  };
  var noneOf = function (dictStringLike) {
      return function (dictMonad) {
          return function (ss) {
              return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(satisfy(dictStringLike)(dictMonad)(Data_Function.flip(Data_Foldable.notElem(Data_Foldable.foldableArray)(Data_Eq.eqChar))(ss)))("none of " + Data_Show.show(Data_Show.showArray(Data_Show.showChar))(ss));
          };
      };
  };
  var oneOf = function (dictStringLike) {
      return function (dictMonad) {
          return function (ss) {
              return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(satisfy(dictStringLike)(dictMonad)(Data_Function.flip(Data_Foldable.elem(Data_Foldable.foldableArray)(Data_Eq.eqChar))(ss)))("one of " + Data_Show.show(Data_Show.showArray(Data_Show.showChar))(ss));
          };
      };
  };
  exports["StringLike"] = StringLike;
  exports["anyChar"] = anyChar;
  exports["char"] = $$char;
  exports["drop"] = drop;
  exports["indexOf"] = indexOf;
  exports["noneOf"] = noneOf;
  exports["oneOf"] = oneOf;
  exports["satisfy"] = satisfy;
  exports["string"] = string;
  exports["uncons"] = uncons;
  exports["stringLikeString"] = stringLikeString;
})(PS["Text.Parsing.Parser.String"] = PS["Text.Parsing.Parser.String"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_State = PS["Control.Monad.State"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_State_Trans = PS["Control.Monad.State.Trans"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Identity = PS["Data.Identity"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Text_Parsing_Parser = PS["Text.Parsing.Parser"];
  var Text_Parsing_Parser_Combinators = PS["Text.Parsing.Parser.Combinators"];
  var Text_Parsing_Parser_Pos = PS["Text.Parsing.Parser.Pos"];
  var Text_Parsing_Parser_String = PS["Text.Parsing.Parser.String"];
  var sourceLine = function (v) {
      return v.line;
  };
  var sourceColumn = function (v) {
      return v.column;
  };
  var setSourceLine = function (v) {
      return function (l) {
          return {
              line: l, 
              column: v.column
          };
      };
  };
  var runIndent = Data_Function.flip(Control_Monad_State.evalState)(Text_Parsing_Parser_Pos.initialPos);
  var put$prime = function (p) {
      return Control_Monad_Trans_Class.lift(Text_Parsing_Parser.monadTransParserT)(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))(Control_Monad_State_Class.put(Control_Monad_State_Trans.monadStateStateT(Data_Identity.monadIdentity))(p));
  };
  var getPosition = function (dictMonad) {
      return Control_Monad_State_Class.gets(Text_Parsing_Parser.monadStateParserT(dictMonad))(function (v) {
          return v.value1;
      });
  };
  var get$prime = Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Control_Monad_Trans_Class.lift(Text_Parsing_Parser.monadTransParserT)(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))(Control_Monad_State_Class.get(Control_Monad_State_Trans.monadStateStateT(Data_Identity.monadIdentity))))(function (v) {
      return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(v);
  });
  var withPos = function (x) {
      return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(get$prime)(function (v) {
          return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(getPosition(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(function (v1) {
              return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(put$prime(v1))(x))(function (v2) {
                  return Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(put$prime(v))(Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(v2));
              });
          });
      });
  };
  var biAp = function (f) {
      return function (c) {
          return function (v1) {
              return function (v2) {
                  return c(f(v1))(f(v2));
              };
          };
      };
  };
  var checkIndent = Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(get$prime)(function (v) {
      return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(getPosition(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(function (v1) {
          var $44 = biAp(sourceColumn)(Data_Eq.eq(Data_Eq.eqInt))(v1)(v);
          if ($44) {
              return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Unit.unit);
          };
          return Text_Parsing_Parser.fail(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))("indentation doesn't match");
      });
  });
  var block = function (p) {
      return withPos(Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_List.many(Text_Parsing_Parser.alternativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Parser.lazyParserT)(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(checkIndent)(p)))(function (v) {
          return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(v);
      }));
  };
  var indented = Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(getPosition(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(function (v) {
      return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(get$prime)(function (v1) {
          var $49 = biAp(sourceColumn)(Data_Ord.lessThanOrEq(Data_Ord.ordInt))(v)(v1);
          if ($49) {
              return Text_Parsing_Parser.fail(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))("not indented");
          };
          return Control_Bind.discard(Control_Bind.discardUnit)(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(put$prime(setSourceLine(v1)(sourceLine(v))))(function () {
              return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Unit.unit);
          });
      });
  });
  var sameLine = Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(getPosition(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(function (v) {
      return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(get$prime)(function (v1) {
          var $59 = biAp(sourceLine)(Data_Eq.eq(Data_Eq.eqInt))(v)(v1);
          if ($59) {
              return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Unit.unit);
          };
          return Text_Parsing_Parser.fail(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))("over one line");
      });
  });
  var sameOrIndented = Control_Alt.alt(Text_Parsing_Parser.altParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(sameLine)(indented);
  exports["block"] = block;
  exports["checkIndent"] = checkIndent;
  exports["indented"] = indented;
  exports["runIndent"] = runIndent;
  exports["sameLine"] = sameLine;
  exports["sameOrIndented"] = sameOrIndented;
  exports["withPos"] = withPos;
})(PS["Text.Parsing.Indent"] = PS["Text.Parsing.Indent"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Monad_State = PS["Control.Monad.State"];
  var Control_Monad_State_Trans = PS["Control.Monad.State.Trans"];
  var Data_Either = PS["Data.Either"];
  var Data_Function = PS["Data.Function"];
  var Data_Identity = PS["Data.Identity"];
  var Prelude = PS["Prelude"];
  var Text_Parsing_Indent = PS["Text.Parsing.Indent"];
  var Text_Parsing_Parser = PS["Text.Parsing.Parser"];
  var Text_Parsing_Parser_Pos = PS["Text.Parsing.Parser.Pos"];        
  var runIndentParser = function (s) {
      return function (p) {
          return Text_Parsing_Indent.runIndent(Text_Parsing_Parser.runParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))(s)(p));
      };
  };
  exports["runIndentParser"] = runIndentParser;
})(PS["Perspectives.IndentParser"] = PS["Perspectives.IndentParser"] || {});
(function(exports) {
    "use strict";

  exports.jsonStringify = function( obj )
  {
    return JSON.stringify( obj, null, 3);
  }
})(PS["Perspectives.Syntax2"] = PS["Perspectives.Syntax2"] || {});
(function(exports) {
    "use strict";
  var $foreign = PS["Perspectives.Syntax2"];
  var Data_List = PS["Data.List"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_StrMap = PS["Data.StrMap"];
  var Prelude = PS["Prelude"];        
  var $$String = (function () {
      function $$String(value0) {
          this.value0 = value0;
      };
      $$String.create = function (value0) {
          return new $$String(value0);
      };
      return $$String;
  })();
  var Int = (function () {
      function Int(value0) {
          this.value0 = value0;
      };
      Int.create = function (value0) {
          return new Int(value0);
      };
      return Int;
  })();
  var Bool = (function () {
      function Bool(value0) {
          this.value0 = value0;
      };
      Bool.create = function (value0) {
          return new Bool(value0);
      };
      return Bool;
  })();
  var TypeDeclaration = (function () {
      function TypeDeclaration(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      TypeDeclaration.create = function (value0) {
          return function (value1) {
              return new TypeDeclaration(value0, value1);
          };
      };
      return TypeDeclaration;
  })();
  var Context = (function () {
      function Context(value0) {
          this.value0 = value0;
      };
      Context.create = function (value0) {
          return new Context(value0);
      };
      return Context;
  })();
  var Rol = (function () {
      function Rol(value0) {
          this.value0 = value0;
      };
      Rol.create = function (value0) {
          return new Rol(value0);
      };
      return Rol;
  })();
  var NamedEntityCollection = (function () {
      function NamedEntityCollection(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      NamedEntityCollection.create = function (value0) {
          return function (value1) {
              return new NamedEntityCollection(value0, value1);
          };
      };
      return NamedEntityCollection;
  })();
  var showSimpleValue = new Data_Show.Show(function (v) {
      if (v instanceof $$String) {
          return Data_Show.show(Data_Show.showString)(v.value0);
      };
      if (v instanceof Int) {
          return Data_Show.show(Data_Show.showInt)(v.value0);
      };
      if (v instanceof Bool) {
          return Data_Show.show(Data_Show.showBoolean)(v.value0);
      };
      throw new Error("Failed pattern match at Perspectives.Syntax2 line 85, column 3 - line 85, column 27: " + [ v.constructor.name ]);
  });
  var showPerspectRol = new Data_Show.Show(function (v) {
      return $foreign.jsonStringify(v);
  });
  var showPerspectContext = new Data_Show.Show(function (v) {
      return $foreign.jsonStringify(v);
  });
  var showPerspectEntity = new Data_Show.Show(function (v) {
      if (v instanceof Context) {
          return Data_Show.show(showPerspectContext)(v.value0);
      };
      if (v instanceof Rol) {
          return Data_Show.show(showPerspectRol)(v.value0);
      };
      throw new Error("Failed pattern match at Perspectives.Syntax2 line 78, column 3 - line 78, column 30: " + [ v.constructor.name ]);
  });
  var showEntityCollection = new Data_Show.Show(function (v) {
      return Data_Show.show(Data_Show.showArray(showPerspectEntity))(Data_StrMap.values(v));
  });
  var showNamedEntityCollection = new Data_Show.Show(function (v) {
      return v.value0 + (": \x0a" + Data_Show.show(showEntityCollection)(v.value1));
  });
  exports["NamedEntityCollection"] = NamedEntityCollection;
  exports["Context"] = Context;
  exports["Rol"] = Rol;
  exports["String"] = $$String;
  exports["Int"] = Int;
  exports["Bool"] = Bool;
  exports["TypeDeclaration"] = TypeDeclaration;
  exports["showPerspectContext"] = showPerspectContext;
  exports["showNamedEntityCollection"] = showNamedEntityCollection;
  exports["showEntityCollection"] = showEntityCollection;
  exports["showPerspectEntity"] = showPerspectEntity;
  exports["showPerspectRol"] = showPerspectRol;
  exports["showSimpleValue"] = showSimpleValue;
})(PS["Perspectives.Syntax2"] = PS["Perspectives.Syntax2"] || {});
(function(exports) {
  // Generated by purs version 0.11.4
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad_State = PS["Control.Monad.State"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Array = PS["Data.Array"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Char = PS["Data.Char"];
  var Data_Char_Unicode = PS["Data.Char.Unicode"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Int = PS["Data.Int"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_String = PS["Data.String"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Data_Unit = PS["Data.Unit"];
  var $$Math = PS["Math"];
  var Prelude = PS["Prelude"];
  var Text_Parsing_Parser = PS["Text.Parsing.Parser"];
  var Text_Parsing_Parser_Combinators = PS["Text.Parsing.Parser.Combinators"];
  var Text_Parsing_Parser_Pos = PS["Text.Parsing.Parser.Pos"];
  var Text_Parsing_Parser_String = PS["Text.Parsing.Parser.String"];
  var upper = function (dictMonad) {
      return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Text_Parsing_Parser_String.satisfy(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(Data_Char_Unicode.isUpper))("uppercase letter");
  };
  var theReservedNames = function (dictMonad) {
      return function (v) {
          if (v.caseSensitive) {
              return Data_Array.sort(Data_Ord.ordString)(v.reservedNames);
          };
          if (Data_Boolean.otherwise) {
              return Data_Array.sort(Data_Ord.ordString)(Data_Functor.map(Data_Functor.functorArray)(Data_String.toLower)(v.reservedNames));
          };
          throw new Error("Failed pattern match at Text.Parsing.Parser.Token line 717, column 1 - line 719, column 85: " + [ v.constructor.name ]);
      };
  };
  var space = function (dictMonad) {
      return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Text_Parsing_Parser_String.satisfy(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(Data_Char_Unicode.isSpace))("space");
  };
  var simpleSpace = function (dictMonad) {
      return Text_Parsing_Parser_Combinators.skipMany1(dictMonad)(Text_Parsing_Parser_String.satisfy(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(Data_Char_Unicode.isSpace));
  };
  var oneLineComment = function (dictMonad) {
      return function (v) {
          return Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_Combinators["try"](dictMonad)(Text_Parsing_Parser_String.string(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(v.commentLine)))(Text_Parsing_Parser_Combinators.skipMany(dictMonad)(Text_Parsing_Parser_String.satisfy(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(function (v1) {
              return v1 !== "\x0a";
          })));
      };
  };
  var octDigit = function (dictMonad) {
      return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Text_Parsing_Parser_String.satisfy(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(Data_Char_Unicode.isOctDigit))("oct digit");
  };
  var letter = function (dictMonad) {
      return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Text_Parsing_Parser_String.satisfy(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(Data_Char_Unicode.isAlpha))("letter");
  };
  var isReserved = function (__copy_names) {
      return function (__copy_name) {
          var __tco_names = __copy_names;
          var __tco_done = false;
          var __tco_result;
          function __tco_loop(names, name) {
              var v = Data_Array.uncons(names);
              if (v instanceof Data_Maybe.Nothing) {
                  __tco_done = true;
                  return false;
              };
              if (v instanceof Data_Maybe.Just) {
                  var v1 = Data_Ord.compare(Data_Ord.ordString)(v.value0.head)(name);
                  if (v1 instanceof Data_Ordering.LT) {
                      __tco_names = v.value0.tail;
                      __copy_name = name;
                      return;
                  };
                  if (v1 instanceof Data_Ordering.EQ) {
                      __tco_done = true;
                      return true;
                  };
                  if (v1 instanceof Data_Ordering.GT) {
                      __tco_done = true;
                      return false;
                  };
                  throw new Error("Failed pattern match at Text.Parsing.Parser.Token line 711, column 39 - line 714, column 53: " + [ v1.constructor.name ]);
              };
              throw new Error("Failed pattern match at Text.Parsing.Parser.Token line 709, column 5 - line 714, column 53: " + [ v.constructor.name ]);
          };
          while (!__tco_done) {
              __tco_result = __tco_loop(__tco_names, __copy_name);
          };
          return __tco_result;
      };
  };
  var isReservedName = function (dictMonad) {
      return function (v) {
          return function (name) {
              var caseName = (function () {
                  if (v.caseSensitive) {
                      return name;
                  };
                  if (Data_Boolean.otherwise) {
                      return Data_String.toLower(name);
                  };
                  throw new Error("Failed pattern match at Text.Parsing.Parser.Token line 704, column 5 - line 705, column 57: " + [  ]);
              })();
              return isReserved(theReservedNames(dictMonad)(v))(caseName);
          };
      };
  };
  var inCommentSingle = function (dictMonad) {
      return function (v) {
          var startEnd = Data_Semigroup.append(Data_Semigroup.semigroupArray)(Data_String.toCharArray(v.commentEnd))(Data_String.toCharArray(v.commentStart));
          return Control_Lazy.fix(Text_Parsing_Parser.lazyParserT)(function (p) {
              return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Data_Functor["void"](Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(Text_Parsing_Parser_Combinators["try"](dictMonad)(Text_Parsing_Parser_String.string(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(v.commentEnd))))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_Combinators.skipMany1(dictMonad)(Text_Parsing_Parser_String.noneOf(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(startEnd)))(p)))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_String.oneOf(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(startEnd))(p)))("end of comment");
          });
      };
  };
  var multiLineComment = function (dictMonad) {
      return function (v) {
          return Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_Combinators["try"](dictMonad)(Text_Parsing_Parser_String.string(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(v.commentStart)))(inComment(dictMonad)(v));
      };
  };
  var inCommentMulti = function (dictMonad) {
      return function (v) {
          var startEnd = Data_Semigroup.append(Data_Semigroup.semigroupArray)(Data_String.toCharArray(v.commentEnd))(Data_String.toCharArray(v.commentStart));
          return Control_Lazy.fix(Text_Parsing_Parser.lazyParserT)(function (p) {
              return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Data_Functor["void"](Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(Text_Parsing_Parser_Combinators["try"](dictMonad)(Text_Parsing_Parser_String.string(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(v.commentEnd))))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(multiLineComment(dictMonad)(v))(p)))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_Combinators.skipMany1(dictMonad)(Text_Parsing_Parser_String.noneOf(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(startEnd)))(p)))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_String.oneOf(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(startEnd))(p)))("end of comment");
          });
      };
  };
  var inComment = function (dictMonad) {
      return function (v) {
          if (v.nestedComments) {
              return inCommentMulti(dictMonad)(v);
          };
          return inCommentSingle(dictMonad)(v);
      };
  };
  var whiteSpace$prime = function (dictMonad) {
      return function (v) {
          if (Data_String["null"](v.commentLine) && Data_String["null"](v.commentStart)) {
              return Text_Parsing_Parser_Combinators.skipMany(dictMonad)(Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(simpleSpace(dictMonad))(""));
          };
          if (Data_String["null"](v.commentLine)) {
              return Text_Parsing_Parser_Combinators.skipMany(dictMonad)(Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(simpleSpace(dictMonad))(multiLineComment(dictMonad)(v)))(""));
          };
          if (Data_String["null"](v.commentStart)) {
              return Text_Parsing_Parser_Combinators.skipMany(dictMonad)(Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(simpleSpace(dictMonad))(oneLineComment(dictMonad)(v)))(""));
          };
          if (Data_Boolean.otherwise) {
              return Text_Parsing_Parser_Combinators.skipMany(dictMonad)(Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(simpleSpace(dictMonad))(oneLineComment(dictMonad)(v)))(multiLineComment(dictMonad)(v)))(""));
          };
          throw new Error("Failed pattern match at Text.Parsing.Parser.Token line 726, column 1 - line 734, column 94: " + [ v.constructor.name ]);
      };
  };
  var hexDigit = function (dictMonad) {
      return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Text_Parsing_Parser_String.satisfy(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(Data_Char_Unicode.isHexDigit))("hex digit");
  };
  var digit = function (dictMonad) {
      return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Text_Parsing_Parser_String.satisfy(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(Data_Char_Unicode.isDigit))("digit");
  };
  var makeTokenParser = function (dictMonad) {
      return function (v) {
          var stringLetter = Text_Parsing_Parser_String.satisfy(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(function (c) {
              return c !== "\"" && (c !== "\\" && c > "\x1a");
          });
          var sign = function (dictRing) {
              return Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Data_Functor.voidLeft(Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("-"))(Data_Ring.negate(dictRing)))(Data_Functor.voidLeft(Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("+"))(Control_Category.id(Control_Category.categoryFn))))(Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(Control_Category.id(Control_Category.categoryFn)));
          };
          var oper = (function () {
              var go = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(v.opStart)(function (v1) {
                  return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Data_Array.many(Text_Parsing_Parser.alternativeParserT(dictMonad))(Text_Parsing_Parser.lazyParserT)(v.opLetter))(function (v2) {
                      return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(Data_String.singleton(v1) + Data_String.fromCharArray(v2));
                  });
              });
              return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(go)("operator");
          })();
          var number = function (base) {
              return function (baseDigit) {
                  var folder = function (v1) {
                      return function (v2) {
                          if (v1 instanceof Data_Maybe.Nothing) {
                              return Data_Maybe.Nothing.value;
                          };
                          if (v1 instanceof Data_Maybe.Just) {
                              return Data_Functor.map(Data_Maybe.functorMaybe)(function (v3) {
                                  return (base * v1.value0 | 0) + v3 | 0;
                              })(Data_Char_Unicode.digitToInt(v2));
                          };
                          throw new Error("Failed pattern match at Text.Parsing.Parser.Token line 595, column 9 - line 595, column 35: " + [ v1.constructor.name, v2.constructor.name ]);
                      };
                  };
                  return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Data_Array.some(Text_Parsing_Parser.alternativeParserT(dictMonad))(Text_Parsing_Parser.lazyParserT)(baseDigit))(function (v1) {
                      return Data_Maybe.maybe(Text_Parsing_Parser.fail(dictMonad)("not digits"))(Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad)))(Data_Foldable.foldl(Data_Foldable.foldableArray)(folder)(new Data_Maybe.Just(0))(v1));
                  });
              };
          };
          var octal = Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_String.oneOf(Text_Parsing_Parser_String.stringLikeString)(dictMonad)([ "o", "O" ]))(number(8)(octDigit(dictMonad)));
          var lexeme = function (p) {
              return Control_Apply.applyFirst(Text_Parsing_Parser.applyParserT(dictMonad))(p)(whiteSpace$prime(dictMonad)(v));
          };
          var reservedOp = function (name) {
              var go = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Text_Parsing_Parser_String.string(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(name))(function (v1) {
                  return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Text_Parsing_Parser_Combinators.notFollowedBy(dictMonad)(v.opLetter))("end of " + name);
              });
              return lexeme(Text_Parsing_Parser_Combinators["try"](dictMonad)(go));
          };
          var symbol = function (name) {
              return Data_Functor.voidLeft(Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(lexeme(Text_Parsing_Parser_String.string(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(name)))(name);
          };
          var parens = function (p) {
              return Text_Parsing_Parser_Combinators.between(dictMonad)(symbol("("))(symbol(")"))(p);
          };
          var semi = symbol(";");
          var semiSep = function (p) {
              return Text_Parsing_Parser_Combinators.sepBy(dictMonad)(p)(semi);
          };
          var semiSep1 = function (p) {
              return Text_Parsing_Parser_Combinators.sepBy1(dictMonad)(p)(semi);
          };
          var isReservedOp = function (name) {
              return isReserved(Data_Array.sort(Data_Ord.ordString)(v.reservedOpNames))(name);
          };
          var operator = (function () {
              var go = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(oper)(function (v1) {
                  var $113 = isReservedOp(v1);
                  if ($113) {
                      return Text_Parsing_Parser.fail(dictMonad)("reserved operator " + v1);
                  };
                  return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(v1);
              });
              return lexeme(Text_Parsing_Parser_Combinators["try"](dictMonad)(go));
          })();
          var ident = (function () {
              var go = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(v.identStart)(function (v1) {
                  return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Data_Array.many(Text_Parsing_Parser.alternativeParserT(dictMonad))(Text_Parsing_Parser.lazyParserT)(v.identLetter))(function (v2) {
                      return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(Data_String.singleton(v1) + Data_String.fromCharArray(v2));
                  });
              });
              return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(go)("identifier");
          })();
          var identifier = (function () {
              var go = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(ident)(function (v1) {
                  var $117 = isReservedName(dictMonad)(v)(v1);
                  if ($117) {
                      return Text_Parsing_Parser.fail(dictMonad)("reserved word " + Data_Show.show(Data_Show.showString)(v1));
                  };
                  return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(v1);
              });
              return lexeme(Text_Parsing_Parser_Combinators["try"](dictMonad)(go));
          })();
          var hexadecimal = Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_String.oneOf(Text_Parsing_Parser_String.stringLikeString)(dictMonad)([ "x", "X" ]))(number(16)(hexDigit(dictMonad)));
          var fraction = (function () {
              var op = function (v1) {
                  return function (v2) {
                      if (v2 instanceof Data_Maybe.Nothing) {
                          return Data_Maybe.Nothing.value;
                      };
                      if (v2 instanceof Data_Maybe.Just) {
                          return Control_Bind.bind(Data_Maybe.bindMaybe)(Data_Char_Unicode.digitToInt(v1))(function (v3) {
                              return Control_Applicative.pure(Data_Maybe.applicativeMaybe)((v2.value0 + Data_Int.toNumber(v3)) / 10.0);
                          });
                      };
                      throw new Error("Failed pattern match at Text.Parsing.Parser.Token line 545, column 9 - line 545, column 32: " + [ v1.constructor.name, v2.constructor.name ]);
                  };
              };
              return Text_Parsing_Parser_Combinators.asErrorMessage(dictMonad)("fraction")(Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("."))(function (v1) {
                  return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Data_Array.some(Text_Parsing_Parser.alternativeParserT(dictMonad))(Text_Parsing_Parser.lazyParserT)(digit(dictMonad)))("fraction"))(function (v2) {
                      return Data_Maybe.maybe(Text_Parsing_Parser.fail(dictMonad)("not digit"))(Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad)))(Data_Foldable.foldr(Data_Foldable.foldableArray)(op)(new Data_Maybe.Just(0.0))(v2));
                  });
              }));
          })();
          var escapeGap = Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Data_Array.some(Text_Parsing_Parser.alternativeParserT(dictMonad))(Text_Parsing_Parser.lazyParserT)(space(dictMonad)))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("\\")))("end of string gap");
          var escapeEmpty = Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("&");
          var escMap = Data_Array.zip([ "a", "b", "f", "n", "r", "t", "v", "\\", "\"", "'" ])([ "\x07", "\x08", "\x0c", "\x0a", "\x0d", "\x09", "\x0b", "\\", "\"", "'" ]);
          var dot = symbol(".");
          var decimal = number(10)(digit(dictMonad));
          var exponent$prime = (function () {
              var power = function (e) {
                  if (e < 0) {
                      return 1.0 / power(-e | 0);
                  };
                  if (Data_Boolean.otherwise) {
                      return $$Math.pow(10.0)(Data_Int.toNumber(e));
                  };
                  throw new Error("Failed pattern match at Text.Parsing.Parser.Token line 558, column 9 - line 559, column 53: " + [ e.constructor.name ]);
              };
              return Text_Parsing_Parser_Combinators.asErrorMessage(dictMonad)("exponent")(Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Text_Parsing_Parser_String.oneOf(Text_Parsing_Parser_String.stringLikeString)(dictMonad)([ "e", "E" ]))(function (v1) {
                  return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(sign(Data_Ring.ringInt))(function (v2) {
                      return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(decimal)("exponent"))(function (v3) {
                          return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(power(v2(v3)));
                      });
                  });
              }));
          })();
          var fractExponent = function (n) {
              var justExponent = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(exponent$prime)(function (v1) {
                  return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(Data_Int.toNumber(n) * v1);
              });
              var fractExponent$prime = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(fraction)(function (v1) {
                  return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Text_Parsing_Parser_Combinators.option(dictMonad)(1.0)(exponent$prime))(function (v2) {
                      return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))((Data_Int.toNumber(n) + v1) * v2);
                  });
              });
              return Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(fractExponent$prime)(justExponent);
          };
          var fractFloat = function (n) {
              return Data_Functor.map(Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(Data_Either.Right.create)(fractExponent(n));
          };
          var decimalFloat = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(decimal)(function (v1) {
              return Text_Parsing_Parser_Combinators.option(dictMonad)(new Data_Either.Left(v1))(fractFloat(v1));
          });
          var zeroNumFloat = Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Data_Functor.map(Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(Data_Either.Left.create)(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(hexadecimal)(octal)))(decimalFloat))(fractFloat(0)))(Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(new Data_Either.Left(0)));
          var natFloat = Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("0"))(zeroNumFloat))(decimalFloat);
          var naturalOrFloat = Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(lexeme(natFloat))("number");
          var floating = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(decimal)(fractExponent);
          var $$float = Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(lexeme(floating))("float");
          var zeroNumber = Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("0"))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(hexadecimal)(octal))(decimal))(Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(0))))("");
          var nat = Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(zeroNumber)(decimal);
          var $$int = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(lexeme(sign(Data_Ring.ringInt)))(function (v1) {
              return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(nat)(function (v2) {
                  return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(v1(v2));
              });
          });
          var integer = Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(lexeme($$int))("integer");
          var natural = Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(lexeme(nat))("natural");
          var comma = symbol(",");
          var commaSep = function (p) {
              return Text_Parsing_Parser_Combinators.sepBy(dictMonad)(p)(comma);
          };
          var commaSep1 = function (p) {
              return Text_Parsing_Parser_Combinators.sepBy1(dictMonad)(p)(comma);
          };
          var colon = symbol(":");
          var charNum = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(decimal)(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("o"))(number(8)(octDigit(dictMonad)))))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("x"))(number(16)(hexDigit(dictMonad)))))(function (v1) {
              var $133 = v1 > 1114111;
              if ($133) {
                  return Text_Parsing_Parser.fail(dictMonad)("invalid escape sequence");
              };
              return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(Data_Char.fromCharCode(v1));
          });
          var charLetter = Text_Parsing_Parser_String.satisfy(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(function (c) {
              return c !== "'" && (c !== "\\" && c > "\x1a");
          });
          var charEsc = (function () {
              var parseEsc = function (v1) {
                  return Data_Functor.voidLeft(Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)(v1.value0))(v1.value1);
              };
              return Text_Parsing_Parser_Combinators.choice(Data_Foldable.foldableArray)(dictMonad)(Data_Functor.map(Data_Functor.functorArray)(parseEsc)(escMap));
          })();
          var charControl = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("^"))(function (v1) {
              return Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(upper(dictMonad))(function (v2) {
                  return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(Data_Char.fromCharCode((Data_Char.toCharCode(v2) - Data_Char.toCharCode("A") | 0) + 1 | 0));
              });
          });
          var caseString = function (name) {
              if (v.caseSensitive) {
                  return Data_Functor.voidLeft(Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(Text_Parsing_Parser_String.string(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(name))(name);
              };
              if (Data_Boolean.otherwise) {
                  var msg = Data_Show.show(Data_Show.showString)(name);
                  var caseChar = function (c) {
                      if (Data_Char_Unicode.isAlpha(c)) {
                          return Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)(Data_Char_Unicode.toLower(c)))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)(Data_Char_Unicode.toUpper(c)));
                      };
                      if (Data_Boolean.otherwise) {
                          return Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)(c);
                      };
                      throw new Error("Failed pattern match at Text.Parsing.Parser.Token line 653, column 9 - line 654, column 40: " + [ c.constructor.name ]);
                  };
                  var walk = function (name$prime) {
                      var v1 = Data_String.uncons(name$prime);
                      if (v1 instanceof Data_Maybe.Nothing) {
                          return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(Data_Unit.unit);
                      };
                      if (v1 instanceof Data_Maybe.Just) {
                          return Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(caseChar(v1.value0.head))(msg))(walk(v1.value0.tail));
                      };
                      throw new Error("Failed pattern match at Text.Parsing.Parser.Token line 648, column 22 - line 650, column 86: " + [ v1.constructor.name ]);
                  };
                  return Data_Functor.voidLeft(Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(walk(name))(name);
              };
              throw new Error("Failed pattern match at Text.Parsing.Parser.Token line 644, column 5 - line 657, column 24: " + [ name.constructor.name ]);
          };
          var reserved = function (name) {
              var go = Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(caseString(name))(Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Text_Parsing_Parser_Combinators.notFollowedBy(dictMonad)(v.identLetter))("end of " + name));
              return lexeme(Text_Parsing_Parser_Combinators["try"](dictMonad)(go));
          };
          var brackets = function (p) {
              return Text_Parsing_Parser_Combinators.between(dictMonad)(symbol("["))(symbol("]"))(p);
          };
          var braces = function (p) {
              return Text_Parsing_Parser_Combinators.between(dictMonad)(symbol("{"))(symbol("}"))(p);
          };
          var ascii3codes = [ "NUL", "SOH", "STX", "ETX", "EOT", "ENQ", "ACK", "BEL", "DLE", "DC1", "DC2", "DC3", "DC4", "NAK", "SYN", "ETB", "CAN", "SUB", "ESC", "DEL" ];
          var ascii3 = [ "\x00", "\x01", "\x02", "\x03", "\x04", "\x05", "\x06", "\x07", "\x10", "\x11", "\x12", "\x13", "\x14", "\x15", "\x16", "\x17", "\x18", "\x1a", "\x1b", "\x7f" ];
          var ascii2codes = [ "BS", "HT", "LF", "VT", "FF", "CR", "SO", "SI", "EM", "FS", "GS", "RS", "US", "SP" ];
          var ascii2 = [ "\x08", "\x09", "\x0a", "\x0b", "\x0c", "\x0d", "\x0e", "\x0f", "\x19", "\x1c", "\x1d", "\x1e", "\x1f", " " ];
          var asciiMap = Data_Array.zip(Data_Semigroup.append(Data_Semigroup.semigroupArray)(ascii3codes)(ascii2codes))(Data_Semigroup.append(Data_Semigroup.semigroupArray)(ascii3)(ascii2));
          var charAscii = (function () {
              var parseAscii = function (v1) {
                  return Text_Parsing_Parser_Combinators["try"](dictMonad)(Data_Functor.voidLeft(Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(Text_Parsing_Parser_String.string(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(v1.value0))(v1.value1));
              };
              return Text_Parsing_Parser_Combinators.choice(Data_Foldable.foldableArray)(dictMonad)(Data_Functor.map(Data_Functor.functorArray)(parseAscii)(asciiMap));
          })();
          var escapeCode = Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(charEsc)(charNum))(charAscii))(charControl))("escape code");
          var charEscape = Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(dictMonad))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("\\"))(escapeCode);
          var characterChar = Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(charLetter)(charEscape))("literal character");
          var charLiteral = (function () {
              var go = Text_Parsing_Parser_Combinators.between(dictMonad)(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("'"))(Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("'"))("end of character"))(characterChar);
              return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(lexeme(go))("character");
          })();
          var stringEscape = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("\\"))(function (v1) {
              return Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Data_Functor.voidLeft(Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(escapeGap)(Data_Maybe.Nothing.value))(Data_Functor.voidLeft(Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(escapeEmpty)(Data_Maybe.Nothing.value)))(Data_Functor.map(Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(Data_Maybe.Just.create)(escapeCode));
          });
          var stringChar = Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Control_Alt.alt(Text_Parsing_Parser.altParserT(dictMonad))(Data_Functor.map(Text_Parsing_Parser.functorParserT(((dictMonad.Bind1()).Apply0()).Functor0()))(Data_Maybe.Just.create)(stringLetter))(stringEscape))("string character");
          var stringLiteral = (function () {
              var folder = function (v1) {
                  return function (chars) {
                      if (v1 instanceof Data_Maybe.Nothing) {
                          return chars;
                      };
                      if (v1 instanceof Data_Maybe.Just) {
                          return new Data_List_Types.Cons(v1.value0, chars);
                      };
                      throw new Error("Failed pattern match at Text.Parsing.Parser.Token line 403, column 9 - line 403, column 37: " + [ v1.constructor.name, chars.constructor.name ]);
                  };
              };
              var go = Control_Bind.bind(Text_Parsing_Parser.bindParserT(dictMonad))(Text_Parsing_Parser_Combinators.between(dictMonad)(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("\""))(Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(dictMonad)("\""))("end of string"))(Data_List.many(Text_Parsing_Parser.alternativeParserT(dictMonad))(Text_Parsing_Parser.lazyParserT)(stringChar)))(function (v1) {
                  return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(dictMonad))(Data_String.fromCharArray(Data_List.toUnfoldable(Data_Unfoldable.unfoldableArray)(Data_Foldable.foldr(Data_List_Types.foldableList)(folder)(Data_List_Types.Nil.value)(v1))));
              });
              return lexeme(Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(go)("literal string"));
          })();
          var angles = function (p) {
              return Text_Parsing_Parser_Combinators.between(dictMonad)(symbol("<"))(symbol(">"))(p);
          };
          return {
              identifier: identifier, 
              reserved: reserved, 
              operator: operator, 
              reservedOp: reservedOp, 
              charLiteral: charLiteral, 
              stringLiteral: stringLiteral, 
              natural: natural, 
              integer: integer, 
              "float": $$float, 
              naturalOrFloat: naturalOrFloat, 
              decimal: decimal, 
              hexadecimal: hexadecimal, 
              octal: octal, 
              symbol: symbol, 
              lexeme: lexeme, 
              whiteSpace: whiteSpace$prime(dictMonad)(v), 
              parens: parens, 
              braces: braces, 
              angles: angles, 
              brackets: brackets, 
              semi: semi, 
              comma: comma, 
              colon: colon, 
              dot: dot, 
              semiSep: semiSep, 
              semiSep1: semiSep1, 
              commaSep: commaSep, 
              commaSep1: commaSep1
          };
      };
  };
  var alphaNum = function (dictMonad) {
      return Text_Parsing_Parser_Combinators.withErrorMessage(dictMonad)(Text_Parsing_Parser_String.satisfy(Text_Parsing_Parser_String.stringLikeString)(dictMonad)(Data_Char_Unicode.isAlphaNum))("letter or digit");
  };
  exports["alphaNum"] = alphaNum;
  exports["digit"] = digit;
  exports["hexDigit"] = hexDigit;
  exports["letter"] = letter;
  exports["makeTokenParser"] = makeTokenParser;
  exports["octDigit"] = octDigit;
  exports["space"] = space;
  exports["upper"] = upper;
})(PS["Text.Parsing.Parser.Token"] = PS["Text.Parsing.Parser.Token"] || {});
(function(exports) {
    "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_State = PS["Control.Monad.State"];
  var Control_Monad_State_Trans = PS["Control.Monad.State.Trans"];
  var Data_Identity = PS["Data.Identity"];
  var Text_Parsing_Parser = PS["Text.Parsing.Parser"];
  var Text_Parsing_Parser_Pos = PS["Text.Parsing.Parser.Pos"];
  var Text_Parsing_Parser_String = PS["Text.Parsing.Parser.String"];
  var Text_Parsing_Parser_Token = PS["Text.Parsing.Parser.Token"];        

  // perspectDef = LanguageDef (unGenLanguageDef haskellStyle)

  //                 { reservedOpNames = ["=", "=>"]

  //                 , reservedNames   = [ "private","public"]

  //                 }
  var perspectDef = (function () {
      var op$prime = function (dictMonad) {
          return Text_Parsing_Parser_String.oneOf(Text_Parsing_Parser_String.stringLikeString)(dictMonad)([ ":", "!", "#", "$", "%", "&", "*", "+", ".", "/", "<", "=", ">", "?", "@", "\\", "^", "|", "-", "~" ]);
      };
      return {
          commentStart: "{-", 
          commentEnd: "-}", 
          commentLine: "--", 
          nestedComments: true, 
          identStart: Control_Alt.alt(Text_Parsing_Parser.altParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Parser_Token.letter(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))(":")), 
          identLetter: Control_Alt.alt(Text_Parsing_Parser.altParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Parser_Token.alphaNum(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Parser_String.oneOf(Text_Parsing_Parser_String.stringLikeString)(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))([ "_", "'" ])), 
          opStart: op$prime(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)), 
          opLetter: op$prime(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)), 
          reservedOpNames: [ "=", "=>" ], 
          reservedNames: [ "private", "public", "property", "DEF" ], 
          caseSensitive: true
      };
  })();
  var token = Text_Parsing_Parser_Token.makeTokenParser(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))(perspectDef);
  exports["perspectDef"] = perspectDef;
  exports["token"] = token;
})(PS["Perspectives.Token"] = PS["Perspectives.Token"] || {});
(function(exports) {
    "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_State_Trans = PS["Control.Monad.State.Trans"];
  var Data_Array = PS["Data.Array"];
  var Data_Char_Unicode = PS["Data.Char.Unicode"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Identity = PS["Data.Identity"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_String = PS["Data.String"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Perspectives_Guid = PS["Perspectives.Guid"];
  var Perspectives_IndentParser = PS["Perspectives.IndentParser"];
  var Perspectives_Syntax2 = PS["Perspectives.Syntax2"];
  var Perspectives_Token = PS["Perspectives.Token"];
  var Prelude = PS["Prelude"];
  var Text_Parsing_Indent = PS["Text.Parsing.Indent"];
  var Text_Parsing_Parser = PS["Text.Parsing.Parser"];
  var Text_Parsing_Parser_Combinators = PS["Text.Parsing.Parser.Combinators"];
  var Text_Parsing_Parser_String = PS["Text.Parsing.Parser.String"];
  var Text_Parsing_Parser_Token = PS["Text.Parsing.Parser.Token"];
  var string = Data_Functor.map(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(Perspectives_Syntax2["String"].create)(Perspectives_Token.token.stringLiteral);

  //---------------------------------------------------------

  // Lexemes

  //---------------------------------------------------------
  var reservedOp = Perspectives_Token.token.reservedOp;
  var reserved = Perspectives_Token.token.reserved;
  var lower = Text_Parsing_Parser_Combinators.withErrorMessage(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))(Text_Parsing_Parser_String.satisfy(Text_Parsing_Parser_String.stringLikeString)(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))(Data_Char_Unicode.isLower))("uppercase letter");

  // prefix = lower* ':'
  var prefix = (function () {
      var f = function (ca) {
          return function (c) {
              return Data_String.fromCharArray(Data_Array.snoc(ca)(c));
          };
      };
      return Control_Apply.apply(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Functor.map(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(f)(Data_Array.many(Text_Parsing_Parser.alternativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Parser.lazyParserT)(lower)))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))(":"));
  })();
  var lexeme = Perspectives_Token.token.lexeme;
  var $$int = Data_Functor.map(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(Perspectives_Syntax2.Int.create)(Perspectives_Token.token.integer);
  var identifier = Perspectives_Token.token.identifier;
  var identLetter = Control_Alt.alt(Text_Parsing_Parser.altParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Parser_Token.alphaNum(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Parser_String.oneOf(Text_Parsing_Parser_String.stringLikeString)(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))([ "_", "'" ]));

  // /([a-z]\w*\b)/

  // /(\b\p{Lowercase}[\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]+\b)/gu
  var uncapitalizedString = (function () {
      var f = function (c) {
          return function (ca) {
              return Data_String.fromCharArray(Data_Array.cons(c)(ca));
          };
      };
      return Control_Apply.apply(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Functor.map(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(f)(lower))(Data_Array.many(Text_Parsing_Parser.alternativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Parser.lazyParserT)(identLetter));
  })();

  // localPropertyName = lower alphaNum*
  var localPropertyName = uncapitalizedString;

  // prefixedPropertyName = prefix localPropertyName
  var prefixedPropertyName = lexeme(Control_Apply.apply(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Functor.map(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(Data_Semigroup.append(Data_Semigroup.semigroupString))(prefix))(localPropertyName));

  //---------------------------------------------------------

  // Datatypes

  //---------------------------------------------------------
  var dataTypes = [ "Number", "String", "Bool", "Date" ];
  var dataType = Text_Parsing_Parser_Combinators["try"](Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))(Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(identifier)(function (v) {
      var $22 = Data_Foldable.elem(Data_Foldable.foldableArray)(Data_Eq.eqString)(v)(dataTypes);
      if ($22) {
          return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(new Perspectives_Syntax2["String"](v));
      };
      return Text_Parsing_Parser.fail(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))("Expected one of 'Number', 'String', 'Bool' or 'Date'.");
  }));

  // /([A-Z]\w*\b)/

  // /(\p{Uppercase}[\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]+)/gu
  var capitalizedString = (function () {
      var f = function (c) {
          return function (ca) {
              return Data_String.fromCharArray(Data_Array.cons(c)(ca));
          };
      };
      return Control_Apply.apply(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Functor.map(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(f)(Text_Parsing_Parser_Token.upper(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))))(Data_Array.many(Text_Parsing_Parser.alternativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Parser.lazyParserT)(identLetter));
  })();

  // domeinName = 'model:' upper alphaNum* '#'
  var domeinName = Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Parser_String.string(Text_Parsing_Parser_String.stringLikeString)(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))("model:"))(function (v) {
      return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(capitalizedString)(function (v1) {
          return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Parser_String["char"](Text_Parsing_Parser_String.stringLikeString)(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))("#"))(function (v2) {
              return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))("model:" + (v1 + "#"));
          });
      });
  });

  // qualifiedPropertyName = domeinName localPropertyName
  var qualifiedPropertyName = lexeme(Control_Apply.apply(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Functor.map(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(Data_Semigroup.append(Data_Semigroup.semigroupString))(domeinName))(localPropertyName));

  // propertyName = prefixedPropertyName | qualifiedPropertyName
  var propertyName = Control_Alt.alt(Text_Parsing_Parser.altParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(qualifiedPropertyName)(prefixedPropertyName);
  var roleName = propertyName;

  // localResourceName = upper alphaNum*
  var localResourceName = capitalizedString;

  // prefixedResourceName = prefix localResourceName
  var prefixedResourceName = lexeme(Control_Apply.apply(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Functor.map(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(Data_Semigroup.append(Data_Semigroup.semigroupString))(prefix))(localResourceName));

  // qualifiedResourceName = domeinName localResourceName
  var qualifiedResourceName = lexeme(Control_Apply.apply(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Functor.map(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(Data_Semigroup.append(Data_Semigroup.semigroupString))(domeinName))(localResourceName));

  // resourceName = prefixedResourceName | qualifiedResourceName
  var resourceName = Control_Alt.alt(Text_Parsing_Parser.altParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(qualifiedResourceName)(prefixedResourceName);

  //---------------------------------------------------------

  // Elementary expression types

  //---------------------------------------------------------

  // | typeDeclaration = resourceName resourceName
  var typeDeclaration = Control_Apply.apply(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Functor.map(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(Perspectives_Syntax2.TypeDeclaration.create)(resourceName))(resourceName);
  var bool = Control_Alt.alt(Text_Parsing_Parser.altParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Functor.voidLeft(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(reserved("true"))(new Perspectives_Syntax2.Bool(true)))(Data_Functor.voidLeft(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(reserved("false"))(new Perspectives_Syntax2.Bool(false)));
  var simpleValue = Control_Alt.alt(Text_Parsing_Parser.altParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Control_Alt.alt(Text_Parsing_Parser.altParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(string)($$int))(bool);

  // | rolePropertyAssignment = propertyName '=' simpleValue
  var rolePropertyAssignment = Text_Parsing_Indent.withPos(Control_Apply.apply(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Control_Apply.applyFirst(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Functor.map(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(function (pn) {
      return function (pv) {
          return new Data_Tuple.Tuple(pn, [ Data_Show.show(Perspectives_Syntax2.showSimpleValue)(pv) ]);
      };
  })(propertyName))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.sameOrIndented)(reservedOp("="))))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.sameOrIndented)(Control_Alt.alt(Text_Parsing_Parser.altParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(simpleValue)(dataType))));

  // | role = typeDeclaration

  // | rolePropertyAssignment*

  // | query?

  // TODO: query

  // TODO: moet er geen binding bij?
  var role = Text_Parsing_Indent.withPos(Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(typeDeclaration)(function (v) {
      return Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.indented)(Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.block(rolePropertyAssignment))(function (v1) {
          return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(new Perspectives_Syntax2.NamedEntityCollection(v.value1, Data_StrMap.singleton(v.value1)(new Perspectives_Syntax2.Rol({
              id: v.value1, 
              pspType: v.value0, 
              binding: Data_Maybe.Nothing.value, 
              context: v.value1, 
              properties: Data_StrMap.fromFoldable(Data_List_Types.foldableList)(v1), 
              gevuldeRollen: Data_StrMap.empty
          }))));
      }));
  }));
  var typedPropertyAssignment = function (scope) {
      return Text_Parsing_Indent.withPos(Control_Apply.apply(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Control_Apply.applyFirst(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Data_Functor.map(Text_Parsing_Parser.functorParserT(Control_Monad_State_Trans.functorStateT(Data_Identity.functorIdentity)))(function (pn) {
          return function (pv) {
              return new Data_Tuple.Tuple(pn, [ Data_Show.show(Perspectives_Syntax2.showSimpleValue)(pv) ]);
          };
      })(identifier))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.sameOrIndented)(reservedOp("="))))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.sameOrIndented)(Control_Alt.alt(Text_Parsing_Parser.altParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(simpleValue)(dataType))));
  };

  // | privateContextPropertyAssignment = 'private' propertyName '=' simpleValue
  var privateContextPropertyAssignment = Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(reserved("private"))(typedPropertyAssignment("private"));

  // | publicContextPropertyAssignment = 'public' propertyName '=' simpleValue
  var publicContextPropertyAssignment = Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(reserved("public"))(typedPropertyAssignment("public"));
  var roleBinding = function (contextID) {
      return Text_Parsing_Indent.withPos(Control_Alt.alt(Text_Parsing_Parser.altParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Parser_Combinators["try"](Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))(Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Control_Apply.applyFirst(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(roleName)(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.sameOrIndented)(reservedOp("=>"))))(function (v) {
          return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.indented)(Control_Alt.alt(Text_Parsing_Parser.altParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(context)(role)))(function (v1) {
              return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.indented)(Text_Parsing_Indent.block(rolePropertyAssignment)))(function (v2) {
                  return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Perspectives_Guid.guid(Data_Unit.unit)))(function (v3) {
                      return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(new Perspectives_Syntax2.NamedEntityCollection(v3, Data_StrMap.insert(v3)(new Perspectives_Syntax2.Rol({
                          id: v3, 
                          pspType: v, 
                          binding: new Data_Maybe.Just(v1.value0), 
                          context: contextID, 
                          properties: Data_StrMap.fromFoldable(Data_List_Types.foldableList)(v2), 
                          gevuldeRollen: Data_StrMap.empty
                      }))(v1.value1)));
                  });
              });
          });
      })))(Text_Parsing_Indent.withPos(Text_Parsing_Parser_Combinators["try"](Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))(Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Control_Apply.applyFirst(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(roleName)(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.sameOrIndented)(reservedOp("=>"))))(function (v) {
          return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.sameOrIndented)(resourceName))(function (v1) {
              return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.indented)(Text_Parsing_Indent.block(rolePropertyAssignment)))(function (v2) {
                  return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Perspectives_Guid.guid(Data_Unit.unit)))(function (v3) {
                      return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(new Perspectives_Syntax2.NamedEntityCollection(v3, Data_StrMap.singleton(v3)(new Perspectives_Syntax2.Rol({
                          id: v3, 
                          pspType: v, 
                          binding: new Data_Maybe.Just(v1), 
                          context: contextID, 
                          properties: Data_StrMap.fromFoldable(Data_List_Types.foldableList)(v2), 
                          gevuldeRollen: Data_StrMap.empty
                      }))));
                  });
              });
          });
      })))));
  };
  var context = Text_Parsing_Indent.withPos(Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(typeDeclaration)(function (v) {
      return Control_Apply.applySecond(Text_Parsing_Parser.applyParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.indented)(Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.block(publicContextPropertyAssignment))(function (v1) {
          return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.block(privateContextPropertyAssignment))(function (v2) {
              return Control_Bind.bind(Text_Parsing_Parser.bindParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(Text_Parsing_Indent.block(roleBinding(v.value1)))(function (v3) {
                  var buitenRol = {
                      id: v.value1 + "_buitenRol", 
                      pspType: ":BuitenRol", 
                      binding: Data_Maybe.Nothing.value, 
                      context: v.value1, 
                      properties: Data_StrMap.fromFoldable(Data_List_Types.foldableList)(v1), 
                      gevuldeRollen: Data_StrMap.empty
                  };
                  var binnenRol = {
                      id: v.value1 + "_binnenRol", 
                      pspType: ":BinnenRol", 
                      binding: Data_Maybe.Just.create(v.value1 + "_buitenRol"), 
                      properties: Data_StrMap.fromFoldable(Data_List_Types.foldableList)(v2)
                  };
                  var ctxt = {
                      id: v.value1, 
                      pspType: v.value0, 
                      binnenRol: binnenRol, 
                      buitenRol: v.value1 + "_buitenRol", 
                      rolInContext: Data_Array.fromFoldable(Data_List_Types.foldableList)(Data_Functor.map(Data_List_Types.functorList)(function (v4) {
                          return v4.value0;
                      })(v3))
                  };
                  var v4 = Data_StrMap.unions(Data_List_Types.foldableList)(Data_Functor.map(Data_List_Types.functorList)(function (v5) {
                      return v5.value1;
                  })(v3));
                  return Control_Applicative.pure(Text_Parsing_Parser.applicativeParserT(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity)))(new Perspectives_Syntax2.NamedEntityCollection(v.value1, Data_StrMap.insert(v.value1)(new Perspectives_Syntax2.Context(ctxt))(Data_StrMap.insert(v.value1 + "_buitenRol")(new Perspectives_Syntax2.Rol(buitenRol))(v4))));
              });
          });
      }));
  }));
  exports["bool"] = bool;
  exports["capitalizedString"] = capitalizedString;
  exports["context"] = context;
  exports["dataType"] = dataType;
  exports["dataTypes"] = dataTypes;
  exports["domeinName"] = domeinName;
  exports["identLetter"] = identLetter;
  exports["identifier"] = identifier;
  exports["lexeme"] = lexeme;
  exports["localPropertyName"] = localPropertyName;
  exports["localResourceName"] = localResourceName;
  exports["lower"] = lower;
  exports["prefix"] = prefix;
  exports["prefixedPropertyName"] = prefixedPropertyName;
  exports["prefixedResourceName"] = prefixedResourceName;
  exports["privateContextPropertyAssignment"] = privateContextPropertyAssignment;
  exports["propertyName"] = propertyName;
  exports["publicContextPropertyAssignment"] = publicContextPropertyAssignment;
  exports["qualifiedPropertyName"] = qualifiedPropertyName;
  exports["qualifiedResourceName"] = qualifiedResourceName;
  exports["reserved"] = reserved;
  exports["reservedOp"] = reservedOp;
  exports["resourceName"] = resourceName;
  exports["role"] = role;
  exports["roleBinding"] = roleBinding;
  exports["roleName"] = roleName;
  exports["rolePropertyAssignment"] = rolePropertyAssignment;
  exports["simpleValue"] = simpleValue;
  exports["string"] = string;
  exports["typeDeclaration"] = typeDeclaration;
  exports["typedPropertyAssignment"] = typedPropertyAssignment;
  exports["uncapitalizedString"] = uncapitalizedString;
})(PS["Perspectives.ContextRoleParser"] = PS["Perspectives.ContextRoleParser"] || {});
(function(exports) {
    "use strict";
  var Ace_Types = PS["Ace.Types"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Aff_Class = PS["Control.Monad.Aff.Class"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Console = PS["Control.Monad.Eff.Console"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  var Halogen = PS["Halogen"];
  var Halogen_Aff = PS["Halogen.Aff"];
  var Halogen_Aff_Util = PS["Halogen.Aff.Util"];
  var Halogen_Component = PS["Halogen.Component"];
  var Halogen_HTML = PS["Halogen.HTML"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_HTML_Elements = PS["Halogen.HTML.Elements"];
  var Halogen_HTML_Events = PS["Halogen.HTML.Events"];
  var Halogen_Query = PS["Halogen.Query"];
  var Halogen_Query_HalogenM = PS["Halogen.Query.HalogenM"];
  var Halogen_VDom_Driver = PS["Halogen.VDom.Driver"];
  var Network_HTTP_Affjax = PS["Network.HTTP.Affjax"];
  var Network_HTTP_Affjax_Response = PS["Network.HTTP.Affjax.Response"];
  var PerspectAceComponent = PS["PerspectAceComponent"];
  var Perspectives_ContextRoleParser = PS["Perspectives.ContextRoleParser"];
  var Perspectives_IndentParser = PS["Perspectives.IndentParser"];
  var Perspectives_Syntax2 = PS["Perspectives.Syntax2"];
  var Prelude = PS["Prelude"];
  var Text_Parsing_Parser = PS["Text.Parsing.Parser"];        

  // | The query algebra for the app.
  var ClearText = (function () {
      function ClearText(value0) {
          this.value0 = value0;
      };
      ClearText.create = function (value0) {
          return new ClearText(value0);
      };
      return ClearText;
  })();

  // | The query algebra for the app.
  var HandleAceUpdate = (function () {
      function HandleAceUpdate(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      HandleAceUpdate.create = function (value0) {
          return function (value1) {
              return new HandleAceUpdate(value0, value1);
          };
      };
      return HandleAceUpdate;
  })();

  // | The query algebra for the app.
  var Load = (function () {
      function Load(value0) {
          this.value0 = value0;
      };
      Load.create = function (value0) {
          return new Load(value0);
      };
      return Load;
  })();

  // | The slot address type for the Ace component.
  var AceSlot = (function () {
      function AceSlot() {

      };
      AceSlot.value = new AceSlot();
      return AceSlot;
  })();
  var parse = function (source) {
      return Data_Show.show(Data_Either.showEither(Text_Parsing_Parser.showParseError)(Perspectives_Syntax2.showNamedEntityCollection))(Perspectives_IndentParser.runIndentParser(source)(Perspectives_ContextRoleParser.context));
  };
  var eqAceSlot = new Data_Eq.Eq(function (x) {
      return function (y) {
          return true;
      };
  });
  var ordAceSlot = new Data_Ord.Ord(function () {
      return eqAceSlot;
  }, function (x) {
      return function (y) {
          return Data_Ordering.EQ.value;
      };
  });

  // | The main UI component definition.
  var ui = (function () {
      var initialState = {
          text: ""
      };
      var handleAceOuput = function (v) {
          return Data_Maybe.Just.create(Halogen_Query.action(HandleAceUpdate.create(parse(v.value0))));
      };
      var render = function (v) {
          return Halogen_HTML_Elements.div_([ Halogen_HTML_Elements.h1_([ Halogen_HTML_Core.text("ace editor") ]), Halogen_HTML_Elements.div_([ Halogen_HTML_Elements.p_([ Halogen_HTML_Elements.button([ Halogen_HTML_Events.onClick(Halogen_HTML_Events.input_(ClearText.create)) ])([ Halogen_HTML_Core.text("Clear") ]) ]) ]), Halogen_HTML_Elements.div_([ Halogen_HTML_Elements.p_([ Halogen_HTML_Elements.button([ Halogen_HTML_Events.onClick(Halogen_HTML_Events.input_(Load.create)) ])([ Halogen_HTML_Core.text("Load") ]) ]) ]), Halogen_HTML_Elements.div_([ Halogen_HTML.slot(AceSlot.value)(PerspectAceComponent.aceComponent)(Data_Unit.unit)(handleAceOuput) ]), Halogen_HTML_Elements.pre_([ Halogen_HTML_Core.text("Current text: " + v.text) ]) ]);
      };
      var $$eval = function (v) {
          if (v instanceof ClearText) {
              return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Halogen_Query.query(eqAceSlot)(AceSlot.value)(Halogen_Query.action(PerspectAceComponent.ChangeText.create(""))))(function (v1) {
                  return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(v.value0);
              });
          };
          if (v instanceof HandleAceUpdate) {
              return Control_Bind.discard(Control_Bind.discardUnit)(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.modify(Halogen_Query_HalogenM.monadStateHalogenM)(function (v1) {
                  var $23 = {};
                  for (var $24 in v1) {
                      if ({}.hasOwnProperty.call(v1, $24)) {
                          $23[$24] = v1[$24];
                      };
                  };
                  $23.text = v.value0;
                  return $23;
              }))(function () {
                  return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(v.value1);
              });
          };
          if (v instanceof Load) {
              return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_Aff_Class.liftAff(Halogen_Query_HalogenM.monadAffHalogenM(Control_Monad_Aff_Class.monadAffAff))(Network_HTTP_Affjax.get(Network_HTTP_Affjax_Response.responsableString)("http://www.pureperspectives.nl/src/editor/perspectives.psp")))(function (v1) {
                  return Control_Bind.discard(Control_Bind.discardUnit)(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.modify(Halogen_Query_HalogenM.monadStateHalogenM)(function (v2) {
                      var $29 = {};
                      for (var $30 in v2) {
                          if ({}.hasOwnProperty.call(v2, $30)) {
                              $29[$30] = v2[$30];
                          };
                      };
                      $29.text = v1.response;
                      return $29;
                  }))(function () {
                      return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Halogen_Query.query(eqAceSlot)(AceSlot.value)(Halogen_Query.action(PerspectAceComponent.ChangeText.create(v1.response))))(function (v2) {
                          return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(v.value0);
                      });
                  });
              });
          };
          throw new Error("Failed pattern match at Main line 75, column 3 - line 77, column 14: " + [ v.constructor.name ]);
      };
      return Halogen_Component.parentComponent(ordAceSlot)({
          initialState: Data_Function["const"](initialState), 
          render: render, 
          "eval": $$eval, 
          receiver: Data_Function["const"](Data_Maybe.Nothing.value)
      });
  })();

  // | Run the app!
  var main = Halogen_Aff_Util.runHalogenAff(Control_Bind.bind(Control_Monad_Aff.bindAff)(Halogen_Aff_Util.awaitBody)(function (v) {
      return Halogen_VDom_Driver.runUI(ui)(Data_Unit.unit)(v);
  }));
  exports["AceSlot"] = AceSlot;
  exports["ClearText"] = ClearText;
  exports["HandleAceUpdate"] = HandleAceUpdate;
  exports["Load"] = Load;
  exports["main"] = main;
  exports["parse"] = parse;
  exports["ui"] = ui;
  exports["eqAceSlot"] = eqAceSlot;
  exports["ordAceSlot"] = ordAceSlot;
})(PS["Main"] = PS["Main"] || {});
PS["Main"].main();

}).call(this,require('_process'))
},{"_process":1}]},{},[2]);
