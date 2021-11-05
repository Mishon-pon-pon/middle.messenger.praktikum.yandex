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
const container_1 = __webpack_require__(/*! ../InfrastsructureLayer/container */ "./src/InfrastsructureLayer/container.ts");
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
        this.container = CreateDIContainer(container_1.infrastructureContainer, IntegrationalLayer_1.ApiClientContainer, BussinesLayer_1.ServiceContainer, ViewModel_1.ViewModelContainer);
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

/***/ "./src/InfrastsructureLayer/container.ts":
/*!***********************************************!*\
  !*** ./src/InfrastsructureLayer/container.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.infrastructureContainer = exports.INTEGRATION_MODULE = void 0;
const _1 = __webpack_require__(/*! . */ "./src/InfrastsructureLayer/index.ts");
const Container_1 = __webpack_require__(/*! ../libs/Container */ "./src/libs/Container/index.ts");
exports.INTEGRATION_MODULE = {
    APIModule: Symbol.for('API'),
};
exports.infrastructureContainer = new Container_1.Container();
exports.infrastructureContainer
    .bind(exports.INTEGRATION_MODULE.APIModule)
    .toDynamicValue((container) => {
    return new _1.APIModule();
});


/***/ }),

/***/ "./src/InfrastsructureLayer/index.ts":
/*!*******************************************!*\
  !*** ./src/InfrastsructureLayer/index.ts ***!
  \*******************************************/
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
                'Content-type': 'application/json',
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
const container_1 = __webpack_require__(/*! ../InfrastsructureLayer/container */ "./src/InfrastsructureLayer/container.ts");
const ChatAPI_1 = __webpack_require__(/*! ./ChatAPI */ "./src/IntegrationalLayer/ChatAPI.ts");
const UserAPI_1 = __webpack_require__(/*! ./UserAPI */ "./src/IntegrationalLayer/UserAPI.ts");
exports.API_CLIENT = {
    CHAT: Symbol.for('ChatAPIClient'),
    USER: Symbol.for('UserAPIClient'),
};
exports.ApiClientContainer = new Container_1.Container();
exports.ApiClientContainer.bind(exports.API_CLIENT.CHAT).toDynamicValue((container) => {
    const APIModule = container.get(container_1.INTEGRATION_MODULE.APIModule);
    return new ChatAPI_1.ChatAPIClient(APIModule);
});
exports.ApiClientContainer.bind(exports.API_CLIENT.USER).toDynamicValue((container) => {
    const APIModule = container.get(container_1.INTEGRATION_MODULE.APIModule);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQm9vdHN0cmFwL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0J1c3NpbmVzTGF5ZXIvQ2hhdFNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQnVzc2luZXNMYXllci9Vc2VyU2VydmljZS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9CdXNzaW5lc0xheWVyL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0luZnJhc3RzcnVjdHVyZUxheWVyL2NvbnRhaW5lci50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbmZyYXN0c3J1Y3R1cmVMYXllci9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvQ2hhdEFQSS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvU3RvcmUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9BdHRlbnRpb25NZXNzYWdlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQnV0dG9uL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW0vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9DcmVhdGVDaGF0TW9kYWwvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9EZWxldGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9FbXB0eS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9Db21wb25lbnRzL0lucHV0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvTGlzdEl0ZW0vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9NZW51QnV0dG9uL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvTWVzc2FnZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9Qcm9maWxlSW5wdXQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvTGF5b3V0cy9DaGFuZ2VQYXNzd29yZC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL0NoYW5nZVByb2ZpbGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvTGF5b3V0cy9DaGF0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvTG9naW4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvTGF5b3V0cy9Qcm9maWxlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvUmVnaXN0cmF0aW9uL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1ZpZXdNb2RlbC9DaGF0Vmlld01vZGVsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1ZpZXdNb2RlbC9Vc2VyVmlld01vZGVsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1ZpZXdNb2RlbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL0NvbnRhaW5lci9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL0hZUE8vSFlQTy50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL1F1ZXJ5UGFyYW1zL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvUm91dGVyL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvU3RvcmUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9UcmFuc3BvcnQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9WYWxpZGF0b3JzL0VtYWlsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL3V0aWxzL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL3JvdXRlci9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL21vbWl6ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4L3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxLQUFLO0FBQ0wsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxXQUFXO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLGNBQWM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLGtCQUFrQjtBQUNuRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUEsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQztBQUNE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UyxDQUFDLEdBQUcsQ0FBaUIsc0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRSxNQUFNLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM5QixPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUM7SUFDNUIsQ0FBQyxFQUFDO1NBQ0QsR0FBRyxDQUFDLGNBQWMsRUFBRSw2QkFBYSxFQUFFLEdBQVMsRUFBRTtRQUM3QyxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFpQixzQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQztJQUM1QixDQUFDLEVBQUM7U0FDRCxHQUFHLENBQUMsZUFBZSxFQUFFLCtCQUFjLENBQUM7U0FDcEMsS0FBSyxFQUFFLENBQUM7QUFDYixDQUFDLENBQUM7QUEzQlcsZUFBTyxXQTJCbEI7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4Q0Y7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDdEJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gZGVmaW5lKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG4gIHRyeSB7XG4gICAgLy8gSUUgOCBoYXMgYSBicm9rZW4gT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoYXQgb25seSB3b3JrcyBvbiBET00gb2JqZWN0cy5cbiAgICBkZWZpbmUoe30sIFwiXCIpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBkZWZpbmUgPSBmdW5jdGlvbihvYmosIGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IGRlZmluZShcbiAgICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSxcbiAgICB0b1N0cmluZ1RhZ1N5bWJvbCxcbiAgICBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgKTtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBkZWZpbmUocHJvdG90eXBlLCBtZXRob2QsIGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBkZWZpbmUoZ2VuRnVuLCB0b1N0cmluZ1RhZ1N5bWJvbCwgXCJHZW5lcmF0b3JGdW5jdGlvblwiKTtcbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgZXhwb3J0cy5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yLCBQcm9taXNlSW1wbCkge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAvLyBJZiBhIHJlamVjdGVkIFByb21pc2Ugd2FzIHlpZWxkZWQsIHRocm93IHRoZSByZWplY3Rpb24gYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgaGFuZGxlZCB0aGVyZS5cbiAgICAgICAgICByZXR1cm4gaW52b2tlKFwidGhyb3dcIiwgZXJyb3IsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlSW1wbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7XG4gICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSxcbiAgICAgIFByb21pc2VJbXBsXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBkZWZpbmUoR3AsIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvclwiKTtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgRnVuY3Rpb24oXCJyXCIsIFwicmVnZW5lcmF0b3JSdW50aW1lID0gclwiKShydW50aW1lKTtcbn1cbiIsImltcG9ydCB7Q29udGFpbmVyfSBmcm9tICcuLi9saWJzL0NvbnRhaW5lcic7XG5pbXBvcnQge2luZnJhc3RydWN0dXJlQ29udGFpbmVyfSBmcm9tICcuLi9JbmZyYXN0c3J1Y3R1cmVMYXllci9jb250YWluZXInO1xuaW1wb3J0IHtBcGlDbGllbnRDb250YWluZXJ9IGZyb20gJy4uL0ludGVncmF0aW9uYWxMYXllcic7XG5pbXBvcnQge1NlcnZpY2VDb250YWluZXJ9IGZyb20gJy4uL0J1c3NpbmVzTGF5ZXInO1xuaW1wb3J0IHtWaWV3TW9kZWxDb250YWluZXJ9IGZyb20gJy4uL1ZpZXdNb2RlbCc7XG5cbmNvbnN0IENyZWF0ZURJQ29udGFpbmVyID0gKFxuICBpbmZyYXN0cnVjdHVyZUNvbnRhaW5lcjogQ29udGFpbmVyLFxuICBpbnRlZ3JlYXRpb25Db250YWluZXI6IENvbnRhaW5lcixcbiAgc2VydmljZUNvbnRhaW5lcjogQ29udGFpbmVyLFxuICB2aWV3TW9kZWxDb250YWluZXI6IENvbnRhaW5lclxuKSA9PiB7XG4gIHJldHVybiB2aWV3TW9kZWxDb250YWluZXJcbiAgICAucGFyZW50KHNlcnZpY2VDb250YWluZXIpXG4gICAgLnBhcmVudChpbnRlZ3JlYXRpb25Db250YWluZXIpXG4gICAgLnBhcmVudChpbmZyYXN0cnVjdHVyZUNvbnRhaW5lcik7XG59O1xuXG5leHBvcnQgY2xhc3MgQm9vdFN0cmFwIHtcbiAgY29udGFpbmVyOiBDb250YWluZXI7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29udGFpbmVyID0gQ3JlYXRlRElDb250YWluZXIoXG4gICAgICBpbmZyYXN0cnVjdHVyZUNvbnRhaW5lcixcbiAgICAgIEFwaUNsaWVudENvbnRhaW5lcixcbiAgICAgIFNlcnZpY2VDb250YWluZXIsXG4gICAgICBWaWV3TW9kZWxDb250YWluZXJcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJQ2hhdERUTyB9IGZyb20gXCIuLi9VSS9Db21wb25lbnRzL0NoYXRJdGVtXCI7XG5pbXBvcnQgeyBJQ2hhdEFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvQ2hhdEFQSVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDaGF0U2VydmljZSB7XG4gIGdldENoYXRzOiAoKSA9PiBQcm9taXNlPEFycmF5PElDaGF0RFRPPj47XG4gIHNhdmVDaGF0OiAoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4gUHJvbWlzZTx2b2lkPjtcbiAgZGVsZXRlQ2hhdDogKGNoYXRJZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuXG5leHBvcnQgY2xhc3MgQ2hhdFNlcnZpY2UgaW1wbGVtZW50cyBJQ2hhdFNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgQXBpQ2xpZW50OiBJQ2hhdEFQSUNsaWVudCkge31cblxuICBnZXRDaGF0cyA9ICgpOiBQcm9taXNlPEFycmF5PElDaGF0RFRPPj4gPT4ge1xuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5nZXRDaGF0cygpO1xuICB9O1xuXG4gIHNhdmVDaGF0ID0gKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IHtcbiAgICByZXR1cm4gdGhpcy5BcGlDbGllbnQuc2F2ZUNoYXQoZGF0YSk7XG4gIH07XG5cbiAgZGVsZXRlQ2hhdChjaGF0SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5kZWxldGVDaGF0KGNoYXRJZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IElVc2VyQVBJQ2xpZW50IH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllci9Vc2VyQVBJXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL1Byb2ZpbGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJVXNlclNlcnZpY2Uge1xuICBnZXRVc2VyKCk6IFByb21pc2U8SVByb2ZpbGVEVE8+O1xuICBzYXZlVXNlcih1c2VyOklQcm9maWxlRFRPKTpQcm9taXNlPElQcm9maWxlRFRPPjtcbn1cblxuZXhwb3J0IGNsYXNzIFVzZXJTZXJ2aWNlIGltcGxlbWVudHMgSVVzZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIEFwaUNsaWVudDogSVVzZXJBUElDbGllbnQpIHt9XG4gIHNhdmVVc2VyKHVzZXI6SVByb2ZpbGVEVE8pOlByb21pc2U8SVByb2ZpbGVEVE8+e1xuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5zYXZlVXNlcih1c2VyKVxuICB9XG4gIGdldFVzZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuQXBpQ2xpZW50LmdldFVzZXIoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQVBJX0NMSUVOVCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXJcIjtcbmltcG9ydCB7IElDaGF0QVBJQ2xpZW50IH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllci9DaGF0QVBJXCI7XG5pbXBvcnQgeyBJVXNlckFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSVwiO1xuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcIi4uL2xpYnMvQ29udGFpbmVyXCI7XG5pbXBvcnQgeyBDaGF0U2VydmljZSB9IGZyb20gXCIuL0NoYXRTZXJ2aWNlXCI7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gXCIuL1VzZXJTZXJ2aWNlXCI7XG5cbmV4cG9ydCBjb25zdCBTRVJWSUNFID0ge1xuICBDSEFUOiBTeW1ib2wuZm9yKFwiQ2hhdFNlcnZpY2VcIiksXG4gIFVTRVI6IFN5bWJvbC5mb3IoXCJVc2VyU2VydmNpZVwiKSxcbn07XG5cbmV4cG9ydCBjb25zdCBTZXJ2aWNlQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcigpO1xuXG5TZXJ2aWNlQ29udGFpbmVyLmJpbmQoU0VSVklDRS5DSEFUKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gIGNvbnN0IEFQSUNsaWVudCA9IGNvbnRhaW5lci5nZXQ8SUNoYXRBUElDbGllbnQ+KEFQSV9DTElFTlQuQ0hBVCk7XG4gIHJldHVybiBuZXcgQ2hhdFNlcnZpY2UoQVBJQ2xpZW50KTtcbn0pO1xuXG5TZXJ2aWNlQ29udGFpbmVyLmJpbmQoU0VSVklDRS5VU0VSKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gIGNvbnN0IEFQSUNsaWVudCA9IGNvbnRhaW5lci5nZXQ8SVVzZXJBUElDbGllbnQ+KEFQSV9DTElFTlQuVVNFUik7XG4gIHJldHVybiBuZXcgVXNlclNlcnZpY2UoQVBJQ2xpZW50KTtcbn0pO1xuIiwiaW1wb3J0IHtBUElNb2R1bGV9IGZyb20gJy4nO1xuaW1wb3J0IHtDb250YWluZXJ9IGZyb20gJy4uL2xpYnMvQ29udGFpbmVyJztcblxuZXhwb3J0IGNvbnN0IElOVEVHUkFUSU9OX01PRFVMRSA9IHtcbiAgQVBJTW9kdWxlOiBTeW1ib2wuZm9yKCdBUEknKSxcbn07XG5cbmV4cG9ydCBjb25zdCBpbmZyYXN0cnVjdHVyZUNvbnRhaW5lciA9IG5ldyBDb250YWluZXIoKTtcblxuaW5mcmFzdHJ1Y3R1cmVDb250YWluZXJcbiAgLmJpbmQoSU5URUdSQVRJT05fTU9EVUxFLkFQSU1vZHVsZSlcbiAgLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IEFQSU1vZHVsZSgpO1xuICB9KTtcbiIsImltcG9ydCB7SFRUUFRyYW5zcG9ydH0gZnJvbSAnLi4vbGlicy9UcmFuc3BvcnQnO1xuaW1wb3J0IHtJQVBJTW9kdWxlfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgY2xhc3MgQVBJTW9kdWxlIGltcGxlbWVudHMgSUFQSU1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgZ2V0RGF0YSA9IDxQPih1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8UD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgIC5HRVQodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgcG9zdERhdGEgPSBhc3luYyA8UCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KFxuICAgIHVybDogc3RyaW5nLFxuICAgIGRhdGE6IFBcbiAgKTogUHJvbWlzZTxQPiA9PiB7XG4gICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxuICAgICAgLlBPU1QodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgZGVsZXRlRGF0YSA9ICh1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgIC5ERUxFVEUodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgcHV0RGF0YSA9IDxQPih1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8UD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKCkuUFVUKHVybCwgdGhpcy5nZXRQYXJtcyhkYXRhKSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBnZXRQYXJtczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4oXG4gICAgZGF0YTogVFxuICApOiB7W2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPn0ge1xuICAgIHJldHVybiB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICB9LFxuICAgICAgZGF0YToge1xuICAgICAgICAuLi5kYXRhLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBJQVBJTW9kdWxlIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IElDaGF0RFRPIH0gZnJvbSBcIi4uL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ2hhdEFQSUNsaWVudCB7XG4gIGdldENoYXRzKCk6IFByb21pc2U8QXJyYXk8SUNoYXREVE8+PjtcbiAgc2F2ZUNoYXQoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD47XG4gIGRlbGV0ZUNoYXQoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBDaGF0QVBJQ2xpZW50IGltcGxlbWVudHMgSUNoYXRBUElDbGllbnQge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgQVBJTW9kdWxlOiBJQVBJTW9kdWxlKSB7fVxuXG4gIGdldENoYXRzID0gYXN5bmMgKCk6IFByb21pc2U8QXJyYXk8SUNoYXREVE8+PiA9PiB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuQVBJTW9kdWxlLmdldERhdGE8SUNoYXREVE9bXT4oXCIvY2hhdHNcIiwge30pLnRoZW4oXG4gICAgICAocmVzdWx0KSA9PiB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgKTtcbiAgfTtcblxuICBzYXZlQ2hhdCA9IGFzeW5jIChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgYXdhaXQgdGhpcy5BUElNb2R1bGUucG9zdERhdGEoXCIvY2hhdHNcIiwgZGF0YSk7XG4gIH07XG5cbiAgZGVsZXRlQ2hhdChpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuQVBJTW9kdWxlLmRlbGV0ZURhdGEoXCIvY2hhdHNcIiwgeyBjaGF0SWQ6IGlkIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJQVBJTW9kdWxlIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvUHJvZmlsZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyQVBJQ2xpZW50IHtcbiAgZ2V0VXNlcigpOiBQcm9taXNlPElQcm9maWxlRFRPPjtcbiAgc2F2ZVVzZXIodXNlcjogSVByb2ZpbGVEVE8pOiBQcm9taXNlPElQcm9maWxlRFRPPlxufVxuXG5leHBvcnQgY2xhc3MgVXNlckFQSUNsaWVudCBpbXBsZW1lbnRzIElVc2VyQVBJQ2xpZW50IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIEFQSU1vZHVsZTogSUFQSU1vZHVsZSkgeyB9XG5cbiAgZ2V0VXNlciA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgdGhpcy5BUElNb2R1bGUuZ2V0RGF0YTxJUHJvZmlsZURUTz4oXCIvYXV0aC91c2VyXCIsIHt9KTtcbiAgICByZXR1cm4gdXNlcjtcbiAgfTtcblxuICBzYXZlVXNlciA9ICh1c2VyOiBJUHJvZmlsZURUTykgPT4ge1xuICAgIHJldHVybiB0aGlzLkFQSU1vZHVsZS5wdXREYXRhPElQcm9maWxlRFRPPignL3VzZXIvcHJvZmlsZScsIHVzZXIpXG4gIH1cbn1cbiIsImltcG9ydCB7Q29udGFpbmVyfSBmcm9tICcuLi9saWJzL0NvbnRhaW5lcic7XG5pbXBvcnQge0lOVEVHUkFUSU9OX01PRFVMRX0gZnJvbSAnLi4vSW5mcmFzdHNydWN0dXJlTGF5ZXIvY29udGFpbmVyJztcbmltcG9ydCB7Q2hhdEFQSUNsaWVudH0gZnJvbSAnLi9DaGF0QVBJJztcbmltcG9ydCB7SUFQSU1vZHVsZX0gZnJvbSAnLi4vSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW50ZXJmYWNlcyc7XG5pbXBvcnQge1VzZXJBUElDbGllbnR9IGZyb20gJy4vVXNlckFQSSc7XG5cbmV4cG9ydCBjb25zdCBBUElfQ0xJRU5UID0ge1xuICBDSEFUOiBTeW1ib2wuZm9yKCdDaGF0QVBJQ2xpZW50JyksXG4gIFVTRVI6IFN5bWJvbC5mb3IoJ1VzZXJBUElDbGllbnQnKSxcbn07XG5cbmV4cG9ydCBjb25zdCBBcGlDbGllbnRDb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XG5cbkFwaUNsaWVudENvbnRhaW5lci5iaW5kKEFQSV9DTElFTlQuQ0hBVCkudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuICBjb25zdCBBUElNb2R1bGUgPSBjb250YWluZXIuZ2V0PElBUElNb2R1bGU+KElOVEVHUkFUSU9OX01PRFVMRS5BUElNb2R1bGUpO1xuICByZXR1cm4gbmV3IENoYXRBUElDbGllbnQoQVBJTW9kdWxlKTtcbn0pO1xuXG5BcGlDbGllbnRDb250YWluZXIuYmluZChBUElfQ0xJRU5ULlVTRVIpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgY29uc3QgQVBJTW9kdWxlID0gY29udGFpbmVyLmdldDxJQVBJTW9kdWxlPihJTlRFR1JBVElPTl9NT0RVTEUuQVBJTW9kdWxlKTtcbiAgcmV0dXJuIG5ldyBVc2VyQVBJQ2xpZW50KEFQSU1vZHVsZSk7XG59KTtcbiIsImV4cG9ydCBjb25zdCBpbml0U3RvcmUgPSB7XG4gIG1lc3NhZ2VzOiBcIlwiLFxuICBjaGF0OiBcIlwiLFxufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcblxuZXhwb3J0IGNvbnN0IEF0dGVudGlvbk1lc3NhZ2UgPSAoKTogSFlQTyA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImF0dGVudGlvbi50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgbWVzc2FnZTogXCJcIixcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7fSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvdXRpbHNcIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIGlkPzogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICBjbGFzc05hbWU6IHN0cmluZztcbiAgb25DbGljazogKGU6IEV2ZW50KSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY29uc3QgQnV0dG9uID0gKHByb3BzOiBJUHJvcHMpID0+IHtcbiAgY29uc3QgaWQgPSBwcm9wcy5pZCB8fCB1dWlkdjQoKTtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiYnV0dG9uLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBpZDogaWQsXG4gICAgICB0aXRsZTogcHJvcHMudGl0bGUsXG4gICAgICBjbGFzc05hbWU6IHByb3BzLmNsYXNzTmFtZSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgIHByb3BzLm9uQ2xpY2soZSk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IGNvbnRhaW5lciwgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBDaGF0TGF5b3V0IH0gZnJvbSBcIi4uLy4uL0xheW91dHMvQ2hhdFwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xuaW1wb3J0IHsgRGVsZXRlIH0gZnJvbSBcIi4uL0RlbGV0ZVwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWxcIjtcbmltcG9ydCB7IElDaGF0Vmlld01vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbC9DaGF0Vmlld01vZGVsXCI7XG5pbXBvcnQgUXVlcnlVdGlscyBmcm9tIFwiLi4vLi4vLi4vbGlicy9RdWVyeVBhcmFtc1wiO1xuaW1wb3J0IHsgTWVzc2FnZXMgfSBmcm9tIFwiLi4vTWVzc2FnZXNcIjtcbmltcG9ydCBTdG9yZSBmcm9tIFwiLi4vLi4vLi4vbGlicy9TdG9yZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDaGF0RFRPIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgYXZhdGFyOiBzdHJpbmcgfCBudWxsO1xuICBjcmVhdGVkX2J5OiBudW1iZXI7XG4gIGlkOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJUHJvcHMgZXh0ZW5kcyBJQ2hhdERUTyB7XG4gIGNsYXNzTmFtZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IENoYXRJdGVtID0gKHByb3BzOiBJQ2hhdERUTykgPT4ge1xuICBjb25zdCBrZXkgPSBga2V5LSR7cHJvcHMuaWR9YDtcblxuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJjaGF0SXRlbS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgQ2hhdE5hbWU6IHByb3BzLnRpdGxlLFxuICAgICAgbGFzdFRpbWU6IHByb3BzLmNyZWF0ZWRfYnkgfHwgXCIxMDoyMlwiLFxuICAgICAgbGFzdE1lc3NhZ2U6IHByb3BzLmlkIHx8IFwiSGksIGhvdyBhcmUgeW91P1wiLFxuICAgICAgbm90aWZpY2F0aW9uQ291bnQ6IHByb3BzLmF2YXRhciB8fCAzLFxuICAgICAga2V5OiBrZXksXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgZGVsZXRlOiBEZWxldGUoe1xuICAgICAgICBpZDogYGRlbGV0ZUl0ZW0ke3Byb3BzLmlkfWAsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjaGF0Vmlld01vZGVsID0gY29udGFpbmVyLmdldDxJQ2hhdFZpZXdNb2RlbD4oVklFV19NT0RFTC5DSEFUKTtcbiAgICAgICAgICBjaGF0Vmlld01vZGVsLmRlbGV0ZUNoYXQoU3RyaW5nKHByb3BzLmlkKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBDaGF0TGF5b3V0KGNoYXRWaWV3TW9kZWwuY2hhdHMpLnJlbmRlcigpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBtZXNzYWdlczogTWVzc2FnZXMoeyBjaGF0SWQ6IFwiXCIgfSksXG4gICAgfSxcbiAgfSkuYWZ0ZXJSZW5kZXIoKCkgPT4ge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGtleSk/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCBxdWVyeVV0aWxzID0gbmV3IFF1ZXJ5VXRpbHMoKTtcbiAgICAgIHF1ZXJ5VXRpbHMuc2V0UXVlcnlQYXJhbXNPYmooeyBjaGF0OiBwcm9wcy5pZCB9KTtcbiAgICAgIFN0b3JlLnN0b3JlLm1lc3NhZ2VzID0gcHJvcHMuaWQ7XG4gICAgICBTdG9yZS5zdG9yZS5jaGF0ID0gcHJvcHMuaWQ7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IGNvbnRhaW5lciB9IGZyb20gXCIuLi8uLi8uLlwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgUmVxdWlyZWQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9WYWxpZGF0b3JzL1JlcXVpcmVkXCI7XG5pbXBvcnQgeyBBdHRlbnRpb25NZXNzYWdlIH0gZnJvbSBcIi4uL0F0dGVudGlvbk1lc3NhZ2VcIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL0lucHV0XCI7XG5pbXBvcnQgeyBJQ2hhdFZpZXdNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgQ2hhdExheW91dCB9IGZyb20gXCIuLi8uLi9MYXlvdXRzL0NoYXRcIjtcbmltcG9ydCB7IFZJRVdfTU9ERUwgfSBmcm9tIFwiLi4vLi4vLi4vVmlld01vZGVsXCI7XG5cbmV4cG9ydCBjb25zdCBDcmVhdGVDaGF0TW9kYWwgPSAoKSA9PiB7XG4gIGNvbnN0IGF0dGVudGlvbk1lc3NhZ2UgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IHN0YXRlID0gYXR0ZW50aW9uTWVzc2FnZS5nZXRTdGF0ZSgpO1xuXG4gIGxldCBDaGF0TmFtZSA9IFwiXCI7XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiY3JlYXRlY2hhdG1vZGFsLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7fSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgaW5wdXQ6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwiQ2hhdCBuYW1lXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImNoYXRuYW1lXCIsXG4gICAgICAgIGlkOiBcImNoYXRuYW1lXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJjLWMtbW9kYWxfX2lucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBhdHRlbnRpb25NZXNzYWdlLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgICBDaGF0TmFtZSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBjcmVhdGU6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCh0L7Qt9C00LDRgtGMXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJjcmVhdGUtYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGlmICghQ2hhdE5hbWUpIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY2hhdFZpZXdNb2RlbCA9IGNvbnRhaW5lci5nZXQ8SUNoYXRWaWV3TW9kZWw+KFxuICAgICAgICAgICAgICBWSUVXX01PREVMLkNIQVRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjaGF0Vmlld01vZGVsLnNhdmVDaGF0KHsgdGl0bGU6IENoYXROYW1lIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYy1jLW1vZGFsXCIpWzBdXG4gICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgIENoYXRMYXlvdXQoY2hhdFZpZXdNb2RlbC5jaGF0cykucmVuZGVyKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGNhbmNlbDogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0J7RgtC80LXQvdCwXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJjYW5jZWwtYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgICAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImMtYy1tb2RhbFwiKVswXVxuICAgICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5cbmludGVyZmFjZSBJUHJvcHMge1xuICBpZDogc3RyaW5nO1xuICBvbkNsaWNrOiAoKSA9PiB2b2lkO1xufVxuZXhwb3J0IGNvbnN0IERlbGV0ZSA9IChwcm9wczogSVByb3BzKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImRlbGV0ZS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgcGF0aDogXCIvbWVkaWEvVmVjdG9yLnN2Z1wiLFxuICAgICAgaWQ6IHByb3BzLmlkLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHt9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJvcHMuaWQpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgcHJvcHMub25DbGljaygpO1xuICAgIH0pO1xuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5cbmV4cG9ydCBjb25zdCBFbXB0eSA9ICgpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiZW1wdHkudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHt9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBFbXB0eSB9IGZyb20gXCIuLi9FbXB0eVwiO1xuXG5pbnRlcmZhY2UgSVByb3BzIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgdHlwZTogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGlkOiBzdHJpbmc7XG4gIGNsYXNzTmFtZTogc3RyaW5nO1xuICBDaGlsZEF0dGVudGlvbj86IEhZUE87XG4gIG9uRm9jdXM/OiAoZTogRXZlbnQpID0+IHZvaWQ7XG4gIG9uQmx1cj86IChlOiBFdmVudCkgPT4gdm9pZDtcbn1cblxuLy9AdG9kbzog0L/RgNC40LrRgNGD0YLQuNGC0Ywg0YPQvdC40LrQsNC70YzQvdC+0YHRgtGMINC60LDQttC00L7Qs9C+INGN0LvQtdC80LXQvdGC0LBcblxuZXhwb3J0IGNvbnN0IElucHV0ID0gKHByb3BzOiBJUHJvcHMpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiaW5wdXQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIGxhYmVsOiB7XG4gICAgICAgIG5hbWU6IHByb3BzLmxhYmVsLFxuICAgICAgfSxcbiAgICAgIGF0cmlidXRlOiB7XG4gICAgICAgIHR5cGU6IHByb3BzLnR5cGUsXG4gICAgICAgIG5hbWU6IHByb3BzLm5hbWUsXG4gICAgICAgIGlkOiBwcm9wcy5pZCxcbiAgICAgICAgY2xhc3NOYW1lOiBwcm9wcy5jbGFzc05hbWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIEF0dGVudGlvbjogcHJvcHMuQ2hpbGRBdHRlbnRpb24gfHwgRW1wdHkoKSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChwcm9wcy5pZClcbiAgICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIChlOiBGb2N1c0V2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgY29uc3QgaW5wdXRMYWJlbCA9IGlucHV0LnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgXCIuZm9ybS1pbnB1dF9fbGFiZWxcIlxuICAgICAgICApO1xuICAgICAgICBpbnB1dExhYmVsPy5jbGFzc0xpc3QuYWRkKFwiZm9ybS1pbnB1dF9fbGFiZWxfc2VsZWN0XCIpO1xuICAgICAgICBwcm9wcy5vbkZvY3VzPy4oZSk7XG4gICAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wcy5pZCk/LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIChlOiBFdmVudCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgY29uc3QgaW5wdXRMYWJlbCA9IGlucHV0LnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiLmZvcm0taW5wdXRfX2xhYmVsXCJcbiAgICAgICk7XG4gICAgICBpZiAoIWlucHV0LnZhbHVlKSB7XG4gICAgICAgIGlucHV0TGFiZWw/LmNsYXNzTGlzdC5yZW1vdmUoXCJmb3JtLWlucHV0X19sYWJlbF9zZWxlY3RcIik7XG4gICAgICB9XG4gICAgICBwcm9wcy5vbkJsdXI/LihlKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvdXRpbHNcIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIHRleHQ6IHN0cmluZztcbiAgb25DbGljazogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IExpc3RJdGVtID0gKHsgdGV4dCwgb25DbGljayB9OiBJUHJvcHMpID0+IHtcbiAgY29uc3Qga2V5ID0gdXVpZHY0KCk7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImxpc3RpdGVtLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7IHRleHQ6IHRleHQsIGtleToga2V5IH0sXG4gIH0pLmFmdGVyUmVuZGVyKCgpID0+IHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChrZXkpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb25DbGljayk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCBTdG9yZSBmcm9tIFwiLi4vLi4vLi4vbGlicy9TdG9yZVwiO1xuaW1wb3J0IHsgTGlzdEl0ZW0gfSBmcm9tIFwiLi4vTGlzdEl0ZW1cIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIG1lbnVJZDogc3RyaW5nO1xufVxuXG5jb25zdCBtZW51bGlzdCA9IFtcItCj0LTQsNC70LjRgtGMINGH0LDRglwiLCBcItCf0L7QtNGA0L7QsdC90L7RgdGC0LhcIiwgXCJTZXR0aW5nc1wiXTtcblxuZXhwb3J0IGNvbnN0IE1lbnVCdXR0b24gPSAoeyBtZW51SWQgfTogSVByb3BzKSA9PiB7XG4gIGNvbnN0IE1lbnUgPSBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcIm1lbnVidXR0b24udGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHsgY2xhc3M6IFwiaGlkZVwiLCBtZW51SWQ6IG1lbnVJZCB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBsaXN0OiBtZW51bGlzdFxuICAgICAgICAubWFwKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIExpc3RJdGVtKHtcbiAgICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGFsZXJ0KFN0b3JlLnN0b3JlLmNoYXQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLnJldmVyc2UoKSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1lbnVJZCk7XG4gICAgZWxlbT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YXRlID0gTWVudS5nZXRTdGF0ZSgpO1xuICAgICAgY29uc3QgbWVudUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUgLm1lbnVMaXN0XCIpO1xuICAgICAgY29uc3QgaXNIaWRlID0gQXJyYXkuZnJvbShtZW51TGlzdD8uY2xhc3NMaXN0IHx8IFtdKS5pbmNsdWRlcyhcImhpZGVcIik7XG4gICAgICBpZiAoaXNIaWRlKSB7XG4gICAgICAgIHN0YXRlLmNsYXNzID0gXCJzaG93XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5jbGFzcyA9IFwiaGlkZVwiO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gTWVudTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgU3RvcmUsIHsgb2JzZXJ2ZXIgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9TdG9yZVwiO1xuXG5pbnRlcmZhY2UgSVByb3BzIHtcbiAgY2hhdElkOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBNZXNzYWdlcyA9IG9ic2VydmVyKCh7IGNoYXRJZCB9OiBJUHJvcHMpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwibWVzc2FnZXMudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIG1lc3NhZ2VzOiBTdG9yZS5zdG9yZS5tZXNzYWdlcyxcbiAgICB9LFxuICB9KTtcbn0pO1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuXG5pbnRlcmZhY2UgSVByb3BzIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgdmFsdWU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgb25DaGFnZTogKGU6IHsgdmFsdWU6IHN0cmluZyB9KSA9PiB2b2lkO1xufVxuZXhwb3J0IGNvbnN0IFByb2ZpbGVJbnB1dCA9ICh7IGxhYmVsLCB2YWx1ZSwgaWQsIG9uQ2hhZ2UgfTogSVByb3BzKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcInByb2ZpbGVJbnB1dC50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgaWQ6IGlkLFxuICAgIH0sXG4gIH0pLmFmdGVyUmVuZGVyKCgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIGlucHV0Py5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB7XG4gICAgICBvbkNoYWdlKHsgdmFsdWU6IGlucHV0LnZhbHVlIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuaW1wb3J0IHsgbWVtb2l6ZSB9IGZyb20gXCIuLi8uLi8uLi9saWJzL21vbWl6ZVwiO1xuXG5leHBvcnQgY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBtZW1vaXplKCgpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCIjcm9vdFwiKSB8fCBkb2N1bWVudC5ib2R5LFxuICAgIHRlbXBsYXRlUGF0aDogXCJjaGFuZ2VQYXNzd29yZC50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge30sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIHNhdmU6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCh0L7RhdGA0LDQvdC40YLRjFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwicGFzc3dvcmRfZWRpdF9fYWN0aW9uX19zYXZlXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9wcm9maWxlXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IGNvbnRhaW5lciwgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uL1Byb2ZpbGVcIjtcbmltcG9ydCB7IElVc2VyVmlld01vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbC9Vc2VyVmlld01vZGVsXCI7XG5pbXBvcnQgeyBWSUVXX01PREVMIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgUHJvZmlsZUlucHV0IH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvUHJvZmlsZUlucHV0XCI7XG5cbmNvbnN0IENvbmZpZzogeyBba2V5IGluIGtleW9mIElQcm9maWxlRFRPXT86IHsgbGFiZWw6IHN0cmluZyB9IH0gPSB7XG4gIGVtYWlsOiB7XG4gICAgbGFiZWw6IFwi0J/QvtGH0YLQsFwiLFxuICB9LFxuICBsb2dpbjoge1xuICAgIGxhYmVsOiBcItCb0L7Qs9C40L1cIixcbiAgfSxcbiAgZmlyc3RfbmFtZToge1xuICAgIGxhYmVsOiBcItCY0LzRj1wiLFxuICB9LFxuICBzZWNvbmRfbmFtZToge1xuICAgIGxhYmVsOiBcItCk0LDQvNC40LvQuNGPXCIsXG4gIH0sXG4gIGRpc3BsYXlfbmFtZToge1xuICAgIGxhYmVsOiBcItCY0LzRjyDQsiDRh9Cw0YLQsNGFXCIsXG4gIH0sXG4gIHBob25lOiB7XG4gICAgbGFiZWw6IFwi0KLQtdC70LXRhNC+0L1cIixcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBDaGFuZ2VQcm9maWxlID0gKGRhdGE6IElQcm9maWxlRFRPKSA9PiB7XG4gIGNvbnN0IHVzZXJWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElVc2VyVmlld01vZGVsPihWSUVXX01PREVMLlVTRVIpO1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHJlbmRlclRvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIikgfHwgZG9jdW1lbnQuYm9keSxcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiY2hhbmdlUHJvZmlsZS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgZW1haWw6IGRhdGE/LmVtYWlsLFxuICAgICAgbG9naW46IGRhdGE/LmxvZ2luLFxuICAgICAgZmlyc3ROYW1lOiBkYXRhPy5maXJzdF9uYW1lLFxuICAgICAgc2Vjb25kTmFtZTogZGF0YT8uc2Vjb25kX25hbWUsXG4gICAgICBkaXNwbGF5TmFtZTogZGF0YT8uZGlzcGxheV9uYW1lIHx8IFwiXCIsXG4gICAgICBwaG9uZTogZGF0YT8ucGhvbmUsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgc2F2ZTogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0KHQvtGF0YDQsNC90LjRgtGMXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJwcm9maWxlX2VkaXRfX2FjdGlvbl9fc2F2ZVwiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAodXNlclZpZXdNb2RlbC51c2VyKSB7XG4gICAgICAgICAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcbiAgICAgICAgICAgICAgXCJwcm9maWxlX2VkaXRcIlxuICAgICAgICAgICAgKVswXSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1c2VyVmlld01vZGVsLnVzZXIpO1xuICAgICAgICAgICAgdXNlclZpZXdNb2RlbC5zYXZlVXNlcih1c2VyVmlld01vZGVsLnVzZXIpLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgICAgICByb3V0ZXIuZ28oXCIvcHJvZmlsZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgaW5wdXRzOiBPYmplY3Qua2V5cyhDb25maWcpXG4gICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGtleSA9IGl0ZW0gYXMga2V5b2YgdHlwZW9mIGRhdGE7XG4gICAgICAgICAgY29uc3QgbGFiZWwgPSBDb25maWdbaXRlbSBhcyBrZXlvZiB0eXBlb2YgQ29uZmlnXT8ubGFiZWwgYXMgc3RyaW5nO1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gZGF0YSA/IChkYXRhW2tleV0gYXMgc3RyaW5nKSA6IFwiXCI7XG4gICAgICAgICAgcmV0dXJuIFByb2ZpbGVJbnB1dCh7XG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBpZDoga2V5LFxuICAgICAgICAgICAgb25DaGFnZTogKHsgdmFsdWUgfSkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gICAgICAgICAgICAgIHVzZXJWaWV3TW9kZWwudXNlciA9IHtcbiAgICAgICAgICAgICAgICAuLi51c2VyVmlld01vZGVsLnVzZXIsXG4gICAgICAgICAgICAgICAgW2l0ZW1dOiB2YWx1ZSxcbiAgICAgICAgICAgICAgfSBhcyBJUHJvZmlsZURUTztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IENoYXRJdGVtLCBJQ2hhdERUTyB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0NoYXRJdGVtXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuaW1wb3J0IHsgRW1wdHkgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9FbXB0eVwiO1xuaW1wb3J0IHsgQ3JlYXRlQ2hhdE1vZGFsIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQ3JlYXRlQ2hhdE1vZGFsXCI7XG5pbXBvcnQgeyBNZW51QnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvTWVudUJ1dHRvblwiO1xuaW1wb3J0IFN0b3JlLCB7IG9ic2VydmVyIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvU3RvcmVcIjtcblxuZXhwb3J0IGNvbnN0IENoYXRMYXlvdXQgPSBvYnNlcnZlcigocmVzdWx0OiBJQ2hhdERUT1tdKSA9PiB7XG4gIGNvbnN0IENoYXRJdGVtTGlzdDogSFlQT1tdID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICByZXN1bHQuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBDaGF0SXRlbUxpc3QucHVzaChDaGF0SXRlbSh7IC4uLml0ZW0gfSkpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIENoYXRJdGVtTGlzdC5wdXNoKEVtcHR5KCkpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpIHx8IGRvY3VtZW50LmJvZHksXG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYXQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIG1lc3NhZ2VzOiBTdG9yZS5zdG9yZS5tZXNzYWdlcyxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBQcm9maWxlTGluazogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwiUHJvZmlsZVwiLFxuICAgICAgICBjbGFzc05hbWU6IFwicHJvZmlsZS1saW5rX19idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFwibWVudS1idXR0b25cIjogTWVudUJ1dHRvbih7IG1lbnVJZDogXCJjaGF0TWVudVwiIH0pLFxuICAgICAgY2hhdEl0ZW06IENoYXRJdGVtTGlzdCxcbiAgICAgIGNyZWF0ZUNoYXRNb2RhbDogQ3JlYXRlQ2hhdE1vZGFsKCksXG4gICAgICBjcmVhdGVDaGF0QnV0dG9uOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCIrXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJuYXZpZ2F0aW9uX19jcmVhdGVDaGF0QnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjLWMtbW9kYWxcIilbMF1cbiAgICAgICAgICAgIC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvSW5wdXRcIjtcbmltcG9ydCB7IFJlcXVpcmVkIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZFwiO1xuaW1wb3J0IHsgQXR0ZW50aW9uTWVzc2FnZSB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0F0dGVudGlvbk1lc3NhZ2VcIjtcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLi9pbmRleFwiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi9Qcm9maWxlXCI7XG5cbi8qKlxuICogbm5ucnJyMTExTk5cbiAqL1xuXG5leHBvcnQgY29uc3QgTG9naW5MYXlvdXQgPSAodXNlcjogSVByb2ZpbGVEVE8pOiBIWVBPID0+IHtcbiAgaWYgKHVzZXIgJiYgdXNlci5pZCkge1xuICAgIHJvdXRlci5nbyhcIi9jaGF0XCIpO1xuICB9XG5cbiAgY29uc3QgYXR0ZW50aW9uTG9naW4gPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IGF0dGVudGlvbkxvZ2luU3RvcmUgPSBhdHRlbnRpb25Mb2dpbi5nZXRTdGF0ZSgpO1xuICBjb25zdCBhdHRlbnRpb25QYXNzID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBhdHRlbnRpb25QYXNzU3RvcmUgPSBhdHRlbnRpb25QYXNzLmdldFN0YXRlKCk7XG5cbiAgY29uc3QgRm9ybURhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpIHx8IGRvY3VtZW50LmJvZHksXG4gICAgdGVtcGxhdGVQYXRoOiBcImxvZ2luLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBGb3JtTmFtZTogXCLQktGF0L7QtFwiLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIElucHV0TG9naW46IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0JvQvtCz0LjQvVwiLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgbmFtZTogXCJsb2dpblwiLFxuICAgICAgICBpZDogXCJmb3JtLWlucHV0LWxvZ2luXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWxvZ2luX19mb3JtLWlucHV0XCIsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGNvbnN0IGNoZWNrID0gUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0Py52YWx1ZSk7XG4gICAgICAgICAgaWYgKCFjaGVjaykge1xuICAgICAgICAgICAgYXR0ZW50aW9uTG9naW5TdG9yZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dGVudGlvbkxvZ2luU3RvcmUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgICBGb3JtRGF0YVtcImxvZ2luXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogYXR0ZW50aW9uTG9naW4sXG4gICAgICB9KSxcbiAgICAgIElucHV0UGFzc3dvcmQ6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0J/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbmFtZTogXCJwYXNzd29yZFwiLFxuICAgICAgICBpZDogXCJmb3JtLWlucHV0LXBhc3N3b3JkXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWxvZ2luX19mb3JtLWlucHV0XCIsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmICghUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgYXR0ZW50aW9uUGFzc1N0b3JlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0ZW50aW9uUGFzc1N0b3JlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgICAgRm9ybURhdGFbXCJwYXNzd29yZFwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IGF0dGVudGlvblBhc3MsXG4gICAgICB9KSxcbiAgICAgIEJ1dHRvbjogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0JDQstGC0L7RgNC40LfQvtCy0LDRgtGM0YHRj1wiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgZGF0YTogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGxvZ2luOiBGb3JtRGF0YS5sb2dpbixcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6IEZvcm1EYXRhLnBhc3N3b3JkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAgICAgICAuUE9TVChcIi9hdXRoL3NpZ25pblwiLCBkYXRhKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgIHJvdXRlci5nbyhcIi9jaGF0XCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgTGlua1RvUmVnaXN0cmF0aW9uOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y9cIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tbGlua1wiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvcmVnaXN0cmF0aW9uXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9UcmFuc3BvcnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJUHJvZmlsZURUTyB7XG4gIGlkOiBudW1iZXI7XG4gIGRpc3BsYXlfbmFtZTogc3RyaW5nO1xuICBlbWFpbDogc3RyaW5nO1xuICBmaXJzdF9uYW1lOiBzdHJpbmc7XG4gIHNlY29uZF9uYW1lOiBzdHJpbmc7XG4gIGxvZ2luOiBzdHJpbmc7XG4gIHBob25lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBQcm9maWxlTGF5b3V0ID0gKGRhdGE6IElQcm9maWxlRFRPKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jvb3RcIiksXG4gICAgdGVtcGxhdGVQYXRoOiBcInByb2ZpbGUudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIC4uLmRhdGEsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgRWRpdFByb2ZpbGVMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQmNC30LzQtdC90LjRgtGMINC00LDQvdC90YvQtVwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19jaGFuZ2UtcHJvZmlsZVwiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL2VkaXRwcm9maWxlXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBFZGl0UGFzc3dvcmRMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQmNC30LzQtdC90LjRgtGMINC/0LDRgNC+0LvRjFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19jaGFuZ2UtcGFzc3dvcmRcIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9lZGl0cGFzc3dvcmRcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIEJhY2tMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQndCw0LfQsNC0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2JhY2tcIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9jaGF0XCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBFeGl0TGluazogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0JLRi9C50YLQuFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19leGl0XCIsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgICAgICAgIC5QT1NUKFwiL2F1dGgvbG9nb3V0XCIpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJvdXRlci5nbyhcIi9cIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvSW5wdXRcIjtcbi8vIGltcG9ydCB7IFZhbGlkYXRvciwgUnVsZSB9IGZyb20gXCIuLi8uLi9saWJzL1ZhbGlkYXRvclwiO1xuaW1wb3J0IHsgRW1haWxWYWxpZGF0b3IgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9WYWxpZGF0b3JzL0VtYWlsXCI7XG5pbXBvcnQgeyBSZXF1aXJlZCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1ZhbGlkYXRvcnMvUmVxdWlyZWRcIjtcbmltcG9ydCB7IEF0dGVudGlvbk1lc3NhZ2UgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9BdHRlbnRpb25NZXNzYWdlXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9UcmFuc3BvcnRcIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuXG5leHBvcnQgY29uc3QgUmVnaXN0cmF0aW9uTGF5b3V0ID0gKCkgPT4ge1xuICBjb25zdCBBdHRlbnRpb25FbWFpbCA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uTG9naW4gPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IEF0dGVudGlvblBhc3N3b3JkID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25QYXNzd29yZERvdWJsZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uRmlyc3ROYW1lID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25TZWNvbmROYW1lID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25QaG9uZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcblxuICBjb25zdCBGb3JtRGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jvb3RcIiksXG4gICAgdGVtcGxhdGVQYXRoOiBcInJlZ2lzdHJhdGlvbi50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgZm9ybVRpdGxlOiBcItCg0LXQs9C40YHRgtGA0LDRhtC40Y9cIixcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBJbnB1dEVtYWlsOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiBcItCf0L7Rh9GC0LBcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwiZW1haWxcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fZW1haWxfX2lucHV0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uRW1haWwsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25FbWFpbC5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoRW1haWxWYWxpZGF0b3IuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbXCJlbWFpbFwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDRjdGC0L4g0L3QtSDQv9C+0YXQvtC20LUg0L3QsCDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRi1wiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgSW5wdXRMb2dpbjogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQm9C+0LPQuNC9XCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImxvZ2luXCIsXG4gICAgICAgIGlkOiBcImZvcm1fX2xvZ2luX19pbnB1dFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1yZWdfX2Zvcm0taW5wdXRcIixcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvbkxvZ2luLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uTG9naW4uZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wibG9naW5cIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBGaXJzdE5hbWU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0JjQvNGPXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImZpcnN0X25hbWVcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fZmlyc3RfbmFtZV9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25GaXJzdE5hbWUsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25GaXJzdE5hbWUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wiZmlyc3RfbmFtZVwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFNlY29uZE5hbWU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0KTQsNC80LjQu9C40Y9cIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwic2Vjb25kX25hbWVcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fc2Vjb25kX25hbWVfX2lucHV0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uU2Vjb25kTmFtZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblNlY29uZE5hbWUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wic2Vjb25kX25hbWVcIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBQaG9uZTogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQotC10LvQtdGE0L7QvVwiLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgbmFtZTogXCJwaG9uZVwiLFxuICAgICAgICBpZDogXCJmb3JtX19waG9uZV9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QaG9uZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblBob25lLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVtcInBob25lXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUGFzc3dvcmQ6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0J/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbmFtZTogXCJwYXNzd29yZFwiLFxuICAgICAgICBpZDogXCJmb3JtX19wYXNzd29yZF9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QYXNzd29yZCxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25QYXNzd29yZC5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IHN0YXRlRCA9IEF0dGVudGlvblBhc3N3b3JkRG91YmxlLmdldFN0YXRlKCk7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wicGFzc3dvcmRcIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKEZvcm1EYXRhW1wicGFzc3dvcmRcIl0gIT09IEZvcm1EYXRhW1wiZG91YmxlcGFzc3dvcmRcIl0pIHtcbiAgICAgICAgICAgICAgc3RhdGVELm1lc3NhZ2UgPSBcIvCflKXQv9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUGFzc3dvcmREb3VibGU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0J/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbmFtZTogXCJkb3VibGVwYXNzd29yZFwiLFxuICAgICAgICBpZDogXCJmb3JtX19kb3VibGVwYXNzd29yZF9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QYXNzd29yZERvdWJsZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25QYXNzd29yZERvdWJsZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVtcImRvdWJsZXBhc3N3b3JkXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChGb3JtRGF0YVtcInBhc3N3b3JkXCJdICE9PSBGb3JtRGF0YVtcImRvdWJsZXBhc3N3b3JkXCJdKSB7XG4gICAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIvCflKXQv9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUmVnQnV0dG9uOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y9cIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKEZvcm1EYXRhKS5sZW5ndGggPT0gMCB8fFxuICAgICAgICAgICAgT2JqZWN0LmtleXMoRm9ybURhdGEpLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIEZvcm1EYXRhW2l0ZW1dID09PSBcIlwiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZGF0YTogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGZpcnN0X25hbWU6IEZvcm1EYXRhLmZpcnN0X25hbWUsXG4gICAgICAgICAgICAgIHNlY29uZF9uYW1lOiBGb3JtRGF0YS5zZWNvbmRfbmFtZSxcbiAgICAgICAgICAgICAgbG9naW46IEZvcm1EYXRhLmxvZ2luLFxuICAgICAgICAgICAgICBlbWFpbDogRm9ybURhdGEuZW1haWwsXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBGb3JtRGF0YS5wYXNzd29yZCxcbiAgICAgICAgICAgICAgcGhvbmU6IEZvcm1EYXRhLnBob25lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAgICAgICAuUE9TVChcIi9hdXRoL3NpZ251cFwiLCBkYXRhKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByb3V0ZXIuZ28oXCIvY2hhdFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBMb2dpbkxpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCS0L7QudGC0LhcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tbGlua1wiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSUNoYXRTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL0J1c3NpbmVzTGF5ZXIvQ2hhdFNlcnZpY2VcIjtcbmltcG9ydCB7IElDaGF0RFRPIH0gZnJvbSBcIi4uLy4uL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ2hhdFZpZXdNb2RlbCB7XG4gIGNoYXRzOiBBcnJheTxJQ2hhdERUTz47XG4gIGdldENoYXRzOiAoKSA9PiBQcm9taXNlPElDaGF0RFRPW10+O1xuICBzYXZlQ2hhdDogKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IFByb21pc2U8dm9pZD47XG4gIGRlbGV0ZUNoYXQ6IChjaGF0SWQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbn1cbmV4cG9ydCBjbGFzcyBDaGF0Vmlld01vZGVsIGltcGxlbWVudHMgSUNoYXRWaWV3TW9kZWwge1xuICBjaGF0czogQXJyYXk8SUNoYXREVE8+ID0gW107XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzZXJ2aWNlOiBJQ2hhdFNlcnZpY2UpIHt9XG5cbiAgZ2V0Q2hhdHMgPSBhc3luYyAoKSA9PiB7XG4gICAgdGhpcy5jaGF0cyA9IGF3YWl0IHRoaXMuc2VydmljZS5nZXRDaGF0cygpO1xuICAgIHJldHVybiB0aGlzLmNoYXRzO1xuICB9O1xuXG4gIHNhdmVDaGF0ID0gYXN5bmMgKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IHtcbiAgICBhd2FpdCB0aGlzLnNlcnZpY2Uuc2F2ZUNoYXQoZGF0YSk7XG4gICAgYXdhaXQgdGhpcy5nZXRDaGF0cygpO1xuICB9O1xuXG4gIGRlbGV0ZUNoYXQgPSBhc3luYyAoY2hhdElkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBhd2FpdCB0aGlzLnNlcnZpY2UuZGVsZXRlQ2hhdChjaGF0SWQpO1xuICAgIGF3YWl0IHRoaXMuZ2V0Q2hhdHMoKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IElVc2VyU2VydmljZSB9IGZyb20gXCIuLi8uLi9CdXNzaW5lc0xheWVyL1VzZXJTZXJ2aWNlXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi8uLi9VSS9MYXlvdXRzL1Byb2ZpbGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJVXNlclZpZXdNb2RlbCB7XG4gIHVzZXI/OiBJUHJvZmlsZURUTztcbiAgZ2V0VXNlcjogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgc2F2ZVVzZXI6ICh1c2VyOiBJUHJvZmlsZURUTykgPT4gUHJvbWlzZTxJUHJvZmlsZURUTz47XG4gIHNldFVzZXJGaWVsZDogKG5hbWU6IGtleW9mIElQcm9maWxlRFRPLCB2YWx1ZTogYW55KSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgVXNlclZpZXdNb2RlbCBpbXBsZW1lbnRzIElVc2VyVmlld01vZGVsIHtcbiAgdXNlcj86IElQcm9maWxlRFRPO1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2VydmljZTogSVVzZXJTZXJ2aWNlKSB7fVxuXG4gIGdldFVzZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgdGhpcy51c2VyID0gYXdhaXQgdGhpcy5zZXJ2aWNlLmdldFVzZXIoKTtcbiAgfTtcblxuICBzYXZlVXNlciA9IGFzeW5jICh1c2VyOiBJUHJvZmlsZURUTykgPT4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZpY2Uuc2F2ZVVzZXIodXNlcik7XG4gIH07XG5cbiAgc2V0VXNlckZpZWxkKG5hbWU6IGtleW9mIElQcm9maWxlRFRPLCB2YWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMudXNlcikge1xuICAgICAgdGhpcy51c2VyW25hbWVdID0gdmFsdWUgYXMgbmV2ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXNlciA9IHt9IGFzIElQcm9maWxlRFRPO1xuICAgICAgdGhpcy51c2VyW25hbWVdID0gdmFsdWUgYXMgbmV2ZXI7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTRVJWSUNFIH0gZnJvbSBcIi4uL0J1c3NpbmVzTGF5ZXJcIjtcbmltcG9ydCB7IElDaGF0U2VydmljZSB9IGZyb20gXCIuLi9CdXNzaW5lc0xheWVyL0NoYXRTZXJ2aWNlXCI7XG5pbXBvcnQgeyBJVXNlclNlcnZpY2UgfSBmcm9tIFwiLi4vQnVzc2luZXNMYXllci9Vc2VyU2VydmljZVwiO1xuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcIi4uL2xpYnMvQ29udGFpbmVyXCI7XG5pbXBvcnQgeyBDaGF0Vmlld01vZGVsIH0gZnJvbSBcIi4vQ2hhdFZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgVXNlclZpZXdNb2RlbCB9IGZyb20gXCIuL1VzZXJWaWV3TW9kZWxcIjtcblxuZXhwb3J0IGNvbnN0IFZJRVdfTU9ERUwgPSB7XG4gIENIQVQ6IFN5bWJvbC5mb3IoXCJDaGF0Vmlld01vZGVsXCIpLFxuICBVU0VSOiBTeW1ib2wuZm9yKFwiVXNlclZpZXdNb2RlbFwiKSxcbn07XG5cbmV4cG9ydCBjb25zdCBWaWV3TW9kZWxDb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XG5cblZpZXdNb2RlbENvbnRhaW5lci5iaW5kKFZJRVdfTU9ERUwuQ0hBVCkudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuICBjb25zdCBzZXJ2aWNlID0gY29udGFpbmVyLmdldDxJQ2hhdFNlcnZpY2U+KFNFUlZJQ0UuQ0hBVCk7XG4gIHJldHVybiBuZXcgQ2hhdFZpZXdNb2RlbChzZXJ2aWNlKTtcbn0pO1xuXG5WaWV3TW9kZWxDb250YWluZXIuYmluZChWSUVXX01PREVMLlVTRVIpXG4gIC50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gICAgY29uc3Qgc2VydmljZSA9IGNvbnRhaW5lci5nZXQ8SVVzZXJTZXJ2aWNlPihTRVJWSUNFLlVTRVIpO1xuICAgIHJldHVybiBuZXcgVXNlclZpZXdNb2RlbChzZXJ2aWNlKTtcbiAgfSlcbiAgLmluU2luZ2xldG9uZVNjb3BlKCk7XG4iLCJpbXBvcnQgXCJyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWVcIjtcbmltcG9ydCB7IEJvb3RTdHJhcCB9IGZyb20gXCIuL0Jvb3RzdHJhcFwiO1xuaW1wb3J0IHsgQXBwSW5pdCB9IGZyb20gXCIuL3JvdXRlclwiO1xuXG5jb25zdCBJbml0QXBwID0gKCkgPT4ge1xuICBjb25zdCB7IGNvbnRhaW5lciB9ID0gbmV3IEJvb3RTdHJhcCgpO1xuICAvLyDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgNC10L3QtNC10YDQsCDQv9GA0L7QuNGB0YXQvtC00LjRgiDQsiBSb3V0ZXJJbml0XG4gIGNvbnN0IHJvdXRlciA9IEFwcEluaXQoY29udGFpbmVyKTtcbiAgcmV0dXJuIHsgcm91dGVyLCBjb250YWluZXIgfTtcbn07XG5cbmV4cG9ydCBjb25zdCB7IHJvdXRlciwgY29udGFpbmVyIH0gPSBJbml0QXBwKCk7XG4iLCJjbGFzcyBTaW5nbGV0b25TY29wZSB7XG4gIEluc3RhbmNlTWFrZXJzOiBNYXA8c3ltYm9sLCBhbnk+ID0gbmV3IE1hcDxcbiAgICBzeW1ib2wsXG4gICAgeyBmbjogKGNvbnRhaW5lcjogQ29udGFpbmVyKSA9PiBhbnk7IGlkOiBzeW1ib2wgfVxuICA+KCk7XG4gIEluc3RhbmNlczogTWFwPHN5bWJvbCwgYW55PiA9IG5ldyBNYXA8c3ltYm9sLCBhbnk+KCk7XG59XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXIge1xuICBjb250YWluZXJzOiBNYXA8c3ltYm9sLCBhbnk+ID0gbmV3IE1hcCgpO1xuICBsYXN0SWQ/OiBzeW1ib2w7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBzaW5nbGV0b25lU2NvcGU6IFNpbmdsZXRvblNjb3BlID0gbmV3IFNpbmdsZXRvblNjb3BlKClcbiAgKSB7fVxuICBiaW5kKGlkOiBzeW1ib2wpOiBDb250YWluZXIge1xuICAgIHRoaXMubGFzdElkID0gaWQ7XG4gICAgdGhpcy5jb250YWluZXJzLnNldChpZCwgbnVsbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgZ2V0ID0gPFQ+KGlkOiBzeW1ib2wpOiBUID0+IHtcbiAgICBjb25zdCBzaW5nbGVUb25lQ29udGFpbmVyID0gdGhpcy5zaW5nbGV0b25lU2NvcGUuSW5zdGFuY2VNYWtlcnMuZ2V0KGlkKTtcbiAgICBpZiAoc2luZ2xlVG9uZUNvbnRhaW5lcikge1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLnNpbmdsZXRvbmVTY29wZS5JbnN0YW5jZXMuZ2V0KGlkKTtcbiAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNpbmdsZXRvbmVTY29wZS5JbnN0YW5jZXMuc2V0KGlkLCBzaW5nbGVUb25lQ29udGFpbmVyLmZuKHRoaXMpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2luZ2xldG9uZVNjb3BlLkluc3RhbmNlcy5nZXQoaWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjcmVhdGVDb250YWluZXJGbiA9IHRoaXMuY29udGFpbmVycy5nZXQoaWQpO1xuICAgICAgcmV0dXJuIGNyZWF0ZUNvbnRhaW5lckZuLmZuKHRoaXMpO1xuICAgIH1cbiAgfTtcblxuICB0b0R5bmFtaWNWYWx1ZShmbjogKGNvbnRhaW5lcjogQ29udGFpbmVyKSA9PiB1bmtub3duKSB7XG4gICAgaWYgKHRoaXMubGFzdElkKSB7XG4gICAgICB0aGlzLmNvbnRhaW5lcnMuc2V0KHRoaXMubGFzdElkLCB7IGZuOiBmbiwgaWQ6IHRoaXMubGFzdElkIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcGFyZW50KGNvbnRhaW5lcjogQ29udGFpbmVyKTogQ29udGFpbmVyIHtcbiAgICBmb3IgKGxldCBjb250IG9mIGNvbnRhaW5lci5jb250YWluZXJzKSB7XG4gICAgICB0aGlzLmNvbnRhaW5lcnMuc2V0KGNvbnRbMF0sIGNvbnRbMV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGluU2luZ2xldG9uZVNjb3BlKCkge1xuICAgIGlmICh0aGlzLmxhc3RJZCkge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJzLmdldCh0aGlzLmxhc3RJZCk7XG4gICAgICB0aGlzLnNpbmdsZXRvbmVTY29wZS5JbnN0YW5jZU1ha2Vycy5zZXQodGhpcy5sYXN0SWQsIGNvbnRhaW5lcik7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBtZW1vaXplIH0gZnJvbSBcIi4uL21vbWl6ZVwiO1xuaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmludGVyZmFjZSBJSFlQT1Byb3BzIHtcbiAgcmVuZGVyVG8/OiBIVE1MRWxlbWVudDtcbiAgdGVtcGxhdGVQYXRoOiBzdHJpbmc7XG4gIGNoaWxkcmVuPzogUmVjb3JkPHN0cmluZywgSFlQTyB8IEhZUE9bXT47XG4gIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xufVxuXG5pbnRlcmZhY2UgSVRlbXBhdGVQcm9wIHtcbiAgaHRtbDogc3RyaW5nO1xuICB0ZW1wbGF0ZUtleTogc3RyaW5nO1xuICBtYWdpY0tleTogc3RyaW5nO1xuICBpc0FycmF5OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgSFlQTyB7XG4gIHByaXZhdGUgcmVuZGVyVG8/OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBjaGlsZHJlbj86IFJlY29yZDxzdHJpbmcsIEhZUE8gfCBIWVBPW10+O1xuICBwcml2YXRlIHRlbXBsYXRlUGF0aDogc3RyaW5nO1xuICBwcml2YXRlIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICBwcml2YXRlIHRlbXBsYXRlc1Byb21pc2VzOiBQcm9taXNlPElUZW1wYXRlUHJvcD5bXTtcbiAgcHJpdmF0ZSBzdG9yZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIHByaXZhdGUgbWFnaWNLZXk6IHN0cmluZztcbiAgcHJpdmF0ZSBhZnRlclJlbmRlckNhbGxiYWNrOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIGFmdGVyUmVuZGVyQ2FsbGJhY2tBcnI6IFNldDwoKSA9PiB2b2lkPjtcblxuICBjb25zdHJ1Y3RvcihwYXJhbXM6IElIWVBPUHJvcHMpIHtcbiAgICB0aGlzLnJlbmRlclRvID0gcGFyYW1zLnJlbmRlclRvO1xuICAgIHRoaXMuZGF0YSA9IHBhcmFtcy5kYXRhO1xuICAgIHRoaXMudGVtcGxhdGVQYXRoID0gYC4vdGVtcGxhdGVzLyR7cGFyYW1zLnRlbXBsYXRlUGF0aH1gO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBwYXJhbXMuY2hpbGRyZW47XG4gICAgdGhpcy50ZW1wbGF0ZXNQcm9taXNlcyA9IFtdO1xuICAgIHRoaXMuc3RvcmUgPSB7fTtcbiAgICB0aGlzLm1hZ2ljS2V5ID0gdXVpZHY0KCk7XG4gICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrID0gKCkgPT4ge307XG4gICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrQXJyID0gbmV3IFNldCgpO1xuICB9XG5cbiAgcHVibGljIGdldFRlbXBsYXRlSFRNTCA9IGFzeW5jIChcbiAgICBrZXk6IHN0cmluZyxcbiAgICBoeXBvOiBIWVBPLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKTogUHJvbWlzZTxJVGVtcGF0ZVByb3A+ID0+IHtcbiAgICBjb25zdCBnZXRIVE1MID0gYXN5bmMgKHRlbXBsYXRlUGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZldGNoKHRlbXBsYXRlUGF0aClcbiAgICAgICAgICAudGhlbigoaHRtbCkgPT4ge1xuICAgICAgICAgICAgaWYgKGh0bWwuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZmlsZSBkbyBub3QgZG93bmxvYWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaHRtbC5ibG9iKCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LnRleHQoKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHRleHQpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9O1xuXG4gICAgY29uc3QgZ2V0SFRNTG1lbW8gPSBtZW1vaXplKGdldEhUTUwpO1xuXG4gICAgY29uc3QgaHRtbFRlbXBsYXRlID0gYXdhaXQgZ2V0SFRNTG1lbW8oaHlwby50ZW1wbGF0ZVBhdGgpO1xuICAgIGNvbnN0IGh0bWwgPSB0aGlzLmluc2VydERhdGFJbnRvSFRNTChodG1sVGVtcGxhdGUsIGh5cG8uZGF0YSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaHRtbDogaHRtbCxcbiAgICAgIHRlbXBsYXRlS2V5OiBrZXksXG4gICAgICBtYWdpY0tleTogaHlwby5tYWdpY0tleSxcbiAgICAgIGlzQXJyYXk6IGlzQXJyYXksXG4gICAgfTtcbiAgfTtcblxuICBwcml2YXRlIGNvbGxlY3RUZW1wbGF0ZXMoXG4gICAgaHlwbzogSFlQTyB8IEhZUE9bXSxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgaXNBcnJheTogYm9vbGVhblxuICApOiBIWVBPIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShoeXBvKSkge1xuICAgICAgdGhpcy5oYW5kbGVBcnJheUhZUE8oaHlwbywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGFuZGxlU2ltcGxlSFlQTyhoeXBvLCBuYW1lKTtcbiAgICAgIHRoaXMudGVtcGxhdGVzUHJvbWlzZXMucHVzaCh0aGlzLmdldFRlbXBsYXRlSFRNTChuYW1lLCBoeXBvLCBpc0FycmF5KSk7XG4gICAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbGJhY2tBcnIuYWRkKGh5cG8uYWZ0ZXJSZW5kZXJDYWxsYmFjayk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVBcnJheUhZUE8oaHlwb3M6IEhZUE9bXSwgbmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaHlwb3MuZm9yRWFjaCgoaHlwbykgPT4ge1xuICAgICAgdGhpcy5jb2xsZWN0VGVtcGxhdGVzKGh5cG8sIGAke25hbWV9YCwgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZVNpbXBsZUhZUE8oaHlwbzogSFlQTywgXzogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKGh5cG8uY2hpbGRyZW4pIHtcbiAgICAgIE9iamVjdC5rZXlzKGh5cG8uY2hpbGRyZW4pLmZvckVhY2goKGNoaWxkTmFtZSkgPT4ge1xuICAgICAgICBpZiAoaHlwby5jaGlsZHJlbikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3RUZW1wbGF0ZXMoXG4gICAgICAgICAgICBoeXBvLmNoaWxkcmVuW2NoaWxkTmFtZV0sXG4gICAgICAgICAgICBjaGlsZE5hbWUsXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5zZXJ0RGF0YUludG9IVE1MKFxuICAgIGh0bWxUZW1wbGF0ZTogc3RyaW5nLFxuICAgIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gICk6IHN0cmluZyB7XG4gICAgZGF0YSA9IHRoaXMuZ2V0RGF0YVdpdGhvdXRJZXJhcmh5KGRhdGEpO1xuICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAgICBpZiAodHlwZW9mIGRhdGFba2V5XSAhPT0gXCJvYmplY3RcIiB8fCBkYXRhW2tleV0gPT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoXCJ7e1wiICsga2V5ICsgXCJ9fVwiLCBcImdcIik7XG4gICAgICAgIGh0bWxUZW1wbGF0ZSA9IGh0bWxUZW1wbGF0ZS5yZXBsYWNlKG1hc2ssIFN0cmluZyhkYXRhW2tleV0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoL3t7W2Etei5fXSt9fS9nKTtcbiAgICBodG1sVGVtcGxhdGUgPSBodG1sVGVtcGxhdGUucmVwbGFjZShtYXNrLCBcIlwiKTtcbiAgICByZXR1cm4gaHRtbFRlbXBsYXRlO1xuICB9XG5cbiAgcHJpdmF0ZSBjb252ZXJ0QXJyVGVtcGxhdGVUb01hcChcbiAgICB0ZW1wbGF0ZUFycjoge1xuICAgICAgaHRtbDogc3RyaW5nO1xuICAgICAgdGVtcGxhdGVLZXk6IHN0cmluZztcbiAgICAgIG1hZ2ljS2V5OiBzdHJpbmc7XG4gICAgICBpc0FycmF5OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIH1bXVxuICApOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICB0ZW1wbGF0ZUFyci5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpZiAocmVzdWx0W2l0ZW0udGVtcGxhdGVLZXldKSB7XG4gICAgICAgIHJlc3VsdFtcbiAgICAgICAgICBpdGVtLnRlbXBsYXRlS2V5XG4gICAgICAgIF0gKz0gYDxzcGFuIGh5cG89XCIke2l0ZW0ubWFnaWNLZXl9XCI+JHtpdGVtLmh0bWx9PC9zcGFuPmA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbYCR7aXRlbS50ZW1wbGF0ZUtleX0tJHtpdGVtLm1hZ2ljS2V5fWBdID0gaXRlbS5odG1sO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgaW5zZXJ0VGVtcGxhdGVJbnRvVGVtcGxhdGUoXG4gICAgcm9vdFRlbXBsYXRlSFRNTDogc3RyaW5nLFxuICAgIHRlbXBsYXRlS2V5OiBzdHJpbmcsXG4gICAgY2hpbGRUZW1wbGF0ZUhUTUw6IHN0cmluZyxcbiAgICBtYWdpY0tleTogc3RyaW5nLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKTogc3RyaW5nIHtcbiAgICByb290VGVtcGxhdGVIVE1MID0gdGhpcy5jcmVhdGVFbGVtV3JhcHBlcihcbiAgICAgIHJvb3RUZW1wbGF0ZUhUTUwsXG4gICAgICB0ZW1wbGF0ZUtleSxcbiAgICAgIG1hZ2ljS2V5LFxuICAgICAgaXNBcnJheVxuICAgICk7XG4gICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoYC09JHt0ZW1wbGF0ZUtleX0tJHttYWdpY0tleX09LWAsIFwiZ1wiKTtcbiAgICByb290VGVtcGxhdGVIVE1MID0gcm9vdFRlbXBsYXRlSFRNTC5yZXBsYWNlKG1hc2ssIGNoaWxkVGVtcGxhdGVIVE1MKTtcbiAgICByZXR1cm4gcm9vdFRlbXBsYXRlSFRNTDtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRWxlbVdyYXBwZXIoXG4gICAgaHRtbFRlbXBsYXRlOiBzdHJpbmcsXG4gICAgdGVtcGxhdGVLZXk6IHN0cmluZyxcbiAgICBtYWdpY0tleTogc3RyaW5nLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKSB7XG4gICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoYC09JHt0ZW1wbGF0ZUtleX09LWAsIFwiZ1wiKTtcbiAgICBpZiAoaXNBcnJheSkge1xuICAgICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UoXG4gICAgICAgIG1hc2ssXG4gICAgICAgIGA8c3BhbiBoeXBvPVwiJHttYWdpY0tleX1cIj4tPSR7dGVtcGxhdGVLZXl9LSR7bWFnaWNLZXl9PS0tPSR7dGVtcGxhdGVLZXl9PS08L3NwYW4+YFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UoXG4gICAgICAgIG1hc2ssXG4gICAgICAgIGA8c3BhbiBoeXBvPVwiJHttYWdpY0tleX1cIj4tPSR7dGVtcGxhdGVLZXl9LSR7bWFnaWNLZXl9PS08L3NwYW4+YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaHRtbFRlbXBsYXRlO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhckVtdHB5Q29tcG9uZW50KGh0bWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcmVnZXggPSAvLT1bYS16LEEtWiwwLTldKz0tL2c7XG4gICAgcmV0dXJuIGh0bWwucmVwbGFjZShyZWdleCwgXCJcIik7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyID0gYXN5bmMgKGRhdGE/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IFByb21pc2U8SFlQTz4gPT4ge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLmRhdGEgPSB7IC4uLnRoaXMuZGF0YSwgLi4uZGF0YSB9O1xuICAgIH1cbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICB0aGlzLmNvbGxlY3RUZW1wbGF0ZXModGhpcywgXCJyb290XCIsIGZhbHNlKS50ZW1wbGF0ZXNQcm9taXNlc1xuICAgICkudGhlbigoYXJyYXlUZW1wbGF0ZXMpID0+IHtcbiAgICAgIGNvbnN0IG1hcFRlbXBsYXRlcyA9IHRoaXMuY29udmVydEFyclRlbXBsYXRlVG9NYXAoYXJyYXlUZW1wbGF0ZXMpO1xuICAgICAgbGV0IHJvb3RUZW1wbGF0ZUhUTUw6IHN0cmluZyA9XG4gICAgICAgIGFycmF5VGVtcGxhdGVzW2FycmF5VGVtcGxhdGVzLmxlbmd0aCAtIDFdLmh0bWw7XG5cbiAgICAgIGZvciAobGV0IGkgPSBhcnJheVRlbXBsYXRlcy5sZW5ndGggLSAyOyBpID49IDA7IGktLSkge1xuICAgICAgICBsZXQgdGVtcGxhdGUgPVxuICAgICAgICAgIG1hcFRlbXBsYXRlc1tcbiAgICAgICAgICAgIGAke2FycmF5VGVtcGxhdGVzW2ldLnRlbXBsYXRlS2V5fS0ke2FycmF5VGVtcGxhdGVzW2ldLm1hZ2ljS2V5fWBcbiAgICAgICAgICBdO1xuICAgICAgICByb290VGVtcGxhdGVIVE1MID0gdGhpcy5pbnNlcnRUZW1wbGF0ZUludG9UZW1wbGF0ZShcbiAgICAgICAgICByb290VGVtcGxhdGVIVE1MLFxuICAgICAgICAgIGFycmF5VGVtcGxhdGVzW2ldLnRlbXBsYXRlS2V5LFxuICAgICAgICAgIHRlbXBsYXRlLFxuICAgICAgICAgIGFycmF5VGVtcGxhdGVzW2ldLm1hZ2ljS2V5LFxuICAgICAgICAgIGFycmF5VGVtcGxhdGVzW2ldLmlzQXJyYXlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcm9vdFRlbXBsYXRlSFRNTCA9IHRoaXMuY2xlYXJFbXRweUNvbXBvbmVudChyb290VGVtcGxhdGVIVE1MKTtcblxuICAgICAgaWYgKHRoaXMucmVuZGVyVG8pIHtcbiAgICAgICAgdGhpcy5yZW5kZXJUby5pbm5lckhUTUwgPSByb290VGVtcGxhdGVIVE1MO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtoeXBvPVwiJHt0aGlzLm1hZ2ljS2V5fVwiXWApO1xuICAgICAgICBpZiAoZWxlbSkge1xuICAgICAgICAgIHRoaXMucmVuZGVyVG8gPSBlbGVtIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gcm9vdFRlbXBsYXRlSFRNTDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbGJhY2tBcnIuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnRlbXBsYXRlc1Byb21pc2VzID0gW107XG5cbiAgICAgIHJldHVybiB0aGF0O1xuICAgIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgcmVyZW5kZXIoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTdGF0ZSgpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gICAgdGhpcy5zdG9yZSA9IHRoaXMuY3JlYXRlU3RvcmUodGhpcy5kYXRhKTtcbiAgICByZXR1cm4gdGhpcy5zdG9yZTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU3RvcmUoc3RvcmU6IGFueSkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGNvbnN0IGhhbmRsZXI6IFByb3h5SGFuZGxlcjxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4gPSB7XG4gICAgICBnZXQodGFyZ2V0LCBwcm9wZXJ0eSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0WzxzdHJpbmc+cHJvcGVydHldO1xuICAgICAgfSxcbiAgICAgIHNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgICAgICB0YXJnZXRbPHN0cmluZz5wcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICAgICAgdGhhdC5yZXJlbmRlcigpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgfTtcbiAgICBzdG9yZSA9IG5ldyBQcm94eShzdG9yZSwgaGFuZGxlcik7XG5cbiAgICBPYmplY3Qua2V5cyhzdG9yZSkuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygc3RvcmVbZmllbGRdID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHN0b3JlW2ZpZWxkXSA9IG5ldyBQcm94eShzdG9yZVtmaWVsZF0sIGhhbmRsZXIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVN0b3JlKHN0b3JlW2ZpZWxkXSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc3RvcmU7XG4gIH1cblxuICBwcml2YXRlIGdldERhdGFXaXRob3V0SWVyYXJoeShkYXRhOiBhbnkpIHtcbiAgICBsZXQgcGF0aEFycjogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgcmVzdWx0T2JqZWN0OiBhbnkgPSB7fTtcbiAgICBmdW5jdGlvbiBmbnoob2JqOiBhbnkpIHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICAgICAgcGF0aEFyci5wdXNoKGtleSk7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICBmbnoob2JqW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdE9iamVjdFtwYXRoQXJyLmpvaW4oXCIuXCIpXSA9IG9ialtrZXldO1xuICAgICAgICAgIHBhdGhBcnIucG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBhdGhBcnIucG9wKCk7XG4gICAgfVxuICAgIGZueihkYXRhKTtcblxuICAgIHJldHVybiByZXN1bHRPYmplY3Q7XG4gIH1cblxuICBwdWJsaWMgYWZ0ZXJSZW5kZXIoY2FsbGJhY2s6ICgpID0+IHZvaWQpOiBIWVBPIHtcbiAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBoaWRlKCkge1xuICAgIGlmICh0aGlzLnJlbmRlclRvKSB7XG4gICAgICBsZXQgY2hpbGRyZW47XG5cbiAgICAgIGNoaWxkcmVuID0gdGhpcy5yZW5kZXJUby5jaGlsZHJlbjtcbiAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgICAgIGNoaWxkLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJ0eXBlIFF1ZXJ5UGFyYW1zVmFsdWUgPVxuICB8IG51bGxcbiAgfCB1bmRlZmluZWRcbiAgfCBzdHJpbmdcbiAgfCBudW1iZXJcbiAgfCBBcnJheTxzdHJpbmcgfCBudW1iZXI+O1xuXG5jbGFzcyBRdWVyeVV0aWxzIHtcbiAgZ2V0UXVlcnlQYXJhbXNTdHIoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KFwiP1wiKVsxXSB8fCBudWxsO1xuICB9XG5cbiAgZ2V0UXVlcnlQYXJhbXNPYmogPSAoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9PiB7XG4gICAgY29uc3QgZmlsdGVyVXJsU3RyaW5nID0gdGhpcy5nZXRRdWVyeVBhcmFtc1N0cigpO1xuICAgIGlmIChmaWx0ZXJVcmxTdHJpbmcgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdGVyVXJsU3RyaW5nXG4gICAgICAuc3BsaXQoXCImXCIpXG4gICAgICAubWFwKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiBpdGVtLnNwbGl0KFwiPVwiKTtcbiAgICAgIH0pXG4gICAgICAucmVkdWNlKChwcmV2LCBuZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IFtmaWx0ZXJOYW1lLCBmaWx0ZXJWYWx1ZV0gPSBuZXh0O1xuICAgICAgICBjb25zdCBpc0FycmF5VmFsdWUgPSB0aGlzLmNoZWNrU3RyaW5nSXNBcnJheVZhbHVlKGZpbHRlclZhbHVlKTtcblxuICAgICAgICBpZiAoaXNBcnJheVZhbHVlKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4dHJhY3RBcnJheUZyb21TdHJpbmcoZmlsdGVyVmFsdWUpO1xuICAgICAgICAgIHJldHVybiB7IC4uLnByZXYsIC4uLnsgW2ZpbHRlck5hbWVdOiB2YWx1ZSB9IH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyAuLi5wcmV2LCAuLi57IFtmaWx0ZXJOYW1lXTogd2luZG93LmRlY29kZVVSSShmaWx0ZXJWYWx1ZSkgfSB9O1xuICAgICAgfSwge30pO1xuICB9O1xuXG4gIHNldFF1ZXJ5UGFyYW1zU3RyID0gKHBhcmFtczogc3RyaW5nKSA9PiB7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKFxuICAgICAgeyBwYXJhbXM6IHBhcmFtcyB9LFxuICAgICAgXCJcIixcbiAgICAgIGAke3dpbmRvdy5sb2NhdGlvbi5oYXNoLnNwbGl0KFwiP1wiKVswXX0ke3BhcmFtcyA/IFwiP1wiIDogXCJcIn0ke3BhcmFtc31gXG4gICAgKTtcbiAgfTtcblxuICBzZXRRdWVyeVBhcmFtc09iaiA9IChcbiAgICBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIFF1ZXJ5UGFyYW1zVmFsdWU+LFxuICAgIHJlcGxhY2U/OiBib29sZWFuXG4gICkgPT4ge1xuICAgIGNvbnN0IHF1ZXJ5UGFyYW1zOiBzdHJpbmcgPSB0aGlzLmNvbXBpbGVGaWx0ZXJzKHBhcmFtcyk7XG4gICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShcbiAgICAgICAgbnVsbCxcbiAgICAgICAgXCJcIixcbiAgICAgICAgYCR7d2luZG93LmxvY2F0aW9uLmhhc2guc3BsaXQoXCI/XCIpWzBdfSR7XG4gICAgICAgICAgcXVlcnlQYXJhbXMgPyBcIj9cIiA6IFwiXCJcbiAgICAgICAgfSR7cXVlcnlQYXJhbXN9YFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKFxuICAgICAgICBudWxsLFxuICAgICAgICBcIlwiLFxuICAgICAgICBgJHt3aW5kb3cubG9jYXRpb24uaGFzaC5zcGxpdChcIj9cIilbMF19JHtcbiAgICAgICAgICBxdWVyeVBhcmFtcyA/IFwiP1wiIDogXCJcIlxuICAgICAgICB9JHtxdWVyeVBhcmFtc31gXG4gICAgICApO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGNvbXBpbGVGaWx0ZXJzID0gKFxuICAgIGZpbHRlcnM6IFJlY29yZDxzdHJpbmcsIFF1ZXJ5UGFyYW1zVmFsdWU+XG4gICk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgYXJyYXlGaWx0ZXJzID0gW107XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gZmlsdGVycykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZmlsdGVyc1trZXldKSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IChmaWx0ZXJzW2tleV0gYXMgQXJyYXk8dW5rbm93bj4pLmpvaW4oXCIlXCIpO1xuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGFycmF5RmlsdGVycy5wdXNoKGAke2tleX09WyR7ZW5jb2RlVVJJKGAke3ZhbHVlfWApfV1gKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZpbHRlcnNba2V5XSB8fCBmaWx0ZXJzW2tleV0gPT09IDApIHtcbiAgICAgICAgICBhcnJheUZpbHRlcnMucHVzaChgJHtrZXl9PSR7ZmlsdGVyc1trZXldfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5RmlsdGVycy5qb2luKFwiJlwiKTtcbiAgfTtcblxuICBwcml2YXRlIGNoZWNrU3RyaW5nSXNBcnJheVZhbHVlID0gKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShkZWNvZGVVUkkodmFsdWUpLm1hdGNoKC9eXFxbW1xcZCVdK1xcXSQvZ20pKTtcbiAgfTtcblxuICBwcml2YXRlIGV4dHJhY3RBcnJheUZyb21TdHJpbmcgPSAodmFsdWU6IHN0cmluZyk6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsID0+IHtcbiAgICBjb25zdCByZWdleCA9IC9bXFxkLGEteixBLVos0LAt0Y8s0JAt0K8sXy1dKy9nbTtcbiAgICByZXR1cm4gZGVjb2RlVVJJKHZhbHVlKS5tYXRjaChyZWdleCk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IFF1ZXJ5VXRpbHM7XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uL0hZUE8vSFlQT1wiO1xuXG5jbGFzcyBSb3V0ZSB7XG4gIHByaXZhdGUgX3BhdGhuYW1lOiBzdHJpbmcgPSBcIlwiO1xuICBwcml2YXRlIF9ibG9jaz86IChyZXN1bHQ/OiBhbnkpID0+IEhZUE87XG4gIHByaXZhdGUgX3Byb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgYXN5bmNGTj86ICgpID0+IFByb21pc2U8YW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwYXRobmFtZTogc3RyaW5nLFxuICAgIHZpZXc6ICgpID0+IEhZUE8sXG4gICAgcHJvcHM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICAgIGFzeW5jRk4/OiAoKSA9PiBQcm9taXNlPGFueT5cbiAgKSB7XG4gICAgdGhpcy5fcGF0aG5hbWUgPSBwYXRobmFtZS5zcGxpdChcIj9cIilbMF07XG4gICAgdGhpcy5fcHJvcHMgPSBwcm9wcztcbiAgICB0aGlzLl9ibG9jayA9IHZpZXc7XG4gICAgdGhpcy5hc3luY0ZOID0gYXN5bmNGTjtcbiAgfVxuXG4gIG5hdmlnYXRlKHBhdGhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tYXRjaChwYXRobmFtZSkpIHtcbiAgICAgIHRoaXMuX3BhdGhuYW1lID0gcGF0aG5hbWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIGxlYXZlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9ibG9jaykge1xuICAgICAgdGhpcy5fYmxvY2soKS5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2gocGF0aG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc0VxdWFsKHBhdGhuYW1lLCB0aGlzLl9wYXRobmFtZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLl9ibG9jaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5hc3luY0ZOKSB7XG4gICAgICB0aGlzLmFzeW5jRk4oKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgdGhpcy5fYmxvY2s/LihyZXN1bHQpLnJlbmRlcigpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2Jsb2NrKCkucmVuZGVyKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICBwcml2YXRlIF9faW5zdGFuY2U6IFJvdXRlciA9IHRoaXM7XG4gIHJvdXRlczogUm91dGVbXSA9IFtdO1xuICBwcml2YXRlIGhpc3Rvcnk6IEhpc3RvcnkgPSB3aW5kb3cuaGlzdG9yeTtcbiAgcHJpdmF0ZSBfY3VycmVudFJvdXRlOiBSb3V0ZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9yb290UXVlcnk6IHN0cmluZyA9IFwiXCI7XG5cbiAgY29uc3RydWN0b3Iocm9vdFF1ZXJ5OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5fX2luc3RhbmNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2luc3RhbmNlO1xuICAgIH1cbiAgICB0aGlzLl9yb290UXVlcnkgPSByb290UXVlcnkuc3BsaXQoXCI/XCIpWzBdO1xuICB9XG5cbiAgdXNlKFxuICAgIHBhdGhuYW1lOiBzdHJpbmcsXG4gICAgYmxvY2s6IChyZXN1bHQ/OiBhbnkpID0+IEhZUE8sXG4gICAgYXN5bmNGTj86ICgpID0+IFByb21pc2U8YW55PlxuICApOiBSb3V0ZXIge1xuICAgIGNvbnN0IHJvdXRlID0gbmV3IFJvdXRlKFxuICAgICAgcGF0aG5hbWUsXG4gICAgICBibG9jayxcbiAgICAgIHsgcm9vdFF1ZXJ5OiB0aGlzLl9yb290UXVlcnkgfSxcbiAgICAgIGFzeW5jRk5cbiAgICApO1xuICAgIHRoaXMucm91dGVzLnB1c2gocm91dGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RhcnQoKTogUm91dGVyIHtcbiAgICB3aW5kb3cub25wb3BzdGF0ZSA9IChfOiBQb3BTdGF0ZUV2ZW50KSA9PiB7XG4gICAgICBsZXQgbWFzayA9IG5ldyBSZWdFeHAoXCIjXCIsIFwiZ1wiKTtcbiAgICAgIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UobWFzaywgXCJcIik7XG4gICAgICB0aGlzLl9vblJvdXRlKHVybCk7XG4gICAgfTtcbiAgICBsZXQgbWFzayA9IG5ldyBSZWdFeHAoXCIjXCIsIFwiZ1wiKTtcbiAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKG1hc2ssIFwiXCIpIHx8IFwiL1wiO1xuICAgIHRoaXMuX29uUm91dGUodXJsKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9vblJvdXRlKHBhdGhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCByb3V0ZSA9IHRoaXMuZ2V0Um91dGUocGF0aG5hbWUpO1xuICAgIGlmICghcm91dGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2N1cnJlbnRSb3V0ZSkge1xuICAgICAgdGhpcy5fY3VycmVudFJvdXRlLmxlYXZlKCk7XG4gICAgfVxuICAgIHRoaXMuX2N1cnJlbnRSb3V0ZSA9IHJvdXRlO1xuICAgIHRoaXMuX2N1cnJlbnRSb3V0ZS5yZW5kZXIoKTtcbiAgfVxuXG4gIGdvKHBhdGhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmhpc3RvcnkucHVzaFN0YXRlKHt9LCBcIlwiLCBgIyR7cGF0aG5hbWV9YCk7XG4gICAgdGhpcy5fb25Sb3V0ZShwYXRobmFtZSk7XG4gIH1cblxuICBiYWNrKCk6IHZvaWQge1xuICAgIHRoaXMuaGlzdG9yeS5iYWNrKCk7XG4gIH1cblxuICBmb3J3YXJkKCk6IHZvaWQge1xuICAgIHRoaXMuaGlzdG9yeS5mb3J3YXJkKCk7XG4gIH1cblxuICBnZXRSb3V0ZShwYXRobmFtZTogc3RyaW5nKTogUm91dGUgfCB1bmRlZmluZWQge1xuICAgIHBhdGhuYW1lID0gcGF0aG5hbWUuc3BsaXQoXCI/XCIpWzBdO1xuICAgIHJldHVybiB0aGlzLnJvdXRlcy5maW5kKChyb3V0ZSkgPT4gcm91dGUubWF0Y2gocGF0aG5hbWUpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0VxdWFsKGxoczogdW5rbm93biwgcmhzOiB1bmtub3duKSB7XG4gIHJldHVybiBsaHMgPT09IHJocztcbn1cbiIsImltcG9ydCB7IGluaXRTdG9yZSB9IGZyb20gXCIuLi8uLi9TdG9yZVwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi9IWVBPL0hZUE9cIjtcblxubGV0IG9iajogYW55ID0ge307XG5jb25zdCBtYXAgPSBuZXcgTWFwPFJlY29yZDxzdHJpbmcsIGFueT4sIEhZUE8+KCk7XG5cbmNsYXNzIF9TdG9yZSB7XG4gIHB1YmxpYyBzdG9yZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHN0b3JlOiBhbnkpIHtcbiAgICB0aGlzLnN0b3JlID0gbmV3IFByb3h5PGFueT4oc3RvcmUsIHtcbiAgICAgIGdldDogKHRhcmdldDogYW55LCBwOiBzdHJpbmcgfCBudW1iZXIgfCBzeW1ib2wsIHJlY2VpdmVyOiBhbnkpID0+IHtcbiAgICAgICAgb2JqW3BdID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRhcmdldFtwXTtcbiAgICAgIH0sXG4gICAgICBzZXQ6ICh0YXJnZXQ6IGFueSwgcDogc3RyaW5nLCB2YWx1ZTogYW55LCByZWNlaXZlcjogYW55KTogYm9vbGVhbiA9PiB7XG4gICAgICAgIHRhcmdldFtwXSA9IHZhbHVlO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIG1hcC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICBpZiAoaXRlbVswXVtwXSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBpdGVtWzFdLmdldFN0YXRlKCk7XG4gICAgICAgICAgICBpdGVtWzFdLnJlbmRlcih0YXJnZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmVyPFQ+KGNvbXBvbmVudDogKHByb3BzOiBUKSA9PiBIWVBPKSB7XG4gIHJldHVybiAocHJvcHM6IFQpID0+IHtcbiAgICBjb25zdCBfcmVzID0gY29tcG9uZW50KHByb3BzKTtcbiAgICBjb25zdCBzdGF0ZSA9IF9yZXMuZ2V0U3RhdGUoKTtcbiAgICBtYXAuc2V0KG9iaiwgX3Jlcyk7XG4gICAgb2JqID0ge307XG4gICAgcmV0dXJuIF9yZXM7XG4gIH07XG59XG5cbmNvbnN0IFN0b3JlID0gbmV3IF9TdG9yZShpbml0U3RvcmUpO1xuXG5leHBvcnQgZGVmYXVsdCBTdG9yZTtcbiIsImNvbnN0IE1FVEhPRFMgPSB7XG4gIEdFVDogXCJHRVRcIixcbiAgUFVUOiBcIlBVVFwiLFxuICBQT1NUOiBcIlBPU1RcIixcbiAgREVMRVRFOiBcIkRFTEVURVwiLFxufTtcblxuY29uc3QgRE9NRU4gPSBcImh0dHBzOi8veWEtcHJha3Rpa3VtLnRlY2gvYXBpL3YyXCI7XG5cbmNsYXNzIEhUVFBUcmFuc3BvcnRDbGFzcyB7XG4gIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGhlYWRlcnM6IHt9LFxuICAgIGRhdGE6IHt9LFxuICB9O1xuXG4gIEdFVCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHRoaXMuZGVmYXVsdE9wdGlvbnNcbiAgKSA9PiB7XG4gICAgY29uc3QgcmVxdWVzdFBhcmFtcyA9IHF1ZXJ5U3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgdXJsICs9IHJlcXVlc3RQYXJhbXM7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcbiAgICAgIHVybCxcbiAgICAgIHsgLi4ub3B0aW9ucywgbWV0aG9kOiBNRVRIT0RTLkdFVCB9LFxuICAgICAgTnVtYmVyKG9wdGlvbnMudGltZW91dCkgfHwgNTAwMFxuICAgICk7XG4gIH07XG5cbiAgUFVUID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9ID0gdGhpcy5kZWZhdWx0T3B0aW9uc1xuICApID0+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFxuICAgICAgdXJsLFxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuUFVUIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcblxuICBQT1NUID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyPiB9ID0gdGhpc1xuICAgICAgLmRlZmF1bHRPcHRpb25zXG4gICkgPT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXG4gICAgICB1cmwsXG4gICAgICB7IC4uLm9wdGlvbnMsIG1ldGhvZDogTUVUSE9EUy5QT1NUIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcblxuICBERUxFVEUgPSAoXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB0aGlzLmRlZmF1bHRPcHRpb25zXG4gICkgPT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXG4gICAgICB1cmwsXG4gICAgICB7IC4uLm9wdGlvbnMsIG1ldGhvZDogTUVUSE9EUy5ERUxFVEUgfSxcbiAgICAgIE51bWJlcihvcHRpb25zLnRpbWVvdXQpIHx8IDUwMDBcbiAgICApO1xuICB9O1xuXG4gIHNvY2tldCA9ICh1cmw6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBuZXcgV2ViU29ja2V0KHVybCk7XG4gIH07XG5cbiAgcmVxdWVzdCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSB8IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgdGltZW91dDogbnVtYmVyID0gNTAwMFxuICApID0+IHtcbiAgICB1cmwgPSBET01FTiArIHVybDtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgeGhyLm9wZW4oPHN0cmluZz5vcHRpb25zLm1ldGhvZCwgdXJsKTtcbiAgICAgIGNvbnN0IGhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnM7XG4gICAgICBmb3IgKGxldCBoZWFkZXIgaW4gaGVhZGVycyBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaGVhZGVyc1toZWFkZXIgYXMga2V5b2YgdHlwZW9mIGhlYWRlcnNdIGFzIHN0cmluZztcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICByZXNvbHZlKHhocik7XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSAoZSkgPT4ge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9O1xuICAgICAgeGhyLm9uYWJvcnQgPSAoZSkgPT4ge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9O1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgfSwgdGltZW91dCk7XG5cbiAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSkpO1xuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBxdWVyeVN0cmluZ2lmeShkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gIGxldCByZXF1ZXN0UGFyYW1zID0gXCI/XCI7XG4gIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAgcmVxdWVzdFBhcmFtcyArPSBgJHtrZXl9PSR7ZGF0YVtrZXldfSZgO1xuICB9XG4gIHJlcXVlc3RQYXJhbXMgPSByZXF1ZXN0UGFyYW1zLnN1YnN0cmluZygwLCByZXF1ZXN0UGFyYW1zLmxlbmd0aCAtIDEpO1xuICByZXR1cm4gcmVxdWVzdFBhcmFtcztcbn1cblxuZXhwb3J0IGNvbnN0IEhUVFBUcmFuc3BvcnQgPSAoKCk6IHsgZ2V0SW5zdGFuY2U6ICgpID0+IEhUVFBUcmFuc3BvcnRDbGFzcyB9ID0+IHtcbiAgbGV0IGluc3RhbmNlOiBIVFRQVHJhbnNwb3J0Q2xhc3M7XG4gIHJldHVybiB7XG4gICAgZ2V0SW5zdGFuY2U6ICgpID0+IGluc3RhbmNlIHx8IChpbnN0YW5jZSA9IG5ldyBIVFRQVHJhbnNwb3J0Q2xhc3MoKSksXG4gIH07XG59KSgpO1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi9IWVBPXCI7XG5cbmV4cG9ydCBjb25zdCBFbWFpbFZhbGlkYXRvciA9IHtcbiAgdmFsdWU6IFwiXCIsXG4gIGNoZWNrRnVuYzogZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB2YXIgcmVnID0gL14oW0EtWmEtejAtOV9cXC1cXC5dKStcXEAoW0EtWmEtejAtOV9cXC1cXC5dKStcXC4oW0EtWmEtel17Miw0fSkkLztcbiAgICBpZiAoIXJlZy50ZXN0KHZhbHVlKSkge1xuICAgICAgdGhpcy52YWx1ZSA9IFwiXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgY2FsbGJhY2s6IChlbGVtOiBIWVBPLCBjaGVja1Jlc3VsdDogYm9vbGVhbikgPT4ge1xuICAgIGxldCBzdGF0ZSA9IGVsZW0uZ2V0U3RhdGUoKTtcbiAgICBpZiAoIWNoZWNrUmVzdWx0KSB7XG4gICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0Y3RgtC+INC90LUg0L/QvtGF0L7QttC1INC90LAg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YtcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgfVxuICB9LFxufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vSFlQT1wiO1xuXG5leHBvcnQgY29uc3QgUmVxdWlyZWQgPSB7XG4gIHZhbHVlOiBcIlwiLFxuICBjaGVja0Z1bmM6IGZ1bmN0aW9uICh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHZhbHVlID09PSBcIlwiKSB7XG4gICAgICB0aGlzLnZhbHVlID0gXCJcIjtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBjYWxsYmFjazogKGVsZW06IEhZUE8sIGNoZWNrUmVzdWx0OiBib29sZWFuKSA9PiB7XG4gICAgbGV0IHN0YXRlID0gZWxlbS5nZXRTdGF0ZSgpO1xuICAgIGlmICghY2hlY2tSZXN1bHQpIHtcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgfVxuICB9LFxufTsiLCJleHBvcnQgZnVuY3Rpb24gdXVpZHY0KCkge1xuICByZXR1cm4gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgdmFyIHIgPSAoTWF0aC5yYW5kb20oKSAqIDE2KSB8IDAsXG4gICAgICB2ID0gYyA9PSBcInhcIiA/IHIgOiAociAmIDB4MykgfCAweDg7XG4gICAgcmV0dXJuIGAke3YudG9TdHJpbmcoMTYpfWA7XG4gIH0pO1xufSIsImltcG9ydCB7IExvZ2luTGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvTG9naW5cIjtcbmltcG9ydCB7IENoYXRMYXlvdXQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9DaGF0XCI7XG5pbXBvcnQgeyBSZWdpc3RyYXRpb25MYXlvdXQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9SZWdpc3RyYXRpb25cIjtcbmltcG9ydCB7IFByb2ZpbGVMYXlvdXQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9Qcm9maWxlXCI7XG5pbXBvcnQgeyBDaGFuZ2VQcm9maWxlIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvQ2hhbmdlUHJvZmlsZVwiO1xuaW1wb3J0IHsgQ2hhbmdlUGFzc3dvcmQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9DaGFuZ2VQYXNzd29yZFwiO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIi4uL2xpYnMvUm91dGVyXCI7XG5pbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uL2xpYnMvVHJhbnNwb3J0XCI7XG5pbXBvcnQgeyBJQ2hhdFZpZXdNb2RlbCB9IGZyb20gXCIuLi9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi9WaWV3TW9kZWxcIjtcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xuaW1wb3J0IHsgSVVzZXJWaWV3TW9kZWwgfSBmcm9tIFwiLi4vVmlld01vZGVsL1VzZXJWaWV3TW9kZWxcIjtcblxuZXhwb3J0IGNvbnN0IEFwcEluaXQgPSAoY29udGFpbmVyOiBDb250YWluZXIpOiBSb3V0ZXIgPT4ge1xuICByZXR1cm4gbmV3IFJvdXRlcihcIiNyb290XCIpXG4gICAgLnVzZShcIi9cIiwgTG9naW5MYXlvdXQsICgpID0+IHtcbiAgICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgICAgLkdFVChcIi9hdXRoL3VzZXJcIilcbiAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh1c2VyLnJlc3BvbnNlKTtcbiAgICAgICAgfSk7XG4gICAgfSlcbiAgICAudXNlKFwiL3JlZ2lzdHJhdGlvblwiLCBSZWdpc3RyYXRpb25MYXlvdXQpXG4gICAgLnVzZShcIi9jaGF0XCIsIENoYXRMYXlvdXQsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGNoYXRWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElDaGF0Vmlld01vZGVsPihWSUVXX01PREVMLkNIQVQpO1xuICAgICAgYXdhaXQgY2hhdFZpZXdNb2RlbC5nZXRDaGF0cygpO1xuICAgICAgcmV0dXJuIGNoYXRWaWV3TW9kZWwuY2hhdHM7XG4gICAgfSlcbiAgICAudXNlKFwiL3Byb2ZpbGVcIiwgUHJvZmlsZUxheW91dCwgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlclZpZXdNb2RlbCA9IGNvbnRhaW5lci5nZXQ8SVVzZXJWaWV3TW9kZWw+KFZJRVdfTU9ERUwuVVNFUik7XG4gICAgICBhd2FpdCB1c2VyVmlld01vZGVsLmdldFVzZXIoKTtcbiAgICAgIHJldHVybiB1c2VyVmlld01vZGVsLnVzZXI7XG4gICAgfSlcbiAgICAudXNlKFwiL2VkaXRwcm9maWxlXCIsIENoYW5nZVByb2ZpbGUsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElVc2VyVmlld01vZGVsPihWSUVXX01PREVMLlVTRVIpO1xuICAgICAgYXdhaXQgdXNlclZpZXdNb2RlbC5nZXRVc2VyKCk7XG4gICAgICByZXR1cm4gdXNlclZpZXdNb2RlbC51c2VyO1xuICAgIH0pXG4gICAgLnVzZShcIi9lZGl0cGFzc3dvcmRcIiwgQ2hhbmdlUGFzc3dvcmQpXG4gICAgLnN0YXJ0KCk7XG59O1xuIiwiY29uc3QgQ2FjaGUgPSBuZXcgTWFwKCk7XG5leHBvcnQgZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAoXG4gICAgdHlwZW9mIGZ1bmMgIT0gXCJmdW5jdGlvblwiIHx8XG4gICAgKHJlc29sdmVyICE9IG51bGwgJiYgdHlwZW9mIHJlc29sdmVyICE9IFwiZnVuY3Rpb25cIilcbiAgKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgY2FjaGUgPSBtZW1vaXplZC5jYWNoZTtcblxuICAgIGlmIChjYWNoZS5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgbWVtb2l6ZWQuY2FjaGUgPSBDYWNoZTtcbiAgcmV0dXJuIG1lbW9pemVkO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==