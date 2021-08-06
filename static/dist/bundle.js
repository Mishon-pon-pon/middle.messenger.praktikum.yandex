/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./src/Bootstrap/index.ts":
/*!********************************!*\
  !*** ./src/Bootstrap/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BootStrap = void 0;
const InfrastsructureLayer_1 = __webpack_require__(/*! ../InfrastsructureLayer */ "./src/InfrastsructureLayer/index.ts");
const IntegrationalLayer_1 = __webpack_require__(/*! ../IntegrationalLayer */ "./src/IntegrationalLayer/index.ts");
const BussinesLayer_1 = __webpack_require__(/*! ../BussinesLayer */ "./src/BussinesLayer/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../ViewModel */ "./src/ViewModel/index.ts");
const CreateDIContainer = (infrastructureContainer, integreationContainer, serviceContainer, viewModelContainer) => {
    return viewModelContainer
        .parent(serviceContainer)
        .parent(integreationContainer)
        .parent(infrastructureContainer);
};
class BootStrap {
    constructor() {
        this.container = CreateDIContainer(InfrastsructureLayer_1.infrastructureContainer, IntegrationalLayer_1.ApiClientContainer, BussinesLayer_1.ServiceContainer, ViewModel_1.ViewModelContainer);
    }
}
exports.BootStrap = BootStrap;


/***/ }),

/***/ "./src/BussinesLayer/ChatService.ts":
/*!******************************************!*\
  !*** ./src/BussinesLayer/ChatService.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatService = void 0;
class ChatService {
    constructor(ApiClient) {
        this.ApiClient = ApiClient;
        this.getChats = () => {
            return this.ApiClient.getChats();
        };
        this.saveChat = (data) => {
            return this.ApiClient.saveChat(data);
        };
    }
    deleteChat(chatId) {
        return this.ApiClient.deleteChat(chatId);
    }
}
exports.ChatService = ChatService;


/***/ }),

/***/ "./src/BussinesLayer/UserService.ts":
/*!******************************************!*\
  !*** ./src/BussinesLayer/UserService.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
class UserService {
    constructor(ApiClient) {
        this.ApiClient = ApiClient;
    }
    saveUser(user) {
        return this.ApiClient.saveUser(user);
    }
    getUser() {
        return this.ApiClient.getUser();
    }
}
exports.UserService = UserService;


/***/ }),

/***/ "./src/BussinesLayer/index.ts":
/*!************************************!*\
  !*** ./src/BussinesLayer/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceContainer = exports.SERVICE = void 0;
const IntegrationalLayer_1 = __webpack_require__(/*! ../IntegrationalLayer */ "./src/IntegrationalLayer/index.ts");
const Container_1 = __webpack_require__(/*! ../libs/Container */ "./src/libs/Container/index.ts");
const ChatService_1 = __webpack_require__(/*! ./ChatService */ "./src/BussinesLayer/ChatService.ts");
const UserService_1 = __webpack_require__(/*! ./UserService */ "./src/BussinesLayer/UserService.ts");
exports.SERVICE = {
    CHAT: Symbol.for("ChatService"),
    USER: Symbol.for("UserServcie"),
};
exports.ServiceContainer = new Container_1.Container();
exports.ServiceContainer.bind(exports.SERVICE.CHAT).toDynamicValue((container) => {
    const APIClient = container.get(IntegrationalLayer_1.API_CLIENT.CHAT);
    return new ChatService_1.ChatService(APIClient);
});
exports.ServiceContainer.bind(exports.SERVICE.USER).toDynamicValue((container) => {
    const APIClient = container.get(IntegrationalLayer_1.API_CLIENT.USER);
    return new UserService_1.UserService(APIClient);
});


/***/ }),

/***/ "./src/InfrastsructureLayer/index.ts":
/*!*******************************************!*\
  !*** ./src/InfrastsructureLayer/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.infrastructureContainer = exports.INTEGRATION_MODULE = void 0;
const Container_1 = __webpack_require__(/*! ../libs/Container */ "./src/libs/Container/index.ts");
const interfaces_1 = __webpack_require__(/*! ./interfaces */ "./src/InfrastsructureLayer/interfaces.ts");
exports.INTEGRATION_MODULE = {
    APIModule: Symbol.for("API"),
};
exports.infrastructureContainer = new Container_1.Container();
exports.infrastructureContainer
    .bind(exports.INTEGRATION_MODULE.APIModule)
    .toDynamicValue((container) => {
    return new interfaces_1.APIModule();
});


/***/ }),

/***/ "./src/InfrastsructureLayer/interfaces.ts":
/*!************************************************!*\
  !*** ./src/InfrastsructureLayer/interfaces.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.APIModule = void 0;
const Transport_1 = __webpack_require__(/*! ../libs/Transport */ "./src/libs/Transport/index.ts");
class APIModule {
    constructor() {
        this.getData = (url, data) => {
            return Transport_1.HTTPTransport.getInstance()
                .GET(url, this.getParms(data))
                .then((result) => {
                return JSON.parse(result.response);
            });
        };
        this.postData = (url, data) => __awaiter(this, void 0, void 0, function* () {
            return Transport_1.HTTPTransport.getInstance()
                .POST(url, this.getParms(data))
                .then((result) => {
                return JSON.parse(result.response);
            });
        });
        this.deleteData = (url, data) => {
            return Transport_1.HTTPTransport.getInstance()
                .DELETE(url, this.getParms(data))
                .then((result) => {
                return JSON.parse(result.response);
            });
        };
        this.putData = (url, data) => {
            return Transport_1.HTTPTransport.getInstance().PUT(url, this.getParms(data));
        };
    }
    getParms(data) {
        return {
            headers: {
                "Content-type": "application/json",
            },
            data: Object.assign({}, data),
        };
    }
}
exports.APIModule = APIModule;


/***/ }),

/***/ "./src/IntegrationalLayer/ChatAPI.ts":
/*!*******************************************!*\
  !*** ./src/IntegrationalLayer/ChatAPI.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatAPIClient = void 0;
class ChatAPIClient {
    constructor(APIModule) {
        this.APIModule = APIModule;
        this.getChats = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.APIModule.getData("/chats", {}).then((result) => {
                return result;
            });
        });
        this.saveChat = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.APIModule.postData("/chats", data);
        });
    }
    deleteChat(id) {
        return this.APIModule.deleteData("/chats", { chatId: id });
    }
}
exports.ChatAPIClient = ChatAPIClient;


/***/ }),

/***/ "./src/IntegrationalLayer/UserAPI.ts":
/*!*******************************************!*\
  !*** ./src/IntegrationalLayer/UserAPI.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserAPIClient = void 0;
class UserAPIClient {
    constructor(APIModule) {
        this.APIModule = APIModule;
        this.getUser = () => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.APIModule.getData("/auth/user", {});
            return user;
        });
        this.saveUser = (user) => {
            return this.APIModule.putData('/user/profile', user);
        };
    }
}
exports.UserAPIClient = UserAPIClient;


/***/ }),

/***/ "./src/IntegrationalLayer/index.ts":
/*!*****************************************!*\
  !*** ./src/IntegrationalLayer/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiClientContainer = exports.API_CLIENT = void 0;
const Container_1 = __webpack_require__(/*! ../libs/Container */ "./src/libs/Container/index.ts");
const InfrastsructureLayer_1 = __webpack_require__(/*! ../InfrastsructureLayer */ "./src/InfrastsructureLayer/index.ts");
const ChatAPI_1 = __webpack_require__(/*! ./ChatAPI */ "./src/IntegrationalLayer/ChatAPI.ts");
const UserAPI_1 = __webpack_require__(/*! ./UserAPI */ "./src/IntegrationalLayer/UserAPI.ts");
exports.API_CLIENT = {
    CHAT: Symbol.for("ChatAPIClient"),
    USER: Symbol.for("UserAPIClient"),
};
exports.ApiClientContainer = new Container_1.Container();
exports.ApiClientContainer.bind(exports.API_CLIENT.CHAT).toDynamicValue((container) => {
    const APIModule = container.get(InfrastsructureLayer_1.INTEGRATION_MODULE.APIModule);
    return new ChatAPI_1.ChatAPIClient(APIModule);
});
exports.ApiClientContainer.bind(exports.API_CLIENT.USER).toDynamicValue((container) => {
    const APIModule = container.get(InfrastsructureLayer_1.INTEGRATION_MODULE.APIModule);
    return new UserAPI_1.UserAPIClient(APIModule);
});


/***/ }),

/***/ "./src/UI/Components/AttentionMessage/index.ts":
/*!*****************************************************!*\
  !*** ./src/UI/Components/AttentionMessage/index.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AttentionMessage = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const AttentionMessage = () => {
    return new HYPO_1.HYPO({
        templatePath: "attention.template.html",
        data: {
            message: "",
        },
        children: {},
    });
};
exports.AttentionMessage = AttentionMessage;


/***/ }),

/***/ "./src/UI/Components/Button/index.ts":
/*!*******************************************!*\
  !*** ./src/UI/Components/Button/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Button = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const utils_1 = __webpack_require__(/*! ../../../libs/utils */ "./src/libs/utils/index.ts");
const Button = (props) => {
    const id = props.id || utils_1.uuidv4();
    return new HYPO_1.HYPO({
        templatePath: "button.template.html",
        data: {
            id: id,
            title: props.title,
            className: props.className,
        },
    }).afterRender(() => {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
            props.onClick(e);
        });
    });
};
exports.Button = Button;


/***/ }),

/***/ "./src/UI/Components/ChatItem/index.ts":
/*!*********************************************!*\
  !*** ./src/UI/Components/ChatItem/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatItem = void 0;
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Chat_1 = __webpack_require__(/*! ../../Layouts/Chat */ "./src/UI/Layouts/Chat/index.ts");
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Delete_1 = __webpack_require__(/*! ../Delete */ "./src/UI/Components/Delete/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../../../ViewModel */ "./src/ViewModel/index.ts");
const ChatItem = (props) => {
    return new HYPO_1.HYPO({
        templatePath: "chatItem.template.html",
        data: {
            ChatName: props.title,
            lastTime: props.created_by || "10:22",
            lastMessage: props.id || "Hi, how are you?",
            notificationCount: props.avatar || 3,
        },
        children: {
            delete: Delete_1.Delete({
                id: `deleteItem${props.id}`,
                onClick: () => {
                    const chatViewModel = __1.container.get(ViewModel_1.VIEW_MODEL.CHAT);
                    chatViewModel.deleteChat(String(props.id)).then(() => {
                        Chat_1.ChatLayout(chatViewModel.chats).render();
                    });
                },
            }),
        },
    });
};
exports.ChatItem = ChatItem;


/***/ }),

/***/ "./src/UI/Components/CreateChatModal/index.ts":
/*!****************************************************!*\
  !*** ./src/UI/Components/CreateChatModal/index.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateChatModal = void 0;
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Required_1 = __webpack_require__(/*! ../../../libs/Validators/Required */ "./src/libs/Validators/Required/index.ts");
const AttentionMessage_1 = __webpack_require__(/*! ../AttentionMessage */ "./src/UI/Components/AttentionMessage/index.ts");
const Button_1 = __webpack_require__(/*! ../Button */ "./src/UI/Components/Button/index.ts");
const Input_1 = __webpack_require__(/*! ../Input */ "./src/UI/Components/Input/index.ts");
const Chat_1 = __webpack_require__(/*! ../../Layouts/Chat */ "./src/UI/Layouts/Chat/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../../../ViewModel */ "./src/ViewModel/index.ts");
const CreateChatModal = () => {
    const attentionMessage = AttentionMessage_1.AttentionMessage();
    const state = attentionMessage.getState();
    let ChatName = "";
    return new HYPO_1.HYPO({
        templatePath: "createchatmodal.template.html",
        data: {},
        children: {
            input: Input_1.Input({
                label: "Chat name",
                type: "text",
                name: "chatname",
                id: "chatname",
                className: "c-c-modal__input",
                ChildAttention: attentionMessage,
                onBlur: (e) => {
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        state.message = "";
                        ChatName = input.value;
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            create: Button_1.Button({
                title: "Создать",
                className: "create-button",
                onClick: (e) => {
                    if (!ChatName) {
                        state.message = "⛔ обязательное поле";
                    }
                    else {
                        const chatViewModel = __1.container.get(ViewModel_1.VIEW_MODEL.CHAT);
                        chatViewModel.saveChat({ title: ChatName }).then(() => {
                            document
                                .getElementsByClassName("c-c-modal")[0]
                                .classList.add("hidden");
                            Chat_1.ChatLayout(chatViewModel.chats).render();
                        });
                    }
                },
            }),
            cancel: Button_1.Button({
                title: "Отмена",
                className: "cancel-button",
                onClick: (e) => {
                    document
                        .getElementsByClassName("c-c-modal")[0]
                        .classList.add("hidden");
                },
            }),
        },
    });
};
exports.CreateChatModal = CreateChatModal;


/***/ }),

/***/ "./src/UI/Components/Delete/index.ts":
/*!*******************************************!*\
  !*** ./src/UI/Components/Delete/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Delete = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Delete = (props) => {
    return new HYPO_1.HYPO({
        templatePath: "delete.template.html",
        data: {
            path: "/media/Vector.svg",
            id: props.id,
        },
        children: {},
    }).afterRender(() => {
        var _a;
        (_a = document.getElementById(props.id)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            props.onClick();
        });
    });
};
exports.Delete = Delete;


/***/ }),

/***/ "./src/UI/Components/Empty/index.ts":
/*!******************************************!*\
  !*** ./src/UI/Components/Empty/index.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Empty = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Empty = () => {
    return new HYPO_1.HYPO({
        templatePath: "empty.template.html",
        data: {},
    });
};
exports.Empty = Empty;


/***/ }),

/***/ "./src/UI/Components/Input/index.ts":
/*!******************************************!*\
  !*** ./src/UI/Components/Input/index.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Input = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Empty_1 = __webpack_require__(/*! ../Empty */ "./src/UI/Components/Empty/index.ts");
//@todo: прикрутить уникальность каждого элемента
const Input = (props) => {
    return new HYPO_1.HYPO({
        templatePath: "input.template.html",
        data: {
            label: {
                name: props.label,
            },
            atribute: {
                type: props.type,
                name: props.name,
                id: props.id,
                className: props.className,
            },
        },
        children: {
            Attention: props.ChildAttention || Empty_1.Empty(),
        },
    }).afterRender(() => {
        var _a, _b;
        (_a = document
            .getElementById(props.id)) === null || _a === void 0 ? void 0 : _a.addEventListener("focus", (e) => {
            var _a, _b, _c;
            const input = e.target;
            const inputLabel = (_b = (_a = input.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector(".form-input__label");
            inputLabel === null || inputLabel === void 0 ? void 0 : inputLabel.classList.add("form-input__label_select");
            (_c = props.onFocus) === null || _c === void 0 ? void 0 : _c.call(props, e);
        });
        (_b = document.getElementById(props.id)) === null || _b === void 0 ? void 0 : _b.addEventListener("blur", (e) => {
            var _a, _b, _c;
            const input = e.target;
            const inputLabel = (_b = (_a = input.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector(".form-input__label");
            if (!input.value) {
                inputLabel === null || inputLabel === void 0 ? void 0 : inputLabel.classList.remove("form-input__label_select");
            }
            (_c = props.onBlur) === null || _c === void 0 ? void 0 : _c.call(props, e);
        });
    });
};
exports.Input = Input;


/***/ }),

/***/ "./src/UI/Components/ProfileInput/index.ts":
/*!*************************************************!*\
  !*** ./src/UI/Components/ProfileInput/index.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileInput = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const ProfileInput = ({ label, value, id, onChage }) => {
    return new HYPO_1.HYPO({
        templatePath: "profileInput.template.html",
        data: {
            label: label,
            value: value,
            id: id,
        },
    }).afterRender(() => {
        const input = document.getElementById(id);
        input === null || input === void 0 ? void 0 : input.addEventListener("blur", () => {
            onChage({ value: input.value });
        });
    });
};
exports.ProfileInput = ProfileInput;


/***/ }),

/***/ "./src/UI/Layouts/ChangePassword/index.ts":
/*!************************************************!*\
  !*** ./src/UI/Layouts/ChangePassword/index.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangePassword = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
const momize_1 = __webpack_require__(/*! ../../../libs/momize */ "./src/libs/momize/index.js");
exports.ChangePassword = momize_1.memoize(() => {
    return new HYPO_1.HYPO({
        renderTo: document.getElementById("#root") || document.body,
        templatePath: "changePassword.template.html",
        data: {},
        children: {
            save: Button_1.Button({
                title: "Сохранить",
                className: "password_edit__action__save",
                onClick: (e) => {
                    __1.router.go("/profile");
                },
            }),
        },
    });
});


/***/ }),

/***/ "./src/UI/Layouts/ChangeProfile/index.ts":
/*!***********************************************!*\
  !*** ./src/UI/Layouts/ChangeProfile/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangeProfile = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../../../ViewModel */ "./src/ViewModel/index.ts");
