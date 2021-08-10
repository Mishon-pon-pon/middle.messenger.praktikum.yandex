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

/***/ "./src/Store/index.ts":
/*!****************************!*\
  !*** ./src/Store/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initStore = void 0;
exports.initStore = {
    messages: "",
    chat: "",
};


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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatItem = void 0;
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Chat_1 = __webpack_require__(/*! ../../Layouts/Chat */ "./src/UI/Layouts/Chat/index.ts");
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Delete_1 = __webpack_require__(/*! ../Delete */ "./src/UI/Components/Delete/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../../../ViewModel */ "./src/ViewModel/index.ts");
const QueryParams_1 = __importDefault(__webpack_require__(/*! ../../../libs/QueryParams */ "./src/libs/QueryParams/index.ts"));
const Messages_1 = __webpack_require__(/*! ../Messages */ "./src/UI/Components/Messages/index.ts");
const Store_1 = __importDefault(__webpack_require__(/*! ../../../libs/Store */ "./src/libs/Store/index.ts"));
const ChatItem = (props) => {
    const key = `key-${props.id}`;
    return new HYPO_1.HYPO({
        templatePath: "chatItem.template.html",
        data: {
            ChatName: props.title,
            lastTime: props.created_by || "10:22",
            lastMessage: props.id || "Hi, how are you?",
            notificationCount: props.avatar || 3,
            key: key,
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
            messages: Messages_1.Messages({ chatId: "" }),
        },
    }).afterRender(() => {
        var _a;
        (_a = document.getElementById(key)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            const queryUtils = new QueryParams_1.default();
            queryUtils.setQueryParamsObj({ chat: props.id });
            Store_1.default.store.messages = props.id;
            Store_1.default.store.chat = props.id;
        });
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

/***/ "./src/UI/Components/ListItem/index.ts":
/*!*********************************************!*\
  !*** ./src/UI/Components/ListItem/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListItem = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const utils_1 = __webpack_require__(/*! ../../../libs/utils */ "./src/libs/utils/index.ts");
const ListItem = ({ text, onClick }) => {
    const key = utils_1.uuidv4();
    return new HYPO_1.HYPO({
        templatePath: "listitem.template.html",
        data: { text: text, key: key },
    }).afterRender(() => {
        var _a;
        (_a = document.getElementById(key)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", onClick);
    });
};
exports.ListItem = ListItem;


/***/ }),

/***/ "./src/UI/Components/MenuButton/index.ts":
/*!***********************************************!*\
  !*** ./src/UI/Components/MenuButton/index.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MenuButton = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Store_1 = __importDefault(__webpack_require__(/*! ../../../libs/Store */ "./src/libs/Store/index.ts"));
const ListItem_1 = __webpack_require__(/*! ../ListItem */ "./src/UI/Components/ListItem/index.ts");
const menulist = ["Удалить чат", "Подробности", "Settings"];
const MenuButton = ({ menuId }) => {
    const Menu = new HYPO_1.HYPO({
        templatePath: "menubutton.template.html",
        data: { class: "hide", menuId: menuId },
        children: {
            list: menulist
                .map((text) => {
                return ListItem_1.ListItem({
                    text: text,
                    onClick: () => {
                        alert(Store_1.default.store.chat);
                    },
                });
            })
                .reverse(),
        },
    }).afterRender(() => {
        const elem = document.getElementById(menuId);
        elem === null || elem === void 0 ? void 0 : elem.addEventListener("click", () => {
            const state = Menu.getState();
            const menuList = document.querySelector(".menu .menuList");
            const isHide = Array.from((menuList === null || menuList === void 0 ? void 0 : menuList.classList) || []).includes("hide");
            if (isHide) {
                state.class = "show";
            }
            else {
                state.class = "hide";
            }
        });
    });
    return Menu;
};
exports.MenuButton = MenuButton;


/***/ }),

/***/ "./src/UI/Components/Messages/index.ts":
/*!*********************************************!*\
  !*** ./src/UI/Components/Messages/index.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Messages = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Store_1 = __importStar(__webpack_require__(/*! ../../../libs/Store */ "./src/libs/Store/index.ts"));
