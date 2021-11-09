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
const ChatItem = (props) => {
    const key = `key-${props.id}`;
    const { increment } = __1.container.get(ViewModel_1.VIEW_MODEL.CHAT);
    return new HYPO_1.HYPO({
        templatePath: 'chatItem.template.html',
        data: {
            ChatName: props.title,
            lastTime: props.created_by || '10:22',
            lastMessage: props.id || 'Hi, how are you?',
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
            messages: Messages_1.Messages({ chatId: 0, message: '' }),
        },
    }).afterRender(() => {
        var _a;
        (_a = document.getElementById(key)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            const queryUtils = new QueryParams_1.default();
            queryUtils.setQueryParamsObj({ chat: props.id });
            increment();
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
    let ChatName = '';
    return new HYPO_1.HYPO({
        templatePath: 'createchatmodal.template.html',
        data: {},
        children: {
            input: Input_1.Input({
                label: 'Chat name',
                type: 'text',
                name: 'chatname',
                id: 'chatname',
                className: 'c-c-modal__input',
                ChildAttention: attentionMessage,
                onBlur: (e) => {
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        state.message = '';
                        ChatName = input.value;
                    }
                    else {
                        state.message = '⛔ обязательное поле';
                    }
                },
            }),
            create: Button_1.Button({
                title: 'Создать',
                className: 'create-button',
                onClick: (e) => {
                    if (!ChatName) {
                        state.message = '⛔ обязательное поле';
                    }
                    else {
                        const chatViewModel = __1.container.get(ViewModel_1.VIEW_MODEL.CHAT);
                        chatViewModel.saveChat({ title: ChatName }).then(() => {
                            document
                                .getElementsByClassName('c-c-modal')[0]
                                .classList.add('hidden');
                            Chat_1.ChatLayout(chatViewModel.chats).render();
                        });
                    }
                },
            }),
            cancel: Button_1.Button({
                title: 'Отмена',
                className: 'cancel-button',
                onClick: (e) => {
                    document
                        .getElementsByClassName('c-c-modal')[0]
                        .classList.add('hidden');
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MenuButton = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const ListItem_1 = __webpack_require__(/*! ../ListItem */ "./src/UI/Components/ListItem/index.ts");
const menulist = ['Удалить чат', 'Подробности', 'Settings'];
const MenuButton = ({ menuId }) => {
    const Menu = new HYPO_1.HYPO({
        templatePath: 'menubutton.template.html',
        data: { class: 'hide', menuId: menuId },
        children: {
            list: menulist
                .map((text) => {
                return ListItem_1.ListItem({
                    text: text,
                    onClick: () => { },
                });
            })
                .reverse(),
        },
    }).afterRender(() => {
        const elem = document.getElementById(menuId);
        elem === null || elem === void 0 ? void 0 : elem.addEventListener('click', () => {
            const state = Menu.getState();
            const menuList = document.querySelector('.menu .menuList');
            const isHide = Array.from((menuList === null || menuList === void 0 ? void 0 : menuList.classList) || []).includes('hide');
            if (isHide) {
                state.class = 'show';
            }
            else {
                state.class = 'hide';
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Messages = void 0;
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Store_1 = __webpack_require__(/*! ../../../libs/Store */ "./src/libs/Store/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../../../ViewModel */ "./src/ViewModel/index.ts");
exports.Messages = Store_1.observer(({ chatId, message }) => {
    const { counter, increment } = __1.container.get(ViewModel_1.VIEW_MODEL.CHAT);
    return new HYPO_1.HYPO({
        templatePath: 'messages.template.html',
        data: {
            messages: message,
            counter,
        },
    }).afterRender(() => {
        var _a;
        (_a = document.getElementById('buttones')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            increment();
        });
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
const MenuButton_1 = __webpack_require__(/*! ../../Components/MenuButton */ "./src/UI/Components/MenuButton/index.ts");
const Store_1 = __webpack_require__(/*! ../../../libs/Store */ "./src/libs/Store/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../../../ViewModel */ "./src/ViewModel/index.ts");
const Messages_1 = __webpack_require__(/*! ../../Components/Messages */ "./src/UI/Components/Messages/index.ts");
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
    const { counter, arr, push, increment } = __1.container.get(ViewModel_1.VIEW_MODEL.CHAT);
    const { pushMessage, messages } = __1.container.get(ViewModel_1.VIEW_MODEL.MESSAGES);
    messages[0];
    return new HYPO_1.HYPO({
        renderTo: document.getElementById('root') || document.body,
        templatePath: 'chat.template.html',
        data: { counter, messages: JSON.stringify(arr) },
        children: {
            ProfileLink: Button_1.Button({
                title: 'Profile',
                className: 'profile-link__button',
                onClick: (e) => {
                    __1.router.go('/profile');
                },
            }),
            'menu-button': MenuButton_1.MenuButton({ menuId: 'chatMenu' }),
            chatItem: ChatItemList,
            createChatModal: CreateChatModal_1.CreateChatModal(),
            createChatButton: Button_1.Button({
                title: '+',
                className: 'navigation__createChatButton',
                onClick: () => {
                    document
                        .getElementsByClassName('c-c-modal')[0]
                        .classList.remove('hidden');
                },
            }),
            messages: arr.map((message) => {
                return Messages_1.Messages({ chatId: 1, message: message });
            }),
        },
    }).afterRender(() => {
        document
            .getElementsByClassName('controls__send')[0]
            .addEventListener('click', () => {
            // Store.store.messages = [...Store.store.messages, 'New message'];
            // increment();
            push();
        });
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
const Input_1 = __webpack_require__(/*! ../../Components/Input */ "./src/UI/Components/Input/index.ts");
// import { Validator, Rule } from "../../libs/Validator";
const Email_1 = __webpack_require__(/*! ../../../libs/Validators/Email */ "./src/libs/Validators/Email/index.ts");
const Required_1 = __webpack_require__(/*! ../../../libs/Validators/Required */ "./src/libs/Validators/Required/index.ts");
const AttentionMessage_1 = __webpack_require__(/*! ../../Components/AttentionMessage */ "./src/UI/Components/AttentionMessage/index.ts");
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Transport_1 = __webpack_require__(/*! ../../../libs/Transport */ "./src/libs/Transport/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
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
        renderTo: document.querySelector('#root'),
        templatePath: 'registration.template.html',
        data: {
            formTitle: 'Регистрация',
        },
        children: {
            InputEmail: Input_1.Input({
                label: 'Почта',
                type: 'text',
                name: 'email',
                id: 'form__email__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionEmail,
                onBlur: (e) => {
                    const state = AttentionEmail.getState();
                    const input = e.target;
                    if (Email_1.EmailValidator.checkFunc(input.value)) {
                        FormData['email'] = input.value;
                        state.message = '';
                    }
                    else {
                        state.message = '⛔ это не похоже на адрес электронной почты';
                    }
                },
            }),
            InputLogin: Input_1.Input({
                label: 'Логин',
                type: 'text',
                name: 'login',
                id: 'form__login__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionLogin,
                onBlur: (e) => {
                    const state = AttentionLogin.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData['login'] = input.value;
                        state.message = '';
                    }
                    else {
                        state.message = '⛔ обязательное поле';
                    }
                },
            }),
            FirstName: Input_1.Input({
                label: 'Имя',
                type: 'text',
                name: 'first_name',
                id: 'form__first_name__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionFirstName,
                onBlur: (e) => {
                    const state = AttentionFirstName.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData['first_name'] = input.value;
                        state.message = '';
                    }
                    else {
                        state.message = '⛔ обязательное поле';
                    }
                },
            }),
            SecondName: Input_1.Input({
                label: 'Фамилия',
                type: 'text',
                name: 'second_name',
                id: 'form__second_name__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionSecondName,
                onBlur: (e) => {
                    const state = AttentionSecondName.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData['second_name'] = input.value;
                        state.message = '';
                    }
                    else {
                        state.message = '⛔ обязательное поле';
                    }
                },
            }),
            Phone: Input_1.Input({
                label: 'Телефон',
                type: 'text',
                name: 'phone',
                id: 'form__phone__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionPhone,
                onBlur: (e) => {
                    const state = AttentionPhone.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData['phone'] = input.value;
                        state.message = '';
                    }
                    else {
                        state.message = '⛔ обязательное поле';
                    }
                },
            }),
            Password: Input_1.Input({
                label: 'Пароль',
                type: 'password',
                name: 'password',
                id: 'form__password__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionPassword,
                onBlur: (e) => {
                    const input = e.target;
                    const state = AttentionPassword.getState();
                    const stateD = AttentionPasswordDouble.getState();
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData['password'] = input.value;
                        state.message = '';
                        if (FormData['password'] !== FormData['doublepassword']) {
                            stateD.message = '🔥пароли не совпадают';
                        }
                    }
                    else {
                        state.message = '⛔ обязательное поле';
                    }
                },
            }),
            PasswordDouble: Input_1.Input({
                label: 'Пароль',
                type: 'password',
                name: 'doublepassword',
                id: 'form__doublepassword__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionPasswordDouble,
                onBlur: (e) => {
                    const input = e.target;
                    const state = AttentionPasswordDouble.getState();
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData['doublepassword'] = input.value;
                        state.message = '';
                        if (FormData['password'] !== FormData['doublepassword']) {
                            state.message = '🔥пароли не совпадают';
                        }
                    }
                    else {
                        state.message = '⛔ обязательное поле';
                    }
                },
            }),
            RegButton: Button_1.Button({
                title: 'Зарегистрироваться',
                className: 'form-button',
                onClick: (e) => {
                    if (Object.keys(FormData).length == 0 ||
                        Object.keys(FormData).find((item) => {
                            return FormData[item] === '';
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
                            'Content-type': 'application/json',
                        },
                    };
                    Transport_1.HTTPTransport.getInstance()
                        .POST('/auth/signup', data)
                        .then(() => {
                        __1.router.go('/chat');
                    });
                },
            }),
            LoginLink: Button_1.Button({
                title: 'Войти',
                className: 'form-link',
                onClick: (e) => {
                    __1.router.go('/');
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
exports.ChatViewModel = void 0;
const Store_1 = __webpack_require__(/*! ../../libs/Store */ "./src/libs/Store/index.ts");
class ChatViewModel {
    constructor(service) {
        this.service = service;
        this.chats = [];
        this.counter = 0;
        this.arr = ['hello'];
        this.push = () => {
            this.arr = [...this.arr, 'hel'];
        };
        this.increment = () => {
            this.counter++;
        };
        this.decriment = () => {
            this.counter--;
        };
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
        Store_1.makeObservable(this, {
            chats: Store_1.observable,
            counter: Store_1.observable,
            arr: Store_1.observable,
        });
    }
}
exports.ChatViewModel = ChatViewModel;


/***/ }),

/***/ "./src/ViewModel/MessageViewModel/index.ts":
/*!*************************************************!*\
  !*** ./src/ViewModel/MessageViewModel/index.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageViewModel = void 0;
const Store_1 = __webpack_require__(/*! ../../libs/Store */ "./src/libs/Store/index.ts");
class MessageViewModel {
    constructor() {
        this.messages = ['hello world'];
        this.pushMessage = (m) => {
            this.messages = [...this.messages, m];
        };
        Store_1.makeObservable(this, {
            messages: Store_1.observable,
        });
    }
}
exports.MessageViewModel = MessageViewModel;


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
const MessageViewModel_1 = __webpack_require__(/*! ./MessageViewModel */ "./src/ViewModel/MessageViewModel/index.ts");
const UserViewModel_1 = __webpack_require__(/*! ./UserViewModel */ "./src/ViewModel/UserViewModel/index.ts");
exports.VIEW_MODEL = {
    CHAT: Symbol.for('ChatViewModel'),
    USER: Symbol.for('UserViewModel'),
    MESSAGES: Symbol.for('MessagesViewModel'),
};
exports.ViewModelContainer = new Container_1.Container();
exports.ViewModelContainer.bind(exports.VIEW_MODEL.CHAT)
    .toDynamicValue((container) => {
    const service = container.get(BussinesLayer_1.SERVICE.CHAT);
    return new ChatViewModel_1.ChatViewModel(service);
})
    .inSingletoneScope();
exports.ViewModelContainer.bind(exports.VIEW_MODEL.USER)
    .toDynamicValue((container) => {
    const service = container.get(BussinesLayer_1.SERVICE.USER);
    return new UserViewModel_1.UserViewModel(service);
})
    .inSingletoneScope();
exports.ViewModelContainer.bind(exports.VIEW_MODEL.MESSAGES)
    .toDynamicValue((container) => {
    return new MessageViewModel_1.MessageViewModel();
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
                            throw new Error('file do not download');
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
        this.setHypoID = (html, magicKey) => {
            var _a;
            const reg = new RegExp(/^[]|<[a-z,A-Z]+/, 'gm');
            const parentTag = (_a = reg.exec(html)) === null || _a === void 0 ? void 0 : _a[0];
            if (parentTag) {
                html = html.replace(parentTag, `${parentTag} hypo=${magicKey}`);
            }
            return html;
        };
        this.render = (data) => __awaiter(this, void 0, void 0, function* () {
            if (data) {
                this.data = Object.assign(Object.assign({}, this.data), data);
            }
            const that = this;
            return Promise.all(this.collectTemplates(this, 'root', false).templatesPromises).then((arrayTemplates) => {
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
            if (typeof data[key] !== 'object' || data[key] === null) {
                const mask = new RegExp('{{' + key + '}}', 'g');
                htmlTemplate = htmlTemplate.replace(mask, String(data[key]));
            }
        }
        const mask = new RegExp(/{{[a-z._]+}}/g);
        htmlTemplate = htmlTemplate.replace(mask, '');
        return htmlTemplate;
    }
    convertArrTemplateToMap(templateArr) {
        const result = {};
        templateArr.forEach((item) => {
            const hypoHTML = this.setHypoID(item.html, item.magicKey);
            if (result[item.templateKey]) {
                result[item.templateKey] += `${hypoHTML}`;
            }
            else {
                result[`${item.templateKey}-${item.magicKey}`] = hypoHTML;
            }
        });
        return result;
    }
    insertTemplateIntoTemplate(rootTemplateHTML, templateKey, childTemplateHTML, magicKey, isArray) {
        rootTemplateHTML = this.createElemWrapper(rootTemplateHTML, templateKey, magicKey, isArray);
        const mask = new RegExp(`-=${templateKey}-${magicKey}=-`, 'g');
        rootTemplateHTML = rootTemplateHTML.replace(mask, childTemplateHTML);
        return rootTemplateHTML;
    }
    createElemWrapper(htmlTemplate, templateKey, magicKey, isArray) {
        const mask = new RegExp(`-=${templateKey}=-`, 'g');
        if (isArray) {
            htmlTemplate = htmlTemplate.replace(mask, `-=${templateKey}-${magicKey}=--=${templateKey}=-`);
        }
        else {
            htmlTemplate = htmlTemplate.replace(mask, `-=${templateKey}-${magicKey}=-`);
        }
        return htmlTemplate;
    }
    clearEmtpyComponent(html) {
        const regex = /-=[a-z,A-Z,0-9]+=-/g;
        return html.replace(regex, '');
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
            if (typeof store[field] === 'object') {
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
                if (typeof obj[key] === 'object') {
                    fnz(obj[key]);
                }
                else {
                    resultObject[pathArr.join('.')] = obj[key];
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
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.observable = exports.makeObservable = exports.observer = void 0;
let components = {};
const mapComponent = new Map();
class _Store {
    constructor(store) {
        this.store = new Proxy(store, {
            get: (target, prop, receiver) => {
                // components[prop] = true;
                // return target[prop];
            },
            set: (target, prop, value, receiver) => {
                // target[prop] = value;
                // for (let [usableProps, component] of mapComponent.entries()) {
                //   if (usableProps[prop]) {
                //     component.render(target);
                //   }
                // }
                return true;
            },
        });
    }
}
let _component;
let isComponent = false;
const ViewModels = {};
function observer(component) {
    return (props) => {
        isComponent = true;
        _component = component(props);
        receiversArr.forEach((item) => {
            if (ViewModels[item.constructor.name]) {
                ViewModels[item.constructor.name].push(_component);
            }
            else {
                ViewModels[item.constructor.name] = [_component];
            }
        });
        isComponent = false;
        mapComponent.set(components, _component);
        components = {};
        return _component;
    };
}
exports.observer = observer;
const _StoreGlobal = {};
const mapHypoToViewModel = new Map();
const receiversArr = new Set();
function makeObservable(that, state) {
    const entityState = {};
    const name = that.constructor.name;
    const xxx = Object.assign({}, that);
    //@ts-ignore
    const proto = that.__proto__;
    for (let key in that) {
        if (state[key]) {
            if (typeof that[key] === 'object') {
                entityState[key] = new Proxy(xxx[key], {
                    set: (target, prop, value, receiver) => {
                        var _a;
                        debugger;
                        target[prop] = value;
                        (_a = ViewModels === null || ViewModels === void 0 ? void 0 : ViewModels[receiver.constructor.name]) === null || _a === void 0 ? void 0 : _a.forEach((component) => {
                            component.render(target);
                        });
                        return true;
                    },
                    get: (target, prop, receiver) => {
                        if (isComponent)
                            receiversArr.add(receiver);
                        components[prop] = true;
                        return target[prop];
                    },
                });
            }
            else {
                entityState[key] = xxx[key];
            }
            delete that[key];
        }
    }
    const observableValidation = {
        set: (target, prop, value, receiver) => {
            var _a;
            target[prop] = value;
            (_a = ViewModels === null || ViewModels === void 0 ? void 0 : ViewModels[receiver.constructor.name]) === null || _a === void 0 ? void 0 : _a.forEach((component) => {
                component.render(target);
            });
            return true;
        },
        //@ts-ignore
        get: (target, prop, receiver) => {
            if (isComponent)
                receiversArr.add(receiver);
            components[prop] = true;
            // if (target[prop] && typeof target[prop] === 'object') {
            //   target[prop] = new Proxy(target[prop], observableValidation);
            //   return new Proxy(target[prop], observableValidation);
            // }
            return target[prop];
        },
    };
    const proxy = new Proxy(entityState, observableValidation);
    proxy.__proto__ = proto;
    //@ts-ignore
    that.__proto__ = proxy;
    _StoreGlobal[name] = proxy;
}
exports.makeObservable = makeObservable;
exports.observable = true;


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
    value: '',
    checkFunc: function (value) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!reg.test(value)) {
            this.value = '';
            return false;
        }
        this.value = value;
        return true;
    },
    callback: (elem, checkResult) => {
        let state = elem.getState();
        if (!checkResult) {
            state.message = '⛔ это не похоже на адрес электронной почты';
        }
        else {
            state.message = '';
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
    value: '',
    checkFunc: function (value) {
        if (value === '') {
            this.value = '';
            return false;
        }
        this.value = value;
        return true;
    },
    callback: (elem, checkResult) => {
        let state = elem.getState();
        if (!checkResult) {
            state.message = '⛔ обязательное поле';
        }
        else {
            state.message = '';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQm9vdHN0cmFwL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0J1c3NpbmVzTGF5ZXIvQ2hhdFNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQnVzc2luZXNMYXllci9Vc2VyU2VydmljZS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9CdXNzaW5lc0xheWVyL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0luZnJhc3RzcnVjdHVyZUxheWVyL2NvbnRhaW5lci50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbmZyYXN0c3J1Y3R1cmVMYXllci9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvQ2hhdEFQSS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9BdHRlbnRpb25NZXNzYWdlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQnV0dG9uL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW0vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9DcmVhdGVDaGF0TW9kYWwvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9EZWxldGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9FbXB0eS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9Db21wb25lbnRzL0lucHV0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvTGlzdEl0ZW0vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9NZW51QnV0dG9uL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvTWVzc2FnZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9Qcm9maWxlSW5wdXQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvTGF5b3V0cy9DaGFuZ2VQYXNzd29yZC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL0NoYW5nZVByb2ZpbGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvTGF5b3V0cy9DaGF0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvTG9naW4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvTGF5b3V0cy9Qcm9maWxlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvUmVnaXN0cmF0aW9uL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1ZpZXdNb2RlbC9DaGF0Vmlld01vZGVsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1ZpZXdNb2RlbC9NZXNzYWdlVmlld01vZGVsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1ZpZXdNb2RlbC9Vc2VyVmlld01vZGVsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1ZpZXdNb2RlbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL0NvbnRhaW5lci9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL0hZUE8vSFlQTy50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL1F1ZXJ5UGFyYW1zL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvUm91dGVyL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvU3RvcmUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9UcmFuc3BvcnQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9WYWxpZGF0b3JzL0VtYWlsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL3V0aWxzL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL3JvdXRlci9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL21vbWl6ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4L3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxLQUFLO0FBQ0wsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxXQUFXO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLGNBQWM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLGtCQUFrQjtBQUNuRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUEsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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Ozs7Ozs7QUN4Q0Y7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDdEJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gZGVmaW5lKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG4gIHRyeSB7XG4gICAgLy8gSUUgOCBoYXMgYSBicm9rZW4gT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoYXQgb25seSB3b3JrcyBvbiBET00gb2JqZWN0cy5cbiAgICBkZWZpbmUoe30sIFwiXCIpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBkZWZpbmUgPSBmdW5jdGlvbihvYmosIGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IGRlZmluZShcbiAgICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSxcbiAgICB0b1N0cmluZ1RhZ1N5bWJvbCxcbiAgICBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgKTtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBkZWZpbmUocHJvdG90eXBlLCBtZXRob2QsIGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBkZWZpbmUoZ2VuRnVuLCB0b1N0cmluZ1RhZ1N5bWJvbCwgXCJHZW5lcmF0b3JGdW5jdGlvblwiKTtcbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgZXhwb3J0cy5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yLCBQcm9taXNlSW1wbCkge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAvLyBJZiBhIHJlamVjdGVkIFByb21pc2Ugd2FzIHlpZWxkZWQsIHRocm93IHRoZSByZWplY3Rpb24gYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgaGFuZGxlZCB0aGVyZS5cbiAgICAgICAgICByZXR1cm4gaW52b2tlKFwidGhyb3dcIiwgZXJyb3IsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlSW1wbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7XG4gICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSxcbiAgICAgIFByb21pc2VJbXBsXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBkZWZpbmUoR3AsIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvclwiKTtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgRnVuY3Rpb24oXCJyXCIsIFwicmVnZW5lcmF0b3JSdW50aW1lID0gclwiKShydW50aW1lKTtcbn1cbiIsImltcG9ydCB7Q29udGFpbmVyfSBmcm9tICcuLi9saWJzL0NvbnRhaW5lcic7XG5pbXBvcnQge2luZnJhc3RydWN0dXJlQ29udGFpbmVyfSBmcm9tICcuLi9JbmZyYXN0c3J1Y3R1cmVMYXllci9jb250YWluZXInO1xuaW1wb3J0IHtBcGlDbGllbnRDb250YWluZXJ9IGZyb20gJy4uL0ludGVncmF0aW9uYWxMYXllcic7XG5pbXBvcnQge1NlcnZpY2VDb250YWluZXJ9IGZyb20gJy4uL0J1c3NpbmVzTGF5ZXInO1xuaW1wb3J0IHtWaWV3TW9kZWxDb250YWluZXJ9IGZyb20gJy4uL1ZpZXdNb2RlbCc7XG5cbmNvbnN0IENyZWF0ZURJQ29udGFpbmVyID0gKFxuICBpbmZyYXN0cnVjdHVyZUNvbnRhaW5lcjogQ29udGFpbmVyLFxuICBpbnRlZ3JlYXRpb25Db250YWluZXI6IENvbnRhaW5lcixcbiAgc2VydmljZUNvbnRhaW5lcjogQ29udGFpbmVyLFxuICB2aWV3TW9kZWxDb250YWluZXI6IENvbnRhaW5lclxuKSA9PiB7XG4gIHJldHVybiB2aWV3TW9kZWxDb250YWluZXJcbiAgICAucGFyZW50KHNlcnZpY2VDb250YWluZXIpXG4gICAgLnBhcmVudChpbnRlZ3JlYXRpb25Db250YWluZXIpXG4gICAgLnBhcmVudChpbmZyYXN0cnVjdHVyZUNvbnRhaW5lcik7XG59O1xuXG5leHBvcnQgY2xhc3MgQm9vdFN0cmFwIHtcbiAgY29udGFpbmVyOiBDb250YWluZXI7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29udGFpbmVyID0gQ3JlYXRlRElDb250YWluZXIoXG4gICAgICBpbmZyYXN0cnVjdHVyZUNvbnRhaW5lcixcbiAgICAgIEFwaUNsaWVudENvbnRhaW5lcixcbiAgICAgIFNlcnZpY2VDb250YWluZXIsXG4gICAgICBWaWV3TW9kZWxDb250YWluZXJcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJQ2hhdERUTyB9IGZyb20gXCIuLi9VSS9Db21wb25lbnRzL0NoYXRJdGVtXCI7XG5pbXBvcnQgeyBJQ2hhdEFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvQ2hhdEFQSVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDaGF0U2VydmljZSB7XG4gIGdldENoYXRzOiAoKSA9PiBQcm9taXNlPEFycmF5PElDaGF0RFRPPj47XG4gIHNhdmVDaGF0OiAoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4gUHJvbWlzZTx2b2lkPjtcbiAgZGVsZXRlQ2hhdDogKGNoYXRJZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuXG5leHBvcnQgY2xhc3MgQ2hhdFNlcnZpY2UgaW1wbGVtZW50cyBJQ2hhdFNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgQXBpQ2xpZW50OiBJQ2hhdEFQSUNsaWVudCkge31cblxuICBnZXRDaGF0cyA9ICgpOiBQcm9taXNlPEFycmF5PElDaGF0RFRPPj4gPT4ge1xuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5nZXRDaGF0cygpO1xuICB9O1xuXG4gIHNhdmVDaGF0ID0gKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IHtcbiAgICByZXR1cm4gdGhpcy5BcGlDbGllbnQuc2F2ZUNoYXQoZGF0YSk7XG4gIH07XG5cbiAgZGVsZXRlQ2hhdChjaGF0SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5kZWxldGVDaGF0KGNoYXRJZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IElVc2VyQVBJQ2xpZW50IH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllci9Vc2VyQVBJXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL1Byb2ZpbGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJVXNlclNlcnZpY2Uge1xuICBnZXRVc2VyKCk6IFByb21pc2U8SVByb2ZpbGVEVE8+O1xuICBzYXZlVXNlcih1c2VyOklQcm9maWxlRFRPKTpQcm9taXNlPElQcm9maWxlRFRPPjtcbn1cblxuZXhwb3J0IGNsYXNzIFVzZXJTZXJ2aWNlIGltcGxlbWVudHMgSVVzZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIEFwaUNsaWVudDogSVVzZXJBUElDbGllbnQpIHt9XG4gIHNhdmVVc2VyKHVzZXI6SVByb2ZpbGVEVE8pOlByb21pc2U8SVByb2ZpbGVEVE8+e1xuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5zYXZlVXNlcih1c2VyKVxuICB9XG4gIGdldFVzZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuQXBpQ2xpZW50LmdldFVzZXIoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQVBJX0NMSUVOVCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXJcIjtcbmltcG9ydCB7IElDaGF0QVBJQ2xpZW50IH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllci9DaGF0QVBJXCI7XG5pbXBvcnQgeyBJVXNlckFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSVwiO1xuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcIi4uL2xpYnMvQ29udGFpbmVyXCI7XG5pbXBvcnQgeyBDaGF0U2VydmljZSB9IGZyb20gXCIuL0NoYXRTZXJ2aWNlXCI7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gXCIuL1VzZXJTZXJ2aWNlXCI7XG5cbmV4cG9ydCBjb25zdCBTRVJWSUNFID0ge1xuICBDSEFUOiBTeW1ib2wuZm9yKFwiQ2hhdFNlcnZpY2VcIiksXG4gIFVTRVI6IFN5bWJvbC5mb3IoXCJVc2VyU2VydmNpZVwiKSxcbn07XG5cbmV4cG9ydCBjb25zdCBTZXJ2aWNlQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcigpO1xuXG5TZXJ2aWNlQ29udGFpbmVyLmJpbmQoU0VSVklDRS5DSEFUKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gIGNvbnN0IEFQSUNsaWVudCA9IGNvbnRhaW5lci5nZXQ8SUNoYXRBUElDbGllbnQ+KEFQSV9DTElFTlQuQ0hBVCk7XG4gIHJldHVybiBuZXcgQ2hhdFNlcnZpY2UoQVBJQ2xpZW50KTtcbn0pO1xuXG5TZXJ2aWNlQ29udGFpbmVyLmJpbmQoU0VSVklDRS5VU0VSKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gIGNvbnN0IEFQSUNsaWVudCA9IGNvbnRhaW5lci5nZXQ8SVVzZXJBUElDbGllbnQ+KEFQSV9DTElFTlQuVVNFUik7XG4gIHJldHVybiBuZXcgVXNlclNlcnZpY2UoQVBJQ2xpZW50KTtcbn0pO1xuIiwiaW1wb3J0IHtBUElNb2R1bGV9IGZyb20gJy4nO1xuaW1wb3J0IHtDb250YWluZXJ9IGZyb20gJy4uL2xpYnMvQ29udGFpbmVyJztcblxuZXhwb3J0IGNvbnN0IElOVEVHUkFUSU9OX01PRFVMRSA9IHtcbiAgQVBJTW9kdWxlOiBTeW1ib2wuZm9yKCdBUEknKSxcbn07XG5cbmV4cG9ydCBjb25zdCBpbmZyYXN0cnVjdHVyZUNvbnRhaW5lciA9IG5ldyBDb250YWluZXIoKTtcblxuaW5mcmFzdHJ1Y3R1cmVDb250YWluZXJcbiAgLmJpbmQoSU5URUdSQVRJT05fTU9EVUxFLkFQSU1vZHVsZSlcbiAgLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IEFQSU1vZHVsZSgpO1xuICB9KTtcbiIsImltcG9ydCB7SFRUUFRyYW5zcG9ydH0gZnJvbSAnLi4vbGlicy9UcmFuc3BvcnQnO1xuaW1wb3J0IHtJQVBJTW9kdWxlfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgY2xhc3MgQVBJTW9kdWxlIGltcGxlbWVudHMgSUFQSU1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgZ2V0RGF0YSA9IDxQPih1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8UD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgIC5HRVQodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgcG9zdERhdGEgPSBhc3luYyA8UCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KFxuICAgIHVybDogc3RyaW5nLFxuICAgIGRhdGE6IFBcbiAgKTogUHJvbWlzZTxQPiA9PiB7XG4gICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxuICAgICAgLlBPU1QodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgZGVsZXRlRGF0YSA9ICh1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgIC5ERUxFVEUodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgcHV0RGF0YSA9IDxQPih1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8UD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKCkuUFVUKHVybCwgdGhpcy5nZXRQYXJtcyhkYXRhKSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBnZXRQYXJtczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4oXG4gICAgZGF0YTogVFxuICApOiB7W2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPn0ge1xuICAgIHJldHVybiB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICB9LFxuICAgICAgZGF0YToge1xuICAgICAgICAuLi5kYXRhLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBJQVBJTW9kdWxlIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IElDaGF0RFRPIH0gZnJvbSBcIi4uL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ2hhdEFQSUNsaWVudCB7XG4gIGdldENoYXRzKCk6IFByb21pc2U8QXJyYXk8SUNoYXREVE8+PjtcbiAgc2F2ZUNoYXQoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD47XG4gIGRlbGV0ZUNoYXQoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBDaGF0QVBJQ2xpZW50IGltcGxlbWVudHMgSUNoYXRBUElDbGllbnQge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgQVBJTW9kdWxlOiBJQVBJTW9kdWxlKSB7fVxuXG4gIGdldENoYXRzID0gYXN5bmMgKCk6IFByb21pc2U8QXJyYXk8SUNoYXREVE8+PiA9PiB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuQVBJTW9kdWxlLmdldERhdGE8SUNoYXREVE9bXT4oXCIvY2hhdHNcIiwge30pLnRoZW4oXG4gICAgICAocmVzdWx0KSA9PiB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgKTtcbiAgfTtcblxuICBzYXZlQ2hhdCA9IGFzeW5jIChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgYXdhaXQgdGhpcy5BUElNb2R1bGUucG9zdERhdGEoXCIvY2hhdHNcIiwgZGF0YSk7XG4gIH07XG5cbiAgZGVsZXRlQ2hhdChpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuQVBJTW9kdWxlLmRlbGV0ZURhdGEoXCIvY2hhdHNcIiwgeyBjaGF0SWQ6IGlkIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJQVBJTW9kdWxlIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvUHJvZmlsZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyQVBJQ2xpZW50IHtcbiAgZ2V0VXNlcigpOiBQcm9taXNlPElQcm9maWxlRFRPPjtcbiAgc2F2ZVVzZXIodXNlcjogSVByb2ZpbGVEVE8pOiBQcm9taXNlPElQcm9maWxlRFRPPlxufVxuXG5leHBvcnQgY2xhc3MgVXNlckFQSUNsaWVudCBpbXBsZW1lbnRzIElVc2VyQVBJQ2xpZW50IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIEFQSU1vZHVsZTogSUFQSU1vZHVsZSkgeyB9XG5cbiAgZ2V0VXNlciA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgdGhpcy5BUElNb2R1bGUuZ2V0RGF0YTxJUHJvZmlsZURUTz4oXCIvYXV0aC91c2VyXCIsIHt9KTtcbiAgICByZXR1cm4gdXNlcjtcbiAgfTtcblxuICBzYXZlVXNlciA9ICh1c2VyOiBJUHJvZmlsZURUTykgPT4ge1xuICAgIHJldHVybiB0aGlzLkFQSU1vZHVsZS5wdXREYXRhPElQcm9maWxlRFRPPignL3VzZXIvcHJvZmlsZScsIHVzZXIpXG4gIH1cbn1cbiIsImltcG9ydCB7Q29udGFpbmVyfSBmcm9tICcuLi9saWJzL0NvbnRhaW5lcic7XG5pbXBvcnQge0lOVEVHUkFUSU9OX01PRFVMRX0gZnJvbSAnLi4vSW5mcmFzdHNydWN0dXJlTGF5ZXIvY29udGFpbmVyJztcbmltcG9ydCB7Q2hhdEFQSUNsaWVudH0gZnJvbSAnLi9DaGF0QVBJJztcbmltcG9ydCB7SUFQSU1vZHVsZX0gZnJvbSAnLi4vSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW50ZXJmYWNlcyc7XG5pbXBvcnQge1VzZXJBUElDbGllbnR9IGZyb20gJy4vVXNlckFQSSc7XG5cbmV4cG9ydCBjb25zdCBBUElfQ0xJRU5UID0ge1xuICBDSEFUOiBTeW1ib2wuZm9yKCdDaGF0QVBJQ2xpZW50JyksXG4gIFVTRVI6IFN5bWJvbC5mb3IoJ1VzZXJBUElDbGllbnQnKSxcbn07XG5cbmV4cG9ydCBjb25zdCBBcGlDbGllbnRDb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XG5cbkFwaUNsaWVudENvbnRhaW5lci5iaW5kKEFQSV9DTElFTlQuQ0hBVCkudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuICBjb25zdCBBUElNb2R1bGUgPSBjb250YWluZXIuZ2V0PElBUElNb2R1bGU+KElOVEVHUkFUSU9OX01PRFVMRS5BUElNb2R1bGUpO1xuICByZXR1cm4gbmV3IENoYXRBUElDbGllbnQoQVBJTW9kdWxlKTtcbn0pO1xuXG5BcGlDbGllbnRDb250YWluZXIuYmluZChBUElfQ0xJRU5ULlVTRVIpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgY29uc3QgQVBJTW9kdWxlID0gY29udGFpbmVyLmdldDxJQVBJTW9kdWxlPihJTlRFR1JBVElPTl9NT0RVTEUuQVBJTW9kdWxlKTtcbiAgcmV0dXJuIG5ldyBVc2VyQVBJQ2xpZW50KEFQSU1vZHVsZSk7XG59KTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcblxuZXhwb3J0IGNvbnN0IEF0dGVudGlvbk1lc3NhZ2UgPSAoKTogSFlQTyA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImF0dGVudGlvbi50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgbWVzc2FnZTogXCJcIixcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7fSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvdXRpbHNcIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIGlkPzogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICBjbGFzc05hbWU6IHN0cmluZztcbiAgb25DbGljazogKGU6IEV2ZW50KSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY29uc3QgQnV0dG9uID0gKHByb3BzOiBJUHJvcHMpID0+IHtcbiAgY29uc3QgaWQgPSBwcm9wcy5pZCB8fCB1dWlkdjQoKTtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiYnV0dG9uLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBpZDogaWQsXG4gICAgICB0aXRsZTogcHJvcHMudGl0bGUsXG4gICAgICBjbGFzc05hbWU6IHByb3BzLmNsYXNzTmFtZSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgIHByb3BzLm9uQ2xpY2soZSk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7Y29udGFpbmVyfSBmcm9tICcuLi8uLi8uLic7XG5pbXBvcnQge0NoYXRMYXlvdXR9IGZyb20gJy4uLy4uL0xheW91dHMvQ2hhdCc7XG5pbXBvcnQge0hZUE99IGZyb20gJy4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPJztcbmltcG9ydCB7RGVsZXRlfSBmcm9tICcuLi9EZWxldGUnO1xuaW1wb3J0IHtWSUVXX01PREVMfSBmcm9tICcuLi8uLi8uLi9WaWV3TW9kZWwnO1xuaW1wb3J0IHtJQ2hhdFZpZXdNb2RlbH0gZnJvbSAnLi4vLi4vLi4vVmlld01vZGVsL0NoYXRWaWV3TW9kZWwnO1xuaW1wb3J0IFF1ZXJ5VXRpbHMgZnJvbSAnLi4vLi4vLi4vbGlicy9RdWVyeVBhcmFtcyc7XG5pbXBvcnQge01lc3NhZ2VzfSBmcm9tICcuLi9NZXNzYWdlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNoYXREVE8ge1xuICB0aXRsZTogc3RyaW5nO1xuICBhdmF0YXI6IHN0cmluZyB8IG51bGw7XG4gIGNyZWF0ZWRfYnk6IG51bWJlcjtcbiAgaWQ6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElQcm9wcyBleHRlbmRzIElDaGF0RFRPIHtcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgQ2hhdEl0ZW0gPSAocHJvcHM6IElDaGF0RFRPKSA9PiB7XG4gIGNvbnN0IGtleSA9IGBrZXktJHtwcm9wcy5pZH1gO1xuXG4gIGNvbnN0IHtpbmNyZW1lbnR9ID0gY29udGFpbmVyLmdldDxJQ2hhdFZpZXdNb2RlbD4oVklFV19NT0RFTC5DSEFUKTtcblxuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogJ2NoYXRJdGVtLnRlbXBsYXRlLmh0bWwnLFxuICAgIGRhdGE6IHtcbiAgICAgIENoYXROYW1lOiBwcm9wcy50aXRsZSxcbiAgICAgIGxhc3RUaW1lOiBwcm9wcy5jcmVhdGVkX2J5IHx8ICcxMDoyMicsXG4gICAgICBsYXN0TWVzc2FnZTogcHJvcHMuaWQgfHwgJ0hpLCBob3cgYXJlIHlvdT8nLFxuICAgICAgbm90aWZpY2F0aW9uQ291bnQ6IHByb3BzLmF2YXRhciB8fCAzLFxuICAgICAga2V5OiBrZXksXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgZGVsZXRlOiBEZWxldGUoe1xuICAgICAgICBpZDogYGRlbGV0ZUl0ZW0ke3Byb3BzLmlkfWAsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjaGF0Vmlld01vZGVsID0gY29udGFpbmVyLmdldDxJQ2hhdFZpZXdNb2RlbD4oVklFV19NT0RFTC5DSEFUKTtcbiAgICAgICAgICBjaGF0Vmlld01vZGVsLmRlbGV0ZUNoYXQoU3RyaW5nKHByb3BzLmlkKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBDaGF0TGF5b3V0KGNoYXRWaWV3TW9kZWwuY2hhdHMpLnJlbmRlcigpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBtZXNzYWdlczogTWVzc2FnZXMoe2NoYXRJZDogMCwgbWVzc2FnZTogJyd9KSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoa2V5KT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBxdWVyeVV0aWxzID0gbmV3IFF1ZXJ5VXRpbHMoKTtcbiAgICAgIHF1ZXJ5VXRpbHMuc2V0UXVlcnlQYXJhbXNPYmooe2NoYXQ6IHByb3BzLmlkfSk7XG4gICAgICBpbmNyZW1lbnQoKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHtjb250YWluZXJ9IGZyb20gJy4uLy4uLy4uJztcbmltcG9ydCB7SFlQT30gZnJvbSAnLi4vLi4vLi4vbGlicy9IWVBPL0hZUE8nO1xuaW1wb3J0IHtSZXF1aXJlZH0gZnJvbSAnLi4vLi4vLi4vbGlicy9WYWxpZGF0b3JzL1JlcXVpcmVkJztcbmltcG9ydCB7QXR0ZW50aW9uTWVzc2FnZX0gZnJvbSAnLi4vQXR0ZW50aW9uTWVzc2FnZSc7XG5pbXBvcnQge0J1dHRvbn0gZnJvbSAnLi4vQnV0dG9uJztcbmltcG9ydCB7SW5wdXR9IGZyb20gJy4uL0lucHV0JztcbmltcG9ydCB7SUNoYXRWaWV3TW9kZWx9IGZyb20gJy4uLy4uLy4uL1ZpZXdNb2RlbC9DaGF0Vmlld01vZGVsJztcbmltcG9ydCB7Q2hhdExheW91dH0gZnJvbSAnLi4vLi4vTGF5b3V0cy9DaGF0JztcbmltcG9ydCB7VklFV19NT0RFTH0gZnJvbSAnLi4vLi4vLi4vVmlld01vZGVsJztcblxuZXhwb3J0IGNvbnN0IENyZWF0ZUNoYXRNb2RhbCA9ICgpID0+IHtcbiAgY29uc3QgYXR0ZW50aW9uTWVzc2FnZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3Qgc3RhdGUgPSBhdHRlbnRpb25NZXNzYWdlLmdldFN0YXRlKCk7XG5cbiAgbGV0IENoYXROYW1lID0gJyc7XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6ICdjcmVhdGVjaGF0bW9kYWwudGVtcGxhdGUuaHRtbCcsXG4gICAgZGF0YToge30sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIGlucHV0OiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiAnQ2hhdCBuYW1lJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBuYW1lOiAnY2hhdG5hbWUnLFxuICAgICAgICBpZDogJ2NoYXRuYW1lJyxcbiAgICAgICAgY2xhc3NOYW1lOiAnYy1jLW1vZGFsX19pbnB1dCcsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBhdHRlbnRpb25NZXNzYWdlLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9ICcnO1xuICAgICAgICAgICAgQ2hhdE5hbWUgPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9ICfim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1JztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGNyZWF0ZTogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6ICfQodC+0LfQtNCw0YLRjCcsXG4gICAgICAgIGNsYXNzTmFtZTogJ2NyZWF0ZS1idXR0b24nLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoIUNoYXROYW1lKSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gJ+KblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LUnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjaGF0Vmlld01vZGVsID0gY29udGFpbmVyLmdldDxJQ2hhdFZpZXdNb2RlbD4oXG4gICAgICAgICAgICAgIFZJRVdfTU9ERUwuQ0hBVFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNoYXRWaWV3TW9kZWwuc2F2ZUNoYXQoe3RpdGxlOiBDaGF0TmFtZX0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjLWMtbW9kYWwnKVswXVxuICAgICAgICAgICAgICAgIC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgQ2hhdExheW91dChjaGF0Vmlld01vZGVsLmNoYXRzKS5yZW5kZXIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgY2FuY2VsOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogJ9Ce0YLQvNC10L3QsCcsXG4gICAgICAgIGNsYXNzTmFtZTogJ2NhbmNlbC1idXR0b24nLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2MtYy1tb2RhbCcpWzBdXG4gICAgICAgICAgICAuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5cbmludGVyZmFjZSBJUHJvcHMge1xuICBpZDogc3RyaW5nO1xuICBvbkNsaWNrOiAoKSA9PiB2b2lkO1xufVxuZXhwb3J0IGNvbnN0IERlbGV0ZSA9IChwcm9wczogSVByb3BzKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImRlbGV0ZS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgcGF0aDogXCIvbWVkaWEvVmVjdG9yLnN2Z1wiLFxuICAgICAgaWQ6IHByb3BzLmlkLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHt9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJvcHMuaWQpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgcHJvcHMub25DbGljaygpO1xuICAgIH0pO1xuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5cbmV4cG9ydCBjb25zdCBFbXB0eSA9ICgpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiZW1wdHkudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHt9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBFbXB0eSB9IGZyb20gXCIuLi9FbXB0eVwiO1xuXG5pbnRlcmZhY2UgSVByb3BzIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgdHlwZTogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGlkOiBzdHJpbmc7XG4gIGNsYXNzTmFtZTogc3RyaW5nO1xuICBDaGlsZEF0dGVudGlvbj86IEhZUE87XG4gIG9uRm9jdXM/OiAoZTogRXZlbnQpID0+IHZvaWQ7XG4gIG9uQmx1cj86IChlOiBFdmVudCkgPT4gdm9pZDtcbn1cblxuLy9AdG9kbzog0L/RgNC40LrRgNGD0YLQuNGC0Ywg0YPQvdC40LrQsNC70YzQvdC+0YHRgtGMINC60LDQttC00L7Qs9C+INGN0LvQtdC80LXQvdGC0LBcblxuZXhwb3J0IGNvbnN0IElucHV0ID0gKHByb3BzOiBJUHJvcHMpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiaW5wdXQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIGxhYmVsOiB7XG4gICAgICAgIG5hbWU6IHByb3BzLmxhYmVsLFxuICAgICAgfSxcbiAgICAgIGF0cmlidXRlOiB7XG4gICAgICAgIHR5cGU6IHByb3BzLnR5cGUsXG4gICAgICAgIG5hbWU6IHByb3BzLm5hbWUsXG4gICAgICAgIGlkOiBwcm9wcy5pZCxcbiAgICAgICAgY2xhc3NOYW1lOiBwcm9wcy5jbGFzc05hbWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIEF0dGVudGlvbjogcHJvcHMuQ2hpbGRBdHRlbnRpb24gfHwgRW1wdHkoKSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChwcm9wcy5pZClcbiAgICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIChlOiBGb2N1c0V2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgY29uc3QgaW5wdXRMYWJlbCA9IGlucHV0LnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgXCIuZm9ybS1pbnB1dF9fbGFiZWxcIlxuICAgICAgICApO1xuICAgICAgICBpbnB1dExhYmVsPy5jbGFzc0xpc3QuYWRkKFwiZm9ybS1pbnB1dF9fbGFiZWxfc2VsZWN0XCIpO1xuICAgICAgICBwcm9wcy5vbkZvY3VzPy4oZSk7XG4gICAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wcy5pZCk/LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIChlOiBFdmVudCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgY29uc3QgaW5wdXRMYWJlbCA9IGlucHV0LnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiLmZvcm0taW5wdXRfX2xhYmVsXCJcbiAgICAgICk7XG4gICAgICBpZiAoIWlucHV0LnZhbHVlKSB7XG4gICAgICAgIGlucHV0TGFiZWw/LmNsYXNzTGlzdC5yZW1vdmUoXCJmb3JtLWlucHV0X19sYWJlbF9zZWxlY3RcIik7XG4gICAgICB9XG4gICAgICBwcm9wcy5vbkJsdXI/LihlKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvdXRpbHNcIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIHRleHQ6IHN0cmluZztcbiAgb25DbGljazogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IExpc3RJdGVtID0gKHsgdGV4dCwgb25DbGljayB9OiBJUHJvcHMpID0+IHtcbiAgY29uc3Qga2V5ID0gdXVpZHY0KCk7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImxpc3RpdGVtLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7IHRleHQ6IHRleHQsIGtleToga2V5IH0sXG4gIH0pLmFmdGVyUmVuZGVyKCgpID0+IHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChrZXkpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb25DbGljayk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7SFlQT30gZnJvbSAnLi4vLi4vLi4vbGlicy9IWVBPL0hZUE8nO1xuaW1wb3J0IHtMaXN0SXRlbX0gZnJvbSAnLi4vTGlzdEl0ZW0nO1xuXG5pbnRlcmZhY2UgSVByb3BzIHtcbiAgbWVudUlkOiBzdHJpbmc7XG59XG5cbmNvbnN0IG1lbnVsaXN0ID0gWyfQo9C00LDQu9C40YLRjCDRh9Cw0YInLCAn0J/QvtC00YDQvtCx0L3QvtGB0YLQuCcsICdTZXR0aW5ncyddO1xuXG5leHBvcnQgY29uc3QgTWVudUJ1dHRvbiA9ICh7bWVudUlkfTogSVByb3BzKSA9PiB7XG4gIGNvbnN0IE1lbnUgPSBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiAnbWVudWJ1dHRvbi50ZW1wbGF0ZS5odG1sJyxcbiAgICBkYXRhOiB7Y2xhc3M6ICdoaWRlJywgbWVudUlkOiBtZW51SWR9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBsaXN0OiBtZW51bGlzdFxuICAgICAgICAubWFwKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIExpc3RJdGVtKHtcbiAgICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7fSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLnJldmVyc2UoKSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1lbnVJZCk7XG4gICAgZWxlbT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGF0ZSA9IE1lbnUuZ2V0U3RhdGUoKTtcbiAgICAgIGNvbnN0IG1lbnVMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUgLm1lbnVMaXN0Jyk7XG4gICAgICBjb25zdCBpc0hpZGUgPSBBcnJheS5mcm9tKG1lbnVMaXN0Py5jbGFzc0xpc3QgfHwgW10pLmluY2x1ZGVzKCdoaWRlJyk7XG4gICAgICBpZiAoaXNIaWRlKSB7XG4gICAgICAgIHN0YXRlLmNsYXNzID0gJ3Nob3cnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdGUuY2xhc3MgPSAnaGlkZSc7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBNZW51O1xufTtcbiIsImltcG9ydCB7Y29udGFpbmVyfSBmcm9tICcuLi8uLi8uLic7XG5pbXBvcnQge0hZUE99IGZyb20gJy4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPJztcbmltcG9ydCB7b2JzZXJ2ZXJ9IGZyb20gJy4uLy4uLy4uL2xpYnMvU3RvcmUnO1xuaW1wb3J0IHtWSUVXX01PREVMfSBmcm9tICcuLi8uLi8uLi9WaWV3TW9kZWwnO1xuaW1wb3J0IHtJQ2hhdFZpZXdNb2RlbH0gZnJvbSAnLi4vLi4vLi4vVmlld01vZGVsL0NoYXRWaWV3TW9kZWwnO1xuXG5pbnRlcmZhY2UgSVByb3BzIHtcbiAgY2hhdElkOiBudW1iZXI7XG4gIG1lc3NhZ2U6IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IE1lc3NhZ2VzID0gb2JzZXJ2ZXIoKHtjaGF0SWQsIG1lc3NhZ2V9OiBJUHJvcHMpID0+IHtcbiAgY29uc3Qge2NvdW50ZXIsIGluY3JlbWVudH0gPSBjb250YWluZXIuZ2V0PElDaGF0Vmlld01vZGVsPihWSUVXX01PREVMLkNIQVQpO1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogJ21lc3NhZ2VzLnRlbXBsYXRlLmh0bWwnLFxuICAgIGRhdGE6IHtcbiAgICAgIG1lc3NhZ2VzOiBtZXNzYWdlLFxuICAgICAgY291bnRlcixcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbmVzJyk/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaW5jcmVtZW50KCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5cbmludGVyZmFjZSBJUHJvcHMge1xuICBsYWJlbDogc3RyaW5nO1xuICB2YWx1ZTogc3RyaW5nO1xuICBpZDogc3RyaW5nO1xuICBvbkNoYWdlOiAoZTogeyB2YWx1ZTogc3RyaW5nIH0pID0+IHZvaWQ7XG59XG5leHBvcnQgY29uc3QgUHJvZmlsZUlucHV0ID0gKHsgbGFiZWwsIHZhbHVlLCBpZCwgb25DaGFnZSB9OiBJUHJvcHMpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwicHJvZmlsZUlucHV0LnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBpZDogaWQsXG4gICAgfSxcbiAgfSkuYWZ0ZXJSZW5kZXIoKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsICgpID0+IHtcbiAgICAgIG9uQ2hhZ2UoeyB2YWx1ZTogaW5wdXQudmFsdWUgfSk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLlwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyBtZW1vaXplIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvbW9taXplXCI7XG5cbmV4cG9ydCBjb25zdCBDaGFuZ2VQYXNzd29yZCA9IG1lbW9pemUoKCkgPT4ge1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHJlbmRlclRvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIiNyb290XCIpIHx8IGRvY3VtZW50LmJvZHksXG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYW5nZVBhc3N3b3JkLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7fSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgc2F2ZTogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0KHQvtGF0YDQsNC90LjRgtGMXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJwYXNzd29yZF9lZGl0X19hY3Rpb25fX3NhdmVcIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn0pO1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgY29udGFpbmVyLCByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuaW1wb3J0IHsgSVByb2ZpbGVEVE8gfSBmcm9tIFwiLi4vUHJvZmlsZVwiO1xuaW1wb3J0IHsgSVVzZXJWaWV3TW9kZWwgfSBmcm9tIFwiLi4vLi4vLi4vVmlld01vZGVsL1VzZXJWaWV3TW9kZWxcIjtcbmltcG9ydCB7IFZJRVdfTU9ERUwgfSBmcm9tIFwiLi4vLi4vLi4vVmlld01vZGVsXCI7XG5pbXBvcnQgeyBQcm9maWxlSW5wdXQgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9Qcm9maWxlSW5wdXRcIjtcblxuY29uc3QgQ29uZmlnOiB7IFtrZXkgaW4ga2V5b2YgSVByb2ZpbGVEVE9dPzogeyBsYWJlbDogc3RyaW5nIH0gfSA9IHtcbiAgZW1haWw6IHtcbiAgICBsYWJlbDogXCLQn9C+0YfRgtCwXCIsXG4gIH0sXG4gIGxvZ2luOiB7XG4gICAgbGFiZWw6IFwi0JvQvtCz0LjQvVwiLFxuICB9LFxuICBmaXJzdF9uYW1lOiB7XG4gICAgbGFiZWw6IFwi0JjQvNGPXCIsXG4gIH0sXG4gIHNlY29uZF9uYW1lOiB7XG4gICAgbGFiZWw6IFwi0KTQsNC80LjQu9C40Y9cIixcbiAgfSxcbiAgZGlzcGxheV9uYW1lOiB7XG4gICAgbGFiZWw6IFwi0JjQvNGPINCyINGH0LDRgtCw0YVcIixcbiAgfSxcbiAgcGhvbmU6IHtcbiAgICBsYWJlbDogXCLQotC10LvQtdGE0L7QvVwiLFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IENoYW5nZVByb2ZpbGUgPSAoZGF0YTogSVByb2ZpbGVEVE8pID0+IHtcbiAgY29uc3QgdXNlclZpZXdNb2RlbCA9IGNvbnRhaW5lci5nZXQ8SVVzZXJWaWV3TW9kZWw+KFZJRVdfTU9ERUwuVVNFUik7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSB8fCBkb2N1bWVudC5ib2R5LFxuICAgIHRlbXBsYXRlUGF0aDogXCJjaGFuZ2VQcm9maWxlLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBlbWFpbDogZGF0YT8uZW1haWwsXG4gICAgICBsb2dpbjogZGF0YT8ubG9naW4sXG4gICAgICBmaXJzdE5hbWU6IGRhdGE/LmZpcnN0X25hbWUsXG4gICAgICBzZWNvbmROYW1lOiBkYXRhPy5zZWNvbmRfbmFtZSxcbiAgICAgIGRpc3BsYXlOYW1lOiBkYXRhPy5kaXNwbGF5X25hbWUgfHwgXCJcIixcbiAgICAgIHBob25lOiBkYXRhPy5waG9uZSxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBzYXZlOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQodC+0YXRgNCw0L3QuNGC0YxcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcInByb2ZpbGVfZWRpdF9fYWN0aW9uX19zYXZlXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGlmICh1c2VyVmlld01vZGVsLnVzZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxuICAgICAgICAgICAgICBcInByb2ZpbGVfZWRpdFwiXG4gICAgICAgICAgICApWzBdIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXJWaWV3TW9kZWwudXNlcik7XG4gICAgICAgICAgICB1c2VyVmlld01vZGVsLnNhdmVVc2VyKHVzZXJWaWV3TW9kZWwudXNlcikuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgICAgIHJvdXRlci5nbyhcIi9wcm9maWxlXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBpbnB1dHM6IE9iamVjdC5rZXlzKENvbmZpZylcbiAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgY29uc3Qga2V5ID0gaXRlbSBhcyBrZXlvZiB0eXBlb2YgZGF0YTtcbiAgICAgICAgICBjb25zdCBsYWJlbCA9IENvbmZpZ1tpdGVtIGFzIGtleW9mIHR5cGVvZiBDb25maWddPy5sYWJlbCBhcyBzdHJpbmc7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBkYXRhID8gKGRhdGFba2V5XSBhcyBzdHJpbmcpIDogXCJcIjtcbiAgICAgICAgICByZXR1cm4gUHJvZmlsZUlucHV0KHtcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGlkOiBrZXksXG4gICAgICAgICAgICBvbkNoYWdlOiAoeyB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICAgICAgICAgICAgdXNlclZpZXdNb2RlbC51c2VyID0ge1xuICAgICAgICAgICAgICAgIC4uLnVzZXJWaWV3TW9kZWwudXNlcixcbiAgICAgICAgICAgICAgICBbaXRlbV06IHZhbHVlLFxuICAgICAgICAgICAgICB9IGFzIElQcm9maWxlRFRPO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHtIWVBPfSBmcm9tICcuLi8uLi8uLi9saWJzL0hZUE8vSFlQTyc7XG5pbXBvcnQge0NoYXRJdGVtLCBJQ2hhdERUT30gZnJvbSAnLi4vLi4vQ29tcG9uZW50cy9DaGF0SXRlbSc7XG5pbXBvcnQge2NvbnRhaW5lciwgcm91dGVyfSBmcm9tICcuLi8uLi8uLic7XG5pbXBvcnQge0J1dHRvbn0gZnJvbSAnLi4vLi4vQ29tcG9uZW50cy9CdXR0b24nO1xuaW1wb3J0IHtFbXB0eX0gZnJvbSAnLi4vLi4vQ29tcG9uZW50cy9FbXB0eSc7XG5pbXBvcnQge0NyZWF0ZUNoYXRNb2RhbH0gZnJvbSAnLi4vLi4vQ29tcG9uZW50cy9DcmVhdGVDaGF0TW9kYWwnO1xuaW1wb3J0IHtNZW51QnV0dG9ufSBmcm9tICcuLi8uLi9Db21wb25lbnRzL01lbnVCdXR0b24nO1xuaW1wb3J0IHtvYnNlcnZlcn0gZnJvbSAnLi4vLi4vLi4vbGlicy9TdG9yZSc7XG5pbXBvcnQge0lDaGF0Vmlld01vZGVsfSBmcm9tICcuLi8uLi8uLi9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbCc7XG5pbXBvcnQge1ZJRVdfTU9ERUx9IGZyb20gJy4uLy4uLy4uL1ZpZXdNb2RlbCc7XG5pbXBvcnQge0lNZXNzYWdlVmlld01vZGVsfSBmcm9tICcuLi8uLi8uLi9WaWV3TW9kZWwvTWVzc2FnZVZpZXdNb2RlbCc7XG5pbXBvcnQge01lc3NhZ2VzfSBmcm9tICcuLi8uLi9Db21wb25lbnRzL01lc3NhZ2VzJztcblxuZXhwb3J0IGNvbnN0IENoYXRMYXlvdXQgPSBvYnNlcnZlcigocmVzdWx0OiBJQ2hhdERUT1tdKSA9PiB7XG4gIGNvbnN0IENoYXRJdGVtTGlzdDogSFlQT1tdID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICByZXN1bHQuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBDaGF0SXRlbUxpc3QucHVzaChDaGF0SXRlbSh7Li4uaXRlbX0pKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBDaGF0SXRlbUxpc3QucHVzaChFbXB0eSgpKTtcbiAgfVxuXG4gIGNvbnN0IHtjb3VudGVyLCBhcnIsIHB1c2gsIGluY3JlbWVudH0gPSBjb250YWluZXIuZ2V0PElDaGF0Vmlld01vZGVsPihcbiAgICBWSUVXX01PREVMLkNIQVRcbiAgKTtcbiAgY29uc3Qge3B1c2hNZXNzYWdlLCBtZXNzYWdlc30gPSBjb250YWluZXIuZ2V0PElNZXNzYWdlVmlld01vZGVsPihcbiAgICBWSUVXX01PREVMLk1FU1NBR0VTXG4gICk7XG5cbiAgbWVzc2FnZXNbMF07XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSB8fCBkb2N1bWVudC5ib2R5LFxuICAgIHRlbXBsYXRlUGF0aDogJ2NoYXQudGVtcGxhdGUuaHRtbCcsXG4gICAgZGF0YToge2NvdW50ZXIsIG1lc3NhZ2VzOiBKU09OLnN0cmluZ2lmeShhcnIpfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgUHJvZmlsZUxpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiAnUHJvZmlsZScsXG4gICAgICAgIGNsYXNzTmFtZTogJ3Byb2ZpbGUtbGlua19fYnV0dG9uJyxcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKCcvcHJvZmlsZScpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICAnbWVudS1idXR0b24nOiBNZW51QnV0dG9uKHttZW51SWQ6ICdjaGF0TWVudSd9KSxcbiAgICAgIGNoYXRJdGVtOiBDaGF0SXRlbUxpc3QsXG4gICAgICBjcmVhdGVDaGF0TW9kYWw6IENyZWF0ZUNoYXRNb2RhbCgpLFxuICAgICAgY3JlYXRlQ2hhdEJ1dHRvbjogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6ICcrJyxcbiAgICAgICAgY2xhc3NOYW1lOiAnbmF2aWdhdGlvbl9fY3JlYXRlQ2hhdEJ1dHRvbicsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2MtYy1tb2RhbCcpWzBdXG4gICAgICAgICAgICAuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIG1lc3NhZ2VzOiBhcnIubWFwKChtZXNzYWdlKSA9PiB7XG4gICAgICAgIHJldHVybiBNZXNzYWdlcyh7Y2hhdElkOiAxLCBtZXNzYWdlOiBtZXNzYWdlfSk7XG4gICAgICB9KSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjb250cm9sc19fc2VuZCcpWzBdXG4gICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIC8vIFN0b3JlLnN0b3JlLm1lc3NhZ2VzID0gWy4uLlN0b3JlLnN0b3JlLm1lc3NhZ2VzLCAnTmV3IG1lc3NhZ2UnXTtcbiAgICAgICAgLy8gaW5jcmVtZW50KCk7XG4gICAgICAgIHB1c2goKTtcbiAgICAgIH0pO1xuICB9KTtcbn0pO1xuIiwiaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9JbnB1dFwiO1xuaW1wb3J0IHsgUmVxdWlyZWQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9WYWxpZGF0b3JzL1JlcXVpcmVkXCI7XG5pbXBvcnQgeyBBdHRlbnRpb25NZXNzYWdlIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQXR0ZW50aW9uTWVzc2FnZVwiO1xuaW1wb3J0IHsgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uL2luZGV4XCI7XG5pbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVHJhbnNwb3J0XCI7XG5pbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uL1Byb2ZpbGVcIjtcblxuLyoqXG4gKiBubm5ycnIxMTFOTlxuICovXG5cbmV4cG9ydCBjb25zdCBMb2dpbkxheW91dCA9ICh1c2VyOiBJUHJvZmlsZURUTyk6IEhZUE8gPT4ge1xuICBpZiAodXNlciAmJiB1c2VyLmlkKSB7XG4gICAgcm91dGVyLmdvKFwiL2NoYXRcIik7XG4gIH1cblxuICBjb25zdCBhdHRlbnRpb25Mb2dpbiA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgYXR0ZW50aW9uTG9naW5TdG9yZSA9IGF0dGVudGlvbkxvZ2luLmdldFN0YXRlKCk7XG4gIGNvbnN0IGF0dGVudGlvblBhc3MgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IGF0dGVudGlvblBhc3NTdG9yZSA9IGF0dGVudGlvblBhc3MuZ2V0U3RhdGUoKTtcblxuICBjb25zdCBGb3JtRGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHJlbmRlclRvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIikgfHwgZG9jdW1lbnQuYm9keSxcbiAgICB0ZW1wbGF0ZVBhdGg6IFwibG9naW4udGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIEZvcm1OYW1lOiBcItCS0YXQvtC0XCIsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgSW5wdXRMb2dpbjogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQm9C+0LPQuNC9XCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImxvZ2luXCIsXG4gICAgICAgIGlkOiBcImZvcm0taW5wdXQtbG9naW5cIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tbG9naW5fX2Zvcm0taW5wdXRcIixcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3QgY2hlY2sgPSBSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQ/LnZhbHVlKTtcbiAgICAgICAgICBpZiAoIWNoZWNrKSB7XG4gICAgICAgICAgICBhdHRlbnRpb25Mb2dpblN0b3JlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0ZW50aW9uTG9naW5TdG9yZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wibG9naW5cIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBhdHRlbnRpb25Mb2dpbixcbiAgICAgIH0pLFxuICAgICAgSW5wdXRQYXNzd29yZDogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQn9Cw0YDQvtC70YxcIixcbiAgICAgICAgdHlwZTogXCJwYXNzd29yZFwiLFxuICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXG4gICAgICAgIGlkOiBcImZvcm0taW5wdXQtcGFzc3dvcmRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tbG9naW5fX2Zvcm0taW5wdXRcIixcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKCFSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBhdHRlbnRpb25QYXNzU3RvcmUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRlbnRpb25QYXNzU3RvcmUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgICBGb3JtRGF0YVtcInBhc3N3b3JkXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogYXR0ZW50aW9uUGFzcyxcbiAgICAgIH0pLFxuICAgICAgQnV0dG9uOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQkNCy0YLQvtGA0LjQt9C+0LLQsNGC0YzRgdGPXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWJ1dHRvblwiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBkYXRhOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbG9naW46IEZvcm1EYXRhLmxvZ2luLFxuICAgICAgICAgICAgICBwYXNzd29yZDogRm9ybURhdGEucGFzc3dvcmQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgICAgICAgIC5QT1NUKFwiL2F1dGgvc2lnbmluXCIsIGRhdGEpXG4gICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgICAgICAgcm91dGVyLmdvKFwiL2NoYXRcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBMaW5rVG9SZWdpc3RyYXRpb246IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCX0LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDRgtGM0YHRj1wiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1saW5rXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9yZWdpc3RyYXRpb25cIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLlwiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElQcm9maWxlRFRPIHtcbiAgaWQ6IG51bWJlcjtcbiAgZGlzcGxheV9uYW1lOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIGZpcnN0X25hbWU6IHN0cmluZztcbiAgc2Vjb25kX25hbWU6IHN0cmluZztcbiAgbG9naW46IHN0cmluZztcbiAgcGhvbmU6IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IFByb2ZpbGVMYXlvdXQgPSAoZGF0YTogSVByb2ZpbGVEVE8pID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdFwiKSxcbiAgICB0ZW1wbGF0ZVBhdGg6IFwicHJvZmlsZS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgLi4uZGF0YSxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBFZGl0UHJvZmlsZUxpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCY0LfQvNC10L3QuNGC0Ywg0LTQsNC90L3Ri9C1XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2NoYW5nZS1wcm9maWxlXCIsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvZWRpdHByb2ZpbGVcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIEVkaXRQYXNzd29yZExpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCY0LfQvNC10L3QuNGC0Ywg0L/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2NoYW5nZS1wYXNzd29yZFwiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL2VkaXRwYXNzd29yZFwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgQmFja0xpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCd0LDQt9Cw0LRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImFjdGlvbl9fYmFja1wiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL2NoYXRcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIEV4aXRMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQktGL0LnRgtC4XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2V4aXRcIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxuICAgICAgICAgICAgLlBPU1QoXCIvYXV0aC9sb2dvdXRcIilcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcm91dGVyLmdvKFwiL1wiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHtJbnB1dH0gZnJvbSAnLi4vLi4vQ29tcG9uZW50cy9JbnB1dCc7XG4vLyBpbXBvcnQgeyBWYWxpZGF0b3IsIFJ1bGUgfSBmcm9tIFwiLi4vLi4vbGlicy9WYWxpZGF0b3JcIjtcbmltcG9ydCB7RW1haWxWYWxpZGF0b3J9IGZyb20gJy4uLy4uLy4uL2xpYnMvVmFsaWRhdG9ycy9FbWFpbCc7XG5pbXBvcnQge1JlcXVpcmVkfSBmcm9tICcuLi8uLi8uLi9saWJzL1ZhbGlkYXRvcnMvUmVxdWlyZWQnO1xuaW1wb3J0IHtBdHRlbnRpb25NZXNzYWdlfSBmcm9tICcuLi8uLi9Db21wb25lbnRzL0F0dGVudGlvbk1lc3NhZ2UnO1xuaW1wb3J0IHtyb3V0ZXJ9IGZyb20gJy4uLy4uLy4uJztcbmltcG9ydCB7SFRUUFRyYW5zcG9ydH0gZnJvbSAnLi4vLi4vLi4vbGlicy9UcmFuc3BvcnQnO1xuaW1wb3J0IHtCdXR0b259IGZyb20gJy4uLy4uL0NvbXBvbmVudHMvQnV0dG9uJztcbmltcG9ydCB7SFlQT30gZnJvbSAnLi4vLi4vLi4vbGlicy9IWVBPL0hZUE8nO1xuXG5leHBvcnQgY29uc3QgUmVnaXN0cmF0aW9uTGF5b3V0ID0gKCkgPT4ge1xuICBjb25zdCBBdHRlbnRpb25FbWFpbCA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uTG9naW4gPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IEF0dGVudGlvblBhc3N3b3JkID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25QYXNzd29yZERvdWJsZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uRmlyc3ROYW1lID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25TZWNvbmROYW1lID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25QaG9uZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcblxuICBjb25zdCBGb3JtRGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcm9vdCcpLFxuICAgIHRlbXBsYXRlUGF0aDogJ3JlZ2lzdHJhdGlvbi50ZW1wbGF0ZS5odG1sJyxcbiAgICBkYXRhOiB7XG4gICAgICBmb3JtVGl0bGU6ICfQoNC10LPQuNGB0YLRgNCw0YbQuNGPJyxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBJbnB1dEVtYWlsOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiAn0J/QvtGH0YLQsCcsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgbmFtZTogJ2VtYWlsJyxcbiAgICAgICAgaWQ6ICdmb3JtX19lbWFpbF9faW5wdXQnLFxuICAgICAgICBjbGFzc05hbWU6ICdmb3JtLXJlZ19fZm9ybS1pbnB1dCcsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25FbWFpbCxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvbkVtYWlsLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChFbWFpbFZhbGlkYXRvci5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVsnZW1haWwnXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9ICcnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gJ+KblCDRjdGC0L4g0L3QtSDQv9C+0YXQvtC20LUg0L3QsCDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRiyc7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBJbnB1dExvZ2luOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiAn0JvQvtCz0LjQvScsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgbmFtZTogJ2xvZ2luJyxcbiAgICAgICAgaWQ6ICdmb3JtX19sb2dpbl9faW5wdXQnLFxuICAgICAgICBjbGFzc05hbWU6ICdmb3JtLXJlZ19fZm9ybS1pbnB1dCcsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25Mb2dpbixcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvbkxvZ2luLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVsnbG9naW4nXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9ICcnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gJ+KblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LUnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgRmlyc3ROYW1lOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiAn0JjQvNGPJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBuYW1lOiAnZmlyc3RfbmFtZScsXG4gICAgICAgIGlkOiAnZm9ybV9fZmlyc3RfbmFtZV9faW5wdXQnLFxuICAgICAgICBjbGFzc05hbWU6ICdmb3JtLXJlZ19fZm9ybS1pbnB1dCcsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25GaXJzdE5hbWUsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25GaXJzdE5hbWUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhWydmaXJzdF9uYW1lJ10gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSAnJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9ICfim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1JztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFNlY29uZE5hbWU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6ICfQpNCw0LzQuNC70LjRjycsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgbmFtZTogJ3NlY29uZF9uYW1lJyxcbiAgICAgICAgaWQ6ICdmb3JtX19zZWNvbmRfbmFtZV9faW5wdXQnLFxuICAgICAgICBjbGFzc05hbWU6ICdmb3JtLXJlZ19fZm9ybS1pbnB1dCcsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25TZWNvbmROYW1lLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uU2Vjb25kTmFtZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbJ3NlY29uZF9uYW1lJ10gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSAnJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9ICfim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1JztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFBob25lOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiAn0KLQtdC70LXRhNC+0L0nLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIG5hbWU6ICdwaG9uZScsXG4gICAgICAgIGlkOiAnZm9ybV9fcGhvbmVfX2lucHV0JyxcbiAgICAgICAgY2xhc3NOYW1lOiAnZm9ybS1yZWdfX2Zvcm0taW5wdXQnLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uUGhvbmUsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25QaG9uZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbJ3Bob25lJ10gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSAnJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9ICfim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1JztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFBhc3N3b3JkOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiAn0J/QsNGA0L7Qu9GMJyxcbiAgICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgICAgbmFtZTogJ3Bhc3N3b3JkJyxcbiAgICAgICAgaWQ6ICdmb3JtX19wYXNzd29yZF9faW5wdXQnLFxuICAgICAgICBjbGFzc05hbWU6ICdmb3JtLXJlZ19fZm9ybS1pbnB1dCcsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QYXNzd29yZCxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25QYXNzd29yZC5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IHN0YXRlRCA9IEF0dGVudGlvblBhc3N3b3JkRG91YmxlLmdldFN0YXRlKCk7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhWydwYXNzd29yZCddID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gJyc7XG4gICAgICAgICAgICBpZiAoRm9ybURhdGFbJ3Bhc3N3b3JkJ10gIT09IEZvcm1EYXRhWydkb3VibGVwYXNzd29yZCddKSB7XG4gICAgICAgICAgICAgIHN0YXRlRC5tZXNzYWdlID0gJ/CflKXQv9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YInO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gJ+KblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LUnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUGFzc3dvcmREb3VibGU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6ICfQn9Cw0YDQvtC70YwnLFxuICAgICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgICBuYW1lOiAnZG91YmxlcGFzc3dvcmQnLFxuICAgICAgICBpZDogJ2Zvcm1fX2RvdWJsZXBhc3N3b3JkX19pbnB1dCcsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zvcm0tcmVnX19mb3JtLWlucHV0JyxcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvblBhc3N3b3JkRG91YmxlLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblBhc3N3b3JkRG91YmxlLmdldFN0YXRlKCk7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhWydkb3VibGVwYXNzd29yZCddID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gJyc7XG4gICAgICAgICAgICBpZiAoRm9ybURhdGFbJ3Bhc3N3b3JkJ10gIT09IEZvcm1EYXRhWydkb3VibGVwYXNzd29yZCddKSB7XG4gICAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSAn8J+UpdC/0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7Rgic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSAn4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtSc7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBSZWdCdXR0b246IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiAn0JfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRgdGPJyxcbiAgICAgICAgY2xhc3NOYW1lOiAnZm9ybS1idXR0b24nLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhGb3JtRGF0YSkubGVuZ3RoID09IDAgfHxcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKEZvcm1EYXRhKS5maW5kKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBGb3JtRGF0YVtpdGVtXSA9PT0gJyc7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBkYXRhOiB7W2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPn0gPSB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGZpcnN0X25hbWU6IEZvcm1EYXRhLmZpcnN0X25hbWUsXG4gICAgICAgICAgICAgIHNlY29uZF9uYW1lOiBGb3JtRGF0YS5zZWNvbmRfbmFtZSxcbiAgICAgICAgICAgICAgbG9naW46IEZvcm1EYXRhLmxvZ2luLFxuICAgICAgICAgICAgICBlbWFpbDogRm9ybURhdGEuZW1haWwsXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBGb3JtRGF0YS5wYXNzd29yZCxcbiAgICAgICAgICAgICAgcGhvbmU6IEZvcm1EYXRhLnBob25lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgJ0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgICAgICAgIC5QT1NUKCcvYXV0aC9zaWdudXAnLCBkYXRhKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByb3V0ZXIuZ28oJy9jaGF0Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgTG9naW5MaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogJ9CS0L7QudGC0LgnLFxuICAgICAgICBjbGFzc05hbWU6ICdmb3JtLWxpbmsnLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oJy8nKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7SUNoYXRTZXJ2aWNlfSBmcm9tICcuLi8uLi9CdXNzaW5lc0xheWVyL0NoYXRTZXJ2aWNlJztcbmltcG9ydCB7bWFrZU9ic2VydmFibGUsIG9ic2VydmFibGV9IGZyb20gJy4uLy4uL2xpYnMvU3RvcmUnO1xuaW1wb3J0IHtJQ2hhdERUT30gZnJvbSAnLi4vLi4vVUkvQ29tcG9uZW50cy9DaGF0SXRlbSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNoYXRWaWV3TW9kZWwge1xuICBjaGF0czogQXJyYXk8SUNoYXREVE8+O1xuICBjb3VudGVyOiBudW1iZXI7XG4gIGFycjogQXJyYXk8c3RyaW5nPjtcbiAgcHVzaDogKCkgPT4gdm9pZDtcbiAgZ2V0Q2hhdHM6ICgpID0+IFByb21pc2U8SUNoYXREVE9bXT47XG4gIHNhdmVDaGF0OiAoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4gUHJvbWlzZTx2b2lkPjtcbiAgZGVsZXRlQ2hhdDogKGNoYXRJZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBpbmNyZW1lbnQ6ICgpID0+IHZvaWQ7XG4gIGRlY3JpbWVudDogKCkgPT4gdm9pZDtcbn1cbmV4cG9ydCBjbGFzcyBDaGF0Vmlld01vZGVsIGltcGxlbWVudHMgSUNoYXRWaWV3TW9kZWwge1xuICBjaGF0czogQXJyYXk8SUNoYXREVE8+ID0gW107XG4gIGNvdW50ZXI6IG51bWJlciA9IDA7XG4gIGFycjogQXJyYXk8c3RyaW5nPiA9IFsnaGVsbG8nXTtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNlcnZpY2U6IElDaGF0U2VydmljZSkge1xuICAgIG1ha2VPYnNlcnZhYmxlKHRoaXMsIHtcbiAgICAgIGNoYXRzOiBvYnNlcnZhYmxlLFxuICAgICAgY291bnRlcjogb2JzZXJ2YWJsZSxcbiAgICAgIGFycjogb2JzZXJ2YWJsZSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1c2ggPSAoKSA9PiB7XG4gICAgdGhpcy5hcnIgPSBbLi4udGhpcy5hcnIsICdoZWwnXTtcbiAgfTtcblxuICBpbmNyZW1lbnQgPSAoKSA9PiB7XG4gICAgdGhpcy5jb3VudGVyKys7XG4gIH07XG5cbiAgZGVjcmltZW50ID0gKCkgPT4ge1xuICAgIHRoaXMuY291bnRlci0tO1xuICB9O1xuXG4gIGdldENoYXRzID0gYXN5bmMgKCkgPT4ge1xuICAgIHRoaXMuY2hhdHMgPSBhd2FpdCB0aGlzLnNlcnZpY2UuZ2V0Q2hhdHMoKTtcbiAgICByZXR1cm4gdGhpcy5jaGF0cztcbiAgfTtcblxuICBzYXZlQ2hhdCA9IGFzeW5jIChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiB7XG4gICAgYXdhaXQgdGhpcy5zZXJ2aWNlLnNhdmVDaGF0KGRhdGEpO1xuICAgIGF3YWl0IHRoaXMuZ2V0Q2hhdHMoKTtcbiAgfTtcblxuICBkZWxldGVDaGF0ID0gYXN5bmMgKGNoYXRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgYXdhaXQgdGhpcy5zZXJ2aWNlLmRlbGV0ZUNoYXQoY2hhdElkKTtcbiAgICBhd2FpdCB0aGlzLmdldENoYXRzKCk7XG4gIH07XG59XG4iLCJpbXBvcnQge21ha2VPYnNlcnZhYmxlLCBvYnNlcnZhYmxlfSBmcm9tICcuLi8uLi9saWJzL1N0b3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBJTWVzc2FnZVZpZXdNb2RlbCB7XG4gIG1lc3NhZ2VzOiBBcnJheTxzdHJpbmc+O1xuICBwdXNoTWVzc2FnZTogKG06IHN0cmluZykgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VWaWV3TW9kZWwgaW1wbGVtZW50cyBJTWVzc2FnZVZpZXdNb2RlbCB7XG4gIG1lc3NhZ2VzOiBBcnJheTxzdHJpbmc+ID0gWydoZWxsbyB3b3JsZCddO1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBtYWtlT2JzZXJ2YWJsZSh0aGlzLCB7XG4gICAgICBtZXNzYWdlczogb2JzZXJ2YWJsZSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1c2hNZXNzYWdlID0gKG06IHN0cmluZykgPT4ge1xuICAgIHRoaXMubWVzc2FnZXMgPSBbLi4udGhpcy5tZXNzYWdlcywgbV07XG4gIH07XG59XG4iLCJpbXBvcnQgeyBJVXNlclNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vQnVzc2luZXNMYXllci9Vc2VyU2VydmljZVwiO1xuaW1wb3J0IHsgSVByb2ZpbGVEVE8gfSBmcm9tIFwiLi4vLi4vVUkvTGF5b3V0cy9Qcm9maWxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVVzZXJWaWV3TW9kZWwge1xuICB1c2VyPzogSVByb2ZpbGVEVE87XG4gIGdldFVzZXI6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIHNhdmVVc2VyOiAodXNlcjogSVByb2ZpbGVEVE8pID0+IFByb21pc2U8SVByb2ZpbGVEVE8+O1xuICBzZXRVc2VyRmllbGQ6IChuYW1lOiBrZXlvZiBJUHJvZmlsZURUTywgdmFsdWU6IGFueSkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFVzZXJWaWV3TW9kZWwgaW1wbGVtZW50cyBJVXNlclZpZXdNb2RlbCB7XG4gIHVzZXI/OiBJUHJvZmlsZURUTztcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNlcnZpY2U6IElVc2VyU2VydmljZSkge31cblxuICBnZXRVc2VyID0gYXN5bmMgKCkgPT4ge1xuICAgIHRoaXMudXNlciA9IGF3YWl0IHRoaXMuc2VydmljZS5nZXRVc2VyKCk7XG4gIH07XG5cbiAgc2F2ZVVzZXIgPSBhc3luYyAodXNlcjogSVByb2ZpbGVEVE8pID0+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlLnNhdmVVc2VyKHVzZXIpO1xuICB9O1xuXG4gIHNldFVzZXJGaWVsZChuYW1lOiBrZXlvZiBJUHJvZmlsZURUTywgdmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLnVzZXIpIHtcbiAgICAgIHRoaXMudXNlcltuYW1lXSA9IHZhbHVlIGFzIG5ldmVyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVzZXIgPSB7fSBhcyBJUHJvZmlsZURUTztcbiAgICAgIHRoaXMudXNlcltuYW1lXSA9IHZhbHVlIGFzIG5ldmVyO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtTRVJWSUNFfSBmcm9tICcuLi9CdXNzaW5lc0xheWVyJztcbmltcG9ydCB7SUNoYXRTZXJ2aWNlfSBmcm9tICcuLi9CdXNzaW5lc0xheWVyL0NoYXRTZXJ2aWNlJztcbmltcG9ydCB7SVVzZXJTZXJ2aWNlfSBmcm9tICcuLi9CdXNzaW5lc0xheWVyL1VzZXJTZXJ2aWNlJztcbmltcG9ydCB7Q29udGFpbmVyfSBmcm9tICcuLi9saWJzL0NvbnRhaW5lcic7XG5pbXBvcnQge0NoYXRWaWV3TW9kZWx9IGZyb20gJy4vQ2hhdFZpZXdNb2RlbCc7XG5pbXBvcnQge01lc3NhZ2VWaWV3TW9kZWx9IGZyb20gJy4vTWVzc2FnZVZpZXdNb2RlbCc7XG5pbXBvcnQge1VzZXJWaWV3TW9kZWx9IGZyb20gJy4vVXNlclZpZXdNb2RlbCc7XG5cbmV4cG9ydCBjb25zdCBWSUVXX01PREVMID0ge1xuICBDSEFUOiBTeW1ib2wuZm9yKCdDaGF0Vmlld01vZGVsJyksXG4gIFVTRVI6IFN5bWJvbC5mb3IoJ1VzZXJWaWV3TW9kZWwnKSxcbiAgTUVTU0FHRVM6IFN5bWJvbC5mb3IoJ01lc3NhZ2VzVmlld01vZGVsJyksXG59O1xuXG5leHBvcnQgY29uc3QgVmlld01vZGVsQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcigpO1xuXG5WaWV3TW9kZWxDb250YWluZXIuYmluZChWSUVXX01PREVMLkNIQVQpXG4gIC50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gICAgY29uc3Qgc2VydmljZSA9IGNvbnRhaW5lci5nZXQ8SUNoYXRTZXJ2aWNlPihTRVJWSUNFLkNIQVQpO1xuICAgIHJldHVybiBuZXcgQ2hhdFZpZXdNb2RlbChzZXJ2aWNlKTtcbiAgfSlcbiAgLmluU2luZ2xldG9uZVNjb3BlKCk7XG5cblZpZXdNb2RlbENvbnRhaW5lci5iaW5kKFZJRVdfTU9ERUwuVVNFUilcbiAgLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgICBjb25zdCBzZXJ2aWNlID0gY29udGFpbmVyLmdldDxJVXNlclNlcnZpY2U+KFNFUlZJQ0UuVVNFUik7XG4gICAgcmV0dXJuIG5ldyBVc2VyVmlld01vZGVsKHNlcnZpY2UpO1xuICB9KVxuICAuaW5TaW5nbGV0b25lU2NvcGUoKTtcblxuVmlld01vZGVsQ29udGFpbmVyLmJpbmQoVklFV19NT0RFTC5NRVNTQUdFUylcbiAgLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IE1lc3NhZ2VWaWV3TW9kZWwoKTtcbiAgfSlcbiAgLmluU2luZ2xldG9uZVNjb3BlKCk7XG4iLCJpbXBvcnQgXCJyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWVcIjtcbmltcG9ydCB7IEJvb3RTdHJhcCB9IGZyb20gXCIuL0Jvb3RzdHJhcFwiO1xuaW1wb3J0IHsgQXBwSW5pdCB9IGZyb20gXCIuL3JvdXRlclwiO1xuXG5jb25zdCBJbml0QXBwID0gKCkgPT4ge1xuICBjb25zdCB7IGNvbnRhaW5lciB9ID0gbmV3IEJvb3RTdHJhcCgpO1xuICAvLyDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgNC10L3QtNC10YDQsCDQv9GA0L7QuNGB0YXQvtC00LjRgiDQsiBSb3V0ZXJJbml0XG4gIGNvbnN0IHJvdXRlciA9IEFwcEluaXQoY29udGFpbmVyKTtcbiAgcmV0dXJuIHsgcm91dGVyLCBjb250YWluZXIgfTtcbn07XG5cbmV4cG9ydCBjb25zdCB7IHJvdXRlciwgY29udGFpbmVyIH0gPSBJbml0QXBwKCk7XG4iLCJjbGFzcyBTaW5nbGV0b25TY29wZSB7XG4gIEluc3RhbmNlTWFrZXJzOiBNYXA8c3ltYm9sLCBhbnk+ID0gbmV3IE1hcDxcbiAgICBzeW1ib2wsXG4gICAge2ZuOiAoY29udGFpbmVyOiBDb250YWluZXIpID0+IGFueTsgaWQ6IHN5bWJvbH1cbiAgPigpO1xuICBJbnN0YW5jZXM6IE1hcDxzeW1ib2wsIGFueT4gPSBuZXcgTWFwPHN5bWJvbCwgYW55PigpO1xufVxuXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyIHtcbiAgY29udGFpbmVyczogTWFwPHN5bWJvbCwgYW55PiA9IG5ldyBNYXAoKTtcbiAgbGFzdElkPzogc3ltYm9sO1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgc2luZ2xldG9uZVNjb3BlOiBTaW5nbGV0b25TY29wZSA9IG5ldyBTaW5nbGV0b25TY29wZSgpXG4gICkge31cbiAgYmluZChpZDogc3ltYm9sKTogQ29udGFpbmVyIHtcbiAgICB0aGlzLmxhc3RJZCA9IGlkO1xuICAgIHRoaXMuY29udGFpbmVycy5zZXQoaWQsIG51bGwpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGdldCA9IDxUPihpZDogc3ltYm9sKTogVCA9PiB7XG4gICAgY29uc3Qgc2luZ2xlVG9uZUNvbnRhaW5lciA9IHRoaXMuc2luZ2xldG9uZVNjb3BlLkluc3RhbmNlTWFrZXJzLmdldChpZCk7XG4gICAgaWYgKHNpbmdsZVRvbmVDb250YWluZXIpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5zaW5nbGV0b25lU2NvcGUuSW5zdGFuY2VzLmdldChpZCk7XG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zaW5nbGV0b25lU2NvcGUuSW5zdGFuY2VzLnNldChpZCwgc2luZ2xlVG9uZUNvbnRhaW5lci5mbih0aGlzKSk7XG4gICAgICAgIHJldHVybiB0aGlzLnNpbmdsZXRvbmVTY29wZS5JbnN0YW5jZXMuZ2V0KGlkKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY3JlYXRlQ29udGFpbmVyRm4gPSB0aGlzLmNvbnRhaW5lcnMuZ2V0KGlkKTtcbiAgICAgIHJldHVybiBjcmVhdGVDb250YWluZXJGbi5mbih0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdG9EeW5hbWljVmFsdWUoZm46IChjb250YWluZXI6IENvbnRhaW5lcikgPT4gdW5rbm93bikge1xuICAgIGlmICh0aGlzLmxhc3RJZCkge1xuICAgICAgdGhpcy5jb250YWluZXJzLnNldCh0aGlzLmxhc3RJZCwge2ZuOiBmbiwgaWQ6IHRoaXMubGFzdElkfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwYXJlbnQoY29udGFpbmVyOiBDb250YWluZXIpOiBDb250YWluZXIge1xuICAgIGZvciAobGV0IGNvbnQgb2YgY29udGFpbmVyLmNvbnRhaW5lcnMpIHtcbiAgICAgIHRoaXMuY29udGFpbmVycy5zZXQoY29udFswXSwgY29udFsxXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaW5TaW5nbGV0b25lU2NvcGUoKSB7XG4gICAgaWYgKHRoaXMubGFzdElkKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcnMuZ2V0KHRoaXMubGFzdElkKTtcbiAgICAgIHRoaXMuc2luZ2xldG9uZVNjb3BlLkluc3RhbmNlTWFrZXJzLnNldCh0aGlzLmxhc3RJZCwgY29udGFpbmVyKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7bWVtb2l6ZX0gZnJvbSAnLi4vbW9taXplJztcbmltcG9ydCB7dXVpZHY0fSBmcm9tICcuLi91dGlscyc7XG5cbmludGVyZmFjZSBJSFlQT1Byb3BzIHtcbiAgcmVuZGVyVG8/OiBIVE1MRWxlbWVudDtcbiAgdGVtcGxhdGVQYXRoOiBzdHJpbmc7XG4gIGNoaWxkcmVuPzogUmVjb3JkPHN0cmluZywgSFlQTyB8IEhZUE9bXT47XG4gIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xufVxuXG5pbnRlcmZhY2UgSVRlbXBhdGVQcm9wIHtcbiAgaHRtbDogc3RyaW5nO1xuICB0ZW1wbGF0ZUtleTogc3RyaW5nO1xuICBtYWdpY0tleTogc3RyaW5nO1xuICBpc0FycmF5OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgSFlQTyB7XG4gIHByaXZhdGUgcmVuZGVyVG8/OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBjaGlsZHJlbj86IFJlY29yZDxzdHJpbmcsIEhZUE8gfCBIWVBPW10+O1xuICBwcml2YXRlIHRlbXBsYXRlUGF0aDogc3RyaW5nO1xuICBwcml2YXRlIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICBwcml2YXRlIHRlbXBsYXRlc1Byb21pc2VzOiBQcm9taXNlPElUZW1wYXRlUHJvcD5bXTtcbiAgcHJpdmF0ZSBzdG9yZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIHByaXZhdGUgbWFnaWNLZXk6IHN0cmluZztcbiAgcHJpdmF0ZSBhZnRlclJlbmRlckNhbGxiYWNrOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIGFmdGVyUmVuZGVyQ2FsbGJhY2tBcnI6IFNldDwoKSA9PiB2b2lkPjtcblxuICBjb25zdHJ1Y3RvcihwYXJhbXM6IElIWVBPUHJvcHMpIHtcbiAgICB0aGlzLnJlbmRlclRvID0gcGFyYW1zLnJlbmRlclRvO1xuICAgIHRoaXMuZGF0YSA9IHBhcmFtcy5kYXRhO1xuICAgIHRoaXMudGVtcGxhdGVQYXRoID0gYC4vdGVtcGxhdGVzLyR7cGFyYW1zLnRlbXBsYXRlUGF0aH1gO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBwYXJhbXMuY2hpbGRyZW47XG4gICAgdGhpcy50ZW1wbGF0ZXNQcm9taXNlcyA9IFtdO1xuICAgIHRoaXMuc3RvcmUgPSB7fTtcbiAgICB0aGlzLm1hZ2ljS2V5ID0gdXVpZHY0KCk7XG4gICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrID0gKCkgPT4ge307XG4gICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrQXJyID0gbmV3IFNldCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRUZW1wbGF0ZUhUTUwgPSBhc3luYyAoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgaHlwbzogSFlQTyxcbiAgICBpc0FycmF5OiBib29sZWFuXG4gICk6IFByb21pc2U8SVRlbXBhdGVQcm9wPiA9PiB7XG4gICAgY29uc3QgZ2V0SFRNTCA9IGFzeW5jICh0ZW1wbGF0ZVBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IG5ldyBQcm9taXNlPHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBmZXRjaCh0ZW1wbGF0ZVBhdGgpXG4gICAgICAgICAgLnRoZW4oKGh0bWwpID0+IHtcbiAgICAgICAgICAgIGlmIChodG1sLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlsZSBkbyBub3QgZG93bmxvYWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBodG1sLmJsb2IoKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQudGV4dCgpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oKHRleHQpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUodGV4dCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRIVE1MbWVtbyA9IG1lbW9pemUoZ2V0SFRNTCk7XG5cbiAgICBjb25zdCBodG1sVGVtcGxhdGUgPSBhd2FpdCBnZXRIVE1MbWVtbyhoeXBvLnRlbXBsYXRlUGF0aCk7XG4gICAgY29uc3QgaHRtbCA9IHRoaXMuaW5zZXJ0RGF0YUludG9IVE1MKGh0bWxUZW1wbGF0ZSwgaHlwby5kYXRhKTtcblxuICAgIHJldHVybiB7XG4gICAgICBodG1sOiBodG1sLFxuICAgICAgdGVtcGxhdGVLZXk6IGtleSxcbiAgICAgIG1hZ2ljS2V5OiBoeXBvLm1hZ2ljS2V5LFxuICAgICAgaXNBcnJheTogaXNBcnJheSxcbiAgICB9O1xuICB9O1xuXG4gIHByaXZhdGUgY29sbGVjdFRlbXBsYXRlcyhcbiAgICBoeXBvOiBIWVBPIHwgSFlQT1tdLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBpc0FycmF5OiBib29sZWFuXG4gICk6IEhZUE8ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGh5cG8pKSB7XG4gICAgICB0aGlzLmhhbmRsZUFycmF5SFlQTyhoeXBvLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYW5kbGVTaW1wbGVIWVBPKGh5cG8sIG5hbWUpO1xuICAgICAgdGhpcy50ZW1wbGF0ZXNQcm9taXNlcy5wdXNoKHRoaXMuZ2V0VGVtcGxhdGVIVE1MKG5hbWUsIGh5cG8sIGlzQXJyYXkpKTtcbiAgICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFja0Fyci5hZGQoaHlwby5hZnRlclJlbmRlckNhbGxiYWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUFycmF5SFlQTyhoeXBvczogSFlQT1tdLCBuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBoeXBvcy5mb3JFYWNoKChoeXBvKSA9PiB7XG4gICAgICB0aGlzLmNvbGxlY3RUZW1wbGF0ZXMoaHlwbywgYCR7bmFtZX1gLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlU2ltcGxlSFlQTyhoeXBvOiBIWVBPLCBfOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoaHlwby5jaGlsZHJlbikge1xuICAgICAgT2JqZWN0LmtleXMoaHlwby5jaGlsZHJlbikuZm9yRWFjaCgoY2hpbGROYW1lKSA9PiB7XG4gICAgICAgIGlmIChoeXBvLmNoaWxkcmVuKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdFRlbXBsYXRlcyhcbiAgICAgICAgICAgIGh5cG8uY2hpbGRyZW5bY2hpbGROYW1lXSxcbiAgICAgICAgICAgIGNoaWxkTmFtZSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbnNlcnREYXRhSW50b0hUTUwoXG4gICAgaHRtbFRlbXBsYXRlOiBzdHJpbmcsXG4gICAgZGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgKTogc3RyaW5nIHtcbiAgICBkYXRhID0gdGhpcy5nZXREYXRhV2l0aG91dEllcmFyaHkoZGF0YSk7XG4gICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcbiAgICAgIGlmICh0eXBlb2YgZGF0YVtrZXldICE9PSAnb2JqZWN0JyB8fCBkYXRhW2tleV0gPT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoJ3t7JyArIGtleSArICd9fScsICdnJyk7XG4gICAgICAgIGh0bWxUZW1wbGF0ZSA9IGh0bWxUZW1wbGF0ZS5yZXBsYWNlKG1hc2ssIFN0cmluZyhkYXRhW2tleV0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoL3t7W2Etei5fXSt9fS9nKTtcbiAgICBodG1sVGVtcGxhdGUgPSBodG1sVGVtcGxhdGUucmVwbGFjZShtYXNrLCAnJyk7XG4gICAgcmV0dXJuIGh0bWxUZW1wbGF0ZTtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydEFyclRlbXBsYXRlVG9NYXAoXG4gICAgdGVtcGxhdGVBcnI6IHtcbiAgICAgIGh0bWw6IHN0cmluZztcbiAgICAgIHRlbXBsYXRlS2V5OiBzdHJpbmc7XG4gICAgICBtYWdpY0tleTogc3RyaW5nO1xuICAgICAgaXNBcnJheTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICB9W11cbiAgKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gICAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgdGVtcGxhdGVBcnIuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgaHlwb0hUTUwgPSB0aGlzLnNldEh5cG9JRChpdGVtLmh0bWwsIGl0ZW0ubWFnaWNLZXkpO1xuICAgICAgaWYgKHJlc3VsdFtpdGVtLnRlbXBsYXRlS2V5XSkge1xuICAgICAgICByZXN1bHRbaXRlbS50ZW1wbGF0ZUtleV0gKz0gYCR7aHlwb0hUTUx9YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtgJHtpdGVtLnRlbXBsYXRlS2V5fS0ke2l0ZW0ubWFnaWNLZXl9YF0gPSBoeXBvSFRNTDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIHNldEh5cG9JRCA9IChodG1sOiBzdHJpbmcsIG1hZ2ljS2V5OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoL15bXXw8W2EteixBLVpdKy8sICdnbScpO1xuICAgIGNvbnN0IHBhcmVudFRhZyA9IHJlZy5leGVjKGh0bWwpPy5bMF07XG4gICAgaWYgKHBhcmVudFRhZykge1xuICAgICAgaHRtbCA9IGh0bWwucmVwbGFjZShwYXJlbnRUYWcsIGAke3BhcmVudFRhZ30gaHlwbz0ke21hZ2ljS2V5fWApO1xuICAgIH1cbiAgICByZXR1cm4gaHRtbDtcbiAgfTtcblxuICBwcml2YXRlIGluc2VydFRlbXBsYXRlSW50b1RlbXBsYXRlKFxuICAgIHJvb3RUZW1wbGF0ZUhUTUw6IHN0cmluZyxcbiAgICB0ZW1wbGF0ZUtleTogc3RyaW5nLFxuICAgIGNoaWxkVGVtcGxhdGVIVE1MOiBzdHJpbmcsXG4gICAgbWFnaWNLZXk6IHN0cmluZyxcbiAgICBpc0FycmF5OiBib29sZWFuXG4gICk6IHN0cmluZyB7XG4gICAgcm9vdFRlbXBsYXRlSFRNTCA9IHRoaXMuY3JlYXRlRWxlbVdyYXBwZXIoXG4gICAgICByb290VGVtcGxhdGVIVE1MLFxuICAgICAgdGVtcGxhdGVLZXksXG4gICAgICBtYWdpY0tleSxcbiAgICAgIGlzQXJyYXlcbiAgICApO1xuICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKGAtPSR7dGVtcGxhdGVLZXl9LSR7bWFnaWNLZXl9PS1gLCAnZycpO1xuICAgIHJvb3RUZW1wbGF0ZUhUTUwgPSByb290VGVtcGxhdGVIVE1MLnJlcGxhY2UobWFzaywgY2hpbGRUZW1wbGF0ZUhUTUwpO1xuICAgIHJldHVybiByb290VGVtcGxhdGVIVE1MO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFbGVtV3JhcHBlcihcbiAgICBodG1sVGVtcGxhdGU6IHN0cmluZyxcbiAgICB0ZW1wbGF0ZUtleTogc3RyaW5nLFxuICAgIG1hZ2ljS2V5OiBzdHJpbmcsXG4gICAgaXNBcnJheTogYm9vbGVhblxuICApIHtcbiAgICBjb25zdCBtYXNrID0gbmV3IFJlZ0V4cChgLT0ke3RlbXBsYXRlS2V5fT0tYCwgJ2cnKTtcbiAgICBpZiAoaXNBcnJheSkge1xuICAgICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UoXG4gICAgICAgIG1hc2ssXG4gICAgICAgIGAtPSR7dGVtcGxhdGVLZXl9LSR7bWFnaWNLZXl9PS0tPSR7dGVtcGxhdGVLZXl9PS1gXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBodG1sVGVtcGxhdGUgPSBodG1sVGVtcGxhdGUucmVwbGFjZShcbiAgICAgICAgbWFzayxcbiAgICAgICAgYC09JHt0ZW1wbGF0ZUtleX0tJHttYWdpY0tleX09LWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGh0bWxUZW1wbGF0ZTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJFbXRweUNvbXBvbmVudChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJlZ2V4ID0gLy09W2EteixBLVosMC05XSs9LS9nO1xuICAgIHJldHVybiBodG1sLnJlcGxhY2UocmVnZXgsICcnKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIgPSBhc3luYyAoZGF0YT86IFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogUHJvbWlzZTxIWVBPPiA9PiB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IHsuLi50aGlzLmRhdGEsIC4uLmRhdGF9O1xuICAgIH1cbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICB0aGlzLmNvbGxlY3RUZW1wbGF0ZXModGhpcywgJ3Jvb3QnLCBmYWxzZSkudGVtcGxhdGVzUHJvbWlzZXNcbiAgICApLnRoZW4oKGFycmF5VGVtcGxhdGVzKSA9PiB7XG4gICAgICBjb25zdCBtYXBUZW1wbGF0ZXMgPSB0aGlzLmNvbnZlcnRBcnJUZW1wbGF0ZVRvTWFwKGFycmF5VGVtcGxhdGVzKTtcbiAgICAgIGxldCByb290VGVtcGxhdGVIVE1MOiBzdHJpbmcgPVxuICAgICAgICBhcnJheVRlbXBsYXRlc1thcnJheVRlbXBsYXRlcy5sZW5ndGggLSAxXS5odG1sO1xuXG4gICAgICBmb3IgKGxldCBpID0gYXJyYXlUZW1wbGF0ZXMubGVuZ3RoIC0gMjsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlID1cbiAgICAgICAgICBtYXBUZW1wbGF0ZXNbXG4gICAgICAgICAgICBgJHthcnJheVRlbXBsYXRlc1tpXS50ZW1wbGF0ZUtleX0tJHthcnJheVRlbXBsYXRlc1tpXS5tYWdpY0tleX1gXG4gICAgICAgICAgXTtcbiAgICAgICAgcm9vdFRlbXBsYXRlSFRNTCA9IHRoaXMuaW5zZXJ0VGVtcGxhdGVJbnRvVGVtcGxhdGUoXG4gICAgICAgICAgcm9vdFRlbXBsYXRlSFRNTCxcbiAgICAgICAgICBhcnJheVRlbXBsYXRlc1tpXS50ZW1wbGF0ZUtleSxcbiAgICAgICAgICB0ZW1wbGF0ZSxcbiAgICAgICAgICBhcnJheVRlbXBsYXRlc1tpXS5tYWdpY0tleSxcbiAgICAgICAgICBhcnJheVRlbXBsYXRlc1tpXS5pc0FycmF5XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJvb3RUZW1wbGF0ZUhUTUwgPSB0aGlzLmNsZWFyRW10cHlDb21wb25lbnQocm9vdFRlbXBsYXRlSFRNTCk7XG5cbiAgICAgIGlmICh0aGlzLnJlbmRlclRvKSB7XG4gICAgICAgIHRoaXMucmVuZGVyVG8uaW5uZXJIVE1MID0gcm9vdFRlbXBsYXRlSFRNTDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbaHlwbz1cIiR7dGhpcy5tYWdpY0tleX1cIl1gKTtcbiAgICAgICAgaWYgKGVsZW0pIHtcbiAgICAgICAgICB0aGlzLnJlbmRlclRvID0gZWxlbSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IHJvb3RUZW1wbGF0ZUhUTUw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrQXJyLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy50ZW1wbGF0ZXNQcm9taXNlcyA9IFtdO1xuXG4gICAgICByZXR1cm4gdGhhdDtcbiAgICB9KTtcbiAgfTtcblxuICBwcml2YXRlIHJlcmVuZGVyKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U3RhdGUoKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICAgIHRoaXMuc3RvcmUgPSB0aGlzLmNyZWF0ZVN0b3JlKHRoaXMuZGF0YSk7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmU7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVN0b3JlKHN0b3JlOiBhbnkpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICBjb25zdCBoYW5kbGVyOiBQcm94eUhhbmRsZXI8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+ID0ge1xuICAgICAgZ2V0KHRhcmdldCwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFs8c3RyaW5nPnByb3BlcnR5XTtcbiAgICAgIH0sXG4gICAgICBzZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0WzxzdHJpbmc+cHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgIHRoYXQucmVyZW5kZXIoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgIH07XG4gICAgc3RvcmUgPSBuZXcgUHJveHkoc3RvcmUsIGhhbmRsZXIpO1xuXG4gICAgT2JqZWN0LmtleXMoc3RvcmUpLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHN0b3JlW2ZpZWxkXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgc3RvcmVbZmllbGRdID0gbmV3IFByb3h5KHN0b3JlW2ZpZWxkXSwgaGFuZGxlcik7XG4gICAgICAgIHRoaXMuY3JlYXRlU3RvcmUoc3RvcmVbZmllbGRdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBzdG9yZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGF0YVdpdGhvdXRJZXJhcmh5KGRhdGE6IGFueSkge1xuICAgIGxldCBwYXRoQXJyOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCByZXN1bHRPYmplY3Q6IGFueSA9IHt9O1xuICAgIGZ1bmN0aW9uIGZueihvYmo6IGFueSkge1xuICAgICAgZm9yIChsZXQga2V5IGluIG9iaikge1xuICAgICAgICBwYXRoQXJyLnB1c2goa2V5KTtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBmbnoob2JqW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdE9iamVjdFtwYXRoQXJyLmpvaW4oJy4nKV0gPSBvYmpba2V5XTtcbiAgICAgICAgICBwYXRoQXJyLnBvcCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwYXRoQXJyLnBvcCgpO1xuICAgIH1cbiAgICBmbnooZGF0YSk7XG5cbiAgICByZXR1cm4gcmVzdWx0T2JqZWN0O1xuICB9XG5cbiAgcHVibGljIGFmdGVyUmVuZGVyKGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogSFlQTyB7XG4gICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgaGlkZSgpIHtcbiAgICBpZiAodGhpcy5yZW5kZXJUbykge1xuICAgICAgbGV0IGNoaWxkcmVuO1xuXG4gICAgICBjaGlsZHJlbiA9IHRoaXMucmVuZGVyVG8uY2hpbGRyZW47XG4gICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgICAgICBjaGlsZC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwidHlwZSBRdWVyeVBhcmFtc1ZhbHVlID1cbiAgfCBudWxsXG4gIHwgdW5kZWZpbmVkXG4gIHwgc3RyaW5nXG4gIHwgbnVtYmVyXG4gIHwgQXJyYXk8c3RyaW5nIHwgbnVtYmVyPjtcblxuY2xhc3MgUXVlcnlVdGlscyB7XG4gIGdldFF1ZXJ5UGFyYW1zU3RyKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdChcIj9cIilbMV0gfHwgbnVsbDtcbiAgfVxuXG4gIGdldFF1ZXJ5UGFyYW1zT2JqID0gKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPT4ge1xuICAgIGNvbnN0IGZpbHRlclVybFN0cmluZyA9IHRoaXMuZ2V0UXVlcnlQYXJhbXNTdHIoKTtcbiAgICBpZiAoZmlsdGVyVXJsU3RyaW5nID09PSBudWxsKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlclVybFN0cmluZ1xuICAgICAgLnNwbGl0KFwiJlwiKVxuICAgICAgLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gaXRlbS5zcGxpdChcIj1cIik7XG4gICAgICB9KVxuICAgICAgLnJlZHVjZSgocHJldiwgbmV4dCkgPT4ge1xuICAgICAgICBjb25zdCBbZmlsdGVyTmFtZSwgZmlsdGVyVmFsdWVdID0gbmV4dDtcbiAgICAgICAgY29uc3QgaXNBcnJheVZhbHVlID0gdGhpcy5jaGVja1N0cmluZ0lzQXJyYXlWYWx1ZShmaWx0ZXJWYWx1ZSk7XG5cbiAgICAgICAgaWYgKGlzQXJyYXlWYWx1ZSkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leHRyYWN0QXJyYXlGcm9tU3RyaW5nKGZpbHRlclZhbHVlKTtcbiAgICAgICAgICByZXR1cm4geyAuLi5wcmV2LCAuLi57IFtmaWx0ZXJOYW1lXTogdmFsdWUgfSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgLi4ucHJldiwgLi4ueyBbZmlsdGVyTmFtZV06IHdpbmRvdy5kZWNvZGVVUkkoZmlsdGVyVmFsdWUpIH0gfTtcbiAgICAgIH0sIHt9KTtcbiAgfTtcblxuICBzZXRRdWVyeVBhcmFtc1N0ciA9IChwYXJhbXM6IHN0cmluZykgPT4ge1xuICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShcbiAgICAgIHsgcGFyYW1zOiBwYXJhbXMgfSxcbiAgICAgIFwiXCIsXG4gICAgICBgJHt3aW5kb3cubG9jYXRpb24uaGFzaC5zcGxpdChcIj9cIilbMF19JHtwYXJhbXMgPyBcIj9cIiA6IFwiXCJ9JHtwYXJhbXN9YFxuICAgICk7XG4gIH07XG5cbiAgc2V0UXVlcnlQYXJhbXNPYmogPSAoXG4gICAgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBRdWVyeVBhcmFtc1ZhbHVlPixcbiAgICByZXBsYWNlPzogYm9vbGVhblxuICApID0+IHtcbiAgICBjb25zdCBxdWVyeVBhcmFtczogc3RyaW5nID0gdGhpcy5jb21waWxlRmlsdGVycyhwYXJhbXMpO1xuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoXG4gICAgICAgIG51bGwsXG4gICAgICAgIFwiXCIsXG4gICAgICAgIGAke3dpbmRvdy5sb2NhdGlvbi5oYXNoLnNwbGl0KFwiP1wiKVswXX0ke1xuICAgICAgICAgIHF1ZXJ5UGFyYW1zID8gXCI/XCIgOiBcIlwiXG4gICAgICAgIH0ke3F1ZXJ5UGFyYW1zfWBcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShcbiAgICAgICAgbnVsbCxcbiAgICAgICAgXCJcIixcbiAgICAgICAgYCR7d2luZG93LmxvY2F0aW9uLmhhc2guc3BsaXQoXCI/XCIpWzBdfSR7XG4gICAgICAgICAgcXVlcnlQYXJhbXMgPyBcIj9cIiA6IFwiXCJcbiAgICAgICAgfSR7cXVlcnlQYXJhbXN9YFxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBjb21waWxlRmlsdGVycyA9IChcbiAgICBmaWx0ZXJzOiBSZWNvcmQ8c3RyaW5nLCBRdWVyeVBhcmFtc1ZhbHVlPlxuICApOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGFycmF5RmlsdGVycyA9IFtdO1xuXG4gICAgZm9yIChsZXQga2V5IGluIGZpbHRlcnMpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGZpbHRlcnNba2V5XSkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSAoZmlsdGVyc1trZXldIGFzIEFycmF5PHVua25vd24+KS5qb2luKFwiJVwiKTtcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBhcnJheUZpbHRlcnMucHVzaChgJHtrZXl9PVske2VuY29kZVVSSShgJHt2YWx1ZX1gKX1dYCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmaWx0ZXJzW2tleV0gfHwgZmlsdGVyc1trZXldID09PSAwKSB7XG4gICAgICAgICAgYXJyYXlGaWx0ZXJzLnB1c2goYCR7a2V5fT0ke2ZpbHRlcnNba2V5XX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcnJheUZpbHRlcnMuam9pbihcIiZcIik7XG4gIH07XG5cbiAgcHJpdmF0ZSBjaGVja1N0cmluZ0lzQXJyYXlWYWx1ZSA9ICh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZGVjb2RlVVJJKHZhbHVlKS5tYXRjaCgvXlxcW1tcXGQlXStcXF0kL2dtKSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBleHRyYWN0QXJyYXlGcm9tU3RyaW5nID0gKHZhbHVlOiBzdHJpbmcpOiBSZWdFeHBNYXRjaEFycmF5IHwgbnVsbCA9PiB7XG4gICAgY29uc3QgcmVnZXggPSAvW1xcZCxhLXosQS1aLNCwLdGPLNCQLdCvLF8tXSsvZ207XG4gICAgcmV0dXJuIGRlY29kZVVSSSh2YWx1ZSkubWF0Y2gocmVnZXgpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBRdWVyeVV0aWxzO1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi9IWVBPL0hZUE9cIjtcblxuY2xhc3MgUm91dGUge1xuICBwcml2YXRlIF9wYXRobmFtZTogc3RyaW5nID0gXCJcIjtcbiAgcHJpdmF0ZSBfYmxvY2s/OiAocmVzdWx0PzogYW55KSA9PiBIWVBPO1xuICBwcml2YXRlIF9wcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIGFzeW5jRk4/OiAoKSA9PiBQcm9taXNlPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcGF0aG5hbWU6IHN0cmluZyxcbiAgICB2aWV3OiAoKSA9PiBIWVBPLFxuICAgIHByb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgICBhc3luY0ZOPzogKCkgPT4gUHJvbWlzZTxhbnk+XG4gICkge1xuICAgIHRoaXMuX3BhdGhuYW1lID0gcGF0aG5hbWUuc3BsaXQoXCI/XCIpWzBdO1xuICAgIHRoaXMuX3Byb3BzID0gcHJvcHM7XG4gICAgdGhpcy5fYmxvY2sgPSB2aWV3O1xuICAgIHRoaXMuYXN5bmNGTiA9IGFzeW5jRk47XG4gIH1cblxuICBuYXZpZ2F0ZShwYXRobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubWF0Y2gocGF0aG5hbWUpKSB7XG4gICAgICB0aGlzLl9wYXRobmFtZSA9IHBhdGhuYW1lO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICBsZWF2ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fYmxvY2spIHtcbiAgICAgIHRoaXMuX2Jsb2NrKCkuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIG1hdGNoKHBhdGhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNFcXVhbChwYXRobmFtZSwgdGhpcy5fcGF0aG5hbWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5fYmxvY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuYXN5bmNGTikge1xuICAgICAgdGhpcy5hc3luY0ZOKCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIHRoaXMuX2Jsb2NrPy4ocmVzdWx0KS5yZW5kZXIoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ibG9jaygpLnJlbmRlcigpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUm91dGVyIHtcbiAgcHJpdmF0ZSBfX2luc3RhbmNlOiBSb3V0ZXIgPSB0aGlzO1xuICByb3V0ZXM6IFJvdXRlW10gPSBbXTtcbiAgcHJpdmF0ZSBoaXN0b3J5OiBIaXN0b3J5ID0gd2luZG93Lmhpc3Rvcnk7XG4gIHByaXZhdGUgX2N1cnJlbnRSb3V0ZTogUm91dGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfcm9vdFF1ZXJ5OiBzdHJpbmcgPSBcIlwiO1xuXG4gIGNvbnN0cnVjdG9yKHJvb3RRdWVyeTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX19pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX19pbnN0YW5jZTtcbiAgICB9XG4gICAgdGhpcy5fcm9vdFF1ZXJ5ID0gcm9vdFF1ZXJ5LnNwbGl0KFwiP1wiKVswXTtcbiAgfVxuXG4gIHVzZShcbiAgICBwYXRobmFtZTogc3RyaW5nLFxuICAgIGJsb2NrOiAocmVzdWx0PzogYW55KSA9PiBIWVBPLFxuICAgIGFzeW5jRk4/OiAoKSA9PiBQcm9taXNlPGFueT5cbiAgKTogUm91dGVyIHtcbiAgICBjb25zdCByb3V0ZSA9IG5ldyBSb3V0ZShcbiAgICAgIHBhdGhuYW1lLFxuICAgICAgYmxvY2ssXG4gICAgICB7IHJvb3RRdWVyeTogdGhpcy5fcm9vdFF1ZXJ5IH0sXG4gICAgICBhc3luY0ZOXG4gICAgKTtcbiAgICB0aGlzLnJvdXRlcy5wdXNoKHJvdXRlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN0YXJ0KCk6IFJvdXRlciB7XG4gICAgd2luZG93Lm9ucG9wc3RhdGUgPSAoXzogUG9wU3RhdGVFdmVudCkgPT4ge1xuICAgICAgbGV0IG1hc2sgPSBuZXcgUmVnRXhwKFwiI1wiLCBcImdcIik7XG4gICAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKG1hc2ssIFwiXCIpO1xuICAgICAgdGhpcy5fb25Sb3V0ZSh1cmwpO1xuICAgIH07XG4gICAgbGV0IG1hc2sgPSBuZXcgUmVnRXhwKFwiI1wiLCBcImdcIik7XG4gICAgY29uc3QgdXJsID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZShtYXNrLCBcIlwiKSB8fCBcIi9cIjtcbiAgICB0aGlzLl9vblJvdXRlKHVybCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfb25Sb3V0ZShwYXRobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgcm91dGUgPSB0aGlzLmdldFJvdXRlKHBhdGhuYW1lKTtcbiAgICBpZiAoIXJvdXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9jdXJyZW50Um91dGUpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRSb3V0ZS5sZWF2ZSgpO1xuICAgIH1cbiAgICB0aGlzLl9jdXJyZW50Um91dGUgPSByb3V0ZTtcbiAgICB0aGlzLl9jdXJyZW50Um91dGUucmVuZGVyKCk7XG4gIH1cblxuICBnbyhwYXRobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgYCMke3BhdGhuYW1lfWApO1xuICAgIHRoaXMuX29uUm91dGUocGF0aG5hbWUpO1xuICB9XG5cbiAgYmFjaygpOiB2b2lkIHtcbiAgICB0aGlzLmhpc3RvcnkuYmFjaygpO1xuICB9XG5cbiAgZm9yd2FyZCgpOiB2b2lkIHtcbiAgICB0aGlzLmhpc3RvcnkuZm9yd2FyZCgpO1xuICB9XG5cbiAgZ2V0Um91dGUocGF0aG5hbWU6IHN0cmluZyk6IFJvdXRlIHwgdW5kZWZpbmVkIHtcbiAgICBwYXRobmFtZSA9IHBhdGhuYW1lLnNwbGl0KFwiP1wiKVswXTtcbiAgICByZXR1cm4gdGhpcy5yb3V0ZXMuZmluZCgocm91dGUpID0+IHJvdXRlLm1hdGNoKHBhdGhuYW1lKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNFcXVhbChsaHM6IHVua25vd24sIHJoczogdW5rbm93bikge1xuICByZXR1cm4gbGhzID09PSByaHM7XG59XG4iLCJpbXBvcnQge0hZUE99IGZyb20gJy4uL0hZUE8vSFlQTyc7XG5cbmxldCBjb21wb25lbnRzOiBhbnkgPSB7fTtcbmNvbnN0IG1hcENvbXBvbmVudCA9IG5ldyBNYXA8UmVjb3JkPHN0cmluZywgYW55PiwgSFlQTz4oKTtcblxuY2xhc3MgX1N0b3JlIHtcbiAgcHVibGljIHN0b3JlOiBhbnk7XG5cbiAgY29uc3RydWN0b3Ioc3RvcmU6IGFueSkge1xuICAgIHRoaXMuc3RvcmUgPSBuZXcgUHJveHk8YW55PihzdG9yZSwge1xuICAgICAgZ2V0OiAodGFyZ2V0OiBhbnksIHByb3A6IHN0cmluZyB8IG51bWJlciB8IHN5bWJvbCwgcmVjZWl2ZXI6IGFueSkgPT4ge1xuICAgICAgICAvLyBjb21wb25lbnRzW3Byb3BdID0gdHJ1ZTtcbiAgICAgICAgLy8gcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICAgIH0sXG4gICAgICBzZXQ6ICh0YXJnZXQ6IGFueSwgcHJvcDogc3RyaW5nLCB2YWx1ZTogYW55LCByZWNlaXZlcjogYW55KTogYm9vbGVhbiA9PiB7XG4gICAgICAgIC8vIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAvLyBmb3IgKGxldCBbdXNhYmxlUHJvcHMsIGNvbXBvbmVudF0gb2YgbWFwQ29tcG9uZW50LmVudHJpZXMoKSkge1xuICAgICAgICAvLyAgIGlmICh1c2FibGVQcm9wc1twcm9wXSkge1xuICAgICAgICAvLyAgICAgY29tcG9uZW50LnJlbmRlcih0YXJnZXQpO1xuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxubGV0IF9jb21wb25lbnQ6IEhZUE87XG5cbmxldCBpc0NvbXBvbmVudCA9IGZhbHNlO1xuXG5jb25zdCBWaWV3TW9kZWxzOiBSZWNvcmQ8c3RyaW5nLCBBcnJheTxIWVBPPj4gPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmVyPFQ+KGNvbXBvbmVudDogKHByb3BzOiBUKSA9PiBIWVBPKSB7XG4gIHJldHVybiAocHJvcHM6IFQpID0+IHtcbiAgICBpc0NvbXBvbmVudCA9IHRydWU7XG4gICAgX2NvbXBvbmVudCA9IGNvbXBvbmVudChwcm9wcyk7XG4gICAgcmVjZWl2ZXJzQXJyLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgaWYgKFZpZXdNb2RlbHNbaXRlbS5jb25zdHJ1Y3Rvci5uYW1lXSkge1xuICAgICAgICBWaWV3TW9kZWxzW2l0ZW0uY29uc3RydWN0b3IubmFtZV0ucHVzaChfY29tcG9uZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFZpZXdNb2RlbHNbaXRlbS5jb25zdHJ1Y3Rvci5uYW1lXSA9IFtfY29tcG9uZW50XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpc0NvbXBvbmVudCA9IGZhbHNlO1xuICAgIG1hcENvbXBvbmVudC5zZXQoY29tcG9uZW50cywgX2NvbXBvbmVudCk7XG4gICAgY29tcG9uZW50cyA9IHt9O1xuICAgIHJldHVybiBfY29tcG9uZW50O1xuICB9O1xufVxuXG5jb25zdCBfU3RvcmVHbG9iYWw6IFJlY29yZDxzdHJpbmcsIE9iamVjdD4gPSB7fTtcblxuY29uc3QgbWFwSHlwb1RvVmlld01vZGVsID0gbmV3IE1hcDxIWVBPLCBhbnk+KCk7XG5cbmNvbnN0IHJlY2VpdmVyc0FyciA9IG5ldyBTZXQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VPYnNlcnZhYmxlPFQ+KFxuICB0aGF0OiBUaGlzVHlwZTxUPixcbiAgc3RhdGU6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+XG4pIHtcbiAgY29uc3QgZW50aXR5U3RhdGU6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgbmFtZSA9IHRoYXQuY29uc3RydWN0b3IubmFtZTtcbiAgY29uc3QgeHh4ID0gey4uLnRoYXR9O1xuXG4gIC8vQHRzLWlnbm9yZVxuICBjb25zdCBwcm90byA9IHRoYXQuX19wcm90b19fO1xuXG4gIGZvciAobGV0IGtleSBpbiB0aGF0KSB7XG4gICAgaWYgKHN0YXRlW2tleV0pIHtcbiAgICAgIGlmICh0eXBlb2YgdGhhdFtrZXkgYXMga2V5b2YgdHlwZW9mIHRoYXRdID09PSAnb2JqZWN0Jykge1xuICAgICAgICBlbnRpdHlTdGF0ZVtrZXldID0gbmV3IFByb3h5KHh4eFtrZXkgYXMga2V5b2YgdHlwZW9mIHRoYXRdLCB7XG4gICAgICAgICAgc2V0OiAodGFyZ2V0OiBhbnksIHByb3A6IHN0cmluZywgdmFsdWU6IGFueSwgcmVjZWl2ZXI6IGFueSkgPT4ge1xuICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIFZpZXdNb2RlbHM/LltyZWNlaXZlci5jb25zdHJ1Y3Rvci5uYW1lXT8uZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgIGNvbXBvbmVudC5yZW5kZXIodGFyZ2V0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXQ6ICh0YXJnZXQ6IGFueSwgcHJvcDogc3RyaW5nIHwgbnVtYmVyIHwgc3ltYm9sLCByZWNlaXZlcjogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNDb21wb25lbnQpIHJlY2VpdmVyc0Fyci5hZGQocmVjZWl2ZXIpO1xuICAgICAgICAgICAgY29tcG9uZW50c1twcm9wXSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW50aXR5U3RhdGVba2V5XSA9IHh4eFtrZXkgYXMga2V5b2YgdHlwZW9mIHRoYXRdO1xuICAgICAgfVxuXG4gICAgICBkZWxldGUgdGhhdFtrZXkgYXMga2V5b2YgdHlwZW9mIHRoYXRdO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9ic2VydmFibGVWYWxpZGF0aW9uID0ge1xuICAgIHNldDogKHRhcmdldDogYW55LCBwcm9wOiBzdHJpbmcsIHZhbHVlOiBhbnksIHJlY2VpdmVyOiBhbnkpID0+IHtcbiAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgVmlld01vZGVscz8uW3JlY2VpdmVyLmNvbnN0cnVjdG9yLm5hbWVdPy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgY29tcG9uZW50LnJlbmRlcih0YXJnZXQpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIC8vQHRzLWlnbm9yZVxuICAgIGdldDogKHRhcmdldDogYW55LCBwcm9wOiBzdHJpbmcgfCBudW1iZXIgfCBzeW1ib2wsIHJlY2VpdmVyOiBhbnkpID0+IHtcbiAgICAgIGlmIChpc0NvbXBvbmVudCkgcmVjZWl2ZXJzQXJyLmFkZChyZWNlaXZlcik7XG4gICAgICBjb21wb25lbnRzW3Byb3BdID0gdHJ1ZTtcbiAgICAgIC8vIGlmICh0YXJnZXRbcHJvcF0gJiYgdHlwZW9mIHRhcmdldFtwcm9wXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIC8vICAgdGFyZ2V0W3Byb3BdID0gbmV3IFByb3h5KHRhcmdldFtwcm9wXSwgb2JzZXJ2YWJsZVZhbGlkYXRpb24pO1xuICAgICAgLy8gICByZXR1cm4gbmV3IFByb3h5KHRhcmdldFtwcm9wXSwgb2JzZXJ2YWJsZVZhbGlkYXRpb24pO1xuICAgICAgLy8gfVxuICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IHByb3h5ID0gbmV3IFByb3h5KGVudGl0eVN0YXRlLCBvYnNlcnZhYmxlVmFsaWRhdGlvbik7XG5cbiAgcHJveHkuX19wcm90b19fID0gcHJvdG87XG5cbiAgLy9AdHMtaWdub3JlXG4gIHRoYXQuX19wcm90b19fID0gcHJveHk7XG5cbiAgX1N0b3JlR2xvYmFsW25hbWVdID0gcHJveHk7XG59XG5cbmV4cG9ydCBjb25zdCBvYnNlcnZhYmxlID0gdHJ1ZTtcbiIsImNvbnN0IE1FVEhPRFMgPSB7XG4gIEdFVDogXCJHRVRcIixcbiAgUFVUOiBcIlBVVFwiLFxuICBQT1NUOiBcIlBPU1RcIixcbiAgREVMRVRFOiBcIkRFTEVURVwiLFxufTtcblxuY29uc3QgRE9NRU4gPSBcImh0dHBzOi8veWEtcHJha3Rpa3VtLnRlY2gvYXBpL3YyXCI7XG5cbmNsYXNzIEhUVFBUcmFuc3BvcnRDbGFzcyB7XG4gIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGhlYWRlcnM6IHt9LFxuICAgIGRhdGE6IHt9LFxuICB9O1xuXG4gIEdFVCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHRoaXMuZGVmYXVsdE9wdGlvbnNcbiAgKSA9PiB7XG4gICAgY29uc3QgcmVxdWVzdFBhcmFtcyA9IHF1ZXJ5U3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgdXJsICs9IHJlcXVlc3RQYXJhbXM7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcbiAgICAgIHVybCxcbiAgICAgIHsgLi4ub3B0aW9ucywgbWV0aG9kOiBNRVRIT0RTLkdFVCB9LFxuICAgICAgTnVtYmVyKG9wdGlvbnMudGltZW91dCkgfHwgNTAwMFxuICAgICk7XG4gIH07XG5cbiAgUFVUID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9ID0gdGhpcy5kZWZhdWx0T3B0aW9uc1xuICApID0+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFxuICAgICAgdXJsLFxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuUFVUIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcblxuICBQT1NUID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyPiB9ID0gdGhpc1xuICAgICAgLmRlZmF1bHRPcHRpb25zXG4gICkgPT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXG4gICAgICB1cmwsXG4gICAgICB7IC4uLm9wdGlvbnMsIG1ldGhvZDogTUVUSE9EUy5QT1NUIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcblxuICBERUxFVEUgPSAoXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB0aGlzLmRlZmF1bHRPcHRpb25zXG4gICkgPT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXG4gICAgICB1cmwsXG4gICAgICB7IC4uLm9wdGlvbnMsIG1ldGhvZDogTUVUSE9EUy5ERUxFVEUgfSxcbiAgICAgIE51bWJlcihvcHRpb25zLnRpbWVvdXQpIHx8IDUwMDBcbiAgICApO1xuICB9O1xuXG4gIHNvY2tldCA9ICh1cmw6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBuZXcgV2ViU29ja2V0KHVybCk7XG4gIH07XG5cbiAgcmVxdWVzdCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSB8IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgdGltZW91dDogbnVtYmVyID0gNTAwMFxuICApID0+IHtcbiAgICB1cmwgPSBET01FTiArIHVybDtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgeGhyLm9wZW4oPHN0cmluZz5vcHRpb25zLm1ldGhvZCwgdXJsKTtcbiAgICAgIGNvbnN0IGhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnM7XG4gICAgICBmb3IgKGxldCBoZWFkZXIgaW4gaGVhZGVycyBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaGVhZGVyc1toZWFkZXIgYXMga2V5b2YgdHlwZW9mIGhlYWRlcnNdIGFzIHN0cmluZztcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICByZXNvbHZlKHhocik7XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSAoZSkgPT4ge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9O1xuICAgICAgeGhyLm9uYWJvcnQgPSAoZSkgPT4ge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9O1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgfSwgdGltZW91dCk7XG5cbiAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSkpO1xuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBxdWVyeVN0cmluZ2lmeShkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gIGxldCByZXF1ZXN0UGFyYW1zID0gXCI/XCI7XG4gIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAgcmVxdWVzdFBhcmFtcyArPSBgJHtrZXl9PSR7ZGF0YVtrZXldfSZgO1xuICB9XG4gIHJlcXVlc3RQYXJhbXMgPSByZXF1ZXN0UGFyYW1zLnN1YnN0cmluZygwLCByZXF1ZXN0UGFyYW1zLmxlbmd0aCAtIDEpO1xuICByZXR1cm4gcmVxdWVzdFBhcmFtcztcbn1cblxuZXhwb3J0IGNvbnN0IEhUVFBUcmFuc3BvcnQgPSAoKCk6IHsgZ2V0SW5zdGFuY2U6ICgpID0+IEhUVFBUcmFuc3BvcnRDbGFzcyB9ID0+IHtcbiAgbGV0IGluc3RhbmNlOiBIVFRQVHJhbnNwb3J0Q2xhc3M7XG4gIHJldHVybiB7XG4gICAgZ2V0SW5zdGFuY2U6ICgpID0+IGluc3RhbmNlIHx8IChpbnN0YW5jZSA9IG5ldyBIVFRQVHJhbnNwb3J0Q2xhc3MoKSksXG4gIH07XG59KSgpO1xuIiwiaW1wb3J0IHtIWVBPfSBmcm9tICcuLi8uLi9IWVBPL0hZUE8nO1xuXG5leHBvcnQgY29uc3QgRW1haWxWYWxpZGF0b3IgPSB7XG4gIHZhbHVlOiAnJyxcbiAgY2hlY2tGdW5jOiBmdW5jdGlvbiAodmFsdWU6IHN0cmluZykge1xuICAgIHZhciByZWcgPSAvXihbQS1aYS16MC05X1xcLVxcLl0pK1xcQChbQS1aYS16MC05X1xcLVxcLl0pK1xcLihbQS1aYS16XXsyLDR9KSQvO1xuICAgIGlmICghcmVnLnRlc3QodmFsdWUpKSB7XG4gICAgICB0aGlzLnZhbHVlID0gJyc7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgY2FsbGJhY2s6IChlbGVtOiBIWVBPLCBjaGVja1Jlc3VsdDogYm9vbGVhbikgPT4ge1xuICAgIGxldCBzdGF0ZSA9IGVsZW0uZ2V0U3RhdGUoKTtcbiAgICBpZiAoIWNoZWNrUmVzdWx0KSB7XG4gICAgICBzdGF0ZS5tZXNzYWdlID0gJ+KblCDRjdGC0L4g0L3QtSDQv9C+0YXQvtC20LUg0L3QsCDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRiyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSAnJztcbiAgICB9XG4gIH0sXG59O1xuIiwiaW1wb3J0IHtIWVBPfSBmcm9tICcuLi8uLi9IWVBPL0hZUE8nO1xuXG5leHBvcnQgY29uc3QgUmVxdWlyZWQgPSB7XG4gIHZhbHVlOiAnJyxcbiAgY2hlY2tGdW5jOiBmdW5jdGlvbiAodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgIHRoaXMudmFsdWUgPSAnJztcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBjYWxsYmFjazogKGVsZW06IEhZUE8sIGNoZWNrUmVzdWx0OiBib29sZWFuKSA9PiB7XG4gICAgbGV0IHN0YXRlID0gZWxlbS5nZXRTdGF0ZSgpO1xuICAgIGlmICghY2hlY2tSZXN1bHQpIHtcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSAn4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSAnJztcbiAgICB9XG4gIH0sXG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIHV1aWR2NCgpIHtcbiAgcmV0dXJuIFwieHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4XCIucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHZhciByID0gKE1hdGgucmFuZG9tKCkgKiAxNikgfCAwLFxuICAgICAgdiA9IGMgPT0gXCJ4XCIgPyByIDogKHIgJiAweDMpIHwgMHg4O1xuICAgIHJldHVybiBgJHt2LnRvU3RyaW5nKDE2KX1gO1xuICB9KTtcbn0iLCJpbXBvcnQgeyBMb2dpbkxheW91dCB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL0xvZ2luXCI7XG5pbXBvcnQgeyBDaGF0TGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvQ2hhdFwiO1xuaW1wb3J0IHsgUmVnaXN0cmF0aW9uTGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvUmVnaXN0cmF0aW9uXCI7XG5pbXBvcnQgeyBQcm9maWxlTGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvUHJvZmlsZVwiO1xuaW1wb3J0IHsgQ2hhbmdlUHJvZmlsZSB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL0NoYW5nZVByb2ZpbGVcIjtcbmltcG9ydCB7IENoYW5nZVBhc3N3b3JkIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvQ2hhbmdlUGFzc3dvcmRcIjtcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gXCIuLi9saWJzL1JvdXRlclwiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi9saWJzL1RyYW5zcG9ydFwiO1xuaW1wb3J0IHsgSUNoYXRWaWV3TW9kZWwgfSBmcm9tIFwiLi4vVmlld01vZGVsL0NoYXRWaWV3TW9kZWxcIjtcbmltcG9ydCB7IFZJRVdfTU9ERUwgfSBmcm9tIFwiLi4vVmlld01vZGVsXCI7XG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcbmltcG9ydCB7IElVc2VyVmlld01vZGVsIH0gZnJvbSBcIi4uL1ZpZXdNb2RlbC9Vc2VyVmlld01vZGVsXCI7XG5cbmV4cG9ydCBjb25zdCBBcHBJbml0ID0gKGNvbnRhaW5lcjogQ29udGFpbmVyKTogUm91dGVyID0+IHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIoXCIjcm9vdFwiKVxuICAgIC51c2UoXCIvXCIsIExvZ2luTGF5b3V0LCAoKSA9PiB7XG4gICAgICByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAgIC5HRVQoXCIvYXV0aC91c2VyXCIpXG4gICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodXNlci5yZXNwb25zZSk7XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLnVzZShcIi9yZWdpc3RyYXRpb25cIiwgUmVnaXN0cmF0aW9uTGF5b3V0KVxuICAgIC51c2UoXCIvY2hhdFwiLCBDaGF0TGF5b3V0LCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjaGF0Vmlld01vZGVsID0gY29udGFpbmVyLmdldDxJQ2hhdFZpZXdNb2RlbD4oVklFV19NT0RFTC5DSEFUKTtcbiAgICAgIGF3YWl0IGNoYXRWaWV3TW9kZWwuZ2V0Q2hhdHMoKTtcbiAgICAgIHJldHVybiBjaGF0Vmlld01vZGVsLmNoYXRzO1xuICAgIH0pXG4gICAgLnVzZShcIi9wcm9maWxlXCIsIFByb2ZpbGVMYXlvdXQsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElVc2VyVmlld01vZGVsPihWSUVXX01PREVMLlVTRVIpO1xuICAgICAgYXdhaXQgdXNlclZpZXdNb2RlbC5nZXRVc2VyKCk7XG4gICAgICByZXR1cm4gdXNlclZpZXdNb2RlbC51c2VyO1xuICAgIH0pXG4gICAgLnVzZShcIi9lZGl0cHJvZmlsZVwiLCBDaGFuZ2VQcm9maWxlLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyVmlld01vZGVsID0gY29udGFpbmVyLmdldDxJVXNlclZpZXdNb2RlbD4oVklFV19NT0RFTC5VU0VSKTtcbiAgICAgIGF3YWl0IHVzZXJWaWV3TW9kZWwuZ2V0VXNlcigpO1xuICAgICAgcmV0dXJuIHVzZXJWaWV3TW9kZWwudXNlcjtcbiAgICB9KVxuICAgIC51c2UoXCIvZWRpdHBhc3N3b3JkXCIsIENoYW5nZVBhc3N3b3JkKVxuICAgIC5zdGFydCgpO1xufTtcbiIsImNvbnN0IENhY2hlID0gbmV3IE1hcCgpO1xuZXhwb3J0IGZ1bmN0aW9uIG1lbW9pemUoZnVuYywgcmVzb2x2ZXIpIHtcbiAgaWYgKFxuICAgIHR5cGVvZiBmdW5jICE9IFwiZnVuY3Rpb25cIiB8fFxuICAgIChyZXNvbHZlciAhPSBudWxsICYmIHR5cGVvZiByZXNvbHZlciAhPSBcImZ1bmN0aW9uXCIpXG4gICkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB2YXIgbWVtb2l6ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICBrZXkgPSByZXNvbHZlciA/IHJlc29sdmVyLmFwcGx5KHRoaXMsIGFyZ3MpIDogYXJnc1swXSxcbiAgICAgIGNhY2hlID0gbWVtb2l6ZWQuY2FjaGU7XG5cbiAgICBpZiAoY2FjaGUuaGFzKGtleSkpIHtcbiAgICAgIHJldHVybiBjYWNoZS5nZXQoa2V5KTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgbWVtb2l6ZWQuY2FjaGUgPSBjYWNoZS5zZXQoa2V5LCByZXN1bHQpIHx8IGNhY2hlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIG1lbW9pemVkLmNhY2hlID0gQ2FjaGU7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=