const ProfileInput_1 = __webpack_require__(/*! ../../Components/ProfileInput */ "./src/UI/Components/ProfileInput/index.ts");
const Config = {
    email: {
        label: "Почта",
    },
    login: {
        label: "Логин",
    },
    first_name: {
        label: "Имя",
    },
    second_name: {
        label: "Фамилия",
    },
    display_name: {
        label: "Имя в чатах",
    },
    phone: {
        label: "Телефон",
    },
};
const ChangeProfile = (data) => {
    const userViewModel = __1.container.get(ViewModel_1.VIEW_MODEL.USER);
    return new HYPO_1.HYPO({
        renderTo: document.getElementById("root") || document.body,
        templatePath: "changeProfile.template.html",
        data: {
            email: data === null || data === void 0 ? void 0 : data.email,
            login: data === null || data === void 0 ? void 0 : data.login,
            firstName: data === null || data === void 0 ? void 0 : data.first_name,
            secondName: data === null || data === void 0 ? void 0 : data.second_name,
            displayName: (data === null || data === void 0 ? void 0 : data.display_name) || "",
            phone: data === null || data === void 0 ? void 0 : data.phone,
        },
        children: {
            save: Button_1.Button({
                title: "Сохранить",
                className: "profile_edit__action__save",
                onClick: (e) => {
                    if (userViewModel.user) {
                        const form = document.getElementsByClassName("profile_edit")[0];
                        console.log(userViewModel.user);
                        userViewModel.saveUser(userViewModel.user).finally(() => {
                            __1.router.go("/profile");
                        });
                    }
                },
            }),
            inputs: Object.keys(Config)
                .reverse()
                .map((item) => {
                var _a;
                const key = item;
                const label = (_a = Config[item]) === null || _a === void 0 ? void 0 : _a.label;
                const value = data ? data[key] : "";
                return ProfileInput_1.ProfileInput({
                    label: label,
                    value: value,
                    id: key,
                    onChage: ({ value }) => {
                        console.log(value);
                        userViewModel.user = Object.assign(Object.assign({}, userViewModel.user), { [item]: value });
                    },
                });
            }),
        },
    });
};
exports.ChangeProfile = ChangeProfile;


/***/ }),

/***/ "./src/UI/Layouts/Chat/index.ts":
/*!**************************************!*\
  !*** ./src/UI/Layouts/Chat/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatLayout = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const ChatItem_1 = __webpack_require__(/*! ../../Components/ChatItem */ "./src/UI/Components/ChatItem/index.ts");
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
const Empty_1 = __webpack_require__(/*! ../../Components/Empty */ "./src/UI/Components/Empty/index.ts");
const CreateChatModal_1 = __webpack_require__(/*! ../../Components/CreateChatModal */ "./src/UI/Components/CreateChatModal/index.ts");
const ChatLayout = (result) => {
    const ChatItemList = [];
    if (Array.isArray(result)) {
        result.forEach((item) => {
            ChatItemList.push(ChatItem_1.ChatItem(Object.assign({}, item)));
        });
    }
    else {
        ChatItemList.push(Empty_1.Empty());
    }
    return new HYPO_1.HYPO({
        renderTo: document.getElementById("root") || document.body,
        templatePath: "chat.template.html",
        data: {},
        children: {
            ProfileLink: Button_1.Button({
                title: "Profile",
                className: "profile-link__button",
                onClick: (e) => {
                    __1.router.go("/profile");
                },
            }),
            chatItem: ChatItemList,
            createChatModal: CreateChatModal_1.CreateChatModal(),
            createChatButton: Button_1.Button({
                title: "+",
                className: "navigation__createChatButton",
                onClick: () => {
                    document
                        .getElementsByClassName("c-c-modal")[0]
                        .classList.remove("hidden");
                },
            }),
        },
    });
};
exports.ChatLayout = ChatLayout;


/***/ }),

/***/ "./src/UI/Layouts/Login/index.ts":
/*!***************************************!*\
  !*** ./src/UI/Layouts/Login/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginLayout = void 0;
const Input_1 = __webpack_require__(/*! ../../Components/Input */ "./src/UI/Components/Input/index.ts");
const Required_1 = __webpack_require__(/*! ../../../libs/Validators/Required */ "./src/libs/Validators/Required/index.ts");
const AttentionMessage_1 = __webpack_require__(/*! ../../Components/AttentionMessage */ "./src/UI/Components/AttentionMessage/index.ts");
const index_1 = __webpack_require__(/*! ../../../index */ "./src/index.ts");
const Transport_1 = __webpack_require__(/*! ../../../libs/Transport */ "./src/libs/Transport/index.ts");
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
/**
 * nnnrrr111NN
 */
const LoginLayout = (user) => {
    if (user && user.id) {
        index_1.router.go("/chat");
    }
    const attentionLogin = AttentionMessage_1.AttentionMessage();
    const attentionLoginStore = attentionLogin.getState();
    const attentionPass = AttentionMessage_1.AttentionMessage();
    const attentionPassStore = attentionPass.getState();
    const FormData = {};
    return new HYPO_1.HYPO({
        renderTo: document.getElementById("root") || document.body,
        templatePath: "login.template.html",
        data: {
            FormName: "Вход",
        },
        children: {
            InputLogin: Input_1.Input({
                label: "Логин",
                type: "text",
                name: "login",
                id: "form-input-login",
                className: "form-login__form-input",
                onBlur: (e) => {
                    const input = e.target;
                    const check = Required_1.Required.checkFunc(input === null || input === void 0 ? void 0 : input.value);
                    if (!check) {
                        attentionLoginStore.message = "⛔ обязательное поле";
                    }
                    else {
                        attentionLoginStore.message = "";
                        FormData["login"] = input.value;
                    }
                },
                ChildAttention: attentionLogin,
            }),
            InputPassword: Input_1.Input({
                label: "Пароль",
                type: "password",
                name: "password",
                id: "form-input-password",
                className: "form-login__form-input",
                onBlur: (e) => {
                    const input = e.target;
                    if (!Required_1.Required.checkFunc(input.value)) {
                        attentionPassStore.message = "⛔ обязательное поле";
                    }
                    else {
                        attentionPassStore.message = "";
                        FormData["password"] = input.value;
                    }
                },
                ChildAttention: attentionPass,
            }),
            Button: Button_1.Button({
                title: "Авторизоваться",
                className: "form-button",
                onClick: (e) => {
                    const data = {
                        data: {
                            login: FormData.login,
                            password: FormData.password,
                        },
                        headers: {
                            "Content-type": "application/json",
                        },
                    };
                    Transport_1.HTTPTransport.getInstance()
                        .POST("/auth/signin", data)
                        .then((result) => {
                        if (result.status < 300) {
                            index_1.router.go("/chat");
                        }
                    });
                },
            }),
            LinkToRegistration: Button_1.Button({
                title: "Зарегистрироваться",
                className: "form-link",
                onClick: (e) => {
                    index_1.router.go("/registration");
                },
            }),
        },
    });
};
exports.LoginLayout = LoginLayout;


/***/ }),

/***/ "./src/UI/Layouts/Profile/index.ts":
/*!*****************************************!*\
  !*** ./src/UI/Layouts/Profile/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileLayout = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Transport_1 = __webpack_require__(/*! ../../../libs/Transport */ "./src/libs/Transport/index.ts");
const ProfileLayout = (data) => {
    return new HYPO_1.HYPO({
        renderTo: document.querySelector("#root"),
        templatePath: "profile.template.html",
        data: Object.assign({}, data),
        children: {
            EditProfileLink: Button_1.Button({
                title: "Изменить данные",
                className: "action__change-profile",
                onClick: () => {
                    __1.router.go("/editprofile");
                },
            }),
            EditPasswordLink: Button_1.Button({
                title: "Изменить пароль",
                className: "action__change-password",
                onClick: () => {
                    __1.router.go("/editpassword");
                },
            }),
            BackLink: Button_1.Button({
                title: "Назад",
                className: "action__back",
                onClick: () => {
                    __1.router.go("/chat");
                },
            }),
            ExitLink: Button_1.Button({
                title: "Выйти",
                className: "action__exit",
                onClick: () => {
                    Transport_1.HTTPTransport.getInstance()
                        .POST("/auth/logout")
                        .then(() => {
                        __1.router.go("/");
                    });
                },
            }),
        },
    });
};
exports.ProfileLayout = ProfileLayout;


/***/ }),

/***/ "./src/UI/Layouts/Registration/index.ts":
/*!**********************************************!*\
  !*** ./src/UI/Layouts/Registration/index.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegistrationLayout = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Input_1 = __webpack_require__(/*! ../../Components/Input */ "./src/UI/Components/Input/index.ts");