exports.Messages = Store_1.observer(({ chatId }) => {
    return new HYPO_1.HYPO({
        templatePath: "messages.template.html",
        data: {
            messages: Store_1.default.store.messages,
        },
    });
});


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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatLayout = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const ChatItem_1 = __webpack_require__(/*! ../../Components/ChatItem */ "./src/UI/Components/ChatItem/index.ts");
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
const Empty_1 = __webpack_require__(/*! ../../Components/Empty */ "./src/UI/Components/Empty/index.ts");
const CreateChatModal_1 = __webpack_require__(/*! ../../Components/CreateChatModal */ "./src/UI/Components/CreateChatModal/index.ts");
const MenuButton_1 = __webpack_require__(/*! ../../Components/MenuButton */ "./src/UI/Components/MenuButton/index.ts");
const Store_1 = __importStar(__webpack_require__(/*! ../../../libs/Store */ "./src/libs/Store/index.ts"));
exports.ChatLayout = Store_1.observer((result) => {
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
        data: {
            messages: Store_1.default.store.messages,
        },
        children: {
            ProfileLink: Button_1.Button({
                title: "Profile",
                className: "profile-link__button",
                onClick: (e) => {
                    __1.router.go("/profile");
                },
            }),
            "menu-button": MenuButton_1.MenuButton({ menuId: "chatMenu" }),
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
});


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
    // Инициализация рендера происходит в RouterInit
    const router = router_1.AppInit(container);
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
        this.render = (data) => __awaiter(this, void 0, void 0, function* () {
            if (data) {
                this.data = Object.assign(Object.assign({}, this.data), data);
            }
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

/***/ "./src/libs/QueryParams/index.ts":
/*!***************************************!*\
  !*** ./src/libs/QueryParams/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class QueryUtils {
    constructor() {
        this.getQueryParamsObj = () => {
            const filterUrlString = this.getQueryParamsStr();
            if (filterUrlString === null) {
                return {};
            }
            return filterUrlString
                .split("&")
                .map((item) => {
                return item.split("=");
            })
                .reduce((prev, next) => {
                const [filterName, filterValue] = next;
                const isArrayValue = this.checkStringIsArrayValue(filterValue);
                if (isArrayValue) {
                    const value = this.extractArrayFromString(filterValue);
                    return Object.assign(Object.assign({}, prev), { [filterName]: value });
                }
                return Object.assign(Object.assign({}, prev), { [filterName]: window.decodeURI(filterValue) });
            }, {});
        };
        this.setQueryParamsStr = (params) => {
            window.history.pushState({ params: params }, "", `${window.location.hash.split("?")[0]}${params ? "?" : ""}${params}`);
        };
        this.setQueryParamsObj = (params, replace) => {
            const queryParams = this.compileFilters(params);
            if (replace) {
                window.history.replaceState(null, "", `${window.location.hash.split("?")[0]}${queryParams ? "?" : ""}${queryParams}`);
            }
            else {
                window.history.pushState(null, "", `${window.location.hash.split("?")[0]}${queryParams ? "?" : ""}${queryParams}`);
            }
        };
        this.compileFilters = (filters) => {
            const arrayFilters = [];
            for (let key in filters) {
                if (Array.isArray(filters[key])) {
                    const value = filters[key].join("%");
                    if (value.length > 0) {
                        arrayFilters.push(`${key}=[${encodeURI(`${value}`)}]`);
                    }
                }
                else {
                    if (filters[key] || filters[key] === 0) {
                        arrayFilters.push(`${key}=${filters[key]}`);
                    }
                }
            }
            return arrayFilters.join("&");
        };
        this.checkStringIsArrayValue = (value) => {
            return Array.isArray(decodeURI(value).match(/^\[[\d%]+\]$/gm));
        };
        this.extractArrayFromString = (value) => {
            const regex = /[\d,a-z,A-Z,а-я,А-Я,_-]+/gm;
            return decodeURI(value).match(regex);
        };
    }
    getQueryParamsStr() {
        return window.location.href.split("?")[1] || null;
    }
}
exports.default = QueryUtils;


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
        this._pathname = pathname.split("?")[0];
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
        this._rootQuery = rootQuery.split("?")[0];
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
        pathname = pathname.split("?")[0];
        return this.routes.find((route) => route.match(pathname));
    }
}
exports.Router = Router;
function isEqual(lhs, rhs) {
    return lhs === rhs;
}


/***/ }),

/***/ "./src/libs/Store/index.ts":
/*!*********************************!*\
  !*** ./src/libs/Store/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.observer = void 0;
const Store_1 = __webpack_require__(/*! ../../Store */ "./src/Store/index.ts");
let obj = {};
const map = new Map();
class _Store {
    constructor(store) {
        this.store = new Proxy(store, {
            get: (target, p, receiver) => {
                obj[p] = true;
                return target[p];
            },
            set: (target, p, value, receiver) => {
                target[p] = value;
                for (let item of map.entries()) {
                    if (item[0][p]) {
                        const state = item[1].getState();
                        item[1].render(target);
                    }
                }
                return true;
            },
        });
    }
}
function observer(component) {
    return (props) => {
        const _res = component(props);
        const state = _res.getState();
        map.set(obj, _res);
        obj = {};
        return _res;
    };
}
exports.observer = observer;
const Store = new _Store(Store_1.initStore);
exports.default = Store;


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
exports.AppInit = void 0;
const Login_1 = __webpack_require__(/*! ../UI/Layouts/Login */ "./src/UI/Layouts/Login/index.ts");
const Chat_1 = __webpack_require__(/*! ../UI/Layouts/Chat */ "./src/UI/Layouts/Chat/index.ts");
const Registration_1 = __webpack_require__(/*! ../UI/Layouts/Registration */ "./src/UI/Layouts/Registration/index.ts");
const Profile_1 = __webpack_require__(/*! ../UI/Layouts/Profile */ "./src/UI/Layouts/Profile/index.ts");
const ChangeProfile_1 = __webpack_require__(/*! ../UI/Layouts/ChangeProfile */ "./src/UI/Layouts/ChangeProfile/index.ts");
const ChangePassword_1 = __webpack_require__(/*! ../UI/Layouts/ChangePassword */ "./src/UI/Layouts/ChangePassword/index.ts");
const Router_1 = __webpack_require__(/*! ../libs/Router */ "./src/libs/Router/index.ts");
const Transport_1 = __webpack_require__(/*! ../libs/Transport */ "./src/libs/Transport/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../ViewModel */ "./src/ViewModel/index.ts");
const AppInit = (container) => {
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
exports.AppInit = AppInit;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQm9vdHN0cmFwL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0J1c3NpbmVzTGF5ZXIvQ2hhdFNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQnVzc2luZXNMYXllci9Vc2VyU2VydmljZS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9CdXNzaW5lc0xheWVyL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0luZnJhc3RzcnVjdHVyZUxheWVyL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0luZnJhc3RzcnVjdHVyZUxheWVyL2ludGVyZmFjZXMudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW50ZWdyYXRpb25hbExheWVyL0NoYXRBUEkudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW50ZWdyYXRpb25hbExheWVyL1VzZXJBUEkudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW50ZWdyYXRpb25hbExheWVyL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1N0b3JlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQXR0ZW50aW9uTWVzc2FnZS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9Db21wb25lbnRzL0J1dHRvbi9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9Db21wb25lbnRzL0NoYXRJdGVtL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQ3JlYXRlQ2hhdE1vZGFsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvRGVsZXRlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvRW1wdHkvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9JbnB1dC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9Db21wb25lbnRzL0xpc3RJdGVtL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvTWVudUJ1dHRvbi9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9Db21wb25lbnRzL01lc3NhZ2VzL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvUHJvZmlsZUlucHV0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvQ2hhbmdlUGFzc3dvcmQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvTGF5b3V0cy9DaGFuZ2VQcm9maWxlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvQ2hhdC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL0xvZ2luL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvUHJvZmlsZS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL1JlZ2lzdHJhdGlvbi9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvVXNlclZpZXdNb2RlbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9Db250YWluZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9IWVBPL0hZUE8udHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9RdWVyeVBhcmFtcy9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL1JvdXRlci9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL1N0b3JlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvVHJhbnNwb3J0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvVmFsaWRhdG9ycy9FbWFpbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL1ZhbGlkYXRvcnMvUmVxdWlyZWQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy91dGlscy9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9yb3V0ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9tb21pemUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsS0FBSztBQUNMLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0MsV0FBVztBQUNuRDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQyxjQUFjO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxrQkFBa0I7QUFDbkQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGlCQUFpQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7QUFD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QUFTLENBQUMsR0FBRyxDQUFpQixzQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQztJQUM1QixDQUFDLEVBQUM7U0FDRCxHQUFHLENBQUMsY0FBYyxFQUFFLDZCQUFhLEVBQUUsR0FBUyxFQUFFO1FBQzdDLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQWlCLHNCQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckUsTUFBTSxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDOUIsT0FBTyxhQUFhLENBQUMsSUFBSSxDQUFDO0lBQzVCLENBQUMsRUFBQztTQUNELEdBQUcsQ0FBQyxlQUFlLEVBQUUsK0JBQWMsQ0FBQztTQUNwQyxLQUFLLEVBQUUsQ0FBQztBQUNiLENBQUMsQ0FBQztBQTNCVyxlQUFPLFdBMkJsQjs7Ozs7Ozs7Ozs7Ozs7OztBQ3hDRjtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUN0QkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiBkZWZpbmUob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqW2tleV07XG4gIH1cbiAgdHJ5IHtcbiAgICAvLyBJRSA4IGhhcyBhIGJyb2tlbiBPYmplY3QuZGVmaW5lUHJvcGVydHkgdGhhdCBvbmx5IHdvcmtzIG9uIERPTSBvYmplY3RzLlxuICAgIGRlZmluZSh7fSwgXCJcIik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGRlZmluZSA9IGZ1bmN0aW9uKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldID0gdmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gZGVmaW5lKFxuICAgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLFxuICAgIHRvU3RyaW5nVGFnU3ltYm9sLFxuICAgIFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICApO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIGRlZmluZShwcm90b3R5cGUsIG1ldGhvZCwgZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGRlZmluZShnZW5GdW4sIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvckZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IsIFByb21pc2VJbXBsKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VJbXBsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIGV4cG9ydHMuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIGV4cG9ydHMuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCwgUHJvbWlzZUltcGwpIHtcbiAgICBpZiAoUHJvbWlzZUltcGwgPT09IHZvaWQgMCkgUHJvbWlzZUltcGwgPSBQcm9taXNlO1xuXG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpLFxuICAgICAgUHJvbWlzZUltcGxcbiAgICApO1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIGRlZmluZShHcCwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yXCIpO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufVxuIiwiaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcIi4uL2xpYnMvQ29udGFpbmVyXCI7XG5pbXBvcnQgeyBpbmZyYXN0cnVjdHVyZUNvbnRhaW5lciB9IGZyb20gXCIuLi9JbmZyYXN0c3J1Y3R1cmVMYXllclwiO1xuaW1wb3J0IHsgQXBpQ2xpZW50Q29udGFpbmVyIH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllclwiO1xuaW1wb3J0IHsgU2VydmljZUNvbnRhaW5lciB9IGZyb20gXCIuLi9CdXNzaW5lc0xheWVyXCI7XG5pbXBvcnQgeyBWaWV3TW9kZWxDb250YWluZXIgfSBmcm9tIFwiLi4vVmlld01vZGVsXCI7XG5cbmNvbnN0IENyZWF0ZURJQ29udGFpbmVyID0gKFxuICBpbmZyYXN0cnVjdHVyZUNvbnRhaW5lcjogQ29udGFpbmVyLFxuICBpbnRlZ3JlYXRpb25Db250YWluZXI6IENvbnRhaW5lcixcbiAgc2VydmljZUNvbnRhaW5lcjogQ29udGFpbmVyLFxuICB2aWV3TW9kZWxDb250YWluZXI6IENvbnRhaW5lclxuKSA9PiB7XG4gIHJldHVybiB2aWV3TW9kZWxDb250YWluZXJcbiAgICAucGFyZW50KHNlcnZpY2VDb250YWluZXIpXG4gICAgLnBhcmVudChpbnRlZ3JlYXRpb25Db250YWluZXIpXG4gICAgLnBhcmVudChpbmZyYXN0cnVjdHVyZUNvbnRhaW5lcik7XG59O1xuXG5leHBvcnQgY2xhc3MgQm9vdFN0cmFwIHtcbiAgY29udGFpbmVyOiBDb250YWluZXI7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29udGFpbmVyID0gQ3JlYXRlRElDb250YWluZXIoXG4gICAgICBpbmZyYXN0cnVjdHVyZUNvbnRhaW5lcixcbiAgICAgIEFwaUNsaWVudENvbnRhaW5lcixcbiAgICAgIFNlcnZpY2VDb250YWluZXIsXG4gICAgICBWaWV3TW9kZWxDb250YWluZXJcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJQ2hhdERUTyB9IGZyb20gXCIuLi9VSS9Db21wb25lbnRzL0NoYXRJdGVtXCI7XG5pbXBvcnQgeyBJQ2hhdEFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvQ2hhdEFQSVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDaGF0U2VydmljZSB7XG4gIGdldENoYXRzOiAoKSA9PiBQcm9taXNlPEFycmF5PElDaGF0RFRPPj47XG4gIHNhdmVDaGF0OiAoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4gUHJvbWlzZTx2b2lkPjtcbiAgZGVsZXRlQ2hhdDogKGNoYXRJZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuXG5leHBvcnQgY2xhc3MgQ2hhdFNlcnZpY2UgaW1wbGVtZW50cyBJQ2hhdFNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgQXBpQ2xpZW50OiBJQ2hhdEFQSUNsaWVudCkge31cblxuICBnZXRDaGF0cyA9ICgpOiBQcm9taXNlPEFycmF5PElDaGF0RFRPPj4gPT4ge1xuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5nZXRDaGF0cygpO1xuICB9O1xuXG4gIHNhdmVDaGF0ID0gKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IHtcbiAgICByZXR1cm4gdGhpcy5BcGlDbGllbnQuc2F2ZUNoYXQoZGF0YSk7XG4gIH07XG5cbiAgZGVsZXRlQ2hhdChjaGF0SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5kZWxldGVDaGF0KGNoYXRJZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IElVc2VyQVBJQ2xpZW50IH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllci9Vc2VyQVBJXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL1Byb2ZpbGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJVXNlclNlcnZpY2Uge1xuICBnZXRVc2VyKCk6IFByb21pc2U8SVByb2ZpbGVEVE8+O1xuICBzYXZlVXNlcih1c2VyOklQcm9maWxlRFRPKTpQcm9taXNlPElQcm9maWxlRFRPPjtcbn1cblxuZXhwb3J0IGNsYXNzIFVzZXJTZXJ2aWNlIGltcGxlbWVudHMgSVVzZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIEFwaUNsaWVudDogSVVzZXJBUElDbGllbnQpIHt9XG4gIHNhdmVVc2VyKHVzZXI6SVByb2ZpbGVEVE8pOlByb21pc2U8SVByb2ZpbGVEVE8+e1xuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5zYXZlVXNlcih1c2VyKVxuICB9XG4gIGdldFVzZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuQXBpQ2xpZW50LmdldFVzZXIoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQVBJX0NMSUVOVCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXJcIjtcbmltcG9ydCB7IElDaGF0QVBJQ2xpZW50IH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllci9DaGF0QVBJXCI7XG5pbXBvcnQgeyBJVXNlckFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSVwiO1xuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcIi4uL2xpYnMvQ29udGFpbmVyXCI7XG5pbXBvcnQgeyBDaGF0U2VydmljZSB9IGZyb20gXCIuL0NoYXRTZXJ2aWNlXCI7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gXCIuL1VzZXJTZXJ2aWNlXCI7XG5cbmV4cG9ydCBjb25zdCBTRVJWSUNFID0ge1xuICBDSEFUOiBTeW1ib2wuZm9yKFwiQ2hhdFNlcnZpY2VcIiksXG4gIFVTRVI6IFN5bWJvbC5mb3IoXCJVc2VyU2VydmNpZVwiKSxcbn07XG5cbmV4cG9ydCBjb25zdCBTZXJ2aWNlQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcigpO1xuXG5TZXJ2aWNlQ29udGFpbmVyLmJpbmQoU0VSVklDRS5DSEFUKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gIGNvbnN0IEFQSUNsaWVudCA9IGNvbnRhaW5lci5nZXQ8SUNoYXRBUElDbGllbnQ+KEFQSV9DTElFTlQuQ0hBVCk7XG4gIHJldHVybiBuZXcgQ2hhdFNlcnZpY2UoQVBJQ2xpZW50KTtcbn0pO1xuXG5TZXJ2aWNlQ29udGFpbmVyLmJpbmQoU0VSVklDRS5VU0VSKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gIGNvbnN0IEFQSUNsaWVudCA9IGNvbnRhaW5lci5nZXQ8SVVzZXJBUElDbGllbnQ+KEFQSV9DTElFTlQuVVNFUik7XG4gIHJldHVybiBuZXcgVXNlclNlcnZpY2UoQVBJQ2xpZW50KTtcbn0pO1xuIiwiaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcIi4uL2xpYnMvQ29udGFpbmVyXCI7XG5pbXBvcnQgeyBBUElNb2R1bGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzXCI7XG5cbmV4cG9ydCBjb25zdCBJTlRFR1JBVElPTl9NT0RVTEUgPSB7XG4gIEFQSU1vZHVsZTogU3ltYm9sLmZvcihcIkFQSVwiKSxcbn07XG5cbmV4cG9ydCBjb25zdCBpbmZyYXN0cnVjdHVyZUNvbnRhaW5lciA9IG5ldyBDb250YWluZXIoKTtcblxuaW5mcmFzdHJ1Y3R1cmVDb250YWluZXJcbiAgLmJpbmQoSU5URUdSQVRJT05fTU9EVUxFLkFQSU1vZHVsZSlcbiAgLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IEFQSU1vZHVsZSgpO1xuICB9KTtcbiIsImltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tIFwiLi4vbGlicy9UcmFuc3BvcnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQVBJTW9kdWxlIHtcbiAgZ2V0RGF0YTogPFA+KHVybDogc3RyaW5nLCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IFByb21pc2U8UD47XG4gIHBvc3REYXRhOiA8UCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KFxuICAgIHVybDogc3RyaW5nLFxuICAgIHBhcmFtczogUFxuICApID0+IFByb21pc2U8UD47XG4gIHB1dERhdGE6IDxQPih1cmw6IHN0cmluZywgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiBQcm9taXNlPFA+O1xuICBkZWxldGVEYXRhOiAodXJsOiBzdHJpbmcsIHBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4gUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIEFQSU1vZHVsZSBpbXBsZW1lbnRzIElBUElNb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHt9XG4gIGdldERhdGEgPSA8UD4odXJsOiBzdHJpbmcsIGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPFA+ID0+IHtcbiAgICByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAuR0VUKHVybCwgdGhpcy5nZXRQYXJtcyhkYXRhKSlcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzdWx0LnJlc3BvbnNlKTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIHBvc3REYXRhID0gYXN5bmMgPFAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PihcbiAgICB1cmw6IHN0cmluZyxcbiAgICBkYXRhOiBQXG4gICk6IFByb21pc2U8UD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgIC5QT1NUKHVybCwgdGhpcy5nZXRQYXJtcyhkYXRhKSlcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzdWx0LnJlc3BvbnNlKTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIGRlbGV0ZURhdGEgPSAodXJsOiBzdHJpbmcsIGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAuREVMRVRFKHVybCwgdGhpcy5nZXRQYXJtcyhkYXRhKSlcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzdWx0LnJlc3BvbnNlKTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIHB1dERhdGEgPSA8UD4odXJsOiBzdHJpbmcsIGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPFA+ID0+IHtcbiAgICByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpLlBVVCh1cmwsIHRoaXMuZ2V0UGFybXMoZGF0YSkpO1xuICB9O1xuXG4gIHByaXZhdGUgZ2V0UGFybXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KFxuICAgIGRhdGE6IFRcbiAgKTogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0ge1xuICAgIHJldHVybiB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgfSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSUFQSU1vZHVsZSB9IGZyb20gXCIuLi9JbmZyYXN0c3J1Y3R1cmVMYXllci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBJQ2hhdERUTyB9IGZyb20gXCIuLi9VSS9Db21wb25lbnRzL0NoYXRJdGVtXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNoYXRBUElDbGllbnQge1xuICBnZXRDaGF0cygpOiBQcm9taXNlPEFycmF5PElDaGF0RFRPPj47XG4gIHNhdmVDaGF0KGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+O1xuICBkZWxldGVDaGF0KGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xufVxuXG5leHBvcnQgY2xhc3MgQ2hhdEFQSUNsaWVudCBpbXBsZW1lbnRzIElDaGF0QVBJQ2xpZW50IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIEFQSU1vZHVsZTogSUFQSU1vZHVsZSkge31cblxuICBnZXRDaGF0cyA9IGFzeW5jICgpOiBQcm9taXNlPEFycmF5PElDaGF0RFRPPj4gPT4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLkFQSU1vZHVsZS5nZXREYXRhPElDaGF0RFRPW10+KFwiL2NoYXRzXCIsIHt9KS50aGVuKFxuICAgICAgKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICk7XG4gIH07XG5cbiAgc2F2ZUNoYXQgPSBhc3luYyAoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGF3YWl0IHRoaXMuQVBJTW9kdWxlLnBvc3REYXRhKFwiL2NoYXRzXCIsIGRhdGEpO1xuICB9O1xuXG4gIGRlbGV0ZUNoYXQoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLkFQSU1vZHVsZS5kZWxldGVEYXRhKFwiL2NoYXRzXCIsIHsgY2hhdElkOiBpZCB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSUFQSU1vZHVsZSB9IGZyb20gXCIuLi9JbmZyYXN0c3J1Y3R1cmVMYXllci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL1Byb2ZpbGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJVXNlckFQSUNsaWVudCB7XG4gIGdldFVzZXIoKTogUHJvbWlzZTxJUHJvZmlsZURUTz47XG4gIHNhdmVVc2VyKHVzZXI6IElQcm9maWxlRFRPKTogUHJvbWlzZTxJUHJvZmlsZURUTz5cbn1cblxuZXhwb3J0IGNsYXNzIFVzZXJBUElDbGllbnQgaW1wbGVtZW50cyBJVXNlckFQSUNsaWVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBBUElNb2R1bGU6IElBUElNb2R1bGUpIHsgfVxuXG4gIGdldFVzZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdXNlciA9IGF3YWl0IHRoaXMuQVBJTW9kdWxlLmdldERhdGE8SVByb2ZpbGVEVE8+KFwiL2F1dGgvdXNlclwiLCB7fSk7XG4gICAgcmV0dXJuIHVzZXI7XG4gIH07XG5cbiAgc2F2ZVVzZXIgPSAodXNlcjogSVByb2ZpbGVEVE8pID0+IHtcbiAgICByZXR1cm4gdGhpcy5BUElNb2R1bGUucHV0RGF0YTxJUHJvZmlsZURUTz4oJy91c2VyL3Byb2ZpbGUnLCB1c2VyKVxuICB9XG59XG4iLCJpbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcbmltcG9ydCB7IElOVEVHUkFUSU9OX01PRFVMRSB9IGZyb20gXCIuLi9JbmZyYXN0c3J1Y3R1cmVMYXllclwiO1xuaW1wb3J0IHsgQ2hhdEFQSUNsaWVudCB9IGZyb20gXCIuL0NoYXRBUElcIjtcbmltcG9ydCB7IElBUElNb2R1bGUgfSBmcm9tIFwiLi4vSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgVXNlckFQSUNsaWVudCB9IGZyb20gXCIuL1VzZXJBUElcIjtcblxuZXhwb3J0IGNvbnN0IEFQSV9DTElFTlQgPSB7XG4gIENIQVQ6IFN5bWJvbC5mb3IoXCJDaGF0QVBJQ2xpZW50XCIpLFxuICBVU0VSOiBTeW1ib2wuZm9yKFwiVXNlckFQSUNsaWVudFwiKSxcbn07XG5cbmV4cG9ydCBjb25zdCBBcGlDbGllbnRDb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XG5cbkFwaUNsaWVudENvbnRhaW5lci5iaW5kKEFQSV9DTElFTlQuQ0hBVCkudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuICBjb25zdCBBUElNb2R1bGUgPSBjb250YWluZXIuZ2V0PElBUElNb2R1bGU+KElOVEVHUkFUSU9OX01PRFVMRS5BUElNb2R1bGUpO1xuICByZXR1cm4gbmV3IENoYXRBUElDbGllbnQoQVBJTW9kdWxlKTtcbn0pO1xuXG5BcGlDbGllbnRDb250YWluZXIuYmluZChBUElfQ0xJRU5ULlVTRVIpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgY29uc3QgQVBJTW9kdWxlID0gY29udGFpbmVyLmdldDxJQVBJTW9kdWxlPihJTlRFR1JBVElPTl9NT0RVTEUuQVBJTW9kdWxlKTtcbiAgcmV0dXJuIG5ldyBVc2VyQVBJQ2xpZW50KEFQSU1vZHVsZSk7XG59KTtcbiIsImV4cG9ydCBjb25zdCBpbml0U3RvcmUgPSB7XG4gIG1lc3NhZ2VzOiBcIlwiLFxuICBjaGF0OiBcIlwiLFxufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcblxuZXhwb3J0IGNvbnN0IEF0dGVudGlvbk1lc3NhZ2UgPSAoKTogSFlQTyA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImF0dGVudGlvbi50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgbWVzc2FnZTogXCJcIixcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7fSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvdXRpbHNcIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIGlkPzogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICBjbGFzc05hbWU6IHN0cmluZztcbiAgb25DbGljazogKGU6IEV2ZW50KSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY29uc3QgQnV0dG9uID0gKHByb3BzOiBJUHJvcHMpID0+IHtcbiAgY29uc3QgaWQgPSBwcm9wcy5pZCB8fCB1dWlkdjQoKTtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiYnV0dG9uLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBpZDogaWQsXG4gICAgICB0aXRsZTogcHJvcHMudGl0bGUsXG4gICAgICBjbGFzc05hbWU6IHByb3BzLmNsYXNzTmFtZSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgIHByb3BzLm9uQ2xpY2soZSk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IGNvbnRhaW5lciwgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBDaGF0TGF5b3V0IH0gZnJvbSBcIi4uLy4uL0xheW91dHMvQ2hhdFwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xuaW1wb3J0IHsgRGVsZXRlIH0gZnJvbSBcIi4uL0RlbGV0ZVwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWxcIjtcbmltcG9ydCB7IElDaGF0Vmlld01vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbC9DaGF0Vmlld01vZGVsXCI7XG5pbXBvcnQgUXVlcnlVdGlscyBmcm9tIFwiLi4vLi4vLi4vbGlicy9RdWVyeVBhcmFtc1wiO1xuaW1wb3J0IHsgTWVzc2FnZXMgfSBmcm9tIFwiLi4vTWVzc2FnZXNcIjtcbmltcG9ydCBTdG9yZSBmcm9tIFwiLi4vLi4vLi4vbGlicy9TdG9yZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDaGF0RFRPIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgYXZhdGFyOiBzdHJpbmcgfCBudWxsO1xuICBjcmVhdGVkX2J5OiBudW1iZXI7XG4gIGlkOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJUHJvcHMgZXh0ZW5kcyBJQ2hhdERUTyB7XG4gIGNsYXNzTmFtZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IENoYXRJdGVtID0gKHByb3BzOiBJQ2hhdERUTykgPT4ge1xuICBjb25zdCBrZXkgPSBga2V5LSR7cHJvcHMuaWR9YDtcblxuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJjaGF0SXRlbS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgQ2hhdE5hbWU6IHByb3BzLnRpdGxlLFxuICAgICAgbGFzdFRpbWU6IHByb3BzLmNyZWF0ZWRfYnkgfHwgXCIxMDoyMlwiLFxuICAgICAgbGFzdE1lc3NhZ2U6IHByb3BzLmlkIHx8IFwiSGksIGhvdyBhcmUgeW91P1wiLFxuICAgICAgbm90aWZpY2F0aW9uQ291bnQ6IHByb3BzLmF2YXRhciB8fCAzLFxuICAgICAga2V5OiBrZXksXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgZGVsZXRlOiBEZWxldGUoe1xuICAgICAgICBpZDogYGRlbGV0ZUl0ZW0ke3Byb3BzLmlkfWAsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjaGF0Vmlld01vZGVsID0gY29udGFpbmVyLmdldDxJQ2hhdFZpZXdNb2RlbD4oVklFV19NT0RFTC5DSEFUKTtcbiAgICAgICAgICBjaGF0Vmlld01vZGVsLmRlbGV0ZUNoYXQoU3RyaW5nKHByb3BzLmlkKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBDaGF0TGF5b3V0KGNoYXRWaWV3TW9kZWwuY2hhdHMpLnJlbmRlcigpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBtZXNzYWdlczogTWVzc2FnZXMoeyBjaGF0SWQ6IFwiXCIgfSksXG4gICAgfSxcbiAgfSkuYWZ0ZXJSZW5kZXIoKCkgPT4ge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGtleSk/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCBxdWVyeVV0aWxzID0gbmV3IFF1ZXJ5VXRpbHMoKTtcbiAgICAgIHF1ZXJ5VXRpbHMuc2V0UXVlcnlQYXJhbXNPYmooeyBjaGF0OiBwcm9wcy5pZCB9KTtcbiAgICAgIFN0b3JlLnN0b3JlLm1lc3NhZ2VzID0gcHJvcHMuaWQ7XG4gICAgICBTdG9yZS5zdG9yZS5jaGF0ID0gcHJvcHMuaWQ7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IGNvbnRhaW5lciB9IGZyb20gXCIuLi8uLi8uLlwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgUmVxdWlyZWQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9WYWxpZGF0b3JzL1JlcXVpcmVkXCI7XG5pbXBvcnQgeyBBdHRlbnRpb25NZXNzYWdlIH0gZnJvbSBcIi4uL0F0dGVudGlvbk1lc3NhZ2VcIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL0lucHV0XCI7XG5pbXBvcnQgeyBJQ2hhdFZpZXdNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgQ2hhdExheW91dCB9IGZyb20gXCIuLi8uLi9MYXlvdXRzL0NoYXRcIjtcbmltcG9ydCB7IFZJRVdfTU9ERUwgfSBmcm9tIFwiLi4vLi4vLi4vVmlld01vZGVsXCI7XG5cbmV4cG9ydCBjb25zdCBDcmVhdGVDaGF0TW9kYWwgPSAoKSA9PiB7XG4gIGNvbnN0IGF0dGVudGlvbk1lc3NhZ2UgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IHN0YXRlID0gYXR0ZW50aW9uTWVzc2FnZS5nZXRTdGF0ZSgpO1xuXG4gIGxldCBDaGF0TmFtZSA9IFwiXCI7XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiY3JlYXRlY2hhdG1vZGFsLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7fSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgaW5wdXQ6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwiQ2hhdCBuYW1lXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImNoYXRuYW1lXCIsXG4gICAgICAgIGlkOiBcImNoYXRuYW1lXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJjLWMtbW9kYWxfX2lucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBhdHRlbnRpb25NZXNzYWdlLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgICBDaGF0TmFtZSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBjcmVhdGU6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCh0L7Qt9C00LDRgtGMXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJjcmVhdGUtYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGlmICghQ2hhdE5hbWUpIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY2hhdFZpZXdNb2RlbCA9IGNvbnRhaW5lci5nZXQ8SUNoYXRWaWV3TW9kZWw+KFxuICAgICAgICAgICAgICBWSUVXX01PREVMLkNIQVRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjaGF0Vmlld01vZGVsLnNhdmVDaGF0KHsgdGl0bGU6IENoYXROYW1lIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYy1jLW1vZGFsXCIpWzBdXG4gICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgIENoYXRMYXlvdXQoY2hhdFZpZXdNb2RlbC5jaGF0cykucmVuZGVyKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGNhbmNlbDogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0J7RgtC80LXQvdCwXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJjYW5jZWwtYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgICAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImMtYy1tb2RhbFwiKVswXVxuICAgICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5cbmludGVyZmFjZSBJUHJvcHMge1xuICBpZDogc3RyaW5nO1xuICBvbkNsaWNrOiAoKSA9PiB2b2lkO1xufVxuZXhwb3J0IGNvbnN0IERlbGV0ZSA9IChwcm9wczogSVByb3BzKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImRlbGV0ZS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgcGF0aDogXCIvbWVkaWEvVmVjdG9yLnN2Z1wiLFxuICAgICAgaWQ6IHByb3BzLmlkLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHt9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJvcHMuaWQpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgcHJvcHMub25DbGljaygpO1xuICAgIH0pO1xuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5cbmV4cG9ydCBjb25zdCBFbXB0eSA9ICgpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiZW1wdHkudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHt9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBFbXB0eSB9IGZyb20gXCIuLi9FbXB0eVwiO1xuXG5pbnRlcmZhY2UgSVByb3BzIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgdHlwZTogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGlkOiBzdHJpbmc7XG4gIGNsYXNzTmFtZTogc3RyaW5nO1xuICBDaGlsZEF0dGVudGlvbj86IEhZUE87XG4gIG9uRm9jdXM/OiAoZTogRXZlbnQpID0+IHZvaWQ7XG4gIG9uQmx1cj86IChlOiBFdmVudCkgPT4gdm9pZDtcbn1cblxuLy9AdG9kbzog0L/RgNC40LrRgNGD0YLQuNGC0Ywg0YPQvdC40LrQsNC70YzQvdC+0YHRgtGMINC60LDQttC00L7Qs9C+INGN0LvQtdC80LXQvdGC0LBcblxuZXhwb3J0IGNvbnN0IElucHV0ID0gKHByb3BzOiBJUHJvcHMpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiaW5wdXQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIGxhYmVsOiB7XG4gICAgICAgIG5hbWU6IHByb3BzLmxhYmVsLFxuICAgICAgfSxcbiAgICAgIGF0cmlidXRlOiB7XG4gICAgICAgIHR5cGU6IHByb3BzLnR5cGUsXG4gICAgICAgIG5hbWU6IHByb3BzLm5hbWUsXG4gICAgICAgIGlkOiBwcm9wcy5pZCxcbiAgICAgICAgY2xhc3NOYW1lOiBwcm9wcy5jbGFzc05hbWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIEF0dGVudGlvbjogcHJvcHMuQ2hpbGRBdHRlbnRpb24gfHwgRW1wdHkoKSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChwcm9wcy5pZClcbiAgICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIChlOiBGb2N1c0V2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgY29uc3QgaW5wdXRMYWJlbCA9IGlucHV0LnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgXCIuZm9ybS1pbnB1dF9fbGFiZWxcIlxuICAgICAgICApO1xuICAgICAgICBpbnB1dExhYmVsPy5jbGFzc0xpc3QuYWRkKFwiZm9ybS1pbnB1dF9fbGFiZWxfc2VsZWN0XCIpO1xuICAgICAgICBwcm9wcy5vbkZvY3VzPy4oZSk7XG4gICAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wcy5pZCk/LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIChlOiBFdmVudCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgY29uc3QgaW5wdXRMYWJlbCA9IGlucHV0LnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiLmZvcm0taW5wdXRfX2xhYmVsXCJcbiAgICAgICk7XG4gICAgICBpZiAoIWlucHV0LnZhbHVlKSB7XG4gICAgICAgIGlucHV0TGFiZWw/LmNsYXNzTGlzdC5yZW1vdmUoXCJmb3JtLWlucHV0X19sYWJlbF9zZWxlY3RcIik7XG4gICAgICB9XG4gICAgICBwcm9wcy5vbkJsdXI/LihlKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvdXRpbHNcIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIHRleHQ6IHN0cmluZztcbiAgb25DbGljazogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IExpc3RJdGVtID0gKHsgdGV4dCwgb25DbGljayB9OiBJUHJvcHMpID0+IHtcbiAgY29uc3Qga2V5ID0gdXVpZHY0KCk7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImxpc3RpdGVtLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7IHRleHQ6IHRleHQsIGtleToga2V5IH0sXG4gIH0pLmFmdGVyUmVuZGVyKCgpID0+IHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChrZXkpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb25DbGljayk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCBTdG9yZSBmcm9tIFwiLi4vLi4vLi4vbGlicy9TdG9yZVwiO1xuaW1wb3J0IHsgTGlzdEl0ZW0gfSBmcm9tIFwiLi4vTGlzdEl0ZW1cIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIG1lbnVJZDogc3RyaW5nO1xufVxuXG5jb25zdCBtZW51bGlzdCA9IFtcItCj0LTQsNC70LjRgtGMINGH0LDRglwiLCBcItCf0L7QtNGA0L7QsdC90L7RgdGC0LhcIiwgXCJTZXR0aW5nc1wiXTtcblxuZXhwb3J0IGNvbnN0IE1lbnVCdXR0b24gPSAoeyBtZW51SWQgfTogSVByb3BzKSA9PiB7XG4gIGNvbnN0IE1lbnUgPSBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcIm1lbnVidXR0b24udGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHsgY2xhc3M6IFwiaGlkZVwiLCBtZW51SWQ6IG1lbnVJZCB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBsaXN0OiBtZW51bGlzdFxuICAgICAgICAubWFwKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIExpc3RJdGVtKHtcbiAgICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGFsZXJ0KFN0b3JlLnN0b3JlLmNoYXQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLnJldmVyc2UoKSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1lbnVJZCk7XG4gICAgZWxlbT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YXRlID0gTWVudS5nZXRTdGF0ZSgpO1xuICAgICAgY29uc3QgbWVudUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUgLm1lbnVMaXN0XCIpO1xuICAgICAgY29uc3QgaXNIaWRlID0gQXJyYXkuZnJvbShtZW51TGlzdD8uY2xhc3NMaXN0IHx8IFtdKS5pbmNsdWRlcyhcImhpZGVcIik7XG4gICAgICBpZiAoaXNIaWRlKSB7XG4gICAgICAgIHN0YXRlLmNsYXNzID0gXCJzaG93XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5jbGFzcyA9IFwiaGlkZVwiO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gTWVudTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgU3RvcmUsIHsgb2JzZXJ2ZXIgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9TdG9yZVwiO1xuXG5pbnRlcmZhY2UgSVByb3BzIHtcbiAgY2hhdElkOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBNZXNzYWdlcyA9IG9ic2VydmVyKCh7IGNoYXRJZCB9OiBJUHJvcHMpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwibWVzc2FnZXMudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIG1lc3NhZ2VzOiBTdG9yZS5zdG9yZS5tZXNzYWdlcyxcbiAgICB9LFxuICB9KTtcbn0pO1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuXG5pbnRlcmZhY2UgSVByb3BzIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgdmFsdWU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgb25DaGFnZTogKGU6IHsgdmFsdWU6IHN0cmluZyB9KSA9PiB2b2lkO1xufVxuZXhwb3J0IGNvbnN0IFByb2ZpbGVJbnB1dCA9ICh7IGxhYmVsLCB2YWx1ZSwgaWQsIG9uQ2hhZ2UgfTogSVByb3BzKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcInByb2ZpbGVJbnB1dC50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgaWQ6IGlkLFxuICAgIH0sXG4gIH0pLmFmdGVyUmVuZGVyKCgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIGlucHV0Py5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB7XG4gICAgICBvbkNoYWdlKHsgdmFsdWU6IGlucHV0LnZhbHVlIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuaW1wb3J0IHsgbWVtb2l6ZSB9IGZyb20gXCIuLi8uLi8uLi9saWJzL21vbWl6ZVwiO1xuXG5leHBvcnQgY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBtZW1vaXplKCgpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCIjcm9vdFwiKSB8fCBkb2N1bWVudC5ib2R5LFxuICAgIHRlbXBsYXRlUGF0aDogXCJjaGFuZ2VQYXNzd29yZC50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge30sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIHNhdmU6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCh0L7RhdGA0LDQvdC40YLRjFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwicGFzc3dvcmRfZWRpdF9fYWN0aW9uX19zYXZlXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9wcm9maWxlXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IGNvbnRhaW5lciwgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uL1Byb2ZpbGVcIjtcbmltcG9ydCB7IElVc2VyVmlld01vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbC9Vc2VyVmlld01vZGVsXCI7XG5pbXBvcnQgeyBWSUVXX01PREVMIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgUHJvZmlsZUlucHV0IH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvUHJvZmlsZUlucHV0XCI7XG5cbmNvbnN0IENvbmZpZzogeyBba2V5IGluIGtleW9mIElQcm9maWxlRFRPXT86IHsgbGFiZWw6IHN0cmluZyB9IH0gPSB7XG4gIGVtYWlsOiB7XG4gICAgbGFiZWw6IFwi0J/QvtGH0YLQsFwiLFxuICB9LFxuICBsb2dpbjoge1xuICAgIGxhYmVsOiBcItCb0L7Qs9C40L1cIixcbiAgfSxcbiAgZmlyc3RfbmFtZToge1xuICAgIGxhYmVsOiBcItCY0LzRj1wiLFxuICB9LFxuICBzZWNvbmRfbmFtZToge1xuICAgIGxhYmVsOiBcItCk0LDQvNC40LvQuNGPXCIsXG4gIH0sXG4gIGRpc3BsYXlfbmFtZToge1xuICAgIGxhYmVsOiBcItCY0LzRjyDQsiDRh9Cw0YLQsNGFXCIsXG4gIH0sXG4gIHBob25lOiB7XG4gICAgbGFiZWw6IFwi0KLQtdC70LXRhNC+0L1cIixcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBDaGFuZ2VQcm9maWxlID0gKGRhdGE6IElQcm9maWxlRFRPKSA9PiB7XG4gIGNvbnN0IHVzZXJWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElVc2VyVmlld01vZGVsPihWSUVXX01PREVMLlVTRVIpO1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHJlbmRlclRvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIikgfHwgZG9jdW1lbnQuYm9keSxcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiY2hhbmdlUHJvZmlsZS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgZW1haWw6IGRhdGE/LmVtYWlsLFxuICAgICAgbG9naW46IGRhdGE/LmxvZ2luLFxuICAgICAgZmlyc3ROYW1lOiBkYXRhPy5maXJzdF9uYW1lLFxuICAgICAgc2Vjb25kTmFtZTogZGF0YT8uc2Vjb25kX25hbWUsXG4gICAgICBkaXNwbGF5TmFtZTogZGF0YT8uZGlzcGxheV9uYW1lIHx8IFwiXCIsXG4gICAgICBwaG9uZTogZGF0YT8ucGhvbmUsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgc2F2ZTogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0KHQvtGF0YDQsNC90LjRgtGMXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJwcm9maWxlX2VkaXRfX2FjdGlvbl9fc2F2ZVwiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAodXNlclZpZXdNb2RlbC51c2VyKSB7XG4gICAgICAgICAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcbiAgICAgICAgICAgICAgXCJwcm9maWxlX2VkaXRcIlxuICAgICAgICAgICAgKVswXSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1c2VyVmlld01vZGVsLnVzZXIpO1xuICAgICAgICAgICAgdXNlclZpZXdNb2RlbC5zYXZlVXNlcih1c2VyVmlld01vZGVsLnVzZXIpLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgICAgICByb3V0ZXIuZ28oXCIvcHJvZmlsZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgaW5wdXRzOiBPYmplY3Qua2V5cyhDb25maWcpXG4gICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGtleSA9IGl0ZW0gYXMga2V5b2YgdHlwZW9mIGRhdGE7XG4gICAgICAgICAgY29uc3QgbGFiZWwgPSBDb25maWdbaXRlbSBhcyBrZXlvZiB0eXBlb2YgQ29uZmlnXT8ubGFiZWwgYXMgc3RyaW5nO1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gZGF0YSA/IChkYXRhW2tleV0gYXMgc3RyaW5nKSA6IFwiXCI7XG4gICAgICAgICAgcmV0dXJuIFByb2ZpbGVJbnB1dCh7XG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBpZDoga2V5LFxuICAgICAgICAgICAgb25DaGFnZTogKHsgdmFsdWUgfSkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gICAgICAgICAgICAgIHVzZXJWaWV3TW9kZWwudXNlciA9IHtcbiAgICAgICAgICAgICAgICAuLi51c2VyVmlld01vZGVsLnVzZXIsXG4gICAgICAgICAgICAgICAgW2l0ZW1dOiB2YWx1ZSxcbiAgICAgICAgICAgICAgfSBhcyBJUHJvZmlsZURUTztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IENoYXRJdGVtLCBJQ2hhdERUTyB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0NoYXRJdGVtXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuaW1wb3J0IHsgRW1wdHkgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9FbXB0eVwiO1xuaW1wb3J0IHsgQ3JlYXRlQ2hhdE1vZGFsIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQ3JlYXRlQ2hhdE1vZGFsXCI7XG5pbXBvcnQgeyBNZW51QnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvTWVudUJ1dHRvblwiO1xuaW1wb3J0IFN0b3JlLCB7IG9ic2VydmVyIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvU3RvcmVcIjtcblxuZXhwb3J0IGNvbnN0IENoYXRMYXlvdXQgPSBvYnNlcnZlcigocmVzdWx0OiBJQ2hhdERUT1tdKSA9PiB7XG4gIGNvbnN0IENoYXRJdGVtTGlzdDogSFlQT1tdID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICByZXN1bHQuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBDaGF0SXRlbUxpc3QucHVzaChDaGF0SXRlbSh7IC4uLml0ZW0gfSkpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIENoYXRJdGVtTGlzdC5wdXNoKEVtcHR5KCkpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpIHx8IGRvY3VtZW50LmJvZHksXG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYXQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIG1lc3NhZ2VzOiBTdG9yZS5zdG9yZS5tZXNzYWdlcyxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBQcm9maWxlTGluazogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwiUHJvZmlsZVwiLFxuICAgICAgICBjbGFzc05hbWU6IFwicHJvZmlsZS1saW5rX19idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFwibWVudS1idXR0b25cIjogTWVudUJ1dHRvbih7IG1lbnVJZDogXCJjaGF0TWVudVwiIH0pLFxuICAgICAgY2hhdEl0ZW06IENoYXRJdGVtTGlzdCxcbiAgICAgIGNyZWF0ZUNoYXRNb2RhbDogQ3JlYXRlQ2hhdE1vZGFsKCksXG4gICAgICBjcmVhdGVDaGF0QnV0dG9uOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCIrXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJuYXZpZ2F0aW9uX19jcmVhdGVDaGF0QnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjLWMtbW9kYWxcIilbMF1cbiAgICAgICAgICAgIC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvSW5wdXRcIjtcbmltcG9ydCB7IFJlcXVpcmVkIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZFwiO1xuaW1wb3J0IHsgQXR0ZW50aW9uTWVzc2FnZSB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0F0dGVudGlvbk1lc3NhZ2VcIjtcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLi9pbmRleFwiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi9Qcm9maWxlXCI7XG5cbi8qKlxuICogbm5ucnJyMTExTk5cbiAqL1xuXG5leHBvcnQgY29uc3QgTG9naW5MYXlvdXQgPSAodXNlcjogSVByb2ZpbGVEVE8pOiBIWVBPID0+IHtcbiAgaWYgKHVzZXIgJiYgdXNlci5pZCkge1xuICAgIHJvdXRlci5nbyhcIi9jaGF0XCIpO1xuICB9XG5cbiAgY29uc3QgYXR0ZW50aW9uTG9naW4gPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IGF0dGVudGlvbkxvZ2luU3RvcmUgPSBhdHRlbnRpb25Mb2dpbi5nZXRTdGF0ZSgpO1xuICBjb25zdCBhdHRlbnRpb25QYXNzID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBhdHRlbnRpb25QYXNzU3RvcmUgPSBhdHRlbnRpb25QYXNzLmdldFN0YXRlKCk7XG5cbiAgY29uc3QgRm9ybURhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpIHx8IGRvY3VtZW50LmJvZHksXG4gICAgdGVtcGxhdGVQYXRoOiBcImxvZ2luLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBGb3JtTmFtZTogXCLQktGF0L7QtFwiLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIElucHV0TG9naW46IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0JvQvtCz0LjQvVwiLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgbmFtZTogXCJsb2dpblwiLFxuICAgICAgICBpZDogXCJmb3JtLWlucHV0LWxvZ2luXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWxvZ2luX19mb3JtLWlucHV0XCIsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGNvbnN0IGNoZWNrID0gUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0Py52YWx1ZSk7XG4gICAgICAgICAgaWYgKCFjaGVjaykge1xuICAgICAgICAgICAgYXR0ZW50aW9uTG9naW5TdG9yZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dGVudGlvbkxvZ2luU3RvcmUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgICBGb3JtRGF0YVtcImxvZ2luXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogYXR0ZW50aW9uTG9naW4sXG4gICAgICB9KSxcbiAgICAgIElucHV0UGFzc3dvcmQ6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0J/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbmFtZTogXCJwYXNzd29yZFwiLFxuICAgICAgICBpZDogXCJmb3JtLWlucHV0LXBhc3N3b3JkXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWxvZ2luX19mb3JtLWlucHV0XCIsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmICghUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgYXR0ZW50aW9uUGFzc1N0b3JlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0ZW50aW9uUGFzc1N0b3JlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgICAgRm9ybURhdGFbXCJwYXNzd29yZFwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IGF0dGVudGlvblBhc3MsXG4gICAgICB9KSxcbiAgICAgIEJ1dHRvbjogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0JDQstGC0L7RgNC40LfQvtCy0LDRgtGM0YHRj1wiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgZGF0YTogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGxvZ2luOiBGb3JtRGF0YS5sb2dpbixcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6IEZvcm1EYXRhLnBhc3N3b3JkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAgICAgICAuUE9TVChcIi9hdXRoL3NpZ25pblwiLCBkYXRhKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgIHJvdXRlci5nbyhcIi9jaGF0XCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgTGlua1RvUmVnaXN0cmF0aW9uOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y9cIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tbGlua1wiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvcmVnaXN0cmF0aW9uXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9UcmFuc3BvcnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJUHJvZmlsZURUTyB7XG4gIGlkOiBudW1iZXI7XG4gIGRpc3BsYXlfbmFtZTogc3RyaW5nO1xuICBlbWFpbDogc3RyaW5nO1xuICBmaXJzdF9uYW1lOiBzdHJpbmc7XG4gIHNlY29uZF9uYW1lOiBzdHJpbmc7XG4gIGxvZ2luOiBzdHJpbmc7XG4gIHBob25lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBQcm9maWxlTGF5b3V0ID0gKGRhdGE6IElQcm9maWxlRFRPKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jvb3RcIiksXG4gICAgdGVtcGxhdGVQYXRoOiBcInByb2ZpbGUudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIC4uLmRhdGEsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgRWRpdFByb2ZpbGVMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQmNC30LzQtdC90LjRgtGMINC00LDQvdC90YvQtVwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19jaGFuZ2UtcHJvZmlsZVwiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL2VkaXRwcm9maWxlXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBFZGl0UGFzc3dvcmRMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQmNC30LzQtdC90LjRgtGMINC/0LDRgNC+0LvRjFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19jaGFuZ2UtcGFzc3dvcmRcIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9lZGl0cGFzc3dvcmRcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIEJhY2tMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQndCw0LfQsNC0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2JhY2tcIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9jaGF0XCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBFeGl0TGluazogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0JLRi9C50YLQuFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19leGl0XCIsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgICAgICAgIC5QT1NUKFwiL2F1dGgvbG9nb3V0XCIpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJvdXRlci5nbyhcIi9cIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvSW5wdXRcIjtcbi8vIGltcG9ydCB7IFZhbGlkYXRvciwgUnVsZSB9IGZyb20gXCIuLi8uLi9saWJzL1ZhbGlkYXRvclwiO1xuaW1wb3J0IHsgRW1haWxWYWxpZGF0b3IgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9WYWxpZGF0b3JzL0VtYWlsXCI7XG5pbXBvcnQgeyBSZXF1aXJlZCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1ZhbGlkYXRvcnMvUmVxdWlyZWRcIjtcbmltcG9ydCB7IEF0dGVudGlvbk1lc3NhZ2UgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9BdHRlbnRpb25NZXNzYWdlXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9UcmFuc3BvcnRcIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuXG5leHBvcnQgY29uc3QgUmVnaXN0cmF0aW9uTGF5b3V0ID0gKCkgPT4ge1xuICBjb25zdCBBdHRlbnRpb25FbWFpbCA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uTG9naW4gPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IEF0dGVudGlvblBhc3N3b3JkID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25QYXNzd29yZERvdWJsZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uRmlyc3ROYW1lID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25TZWNvbmROYW1lID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25QaG9uZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcblxuICBjb25zdCBGb3JtRGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jvb3RcIiksXG4gICAgdGVtcGxhdGVQYXRoOiBcInJlZ2lzdHJhdGlvbi50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgZm9ybVRpdGxlOiBcItCg0LXQs9C40YHRgtGA0LDRhtC40Y9cIixcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBJbnB1dEVtYWlsOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiBcItCf0L7Rh9GC0LBcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwiZW1haWxcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fZW1haWxfX2lucHV0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uRW1haWwsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25FbWFpbC5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoRW1haWxWYWxpZGF0b3IuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbXCJlbWFpbFwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDRjdGC0L4g0L3QtSDQv9C+0YXQvtC20LUg0L3QsCDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRi1wiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgSW5wdXRMb2dpbjogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQm9C+0LPQuNC9XCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImxvZ2luXCIsXG4gICAgICAgIGlkOiBcImZvcm1fX2xvZ2luX19pbnB1dFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1yZWdfX2Zvcm0taW5wdXRcIixcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvbkxvZ2luLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uTG9naW4uZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wibG9naW5cIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBGaXJzdE5hbWU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0JjQvNGPXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImZpcnN0X25hbWVcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fZmlyc3RfbmFtZV9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25GaXJzdE5hbWUsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25GaXJzdE5hbWUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wiZmlyc3RfbmFtZVwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFNlY29uZE5hbWU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0KTQsNC80LjQu9C40Y9cIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwic2Vjb25kX25hbWVcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fc2Vjb25kX25hbWVfX2lucHV0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uU2Vjb25kTmFtZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblNlY29uZE5hbWUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wic2Vjb25kX25hbWVcIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBQaG9uZTogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQotC10LvQtdGE0L7QvVwiLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgbmFtZTogXCJwaG9uZVwiLFxuICAgICAgICBpZDogXCJmb3JtX19waG9uZV9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QaG9uZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblBob25lLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVtcInBob25lXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUGFzc3dvcmQ6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0J/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbmFtZTogXCJwYXNzd29yZFwiLFxuICAgICAgICBpZDogXCJmb3JtX19wYXNzd29yZF9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QYXNzd29yZCxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25QYXNzd29yZC5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IHN0YXRlRCA9IEF0dGVudGlvblBhc3N3b3JkRG91YmxlLmdldFN0YXRlKCk7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wicGFzc3dvcmRcIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKEZvcm1EYXRhW1wicGFzc3dvcmRcIl0gIT09IEZvcm1EYXRhW1wiZG91YmxlcGFzc3dvcmRcIl0pIHtcbiAgICAgICAgICAgICAgc3RhdGVELm1lc3NhZ2UgPSBcIvCflKXQv9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUGFzc3dvcmREb3VibGU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0J/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbmFtZTogXCJkb3VibGVwYXNzd29yZFwiLFxuICAgICAgICBpZDogXCJmb3JtX19kb3VibGVwYXNzd29yZF9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QYXNzd29yZERvdWJsZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25QYXNzd29yZERvdWJsZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVtcImRvdWJsZXBhc3N3b3JkXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChGb3JtRGF0YVtcInBhc3N3b3JkXCJdICE9PSBGb3JtRGF0YVtcImRvdWJsZXBhc3N3b3JkXCJdKSB7XG4gICAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIvCflKXQv9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUmVnQnV0dG9uOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y9cIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKEZvcm1EYXRhKS5sZW5ndGggPT0gMCB8fFxuICAgICAgICAgICAgT2JqZWN0LmtleXMoRm9ybURhdGEpLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIEZvcm1EYXRhW2l0ZW1dID09PSBcIlwiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZGF0YTogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGZpcnN0X25hbWU6IEZvcm1EYXRhLmZpcnN0X25hbWUsXG4gICAgICAgICAgICAgIHNlY29uZF9uYW1lOiBGb3JtRGF0YS5zZWNvbmRfbmFtZSxcbiAgICAgICAgICAgICAgbG9naW46IEZvcm1EYXRhLmxvZ2luLFxuICAgICAgICAgICAgICBlbWFpbDogRm9ybURhdGEuZW1haWwsXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBGb3JtRGF0YS5wYXNzd29yZCxcbiAgICAgICAgICAgICAgcGhvbmU6IEZvcm1EYXRhLnBob25lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAgICAgICAuUE9TVChcIi9hdXRoL3NpZ251cFwiLCBkYXRhKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByb3V0ZXIuZ28oXCIvY2hhdFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBMb2dpbkxpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCS0L7QudGC0LhcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tbGlua1wiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSUNoYXRTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL0J1c3NpbmVzTGF5ZXIvQ2hhdFNlcnZpY2VcIjtcbmltcG9ydCB7IElDaGF0RFRPIH0gZnJvbSBcIi4uLy4uL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ2hhdFZpZXdNb2RlbCB7XG4gIGNoYXRzOiBBcnJheTxJQ2hhdERUTz47XG4gIGdldENoYXRzOiAoKSA9PiBQcm9taXNlPElDaGF0RFRPW10+O1xuICBzYXZlQ2hhdDogKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IFByb21pc2U8dm9pZD47XG4gIGRlbGV0ZUNoYXQ6IChjaGF0SWQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbn1cbmV4cG9ydCBjbGFzcyBDaGF0Vmlld01vZGVsIGltcGxlbWVudHMgSUNoYXRWaWV3TW9kZWwge1xuICBjaGF0czogQXJyYXk8SUNoYXREVE8+ID0gW107XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzZXJ2aWNlOiBJQ2hhdFNlcnZpY2UpIHt9XG5cbiAgZ2V0Q2hhdHMgPSBhc3luYyAoKSA9PiB7XG4gICAgdGhpcy5jaGF0cyA9IGF3YWl0IHRoaXMuc2VydmljZS5nZXRDaGF0cygpO1xuICAgIHJldHVybiB0aGlzLmNoYXRzO1xuICB9O1xuXG4gIHNhdmVDaGF0ID0gYXN5bmMgKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IHtcbiAgICBhd2FpdCB0aGlzLnNlcnZpY2Uuc2F2ZUNoYXQoZGF0YSk7XG4gICAgYXdhaXQgdGhpcy5nZXRDaGF0cygpO1xuICB9O1xuXG4gIGRlbGV0ZUNoYXQgPSBhc3luYyAoY2hhdElkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBhd2FpdCB0aGlzLnNlcnZpY2UuZGVsZXRlQ2hhdChjaGF0SWQpO1xuICAgIGF3YWl0IHRoaXMuZ2V0Q2hhdHMoKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IElVc2VyU2VydmljZSB9IGZyb20gXCIuLi8uLi9CdXNzaW5lc0xheWVyL1VzZXJTZXJ2aWNlXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi8uLi9VSS9MYXlvdXRzL1Byb2ZpbGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJVXNlclZpZXdNb2RlbCB7XG4gIHVzZXI/OiBJUHJvZmlsZURUTztcbiAgZ2V0VXNlcjogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgc2F2ZVVzZXI6ICh1c2VyOiBJUHJvZmlsZURUTykgPT4gUHJvbWlzZTxJUHJvZmlsZURUTz47XG4gIHNldFVzZXJGaWVsZDogKG5hbWU6IGtleW9mIElQcm9maWxlRFRPLCB2YWx1ZTogYW55KSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgVXNlclZpZXdNb2RlbCBpbXBsZW1lbnRzIElVc2VyVmlld01vZGVsIHtcbiAgdXNlcj86IElQcm9maWxlRFRPO1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2VydmljZTogSVVzZXJTZXJ2aWNlKSB7fVxuXG4gIGdldFVzZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgdGhpcy51c2VyID0gYXdhaXQgdGhpcy5zZXJ2aWNlLmdldFVzZXIoKTtcbiAgfTtcblxuICBzYXZlVXNlciA9IGFzeW5jICh1c2VyOiBJUHJvZmlsZURUTykgPT4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZpY2Uuc2F2ZVVzZXIodXNlcik7XG4gIH07XG5cbiAgc2V0VXNlckZpZWxkKG5hbWU6IGtleW9mIElQcm9maWxlRFRPLCB2YWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMudXNlcikge1xuICAgICAgdGhpcy51c2VyW25hbWVdID0gdmFsdWUgYXMgbmV2ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXNlciA9IHt9IGFzIElQcm9maWxlRFRPO1xuICAgICAgdGhpcy51c2VyW25hbWVdID0gdmFsdWUgYXMgbmV2ZXI7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTRVJWSUNFIH0gZnJvbSBcIi4uL0J1c3NpbmVzTGF5ZXJcIjtcbmltcG9ydCB7IElDaGF0U2VydmljZSB9IGZyb20gXCIuLi9CdXNzaW5lc0xheWVyL0NoYXRTZXJ2aWNlXCI7XG5pbXBvcnQgeyBJVXNlclNlcnZpY2UgfSBmcm9tIFwiLi4vQnVzc2luZXNMYXllci9Vc2VyU2VydmljZVwiO1xuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcIi4uL2xpYnMvQ29udGFpbmVyXCI7XG5pbXBvcnQgeyBDaGF0Vmlld01vZGVsIH0gZnJvbSBcIi4vQ2hhdFZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgVXNlclZpZXdNb2RlbCB9IGZyb20gXCIuL1VzZXJWaWV3TW9kZWxcIjtcblxuZXhwb3J0IGNvbnN0IFZJRVdfTU9ERUwgPSB7XG4gIENIQVQ6IFN5bWJvbC5mb3IoXCJDaGF0Vmlld01vZGVsXCIpLFxuICBVU0VSOiBTeW1ib2wuZm9yKFwiVXNlclZpZXdNb2RlbFwiKSxcbn07XG5cbmV4cG9ydCBjb25zdCBWaWV3TW9kZWxDb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XG5cblZpZXdNb2RlbENvbnRhaW5lci5iaW5kKFZJRVdfTU9ERUwuQ0hBVCkudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuICBjb25zdCBzZXJ2aWNlID0gY29udGFpbmVyLmdldDxJQ2hhdFNlcnZpY2U+KFNFUlZJQ0UuQ0hBVCk7XG4gIHJldHVybiBuZXcgQ2hhdFZpZXdNb2RlbChzZXJ2aWNlKTtcbn0pO1xuXG5WaWV3TW9kZWxDb250YWluZXIuYmluZChWSUVXX01PREVMLlVTRVIpXG4gIC50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gICAgY29uc3Qgc2VydmljZSA9IGNvbnRhaW5lci5nZXQ8SVVzZXJTZXJ2aWNlPihTRVJWSUNFLlVTRVIpO1xuICAgIHJldHVybiBuZXcgVXNlclZpZXdNb2RlbChzZXJ2aWNlKTtcbiAgfSlcbiAgLmluU2luZ2xldG9uZVNjb3BlKCk7XG4iLCJpbXBvcnQgXCJyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWVcIjtcbmltcG9ydCB7IEJvb3RTdHJhcCB9IGZyb20gXCIuL0Jvb3RzdHJhcFwiO1xuaW1wb3J0IHsgQXBwSW5pdCB9IGZyb20gXCIuL3JvdXRlclwiO1xuXG5jb25zdCBJbml0QXBwID0gKCkgPT4ge1xuICBjb25zdCB7IGNvbnRhaW5lciB9ID0gbmV3IEJvb3RTdHJhcCgpO1xuICAvLyDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgNC10L3QtNC10YDQsCDQv9GA0L7QuNGB0YXQvtC00LjRgiDQsiBSb3V0ZXJJbml0XG4gIGNvbnN0IHJvdXRlciA9IEFwcEluaXQoY29udGFpbmVyKTtcbiAgcmV0dXJuIHsgcm91dGVyLCBjb250YWluZXIgfTtcbn07XG5cbmV4cG9ydCBjb25zdCB7IHJvdXRlciwgY29udGFpbmVyIH0gPSBJbml0QXBwKCk7XG4iLCJjbGFzcyBTaW5nbGV0b25TY29wZSB7XG4gIEluc3RhbmNlTWFrZXJzOiBNYXA8c3ltYm9sLCBhbnk+ID0gbmV3IE1hcDxcbiAgICBzeW1ib2wsXG4gICAgeyBmbjogKGNvbnRhaW5lcjogQ29udGFpbmVyKSA9PiBhbnk7IGlkOiBzeW1ib2wgfVxuICA+KCk7XG4gIEluc3RhbmNlczogTWFwPHN5bWJvbCwgYW55PiA9IG5ldyBNYXA8c3ltYm9sLCBhbnk+KCk7XG59XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXIge1xuICBjb250YWluZXJzOiBNYXA8c3ltYm9sLCBhbnk+ID0gbmV3IE1hcCgpO1xuICBsYXN0SWQ/OiBzeW1ib2w7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBzaW5nbGV0b25lU2NvcGU6IFNpbmdsZXRvblNjb3BlID0gbmV3IFNpbmdsZXRvblNjb3BlKClcbiAgKSB7fVxuICBiaW5kKGlkOiBzeW1ib2wpOiBDb250YWluZXIge1xuICAgIHRoaXMubGFzdElkID0gaWQ7XG4gICAgdGhpcy5jb250YWluZXJzLnNldChpZCwgbnVsbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgZ2V0ID0gPFQ+KGlkOiBzeW1ib2wpOiBUID0+IHtcbiAgICBjb25zdCBzaW5nbGVUb25lQ29udGFpbmVyID0gdGhpcy5zaW5nbGV0b25lU2NvcGUuSW5zdGFuY2VNYWtlcnMuZ2V0KGlkKTtcbiAgICBpZiAoc2luZ2xlVG9uZUNvbnRhaW5lcikge1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLnNpbmdsZXRvbmVTY29wZS5JbnN0YW5jZXMuZ2V0KGlkKTtcbiAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNpbmdsZXRvbmVTY29wZS5JbnN0YW5jZXMuc2V0KGlkLCBzaW5nbGVUb25lQ29udGFpbmVyLmZuKHRoaXMpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2luZ2xldG9uZVNjb3BlLkluc3RhbmNlcy5nZXQoaWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjcmVhdGVDb250YWluZXJGbiA9IHRoaXMuY29udGFpbmVycy5nZXQoaWQpO1xuICAgICAgcmV0dXJuIGNyZWF0ZUNvbnRhaW5lckZuLmZuKHRoaXMpO1xuICAgIH1cbiAgfTtcblxuICB0b0R5bmFtaWNWYWx1ZShmbjogKGNvbnRhaW5lcjogQ29udGFpbmVyKSA9PiB1bmtub3duKSB7XG4gICAgaWYgKHRoaXMubGFzdElkKSB7XG4gICAgICB0aGlzLmNvbnRhaW5lcnMuc2V0KHRoaXMubGFzdElkLCB7IGZuOiBmbiwgaWQ6IHRoaXMubGFzdElkIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcGFyZW50KGNvbnRhaW5lcjogQ29udGFpbmVyKTogQ29udGFpbmVyIHtcbiAgICBmb3IgKGxldCBjb250IG9mIGNvbnRhaW5lci5jb250YWluZXJzKSB7XG4gICAgICB0aGlzLmNvbnRhaW5lcnMuc2V0KGNvbnRbMF0sIGNvbnRbMV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGluU2luZ2xldG9uZVNjb3BlKCkge1xuICAgIGlmICh0aGlzLmxhc3RJZCkge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJzLmdldCh0aGlzLmxhc3RJZCk7XG4gICAgICB0aGlzLnNpbmdsZXRvbmVTY29wZS5JbnN0YW5jZU1ha2Vycy5zZXQodGhpcy5sYXN0SWQsIGNvbnRhaW5lcik7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBtZW1vaXplIH0gZnJvbSBcIi4uL21vbWl6ZVwiO1xuaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmludGVyZmFjZSBJSFlQT1Byb3BzIHtcbiAgcmVuZGVyVG8/OiBIVE1MRWxlbWVudDtcbiAgdGVtcGxhdGVQYXRoOiBzdHJpbmc7XG4gIGNoaWxkcmVuPzogUmVjb3JkPHN0cmluZywgSFlQTyB8IEhZUE9bXT47XG4gIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xufVxuXG5pbnRlcmZhY2UgSVRlbXBhdGVQcm9wIHtcbiAgaHRtbDogc3RyaW5nO1xuICB0ZW1wbGF0ZUtleTogc3RyaW5nO1xuICBtYWdpY0tleTogc3RyaW5nO1xuICBpc0FycmF5OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgSFlQTyB7XG4gIHByaXZhdGUgcmVuZGVyVG8/OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBjaGlsZHJlbj86IFJlY29yZDxzdHJpbmcsIEhZUE8gfCBIWVBPW10+O1xuICBwcml2YXRlIHRlbXBsYXRlUGF0aDogc3RyaW5nO1xuICBwcml2YXRlIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICBwcml2YXRlIHRlbXBsYXRlc1Byb21pc2VzOiBQcm9taXNlPElUZW1wYXRlUHJvcD5bXTtcbiAgcHJpdmF0ZSBzdG9yZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIHByaXZhdGUgbWFnaWNLZXk6IHN0cmluZztcbiAgcHJpdmF0ZSBhZnRlclJlbmRlckNhbGxiYWNrOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIGFmdGVyUmVuZGVyQ2FsbGJhY2tBcnI6IFNldDwoKSA9PiB2b2lkPjtcblxuICBjb25zdHJ1Y3RvcihwYXJhbXM6IElIWVBPUHJvcHMpIHtcbiAgICB0aGlzLnJlbmRlclRvID0gcGFyYW1zLnJlbmRlclRvO1xuICAgIHRoaXMuZGF0YSA9IHBhcmFtcy5kYXRhO1xuICAgIHRoaXMudGVtcGxhdGVQYXRoID0gYC4vdGVtcGxhdGVzLyR7cGFyYW1zLnRlbXBsYXRlUGF0aH1gO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBwYXJhbXMuY2hpbGRyZW47XG4gICAgdGhpcy50ZW1wbGF0ZXNQcm9taXNlcyA9IFtdO1xuICAgIHRoaXMuc3RvcmUgPSB7fTtcbiAgICB0aGlzLm1hZ2ljS2V5ID0gdXVpZHY0KCk7XG4gICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrID0gKCkgPT4ge307XG4gICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrQXJyID0gbmV3IFNldCgpO1xuICB9XG5cbiAgcHVibGljIGdldFRlbXBsYXRlSFRNTCA9IGFzeW5jIChcbiAgICBrZXk6IHN0cmluZyxcbiAgICBoeXBvOiBIWVBPLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKTogUHJvbWlzZTxJVGVtcGF0ZVByb3A+ID0+IHtcbiAgICBjb25zdCBnZXRIVE1MID0gYXN5bmMgKHRlbXBsYXRlUGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZldGNoKHRlbXBsYXRlUGF0aClcbiAgICAgICAgICAudGhlbigoaHRtbCkgPT4ge1xuICAgICAgICAgICAgaWYgKGh0bWwuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZmlsZSBkbyBub3QgZG93bmxvYWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaHRtbC5ibG9iKCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LnRleHQoKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHRleHQpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9O1xuXG4gICAgY29uc3QgZ2V0SFRNTG1lbW8gPSBtZW1vaXplKGdldEhUTUwpO1xuXG4gICAgY29uc3QgaHRtbFRlbXBsYXRlID0gYXdhaXQgZ2V0SFRNTG1lbW8oaHlwby50ZW1wbGF0ZVBhdGgpO1xuICAgIGNvbnN0IGh0bWwgPSB0aGlzLmluc2VydERhdGFJbnRvSFRNTChodG1sVGVtcGxhdGUsIGh5cG8uZGF0YSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaHRtbDogaHRtbCxcbiAgICAgIHRlbXBsYXRlS2V5OiBrZXksXG4gICAgICBtYWdpY0tleTogaHlwby5tYWdpY0tleSxcbiAgICAgIGlzQXJyYXk6IGlzQXJyYXksXG4gICAgfTtcbiAgfTtcblxuICBwcml2YXRlIGNvbGxlY3RUZW1wbGF0ZXMoXG4gICAgaHlwbzogSFlQTyB8IEhZUE9bXSxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgaXNBcnJheTogYm9vbGVhblxuICApOiBIWVBPIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShoeXBvKSkge1xuICAgICAgdGhpcy5oYW5kbGVBcnJheUhZUE8oaHlwbywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGFuZGxlU2ltcGxlSFlQTyhoeXBvLCBuYW1lKTtcbiAgICAgIHRoaXMudGVtcGxhdGVzUHJvbWlzZXMucHVzaCh0aGlzLmdldFRlbXBsYXRlSFRNTChuYW1lLCBoeXBvLCBpc0FycmF5KSk7XG4gICAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbGJhY2tBcnIuYWRkKGh5cG8uYWZ0ZXJSZW5kZXJDYWxsYmFjayk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVBcnJheUhZUE8oaHlwb3M6IEhZUE9bXSwgbmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaHlwb3MuZm9yRWFjaCgoaHlwbykgPT4ge1xuICAgICAgdGhpcy5jb2xsZWN0VGVtcGxhdGVzKGh5cG8sIGAke25hbWV9YCwgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZVNpbXBsZUhZUE8oaHlwbzogSFlQTywgXzogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKGh5cG8uY2hpbGRyZW4pIHtcbiAgICAgIE9iamVjdC5rZXlzKGh5cG8uY2hpbGRyZW4pLmZvckVhY2goKGNoaWxkTmFtZSkgPT4ge1xuICAgICAgICBpZiAoaHlwby5jaGlsZHJlbikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3RUZW1wbGF0ZXMoXG4gICAgICAgICAgICBoeXBvLmNoaWxkcmVuW2NoaWxkTmFtZV0sXG4gICAgICAgICAgICBjaGlsZE5hbWUsXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5zZXJ0RGF0YUludG9IVE1MKFxuICAgIGh0bWxUZW1wbGF0ZTogc3RyaW5nLFxuICAgIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gICk6IHN0cmluZyB7XG4gICAgZGF0YSA9IHRoaXMuZ2V0RGF0YVdpdGhvdXRJZXJhcmh5KGRhdGEpO1xuICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAgICBpZiAodHlwZW9mIGRhdGFba2V5XSAhPT0gXCJvYmplY3RcIiB8fCBkYXRhW2tleV0gPT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoXCJ7e1wiICsga2V5ICsgXCJ9fVwiLCBcImdcIik7XG4gICAgICAgIGh0bWxUZW1wbGF0ZSA9IGh0bWxUZW1wbGF0ZS5yZXBsYWNlKG1hc2ssIFN0cmluZyhkYXRhW2tleV0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoL3t7W2Etei5fXSt9fS9nKTtcbiAgICBodG1sVGVtcGxhdGUgPSBodG1sVGVtcGxhdGUucmVwbGFjZShtYXNrLCBcIlwiKTtcbiAgICByZXR1cm4gaHRtbFRlbXBsYXRlO1xuICB9XG5cbiAgcHJpdmF0ZSBjb252ZXJ0QXJyVGVtcGxhdGVUb01hcChcbiAgICB0ZW1wbGF0ZUFycjoge1xuICAgICAgaHRtbDogc3RyaW5nO1xuICAgICAgdGVtcGxhdGVLZXk6IHN0cmluZztcbiAgICAgIG1hZ2ljS2V5OiBzdHJpbmc7XG4gICAgICBpc0FycmF5OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIH1bXVxuICApOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICB0ZW1wbGF0ZUFyci5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpZiAocmVzdWx0W2l0ZW0udGVtcGxhdGVLZXldKSB7XG4gICAgICAgIHJlc3VsdFtcbiAgICAgICAgICBpdGVtLnRlbXBsYXRlS2V5XG4gICAgICAgIF0gKz0gYDxzcGFuIGh5cG89XCIke2l0ZW0ubWFnaWNLZXl9XCI+JHtpdGVtLmh0bWx9PC9zcGFuPmA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbYCR7aXRlbS50ZW1wbGF0ZUtleX0tJHtpdGVtLm1hZ2ljS2V5fWBdID0gaXRlbS5odG1sO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgaW5zZXJ0VGVtcGxhdGVJbnRvVGVtcGxhdGUoXG4gICAgcm9vdFRlbXBsYXRlSFRNTDogc3RyaW5nLFxuICAgIHRlbXBsYXRlS2V5OiBzdHJpbmcsXG4gICAgY2hpbGRUZW1wbGF0ZUhUTUw6IHN0cmluZyxcbiAgICBtYWdpY0tleTogc3RyaW5nLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKTogc3RyaW5nIHtcbiAgICByb290VGVtcGxhdGVIVE1MID0gdGhpcy5jcmVhdGVFbGVtV3JhcHBlcihcbiAgICAgIHJvb3RUZW1wbGF0ZUhUTUwsXG4gICAgICB0ZW1wbGF0ZUtleSxcbiAgICAgIG1hZ2ljS2V5LFxuICAgICAgaXNBcnJheVxuICAgICk7XG4gICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoYC09JHt0ZW1wbGF0ZUtleX0tJHttYWdpY0tleX09LWAsIFwiZ1wiKTtcbiAgICByb290VGVtcGxhdGVIVE1MID0gcm9vdFRlbXBsYXRlSFRNTC5yZXBsYWNlKG1hc2ssIGNoaWxkVGVtcGxhdGVIVE1MKTtcbiAgICByZXR1cm4gcm9vdFRlbXBsYXRlSFRNTDtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRWxlbVdyYXBwZXIoXG4gICAgaHRtbFRlbXBsYXRlOiBzdHJpbmcsXG4gICAgdGVtcGxhdGVLZXk6IHN0cmluZyxcbiAgICBtYWdpY0tleTogc3RyaW5nLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKSB7XG4gICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoYC09JHt0ZW1wbGF0ZUtleX09LWAsIFwiZ1wiKTtcbiAgICBpZiAoaXNBcnJheSkge1xuICAgICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UoXG4gICAgICAgIG1hc2ssXG4gICAgICAgIGA8c3BhbiBoeXBvPVwiJHttYWdpY0tleX1cIj4tPSR7dGVtcGxhdGVLZXl9LSR7bWFnaWNLZXl9PS0tPSR7dGVtcGxhdGVLZXl9PS08L3NwYW4+YFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UoXG4gICAgICAgIG1hc2ssXG4gICAgICAgIGA8c3BhbiBoeXBvPVwiJHttYWdpY0tleX1cIj4tPSR7dGVtcGxhdGVLZXl9LSR7bWFnaWNLZXl9PS08L3NwYW4+YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaHRtbFRlbXBsYXRlO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhckVtdHB5Q29tcG9uZW50KGh0bWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcmVnZXggPSAvLT1bYS16LEEtWiwwLTldKz0tL2c7XG4gICAgcmV0dXJuIGh0bWwucmVwbGFjZShyZWdleCwgXCJcIik7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyID0gYXN5bmMgKGRhdGE/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IFByb21pc2U8SFlQTz4gPT4ge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLmRhdGEgPSB7IC4uLnRoaXMuZGF0YSwgLi4uZGF0YSB9O1xuICAgIH1cbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICB0aGlzLmNvbGxlY3RUZW1wbGF0ZXModGhpcywgXCJyb290XCIsIGZhbHNlKS50ZW1wbGF0ZXNQcm9taXNlc1xuICAgICkudGhlbigoYXJyYXlUZW1wbGF0ZXMpID0+IHtcbiAgICAgIGNvbnN0IG1hcFRlbXBsYXRlcyA9IHRoaXMuY29udmVydEFyclRlbXBsYXRlVG9NYXAoYXJyYXlUZW1wbGF0ZXMpO1xuICAgICAgbGV0IHJvb3RUZW1wbGF0ZUhUTUw6IHN0cmluZyA9XG4gICAgICAgIGFycmF5VGVtcGxhdGVzW2FycmF5VGVtcGxhdGVzLmxlbmd0aCAtIDFdLmh0bWw7XG5cbiAgICAgIGZvciAobGV0IGkgPSBhcnJheVRlbXBsYXRlcy5sZW5ndGggLSAyOyBpID49IDA7IGktLSkge1xuICAgICAgICBsZXQgdGVtcGxhdGUgPVxuICAgICAgICAgIG1hcFRlbXBsYXRlc1tcbiAgICAgICAgICAgIGAke2FycmF5VGVtcGxhdGVzW2ldLnRlbXBsYXRlS2V5fS0ke2FycmF5VGVtcGxhdGVzW2ldLm1hZ2ljS2V5fWBcbiAgICAgICAgICBdO1xuICAgICAgICByb290VGVtcGxhdGVIVE1MID0gdGhpcy5pbnNlcnRUZW1wbGF0ZUludG9UZW1wbGF0ZShcbiAgICAgICAgICByb290VGVtcGxhdGVIVE1MLFxuICAgICAgICAgIGFycmF5VGVtcGxhdGVzW2ldLnRlbXBsYXRlS2V5LFxuICAgICAgICAgIHRlbXBsYXRlLFxuICAgICAgICAgIGFycmF5VGVtcGxhdGVzW2ldLm1hZ2ljS2V5LFxuICAgICAgICAgIGFycmF5VGVtcGxhdGVzW2ldLmlzQXJyYXlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcm9vdFRlbXBsYXRlSFRNTCA9IHRoaXMuY2xlYXJFbXRweUNvbXBvbmVudChyb290VGVtcGxhdGVIVE1MKTtcblxuICAgICAgaWYgKHRoaXMucmVuZGVyVG8pIHtcbiAgICAgICAgdGhpcy5yZW5kZXJUby5pbm5lckhUTUwgPSByb290VGVtcGxhdGVIVE1MO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtoeXBvPVwiJHt0aGlzLm1hZ2ljS2V5fVwiXWApO1xuICAgICAgICBpZiAoZWxlbSkge1xuICAgICAgICAgIHRoaXMucmVuZGVyVG8gPSBlbGVtIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gcm9vdFRlbXBsYXRlSFRNTDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbGJhY2tBcnIuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnRlbXBsYXRlc1Byb21pc2VzID0gW107XG5cbiAgICAgIHJldHVybiB0aGF0O1xuICAgIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgcmVyZW5kZXIoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTdGF0ZSgpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gICAgdGhpcy5zdG9yZSA9IHRoaXMuY3JlYXRlU3RvcmUodGhpcy5kYXRhKTtcbiAgICByZXR1cm4gdGhpcy5zdG9yZTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU3RvcmUoc3RvcmU6IGFueSkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGNvbnN0IGhhbmRsZXI6IFByb3h5SGFuZGxlcjxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4gPSB7XG4gICAgICBnZXQodGFyZ2V0LCBwcm9wZXJ0eSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0WzxzdHJpbmc+cHJvcGVydHldO1xuICAgICAgfSxcbiAgICAgIHNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgICAgICB0YXJnZXRbPHN0cmluZz5wcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICAgICAgdGhhdC5yZXJlbmRlcigpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgfTtcbiAgICBzdG9yZSA9IG5ldyBQcm94eShzdG9yZSwgaGFuZGxlcik7XG5cbiAgICBPYmplY3Qua2V5cyhzdG9yZSkuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygc3RvcmVbZmllbGRdID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHN0b3JlW2ZpZWxkXSA9IG5ldyBQcm94eShzdG9yZVtmaWVsZF0sIGhhbmRsZXIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVN0b3JlKHN0b3JlW2ZpZWxkXSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc3RvcmU7XG4gIH1cblxuICBwcml2YXRlIGdldERhdGFXaXRob3V0SWVyYXJoeShkYXRhOiBhbnkpIHtcbiAgICBsZXQgcGF0aEFycjogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgcmVzdWx0T2JqZWN0OiBhbnkgPSB7fTtcbiAgICBmdW5jdGlvbiBmbnoob2JqOiBhbnkpIHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICAgICAgcGF0aEFyci5wdXNoKGtleSk7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICBmbnoob2JqW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdE9iamVjdFtwYXRoQXJyLmpvaW4oXCIuXCIpXSA9IG9ialtrZXldO1xuICAgICAgICAgIHBhdGhBcnIucG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBhdGhBcnIucG9wKCk7XG4gICAgfVxuICAgIGZueihkYXRhKTtcblxuICAgIHJldHVybiByZXN1bHRPYmplY3Q7XG4gIH1cblxuICBwdWJsaWMgYWZ0ZXJSZW5kZXIoY2FsbGJhY2s6ICgpID0+IHZvaWQpOiBIWVBPIHtcbiAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBoaWRlKCkge1xuICAgIGlmICh0aGlzLnJlbmRlclRvKSB7XG4gICAgICBsZXQgY2hpbGRyZW47XG5cbiAgICAgIGNoaWxkcmVuID0gdGhpcy5yZW5kZXJUby5jaGlsZHJlbjtcbiAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgICAgIGNoaWxkLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJ0eXBlIFF1ZXJ5UGFyYW1zVmFsdWUgPVxuICB8IG51bGxcbiAgfCB1bmRlZmluZWRcbiAgfCBzdHJpbmdcbiAgfCBudW1iZXJcbiAgfCBBcnJheTxzdHJpbmcgfCBudW1iZXI+O1xuXG5jbGFzcyBRdWVyeVV0aWxzIHtcbiAgZ2V0UXVlcnlQYXJhbXNTdHIoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KFwiP1wiKVsxXSB8fCBudWxsO1xuICB9XG5cbiAgZ2V0UXVlcnlQYXJhbXNPYmogPSAoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9PiB7XG4gICAgY29uc3QgZmlsdGVyVXJsU3RyaW5nID0gdGhpcy5nZXRRdWVyeVBhcmFtc1N0cigpO1xuICAgIGlmIChmaWx0ZXJVcmxTdHJpbmcgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdGVyVXJsU3RyaW5nXG4gICAgICAuc3BsaXQoXCImXCIpXG4gICAgICAubWFwKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiBpdGVtLnNwbGl0KFwiPVwiKTtcbiAgICAgIH0pXG4gICAgICAucmVkdWNlKChwcmV2LCBuZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IFtmaWx0ZXJOYW1lLCBmaWx0ZXJWYWx1ZV0gPSBuZXh0O1xuICAgICAgICBjb25zdCBpc0FycmF5VmFsdWUgPSB0aGlzLmNoZWNrU3RyaW5nSXNBcnJheVZhbHVlKGZpbHRlclZhbHVlKTtcblxuICAgICAgICBpZiAoaXNBcnJheVZhbHVlKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4dHJhY3RBcnJheUZyb21TdHJpbmcoZmlsdGVyVmFsdWUpO1xuICAgICAgICAgIHJldHVybiB7IC4uLnByZXYsIC4uLnsgW2ZpbHRlck5hbWVdOiB2YWx1ZSB9IH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyAuLi5wcmV2LCAuLi57IFtmaWx0ZXJOYW1lXTogd2luZG93LmRlY29kZVVSSShmaWx0ZXJWYWx1ZSkgfSB9O1xuICAgICAgfSwge30pO1xuICB9O1xuXG4gIHNldFF1ZXJ5UGFyYW1zU3RyID0gKHBhcmFtczogc3RyaW5nKSA9PiB7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKFxuICAgICAgeyBwYXJhbXM6IHBhcmFtcyB9LFxuICAgICAgXCJcIixcbiAgICAgIGAke3dpbmRvdy5sb2NhdGlvbi5oYXNoLnNwbGl0KFwiP1wiKVswXX0ke3BhcmFtcyA/IFwiP1wiIDogXCJcIn0ke3BhcmFtc31gXG4gICAgKTtcbiAgfTtcblxuICBzZXRRdWVyeVBhcmFtc09iaiA9IChcbiAgICBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIFF1ZXJ5UGFyYW1zVmFsdWU+LFxuICAgIHJlcGxhY2U/OiBib29sZWFuXG4gICkgPT4ge1xuICAgIGNvbnN0IHF1ZXJ5UGFyYW1zOiBzdHJpbmcgPSB0aGlzLmNvbXBpbGVGaWx0ZXJzKHBhcmFtcyk7XG4gICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShcbiAgICAgICAgbnVsbCxcbiAgICAgICAgXCJcIixcbiAgICAgICAgYCR7d2luZG93LmxvY2F0aW9uLmhhc2guc3BsaXQoXCI/XCIpWzBdfSR7XG4gICAgICAgICAgcXVlcnlQYXJhbXMgPyBcIj9cIiA6IFwiXCJcbiAgICAgICAgfSR7cXVlcnlQYXJhbXN9YFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKFxuICAgICAgICBudWxsLFxuICAgICAgICBcIlwiLFxuICAgICAgICBgJHt3aW5kb3cubG9jYXRpb24uaGFzaC5zcGxpdChcIj9cIilbMF19JHtcbiAgICAgICAgICBxdWVyeVBhcmFtcyA/IFwiP1wiIDogXCJcIlxuICAgICAgICB9JHtxdWVyeVBhcmFtc31gXG4gICAgICApO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGNvbXBpbGVGaWx0ZXJzID0gKFxuICAgIGZpbHRlcnM6IFJlY29yZDxzdHJpbmcsIFF1ZXJ5UGFyYW1zVmFsdWU+XG4gICk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgYXJyYXlGaWx0ZXJzID0gW107XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gZmlsdGVycykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZmlsdGVyc1trZXldKSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IChmaWx0ZXJzW2tleV0gYXMgQXJyYXk8dW5rbm93bj4pLmpvaW4oXCIlXCIpO1xuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGFycmF5RmlsdGVycy5wdXNoKGAke2tleX09WyR7ZW5jb2RlVVJJKGAke3ZhbHVlfWApfV1gKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZpbHRlcnNba2V5XSB8fCBmaWx0ZXJzW2tleV0gPT09IDApIHtcbiAgICAgICAgICBhcnJheUZpbHRlcnMucHVzaChgJHtrZXl9PSR7ZmlsdGVyc1trZXldfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5RmlsdGVycy5qb2luKFwiJlwiKTtcbiAgfTtcblxuICBwcml2YXRlIGNoZWNrU3RyaW5nSXNBcnJheVZhbHVlID0gKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShkZWNvZGVVUkkodmFsdWUpLm1hdGNoKC9eXFxbW1xcZCVdK1xcXSQvZ20pKTtcbiAgfTtcblxuICBwcml2YXRlIGV4dHJhY3RBcnJheUZyb21TdHJpbmcgPSAodmFsdWU6IHN0cmluZyk6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsID0+IHtcbiAgICBjb25zdCByZWdleCA9IC9bXFxkLGEteixBLVos0LAt0Y8s0JAt0K8sXy1dKy9nbTtcbiAgICByZXR1cm4gZGVjb2RlVVJJKHZhbHVlKS5tYXRjaChyZWdleCk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IFF1ZXJ5VXRpbHM7XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uL0hZUE8vSFlQT1wiO1xuXG5jbGFzcyBSb3V0ZSB7XG4gIHByaXZhdGUgX3BhdGhuYW1lOiBzdHJpbmcgPSBcIlwiO1xuICBwcml2YXRlIF9ibG9jaz86IChyZXN1bHQ/OiBhbnkpID0+IEhZUE87XG4gIHByaXZhdGUgX3Byb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgYXN5bmNGTj86ICgpID0+IFByb21pc2U8YW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwYXRobmFtZTogc3RyaW5nLFxuICAgIHZpZXc6ICgpID0+IEhZUE8sXG4gICAgcHJvcHM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICAgIGFzeW5jRk4/OiAoKSA9PiBQcm9taXNlPGFueT5cbiAgKSB7XG4gICAgdGhpcy5fcGF0aG5hbWUgPSBwYXRobmFtZS5zcGxpdChcIj9cIilbMF07XG4gICAgdGhpcy5fcHJvcHMgPSBwcm9wcztcbiAgICB0aGlzLl9ibG9jayA9IHZpZXc7XG4gICAgdGhpcy5hc3luY0ZOID0gYXN5bmNGTjtcbiAgfVxuXG4gIG5hdmlnYXRlKHBhdGhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tYXRjaChwYXRobmFtZSkpIHtcbiAgICAgIHRoaXMuX3BhdGhuYW1lID0gcGF0aG5hbWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIGxlYXZlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9ibG9jaykge1xuICAgICAgdGhpcy5fYmxvY2soKS5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2gocGF0aG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc0VxdWFsKHBhdGhuYW1lLCB0aGlzLl9wYXRobmFtZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLl9ibG9jaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5hc3luY0ZOKSB7XG4gICAgICB0aGlzLmFzeW5jRk4oKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgdGhpcy5fYmxvY2s/LihyZXN1bHQpLnJlbmRlcigpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2Jsb2NrKCkucmVuZGVyKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICBwcml2YXRlIF9faW5zdGFuY2U6IFJvdXRlciA9IHRoaXM7XG4gIHJvdXRlczogUm91dGVbXSA9IFtdO1xuICBwcml2YXRlIGhpc3Rvcnk6IEhpc3RvcnkgPSB3aW5kb3cuaGlzdG9yeTtcbiAgcHJpdmF0ZSBfY3VycmVudFJvdXRlOiBSb3V0ZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9yb290UXVlcnk6IHN0cmluZyA9IFwiXCI7XG5cbiAgY29uc3RydWN0b3Iocm9vdFF1ZXJ5OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5fX2luc3RhbmNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2luc3RhbmNlO1xuICAgIH1cbiAgICB0aGlzLl9yb290UXVlcnkgPSByb290UXVlcnkuc3BsaXQoXCI/XCIpWzBdO1xuICB9XG5cbiAgdXNlKFxuICAgIHBhdGhuYW1lOiBzdHJpbmcsXG4gICAgYmxvY2s6IChyZXN1bHQ/OiBhbnkpID0+IEhZUE8sXG4gICAgYXN5bmNGTj86ICgpID0+IFByb21pc2U8YW55PlxuICApOiBSb3V0ZXIge1xuICAgIGNvbnN0IHJvdXRlID0gbmV3IFJvdXRlKFxuICAgICAgcGF0aG5hbWUsXG4gICAgICBibG9jayxcbiAgICAgIHsgcm9vdFF1ZXJ5OiB0aGlzLl9yb290UXVlcnkgfSxcbiAgICAgIGFzeW5jRk5cbiAgICApO1xuICAgIHRoaXMucm91dGVzLnB1c2gocm91dGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RhcnQoKTogUm91dGVyIHtcbiAgICB3aW5kb3cub25wb3BzdGF0ZSA9IChfOiBQb3BTdGF0ZUV2ZW50KSA9PiB7XG4gICAgICBsZXQgbWFzayA9IG5ldyBSZWdFeHAoXCIjXCIsIFwiZ1wiKTtcbiAgICAgIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UobWFzaywgXCJcIik7XG4gICAgICB0aGlzLl9vblJvdXRlKHVybCk7XG4gICAgfTtcbiAgICBsZXQgbWFzayA9IG5ldyBSZWdFeHAoXCIjXCIsIFwiZ1wiKTtcbiAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKG1hc2ssIFwiXCIpIHx8IFwiL1wiO1xuICAgIHRoaXMuX29uUm91dGUodXJsKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9vblJvdXRlKHBhdGhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCByb3V0ZSA9IHRoaXMuZ2V0Um91dGUocGF0aG5hbWUpO1xuICAgIGlmICghcm91dGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2N1cnJlbnRSb3V0ZSkge1xuICAgICAgdGhpcy5fY3VycmVudFJvdXRlLmxlYXZlKCk7XG4gICAgfVxuICAgIHRoaXMuX2N1cnJlbnRSb3V0ZSA9IHJvdXRlO1xuICAgIHRoaXMuX2N1cnJlbnRSb3V0ZS5yZW5kZXIoKTtcbiAgfVxuXG4gIGdvKHBhdGhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmhpc3RvcnkucHVzaFN0YXRlKHt9LCBcIlwiLCBgIyR7cGF0aG5hbWV9YCk7XG4gICAgdGhpcy5fb25Sb3V0ZShwYXRobmFtZSk7XG4gIH1cblxuICBiYWNrKCk6IHZvaWQge1xuICAgIHRoaXMuaGlzdG9yeS5iYWNrKCk7XG4gIH1cblxuICBmb3J3YXJkKCk6IHZvaWQge1xuICAgIHRoaXMuaGlzdG9yeS5mb3J3YXJkKCk7XG4gIH1cblxuICBnZXRSb3V0ZShwYXRobmFtZTogc3RyaW5nKTogUm91dGUgfCB1bmRlZmluZWQge1xuICAgIHBhdGhuYW1lID0gcGF0aG5hbWUuc3BsaXQoXCI/XCIpWzBdO1xuICAgIHJldHVybiB0aGlzLnJvdXRlcy5maW5kKChyb3V0ZSkgPT4gcm91dGUubWF0Y2gocGF0aG5hbWUpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0VxdWFsKGxoczogdW5rbm93biwgcmhzOiB1bmtub3duKSB7XG4gIHJldHVybiBsaHMgPT09IHJocztcbn1cbiIsImltcG9ydCB7IGluaXRTdG9yZSB9IGZyb20gXCIuLi8uLi9TdG9yZVwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi9IWVBPL0hZUE9cIjtcblxubGV0IG9iajogYW55ID0ge307XG5jb25zdCBtYXAgPSBuZXcgTWFwPFJlY29yZDxzdHJpbmcsIGFueT4sIEhZUE8+KCk7XG5cbmNsYXNzIF9TdG9yZSB7XG4gIHB1YmxpYyBzdG9yZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHN0b3JlOiBhbnkpIHtcbiAgICB0aGlzLnN0b3JlID0gbmV3IFByb3h5PGFueT4oc3RvcmUsIHtcbiAgICAgIGdldDogKHRhcmdldDogYW55LCBwOiBzdHJpbmcgfCBudW1iZXIgfCBzeW1ib2wsIHJlY2VpdmVyOiBhbnkpID0+IHtcbiAgICAgICAgb2JqW3BdID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRhcmdldFtwXTtcbiAgICAgIH0sXG4gICAgICBzZXQ6ICh0YXJnZXQ6IGFueSwgcDogc3RyaW5nLCB2YWx1ZTogYW55LCByZWNlaXZlcjogYW55KTogYm9vbGVhbiA9PiB7XG4gICAgICAgIHRhcmdldFtwXSA9IHZhbHVlO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIG1hcC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICBpZiAoaXRlbVswXVtwXSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBpdGVtWzFdLmdldFN0YXRlKCk7XG4gICAgICAgICAgICBpdGVtWzFdLnJlbmRlcih0YXJnZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmVyPFQ+KGNvbXBvbmVudDogKHByb3BzOiBUKSA9PiBIWVBPKSB7XG4gIHJldHVybiAocHJvcHM6IFQpID0+IHtcbiAgICBjb25zdCBfcmVzID0gY29tcG9uZW50KHByb3BzKTtcbiAgICBjb25zdCBzdGF0ZSA9IF9yZXMuZ2V0U3RhdGUoKTtcbiAgICBtYXAuc2V0KG9iaiwgX3Jlcyk7XG4gICAgb2JqID0ge307XG4gICAgcmV0dXJuIF9yZXM7XG4gIH07XG59XG5cbmNvbnN0IFN0b3JlID0gbmV3IF9TdG9yZShpbml0U3RvcmUpO1xuXG5leHBvcnQgZGVmYXVsdCBTdG9yZTtcbiIsImNvbnN0IE1FVEhPRFMgPSB7XG4gIEdFVDogXCJHRVRcIixcbiAgUFVUOiBcIlBVVFwiLFxuICBQT1NUOiBcIlBPU1RcIixcbiAgREVMRVRFOiBcIkRFTEVURVwiLFxufTtcblxuY29uc3QgRE9NRU4gPSBcImh0dHBzOi8veWEtcHJha3Rpa3VtLnRlY2gvYXBpL3YyXCI7XG5cbmNsYXNzIEhUVFBUcmFuc3BvcnRDbGFzcyB7XG4gIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGhlYWRlcnM6IHt9LFxuICAgIGRhdGE6IHt9LFxuICB9O1xuXG4gIEdFVCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHRoaXMuZGVmYXVsdE9wdGlvbnNcbiAgKSA9PiB7XG4gICAgY29uc3QgcmVxdWVzdFBhcmFtcyA9IHF1ZXJ5U3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgdXJsICs9IHJlcXVlc3RQYXJhbXM7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcbiAgICAgIHVybCxcbiAgICAgIHsgLi4ub3B0aW9ucywgbWV0aG9kOiBNRVRIT0RTLkdFVCB9LFxuICAgICAgTnVtYmVyKG9wdGlvbnMudGltZW91dCkgfHwgNTAwMFxuICAgICk7XG4gIH07XG5cbiAgUFVUID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9ID0gdGhpcy5kZWZhdWx0T3B0aW9uc1xuICApID0+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFxuICAgICAgdXJsLFxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuUFVUIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcblxuICBQT1NUID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyPiB9ID0gdGhpc1xuICAgICAgLmRlZmF1bHRPcHRpb25zXG4gICkgPT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXG4gICAgICB1cmwsXG4gICAgICB7IC4uLm9wdGlvbnMsIG1ldGhvZDogTUVUSE9EUy5QT1NUIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcblxuICBERUxFVEUgPSAoXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB0aGlzLmRlZmF1bHRPcHRpb25zXG4gICkgPT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXG4gICAgICB1cmwsXG4gICAgICB7IC4uLm9wdGlvbnMsIG1ldGhvZDogTUVUSE9EUy5ERUxFVEUgfSxcbiAgICAgIE51bWJlcihvcHRpb25zLnRpbWVvdXQpIHx8IDUwMDBcbiAgICApO1xuICB9O1xuXG4gIHNvY2tldCA9ICh1cmw6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBuZXcgV2ViU29ja2V0KHVybCk7XG4gIH07XG5cbiAgcmVxdWVzdCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSB8IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgdGltZW91dDogbnVtYmVyID0gNTAwMFxuICApID0+IHtcbiAgICB1cmwgPSBET01FTiArIHVybDtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgeGhyLm9wZW4oPHN0cmluZz5vcHRpb25zLm1ldGhvZCwgdXJsKTtcbiAgICAgIGNvbnN0IGhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnM7XG4gICAgICBmb3IgKGxldCBoZWFkZXIgaW4gaGVhZGVycyBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaGVhZGVyc1toZWFkZXIgYXMga2V5b2YgdHlwZW9mIGhlYWRlcnNdIGFzIHN0cmluZztcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICByZXNvbHZlKHhocik7XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSAoZSkgPT4ge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9O1xuICAgICAgeGhyLm9uYWJvcnQgPSAoZSkgPT4ge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9O1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgfSwgdGltZW91dCk7XG5cbiAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSkpO1xuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBxdWVyeVN0cmluZ2lmeShkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gIGxldCByZXF1ZXN0UGFyYW1zID0gXCI/XCI7XG4gIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAgcmVxdWVzdFBhcmFtcyArPSBgJHtrZXl9PSR7ZGF0YVtrZXldfSZgO1xuICB9XG4gIHJlcXVlc3RQYXJhbXMgPSByZXF1ZXN0UGFyYW1zLnN1YnN0cmluZygwLCByZXF1ZXN0UGFyYW1zLmxlbmd0aCAtIDEpO1xuICByZXR1cm4gcmVxdWVzdFBhcmFtcztcbn1cblxuZXhwb3J0IGNvbnN0IEhUVFBUcmFuc3BvcnQgPSAoKCk6IHsgZ2V0SW5zdGFuY2U6ICgpID0+IEhUVFBUcmFuc3BvcnRDbGFzcyB9ID0+IHtcbiAgbGV0IGluc3RhbmNlOiBIVFRQVHJhbnNwb3J0Q2xhc3M7XG4gIHJldHVybiB7XG4gICAgZ2V0SW5zdGFuY2U6ICgpID0+IGluc3RhbmNlIHx8IChpbnN0YW5jZSA9IG5ldyBIVFRQVHJhbnNwb3J0Q2xhc3MoKSksXG4gIH07XG59KSgpO1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi9IWVBPXCI7XG5cbmV4cG9ydCBjb25zdCBFbWFpbFZhbGlkYXRvciA9IHtcbiAgdmFsdWU6IFwiXCIsXG4gIGNoZWNrRnVuYzogZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB2YXIgcmVnID0gL14oW0EtWmEtejAtOV9cXC1cXC5dKStcXEAoW0EtWmEtejAtOV9cXC1cXC5dKStcXC4oW0EtWmEtel17Miw0fSkkLztcbiAgICBpZiAoIXJlZy50ZXN0KHZhbHVlKSkge1xuICAgICAgdGhpcy52YWx1ZSA9IFwiXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgY2FsbGJhY2s6IChlbGVtOiBIWVBPLCBjaGVja1Jlc3VsdDogYm9vbGVhbikgPT4ge1xuICAgIGxldCBzdGF0ZSA9IGVsZW0uZ2V0U3RhdGUoKTtcbiAgICBpZiAoIWNoZWNrUmVzdWx0KSB7XG4gICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0Y3RgtC+INC90LUg0L/QvtGF0L7QttC1INC90LAg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YtcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgfVxuICB9LFxufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vSFlQT1wiO1xuXG5leHBvcnQgY29uc3QgUmVxdWlyZWQgPSB7XG4gIHZhbHVlOiBcIlwiLFxuICBjaGVja0Z1bmM6IGZ1bmN0aW9uICh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHZhbHVlID09PSBcIlwiKSB7XG4gICAgICB0aGlzLnZhbHVlID0gXCJcIjtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBjYWxsYmFjazogKGVsZW06IEhZUE8sIGNoZWNrUmVzdWx0OiBib29sZWFuKSA9PiB7XG4gICAgbGV0IHN0YXRlID0gZWxlbS5nZXRTdGF0ZSgpO1xuICAgIGlmICghY2hlY2tSZXN1bHQpIHtcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgfVxuICB9LFxufTsiLCJleHBvcnQgZnVuY3Rpb24gdXVpZHY0KCkge1xuICByZXR1cm4gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgdmFyIHIgPSAoTWF0aC5yYW5kb20oKSAqIDE2KSB8IDAsXG4gICAgICB2ID0gYyA9PSBcInhcIiA/IHIgOiAociAmIDB4MykgfCAweDg7XG4gICAgcmV0dXJuIGAke3YudG9TdHJpbmcoMTYpfWA7XG4gIH0pO1xufSIsImltcG9ydCB7IExvZ2luTGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvTG9naW5cIjtcbmltcG9ydCB7IENoYXRMYXlvdXQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9DaGF0XCI7XG5pbXBvcnQgeyBSZWdpc3RyYXRpb25MYXlvdXQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9SZWdpc3RyYXRpb25cIjtcbmltcG9ydCB7IFByb2ZpbGVMYXlvdXQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9Qcm9maWxlXCI7XG5pbXBvcnQgeyBDaGFuZ2VQcm9maWxlIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvQ2hhbmdlUHJvZmlsZVwiO1xuaW1wb3J0IHsgQ2hhbmdlUGFzc3dvcmQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9DaGFuZ2VQYXNzd29yZFwiO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIi4uL2xpYnMvUm91dGVyXCI7XG5pbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uL2xpYnMvVHJhbnNwb3J0XCI7XG5pbXBvcnQgeyBJQ2hhdFZpZXdNb2RlbCB9IGZyb20gXCIuLi9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi9WaWV3TW9kZWxcIjtcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xuaW1wb3J0IHsgSVVzZXJWaWV3TW9kZWwgfSBmcm9tIFwiLi4vVmlld01vZGVsL1VzZXJWaWV3TW9kZWxcIjtcblxuZXhwb3J0IGNvbnN0IEFwcEluaXQgPSAoY29udGFpbmVyOiBDb250YWluZXIpOiBSb3V0ZXIgPT4ge1xuICByZXR1cm4gbmV3IFJvdXRlcihcIiNyb290XCIpXG4gICAgLnVzZShcIi9cIiwgTG9naW5MYXlvdXQsICgpID0+IHtcbiAgICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgICAgLkdFVChcIi9hdXRoL3VzZXJcIilcbiAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh1c2VyLnJlc3BvbnNlKTtcbiAgICAgICAgfSk7XG4gICAgfSlcbiAgICAudXNlKFwiL3JlZ2lzdHJhdGlvblwiLCBSZWdpc3RyYXRpb25MYXlvdXQpXG4gICAgLnVzZShcIi9jaGF0XCIsIENoYXRMYXlvdXQsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGNoYXRWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElDaGF0Vmlld01vZGVsPihWSUVXX01PREVMLkNIQVQpO1xuICAgICAgYXdhaXQgY2hhdFZpZXdNb2RlbC5nZXRDaGF0cygpO1xuICAgICAgcmV0dXJuIGNoYXRWaWV3TW9kZWwuY2hhdHM7XG4gICAgfSlcbiAgICAudXNlKFwiL3Byb2ZpbGVcIiwgUHJvZmlsZUxheW91dCwgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlclZpZXdNb2RlbCA9IGNvbnRhaW5lci5nZXQ8SVVzZXJWaWV3TW9kZWw+KFZJRVdfTU9ERUwuVVNFUik7XG4gICAgICBhd2FpdCB1c2VyVmlld01vZGVsLmdldFVzZXIoKTtcbiAgICAgIHJldHVybiB1c2VyVmlld01vZGVsLnVzZXI7XG4gICAgfSlcbiAgICAudXNlKFwiL2VkaXRwcm9maWxlXCIsIENoYW5nZVByb2ZpbGUsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElVc2VyVmlld01vZGVsPihWSUVXX01PREVMLlVTRVIpO1xuICAgICAgYXdhaXQgdXNlclZpZXdNb2RlbC5nZXRVc2VyKCk7XG4gICAgICByZXR1cm4gdXNlclZpZXdNb2RlbC51c2VyO1xuICAgIH0pXG4gICAgLnVzZShcIi9lZGl0cGFzc3dvcmRcIiwgQ2hhbmdlUGFzc3dvcmQpXG4gICAgLnN0YXJ0KCk7XG59O1xuIiwiY29uc3QgQ2FjaGUgPSBuZXcgTWFwKCk7XG5leHBvcnQgZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAoXG4gICAgdHlwZW9mIGZ1bmMgIT0gXCJmdW5jdGlvblwiIHx8XG4gICAgKHJlc29sdmVyICE9IG51bGwgJiYgdHlwZW9mIHJlc29sdmVyICE9IFwiZnVuY3Rpb25cIilcbiAgKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgY2FjaGUgPSBtZW1vaXplZC5jYWNoZTtcblxuICAgIGlmIChjYWNoZS5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgbWVtb2l6ZWQuY2FjaGUgPSBDYWNoZTtcbiAgcmV0dXJuIG1lbW9pemVkO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==