// import { Validator, Rule } from "../../libs/Validator";
const Email_1 = __webpack_require__(/*! ../../../libs/Validators/Email */ "./src/libs/Validators/Email/index.ts");
const Required_1 = __webpack_require__(/*! ../../../libs/Validators/Required */ "./src/libs/Validators/Required/index.ts");
const AttentionMessage_1 = __webpack_require__(/*! ../../Components/AttentionMessage */ "./src/UI/Components/AttentionMessage/index.ts");
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Transport_1 = __webpack_require__(/*! ../../../libs/Transport */ "./src/libs/Transport/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
const RegistrationLayout = () => {
    const AttentionEmail = AttentionMessage_1.AttentionMessage();
    const AttentionLogin = AttentionMessage_1.AttentionMessage();
    const AttentionPassword = AttentionMessage_1.AttentionMessage();
    const AttentionPasswordDouble = AttentionMessage_1.AttentionMessage();
    const AttentionFirstName = AttentionMessage_1.AttentionMessage();
    const AttentionSecondName = AttentionMessage_1.AttentionMessage();
    const AttentionPhone = AttentionMessage_1.AttentionMessage();
    const FormData = {};
    return new HYPO_1.HYPO({
        renderTo: document.querySelector("#root"),
        templatePath: "registration.template.html",
        data: {
            formTitle: "Регистрация",
        },
        children: {
            InputEmail: Input_1.Input({
                label: "Почта",
                type: "text",
                name: "email",
                id: "form__email__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionEmail,
                onBlur: (e) => {
                    const state = AttentionEmail.getState();
                    const input = e.target;
                    if (Email_1.EmailValidator.checkFunc(input.value)) {
                        FormData["email"] = input.value;
                        state.message = "";
                    }
                    else {
                        state.message = "⛔ это не похоже на адрес электронной почты";
                    }
                },
            }),
            InputLogin: Input_1.Input({
                label: "Логин",
                type: "text",
                name: "login",
                id: "form__login__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionLogin,
                onBlur: (e) => {
                    const state = AttentionLogin.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData["login"] = input.value;
                        state.message = "";
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            FirstName: Input_1.Input({
                label: "Имя",
                type: "text",
                name: "first_name",
                id: "form__first_name__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionFirstName,
                onBlur: (e) => {
                    const state = AttentionFirstName.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData["first_name"] = input.value;
                        state.message = "";
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            SecondName: Input_1.Input({
                label: "Фамилия",
                type: "text",
                name: "second_name",
                id: "form__second_name__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionSecondName,
                onBlur: (e) => {
                    const state = AttentionSecondName.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData["second_name"] = input.value;
                        state.message = "";
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            Phone: Input_1.Input({
                label: "Телефон",
                type: "text",
                name: "phone",
                id: "form__phone__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionPhone,
                onBlur: (e) => {
                    const state = AttentionPhone.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData["phone"] = input.value;
                        state.message = "";
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            Password: Input_1.Input({
                label: "Пароль",
                type: "password",
                name: "password",
                id: "form__password__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionPassword,
                onBlur: (e) => {
                    const input = e.target;
                    const state = AttentionPassword.getState();
                    const stateD = AttentionPasswordDouble.getState();
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData["password"] = input.value;
                        state.message = "";
                        if (FormData["password"] !== FormData["doublepassword"]) {
                            stateD.message = "🔥пароли не совпадают";
                        }
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            PasswordDouble: Input_1.Input({
                label: "Пароль",
                type: "password",
                name: "doublepassword",
                id: "form__doublepassword__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionPasswordDouble,
                onBlur: (e) => {
                    const input = e.target;
                    const state = AttentionPasswordDouble.getState();
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData["doublepassword"] = input.value;
                        state.message = "";
                        if (FormData["password"] !== FormData["doublepassword"]) {
                            state.message = "🔥пароли не совпадают";
                        }
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            RegButton: Button_1.Button({
                title: "Зарегистрироваться",
                className: "form-button",
                onClick: (e) => {
                    if (Object.keys(FormData).length == 0 ||
                        Object.keys(FormData).find((item) => {
                            return FormData[item] === "";
                        })) {
                        return;
                    }
                    const data = {
                        data: {
                            first_name: FormData.first_name,
                            second_name: FormData.second_name,
                            login: FormData.login,
                            email: FormData.email,
                            password: FormData.password,
                            phone: FormData.phone,
                        },
                        headers: {
                            "Content-type": "application/json",
                        },
                    };
                    Transport_1.HTTPTransport.getInstance()
                        .POST("/auth/signup", data)
                        .then(() => {
                        __1.router.go("/chat");
                    });
                },
            }),
            LoginLink: Button_1.Button({
                title: "Войти",
                className: "form-link",
                onClick: (e) => {
                    __1.router.go("/");
                },
            }),
        },
    });
};
exports.RegistrationLayout = RegistrationLayout;


/***/ }),

/***/ "./src/ViewModel/ChatViewModel/index.ts":
/*!**********************************************!*\
  !*** ./src/ViewModel/ChatViewModel/index.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatViewModel = void 0;
class ChatViewModel {
    constructor(service) {
        this.service = service;
        this.chats = [];
        this.x = 12;
        this.getChats = () => __awaiter(this, void 0, void 0, function* () {
            this.chats = yield this.service.getChats();
            return this.chats;
        });
        this.saveChat = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.service.saveChat(data);
            yield this.getChats();
        });
        this.deleteChat = (chatId) => __awaiter(this, void 0, void 0, function* () {
            yield this.service.deleteChat(chatId);
            yield this.getChats();
        });
    }
}
exports.ChatViewModel = ChatViewModel;


/***/ }),

/***/ "./src/ViewModel/UserViewModel/index.ts":
/*!**********************************************!*\
  !*** ./src/ViewModel/UserViewModel/index.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserViewModel = void 0;
class UserViewModel {
    constructor(service) {
        this.service = service;
        this.getUser = () => __awaiter(this, void 0, void 0, function* () {
            this.user = yield this.service.getUser();
        });
        this.saveUser = (user) => __awaiter(this, void 0, void 0, function* () {
            return this.service.saveUser(user);
        });
    }
    setUserField(name, value) {
        if (this.user) {
            this.user[name] = value;
        }
        else {
            this.user = {};
            this.user[name] = value;
        }
    }
}
exports.UserViewModel = UserViewModel;


/***/ }),

/***/ "./src/ViewModel/index.ts":
/*!********************************!*\
  !*** ./src/ViewModel/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ViewModelContainer = exports.VIEW_MODEL = void 0;
const BussinesLayer_1 = __webpack_require__(/*! ../BussinesLayer */ "./src/BussinesLayer/index.ts");
const Container_1 = __webpack_require__(/*! ../libs/Container */ "./src/libs/Container/index.ts");
const ChatViewModel_1 = __webpack_require__(/*! ./ChatViewModel */ "./src/ViewModel/ChatViewModel/index.ts");
const UserViewModel_1 = __webpack_require__(/*! ./UserViewModel */ "./src/ViewModel/UserViewModel/index.ts");
exports.VIEW_MODEL = {
    CHAT: Symbol.for("ChatViewModel"),
    USER: Symbol.for("UserViewModel"),
};
exports.ViewModelContainer = new Container_1.Container();
exports.ViewModelContainer.bind(exports.VIEW_MODEL.CHAT).toDynamicValue((container) => {
    const service = container.get(BussinesLayer_1.SERVICE.CHAT);
    return new ChatViewModel_1.ChatViewModel(service);
});
exports.ViewModelContainer.bind(exports.VIEW_MODEL.USER)
    .toDynamicValue((container) => {
    const service = container.get(BussinesLayer_1.SERVICE.USER);
    return new UserViewModel_1.UserViewModel(service);
})
    .inSingletoneScope();


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.container = exports.router = void 0;
__webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
const Bootstrap_1 = __webpack_require__(/*! ./Bootstrap */ "./src/Bootstrap/index.ts");
const router_1 = __webpack_require__(/*! ./router */ "./src/router/index.ts");
const InitApp = () => {
    const { container } = new Bootstrap_1.BootStrap();
    const router = router_1.RouterInit(container);
    return { router, container };
};
_a = InitApp(), exports.router = _a.router, exports.container = _a.container;


/***/ }),

/***/ "./src/libs/Container/index.ts":
/*!*************************************!*\
  !*** ./src/libs/Container/index.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Container = void 0;
class SingletonScope {
    constructor() {
        this.InstanceMakers = new Map();
        this.Instances = new Map();
    }
}
class Container {
    constructor(singletoneScope = new SingletonScope()) {
        this.singletoneScope = singletoneScope;
        this.containers = new Map();
        this.get = (id) => {
            const singleToneContainer = this.singletoneScope.InstanceMakers.get(id);
            if (singleToneContainer) {
                const instance = this.singletoneScope.Instances.get(id);
                if (instance) {
                    return instance;
                }
                else {
                    this.singletoneScope.Instances.set(id, singleToneContainer.fn(this));
                    return this.singletoneScope.Instances.get(id);
                }
            }
            else {
                const createContainerFn = this.containers.get(id);
                return createContainerFn.fn(this);
            }
        };
    }
    bind(id) {
        this.lastId = id;
        this.containers.set(id, null);
        return this;
    }
    toDynamicValue(fn) {
        if (this.lastId) {
            this.containers.set(this.lastId, { fn: fn, id: this.lastId });
        }
        return this;
    }
    parent(container) {
        for (let cont of container.containers) {
            this.containers.set(cont[0], cont[1]);
        }
        return this;
    }
    inSingletoneScope() {
        if (this.lastId) {
            const container = this.containers.get(this.lastId);
            this.singletoneScope.InstanceMakers.set(this.lastId, container);
        }
    }
}
exports.Container = Container;


/***/ }),

/***/ "./src/libs/HYPO/HYPO.ts":
/*!*******************************!*\
  !*** ./src/libs/HYPO/HYPO.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HYPO = void 0;
const momize_1 = __webpack_require__(/*! ../momize */ "./src/libs/momize/index.js");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/libs/utils/index.ts");
class HYPO {
    constructor(params) {
        this.getTemplateHTML = (key, hypo, isArray) => __awaiter(this, void 0, void 0, function* () {
            const getHTML = (templatePath) => __awaiter(this, void 0, void 0, function* () {
                const text = yield new Promise((resolve, reject) => {
                    fetch(templatePath)
                        .then((html) => {
                        if (html.status !== 200) {
                            throw new Error("file do not download");
                        }
                        return html.blob();
                    })
                        .then((result) => {
                        return result.text();
                    })
                        .then((text) => {
                        resolve(text);
                    })
                        .catch((err) => {
                        reject(err);
                    });
                });
                return text;
            });
            const getHTMLmemo = momize_1.memoize(getHTML);
            const htmlTemplate = yield getHTMLmemo(hypo.templatePath);
            const html = this.insertDataIntoHTML(htmlTemplate, hypo.data);
            return {
                html: html,
                templateKey: key,
                magicKey: hypo.magicKey,
                isArray: isArray,
            };
        });
        this.render = () => __awaiter(this, void 0, void 0, function* () {
            const that = this;
            return Promise.all(this.collectTemplates(this, "root", false).templatesPromises).then((arrayTemplates) => {
                const mapTemplates = this.convertArrTemplateToMap(arrayTemplates);
                let rootTemplateHTML = arrayTemplates[arrayTemplates.length - 1].html;
                for (let i = arrayTemplates.length - 2; i >= 0; i--) {
                    let template = mapTemplates[`${arrayTemplates[i].templateKey}-${arrayTemplates[i].magicKey}`];
                    rootTemplateHTML = this.insertTemplateIntoTemplate(rootTemplateHTML, arrayTemplates[i].templateKey, template, arrayTemplates[i].magicKey, arrayTemplates[i].isArray);
                }
                rootTemplateHTML = this.clearEmtpyComponent(rootTemplateHTML);
                if (this.renderTo) {
                    this.renderTo.innerHTML = rootTemplateHTML;
                }
                else {
                    const elem = document.querySelector(`[hypo="${this.magicKey}"]`);
                    if (elem) {
                        this.renderTo = elem;
                        elem.innerHTML = rootTemplateHTML;
                    }
                }
                this.afterRenderCallbackArr.forEach((callback) => {
                    callback();
                });
                this.templatesPromises = [];
                return that;
            });
        });
        this.renderTo = params.renderTo;
        this.data = params.data;
        this.templatePath = `./templates/${params.templatePath}`;
        this.children = params.children;
        this.templatesPromises = [];
        this.store = {};
        this.magicKey = utils_1.uuidv4();
        this.afterRenderCallback = () => { };
        this.afterRenderCallbackArr = new Set();
    }
    collectTemplates(hypo, name, isArray) {
        if (Array.isArray(hypo)) {
            this.handleArrayHYPO(hypo, name);
        }
        else {
            this.handleSimpleHYPO(hypo, name);
            this.templatesPromises.push(this.getTemplateHTML(name, hypo, isArray));
            this.afterRenderCallbackArr.add(hypo.afterRenderCallback);
        }
        return this;
    }
    handleArrayHYPO(hypos, name) {
        hypos.forEach((hypo) => {
            this.collectTemplates(hypo, `${name}`, true);
        });
    }
    handleSimpleHYPO(hypo, _) {
        if (hypo.children) {
            Object.keys(hypo.children).forEach((childName) => {
                if (hypo.children) {
                    return this.collectTemplates(hypo.children[childName], childName, false);
                }
            });
        }
    }
    insertDataIntoHTML(htmlTemplate, data) {
        data = this.getDataWithoutIerarhy(data);
        for (let key in data) {
            if (typeof data[key] !== "object" || data[key] === null) {
                const mask = new RegExp("{{" + key + "}}", "g");
                htmlTemplate = htmlTemplate.replace(mask, String(data[key]));
            }
        }
        const mask = new RegExp(/{{[a-z._]+}}/g);
        htmlTemplate = htmlTemplate.replace(mask, "");
        return htmlTemplate;
    }
    convertArrTemplateToMap(templateArr) {
        const result = {};
        templateArr.forEach((item) => {
            if (result[item.templateKey]) {
                result[item.templateKey] += `<span hypo="${item.magicKey}">${item.html}</span>`;
            }
            else {
                result[`${item.templateKey}-${item.magicKey}`] = item.html;
            }
        });
        return result;
    }
    insertTemplateIntoTemplate(rootTemplateHTML, templateKey, childTemplateHTML, magicKey, isArray) {
        rootTemplateHTML = this.createElemWrapper(rootTemplateHTML, templateKey, magicKey, isArray);
        const mask = new RegExp(`-=${templateKey}-${magicKey}=-`, "g");
        rootTemplateHTML = rootTemplateHTML.replace(mask, childTemplateHTML);
        return rootTemplateHTML;
    }
    createElemWrapper(htmlTemplate, templateKey, magicKey, isArray) {
        const mask = new RegExp(`-=${templateKey}=-`, "g");
        if (isArray) {
            htmlTemplate = htmlTemplate.replace(mask, `<span hypo="${magicKey}">-=${templateKey}-${magicKey}=--=${templateKey}=-</span>`);
        }
        else {
            htmlTemplate = htmlTemplate.replace(mask, `<span hypo="${magicKey}">-=${templateKey}-${magicKey}=-</span>`);
        }
        return htmlTemplate;
    }
    clearEmtpyComponent(html) {
        const regex = /-=[a-z,A-Z,0-9]+=-/g;
        return html.replace(regex, "");
    }
    rerender() {
        this.render();
    }
    getState() {
        this.store = this.createStore(this.data);
        return this.store;
    }
    createStore(store) {
        const that = this;
        const handler = {
            get(target, property) {
                return target[property];
            },
            set(target, property, value) {
                target[property] = value;
                that.rerender();
                return true;
            },
        };
        store = new Proxy(store, handler);
        Object.keys(store).forEach((field) => {
            if (typeof store[field] === "object") {
                store[field] = new Proxy(store[field], handler);
                this.createStore(store[field]);
            }
        });
        return store;
    }
    getDataWithoutIerarhy(data) {
        let pathArr = [];
        let resultObject = {};
        function fnz(obj) {
            for (let key in obj) {
                pathArr.push(key);
                if (typeof obj[key] === "object") {
                    fnz(obj[key]);
                }
                else {
                    resultObject[pathArr.join(".")] = obj[key];
                    pathArr.pop();
                }
            }
            pathArr.pop();
        }
        fnz(data);
        return resultObject;
    }
    afterRender(callback) {
        this.afterRenderCallback = callback;
        return this;
    }
    hide() {
        if (this.renderTo) {
            let children;
            children = this.renderTo.children;
            if (children) {
                for (let child of children) {
                    child.remove();
                }
            }
        }
    }
}
exports.HYPO = HYPO;


/***/ }),

/***/ "./src/libs/Router/index.ts":
/*!**********************************!*\
  !*** ./src/libs/Router/index.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Router = void 0;
class Route {
    constructor(pathname, view, props, asyncFN) {
        this._pathname = "";
        this._pathname = pathname;
        this._props = props;
        this._block = view;
        this.asyncFN = asyncFN;
    }
    navigate(pathname) {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }
    leave() {
        if (this._block) {
            this._block().hide();
        }
    }
    match(pathname) {
        return isEqual(pathname, this._pathname);
    }
    render() {
        if (!this._block) {
            return;
        }
        if (this.asyncFN) {
            this.asyncFN().then((result) => {
                var _a;
                (_a = this._block) === null || _a === void 0 ? void 0 : _a.call(this, result).render();
            });
        }
        else {
            this._block().render();
        }
    }
}
class Router {
    constructor(rootQuery) {
        this.__instance = this;
        this.routes = [];
        this.history = window.history;
        this._currentRoute = null;
        this._rootQuery = "";
        if (this.__instance) {
            return this.__instance;
        }
        this._rootQuery = rootQuery;
    }
    use(pathname, block, asyncFN) {
        const route = new Route(pathname, block, { rootQuery: this._rootQuery }, asyncFN);
        this.routes.push(route);
        return this;
    }
    start() {
        window.onpopstate = (_) => {
            let mask = new RegExp("#", "g");
            const url = window.location.hash.replace(mask, "");
            this._onRoute(url);
        };
        let mask = new RegExp("#", "g");
        const url = window.location.hash.replace(mask, "") || "/";
        this._onRoute(url);
        return this;
    }
    _onRoute(pathname) {
        const route = this.getRoute(pathname);
        if (!route) {
            return;
        }
        if (this._currentRoute) {
            this._currentRoute.leave();
        }
        this._currentRoute = route;
        this._currentRoute.render();
    }
    go(pathname) {
        this.history.pushState({}, "", `#${pathname}`);
        this._onRoute(pathname);
    }
    back() {
        this.history.back();
    }
    forward() {
        this.history.forward();
    }
    getRoute(pathname) {
        return this.routes.find((route) => route.match(pathname));
    }
}
exports.Router = Router;
function isEqual(lhs, rhs) {
    return lhs === rhs;
}


/***/ }),

/***/ "./src/libs/Transport/index.ts":
/*!*************************************!*\
  !*** ./src/libs/Transport/index.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HTTPTransport = void 0;
const METHODS = {
    GET: "GET",
    PUT: "PUT",
    POST: "POST",
    DELETE: "DELETE",
};
const DOMEN = "https://ya-praktikum.tech/api/v2";
class HTTPTransportClass {
    constructor() {
        this.defaultOptions = {
            headers: {},
            data: {},
        };
        this.GET = (url, options = this.defaultOptions) => {
            const requestParams = queryStringify(options.data);
            url += requestParams;
            return this.request(url, Object.assign(Object.assign({}, options), { method: METHODS.GET }), Number(options.timeout) || 5000);
        };
        this.PUT = (url, options = this.defaultOptions) => {
            return this.request(url, Object.assign(Object.assign({}, options), { method: METHODS.PUT }), Number(options.timeout) || 5000);
        };
        this.POST = (url, options = this
            .defaultOptions) => {
            return this.request(url, Object.assign(Object.assign({}, options), { method: METHODS.POST }), Number(options.timeout) || 5000);
        };
        this.DELETE = (url, options = this.defaultOptions) => {
            return this.request(url, Object.assign(Object.assign({}, options), { method: METHODS.DELETE }), Number(options.timeout) || 5000);
        };
        this.socket = (url) => {
            return new WebSocket(url);
        };
        this.request = (url, options, timeout = 5000) => {
            url = DOMEN + url;
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open(options.method, url);
                const headers = options.headers;
                for (let header in headers) {
                    const value = headers[header];
                    xhr.setRequestHeader(header, value);
                }
                xhr.onload = () => {
                    resolve(xhr);
                };
                xhr.onerror = (e) => {
                    reject(e);
                };
                xhr.onabort = (e) => {
                    reject(e);
                };
                setTimeout(() => {
                    xhr.abort();
                }, timeout);
                xhr.send(JSON.stringify(options.data));
            });
        };
    }
}
function queryStringify(data) {
    let requestParams = "?";
    for (let key in data) {
        requestParams += `${key}=${data[key]}&`;
    }
    requestParams = requestParams.substring(0, requestParams.length - 1);
    return requestParams;
}
exports.HTTPTransport = (() => {
    let instance;
    return {
        getInstance: () => instance || (instance = new HTTPTransportClass()),
    };
})();


/***/ }),

/***/ "./src/libs/Validators/Email/index.ts":
/*!********************************************!*\
  !*** ./src/libs/Validators/Email/index.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailValidator = void 0;
exports.EmailValidator = {
    value: "",
    checkFunc: function (value) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!reg.test(value)) {
            this.value = "";
            return false;
        }
        this.value = value;
        return true;
    },
    callback: (elem, checkResult) => {
        let state = elem.getState();
        if (!checkResult) {
            state.message = "⛔ это не похоже на адрес электронной почты";
        }
        else {
            state.message = "";
        }
    },
};


/***/ }),

/***/ "./src/libs/Validators/Required/index.ts":
/*!***********************************************!*\
  !*** ./src/libs/Validators/Required/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Required = void 0;
exports.Required = {
    value: "",
    checkFunc: function (value) {
        if (value === "") {
            this.value = "";
            return false;
        }
        this.value = value;
        return true;
    },
    callback: (elem, checkResult) => {
        let state = elem.getState();
        if (!checkResult) {
            state.message = "⛔ обязательное поле";
        }
        else {
            state.message = "";
        }
    },
};


/***/ }),

/***/ "./src/libs/utils/index.ts":
/*!*********************************!*\
  !*** ./src/libs/utils/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uuidv4 = void 0;
function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
        return `${v.toString(16)}`;
    });
}
exports.uuidv4 = uuidv4;


/***/ }),

/***/ "./src/router/index.ts":
/*!*****************************!*\
  !*** ./src/router/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RouterInit = void 0;
const Login_1 = __webpack_require__(/*! ../UI/Layouts/Login */ "./src/UI/Layouts/Login/index.ts");
const Chat_1 = __webpack_require__(/*! ../UI/Layouts/Chat */ "./src/UI/Layouts/Chat/index.ts");
const Registration_1 = __webpack_require__(/*! ../UI/Layouts/Registration */ "./src/UI/Layouts/Registration/index.ts");
const Profile_1 = __webpack_require__(/*! ../UI/Layouts/Profile */ "./src/UI/Layouts/Profile/index.ts");
const ChangeProfile_1 = __webpack_require__(/*! ../UI/Layouts/ChangeProfile */ "./src/UI/Layouts/ChangeProfile/index.ts");
const ChangePassword_1 = __webpack_require__(/*! ../UI/Layouts/ChangePassword */ "./src/UI/Layouts/ChangePassword/index.ts");
const Router_1 = __webpack_require__(/*! ../libs/Router */ "./src/libs/Router/index.ts");
const Transport_1 = __webpack_require__(/*! ../libs/Transport */ "./src/libs/Transport/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../ViewModel */ "./src/ViewModel/index.ts");
const RouterInit = (container) => {
    return new Router_1.Router("#root")
        .use("/", Login_1.LoginLayout, () => {
        return Transport_1.HTTPTransport.getInstance()
            .GET("/auth/user")
            .then((user) => {
            return JSON.parse(user.response);
        });
    })
        .use("/registration", Registration_1.RegistrationLayout)
        .use("/chat", Chat_1.ChatLayout, () => __awaiter(void 0, void 0, void 0, function* () {
        const chatViewModel = container.get(ViewModel_1.VIEW_MODEL.CHAT);
        yield chatViewModel.getChats();
        return chatViewModel.chats;
    }))
        .use("/profile", Profile_1.ProfileLayout, () => __awaiter(void 0, void 0, void 0, function* () {
        const userViewModel = container.get(ViewModel_1.VIEW_MODEL.USER);
        yield userViewModel.getUser();
        return userViewModel.user;
    }))
        .use("/editprofile", ChangeProfile_1.ChangeProfile, () => __awaiter(void 0, void 0, void 0, function* () {
        const userViewModel = container.get(ViewModel_1.VIEW_MODEL.USER);
        yield userViewModel.getUser();
        return userViewModel.user;
    }))
        .use("/editpassword", ChangePassword_1.ChangePassword)
        .start();
};
exports.RouterInit = RouterInit;


/***/ }),

/***/ "./src/libs/momize/index.js":
/*!**********************************!*\
  !*** ./src/libs/momize/index.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "memoize": () => /* binding */ memoize
/* harmony export */ });
const Cache = new Map();
function memoize(func, resolver) {
  if (
    typeof func != "function" ||
    (resolver != null && typeof resolver != "function")
  ) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function () {
    var args = arguments,
      key = resolver ? resolver.apply(this, args) : args[0],
      cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = Cache;
  return memoized;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/index.ts");
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQm9vdHN0cmFwL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0J1c3NpbmVzTGF5ZXIvQ2hhdFNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQnVzc2luZXNMYXllci9Vc2VyU2VydmljZS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9CdXNzaW5lc0xheWVyL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0luZnJhc3RzcnVjdHVyZUxheWVyL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0luZnJhc3RzcnVjdHVyZUxheWVyL2ludGVyZmFjZXMudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW50ZWdyYXRpb25hbExheWVyL0NoYXRBUEkudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW50ZWdyYXRpb25hbExheWVyL1VzZXJBUEkudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW50ZWdyYXRpb25hbExheWVyL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQXR0ZW50aW9uTWVzc2FnZS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9Db21wb25lbnRzL0J1dHRvbi9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9Db21wb25lbnRzL0NoYXRJdGVtL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQ3JlYXRlQ2hhdE1vZGFsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvRGVsZXRlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvRW1wdHkvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9JbnB1dC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9Db21wb25lbnRzL1Byb2ZpbGVJbnB1dC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL0NoYW5nZVBhc3N3b3JkL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvQ2hhbmdlUHJvZmlsZS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL0NoYXQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvTGF5b3V0cy9Mb2dpbi9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL1Byb2ZpbGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvTGF5b3V0cy9SZWdpc3RyYXRpb24vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVmlld01vZGVsL0NoYXRWaWV3TW9kZWwvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVmlld01vZGVsL1VzZXJWaWV3TW9kZWwvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVmlld01vZGVsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvQ29udGFpbmVyL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvSFlQTy9IWVBPLnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvUm91dGVyL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvVHJhbnNwb3J0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvVmFsaWRhdG9ycy9FbWFpbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL1ZhbGlkYXRvcnMvUmVxdWlyZWQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy91dGlscy9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9yb3V0ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9tb21pemUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsS0FBSztBQUNMLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0MsV0FBVztBQUNuRDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQyxjQUFjO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxrQkFBa0I7QUFDbkQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGlCQUFpQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIGRlZmluZShvYmosIGtleSwgdmFsdWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBvYmpba2V5XTtcbiAgfVxuICB0cnkge1xuICAgIC8vIElFIDggaGFzIGEgYnJva2VuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGF0IG9ubHkgd29ya3Mgb24gRE9NIG9iamVjdHMuXG4gICAgZGVmaW5lKHt9LCBcIlwiKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZGVmaW5lID0gZnVuY3Rpb24ob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgICByZXR1cm4gb2JqW2tleV0gPSB2YWx1ZTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgZXhwb3J0cy53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBkZWZpbmUoXG4gICAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUsXG4gICAgdG9TdHJpbmdUYWdTeW1ib2wsXG4gICAgXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICk7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgZGVmaW5lKHByb3RvdHlwZSwgbWV0aG9kLCBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgZGVmaW5lKGdlbkZ1biwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yRnVuY3Rpb25cIik7XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgIGlmIChQcm9taXNlSW1wbCA9PT0gdm9pZCAwKSBQcm9taXNlSW1wbCA9IFByb21pc2U7XG5cbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksXG4gICAgICBQcm9taXNlSW1wbFxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgZGVmaW5lKEdwLCB0b1N0cmluZ1RhZ1N5bWJvbCwgXCJHZW5lcmF0b3JcIik7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG59XG4iLCJpbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcbmltcG9ydCB7IGluZnJhc3RydWN0dXJlQ29udGFpbmVyIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyXCI7XG5pbXBvcnQgeyBBcGlDbGllbnRDb250YWluZXIgfSBmcm9tIFwiLi4vSW50ZWdyYXRpb25hbExheWVyXCI7XG5pbXBvcnQgeyBTZXJ2aWNlQ29udGFpbmVyIH0gZnJvbSBcIi4uL0J1c3NpbmVzTGF5ZXJcIjtcbmltcG9ydCB7IFZpZXdNb2RlbENvbnRhaW5lciB9IGZyb20gXCIuLi9WaWV3TW9kZWxcIjtcblxuY29uc3QgQ3JlYXRlRElDb250YWluZXIgPSAoXG4gIGluZnJhc3RydWN0dXJlQ29udGFpbmVyOiBDb250YWluZXIsXG4gIGludGVncmVhdGlvbkNvbnRhaW5lcjogQ29udGFpbmVyLFxuICBzZXJ2aWNlQ29udGFpbmVyOiBDb250YWluZXIsXG4gIHZpZXdNb2RlbENvbnRhaW5lcjogQ29udGFpbmVyXG4pID0+IHtcbiAgcmV0dXJuIHZpZXdNb2RlbENvbnRhaW5lclxuICAgIC5wYXJlbnQoc2VydmljZUNvbnRhaW5lcilcbiAgICAucGFyZW50KGludGVncmVhdGlvbkNvbnRhaW5lcilcbiAgICAucGFyZW50KGluZnJhc3RydWN0dXJlQ29udGFpbmVyKTtcbn07XG5cbmV4cG9ydCBjbGFzcyBCb290U3RyYXAge1xuICBjb250YWluZXI6IENvbnRhaW5lcjtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBDcmVhdGVESUNvbnRhaW5lcihcbiAgICAgIGluZnJhc3RydWN0dXJlQ29udGFpbmVyLFxuICAgICAgQXBpQ2xpZW50Q29udGFpbmVyLFxuICAgICAgU2VydmljZUNvbnRhaW5lcixcbiAgICAgIFZpZXdNb2RlbENvbnRhaW5lclxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7IElDaGF0RFRPIH0gZnJvbSBcIi4uL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcbmltcG9ydCB7IElDaGF0QVBJQ2xpZW50IH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllci9DaGF0QVBJXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNoYXRTZXJ2aWNlIHtcbiAgZ2V0Q2hhdHM6ICgpID0+IFByb21pc2U8QXJyYXk8SUNoYXREVE8+PjtcbiAgc2F2ZUNoYXQ6IChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiBQcm9taXNlPHZvaWQ+O1xuICBkZWxldGVDaGF0OiAoY2hhdElkOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBDaGF0U2VydmljZSBpbXBsZW1lbnRzIElDaGF0U2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBBcGlDbGllbnQ6IElDaGF0QVBJQ2xpZW50KSB7fVxuXG4gIGdldENoYXRzID0gKCk6IFByb21pc2U8QXJyYXk8SUNoYXREVE8+PiA9PiB7XG4gICAgcmV0dXJuIHRoaXMuQXBpQ2xpZW50LmdldENoYXRzKCk7XG4gIH07XG5cbiAgc2F2ZUNoYXQgPSAoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4ge1xuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5zYXZlQ2hhdChkYXRhKTtcbiAgfTtcblxuICBkZWxldGVDaGF0KGNoYXRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuQXBpQ2xpZW50LmRlbGV0ZUNoYXQoY2hhdElkKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSVVzZXJBUElDbGllbnQgfSBmcm9tIFwiLi4vSW50ZWdyYXRpb25hbExheWVyL1VzZXJBUElcIjtcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvUHJvZmlsZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyU2VydmljZSB7XG4gIGdldFVzZXIoKTogUHJvbWlzZTxJUHJvZmlsZURUTz47XG4gIHNhdmVVc2VyKHVzZXI6SVByb2ZpbGVEVE8pOlByb21pc2U8SVByb2ZpbGVEVE8+O1xufVxuXG5leHBvcnQgY2xhc3MgVXNlclNlcnZpY2UgaW1wbGVtZW50cyBJVXNlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgQXBpQ2xpZW50OiBJVXNlckFQSUNsaWVudCkge31cbiAgc2F2ZVVzZXIodXNlcjpJUHJvZmlsZURUTyk6UHJvbWlzZTxJUHJvZmlsZURUTz57XG4gICAgcmV0dXJuIHRoaXMuQXBpQ2xpZW50LnNhdmVVc2VyKHVzZXIpXG4gIH1cbiAgZ2V0VXNlcigpIHtcbiAgICByZXR1cm4gdGhpcy5BcGlDbGllbnQuZ2V0VXNlcigpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBUElfQ0xJRU5UIH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllclwiO1xuaW1wb3J0IHsgSUNoYXRBUElDbGllbnQgfSBmcm9tIFwiLi4vSW50ZWdyYXRpb25hbExheWVyL0NoYXRBUElcIjtcbmltcG9ydCB7IElVc2VyQVBJQ2xpZW50IH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllci9Vc2VyQVBJXCI7XG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcbmltcG9ydCB7IENoYXRTZXJ2aWNlIH0gZnJvbSBcIi4vQ2hhdFNlcnZpY2VcIjtcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSBcIi4vVXNlclNlcnZpY2VcIjtcblxuZXhwb3J0IGNvbnN0IFNFUlZJQ0UgPSB7XG4gIENIQVQ6IFN5bWJvbC5mb3IoXCJDaGF0U2VydmljZVwiKSxcbiAgVVNFUjogU3ltYm9sLmZvcihcIlVzZXJTZXJ2Y2llXCIpLFxufTtcblxuZXhwb3J0IGNvbnN0IFNlcnZpY2VDb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XG5cblNlcnZpY2VDb250YWluZXIuYmluZChTRVJWSUNFLkNIQVQpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgY29uc3QgQVBJQ2xpZW50ID0gY29udGFpbmVyLmdldDxJQ2hhdEFQSUNsaWVudD4oQVBJX0NMSUVOVC5DSEFUKTtcbiAgcmV0dXJuIG5ldyBDaGF0U2VydmljZShBUElDbGllbnQpO1xufSk7XG5cblNlcnZpY2VDb250YWluZXIuYmluZChTRVJWSUNFLlVTRVIpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgY29uc3QgQVBJQ2xpZW50ID0gY29udGFpbmVyLmdldDxJVXNlckFQSUNsaWVudD4oQVBJX0NMSUVOVC5VU0VSKTtcbiAgcmV0dXJuIG5ldyBVc2VyU2VydmljZShBUElDbGllbnQpO1xufSk7XG4iLCJpbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcbmltcG9ydCB7IEFQSU1vZHVsZSB9IGZyb20gXCIuL2ludGVyZmFjZXNcIjtcblxuZXhwb3J0IGNvbnN0IElOVEVHUkFUSU9OX01PRFVMRSA9IHtcbiAgQVBJTW9kdWxlOiBTeW1ib2wuZm9yKFwiQVBJXCIpLFxufTtcblxuZXhwb3J0IGNvbnN0IGluZnJhc3RydWN0dXJlQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcigpO1xuXG5pbmZyYXN0cnVjdHVyZUNvbnRhaW5lclxuICAuYmluZChJTlRFR1JBVElPTl9NT0RVTEUuQVBJTW9kdWxlKVxuICAudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuICAgIHJldHVybiBuZXcgQVBJTW9kdWxlKCk7XG4gIH0pO1xuIiwiaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi9saWJzL1RyYW5zcG9ydFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElBUElNb2R1bGUge1xuICBnZXREYXRhOiA8UD4odXJsOiBzdHJpbmcsIHBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4gUHJvbWlzZTxQPjtcbiAgcG9zdERhdGE6IDxQIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4oXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgcGFyYW1zOiBQXG4gICkgPT4gUHJvbWlzZTxQPjtcbiAgcHV0RGF0YTogPFA+KHVybDogc3RyaW5nLCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IFByb21pc2U8UD47XG4gIGRlbGV0ZURhdGE6ICh1cmw6IHN0cmluZywgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuXG5leHBvcnQgY2xhc3MgQVBJTW9kdWxlIGltcGxlbWVudHMgSUFQSU1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgZ2V0RGF0YSA9IDxQPih1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8UD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgIC5HRVQodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgcG9zdERhdGEgPSBhc3luYyA8UCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KFxuICAgIHVybDogc3RyaW5nLFxuICAgIGRhdGE6IFBcbiAgKTogUHJvbWlzZTxQPiA9PiB7XG4gICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxuICAgICAgLlBPU1QodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgZGVsZXRlRGF0YSA9ICh1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgIC5ERUxFVEUodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgcHV0RGF0YSA9IDxQPih1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8UD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKCkuUFVUKHVybCwgdGhpcy5nZXRQYXJtcyhkYXRhKSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBnZXRQYXJtczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4oXG4gICAgZGF0YTogVFxuICApOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICB9LFxuICAgICAgZGF0YToge1xuICAgICAgICAuLi5kYXRhLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBJQVBJTW9kdWxlIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IElDaGF0RFRPIH0gZnJvbSBcIi4uL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ2hhdEFQSUNsaWVudCB7XG4gIGdldENoYXRzKCk6IFByb21pc2U8QXJyYXk8SUNoYXREVE8+PjtcbiAgc2F2ZUNoYXQoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD47XG4gIGRlbGV0ZUNoYXQoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBDaGF0QVBJQ2xpZW50IGltcGxlbWVudHMgSUNoYXRBUElDbGllbnQge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgQVBJTW9kdWxlOiBJQVBJTW9kdWxlKSB7fVxuXG4gIGdldENoYXRzID0gYXN5bmMgKCk6IFByb21pc2U8QXJyYXk8SUNoYXREVE8+PiA9PiB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuQVBJTW9kdWxlLmdldERhdGE8SUNoYXREVE9bXT4oXCIvY2hhdHNcIiwge30pLnRoZW4oXG4gICAgICAocmVzdWx0KSA9PiB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgKTtcbiAgfTtcblxuICBzYXZlQ2hhdCA9IGFzeW5jIChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgYXdhaXQgdGhpcy5BUElNb2R1bGUucG9zdERhdGEoXCIvY2hhdHNcIiwgZGF0YSk7XG4gIH07XG5cbiAgZGVsZXRlQ2hhdChpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuQVBJTW9kdWxlLmRlbGV0ZURhdGEoXCIvY2hhdHNcIiwgeyBjaGF0SWQ6IGlkIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJQVBJTW9kdWxlIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvUHJvZmlsZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyQVBJQ2xpZW50IHtcbiAgZ2V0VXNlcigpOiBQcm9taXNlPElQcm9maWxlRFRPPjtcbiAgc2F2ZVVzZXIodXNlcjogSVByb2ZpbGVEVE8pOiBQcm9taXNlPElQcm9maWxlRFRPPlxufVxuXG5leHBvcnQgY2xhc3MgVXNlckFQSUNsaWVudCBpbXBsZW1lbnRzIElVc2VyQVBJQ2xpZW50IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIEFQSU1vZHVsZTogSUFQSU1vZHVsZSkgeyB9XG5cbiAgZ2V0VXNlciA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgdGhpcy5BUElNb2R1bGUuZ2V0RGF0YTxJUHJvZmlsZURUTz4oXCIvYXV0aC91c2VyXCIsIHt9KTtcbiAgICByZXR1cm4gdXNlcjtcbiAgfTtcblxuICBzYXZlVXNlciA9ICh1c2VyOiBJUHJvZmlsZURUTykgPT4ge1xuICAgIHJldHVybiB0aGlzLkFQSU1vZHVsZS5wdXREYXRhPElQcm9maWxlRFRPPignL3VzZXIvcHJvZmlsZScsIHVzZXIpXG4gIH1cbn1cbiIsImltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xuaW1wb3J0IHsgSU5URUdSQVRJT05fTU9EVUxFIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyXCI7XG5pbXBvcnQgeyBDaGF0QVBJQ2xpZW50IH0gZnJvbSBcIi4vQ2hhdEFQSVwiO1xuaW1wb3J0IHsgSUFQSU1vZHVsZSB9IGZyb20gXCIuLi9JbmZyYXN0c3J1Y3R1cmVMYXllci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBVc2VyQVBJQ2xpZW50IH0gZnJvbSBcIi4vVXNlckFQSVwiO1xuXG5leHBvcnQgY29uc3QgQVBJX0NMSUVOVCA9IHtcbiAgQ0hBVDogU3ltYm9sLmZvcihcIkNoYXRBUElDbGllbnRcIiksXG4gIFVTRVI6IFN5bWJvbC5mb3IoXCJVc2VyQVBJQ2xpZW50XCIpLFxufTtcblxuZXhwb3J0IGNvbnN0IEFwaUNsaWVudENvbnRhaW5lciA9IG5ldyBDb250YWluZXIoKTtcblxuQXBpQ2xpZW50Q29udGFpbmVyLmJpbmQoQVBJX0NMSUVOVC5DSEFUKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gIGNvbnN0IEFQSU1vZHVsZSA9IGNvbnRhaW5lci5nZXQ8SUFQSU1vZHVsZT4oSU5URUdSQVRJT05fTU9EVUxFLkFQSU1vZHVsZSk7XG4gIHJldHVybiBuZXcgQ2hhdEFQSUNsaWVudChBUElNb2R1bGUpO1xufSk7XG5cbkFwaUNsaWVudENvbnRhaW5lci5iaW5kKEFQSV9DTElFTlQuVVNFUikudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuICBjb25zdCBBUElNb2R1bGUgPSBjb250YWluZXIuZ2V0PElBUElNb2R1bGU+KElOVEVHUkFUSU9OX01PRFVMRS5BUElNb2R1bGUpO1xuICByZXR1cm4gbmV3IFVzZXJBUElDbGllbnQoQVBJTW9kdWxlKTtcbn0pO1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuXG5leHBvcnQgY29uc3QgQXR0ZW50aW9uTWVzc2FnZSA9ICgpOiBIWVBPID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiYXR0ZW50aW9uLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBtZXNzYWdlOiBcIlwiLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHt9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyB1dWlkdjQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy91dGlsc1wiO1xuXG5pbnRlcmZhY2UgSVByb3BzIHtcbiAgaWQ/OiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGNsYXNzTmFtZTogc3RyaW5nO1xuICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBjb25zdCBCdXR0b24gPSAocHJvcHM6IElQcm9wcykgPT4ge1xuICBjb25zdCBpZCA9IHByb3BzLmlkIHx8IHV1aWR2NCgpO1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJidXR0b24udGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHRpdGxlOiBwcm9wcy50aXRsZSxcbiAgICAgIGNsYXNzTmFtZTogcHJvcHMuY2xhc3NOYW1lLFxuICAgIH0sXG4gIH0pLmFmdGVyUmVuZGVyKCgpID0+IHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgcHJvcHMub25DbGljayhlKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgY29udGFpbmVyLCByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IENoYXRMYXlvdXQgfSBmcm9tIFwiLi4vLi4vTGF5b3V0cy9DaGF0XCI7XG5pbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVHJhbnNwb3J0XCI7XG5pbXBvcnQgeyBEZWxldGUgfSBmcm9tIFwiLi4vRGVsZXRlXCI7XG5pbXBvcnQgeyBWSUVXX01PREVMIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgSUNoYXRWaWV3TW9kZWwgfSBmcm9tIFwiLi4vLi4vLi4vVmlld01vZGVsL0NoYXRWaWV3TW9kZWxcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ2hhdERUTyB7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGF2YXRhcjogc3RyaW5nIHwgbnVsbDtcbiAgY3JlYXRlZF9ieTogbnVtYmVyO1xuICBpZDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSVByb3BzIGV4dGVuZHMgSUNoYXREVE8ge1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBDaGF0SXRlbSA9IChwcm9wczogSUNoYXREVE8pID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiY2hhdEl0ZW0udGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIENoYXROYW1lOiBwcm9wcy50aXRsZSxcbiAgICAgIGxhc3RUaW1lOiBwcm9wcy5jcmVhdGVkX2J5IHx8IFwiMTA6MjJcIixcbiAgICAgIGxhc3RNZXNzYWdlOiBwcm9wcy5pZCB8fCBcIkhpLCBob3cgYXJlIHlvdT9cIixcbiAgICAgIG5vdGlmaWNhdGlvbkNvdW50OiBwcm9wcy5hdmF0YXIgfHwgMyxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBkZWxldGU6IERlbGV0ZSh7XG4gICAgICAgIGlkOiBgZGVsZXRlSXRlbSR7cHJvcHMuaWR9YCxcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNoYXRWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElDaGF0Vmlld01vZGVsPihWSUVXX01PREVMLkNIQVQpO1xuICAgICAgICAgIGNoYXRWaWV3TW9kZWwuZGVsZXRlQ2hhdChTdHJpbmcocHJvcHMuaWQpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIENoYXRMYXlvdXQoY2hhdFZpZXdNb2RlbC5jaGF0cykucmVuZGVyKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBjb250YWluZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IFJlcXVpcmVkIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZFwiO1xuaW1wb3J0IHsgQXR0ZW50aW9uTWVzc2FnZSB9IGZyb20gXCIuLi9BdHRlbnRpb25NZXNzYWdlXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vQnV0dG9uXCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9JbnB1dFwiO1xuaW1wb3J0IHsgSUNoYXRWaWV3TW9kZWwgfSBmcm9tIFwiLi4vLi4vLi4vVmlld01vZGVsL0NoYXRWaWV3TW9kZWxcIjtcbmltcG9ydCB7IENoYXRMYXlvdXQgfSBmcm9tIFwiLi4vLi4vTGF5b3V0cy9DaGF0XCI7XG5pbXBvcnQgeyBWSUVXX01PREVMIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbFwiO1xuXG5leHBvcnQgY29uc3QgQ3JlYXRlQ2hhdE1vZGFsID0gKCkgPT4ge1xuICBjb25zdCBhdHRlbnRpb25NZXNzYWdlID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBzdGF0ZSA9IGF0dGVudGlvbk1lc3NhZ2UuZ2V0U3RhdGUoKTtcblxuICBsZXQgQ2hhdE5hbWUgPSBcIlwiO1xuXG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImNyZWF0ZWNoYXRtb2RhbC50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge30sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIGlucHV0OiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiBcIkNoYXQgbmFtZVwiLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgbmFtZTogXCJjaGF0bmFtZVwiLFxuICAgICAgICBpZDogXCJjaGF0bmFtZVwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYy1jLW1vZGFsX19pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogYXR0ZW50aW9uTWVzc2FnZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgICAgQ2hhdE5hbWUgPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgY3JlYXRlOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQodC+0LfQtNCw0YLRjFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiY3JlYXRlLWJ1dHRvblwiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoIUNoYXROYW1lKSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNoYXRWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElDaGF0Vmlld01vZGVsPihcbiAgICAgICAgICAgICAgVklFV19NT0RFTC5DSEFUXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY2hhdFZpZXdNb2RlbC5zYXZlQ2hhdCh7IHRpdGxlOiBDaGF0TmFtZSB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAgICAgICAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImMtYy1tb2RhbFwiKVswXVxuICAgICAgICAgICAgICAgIC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgICBDaGF0TGF5b3V0KGNoYXRWaWV3TW9kZWwuY2hhdHMpLnJlbmRlcigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBjYW5jZWw6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCe0YLQvNC10L3QsFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiY2FuY2VsLWJ1dHRvblwiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjLWMtbW9kYWxcIilbMF1cbiAgICAgICAgICAgIC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuXG5pbnRlcmZhY2UgSVByb3BzIHtcbiAgaWQ6IHN0cmluZztcbiAgb25DbGljazogKCkgPT4gdm9pZDtcbn1cbmV4cG9ydCBjb25zdCBEZWxldGUgPSAocHJvcHM6IElQcm9wcykgPT4ge1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJkZWxldGUudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIHBhdGg6IFwiL21lZGlhL1ZlY3Rvci5zdmdcIixcbiAgICAgIGlkOiBwcm9wcy5pZCxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7fSxcbiAgfSkuYWZ0ZXJSZW5kZXIoKCkgPT4ge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByb3BzLmlkKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIHByb3BzLm9uQ2xpY2soKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuXG5leHBvcnQgY29uc3QgRW1wdHkgPSAoKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImVtcHR5LnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7fSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgRW1wdHkgfSBmcm9tIFwiLi4vRW1wdHlcIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHR5cGU6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBpZDogc3RyaW5nO1xuICBjbGFzc05hbWU6IHN0cmluZztcbiAgQ2hpbGRBdHRlbnRpb24/OiBIWVBPO1xuICBvbkZvY3VzPzogKGU6IEV2ZW50KSA9PiB2b2lkO1xuICBvbkJsdXI/OiAoZTogRXZlbnQpID0+IHZvaWQ7XG59XG5cbi8vQHRvZG86INC/0YDQuNC60YDRg9GC0LjRgtGMINGD0L3QuNC60LDQu9GM0L3QvtGB0YLRjCDQutCw0LbQtNC+0LPQviDRjdC70LXQvNC10L3RgtCwXG5cbmV4cG9ydCBjb25zdCBJbnB1dCA9IChwcm9wczogSVByb3BzKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImlucHV0LnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBsYWJlbDoge1xuICAgICAgICBuYW1lOiBwcm9wcy5sYWJlbCxcbiAgICAgIH0sXG4gICAgICBhdHJpYnV0ZToge1xuICAgICAgICB0eXBlOiBwcm9wcy50eXBlLFxuICAgICAgICBuYW1lOiBwcm9wcy5uYW1lLFxuICAgICAgICBpZDogcHJvcHMuaWQsXG4gICAgICAgIGNsYXNzTmFtZTogcHJvcHMuY2xhc3NOYW1lLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBBdHRlbnRpb246IHByb3BzLkNoaWxkQXR0ZW50aW9uIHx8IEVtcHR5KCksXG4gICAgfSxcbiAgfSkuYWZ0ZXJSZW5kZXIoKCkgPT4ge1xuICAgIGRvY3VtZW50XG4gICAgICAuZ2V0RWxlbWVudEJ5SWQocHJvcHMuaWQpXG4gICAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoZTogRm9jdXNFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGlucHV0TGFiZWwgPSBpbnB1dC5wYXJlbnRFbGVtZW50Py5wYXJlbnRFbGVtZW50Py5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIFwiLmZvcm0taW5wdXRfX2xhYmVsXCJcbiAgICAgICAgKTtcbiAgICAgICAgaW5wdXRMYWJlbD8uY2xhc3NMaXN0LmFkZChcImZvcm0taW5wdXRfX2xhYmVsX3NlbGVjdFwiKTtcbiAgICAgICAgcHJvcHMub25Gb2N1cz8uKGUpO1xuICAgICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJvcHMuaWQpPy5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoZTogRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgIGNvbnN0IGlucHV0TGFiZWwgPSBpbnB1dC5wYXJlbnRFbGVtZW50Py5wYXJlbnRFbGVtZW50Py5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBcIi5mb3JtLWlucHV0X19sYWJlbFwiXG4gICAgICApO1xuICAgICAgaWYgKCFpbnB1dC52YWx1ZSkge1xuICAgICAgICBpbnB1dExhYmVsPy5jbGFzc0xpc3QucmVtb3ZlKFwiZm9ybS1pbnB1dF9fbGFiZWxfc2VsZWN0XCIpO1xuICAgICAgfVxuICAgICAgcHJvcHMub25CbHVyPy4oZSk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHZhbHVlOiBzdHJpbmc7XG4gIGlkOiBzdHJpbmc7XG4gIG9uQ2hhZ2U6IChlOiB7IHZhbHVlOiBzdHJpbmcgfSkgPT4gdm9pZDtcbn1cbmV4cG9ydCBjb25zdCBQcm9maWxlSW5wdXQgPSAoeyBsYWJlbCwgdmFsdWUsIGlkLCBvbkNoYWdlIH06IElQcm9wcykgPT4ge1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJwcm9maWxlSW5wdXQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGlkOiBpZCxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBpbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKCkgPT4ge1xuICAgICAgb25DaGFnZSh7IHZhbHVlOiBpbnB1dC52YWx1ZSB9KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcbmltcG9ydCB7IG1lbW9pemUgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9tb21pemVcIjtcblxuZXhwb3J0IGNvbnN0IENoYW5nZVBhc3N3b3JkID0gbWVtb2l6ZSgoKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiI3Jvb3RcIikgfHwgZG9jdW1lbnQuYm9keSxcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiY2hhbmdlUGFzc3dvcmQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHt9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBzYXZlOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQodC+0YXRgNCw0L3QuNGC0YxcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcInBhc3N3b3JkX2VkaXRfX2FjdGlvbl9fc2F2ZVwiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvcHJvZmlsZVwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBjb250YWluZXIsIHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLlwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi9Qcm9maWxlXCI7XG5pbXBvcnQgeyBJVXNlclZpZXdNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWwvVXNlclZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWxcIjtcbmltcG9ydCB7IFByb2ZpbGVJbnB1dCB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL1Byb2ZpbGVJbnB1dFwiO1xuXG5jb25zdCBDb25maWc6IHsgW2tleSBpbiBrZXlvZiBJUHJvZmlsZURUT10/OiB7IGxhYmVsOiBzdHJpbmcgfSB9ID0ge1xuICBlbWFpbDoge1xuICAgIGxhYmVsOiBcItCf0L7Rh9GC0LBcIixcbiAgfSxcbiAgbG9naW46IHtcbiAgICBsYWJlbDogXCLQm9C+0LPQuNC9XCIsXG4gIH0sXG4gIGZpcnN0X25hbWU6IHtcbiAgICBsYWJlbDogXCLQmNC80Y9cIixcbiAgfSxcbiAgc2Vjb25kX25hbWU6IHtcbiAgICBsYWJlbDogXCLQpNCw0LzQuNC70LjRj1wiLFxuICB9LFxuICBkaXNwbGF5X25hbWU6IHtcbiAgICBsYWJlbDogXCLQmNC80Y8g0LIg0YfQsNGC0LDRhVwiLFxuICB9LFxuICBwaG9uZToge1xuICAgIGxhYmVsOiBcItCi0LXQu9C10YTQvtC9XCIsXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgQ2hhbmdlUHJvZmlsZSA9IChkYXRhOiBJUHJvZmlsZURUTykgPT4ge1xuICBjb25zdCB1c2VyVmlld01vZGVsID0gY29udGFpbmVyLmdldDxJVXNlclZpZXdNb2RlbD4oVklFV19NT0RFTC5VU0VSKTtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpIHx8IGRvY3VtZW50LmJvZHksXG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYW5nZVByb2ZpbGUudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIGVtYWlsOiBkYXRhPy5lbWFpbCxcbiAgICAgIGxvZ2luOiBkYXRhPy5sb2dpbixcbiAgICAgIGZpcnN0TmFtZTogZGF0YT8uZmlyc3RfbmFtZSxcbiAgICAgIHNlY29uZE5hbWU6IGRhdGE/LnNlY29uZF9uYW1lLFxuICAgICAgZGlzcGxheU5hbWU6IGRhdGE/LmRpc3BsYXlfbmFtZSB8fCBcIlwiLFxuICAgICAgcGhvbmU6IGRhdGE/LnBob25lLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIHNhdmU6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCh0L7RhdGA0LDQvdC40YLRjFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwicHJvZmlsZV9lZGl0X19hY3Rpb25fX3NhdmVcIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKHVzZXJWaWV3TW9kZWwudXNlcikge1xuICAgICAgICAgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXG4gICAgICAgICAgICAgIFwicHJvZmlsZV9lZGl0XCJcbiAgICAgICAgICAgIClbMF0gYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgICAgICAgICAgY29uc29sZS5sb2codXNlclZpZXdNb2RlbC51c2VyKTtcbiAgICAgICAgICAgIHVzZXJWaWV3TW9kZWwuc2F2ZVVzZXIodXNlclZpZXdNb2RlbC51c2VyKS5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICAgICAgcm91dGVyLmdvKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGlucHV0czogT2JqZWN0LmtleXMoQ29uZmlnKVxuICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgIC5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICBjb25zdCBrZXkgPSBpdGVtIGFzIGtleW9mIHR5cGVvZiBkYXRhO1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gQ29uZmlnW2l0ZW0gYXMga2V5b2YgdHlwZW9mIENvbmZpZ10/LmxhYmVsIGFzIHN0cmluZztcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IGRhdGEgPyAoZGF0YVtrZXldIGFzIHN0cmluZykgOiBcIlwiO1xuICAgICAgICAgIHJldHVybiBQcm9maWxlSW5wdXQoe1xuICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgaWQ6IGtleSxcbiAgICAgICAgICAgIG9uQ2hhZ2U6ICh7IHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2codmFsdWUpO1xuICAgICAgICAgICAgICB1c2VyVmlld01vZGVsLnVzZXIgPSB7XG4gICAgICAgICAgICAgICAgLi4udXNlclZpZXdNb2RlbC51c2VyLFxuICAgICAgICAgICAgICAgIFtpdGVtXTogdmFsdWUsXG4gICAgICAgICAgICAgIH0gYXMgSVByb2ZpbGVEVE87XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBDaGF0SXRlbSwgSUNoYXREVE8gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9DaGF0SXRlbVwiO1xuaW1wb3J0IHsgY29udGFpbmVyLCByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuaW1wb3J0IHsgRW1wdHkgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9FbXB0eVwiO1xuaW1wb3J0IHsgQ3JlYXRlQ2hhdE1vZGFsIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQ3JlYXRlQ2hhdE1vZGFsXCI7XG5pbXBvcnQgeyBJVXNlclZpZXdNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWwvVXNlclZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWxcIjtcblxuZXhwb3J0IGNvbnN0IENoYXRMYXlvdXQgPSAocmVzdWx0OiBJQ2hhdERUT1tdKSA9PiB7XG4gIGNvbnN0IENoYXRJdGVtTGlzdDogSFlQT1tdID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICByZXN1bHQuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBDaGF0SXRlbUxpc3QucHVzaChDaGF0SXRlbSh7IC4uLml0ZW0gfSkpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIENoYXRJdGVtTGlzdC5wdXNoKEVtcHR5KCkpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpIHx8IGRvY3VtZW50LmJvZHksXG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYXQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHt9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBQcm9maWxlTGluazogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwiUHJvZmlsZVwiLFxuICAgICAgICBjbGFzc05hbWU6IFwicHJvZmlsZS1saW5rX19idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGNoYXRJdGVtOiBDaGF0SXRlbUxpc3QsXG4gICAgICBjcmVhdGVDaGF0TW9kYWw6IENyZWF0ZUNoYXRNb2RhbCgpLFxuICAgICAgY3JlYXRlQ2hhdEJ1dHRvbjogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwiK1wiLFxuICAgICAgICBjbGFzc05hbWU6IFwibmF2aWdhdGlvbl9fY3JlYXRlQ2hhdEJ1dHRvblwiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYy1jLW1vZGFsXCIpWzBdXG4gICAgICAgICAgICAuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvSW5wdXRcIjtcbmltcG9ydCB7IFJlcXVpcmVkIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZFwiO1xuaW1wb3J0IHsgQXR0ZW50aW9uTWVzc2FnZSB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0F0dGVudGlvbk1lc3NhZ2VcIjtcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLi9pbmRleFwiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi9Qcm9maWxlXCI7XG5cbi8qKlxuICogbm5ucnJyMTExTk5cbiAqL1xuXG5leHBvcnQgY29uc3QgTG9naW5MYXlvdXQgPSAodXNlcjogSVByb2ZpbGVEVE8pOiBIWVBPID0+IHtcbiAgaWYgKHVzZXIgJiYgdXNlci5pZCkge1xuICAgIHJvdXRlci5nbyhcIi9jaGF0XCIpO1xuICB9XG5cbiAgY29uc3QgYXR0ZW50aW9uTG9naW4gPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IGF0dGVudGlvbkxvZ2luU3RvcmUgPSBhdHRlbnRpb25Mb2dpbi5nZXRTdGF0ZSgpO1xuICBjb25zdCBhdHRlbnRpb25QYXNzID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBhdHRlbnRpb25QYXNzU3RvcmUgPSBhdHRlbnRpb25QYXNzLmdldFN0YXRlKCk7XG5cbiAgY29uc3QgRm9ybURhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpIHx8IGRvY3VtZW50LmJvZHksXG4gICAgdGVtcGxhdGVQYXRoOiBcImxvZ2luLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBGb3JtTmFtZTogXCLQktGF0L7QtFwiLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIElucHV0TG9naW46IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0JvQvtCz0LjQvVwiLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgbmFtZTogXCJsb2dpblwiLFxuICAgICAgICBpZDogXCJmb3JtLWlucHV0LWxvZ2luXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWxvZ2luX19mb3JtLWlucHV0XCIsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGNvbnN0IGNoZWNrID0gUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0Py52YWx1ZSk7XG4gICAgICAgICAgaWYgKCFjaGVjaykge1xuICAgICAgICAgICAgYXR0ZW50aW9uTG9naW5TdG9yZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dGVudGlvbkxvZ2luU3RvcmUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgICBGb3JtRGF0YVtcImxvZ2luXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogYXR0ZW50aW9uTG9naW4sXG4gICAgICB9KSxcbiAgICAgIElucHV0UGFzc3dvcmQ6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0J/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbmFtZTogXCJwYXNzd29yZFwiLFxuICAgICAgICBpZDogXCJmb3JtLWlucHV0LXBhc3N3b3JkXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWxvZ2luX19mb3JtLWlucHV0XCIsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmICghUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgYXR0ZW50aW9uUGFzc1N0b3JlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0ZW50aW9uUGFzc1N0b3JlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgICAgRm9ybURhdGFbXCJwYXNzd29yZFwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IGF0dGVudGlvblBhc3MsXG4gICAgICB9KSxcbiAgICAgIEJ1dHRvbjogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0JDQstGC0L7RgNC40LfQvtCy0LDRgtGM0YHRj1wiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgZGF0YTogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGxvZ2luOiBGb3JtRGF0YS5sb2dpbixcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6IEZvcm1EYXRhLnBhc3N3b3JkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAgICAgICAuUE9TVChcIi9hdXRoL3NpZ25pblwiLCBkYXRhKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgIHJvdXRlci5nbyhcIi9jaGF0XCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgTGlua1RvUmVnaXN0cmF0aW9uOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y9cIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tbGlua1wiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvcmVnaXN0cmF0aW9uXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9UcmFuc3BvcnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJUHJvZmlsZURUTyB7XG4gIGlkOiBudW1iZXI7XG4gIGRpc3BsYXlfbmFtZTogc3RyaW5nO1xuICBlbWFpbDogc3RyaW5nO1xuICBmaXJzdF9uYW1lOiBzdHJpbmc7XG4gIHNlY29uZF9uYW1lOiBzdHJpbmc7XG4gIGxvZ2luOiBzdHJpbmc7XG4gIHBob25lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBQcm9maWxlTGF5b3V0ID0gKGRhdGE6IElQcm9maWxlRFRPKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jvb3RcIiksXG4gICAgdGVtcGxhdGVQYXRoOiBcInByb2ZpbGUudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIC4uLmRhdGEsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgRWRpdFByb2ZpbGVMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQmNC30LzQtdC90LjRgtGMINC00LDQvdC90YvQtVwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19jaGFuZ2UtcHJvZmlsZVwiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL2VkaXRwcm9maWxlXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBFZGl0UGFzc3dvcmRMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQmNC30LzQtdC90LjRgtGMINC/0LDRgNC+0LvRjFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19jaGFuZ2UtcGFzc3dvcmRcIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9lZGl0cGFzc3dvcmRcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIEJhY2tMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQndCw0LfQsNC0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2JhY2tcIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9jaGF0XCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBFeGl0TGluazogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0JLRi9C50YLQuFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19leGl0XCIsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgICAgICAgIC5QT1NUKFwiL2F1dGgvbG9nb3V0XCIpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJvdXRlci5nbyhcIi9cIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvSW5wdXRcIjtcbi8vIGltcG9ydCB7IFZhbGlkYXRvciwgUnVsZSB9IGZyb20gXCIuLi8uLi9saWJzL1ZhbGlkYXRvclwiO1xuaW1wb3J0IHsgRW1haWxWYWxpZGF0b3IgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9WYWxpZGF0b3JzL0VtYWlsXCI7XG5pbXBvcnQgeyBSZXF1aXJlZCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1ZhbGlkYXRvcnMvUmVxdWlyZWRcIjtcbmltcG9ydCB7IEF0dGVudGlvbk1lc3NhZ2UgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9BdHRlbnRpb25NZXNzYWdlXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9UcmFuc3BvcnRcIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuXG5leHBvcnQgY29uc3QgUmVnaXN0cmF0aW9uTGF5b3V0ID0gKCkgPT4ge1xuICBjb25zdCBBdHRlbnRpb25FbWFpbCA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uTG9naW4gPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IEF0dGVudGlvblBhc3N3b3JkID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25QYXNzd29yZERvdWJsZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uRmlyc3ROYW1lID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25TZWNvbmROYW1lID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25QaG9uZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcblxuICBjb25zdCBGb3JtRGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jvb3RcIiksXG4gICAgdGVtcGxhdGVQYXRoOiBcInJlZ2lzdHJhdGlvbi50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgZm9ybVRpdGxlOiBcItCg0LXQs9C40YHRgtGA0LDRhtC40Y9cIixcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBJbnB1dEVtYWlsOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiBcItCf0L7Rh9GC0LBcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwiZW1haWxcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fZW1haWxfX2lucHV0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uRW1haWwsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25FbWFpbC5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoRW1haWxWYWxpZGF0b3IuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbXCJlbWFpbFwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDRjdGC0L4g0L3QtSDQv9C+0YXQvtC20LUg0L3QsCDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRi1wiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgSW5wdXRMb2dpbjogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQm9C+0LPQuNC9XCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImxvZ2luXCIsXG4gICAgICAgIGlkOiBcImZvcm1fX2xvZ2luX19pbnB1dFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1yZWdfX2Zvcm0taW5wdXRcIixcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvbkxvZ2luLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uTG9naW4uZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wibG9naW5cIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBGaXJzdE5hbWU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0JjQvNGPXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImZpcnN0X25hbWVcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fZmlyc3RfbmFtZV9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25GaXJzdE5hbWUsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25GaXJzdE5hbWUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wiZmlyc3RfbmFtZVwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFNlY29uZE5hbWU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0KTQsNC80LjQu9C40Y9cIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwic2Vjb25kX25hbWVcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fc2Vjb25kX25hbWVfX2lucHV0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uU2Vjb25kTmFtZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblNlY29uZE5hbWUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wic2Vjb25kX25hbWVcIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBQaG9uZTogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQotC10LvQtdGE0L7QvVwiLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgbmFtZTogXCJwaG9uZVwiLFxuICAgICAgICBpZDogXCJmb3JtX19waG9uZV9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QaG9uZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblBob25lLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVtcInBob25lXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUGFzc3dvcmQ6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0J/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbmFtZTogXCJwYXNzd29yZFwiLFxuICAgICAgICBpZDogXCJmb3JtX19wYXNzd29yZF9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QYXNzd29yZCxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25QYXNzd29yZC5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IHN0YXRlRCA9IEF0dGVudGlvblBhc3N3b3JkRG91YmxlLmdldFN0YXRlKCk7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wicGFzc3dvcmRcIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKEZvcm1EYXRhW1wicGFzc3dvcmRcIl0gIT09IEZvcm1EYXRhW1wiZG91YmxlcGFzc3dvcmRcIl0pIHtcbiAgICAgICAgICAgICAgc3RhdGVELm1lc3NhZ2UgPSBcIvCflKXQv9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUGFzc3dvcmREb3VibGU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0J/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbmFtZTogXCJkb3VibGVwYXNzd29yZFwiLFxuICAgICAgICBpZDogXCJmb3JtX19kb3VibGVwYXNzd29yZF9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QYXNzd29yZERvdWJsZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25QYXNzd29yZERvdWJsZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVtcImRvdWJsZXBhc3N3b3JkXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChGb3JtRGF0YVtcInBhc3N3b3JkXCJdICE9PSBGb3JtRGF0YVtcImRvdWJsZXBhc3N3b3JkXCJdKSB7XG4gICAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIvCflKXQv9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUmVnQnV0dG9uOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y9cIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKEZvcm1EYXRhKS5sZW5ndGggPT0gMCB8fFxuICAgICAgICAgICAgT2JqZWN0LmtleXMoRm9ybURhdGEpLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIEZvcm1EYXRhW2l0ZW1dID09PSBcIlwiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZGF0YTogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGZpcnN0X25hbWU6IEZvcm1EYXRhLmZpcnN0X25hbWUsXG4gICAgICAgICAgICAgIHNlY29uZF9uYW1lOiBGb3JtRGF0YS5zZWNvbmRfbmFtZSxcbiAgICAgICAgICAgICAgbG9naW46IEZvcm1EYXRhLmxvZ2luLFxuICAgICAgICAgICAgICBlbWFpbDogRm9ybURhdGEuZW1haWwsXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBGb3JtRGF0YS5wYXNzd29yZCxcbiAgICAgICAgICAgICAgcGhvbmU6IEZvcm1EYXRhLnBob25lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAgICAgICAuUE9TVChcIi9hdXRoL3NpZ251cFwiLCBkYXRhKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByb3V0ZXIuZ28oXCIvY2hhdFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBMb2dpbkxpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCS0L7QudGC0LhcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tbGlua1wiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSUNoYXRTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL0J1c3NpbmVzTGF5ZXIvQ2hhdFNlcnZpY2VcIjtcbmltcG9ydCB7IElDaGF0RFRPIH0gZnJvbSBcIi4uLy4uL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ2hhdFZpZXdNb2RlbCB7XG4gIGNoYXRzOiBBcnJheTxJQ2hhdERUTz47XG4gIGdldENoYXRzOiAoKSA9PiBQcm9taXNlPElDaGF0RFRPW10+O1xuICBzYXZlQ2hhdDogKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IFByb21pc2U8dm9pZD47XG4gIGRlbGV0ZUNoYXQ6IChjaGF0SWQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbn1cbmV4cG9ydCBjbGFzcyBDaGF0Vmlld01vZGVsIGltcGxlbWVudHMgSUNoYXRWaWV3TW9kZWwge1xuICBjaGF0czogQXJyYXk8SUNoYXREVE8+ID0gW107XG4gIHg6IG51bWJlciA9IDEyO1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2VydmljZTogSUNoYXRTZXJ2aWNlKSB7fVxuXG4gIGdldENoYXRzID0gYXN5bmMgKCkgPT4ge1xuICAgIHRoaXMuY2hhdHMgPSBhd2FpdCB0aGlzLnNlcnZpY2UuZ2V0Q2hhdHMoKTtcbiAgICByZXR1cm4gdGhpcy5jaGF0cztcbiAgfTtcblxuICBzYXZlQ2hhdCA9IGFzeW5jIChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiB7XG4gICAgYXdhaXQgdGhpcy5zZXJ2aWNlLnNhdmVDaGF0KGRhdGEpO1xuICAgIGF3YWl0IHRoaXMuZ2V0Q2hhdHMoKTtcbiAgfTtcblxuICBkZWxldGVDaGF0ID0gYXN5bmMgKGNoYXRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgYXdhaXQgdGhpcy5zZXJ2aWNlLmRlbGV0ZUNoYXQoY2hhdElkKTtcbiAgICBhd2FpdCB0aGlzLmdldENoYXRzKCk7XG4gIH07XG59XG4iLCJpbXBvcnQgeyBJVXNlclNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vQnVzc2luZXNMYXllci9Vc2VyU2VydmljZVwiO1xuaW1wb3J0IHsgSVByb2ZpbGVEVE8gfSBmcm9tIFwiLi4vLi4vVUkvTGF5b3V0cy9Qcm9maWxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVVzZXJWaWV3TW9kZWwge1xuICB1c2VyPzogSVByb2ZpbGVEVE87XG4gIGdldFVzZXI6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIHNhdmVVc2VyOiAodXNlcjogSVByb2ZpbGVEVE8pID0+IFByb21pc2U8SVByb2ZpbGVEVE8+O1xuICBzZXRVc2VyRmllbGQ6IChuYW1lOiBrZXlvZiBJUHJvZmlsZURUTywgdmFsdWU6IGFueSkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFVzZXJWaWV3TW9kZWwgaW1wbGVtZW50cyBJVXNlclZpZXdNb2RlbCB7XG4gIHVzZXI/OiBJUHJvZmlsZURUTztcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNlcnZpY2U6IElVc2VyU2VydmljZSkge31cblxuICBnZXRVc2VyID0gYXN5bmMgKCkgPT4ge1xuICAgIHRoaXMudXNlciA9IGF3YWl0IHRoaXMuc2VydmljZS5nZXRVc2VyKCk7XG4gIH07XG5cbiAgc2F2ZVVzZXIgPSBhc3luYyAodXNlcjogSVByb2ZpbGVEVE8pID0+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlLnNhdmVVc2VyKHVzZXIpO1xuICB9O1xuXG4gIHNldFVzZXJGaWVsZChuYW1lOiBrZXlvZiBJUHJvZmlsZURUTywgdmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLnVzZXIpIHtcbiAgICAgIHRoaXMudXNlcltuYW1lXSA9IHZhbHVlIGFzIG5ldmVyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVzZXIgPSB7fSBhcyBJUHJvZmlsZURUTztcbiAgICAgIHRoaXMudXNlcltuYW1lXSA9IHZhbHVlIGFzIG5ldmVyO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgU0VSVklDRSB9IGZyb20gXCIuLi9CdXNzaW5lc0xheWVyXCI7XG5pbXBvcnQgeyBJQ2hhdFNlcnZpY2UgfSBmcm9tIFwiLi4vQnVzc2luZXNMYXllci9DaGF0U2VydmljZVwiO1xuaW1wb3J0IHsgSVVzZXJTZXJ2aWNlIH0gZnJvbSBcIi4uL0J1c3NpbmVzTGF5ZXIvVXNlclNlcnZpY2VcIjtcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xuaW1wb3J0IHsgQ2hhdFZpZXdNb2RlbCB9IGZyb20gXCIuL0NoYXRWaWV3TW9kZWxcIjtcbmltcG9ydCB7IFVzZXJWaWV3TW9kZWwgfSBmcm9tIFwiLi9Vc2VyVmlld01vZGVsXCI7XG5cbmV4cG9ydCBjb25zdCBWSUVXX01PREVMID0ge1xuICBDSEFUOiBTeW1ib2wuZm9yKFwiQ2hhdFZpZXdNb2RlbFwiKSxcbiAgVVNFUjogU3ltYm9sLmZvcihcIlVzZXJWaWV3TW9kZWxcIiksXG59O1xuXG5leHBvcnQgY29uc3QgVmlld01vZGVsQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcigpO1xuXG5WaWV3TW9kZWxDb250YWluZXIuYmluZChWSUVXX01PREVMLkNIQVQpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgY29uc3Qgc2VydmljZSA9IGNvbnRhaW5lci5nZXQ8SUNoYXRTZXJ2aWNlPihTRVJWSUNFLkNIQVQpO1xuICByZXR1cm4gbmV3IENoYXRWaWV3TW9kZWwoc2VydmljZSk7XG59KTtcblxuVmlld01vZGVsQ29udGFpbmVyLmJpbmQoVklFV19NT0RFTC5VU0VSKVxuICAudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuICAgIGNvbnN0IHNlcnZpY2UgPSBjb250YWluZXIuZ2V0PElVc2VyU2VydmljZT4oU0VSVklDRS5VU0VSKTtcbiAgICByZXR1cm4gbmV3IFVzZXJWaWV3TW9kZWwoc2VydmljZSk7XG4gIH0pXG4gIC5pblNpbmdsZXRvbmVTY29wZSgpO1xuIiwiaW1wb3J0ICdyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUnXG5pbXBvcnQgeyBCb290U3RyYXAgfSBmcm9tIFwiLi9Cb290c3RyYXBcIjtcbmltcG9ydCB7IFJvdXRlckluaXQgfSBmcm9tIFwiLi9yb3V0ZXJcIjtcblxuY29uc3QgSW5pdEFwcCA9ICgpID0+IHtcbiAgY29uc3QgeyBjb250YWluZXIgfSA9IG5ldyBCb290U3RyYXAoKTtcbiAgY29uc3Qgcm91dGVyID0gUm91dGVySW5pdChjb250YWluZXIpO1xuICByZXR1cm4geyByb3V0ZXIsIGNvbnRhaW5lciB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHsgcm91dGVyLCBjb250YWluZXIgfSA9IEluaXRBcHAoKTtcbiIsImNsYXNzIFNpbmdsZXRvblNjb3BlIHtcbiAgSW5zdGFuY2VNYWtlcnM6IE1hcDxzeW1ib2wsIGFueT4gPSBuZXcgTWFwPFxuICAgIHN5bWJvbCxcbiAgICB7IGZuOiAoY29udGFpbmVyOiBDb250YWluZXIpID0+IGFueTsgaWQ6IHN5bWJvbCB9XG4gID4oKTtcbiAgSW5zdGFuY2VzOiBNYXA8c3ltYm9sLCBhbnk+ID0gbmV3IE1hcDxzeW1ib2wsIGFueT4oKTtcbn1cblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lciB7XG4gIGNvbnRhaW5lcnM6IE1hcDxzeW1ib2wsIGFueT4gPSBuZXcgTWFwKCk7XG4gIGxhc3RJZD86IHN5bWJvbDtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHNpbmdsZXRvbmVTY29wZTogU2luZ2xldG9uU2NvcGUgPSBuZXcgU2luZ2xldG9uU2NvcGUoKVxuICApIHt9XG4gIGJpbmQoaWQ6IHN5bWJvbCk6IENvbnRhaW5lciB7XG4gICAgdGhpcy5sYXN0SWQgPSBpZDtcbiAgICB0aGlzLmNvbnRhaW5lcnMuc2V0KGlkLCBudWxsKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBnZXQgPSA8VD4oaWQ6IHN5bWJvbCk6IFQgPT4ge1xuICAgIGNvbnN0IHNpbmdsZVRvbmVDb250YWluZXIgPSB0aGlzLnNpbmdsZXRvbmVTY29wZS5JbnN0YW5jZU1ha2Vycy5nZXQoaWQpO1xuICAgIGlmIChzaW5nbGVUb25lQ29udGFpbmVyKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuc2luZ2xldG9uZVNjb3BlLkluc3RhbmNlcy5nZXQoaWQpO1xuICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2luZ2xldG9uZVNjb3BlLkluc3RhbmNlcy5zZXQoaWQsIHNpbmdsZVRvbmVDb250YWluZXIuZm4odGhpcykpO1xuICAgICAgICByZXR1cm4gdGhpcy5zaW5nbGV0b25lU2NvcGUuSW5zdGFuY2VzLmdldChpZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNyZWF0ZUNvbnRhaW5lckZuID0gdGhpcy5jb250YWluZXJzLmdldChpZCk7XG4gICAgICByZXR1cm4gY3JlYXRlQ29udGFpbmVyRm4uZm4odGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHRvRHluYW1pY1ZhbHVlKGZuOiAoY29udGFpbmVyOiBDb250YWluZXIpID0+IHVua25vd24pIHtcbiAgICBpZiAodGhpcy5sYXN0SWQpIHtcbiAgICAgIHRoaXMuY29udGFpbmVycy5zZXQodGhpcy5sYXN0SWQsIHsgZm46IGZuLCBpZDogdGhpcy5sYXN0SWQgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwYXJlbnQoY29udGFpbmVyOiBDb250YWluZXIpOiBDb250YWluZXIge1xuICAgIGZvciAobGV0IGNvbnQgb2YgY29udGFpbmVyLmNvbnRhaW5lcnMpIHtcbiAgICAgIHRoaXMuY29udGFpbmVycy5zZXQoY29udFswXSwgY29udFsxXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaW5TaW5nbGV0b25lU2NvcGUoKSB7XG4gICAgaWYgKHRoaXMubGFzdElkKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcnMuZ2V0KHRoaXMubGFzdElkKTtcbiAgICAgIHRoaXMuc2luZ2xldG9uZVNjb3BlLkluc3RhbmNlTWFrZXJzLnNldCh0aGlzLmxhc3RJZCwgY29udGFpbmVyKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IG1lbW9pemUgfSBmcm9tIFwiLi4vbW9taXplXCI7XG5pbXBvcnQgeyB1dWlkdjQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuaW50ZXJmYWNlIElIWVBPUHJvcHMge1xuICByZW5kZXJUbz86IEhUTUxFbGVtZW50O1xuICB0ZW1wbGF0ZVBhdGg6IHN0cmluZztcbiAgY2hpbGRyZW4/OiBSZWNvcmQ8c3RyaW5nLCBIWVBPIHwgSFlQT1tdPjtcbiAgZGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG59XG5cbmludGVyZmFjZSBJVGVtcGF0ZVByb3Age1xuICBodG1sOiBzdHJpbmc7XG4gIHRlbXBsYXRlS2V5OiBzdHJpbmc7XG4gIG1hZ2ljS2V5OiBzdHJpbmc7XG4gIGlzQXJyYXk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBIWVBPIHtcbiAgcHJpdmF0ZSByZW5kZXJUbz86IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIGNoaWxkcmVuPzogUmVjb3JkPHN0cmluZywgSFlQTyB8IEhZUE9bXT47XG4gIHByaXZhdGUgdGVtcGxhdGVQYXRoOiBzdHJpbmc7XG4gIHByaXZhdGUgZGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIHByaXZhdGUgdGVtcGxhdGVzUHJvbWlzZXM6IFByb21pc2U8SVRlbXBhdGVQcm9wPltdO1xuICBwcml2YXRlIHN0b3JlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgcHJpdmF0ZSBtYWdpY0tleTogc3RyaW5nO1xuICBwcml2YXRlIGFmdGVyUmVuZGVyQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgYWZ0ZXJSZW5kZXJDYWxsYmFja0FycjogU2V0PCgpID0+IHZvaWQ+O1xuXG4gIGNvbnN0cnVjdG9yKHBhcmFtczogSUhZUE9Qcm9wcykge1xuICAgIHRoaXMucmVuZGVyVG8gPSBwYXJhbXMucmVuZGVyVG87XG4gICAgdGhpcy5kYXRhID0gcGFyYW1zLmRhdGE7XG4gICAgdGhpcy50ZW1wbGF0ZVBhdGggPSBgLi90ZW1wbGF0ZXMvJHtwYXJhbXMudGVtcGxhdGVQYXRofWA7XG4gICAgdGhpcy5jaGlsZHJlbiA9IHBhcmFtcy5jaGlsZHJlbjtcbiAgICB0aGlzLnRlbXBsYXRlc1Byb21pc2VzID0gW107XG4gICAgdGhpcy5zdG9yZSA9IHt9O1xuICAgIHRoaXMubWFnaWNLZXkgPSB1dWlkdjQoKTtcbiAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbGJhY2sgPSAoKSA9PiB7fTtcbiAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbGJhY2tBcnIgPSBuZXcgU2V0KCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0VGVtcGxhdGVIVE1MID0gYXN5bmMgKFxuICAgIGtleTogc3RyaW5nLFxuICAgIGh5cG86IEhZUE8sXG4gICAgaXNBcnJheTogYm9vbGVhblxuICApOiBQcm9taXNlPElUZW1wYXRlUHJvcD4gPT4ge1xuICAgIGNvbnN0IGdldEhUTUwgPSBhc3luYyAodGVtcGxhdGVQYXRoOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCBuZXcgUHJvbWlzZTxzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZmV0Y2godGVtcGxhdGVQYXRoKVxuICAgICAgICAgIC50aGVuKChodG1sKSA9PiB7XG4gICAgICAgICAgICBpZiAoaHRtbC5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaWxlIGRvIG5vdCBkb3dubG9hZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBodG1sLmJsb2IoKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQudGV4dCgpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oKHRleHQpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUodGV4dCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRIVE1MbWVtbyA9IG1lbW9pemUoZ2V0SFRNTCk7XG5cbiAgICBjb25zdCBodG1sVGVtcGxhdGUgPSBhd2FpdCBnZXRIVE1MbWVtbyhoeXBvLnRlbXBsYXRlUGF0aCk7XG4gICAgY29uc3QgaHRtbCA9IHRoaXMuaW5zZXJ0RGF0YUludG9IVE1MKGh0bWxUZW1wbGF0ZSwgaHlwby5kYXRhKTtcblxuICAgIHJldHVybiB7XG4gICAgICBodG1sOiBodG1sLFxuICAgICAgdGVtcGxhdGVLZXk6IGtleSxcbiAgICAgIG1hZ2ljS2V5OiBoeXBvLm1hZ2ljS2V5LFxuICAgICAgaXNBcnJheTogaXNBcnJheSxcbiAgICB9O1xuICB9O1xuXG4gIHByaXZhdGUgY29sbGVjdFRlbXBsYXRlcyhcbiAgICBoeXBvOiBIWVBPIHwgSFlQT1tdLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBpc0FycmF5OiBib29sZWFuXG4gICk6IEhZUE8ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGh5cG8pKSB7XG4gICAgICB0aGlzLmhhbmRsZUFycmF5SFlQTyhoeXBvLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYW5kbGVTaW1wbGVIWVBPKGh5cG8sIG5hbWUpO1xuICAgICAgdGhpcy50ZW1wbGF0ZXNQcm9taXNlcy5wdXNoKHRoaXMuZ2V0VGVtcGxhdGVIVE1MKG5hbWUsIGh5cG8sIGlzQXJyYXkpKTtcbiAgICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFja0Fyci5hZGQoaHlwby5hZnRlclJlbmRlckNhbGxiYWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUFycmF5SFlQTyhoeXBvczogSFlQT1tdLCBuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBoeXBvcy5mb3JFYWNoKChoeXBvKSA9PiB7XG4gICAgICB0aGlzLmNvbGxlY3RUZW1wbGF0ZXMoaHlwbywgYCR7bmFtZX1gLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlU2ltcGxlSFlQTyhoeXBvOiBIWVBPLCBfOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoaHlwby5jaGlsZHJlbikge1xuICAgICAgT2JqZWN0LmtleXMoaHlwby5jaGlsZHJlbikuZm9yRWFjaCgoY2hpbGROYW1lKSA9PiB7XG4gICAgICAgIGlmIChoeXBvLmNoaWxkcmVuKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdFRlbXBsYXRlcyhcbiAgICAgICAgICAgIGh5cG8uY2hpbGRyZW5bY2hpbGROYW1lXSxcbiAgICAgICAgICAgIGNoaWxkTmFtZSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbnNlcnREYXRhSW50b0hUTUwoXG4gICAgaHRtbFRlbXBsYXRlOiBzdHJpbmcsXG4gICAgZGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgKTogc3RyaW5nIHtcbiAgICBkYXRhID0gdGhpcy5nZXREYXRhV2l0aG91dEllcmFyaHkoZGF0YSk7XG4gICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcbiAgICAgIGlmICh0eXBlb2YgZGF0YVtrZXldICE9PSBcIm9iamVjdFwiIHx8IGRhdGFba2V5XSA9PT0gbnVsbCkge1xuICAgICAgICBjb25zdCBtYXNrID0gbmV3IFJlZ0V4cChcInt7XCIgKyBrZXkgKyBcIn19XCIsIFwiZ1wiKTtcbiAgICAgICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UobWFzaywgU3RyaW5nKGRhdGFba2V5XSkpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBtYXNrID0gbmV3IFJlZ0V4cCgve3tbYS16Ll9dK319L2cpO1xuICAgIGh0bWxUZW1wbGF0ZSA9IGh0bWxUZW1wbGF0ZS5yZXBsYWNlKG1hc2ssIFwiXCIpO1xuICAgIHJldHVybiBodG1sVGVtcGxhdGU7XG4gIH1cblxuICBwcml2YXRlIGNvbnZlcnRBcnJUZW1wbGF0ZVRvTWFwKFxuICAgIHRlbXBsYXRlQXJyOiB7XG4gICAgICBodG1sOiBzdHJpbmc7XG4gICAgICB0ZW1wbGF0ZUtleTogc3RyaW5nO1xuICAgICAgbWFnaWNLZXk6IHN0cmluZztcbiAgICAgIGlzQXJyYXk6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gICAgfVtdXG4gICk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICAgIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIHRlbXBsYXRlQXJyLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGlmIChyZXN1bHRbaXRlbS50ZW1wbGF0ZUtleV0pIHtcbiAgICAgICAgcmVzdWx0W1xuICAgICAgICAgIGl0ZW0udGVtcGxhdGVLZXlcbiAgICAgICAgXSArPSBgPHNwYW4gaHlwbz1cIiR7aXRlbS5tYWdpY0tleX1cIj4ke2l0ZW0uaHRtbH08L3NwYW4+YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtgJHtpdGVtLnRlbXBsYXRlS2V5fS0ke2l0ZW0ubWFnaWNLZXl9YF0gPSBpdGVtLmh0bWw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBpbnNlcnRUZW1wbGF0ZUludG9UZW1wbGF0ZShcbiAgICByb290VGVtcGxhdGVIVE1MOiBzdHJpbmcsXG4gICAgdGVtcGxhdGVLZXk6IHN0cmluZyxcbiAgICBjaGlsZFRlbXBsYXRlSFRNTDogc3RyaW5nLFxuICAgIG1hZ2ljS2V5OiBzdHJpbmcsXG4gICAgaXNBcnJheTogYm9vbGVhblxuICApOiBzdHJpbmcge1xuICAgIHJvb3RUZW1wbGF0ZUhUTUwgPSB0aGlzLmNyZWF0ZUVsZW1XcmFwcGVyKFxuICAgICAgcm9vdFRlbXBsYXRlSFRNTCxcbiAgICAgIHRlbXBsYXRlS2V5LFxuICAgICAgbWFnaWNLZXksXG4gICAgICBpc0FycmF5XG4gICAgKTtcbiAgICBjb25zdCBtYXNrID0gbmV3IFJlZ0V4cChgLT0ke3RlbXBsYXRlS2V5fS0ke21hZ2ljS2V5fT0tYCwgXCJnXCIpO1xuICAgIHJvb3RUZW1wbGF0ZUhUTUwgPSByb290VGVtcGxhdGVIVE1MLnJlcGxhY2UobWFzaywgY2hpbGRUZW1wbGF0ZUhUTUwpO1xuICAgIHJldHVybiByb290VGVtcGxhdGVIVE1MO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFbGVtV3JhcHBlcihcbiAgICBodG1sVGVtcGxhdGU6IHN0cmluZyxcbiAgICB0ZW1wbGF0ZUtleTogc3RyaW5nLFxuICAgIG1hZ2ljS2V5OiBzdHJpbmcsXG4gICAgaXNBcnJheTogYm9vbGVhblxuICApIHtcbiAgICBjb25zdCBtYXNrID0gbmV3IFJlZ0V4cChgLT0ke3RlbXBsYXRlS2V5fT0tYCwgXCJnXCIpO1xuICAgIGlmIChpc0FycmF5KSB7XG4gICAgICBodG1sVGVtcGxhdGUgPSBodG1sVGVtcGxhdGUucmVwbGFjZShcbiAgICAgICAgbWFzayxcbiAgICAgICAgYDxzcGFuIGh5cG89XCIke21hZ2ljS2V5fVwiPi09JHt0ZW1wbGF0ZUtleX0tJHttYWdpY0tleX09LS09JHt0ZW1wbGF0ZUtleX09LTwvc3Bhbj5gXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBodG1sVGVtcGxhdGUgPSBodG1sVGVtcGxhdGUucmVwbGFjZShcbiAgICAgICAgbWFzayxcbiAgICAgICAgYDxzcGFuIGh5cG89XCIke21hZ2ljS2V5fVwiPi09JHt0ZW1wbGF0ZUtleX0tJHttYWdpY0tleX09LTwvc3Bhbj5gXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBodG1sVGVtcGxhdGU7XG4gIH1cblxuICBwcml2YXRlIGNsZWFyRW10cHlDb21wb25lbnQoaHRtbDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCByZWdleCA9IC8tPVthLXosQS1aLDAtOV0rPS0vZztcbiAgICByZXR1cm4gaHRtbC5yZXBsYWNlKHJlZ2V4LCBcIlwiKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIgPSBhc3luYyAoKTogUHJvbWlzZTxIWVBPPiA9PiB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgdGhpcy5jb2xsZWN0VGVtcGxhdGVzKHRoaXMsIFwicm9vdFwiLCBmYWxzZSkudGVtcGxhdGVzUHJvbWlzZXNcbiAgICApLnRoZW4oKGFycmF5VGVtcGxhdGVzKSA9PiB7XG4gICAgICBjb25zdCBtYXBUZW1wbGF0ZXMgPSB0aGlzLmNvbnZlcnRBcnJUZW1wbGF0ZVRvTWFwKGFycmF5VGVtcGxhdGVzKTtcbiAgICAgIGxldCByb290VGVtcGxhdGVIVE1MOiBzdHJpbmcgPVxuICAgICAgICBhcnJheVRlbXBsYXRlc1thcnJheVRlbXBsYXRlcy5sZW5ndGggLSAxXS5odG1sO1xuICAgICAgZm9yIChsZXQgaSA9IGFycmF5VGVtcGxhdGVzLmxlbmd0aCAtIDI7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9XG4gICAgICAgICAgbWFwVGVtcGxhdGVzW1xuICAgICAgICAgICAgYCR7YXJyYXlUZW1wbGF0ZXNbaV0udGVtcGxhdGVLZXl9LSR7YXJyYXlUZW1wbGF0ZXNbaV0ubWFnaWNLZXl9YFxuICAgICAgICAgIF07XG4gICAgICAgIHJvb3RUZW1wbGF0ZUhUTUwgPSB0aGlzLmluc2VydFRlbXBsYXRlSW50b1RlbXBsYXRlKFxuICAgICAgICAgIHJvb3RUZW1wbGF0ZUhUTUwsXG4gICAgICAgICAgYXJyYXlUZW1wbGF0ZXNbaV0udGVtcGxhdGVLZXksXG4gICAgICAgICAgdGVtcGxhdGUsXG4gICAgICAgICAgYXJyYXlUZW1wbGF0ZXNbaV0ubWFnaWNLZXksXG4gICAgICAgICAgYXJyYXlUZW1wbGF0ZXNbaV0uaXNBcnJheVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByb290VGVtcGxhdGVIVE1MID0gdGhpcy5jbGVhckVtdHB5Q29tcG9uZW50KHJvb3RUZW1wbGF0ZUhUTUwpO1xuXG4gICAgICBpZiAodGhpcy5yZW5kZXJUbykge1xuICAgICAgICB0aGlzLnJlbmRlclRvLmlubmVySFRNTCA9IHJvb3RUZW1wbGF0ZUhUTUw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2h5cG89XCIke3RoaXMubWFnaWNLZXl9XCJdYCk7XG4gICAgICAgIGlmIChlbGVtKSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJUbyA9IGVsZW0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSByb290VGVtcGxhdGVIVE1MO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbGJhY2tBcnIuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy50ZW1wbGF0ZXNQcm9taXNlcyA9IFtdO1xuICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSByZXJlbmRlcigpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcHVibGljIGdldFN0YXRlKCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgICB0aGlzLnN0b3JlID0gdGhpcy5jcmVhdGVTdG9yZSh0aGlzLmRhdGEpO1xuICAgIHJldHVybiB0aGlzLnN0b3JlO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVTdG9yZShzdG9yZTogYW55KSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgY29uc3QgaGFuZGxlcjogUHJveHlIYW5kbGVyPFJlY29yZDxzdHJpbmcsIHVua25vd24+PiA9IHtcbiAgICAgIGdldCh0YXJnZXQsIHByb3BlcnR5KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRbPHN0cmluZz5wcm9wZXJ0eV07XG4gICAgICB9LFxuICAgICAgc2V0KHRhcmdldCwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgICAgIHRhcmdldFs8c3RyaW5nPnByb3BlcnR5XSA9IHZhbHVlO1xuICAgICAgICB0aGF0LnJlcmVuZGVyKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICB9O1xuICAgIHN0b3JlID0gbmV3IFByb3h5KHN0b3JlLCBoYW5kbGVyKTtcblxuICAgIE9iamVjdC5rZXlzKHN0b3JlKS5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBzdG9yZVtmaWVsZF0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgc3RvcmVbZmllbGRdID0gbmV3IFByb3h5KHN0b3JlW2ZpZWxkXSwgaGFuZGxlcik7XG4gICAgICAgIHRoaXMuY3JlYXRlU3RvcmUoc3RvcmVbZmllbGRdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBzdG9yZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGF0YVdpdGhvdXRJZXJhcmh5KGRhdGE6IGFueSkge1xuICAgIGxldCBwYXRoQXJyOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCByZXN1bHRPYmplY3Q6IGFueSA9IHt9O1xuICAgIGZ1bmN0aW9uIGZueihvYmo6IGFueSkge1xuICAgICAgZm9yIChsZXQga2V5IGluIG9iaikge1xuICAgICAgICBwYXRoQXJyLnB1c2goa2V5KTtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgIGZueihvYmpba2V5XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0T2JqZWN0W3BhdGhBcnIuam9pbihcIi5cIildID0gb2JqW2tleV07XG4gICAgICAgICAgcGF0aEFyci5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcGF0aEFyci5wb3AoKTtcbiAgICB9XG4gICAgZm56KGRhdGEpO1xuXG4gICAgcmV0dXJuIHJlc3VsdE9iamVjdDtcbiAgfVxuXG4gIHB1YmxpYyBhZnRlclJlbmRlcihjYWxsYmFjazogKCkgPT4gdm9pZCk6IEhZUE8ge1xuICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIGhpZGUoKSB7XG4gICAgaWYgKHRoaXMucmVuZGVyVG8pIHtcbiAgICAgIGxldCBjaGlsZHJlbjtcblxuICAgICAgY2hpbGRyZW4gPSB0aGlzLnJlbmRlclRvLmNoaWxkcmVuO1xuICAgICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICAgICAgY2hpbGQucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vSFlQTy9IWVBPXCI7XG5cbmNsYXNzIFJvdXRlIHtcbiAgcHJpdmF0ZSBfcGF0aG5hbWU6IHN0cmluZyA9IFwiXCI7XG4gIHByaXZhdGUgX2Jsb2NrPzogKHJlc3VsdD86IGFueSkgPT4gSFlQTztcbiAgcHJpdmF0ZSBfcHJvcHM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICBhc3luY0ZOPzogKCkgPT4gUHJvbWlzZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHBhdGhuYW1lOiBzdHJpbmcsXG4gICAgdmlldzogKCkgPT4gSFlQTyxcbiAgICBwcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gICAgYXN5bmNGTj86ICgpID0+IFByb21pc2U8YW55PlxuICApIHtcbiAgICB0aGlzLl9wYXRobmFtZSA9IHBhdGhuYW1lO1xuICAgIHRoaXMuX3Byb3BzID0gcHJvcHM7XG4gICAgdGhpcy5fYmxvY2sgPSB2aWV3O1xuICAgIHRoaXMuYXN5bmNGTiA9IGFzeW5jRk47XG4gIH1cblxuICBuYXZpZ2F0ZShwYXRobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubWF0Y2gocGF0aG5hbWUpKSB7XG4gICAgICB0aGlzLl9wYXRobmFtZSA9IHBhdGhuYW1lO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICBsZWF2ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fYmxvY2spIHtcbiAgICAgIHRoaXMuX2Jsb2NrKCkuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIG1hdGNoKHBhdGhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNFcXVhbChwYXRobmFtZSwgdGhpcy5fcGF0aG5hbWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5fYmxvY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuYXN5bmNGTikge1xuICAgICAgdGhpcy5hc3luY0ZOKCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIHRoaXMuX2Jsb2NrPy4ocmVzdWx0KS5yZW5kZXIoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ibG9jaygpLnJlbmRlcigpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUm91dGVyIHtcbiAgcHJpdmF0ZSBfX2luc3RhbmNlOiBSb3V0ZXIgPSB0aGlzO1xuICByb3V0ZXM6IFJvdXRlW10gPSBbXTtcbiAgcHJpdmF0ZSBoaXN0b3J5OiBIaXN0b3J5ID0gd2luZG93Lmhpc3Rvcnk7XG4gIHByaXZhdGUgX2N1cnJlbnRSb3V0ZTogUm91dGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfcm9vdFF1ZXJ5OiBzdHJpbmcgPSBcIlwiO1xuXG4gIGNvbnN0cnVjdG9yKHJvb3RRdWVyeTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX19pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX19pbnN0YW5jZTtcbiAgICB9XG4gICAgdGhpcy5fcm9vdFF1ZXJ5ID0gcm9vdFF1ZXJ5O1xuICB9XG5cbiAgdXNlKFxuICAgIHBhdGhuYW1lOiBzdHJpbmcsXG4gICAgYmxvY2s6IChyZXN1bHQ/OiBhbnkpID0+IEhZUE8sXG4gICAgYXN5bmNGTj86ICgpID0+IFByb21pc2U8YW55PlxuICApOiBSb3V0ZXIge1xuICAgIGNvbnN0IHJvdXRlID0gbmV3IFJvdXRlKFxuICAgICAgcGF0aG5hbWUsXG4gICAgICBibG9jayxcbiAgICAgIHsgcm9vdFF1ZXJ5OiB0aGlzLl9yb290UXVlcnkgfSxcbiAgICAgIGFzeW5jRk5cbiAgICApO1xuICAgIHRoaXMucm91dGVzLnB1c2gocm91dGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RhcnQoKTogUm91dGVyIHtcbiAgICB3aW5kb3cub25wb3BzdGF0ZSA9IChfOiBQb3BTdGF0ZUV2ZW50KSA9PiB7XG4gICAgICBsZXQgbWFzayA9IG5ldyBSZWdFeHAoXCIjXCIsIFwiZ1wiKTtcbiAgICAgIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UobWFzaywgXCJcIik7XG4gICAgICB0aGlzLl9vblJvdXRlKHVybCk7XG4gICAgfTtcbiAgICBsZXQgbWFzayA9IG5ldyBSZWdFeHAoXCIjXCIsIFwiZ1wiKTtcbiAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKG1hc2ssIFwiXCIpIHx8IFwiL1wiO1xuICAgIHRoaXMuX29uUm91dGUodXJsKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9vblJvdXRlKHBhdGhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCByb3V0ZSA9IHRoaXMuZ2V0Um91dGUocGF0aG5hbWUpO1xuICAgIGlmICghcm91dGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2N1cnJlbnRSb3V0ZSkge1xuICAgICAgdGhpcy5fY3VycmVudFJvdXRlLmxlYXZlKCk7XG4gICAgfVxuICAgIHRoaXMuX2N1cnJlbnRSb3V0ZSA9IHJvdXRlO1xuICAgIHRoaXMuX2N1cnJlbnRSb3V0ZS5yZW5kZXIoKTtcbiAgfVxuXG4gIGdvKHBhdGhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmhpc3RvcnkucHVzaFN0YXRlKHt9LCBcIlwiLCBgIyR7cGF0aG5hbWV9YCk7XG4gICAgdGhpcy5fb25Sb3V0ZShwYXRobmFtZSk7XG4gIH1cblxuICBiYWNrKCk6IHZvaWQge1xuICAgIHRoaXMuaGlzdG9yeS5iYWNrKCk7XG4gIH1cblxuICBmb3J3YXJkKCk6IHZvaWQge1xuICAgIHRoaXMuaGlzdG9yeS5mb3J3YXJkKCk7XG4gIH1cblxuICBnZXRSb3V0ZShwYXRobmFtZTogc3RyaW5nKTogUm91dGUgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnJvdXRlcy5maW5kKChyb3V0ZSkgPT4gcm91dGUubWF0Y2gocGF0aG5hbWUpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0VxdWFsKGxoczogdW5rbm93biwgcmhzOiB1bmtub3duKSB7XG4gIHJldHVybiBsaHMgPT09IHJocztcbn1cbiIsImNvbnN0IE1FVEhPRFMgPSB7XG4gIEdFVDogXCJHRVRcIixcbiAgUFVUOiBcIlBVVFwiLFxuICBQT1NUOiBcIlBPU1RcIixcbiAgREVMRVRFOiBcIkRFTEVURVwiLFxufTtcblxuY29uc3QgRE9NRU4gPSBcImh0dHBzOi8veWEtcHJha3Rpa3VtLnRlY2gvYXBpL3YyXCI7XG5cbmNsYXNzIEhUVFBUcmFuc3BvcnRDbGFzcyB7XG4gIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGhlYWRlcnM6IHt9LFxuICAgIGRhdGE6IHt9LFxuICB9O1xuXG4gIEdFVCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHRoaXMuZGVmYXVsdE9wdGlvbnNcbiAgKSA9PiB7XG4gICAgY29uc3QgcmVxdWVzdFBhcmFtcyA9IHF1ZXJ5U3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgdXJsICs9IHJlcXVlc3RQYXJhbXM7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcbiAgICAgIHVybCxcbiAgICAgIHsgLi4ub3B0aW9ucywgbWV0aG9kOiBNRVRIT0RTLkdFVCB9LFxuICAgICAgTnVtYmVyKG9wdGlvbnMudGltZW91dCkgfHwgNTAwMFxuICAgICk7XG4gIH07XG5cbiAgUFVUID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9ID0gdGhpcy5kZWZhdWx0T3B0aW9uc1xuICApID0+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFxuICAgICAgdXJsLFxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuUFVUIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcblxuICBQT1NUID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyPiB9ID0gdGhpc1xuICAgICAgLmRlZmF1bHRPcHRpb25zXG4gICkgPT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXG4gICAgICB1cmwsXG4gICAgICB7IC4uLm9wdGlvbnMsIG1ldGhvZDogTUVUSE9EUy5QT1NUIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcblxuICBERUxFVEUgPSAoXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB0aGlzLmRlZmF1bHRPcHRpb25zXG4gICkgPT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXG4gICAgICB1cmwsXG4gICAgICB7IC4uLm9wdGlvbnMsIG1ldGhvZDogTUVUSE9EUy5ERUxFVEUgfSxcbiAgICAgIE51bWJlcihvcHRpb25zLnRpbWVvdXQpIHx8IDUwMDBcbiAgICApO1xuICB9O1xuXG4gIHNvY2tldCA9ICh1cmw6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBuZXcgV2ViU29ja2V0KHVybCk7XG4gIH07XG5cbiAgcmVxdWVzdCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSB8IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgdGltZW91dDogbnVtYmVyID0gNTAwMFxuICApID0+IHtcbiAgICB1cmwgPSBET01FTiArIHVybDtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgeGhyLm9wZW4oPHN0cmluZz5vcHRpb25zLm1ldGhvZCwgdXJsKTtcbiAgICAgIGNvbnN0IGhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnM7XG4gICAgICBmb3IgKGxldCBoZWFkZXIgaW4gaGVhZGVycyBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaGVhZGVyc1toZWFkZXIgYXMga2V5b2YgdHlwZW9mIGhlYWRlcnNdIGFzIHN0cmluZztcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICByZXNvbHZlKHhocik7XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSAoZSkgPT4ge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9O1xuICAgICAgeGhyLm9uYWJvcnQgPSAoZSkgPT4ge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9O1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgfSwgdGltZW91dCk7XG5cbiAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSkpO1xuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBxdWVyeVN0cmluZ2lmeShkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gIGxldCByZXF1ZXN0UGFyYW1zID0gXCI/XCI7XG4gIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAgcmVxdWVzdFBhcmFtcyArPSBgJHtrZXl9PSR7ZGF0YVtrZXldfSZgO1xuICB9XG4gIHJlcXVlc3RQYXJhbXMgPSByZXF1ZXN0UGFyYW1zLnN1YnN0cmluZygwLCByZXF1ZXN0UGFyYW1zLmxlbmd0aCAtIDEpO1xuICByZXR1cm4gcmVxdWVzdFBhcmFtcztcbn1cblxuZXhwb3J0IGNvbnN0IEhUVFBUcmFuc3BvcnQgPSAoKCk6IHsgZ2V0SW5zdGFuY2U6ICgpID0+IEhUVFBUcmFuc3BvcnRDbGFzcyB9ID0+IHtcbiAgbGV0IGluc3RhbmNlOiBIVFRQVHJhbnNwb3J0Q2xhc3M7XG4gIHJldHVybiB7XG4gICAgZ2V0SW5zdGFuY2U6ICgpID0+IGluc3RhbmNlIHx8IChpbnN0YW5jZSA9IG5ldyBIVFRQVHJhbnNwb3J0Q2xhc3MoKSksXG4gIH07XG59KSgpO1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi9IWVBPXCI7XG5cbmV4cG9ydCBjb25zdCBFbWFpbFZhbGlkYXRvciA9IHtcbiAgdmFsdWU6IFwiXCIsXG4gIGNoZWNrRnVuYzogZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB2YXIgcmVnID0gL14oW0EtWmEtejAtOV9cXC1cXC5dKStcXEAoW0EtWmEtejAtOV9cXC1cXC5dKStcXC4oW0EtWmEtel17Miw0fSkkLztcbiAgICBpZiAoIXJlZy50ZXN0KHZhbHVlKSkge1xuICAgICAgdGhpcy52YWx1ZSA9IFwiXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgY2FsbGJhY2s6IChlbGVtOiBIWVBPLCBjaGVja1Jlc3VsdDogYm9vbGVhbikgPT4ge1xuICAgIGxldCBzdGF0ZSA9IGVsZW0uZ2V0U3RhdGUoKTtcbiAgICBpZiAoIWNoZWNrUmVzdWx0KSB7XG4gICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0Y3RgtC+INC90LUg0L/QvtGF0L7QttC1INC90LAg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YtcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgfVxuICB9LFxufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vSFlQT1wiO1xuXG5leHBvcnQgY29uc3QgUmVxdWlyZWQgPSB7XG4gIHZhbHVlOiBcIlwiLFxuICBjaGVja0Z1bmM6IGZ1bmN0aW9uICh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHZhbHVlID09PSBcIlwiKSB7XG4gICAgICB0aGlzLnZhbHVlID0gXCJcIjtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBjYWxsYmFjazogKGVsZW06IEhZUE8sIGNoZWNrUmVzdWx0OiBib29sZWFuKSA9PiB7XG4gICAgbGV0IHN0YXRlID0gZWxlbS5nZXRTdGF0ZSgpO1xuICAgIGlmICghY2hlY2tSZXN1bHQpIHtcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgfVxuICB9LFxufTsiLCJleHBvcnQgZnVuY3Rpb24gdXVpZHY0KCkge1xuICByZXR1cm4gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgdmFyIHIgPSAoTWF0aC5yYW5kb20oKSAqIDE2KSB8IDAsXG4gICAgICB2ID0gYyA9PSBcInhcIiA/IHIgOiAociAmIDB4MykgfCAweDg7XG4gICAgcmV0dXJuIGAke3YudG9TdHJpbmcoMTYpfWA7XG4gIH0pO1xufSIsImltcG9ydCB7IExvZ2luTGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvTG9naW5cIjtcbmltcG9ydCB7IENoYXRMYXlvdXQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9DaGF0XCI7XG5pbXBvcnQgeyBSZWdpc3RyYXRpb25MYXlvdXQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9SZWdpc3RyYXRpb25cIjtcbmltcG9ydCB7IFByb2ZpbGVMYXlvdXQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9Qcm9maWxlXCI7XG5pbXBvcnQgeyBDaGFuZ2VQcm9maWxlIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvQ2hhbmdlUHJvZmlsZVwiO1xuaW1wb3J0IHsgQ2hhbmdlUGFzc3dvcmQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9DaGFuZ2VQYXNzd29yZFwiO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIi4uL2xpYnMvUm91dGVyXCI7XG5pbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uL2xpYnMvVHJhbnNwb3J0XCI7XG5pbXBvcnQgeyBJQ2hhdFZpZXdNb2RlbCB9IGZyb20gXCIuLi9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi9WaWV3TW9kZWxcIjtcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xuaW1wb3J0IHsgSVVzZXJWaWV3TW9kZWwgfSBmcm9tIFwiLi4vVmlld01vZGVsL1VzZXJWaWV3TW9kZWxcIjtcblxuZXhwb3J0IGNvbnN0IFJvdXRlckluaXQgPSAoY29udGFpbmVyOiBDb250YWluZXIpOiBSb3V0ZXIgPT4ge1xuICByZXR1cm4gbmV3IFJvdXRlcihcIiNyb290XCIpXG4gICAgLnVzZShcIi9cIiwgTG9naW5MYXlvdXQsICgpID0+IHtcbiAgICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgICAgLkdFVChcIi9hdXRoL3VzZXJcIilcbiAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh1c2VyLnJlc3BvbnNlKTtcbiAgICAgICAgfSk7XG4gICAgfSlcbiAgICAudXNlKFwiL3JlZ2lzdHJhdGlvblwiLCBSZWdpc3RyYXRpb25MYXlvdXQpXG4gICAgLnVzZShcIi9jaGF0XCIsIENoYXRMYXlvdXQsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGNoYXRWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElDaGF0Vmlld01vZGVsPihWSUVXX01PREVMLkNIQVQpO1xuICAgICAgYXdhaXQgY2hhdFZpZXdNb2RlbC5nZXRDaGF0cygpO1xuICAgICAgcmV0dXJuIGNoYXRWaWV3TW9kZWwuY2hhdHM7XG4gICAgfSlcbiAgICAudXNlKFwiL3Byb2ZpbGVcIiwgUHJvZmlsZUxheW91dCwgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlclZpZXdNb2RlbCA9IGNvbnRhaW5lci5nZXQ8SVVzZXJWaWV3TW9kZWw+KFZJRVdfTU9ERUwuVVNFUik7XG4gICAgICBhd2FpdCB1c2VyVmlld01vZGVsLmdldFVzZXIoKTtcbiAgICAgIHJldHVybiB1c2VyVmlld01vZGVsLnVzZXI7XG4gICAgfSlcbiAgICAudXNlKFwiL2VkaXRwcm9maWxlXCIsIENoYW5nZVByb2ZpbGUsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElVc2VyVmlld01vZGVsPihWSUVXX01PREVMLlVTRVIpO1xuICAgICAgYXdhaXQgdXNlclZpZXdNb2RlbC5nZXRVc2VyKCk7XG4gICAgICByZXR1cm4gdXNlclZpZXdNb2RlbC51c2VyO1xuICAgIH0pXG4gICAgLnVzZShcIi9lZGl0cGFzc3dvcmRcIiwgQ2hhbmdlUGFzc3dvcmQpXG4gICAgLnN0YXJ0KCk7XG59O1xuIiwiY29uc3QgQ2FjaGUgPSBuZXcgTWFwKCk7XG5leHBvcnQgZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAoXG4gICAgdHlwZW9mIGZ1bmMgIT0gXCJmdW5jdGlvblwiIHx8XG4gICAgKHJlc29sdmVyICE9IG51bGwgJiYgdHlwZW9mIHJlc29sdmVyICE9IFwiZnVuY3Rpb25cIilcbiAgKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgY2FjaGUgPSBtZW1vaXplZC5jYWNoZTtcblxuICAgIGlmIChjYWNoZS5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgbWVtb2l6ZWQuY2FjaGUgPSBDYWNoZTtcbiAgcmV0dXJuIG1lbW9pemVkO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==