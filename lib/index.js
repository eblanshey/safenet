/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {__webpack_require__(2);

	var Safe = __webpack_require__(9);

	// If Node environment, export Safe. Otherwise, attach to window.
	if (typeof process === 'object' && process+'' === '[object process]') {
	  module.exports = Safe;
	} else {
	  window.SafeApp = Safe;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
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
	    var timeout = setTimeout(cleanUpNextTick);
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
	    clearTimeout(timeout);
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
	        setTimeout(drainQueue, 0);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// enable fetch and promises globally
	__webpack_require__(3).polyfill();
	__webpack_require__(7);

	/**
	 * Enable Object.assign, because it's nice
	 * @source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	 */
	if (typeof Object.assign != 'function') {
	  Object.assign = function (target) {
	    'use strict';
	    if (target === undefined || target === null) {
	      throw new TypeError('Cannot convert undefined or null to object');
	    }

	    var output = Object(target);
	    for (var index = 1; index < arguments.length; index++) {
	      var source = arguments[index];
	      if (source !== undefined && source !== null) {
	        for (var nextKey in source) {
	          if (source.hasOwnProperty(nextKey)) {
	            output[nextKey] = source[nextKey];
	          }
	        }
	      }
	    }
	    return output;
	  };
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var require;var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, global, module) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   3.1.2
	 */

	(function() {
	    "use strict";
	    function lib$es6$promise$utils$$objectOrFunction(x) {
	      return typeof x === 'function' || (typeof x === 'object' && x !== null);
	    }

	    function lib$es6$promise$utils$$isFunction(x) {
	      return typeof x === 'function';
	    }

	    function lib$es6$promise$utils$$isMaybeThenable(x) {
	      return typeof x === 'object' && x !== null;
	    }

	    var lib$es6$promise$utils$$_isArray;
	    if (!Array.isArray) {
	      lib$es6$promise$utils$$_isArray = function (x) {
	        return Object.prototype.toString.call(x) === '[object Array]';
	      };
	    } else {
	      lib$es6$promise$utils$$_isArray = Array.isArray;
	    }

	    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
	    var lib$es6$promise$asap$$len = 0;
	    var lib$es6$promise$asap$$vertxNext;
	    var lib$es6$promise$asap$$customSchedulerFn;

	    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
	      lib$es6$promise$asap$$len += 2;
	      if (lib$es6$promise$asap$$len === 2) {
	        // If len is 2, that means that we need to schedule an async flush.
	        // If additional callbacks are queued before the queue is flushed, they
	        // will be processed by this flush that we are scheduling.
	        if (lib$es6$promise$asap$$customSchedulerFn) {
	          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
	        } else {
	          lib$es6$promise$asap$$scheduleFlush();
	        }
	      }
	    }

	    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
	      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
	    }

	    function lib$es6$promise$asap$$setAsap(asapFn) {
	      lib$es6$promise$asap$$asap = asapFn;
	    }

	    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
	    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
	    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
	    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

	    // test for web worker but not in IE10
	    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
	      typeof importScripts !== 'undefined' &&
	      typeof MessageChannel !== 'undefined';

	    // node
	    function lib$es6$promise$asap$$useNextTick() {
	      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	      // see https://github.com/cujojs/when/issues/410 for details
	      return function() {
	        process.nextTick(lib$es6$promise$asap$$flush);
	      };
	    }

	    // vertx
	    function lib$es6$promise$asap$$useVertxTimer() {
	      return function() {
	        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
	      };
	    }

	    function lib$es6$promise$asap$$useMutationObserver() {
	      var iterations = 0;
	      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
	      var node = document.createTextNode('');
	      observer.observe(node, { characterData: true });

	      return function() {
	        node.data = (iterations = ++iterations % 2);
	      };
	    }

	    // web worker
	    function lib$es6$promise$asap$$useMessageChannel() {
	      var channel = new MessageChannel();
	      channel.port1.onmessage = lib$es6$promise$asap$$flush;
	      return function () {
	        channel.port2.postMessage(0);
	      };
	    }

	    function lib$es6$promise$asap$$useSetTimeout() {
	      return function() {
	        setTimeout(lib$es6$promise$asap$$flush, 1);
	      };
	    }

	    var lib$es6$promise$asap$$queue = new Array(1000);
	    function lib$es6$promise$asap$$flush() {
	      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
	        var callback = lib$es6$promise$asap$$queue[i];
	        var arg = lib$es6$promise$asap$$queue[i+1];

	        callback(arg);

	        lib$es6$promise$asap$$queue[i] = undefined;
	        lib$es6$promise$asap$$queue[i+1] = undefined;
	      }

	      lib$es6$promise$asap$$len = 0;
	    }

	    function lib$es6$promise$asap$$attemptVertx() {
	      try {
	        var r = require;
	        var vertx = __webpack_require__(5);
	        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
	        return lib$es6$promise$asap$$useVertxTimer();
	      } catch(e) {
	        return lib$es6$promise$asap$$useSetTimeout();
	      }
	    }

	    var lib$es6$promise$asap$$scheduleFlush;
	    // Decide what async method to use to triggering processing of queued callbacks:
	    if (lib$es6$promise$asap$$isNode) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
	    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
	    } else if (lib$es6$promise$asap$$isWorker) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
	    } else if (lib$es6$promise$asap$$browserWindow === undefined && "function" === 'function') {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
	    } else {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
	    }
	    function lib$es6$promise$then$$then(onFulfillment, onRejection) {
	      var parent = this;
	      var state = parent._state;

	      if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
	        return this;
	      }

	      var child = new this.constructor(lib$es6$promise$$internal$$noop);
	      var result = parent._result;

	      if (state) {
	        var callback = arguments[state - 1];
	        lib$es6$promise$asap$$asap(function(){
	          lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
	        });
	      } else {
	        lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
	      }

	      return child;
	    }
	    var lib$es6$promise$then$$default = lib$es6$promise$then$$then;
	    function lib$es6$promise$promise$resolve$$resolve(object) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      if (object && typeof object === 'object' && object.constructor === Constructor) {
	        return object;
	      }

	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$resolve(promise, object);
	      return promise;
	    }
	    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;

	    function lib$es6$promise$$internal$$noop() {}

	    var lib$es6$promise$$internal$$PENDING   = void 0;
	    var lib$es6$promise$$internal$$FULFILLED = 1;
	    var lib$es6$promise$$internal$$REJECTED  = 2;

	    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

	    function lib$es6$promise$$internal$$selfFulfillment() {
	      return new TypeError("You cannot resolve a promise with itself");
	    }

	    function lib$es6$promise$$internal$$cannotReturnOwn() {
	      return new TypeError('A promises callback cannot return that same promise.');
	    }

	    function lib$es6$promise$$internal$$getThen(promise) {
	      try {
	        return promise.then;
	      } catch(error) {
	        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
	        return lib$es6$promise$$internal$$GET_THEN_ERROR;
	      }
	    }

	    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	      try {
	        then.call(value, fulfillmentHandler, rejectionHandler);
	      } catch(e) {
	        return e;
	      }
	    }

	    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
	       lib$es6$promise$asap$$asap(function(promise) {
	        var sealed = false;
	        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
	          if (sealed) { return; }
	          sealed = true;
	          if (thenable !== value) {
	            lib$es6$promise$$internal$$resolve(promise, value);
	          } else {
	            lib$es6$promise$$internal$$fulfill(promise, value);
	          }
	        }, function(reason) {
	          if (sealed) { return; }
	          sealed = true;

	          lib$es6$promise$$internal$$reject(promise, reason);
	        }, 'Settle: ' + (promise._label || ' unknown promise'));

	        if (!sealed && error) {
	          sealed = true;
	          lib$es6$promise$$internal$$reject(promise, error);
	        }
	      }, promise);
	    }

	    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
	      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
	      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, thenable._result);
	      } else {
	        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      }
	    }

	    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
	      if (maybeThenable.constructor === promise.constructor &&
	          then === lib$es6$promise$then$$default &&
	          constructor.resolve === lib$es6$promise$promise$resolve$$default) {
	        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
	      } else {
	        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
	        } else if (then === undefined) {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        } else if (lib$es6$promise$utils$$isFunction(then)) {
	          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
	        } else {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        }
	      }
	    }

	    function lib$es6$promise$$internal$$resolve(promise, value) {
	      if (promise === value) {
	        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
	      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
	        lib$es6$promise$$internal$$handleMaybeThenable(promise, value, lib$es6$promise$$internal$$getThen(value));
	      } else {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      }
	    }

	    function lib$es6$promise$$internal$$publishRejection(promise) {
	      if (promise._onerror) {
	        promise._onerror(promise._result);
	      }

	      lib$es6$promise$$internal$$publish(promise);
	    }

	    function lib$es6$promise$$internal$$fulfill(promise, value) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

	      promise._result = value;
	      promise._state = lib$es6$promise$$internal$$FULFILLED;

	      if (promise._subscribers.length !== 0) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
	      }
	    }

	    function lib$es6$promise$$internal$$reject(promise, reason) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
	      promise._state = lib$es6$promise$$internal$$REJECTED;
	      promise._result = reason;

	      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
	    }

	    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
	      var subscribers = parent._subscribers;
	      var length = subscribers.length;

	      parent._onerror = null;

	      subscribers[length] = child;
	      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
	      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

	      if (length === 0 && parent._state) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
	      }
	    }

	    function lib$es6$promise$$internal$$publish(promise) {
	      var subscribers = promise._subscribers;
	      var settled = promise._state;

	      if (subscribers.length === 0) { return; }

	      var child, callback, detail = promise._result;

	      for (var i = 0; i < subscribers.length; i += 3) {
	        child = subscribers[i];
	        callback = subscribers[i + settled];

	        if (child) {
	          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
	        } else {
	          callback(detail);
	        }
	      }

	      promise._subscribers.length = 0;
	    }

	    function lib$es6$promise$$internal$$ErrorObject() {
	      this.error = null;
	    }

	    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

	    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
	      try {
	        return callback(detail);
	      } catch(e) {
	        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
	        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
	      }
	    }

	    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
	      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
	          value, error, succeeded, failed;

	      if (hasCallback) {
	        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

	        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
	          failed = true;
	          error = value.error;
	          value = null;
	        } else {
	          succeeded = true;
	        }

	        if (promise === value) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
	          return;
	        }

	      } else {
	        value = detail;
	        succeeded = true;
	      }

	      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
	        // noop
	      } else if (hasCallback && succeeded) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      } else if (failed) {
	        lib$es6$promise$$internal$$reject(promise, error);
	      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, value);
	      }
	    }

	    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
	      try {
	        resolver(function resolvePromise(value){
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function rejectPromise(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      } catch(e) {
	        lib$es6$promise$$internal$$reject(promise, e);
	      }
	    }

	    function lib$es6$promise$promise$all$$all(entries) {
	      return new lib$es6$promise$enumerator$$default(this, entries).promise;
	    }
	    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
	    function lib$es6$promise$promise$race$$race(entries) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      var promise = new Constructor(lib$es6$promise$$internal$$noop);

	      if (!lib$es6$promise$utils$$isArray(entries)) {
	        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
	        return promise;
	      }

	      var length = entries.length;

	      function onFulfillment(value) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      }

	      function onRejection(reason) {
	        lib$es6$promise$$internal$$reject(promise, reason);
	      }

	      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
	      }

	      return promise;
	    }
	    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
	    function lib$es6$promise$promise$reject$$reject(reason) {
	      /*jshint validthis:true */
	      var Constructor = this;
	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$reject(promise, reason);
	      return promise;
	    }
	    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

	    var lib$es6$promise$promise$$counter = 0;

	    function lib$es6$promise$promise$$needsResolver() {
	      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	    }

	    function lib$es6$promise$promise$$needsNew() {
	      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	    }

	    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
	    /**
	      Promise objects represent the eventual result of an asynchronous operation. The
	      primary way of interacting with a promise is through its `then` method, which
	      registers callbacks to receive either a promise's eventual value or the reason
	      why the promise cannot be fulfilled.

	      Terminology
	      -----------

	      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	      - `thenable` is an object or function that defines a `then` method.
	      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	      - `exception` is a value that is thrown using the throw statement.
	      - `reason` is a value that indicates why a promise was rejected.
	      - `settled` the final resting state of a promise, fulfilled or rejected.

	      A promise can be in one of three states: pending, fulfilled, or rejected.

	      Promises that are fulfilled have a fulfillment value and are in the fulfilled
	      state.  Promises that are rejected have a rejection reason and are in the
	      rejected state.  A fulfillment value is never a thenable.

	      Promises can also be said to *resolve* a value.  If this value is also a
	      promise, then the original promise's settled state will match the value's
	      settled state.  So a promise that *resolves* a promise that rejects will
	      itself reject, and a promise that *resolves* a promise that fulfills will
	      itself fulfill.


	      Basic Usage:
	      ------------

	      ```js
	      var promise = new Promise(function(resolve, reject) {
	        // on success
	        resolve(value);

	        // on failure
	        reject(reason);
	      });

	      promise.then(function(value) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```

	      Advanced Usage:
	      ---------------

	      Promises shine when abstracting away asynchronous interactions such as
	      `XMLHttpRequest`s.

	      ```js
	      function getJSON(url) {
	        return new Promise(function(resolve, reject){
	          var xhr = new XMLHttpRequest();

	          xhr.open('GET', url);
	          xhr.onreadystatechange = handler;
	          xhr.responseType = 'json';
	          xhr.setRequestHeader('Accept', 'application/json');
	          xhr.send();

	          function handler() {
	            if (this.readyState === this.DONE) {
	              if (this.status === 200) {
	                resolve(this.response);
	              } else {
	                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	              }
	            }
	          };
	        });
	      }

	      getJSON('/posts.json').then(function(json) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```

	      Unlike callbacks, promises are great composable primitives.

	      ```js
	      Promise.all([
	        getJSON('/posts'),
	        getJSON('/comments')
	      ]).then(function(values){
	        values[0] // => postsJSON
	        values[1] // => commentsJSON

	        return values;
	      });
	      ```

	      @class Promise
	      @param {function} resolver
	      Useful for tooling.
	      @constructor
	    */
	    function lib$es6$promise$promise$$Promise(resolver) {
	      this._id = lib$es6$promise$promise$$counter++;
	      this._state = undefined;
	      this._result = undefined;
	      this._subscribers = [];

	      if (lib$es6$promise$$internal$$noop !== resolver) {
	        typeof resolver !== 'function' && lib$es6$promise$promise$$needsResolver();
	        this instanceof lib$es6$promise$promise$$Promise ? lib$es6$promise$$internal$$initializePromise(this, resolver) : lib$es6$promise$promise$$needsNew();
	      }
	    }

	    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
	    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
	    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
	    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
	    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
	    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
	    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

	    lib$es6$promise$promise$$Promise.prototype = {
	      constructor: lib$es6$promise$promise$$Promise,

	    /**
	      The primary way of interacting with a promise is through its `then` method,
	      which registers callbacks to receive either a promise's eventual value or the
	      reason why the promise cannot be fulfilled.

	      ```js
	      findUser().then(function(user){
	        // user is available
	      }, function(reason){
	        // user is unavailable, and you are given the reason why
	      });
	      ```

	      Chaining
	      --------

	      The return value of `then` is itself a promise.  This second, 'downstream'
	      promise is resolved with the return value of the first promise's fulfillment
	      or rejection handler, or rejected if the handler throws an exception.

	      ```js
	      findUser().then(function (user) {
	        return user.name;
	      }, function (reason) {
	        return 'default name';
	      }).then(function (userName) {
	        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	        // will be `'default name'`
	      });

	      findUser().then(function (user) {
	        throw new Error('Found user, but still unhappy');
	      }, function (reason) {
	        throw new Error('`findUser` rejected and we're unhappy');
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	      });
	      ```
	      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

	      ```js
	      findUser().then(function (user) {
	        throw new PedagogicalException('Upstream error');
	      }).then(function (value) {
	        // never reached
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // The `PedgagocialException` is propagated all the way down to here
	      });
	      ```

	      Assimilation
	      ------------

	      Sometimes the value you want to propagate to a downstream promise can only be
	      retrieved asynchronously. This can be achieved by returning a promise in the
	      fulfillment or rejection handler. The downstream promise will then be pending
	      until the returned promise is settled. This is called *assimilation*.

	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // The user's comments are now available
	      });
	      ```

	      If the assimliated promise rejects, then the downstream promise will also reject.

	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // If `findCommentsByAuthor` fulfills, we'll have the value here
	      }, function (reason) {
	        // If `findCommentsByAuthor` rejects, we'll have the reason here
	      });
	      ```

	      Simple Example
	      --------------

	      Synchronous Example

	      ```javascript
	      var result;

	      try {
	        result = findResult();
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```

	      Errback Example

	      ```js
	      findResult(function(result, err){
	        if (err) {
	          // failure
	        } else {
	          // success
	        }
	      });
	      ```

	      Promise Example;

	      ```javascript
	      findResult().then(function(result){
	        // success
	      }, function(reason){
	        // failure
	      });
	      ```

	      Advanced Example
	      --------------

	      Synchronous Example

	      ```javascript
	      var author, books;

	      try {
	        author = findAuthor();
	        books  = findBooksByAuthor(author);
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```

	      Errback Example

	      ```js

	      function foundBooks(books) {

	      }

	      function failure(reason) {

	      }

	      findAuthor(function(author, err){
	        if (err) {
	          failure(err);
	          // failure
	        } else {
	          try {
	            findBoooksByAuthor(author, function(books, err) {
	              if (err) {
	                failure(err);
	              } else {
	                try {
	                  foundBooks(books);
	                } catch(reason) {
	                  failure(reason);
	                }
	              }
	            });
	          } catch(error) {
	            failure(err);
	          }
	          // success
	        }
	      });
	      ```

	      Promise Example;

	      ```javascript
	      findAuthor().
	        then(findBooksByAuthor).
	        then(function(books){
	          // found books
	      }).catch(function(reason){
	        // something went wrong
	      });
	      ```

	      @method then
	      @param {Function} onFulfilled
	      @param {Function} onRejected
	      Useful for tooling.
	      @return {Promise}
	    */
	      then: lib$es6$promise$then$$default,

	    /**
	      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	      as the catch block of a try/catch statement.

	      ```js
	      function findAuthor(){
	        throw new Error('couldn't find that author');
	      }

	      // synchronous
	      try {
	        findAuthor();
	      } catch(reason) {
	        // something went wrong
	      }

	      // async with promises
	      findAuthor().catch(function(reason){
	        // something went wrong
	      });
	      ```

	      @method catch
	      @param {Function} onRejection
	      Useful for tooling.
	      @return {Promise}
	    */
	      'catch': function(onRejection) {
	        return this.then(null, onRejection);
	      }
	    };
	    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
	    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
	      this._instanceConstructor = Constructor;
	      this.promise = new Constructor(lib$es6$promise$$internal$$noop);

	      if (Array.isArray(input)) {
	        this._input     = input;
	        this.length     = input.length;
	        this._remaining = input.length;

	        this._result = new Array(this.length);

	        if (this.length === 0) {
	          lib$es6$promise$$internal$$fulfill(this.promise, this._result);
	        } else {
	          this.length = this.length || 0;
	          this._enumerate();
	          if (this._remaining === 0) {
	            lib$es6$promise$$internal$$fulfill(this.promise, this._result);
	          }
	        }
	      } else {
	        lib$es6$promise$$internal$$reject(this.promise, this._validationError());
	      }
	    }

	    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
	      return new Error('Array Methods must be provided an Array');
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
	      var length  = this.length;
	      var input   = this._input;

	      for (var i = 0; this._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        this._eachEntry(input[i], i);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
	      var c = this._instanceConstructor;
	      var resolve = c.resolve;

	      if (resolve === lib$es6$promise$promise$resolve$$default) {
	        var then = lib$es6$promise$$internal$$getThen(entry);

	        if (then === lib$es6$promise$then$$default &&
	            entry._state !== lib$es6$promise$$internal$$PENDING) {
	          this._settledAt(entry._state, i, entry._result);
	        } else if (typeof then !== 'function') {
	          this._remaining--;
	          this._result[i] = entry;
	        } else if (c === lib$es6$promise$promise$$default) {
	          var promise = new c(lib$es6$promise$$internal$$noop);
	          lib$es6$promise$$internal$$handleMaybeThenable(promise, entry, then);
	          this._willSettleAt(promise, i);
	        } else {
	          this._willSettleAt(new c(function(resolve) { resolve(entry); }), i);
	        }
	      } else {
	        this._willSettleAt(resolve(entry), i);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
	      var promise = this.promise;

	      if (promise._state === lib$es6$promise$$internal$$PENDING) {
	        this._remaining--;

	        if (state === lib$es6$promise$$internal$$REJECTED) {
	          lib$es6$promise$$internal$$reject(promise, value);
	        } else {
	          this._result[i] = value;
	        }
	      }

	      if (this._remaining === 0) {
	        lib$es6$promise$$internal$$fulfill(promise, this._result);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
	      var enumerator = this;

	      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
	        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
	      }, function(reason) {
	        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
	      });
	    };
	    function lib$es6$promise$polyfill$$polyfill() {
	      var local;

	      if (typeof global !== 'undefined') {
	          local = global;
	      } else if (typeof self !== 'undefined') {
	          local = self;
	      } else {
	          try {
	              local = Function('return this')();
	          } catch (e) {
	              throw new Error('polyfill failed because global object is unavailable in this environment');
	          }
	      }

	      var P = local.Promise;

	      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
	        return;
	      }

	      local.Promise = lib$es6$promise$promise$$default;
	    }
	    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

	    var lib$es6$promise$umd$$ES6Promise = {
	      'Promise': lib$es6$promise$promise$$default,
	      'polyfill': lib$es6$promise$polyfill$$default
	    };

	    /* global define:true module:true window: true */
	    if ("function" === 'function' && __webpack_require__(6)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return lib$es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = lib$es6$promise$umd$$ES6Promise;
	    } else if (typeof this !== 'undefined') {
	      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
	    }

	    lib$es6$promise$polyfill$$default();
	}).call(this);


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), (function() { return this; }()), __webpack_require__(4)(module)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// the whatwg-fetch polyfill installs the fetch() function
	// on the global object (window or self)
	//
	// Return that as the export for use in Webpack, Browserify etc.
	__webpack_require__(8);
	module.exports = self.fetch.bind(self);


/***/ },
/* 8 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }

	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }

	  var support = {
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }

	  function Body() {
	    this.bodyUsed = false


	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        }
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }

	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }

	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }

	  Request.prototype.clone = function() {
	    return new Request(this)
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }

	  Body.call(Response.prototype)

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }

	  var redirectStatuses = [301, 302, 303, 307, 308]

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  }

	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }

	      var xhr = new XMLHttpRequest()

	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }

	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }

	        return;
	      }

	      xhr.onload = function() {
	        var status = (xhr.status === 1223) ? 204 : xhr.status
	        if (status < 100 || status > 599) {
	          reject(new TypeError('Network request failed'))
	          return
	        }
	        var options = {
	          status: status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Request = __webpack_require__(10).Factory,
	    storage = __webpack_require__(15);

	var namespaces = {
	  auth: __webpack_require__(16),
	  dns: __webpack_require__(17),
	  nfs: __webpack_require__(18)
	};

	/**
	 *
	 * @param app obj containing name, version, vendor, and id
	 * @param permissions array containing permissions (only SAFE_DRIVE_ACCESS avail)
	 * @param conf obj containing instance of storage class to use
	 * @constructor
	 */
	function Safe(app, permissions, conf) {
	  permissions = permissions || [];
	  conf = conf || {};

	  if (!app.name || !app.version || !app.vendor || !app.id) {
	    throw new Error('`app` must be an object containing name, version, vendor, and id.')
	  }

	  // Set the storage class to be used for saving/fetching auth data
	  if (conf.storage) {
	    this.storage = conf.storage;
	  } else {
	    if (typeof localStorage !== 'undefined') {
	      this.storage = storage.localStorage;
	    } else {
	      throw new Error('Default storage is localStorage, which is not present in this environment.' +
	      ' You must provide a storage class that has the `set`, `get`, and `clear` methods. See readme for details.');
	    }
	  }

	  this.app = app;
	  this.permissions = permissions;
	  this.Request = new Request(this);

	  this._auth = {
	    token: null,
	    symKey: null,
	    symNonce: null
	  };

	  // Bind namespace api endpoints
	  bindNamespaces.call(this);

	  Safe.log('Instantiated new Safe instance.');
	}

	// All we're doing here is A) namespacing api calls (e.g. call using Safe.dns.getName() vs
	// Safe.getName(), and B) binding "this" within each api call to the main Safe object
	function bindNamespaces() {
	  for (var namespace in namespaces) {
	    for (var func in namespaces[namespace]) {
	      namespaces[namespace][func] = namespaces[namespace][func].bind(this);
	    }

	    this[namespace] = namespaces[namespace];
	  };
	}

	// Set up logging capability that can be overridden by the useur
	Safe.log = function() {}
	// Make it accessible from the Safe instance
	Safe.prototype.log = function() {
	  this.constructor.log.apply(this, arguments);
	}

	// Helper to get auth data
	Safe.prototype.getAuth = function(key) {
	  return !key ? this._auth : this._auth[key];
	}

	module.exports = Safe;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(11);

	// This is a list of plain text body responses that the SAFE client returns.
	// If the response body contains any of these, then we know that decryption is not required.
	var doNotDecrypt = ['OK', 'Unauthorized', 'Server Error'];

	/**
	 * The factory will create new requests to the launcher, passing in the Safe instance,
	 * which is used for the auth data.
	 *
	 * @param Safe
	 * @returns {RequestFactory}
	 * @constructor
	 */
	function RequestFactory(Safe) {
	  if (!this)
	    return new RequestFactory(Safe);

	  this.Safe = Safe;
	}

	module.exports.Factory = RequestFactory;

	// The exposed HTTP methods on the factory: get, post, put, and delete
	RequestFactory.prototype.get = function(uri) {
	  return new Request(this.Safe, uri, 'GET');
	}
	RequestFactory.prototype.post = function(uri) {
	  return new Request(this.Safe, uri, 'POST');
	}
	RequestFactory.prototype.put = function(uri) {
	  return new Request(this.Safe, uri, 'PUT');
	}
	RequestFactory.prototype.delete = function(uri) {
	  return new Request(this.Safe, uri, 'DELETE');
	}

	/**
	 * The main function for creating new Requests to SAFE
	 *
	 * @param Safe
	 * @param uri
	 * @param method
	 * @returns {Request}
	 * @constructor
	 */
	function Request(Safe, uri, method) {
	  if (!this)
	    return new Request(Safe, uri, method);

	  this.Safe = Safe;
	  this.uri = uri;
	  this.method = method;
	  this._needAuth = false;
	  this._returnMeta = false;
	}

	// Technically we could use http://api.safenet but it wouldn't even attempt to connect
	// if there is no internet connection.
	Request.baseUrl = 'http://localhost:8100';

	// Add a body to the request
	Request.prototype.body = function(body) {
	  this._body = body;
	  return this;
	}

	// Require both authentication (the token) and encryption/decryption
	// of the request/response bodies, if required. We're coupling encryption and auth together for now
	// because usually authentication implies encryption.
	Request.prototype.auth = function() {
	  this._needAuth = true;
	  return this;
	}

	Request.prototype.query = function(query) {
	  this._query = query;
	  return this;
	}

	/**
	 * Some requests, such as getting a file, have useful meta data in the headers that we want
	 * to keep. In those cases, return an object that has "body" and "meta" properties.
	 * @returns {Request}
	 */
	Request.prototype.returnMeta = function() {
	  this._returnMeta = true;
	  return this;
	}

	// Send the request
	Request.prototype.execute = function() {
	  var payload = {};

	  payload.method = this.method.toUpperCase();
	  payload.mode = 'cors';
	  payload.headers = {};

	  if (this._body) {
	    // If body is not a string, make it a string
	    payload.body = typeof this._body !== 'string' ? JSON.stringify(this._body) : this._body;

	    // Encrypt body if needed
	    if (this._needAuth)
	      payload.body = utils.encrypt(payload.body, this.Safe.getAuth('symNonce'), this.Safe.getAuth('symKey'));
	  }

	  // Add token if requested
	  // Even if token is null, we'll still continue, as this may be a request to check if we're
	  // authorized or not, in which case a 401 will automatically be returned.
	  if (this._needAuth)
	    payload.headers['Authorization'] = 'Bearer ' + this.Safe.getAuth('token');

	  // POST and PUT requests usually have a request body.
	  // They should be JSON (unencrypted) or text (encrypted)
	  if (['POST', 'PUT'].indexOf(payload.method) > -1)
	    payload.headers['Content-Type'] = this._needAuth ? 'text/plain' : 'application/json';

	  var url = buildUrl.call(this);

	  Safe.log('Executing '+payload.method+' request with uri "'+url+'" and payload: ', payload);

	  // Send request, check status, get response data, and decrypt if necessary
	  return fetch(url, payload)
	    .then(prepareResponse.bind(this), networkError.bind(this))
	    .catch(genericError.bind(this))
	}

	// If request was with auth token, returned data is encrypted, otherwise it's plain ol' json
	function prepareResponse(response) {
	  Safe.log('Received response: ', response);
	  return response.text().then(function(text) {
	    // If we get a 2xx...
	    Safe.log('Launcher returned status '+response.status);
	    if (response.ok) {
	      // If not an authorized request, or not encrypted, no decryption necessary
	      if (!this._needAuth || doNotDecrypt.indexOf(text) > -1)
	        var body = utils.parseJson(text);

	      // Otherwise, decrypt response
	      else
	        var body = utils.decrypt(text, this.Safe.getAuth('symNonce'), this.Safe.getAuth('symKey'));

	      // Lastly, if any meta data was requested (e.g. the headers), then return an object
	      if (this._returnMeta) {
	        return {body: body, meta: response.headers.entries()};
	      } else {
	        // No need to return 'OK' for responses that return that.
	        return (typeof body === 'string' && body.toUpperCase() === 'OK') ? undefined : body;
	      }
	    } else {
	      // If authentication was requested, then decrypt the error message received.
	      if (this._needAuth && doNotDecrypt.indexOf(text) === -1) {
	        var message = utils.decrypt(text, this.Safe.getAuth('symNonce'), this.Safe.getAuth('symKey')),
	            parsed = parseSafeMessage(message, response.status);

	        // Throw a "launcher" error type, which is an error from the launcher.
	        throw new SafeError('launcher', parsed.message, parsed.status, response);
	      } else {
	        // If no message received, it's a standard http response error
	        var parsed = parseSafeMessage(utils.parseJson(text), response.status);
	        throw new SafeError('http', parsed.message, parsed.status, response);
	      }
	    }
	  }.bind(this));
	}

	// If the server could not be reached at all, this function is used to handle the error.
	// Non-2xx responses get handled like normal by prepareResponse()
	function networkError(response) {
	  throw new SafeError('network', 'Could not connect to SAFE launcher. Is it running?');
	}

	// Any other kind of error gets handled here
	function genericError(error) {
	  if (error.isSafeError) throw error;

	  throw new SafeError('error', error.message, 0);
	}

	function SafeError(type, message, status, response) {
	  this.isSafeError = true;

	  this.type = type;
	  this.message = message;
	  this.status = status || 0;
	  this.response = response;

	  this.toString = function() {
	    return this.type+': '+this.message+' ('+this.status+')';
	  }
	}

	function buildUrl() {
	  var base = Request.baseUrl + this.uri;

	  if (this._query && Object.keys(this._query).length > 0) {
	    var queryString = serializeQuery(this._query);

	    if (this._needAuth) {
	      queryString = utils.encrypt(queryString, this.Safe.getAuth('symNonce'), this.Safe.getAuth('symKey'));
	    }

	    return base + '?' + queryString;
	  }

	  return base;
	}

	/**
	 * Sometimes the message returns is an object with a 'description' and 'errorCode' property
	 * @param message
	 */
	function parseSafeMessage(message, status) {
	  if (typeof message === 'object') {
	    return {status: message.errorCode, message: message.description};
	  } else {
	    return {status: status, message: message};
	  }
	}

	/**
	 * Make a query string from an object.
	 * @param obj
	 * @returns {string}
	 */
	function serializeQuery(obj) {
	  var str = [];
	  for(var p in obj){
	    if (obj.hasOwnProperty(p)) {
	      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	    }
	  }
	  return str.join("&");
	}

	module.exports.Request = Request;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var base64 = __webpack_require__(12),
	    nacl = __webpack_require__(13);

	/**
	 * Serializes auth data.
	 * @param encoded
	 * @returns {{token: *, symKey: *, symNonce: *}}
	 */
	module.exports.unserialize = function(encoded) {
	  var obj = JSON.parse(encoded);

	  return {
	    token: obj.token,
	    symKey: base64.toByteArray(obj.symKey),
	    symNonce: base64.toByteArray(obj.symNonce)
	  };
	};

	/**
	 * Unserializes auth data.
	 * @param auth
	 */
	module.exports.serialize = function(auth) {
	  var obj = {
	    token: auth.token,
	    symKey: base64.fromByteArray(auth.symKey),
	    symNonce: base64.fromByteArray(auth.symNonce)
	  };

	  return JSON.stringify(obj);
	}

	/**
	 * Return parsed JSON if needed, otherwise returns text as is.
	 * @source http://stackoverflow.com/a/20392392/371699
	 * @param text
	 */
	function parseJson(text) {
	  try {
	    var o = JSON.parse(text);
	    if (o && typeof o === "object" && o !== null)
	      return o;
	  }
	  catch (e) {}

	  return text;
	};
	module.exports.parseJson = parseJson;

	/**
	 * @source https://github.com/dchest/tweetnacl-util-js/blob/master/nacl-util.js#L16
	 * @param s
	 * @returns {Uint8Array}
	 */
	function encodeUTF8(s) {
	  var i, d = unescape(encodeURIComponent(s)), b = new Uint8Array(d.length);
	  for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
	  return b;
	};
	module.exports.encodeUTF8 = encodeUTF8;

	/**
	 * @source https://github.com/dchest/tweetnacl-util-js/blob/master/nacl-util.js#L22
	 * @param arr
	 * @returns {string}
	 */
	function decodeUTF8(arr) {
	  var i, s = [];
	  for (i = 0; i < arr.length; i++) s.push(String.fromCharCode(arr[i]));
	  return decodeURIComponent(escape(s.join('')));
	};
	module.exports.decodeUTF8 = decodeUTF8;

	module.exports.decrypt = function(text, nonce, key) {
	  var encryptedData = base64.toByteArray(text);
	  var message = base64.fromByteArray(nacl.secretbox.open(encryptedData, nonce, key));

	  return parseJson(atob(message));
	}

	module.exports.encrypt = function(text, nonce, key) {
	  var encrypted = nacl.secretbox(encodeUTF8(text), nonce, key);
	  return base64.fromByteArray(encrypted);
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict'

	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray

	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

	function init () {
	  var i
	  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	  var len = code.length

	  for (i = 0; i < len; i++) {
	    lookup[i] = code[i]
	  }

	  for (i = 0; i < len; ++i) {
	    revLookup[code.charCodeAt(i)] = i
	  }
	  revLookup['-'.charCodeAt(0)] = 62
	  revLookup['_'.charCodeAt(0)] = 63
	}

	init()

	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

	  // base64 is 4/3 + up to two characters of the original data
	  arr = new Arr(len * 3 / 4 - placeHolders)

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len

	  var L = 0

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp & 0xFF0000) >> 16
	    arr[L++] = (tmp & 0xFF00) >> 8
	    arr[L++] = tmp & 0xFF
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }

	  parts.push(output)

	  return parts.join('')
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	(function(nacl) {
	'use strict';

	// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
	// Public domain.
	//
	// Implementation derived from TweetNaCl version 20140427.
	// See for details: http://tweetnacl.cr.yp.to/

	var gf = function(init) {
	  var i, r = new Float64Array(16);
	  if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
	  return r;
	};

	//  Pluggable, initialized in high-level API below.
	var randombytes = function(/* x, n */) { throw new Error('no PRNG'); };

	var _0 = new Uint8Array(16);
	var _9 = new Uint8Array(32); _9[0] = 9;

	var gf0 = gf(),
	    gf1 = gf([1]),
	    _121665 = gf([0xdb41, 1]),
	    D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
	    D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
	    X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
	    Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
	    I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

	function ts64(x, i, h, l) {
	  x[i]   = (h >> 24) & 0xff;
	  x[i+1] = (h >> 16) & 0xff;
	  x[i+2] = (h >>  8) & 0xff;
	  x[i+3] = h & 0xff;
	  x[i+4] = (l >> 24)  & 0xff;
	  x[i+5] = (l >> 16)  & 0xff;
	  x[i+6] = (l >>  8)  & 0xff;
	  x[i+7] = l & 0xff;
	}

	function vn(x, xi, y, yi, n) {
	  var i,d = 0;
	  for (i = 0; i < n; i++) d |= x[xi+i]^y[yi+i];
	  return (1 & ((d - 1) >>> 8)) - 1;
	}

	function crypto_verify_16(x, xi, y, yi) {
	  return vn(x,xi,y,yi,16);
	}

	function crypto_verify_32(x, xi, y, yi) {
	  return vn(x,xi,y,yi,32);
	}

	function core_salsa20(o, p, k, c) {
	  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
	      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
	      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
	      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
	      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
	      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
	      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
	      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
	      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
	      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
	      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
	      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
	      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
	      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
	      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
	      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

	  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
	      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
	      x15 = j15, u;

	  for (var i = 0; i < 20; i += 2) {
	    u = x0 + x12 | 0;
	    x4 ^= u<<7 | u>>>(32-7);
	    u = x4 + x0 | 0;
	    x8 ^= u<<9 | u>>>(32-9);
	    u = x8 + x4 | 0;
	    x12 ^= u<<13 | u>>>(32-13);
	    u = x12 + x8 | 0;
	    x0 ^= u<<18 | u>>>(32-18);

	    u = x5 + x1 | 0;
	    x9 ^= u<<7 | u>>>(32-7);
	    u = x9 + x5 | 0;
	    x13 ^= u<<9 | u>>>(32-9);
	    u = x13 + x9 | 0;
	    x1 ^= u<<13 | u>>>(32-13);
	    u = x1 + x13 | 0;
	    x5 ^= u<<18 | u>>>(32-18);

	    u = x10 + x6 | 0;
	    x14 ^= u<<7 | u>>>(32-7);
	    u = x14 + x10 | 0;
	    x2 ^= u<<9 | u>>>(32-9);
	    u = x2 + x14 | 0;
	    x6 ^= u<<13 | u>>>(32-13);
	    u = x6 + x2 | 0;
	    x10 ^= u<<18 | u>>>(32-18);

	    u = x15 + x11 | 0;
	    x3 ^= u<<7 | u>>>(32-7);
	    u = x3 + x15 | 0;
	    x7 ^= u<<9 | u>>>(32-9);
	    u = x7 + x3 | 0;
	    x11 ^= u<<13 | u>>>(32-13);
	    u = x11 + x7 | 0;
	    x15 ^= u<<18 | u>>>(32-18);

	    u = x0 + x3 | 0;
	    x1 ^= u<<7 | u>>>(32-7);
	    u = x1 + x0 | 0;
	    x2 ^= u<<9 | u>>>(32-9);
	    u = x2 + x1 | 0;
	    x3 ^= u<<13 | u>>>(32-13);
	    u = x3 + x2 | 0;
	    x0 ^= u<<18 | u>>>(32-18);

	    u = x5 + x4 | 0;
	    x6 ^= u<<7 | u>>>(32-7);
	    u = x6 + x5 | 0;
	    x7 ^= u<<9 | u>>>(32-9);
	    u = x7 + x6 | 0;
	    x4 ^= u<<13 | u>>>(32-13);
	    u = x4 + x7 | 0;
	    x5 ^= u<<18 | u>>>(32-18);

	    u = x10 + x9 | 0;
	    x11 ^= u<<7 | u>>>(32-7);
	    u = x11 + x10 | 0;
	    x8 ^= u<<9 | u>>>(32-9);
	    u = x8 + x11 | 0;
	    x9 ^= u<<13 | u>>>(32-13);
	    u = x9 + x8 | 0;
	    x10 ^= u<<18 | u>>>(32-18);

	    u = x15 + x14 | 0;
	    x12 ^= u<<7 | u>>>(32-7);
	    u = x12 + x15 | 0;
	    x13 ^= u<<9 | u>>>(32-9);
	    u = x13 + x12 | 0;
	    x14 ^= u<<13 | u>>>(32-13);
	    u = x14 + x13 | 0;
	    x15 ^= u<<18 | u>>>(32-18);
	  }
	   x0 =  x0 +  j0 | 0;
	   x1 =  x1 +  j1 | 0;
	   x2 =  x2 +  j2 | 0;
	   x3 =  x3 +  j3 | 0;
	   x4 =  x4 +  j4 | 0;
	   x5 =  x5 +  j5 | 0;
	   x6 =  x6 +  j6 | 0;
	   x7 =  x7 +  j7 | 0;
	   x8 =  x8 +  j8 | 0;
	   x9 =  x9 +  j9 | 0;
	  x10 = x10 + j10 | 0;
	  x11 = x11 + j11 | 0;
	  x12 = x12 + j12 | 0;
	  x13 = x13 + j13 | 0;
	  x14 = x14 + j14 | 0;
	  x15 = x15 + j15 | 0;

	  o[ 0] = x0 >>>  0 & 0xff;
	  o[ 1] = x0 >>>  8 & 0xff;
	  o[ 2] = x0 >>> 16 & 0xff;
	  o[ 3] = x0 >>> 24 & 0xff;

	  o[ 4] = x1 >>>  0 & 0xff;
	  o[ 5] = x1 >>>  8 & 0xff;
	  o[ 6] = x1 >>> 16 & 0xff;
	  o[ 7] = x1 >>> 24 & 0xff;

	  o[ 8] = x2 >>>  0 & 0xff;
	  o[ 9] = x2 >>>  8 & 0xff;
	  o[10] = x2 >>> 16 & 0xff;
	  o[11] = x2 >>> 24 & 0xff;

	  o[12] = x3 >>>  0 & 0xff;
	  o[13] = x3 >>>  8 & 0xff;
	  o[14] = x3 >>> 16 & 0xff;
	  o[15] = x3 >>> 24 & 0xff;

	  o[16] = x4 >>>  0 & 0xff;
	  o[17] = x4 >>>  8 & 0xff;
	  o[18] = x4 >>> 16 & 0xff;
	  o[19] = x4 >>> 24 & 0xff;

	  o[20] = x5 >>>  0 & 0xff;
	  o[21] = x5 >>>  8 & 0xff;
	  o[22] = x5 >>> 16 & 0xff;
	  o[23] = x5 >>> 24 & 0xff;

	  o[24] = x6 >>>  0 & 0xff;
	  o[25] = x6 >>>  8 & 0xff;
	  o[26] = x6 >>> 16 & 0xff;
	  o[27] = x6 >>> 24 & 0xff;

	  o[28] = x7 >>>  0 & 0xff;
	  o[29] = x7 >>>  8 & 0xff;
	  o[30] = x7 >>> 16 & 0xff;
	  o[31] = x7 >>> 24 & 0xff;

	  o[32] = x8 >>>  0 & 0xff;
	  o[33] = x8 >>>  8 & 0xff;
	  o[34] = x8 >>> 16 & 0xff;
	  o[35] = x8 >>> 24 & 0xff;

	  o[36] = x9 >>>  0 & 0xff;
	  o[37] = x9 >>>  8 & 0xff;
	  o[38] = x9 >>> 16 & 0xff;
	  o[39] = x9 >>> 24 & 0xff;

	  o[40] = x10 >>>  0 & 0xff;
	  o[41] = x10 >>>  8 & 0xff;
	  o[42] = x10 >>> 16 & 0xff;
	  o[43] = x10 >>> 24 & 0xff;

	  o[44] = x11 >>>  0 & 0xff;
	  o[45] = x11 >>>  8 & 0xff;
	  o[46] = x11 >>> 16 & 0xff;
	  o[47] = x11 >>> 24 & 0xff;

	  o[48] = x12 >>>  0 & 0xff;
	  o[49] = x12 >>>  8 & 0xff;
	  o[50] = x12 >>> 16 & 0xff;
	  o[51] = x12 >>> 24 & 0xff;

	  o[52] = x13 >>>  0 & 0xff;
	  o[53] = x13 >>>  8 & 0xff;
	  o[54] = x13 >>> 16 & 0xff;
	  o[55] = x13 >>> 24 & 0xff;

	  o[56] = x14 >>>  0 & 0xff;
	  o[57] = x14 >>>  8 & 0xff;
	  o[58] = x14 >>> 16 & 0xff;
	  o[59] = x14 >>> 24 & 0xff;

	  o[60] = x15 >>>  0 & 0xff;
	  o[61] = x15 >>>  8 & 0xff;
	  o[62] = x15 >>> 16 & 0xff;
	  o[63] = x15 >>> 24 & 0xff;
	}

	function core_hsalsa20(o,p,k,c) {
	  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
	      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
	      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
	      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
	      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
	      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
	      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
	      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
	      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
	      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
	      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
	      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
	      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
	      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
	      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
	      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

	  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
	      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
	      x15 = j15, u;

	  for (var i = 0; i < 20; i += 2) {
	    u = x0 + x12 | 0;
	    x4 ^= u<<7 | u>>>(32-7);
	    u = x4 + x0 | 0;
	    x8 ^= u<<9 | u>>>(32-9);
	    u = x8 + x4 | 0;
	    x12 ^= u<<13 | u>>>(32-13);
	    u = x12 + x8 | 0;
	    x0 ^= u<<18 | u>>>(32-18);

	    u = x5 + x1 | 0;
	    x9 ^= u<<7 | u>>>(32-7);
	    u = x9 + x5 | 0;
	    x13 ^= u<<9 | u>>>(32-9);
	    u = x13 + x9 | 0;
	    x1 ^= u<<13 | u>>>(32-13);
	    u = x1 + x13 | 0;
	    x5 ^= u<<18 | u>>>(32-18);

	    u = x10 + x6 | 0;
	    x14 ^= u<<7 | u>>>(32-7);
	    u = x14 + x10 | 0;
	    x2 ^= u<<9 | u>>>(32-9);
	    u = x2 + x14 | 0;
	    x6 ^= u<<13 | u>>>(32-13);
	    u = x6 + x2 | 0;
	    x10 ^= u<<18 | u>>>(32-18);

	    u = x15 + x11 | 0;
	    x3 ^= u<<7 | u>>>(32-7);
	    u = x3 + x15 | 0;
	    x7 ^= u<<9 | u>>>(32-9);
	    u = x7 + x3 | 0;
	    x11 ^= u<<13 | u>>>(32-13);
	    u = x11 + x7 | 0;
	    x15 ^= u<<18 | u>>>(32-18);

	    u = x0 + x3 | 0;
	    x1 ^= u<<7 | u>>>(32-7);
	    u = x1 + x0 | 0;
	    x2 ^= u<<9 | u>>>(32-9);
	    u = x2 + x1 | 0;
	    x3 ^= u<<13 | u>>>(32-13);
	    u = x3 + x2 | 0;
	    x0 ^= u<<18 | u>>>(32-18);

	    u = x5 + x4 | 0;
	    x6 ^= u<<7 | u>>>(32-7);
	    u = x6 + x5 | 0;
	    x7 ^= u<<9 | u>>>(32-9);
	    u = x7 + x6 | 0;
	    x4 ^= u<<13 | u>>>(32-13);
	    u = x4 + x7 | 0;
	    x5 ^= u<<18 | u>>>(32-18);

	    u = x10 + x9 | 0;
	    x11 ^= u<<7 | u>>>(32-7);
	    u = x11 + x10 | 0;
	    x8 ^= u<<9 | u>>>(32-9);
	    u = x8 + x11 | 0;
	    x9 ^= u<<13 | u>>>(32-13);
	    u = x9 + x8 | 0;
	    x10 ^= u<<18 | u>>>(32-18);

	    u = x15 + x14 | 0;
	    x12 ^= u<<7 | u>>>(32-7);
	    u = x12 + x15 | 0;
	    x13 ^= u<<9 | u>>>(32-9);
	    u = x13 + x12 | 0;
	    x14 ^= u<<13 | u>>>(32-13);
	    u = x14 + x13 | 0;
	    x15 ^= u<<18 | u>>>(32-18);
	  }

	  o[ 0] = x0 >>>  0 & 0xff;
	  o[ 1] = x0 >>>  8 & 0xff;
	  o[ 2] = x0 >>> 16 & 0xff;
	  o[ 3] = x0 >>> 24 & 0xff;

	  o[ 4] = x5 >>>  0 & 0xff;
	  o[ 5] = x5 >>>  8 & 0xff;
	  o[ 6] = x5 >>> 16 & 0xff;
	  o[ 7] = x5 >>> 24 & 0xff;

	  o[ 8] = x10 >>>  0 & 0xff;
	  o[ 9] = x10 >>>  8 & 0xff;
	  o[10] = x10 >>> 16 & 0xff;
	  o[11] = x10 >>> 24 & 0xff;

	  o[12] = x15 >>>  0 & 0xff;
	  o[13] = x15 >>>  8 & 0xff;
	  o[14] = x15 >>> 16 & 0xff;
	  o[15] = x15 >>> 24 & 0xff;

	  o[16] = x6 >>>  0 & 0xff;
	  o[17] = x6 >>>  8 & 0xff;
	  o[18] = x6 >>> 16 & 0xff;
	  o[19] = x6 >>> 24 & 0xff;

	  o[20] = x7 >>>  0 & 0xff;
	  o[21] = x7 >>>  8 & 0xff;
	  o[22] = x7 >>> 16 & 0xff;
	  o[23] = x7 >>> 24 & 0xff;

	  o[24] = x8 >>>  0 & 0xff;
	  o[25] = x8 >>>  8 & 0xff;
	  o[26] = x8 >>> 16 & 0xff;
	  o[27] = x8 >>> 24 & 0xff;

	  o[28] = x9 >>>  0 & 0xff;
	  o[29] = x9 >>>  8 & 0xff;
	  o[30] = x9 >>> 16 & 0xff;
	  o[31] = x9 >>> 24 & 0xff;
	}

	function crypto_core_salsa20(out,inp,k,c) {
	  core_salsa20(out,inp,k,c);
	}

	function crypto_core_hsalsa20(out,inp,k,c) {
	  core_hsalsa20(out,inp,k,c);
	}

	var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
	            // "expand 32-byte k"

	function crypto_stream_salsa20_xor(c,cpos,m,mpos,b,n,k) {
	  var z = new Uint8Array(16), x = new Uint8Array(64);
	  var u, i;
	  for (i = 0; i < 16; i++) z[i] = 0;
	  for (i = 0; i < 8; i++) z[i] = n[i];
	  while (b >= 64) {
	    crypto_core_salsa20(x,z,k,sigma);
	    for (i = 0; i < 64; i++) c[cpos+i] = m[mpos+i] ^ x[i];
	    u = 1;
	    for (i = 8; i < 16; i++) {
	      u = u + (z[i] & 0xff) | 0;
	      z[i] = u & 0xff;
	      u >>>= 8;
	    }
	    b -= 64;
	    cpos += 64;
	    mpos += 64;
	  }
	  if (b > 0) {
	    crypto_core_salsa20(x,z,k,sigma);
	    for (i = 0; i < b; i++) c[cpos+i] = m[mpos+i] ^ x[i];
	  }
	  return 0;
	}

	function crypto_stream_salsa20(c,cpos,b,n,k) {
	  var z = new Uint8Array(16), x = new Uint8Array(64);
	  var u, i;
	  for (i = 0; i < 16; i++) z[i] = 0;
	  for (i = 0; i < 8; i++) z[i] = n[i];
	  while (b >= 64) {
	    crypto_core_salsa20(x,z,k,sigma);
	    for (i = 0; i < 64; i++) c[cpos+i] = x[i];
	    u = 1;
	    for (i = 8; i < 16; i++) {
	      u = u + (z[i] & 0xff) | 0;
	      z[i] = u & 0xff;
	      u >>>= 8;
	    }
	    b -= 64;
	    cpos += 64;
	  }
	  if (b > 0) {
	    crypto_core_salsa20(x,z,k,sigma);
	    for (i = 0; i < b; i++) c[cpos+i] = x[i];
	  }
	  return 0;
	}

	function crypto_stream(c,cpos,d,n,k) {
	  var s = new Uint8Array(32);
	  crypto_core_hsalsa20(s,n,k,sigma);
	  var sn = new Uint8Array(8);
	  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
	  return crypto_stream_salsa20(c,cpos,d,sn,s);
	}

	function crypto_stream_xor(c,cpos,m,mpos,d,n,k) {
	  var s = new Uint8Array(32);
	  crypto_core_hsalsa20(s,n,k,sigma);
	  var sn = new Uint8Array(8);
	  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
	  return crypto_stream_salsa20_xor(c,cpos,m,mpos,d,sn,s);
	}

	/*
	* Port of Andrew Moon's Poly1305-donna-16. Public domain.
	* https://github.com/floodyberry/poly1305-donna
	*/

	var poly1305 = function(key) {
	  this.buffer = new Uint8Array(16);
	  this.r = new Uint16Array(10);
	  this.h = new Uint16Array(10);
	  this.pad = new Uint16Array(8);
	  this.leftover = 0;
	  this.fin = 0;

	  var t0, t1, t2, t3, t4, t5, t6, t7;

	  t0 = key[ 0] & 0xff | (key[ 1] & 0xff) << 8; this.r[0] = ( t0                     ) & 0x1fff;
	  t1 = key[ 2] & 0xff | (key[ 3] & 0xff) << 8; this.r[1] = ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
	  t2 = key[ 4] & 0xff | (key[ 5] & 0xff) << 8; this.r[2] = ((t1 >>> 10) | (t2 <<  6)) & 0x1f03;
	  t3 = key[ 6] & 0xff | (key[ 7] & 0xff) << 8; this.r[3] = ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
	  t4 = key[ 8] & 0xff | (key[ 9] & 0xff) << 8; this.r[4] = ((t3 >>>  4) | (t4 << 12)) & 0x00ff;
	  this.r[5] = ((t4 >>>  1)) & 0x1ffe;
	  t5 = key[10] & 0xff | (key[11] & 0xff) << 8; this.r[6] = ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
	  t6 = key[12] & 0xff | (key[13] & 0xff) << 8; this.r[7] = ((t5 >>> 11) | (t6 <<  5)) & 0x1f81;
	  t7 = key[14] & 0xff | (key[15] & 0xff) << 8; this.r[8] = ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
	  this.r[9] = ((t7 >>>  5)) & 0x007f;

	  this.pad[0] = key[16] & 0xff | (key[17] & 0xff) << 8;
	  this.pad[1] = key[18] & 0xff | (key[19] & 0xff) << 8;
	  this.pad[2] = key[20] & 0xff | (key[21] & 0xff) << 8;
	  this.pad[3] = key[22] & 0xff | (key[23] & 0xff) << 8;
	  this.pad[4] = key[24] & 0xff | (key[25] & 0xff) << 8;
	  this.pad[5] = key[26] & 0xff | (key[27] & 0xff) << 8;
	  this.pad[6] = key[28] & 0xff | (key[29] & 0xff) << 8;
	  this.pad[7] = key[30] & 0xff | (key[31] & 0xff) << 8;
	};

	poly1305.prototype.blocks = function(m, mpos, bytes) {
	  var hibit = this.fin ? 0 : (1 << 11);
	  var t0, t1, t2, t3, t4, t5, t6, t7, c;
	  var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;

	  var h0 = this.h[0],
	      h1 = this.h[1],
	      h2 = this.h[2],
	      h3 = this.h[3],
	      h4 = this.h[4],
	      h5 = this.h[5],
	      h6 = this.h[6],
	      h7 = this.h[7],
	      h8 = this.h[8],
	      h9 = this.h[9];

	  var r0 = this.r[0],
	      r1 = this.r[1],
	      r2 = this.r[2],
	      r3 = this.r[3],
	      r4 = this.r[4],
	      r5 = this.r[5],
	      r6 = this.r[6],
	      r7 = this.r[7],
	      r8 = this.r[8],
	      r9 = this.r[9];

	  while (bytes >= 16) {
	    t0 = m[mpos+ 0] & 0xff | (m[mpos+ 1] & 0xff) << 8; h0 += ( t0                     ) & 0x1fff;
	    t1 = m[mpos+ 2] & 0xff | (m[mpos+ 3] & 0xff) << 8; h1 += ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
	    t2 = m[mpos+ 4] & 0xff | (m[mpos+ 5] & 0xff) << 8; h2 += ((t1 >>> 10) | (t2 <<  6)) & 0x1fff;
	    t3 = m[mpos+ 6] & 0xff | (m[mpos+ 7] & 0xff) << 8; h3 += ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
	    t4 = m[mpos+ 8] & 0xff | (m[mpos+ 9] & 0xff) << 8; h4 += ((t3 >>>  4) | (t4 << 12)) & 0x1fff;
	    h5 += ((t4 >>>  1)) & 0x1fff;
	    t5 = m[mpos+10] & 0xff | (m[mpos+11] & 0xff) << 8; h6 += ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
	    t6 = m[mpos+12] & 0xff | (m[mpos+13] & 0xff) << 8; h7 += ((t5 >>> 11) | (t6 <<  5)) & 0x1fff;
	    t7 = m[mpos+14] & 0xff | (m[mpos+15] & 0xff) << 8; h8 += ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
	    h9 += ((t7 >>> 5)) | hibit;

	    c = 0;

	    d0 = c;
	    d0 += h0 * r0;
	    d0 += h1 * (5 * r9);
	    d0 += h2 * (5 * r8);
	    d0 += h3 * (5 * r7);
	    d0 += h4 * (5 * r6);
	    c = (d0 >>> 13); d0 &= 0x1fff;
	    d0 += h5 * (5 * r5);
	    d0 += h6 * (5 * r4);
	    d0 += h7 * (5 * r3);
	    d0 += h8 * (5 * r2);
	    d0 += h9 * (5 * r1);
	    c += (d0 >>> 13); d0 &= 0x1fff;

	    d1 = c;
	    d1 += h0 * r1;
	    d1 += h1 * r0;
	    d1 += h2 * (5 * r9);
	    d1 += h3 * (5 * r8);
	    d1 += h4 * (5 * r7);
	    c = (d1 >>> 13); d1 &= 0x1fff;
	    d1 += h5 * (5 * r6);
	    d1 += h6 * (5 * r5);
	    d1 += h7 * (5 * r4);
	    d1 += h8 * (5 * r3);
	    d1 += h9 * (5 * r2);
	    c += (d1 >>> 13); d1 &= 0x1fff;

	    d2 = c;
	    d2 += h0 * r2;
	    d2 += h1 * r1;
	    d2 += h2 * r0;
	    d2 += h3 * (5 * r9);
	    d2 += h4 * (5 * r8);
	    c = (d2 >>> 13); d2 &= 0x1fff;
	    d2 += h5 * (5 * r7);
	    d2 += h6 * (5 * r6);
	    d2 += h7 * (5 * r5);
	    d2 += h8 * (5 * r4);
	    d2 += h9 * (5 * r3);
	    c += (d2 >>> 13); d2 &= 0x1fff;

	    d3 = c;
	    d3 += h0 * r3;
	    d3 += h1 * r2;
	    d3 += h2 * r1;
	    d3 += h3 * r0;
	    d3 += h4 * (5 * r9);
	    c = (d3 >>> 13); d3 &= 0x1fff;
	    d3 += h5 * (5 * r8);
	    d3 += h6 * (5 * r7);
	    d3 += h7 * (5 * r6);
	    d3 += h8 * (5 * r5);
	    d3 += h9 * (5 * r4);
	    c += (d3 >>> 13); d3 &= 0x1fff;

	    d4 = c;
	    d4 += h0 * r4;
	    d4 += h1 * r3;
	    d4 += h2 * r2;
	    d4 += h3 * r1;
	    d4 += h4 * r0;
	    c = (d4 >>> 13); d4 &= 0x1fff;
	    d4 += h5 * (5 * r9);
	    d4 += h6 * (5 * r8);
	    d4 += h7 * (5 * r7);
	    d4 += h8 * (5 * r6);
	    d4 += h9 * (5 * r5);
	    c += (d4 >>> 13); d4 &= 0x1fff;

	    d5 = c;
	    d5 += h0 * r5;
	    d5 += h1 * r4;
	    d5 += h2 * r3;
	    d5 += h3 * r2;
	    d5 += h4 * r1;
	    c = (d5 >>> 13); d5 &= 0x1fff;
	    d5 += h5 * r0;
	    d5 += h6 * (5 * r9);
	    d5 += h7 * (5 * r8);
	    d5 += h8 * (5 * r7);
	    d5 += h9 * (5 * r6);
	    c += (d5 >>> 13); d5 &= 0x1fff;

	    d6 = c;
	    d6 += h0 * r6;
	    d6 += h1 * r5;
	    d6 += h2 * r4;
	    d6 += h3 * r3;
	    d6 += h4 * r2;
	    c = (d6 >>> 13); d6 &= 0x1fff;
	    d6 += h5 * r1;
	    d6 += h6 * r0;
	    d6 += h7 * (5 * r9);
	    d6 += h8 * (5 * r8);
	    d6 += h9 * (5 * r7);
	    c += (d6 >>> 13); d6 &= 0x1fff;

	    d7 = c;
	    d7 += h0 * r7;
	    d7 += h1 * r6;
	    d7 += h2 * r5;
	    d7 += h3 * r4;
	    d7 += h4 * r3;
	    c = (d7 >>> 13); d7 &= 0x1fff;
	    d7 += h5 * r2;
	    d7 += h6 * r1;
	    d7 += h7 * r0;
	    d7 += h8 * (5 * r9);
	    d7 += h9 * (5 * r8);
	    c += (d7 >>> 13); d7 &= 0x1fff;

	    d8 = c;
	    d8 += h0 * r8;
	    d8 += h1 * r7;
	    d8 += h2 * r6;
	    d8 += h3 * r5;
	    d8 += h4 * r4;
	    c = (d8 >>> 13); d8 &= 0x1fff;
	    d8 += h5 * r3;
	    d8 += h6 * r2;
	    d8 += h7 * r1;
	    d8 += h8 * r0;
	    d8 += h9 * (5 * r9);
	    c += (d8 >>> 13); d8 &= 0x1fff;

	    d9 = c;
	    d9 += h0 * r9;
	    d9 += h1 * r8;
	    d9 += h2 * r7;
	    d9 += h3 * r6;
	    d9 += h4 * r5;
	    c = (d9 >>> 13); d9 &= 0x1fff;
	    d9 += h5 * r4;
	    d9 += h6 * r3;
	    d9 += h7 * r2;
	    d9 += h8 * r1;
	    d9 += h9 * r0;
	    c += (d9 >>> 13); d9 &= 0x1fff;

	    c = (((c << 2) + c)) | 0;
	    c = (c + d0) | 0;
	    d0 = c & 0x1fff;
	    c = (c >>> 13);
	    d1 += c;

	    h0 = d0;
	    h1 = d1;
	    h2 = d2;
	    h3 = d3;
	    h4 = d4;
	    h5 = d5;
	    h6 = d6;
	    h7 = d7;
	    h8 = d8;
	    h9 = d9;

	    mpos += 16;
	    bytes -= 16;
	  }
	  this.h[0] = h0;
	  this.h[1] = h1;
	  this.h[2] = h2;
	  this.h[3] = h3;
	  this.h[4] = h4;
	  this.h[5] = h5;
	  this.h[6] = h6;
	  this.h[7] = h7;
	  this.h[8] = h8;
	  this.h[9] = h9;
	};

	poly1305.prototype.finish = function(mac, macpos) {
	  var g = new Uint16Array(10);
	  var c, mask, f, i;

	  if (this.leftover) {
	    i = this.leftover;
	    this.buffer[i++] = 1;
	    for (; i < 16; i++) this.buffer[i] = 0;
	    this.fin = 1;
	    this.blocks(this.buffer, 0, 16);
	  }

	  c = this.h[1] >>> 13;
	  this.h[1] &= 0x1fff;
	  for (i = 2; i < 10; i++) {
	    this.h[i] += c;
	    c = this.h[i] >>> 13;
	    this.h[i] &= 0x1fff;
	  }
	  this.h[0] += (c * 5);
	  c = this.h[0] >>> 13;
	  this.h[0] &= 0x1fff;
	  this.h[1] += c;
	  c = this.h[1] >>> 13;
	  this.h[1] &= 0x1fff;
	  this.h[2] += c;

	  g[0] = this.h[0] + 5;
	  c = g[0] >>> 13;
	  g[0] &= 0x1fff;
	  for (i = 1; i < 10; i++) {
	    g[i] = this.h[i] + c;
	    c = g[i] >>> 13;
	    g[i] &= 0x1fff;
	  }
	  g[9] -= (1 << 13);

	  mask = (g[9] >>> ((2 * 8) - 1)) - 1;
	  for (i = 0; i < 10; i++) g[i] &= mask;
	  mask = ~mask;
	  for (i = 0; i < 10; i++) this.h[i] = (this.h[i] & mask) | g[i];

	  this.h[0] = ((this.h[0]       ) | (this.h[1] << 13)                    ) & 0xffff;
	  this.h[1] = ((this.h[1] >>>  3) | (this.h[2] << 10)                    ) & 0xffff;
	  this.h[2] = ((this.h[2] >>>  6) | (this.h[3] <<  7)                    ) & 0xffff;
	  this.h[3] = ((this.h[3] >>>  9) | (this.h[4] <<  4)                    ) & 0xffff;
	  this.h[4] = ((this.h[4] >>> 12) | (this.h[5] <<  1) | (this.h[6] << 14)) & 0xffff;
	  this.h[5] = ((this.h[6] >>>  2) | (this.h[7] << 11)                    ) & 0xffff;
	  this.h[6] = ((this.h[7] >>>  5) | (this.h[8] <<  8)                    ) & 0xffff;
	  this.h[7] = ((this.h[8] >>>  8) | (this.h[9] <<  5)                    ) & 0xffff;

	  f = this.h[0] + this.pad[0];
	  this.h[0] = f & 0xffff;
	  for (i = 1; i < 8; i++) {
	    f = (((this.h[i] + this.pad[i]) | 0) + (f >>> 16)) | 0;
	    this.h[i] = f & 0xffff;
	  }

	  mac[macpos+ 0] = (this.h[0] >>> 0) & 0xff;
	  mac[macpos+ 1] = (this.h[0] >>> 8) & 0xff;
	  mac[macpos+ 2] = (this.h[1] >>> 0) & 0xff;
	  mac[macpos+ 3] = (this.h[1] >>> 8) & 0xff;
	  mac[macpos+ 4] = (this.h[2] >>> 0) & 0xff;
	  mac[macpos+ 5] = (this.h[2] >>> 8) & 0xff;
	  mac[macpos+ 6] = (this.h[3] >>> 0) & 0xff;
	  mac[macpos+ 7] = (this.h[3] >>> 8) & 0xff;
	  mac[macpos+ 8] = (this.h[4] >>> 0) & 0xff;
	  mac[macpos+ 9] = (this.h[4] >>> 8) & 0xff;
	  mac[macpos+10] = (this.h[5] >>> 0) & 0xff;
	  mac[macpos+11] = (this.h[5] >>> 8) & 0xff;
	  mac[macpos+12] = (this.h[6] >>> 0) & 0xff;
	  mac[macpos+13] = (this.h[6] >>> 8) & 0xff;
	  mac[macpos+14] = (this.h[7] >>> 0) & 0xff;
	  mac[macpos+15] = (this.h[7] >>> 8) & 0xff;
	};

	poly1305.prototype.update = function(m, mpos, bytes) {
	  var i, want;

	  if (this.leftover) {
	    want = (16 - this.leftover);
	    if (want > bytes)
	      want = bytes;
	    for (i = 0; i < want; i++)
	      this.buffer[this.leftover + i] = m[mpos+i];
	    bytes -= want;
	    mpos += want;
	    this.leftover += want;
	    if (this.leftover < 16)
	      return;
	    this.blocks(this.buffer, 0, 16);
	    this.leftover = 0;
	  }

	  if (bytes >= 16) {
	    want = bytes - (bytes % 16);
	    this.blocks(m, mpos, want);
	    mpos += want;
	    bytes -= want;
	  }

	  if (bytes) {
	    for (i = 0; i < bytes; i++)
	      this.buffer[this.leftover + i] = m[mpos+i];
	    this.leftover += bytes;
	  }
	};

	function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
	  var s = new poly1305(k);
	  s.update(m, mpos, n);
	  s.finish(out, outpos);
	  return 0;
	}

	function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
	  var x = new Uint8Array(16);
	  crypto_onetimeauth(x,0,m,mpos,n,k);
	  return crypto_verify_16(h,hpos,x,0);
	}

	function crypto_secretbox(c,m,d,n,k) {
	  var i;
	  if (d < 32) return -1;
	  crypto_stream_xor(c,0,m,0,d,n,k);
	  crypto_onetimeauth(c, 16, c, 32, d - 32, c);
	  for (i = 0; i < 16; i++) c[i] = 0;
	  return 0;
	}

	function crypto_secretbox_open(m,c,d,n,k) {
	  var i;
	  var x = new Uint8Array(32);
	  if (d < 32) return -1;
	  crypto_stream(x,0,32,n,k);
	  if (crypto_onetimeauth_verify(c, 16,c, 32,d - 32,x) !== 0) return -1;
	  crypto_stream_xor(m,0,c,0,d,n,k);
	  for (i = 0; i < 32; i++) m[i] = 0;
	  return 0;
	}

	function set25519(r, a) {
	  var i;
	  for (i = 0; i < 16; i++) r[i] = a[i]|0;
	}

	function car25519(o) {
	  var i, v, c = 1;
	  for (i = 0; i < 16; i++) {
	    v = o[i] + c + 65535;
	    c = Math.floor(v / 65536);
	    o[i] = v - c * 65536;
	  }
	  o[0] += c-1 + 37 * (c-1);
	}

	function sel25519(p, q, b) {
	  var t, c = ~(b-1);
	  for (var i = 0; i < 16; i++) {
	    t = c & (p[i] ^ q[i]);
	    p[i] ^= t;
	    q[i] ^= t;
	  }
	}

	function pack25519(o, n) {
	  var i, j, b;
	  var m = gf(), t = gf();
	  for (i = 0; i < 16; i++) t[i] = n[i];
	  car25519(t);
	  car25519(t);
	  car25519(t);
	  for (j = 0; j < 2; j++) {
	    m[0] = t[0] - 0xffed;
	    for (i = 1; i < 15; i++) {
	      m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
	      m[i-1] &= 0xffff;
	    }
	    m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
	    b = (m[15]>>16) & 1;
	    m[14] &= 0xffff;
	    sel25519(t, m, 1-b);
	  }
	  for (i = 0; i < 16; i++) {
	    o[2*i] = t[i] & 0xff;
	    o[2*i+1] = t[i]>>8;
	  }
	}

	function neq25519(a, b) {
	  var c = new Uint8Array(32), d = new Uint8Array(32);
	  pack25519(c, a);
	  pack25519(d, b);
	  return crypto_verify_32(c, 0, d, 0);
	}

	function par25519(a) {
	  var d = new Uint8Array(32);
	  pack25519(d, a);
	  return d[0] & 1;
	}

	function unpack25519(o, n) {
	  var i;
	  for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
	  o[15] &= 0x7fff;
	}

	function A(o, a, b) {
	  for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
	}

	function Z(o, a, b) {
	  for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
	}

	function M(o, a, b) {
	  var v, c,
	     t0 = 0,  t1 = 0,  t2 = 0,  t3 = 0,  t4 = 0,  t5 = 0,  t6 = 0,  t7 = 0,
	     t8 = 0,  t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0,
	    t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0,
	    t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0,
	    b0 = b[0],
	    b1 = b[1],
	    b2 = b[2],
	    b3 = b[3],
	    b4 = b[4],
	    b5 = b[5],
	    b6 = b[6],
	    b7 = b[7],
	    b8 = b[8],
	    b9 = b[9],
	    b10 = b[10],
	    b11 = b[11],
	    b12 = b[12],
	    b13 = b[13],
	    b14 = b[14],
	    b15 = b[15];

	  v = a[0];
	  t0 += v * b0;
	  t1 += v * b1;
	  t2 += v * b2;
	  t3 += v * b3;
	  t4 += v * b4;
	  t5 += v * b5;
	  t6 += v * b6;
	  t7 += v * b7;
	  t8 += v * b8;
	  t9 += v * b9;
	  t10 += v * b10;
	  t11 += v * b11;
	  t12 += v * b12;
	  t13 += v * b13;
	  t14 += v * b14;
	  t15 += v * b15;
	  v = a[1];
	  t1 += v * b0;
	  t2 += v * b1;
	  t3 += v * b2;
	  t4 += v * b3;
	  t5 += v * b4;
	  t6 += v * b5;
	  t7 += v * b6;
	  t8 += v * b7;
	  t9 += v * b8;
	  t10 += v * b9;
	  t11 += v * b10;
	  t12 += v * b11;
	  t13 += v * b12;
	  t14 += v * b13;
	  t15 += v * b14;
	  t16 += v * b15;
	  v = a[2];
	  t2 += v * b0;
	  t3 += v * b1;
	  t4 += v * b2;
	  t5 += v * b3;
	  t6 += v * b4;
	  t7 += v * b5;
	  t8 += v * b6;
	  t9 += v * b7;
	  t10 += v * b8;
	  t11 += v * b9;
	  t12 += v * b10;
	  t13 += v * b11;
	  t14 += v * b12;
	  t15 += v * b13;
	  t16 += v * b14;
	  t17 += v * b15;
	  v = a[3];
	  t3 += v * b0;
	  t4 += v * b1;
	  t5 += v * b2;
	  t6 += v * b3;
	  t7 += v * b4;
	  t8 += v * b5;
	  t9 += v * b6;
	  t10 += v * b7;
	  t11 += v * b8;
	  t12 += v * b9;
	  t13 += v * b10;
	  t14 += v * b11;
	  t15 += v * b12;
	  t16 += v * b13;
	  t17 += v * b14;
	  t18 += v * b15;
	  v = a[4];
	  t4 += v * b0;
	  t5 += v * b1;
	  t6 += v * b2;
	  t7 += v * b3;
	  t8 += v * b4;
	  t9 += v * b5;
	  t10 += v * b6;
	  t11 += v * b7;
	  t12 += v * b8;
	  t13 += v * b9;
	  t14 += v * b10;
	  t15 += v * b11;
	  t16 += v * b12;
	  t17 += v * b13;
	  t18 += v * b14;
	  t19 += v * b15;
	  v = a[5];
	  t5 += v * b0;
	  t6 += v * b1;
	  t7 += v * b2;
	  t8 += v * b3;
	  t9 += v * b4;
	  t10 += v * b5;
	  t11 += v * b6;
	  t12 += v * b7;
	  t13 += v * b8;
	  t14 += v * b9;
	  t15 += v * b10;
	  t16 += v * b11;
	  t17 += v * b12;
	  t18 += v * b13;
	  t19 += v * b14;
	  t20 += v * b15;
	  v = a[6];
	  t6 += v * b0;
	  t7 += v * b1;
	  t8 += v * b2;
	  t9 += v * b3;
	  t10 += v * b4;
	  t11 += v * b5;
	  t12 += v * b6;
	  t13 += v * b7;
	  t14 += v * b8;
	  t15 += v * b9;
	  t16 += v * b10;
	  t17 += v * b11;
	  t18 += v * b12;
	  t19 += v * b13;
	  t20 += v * b14;
	  t21 += v * b15;
	  v = a[7];
	  t7 += v * b0;
	  t8 += v * b1;
	  t9 += v * b2;
	  t10 += v * b3;
	  t11 += v * b4;
	  t12 += v * b5;
	  t13 += v * b6;
	  t14 += v * b7;
	  t15 += v * b8;
	  t16 += v * b9;
	  t17 += v * b10;
	  t18 += v * b11;
	  t19 += v * b12;
	  t20 += v * b13;
	  t21 += v * b14;
	  t22 += v * b15;
	  v = a[8];
	  t8 += v * b0;
	  t9 += v * b1;
	  t10 += v * b2;
	  t11 += v * b3;
	  t12 += v * b4;
	  t13 += v * b5;
	  t14 += v * b6;
	  t15 += v * b7;
	  t16 += v * b8;
	  t17 += v * b9;
	  t18 += v * b10;
	  t19 += v * b11;
	  t20 += v * b12;
	  t21 += v * b13;
	  t22 += v * b14;
	  t23 += v * b15;
	  v = a[9];
	  t9 += v * b0;
	  t10 += v * b1;
	  t11 += v * b2;
	  t12 += v * b3;
	  t13 += v * b4;
	  t14 += v * b5;
	  t15 += v * b6;
	  t16 += v * b7;
	  t17 += v * b8;
	  t18 += v * b9;
	  t19 += v * b10;
	  t20 += v * b11;
	  t21 += v * b12;
	  t22 += v * b13;
	  t23 += v * b14;
	  t24 += v * b15;
	  v = a[10];
	  t10 += v * b0;
	  t11 += v * b1;
	  t12 += v * b2;
	  t13 += v * b3;
	  t14 += v * b4;
	  t15 += v * b5;
	  t16 += v * b6;
	  t17 += v * b7;
	  t18 += v * b8;
	  t19 += v * b9;
	  t20 += v * b10;
	  t21 += v * b11;
	  t22 += v * b12;
	  t23 += v * b13;
	  t24 += v * b14;
	  t25 += v * b15;
	  v = a[11];
	  t11 += v * b0;
	  t12 += v * b1;
	  t13 += v * b2;
	  t14 += v * b3;
	  t15 += v * b4;
	  t16 += v * b5;
	  t17 += v * b6;
	  t18 += v * b7;
	  t19 += v * b8;
	  t20 += v * b9;
	  t21 += v * b10;
	  t22 += v * b11;
	  t23 += v * b12;
	  t24 += v * b13;
	  t25 += v * b14;
	  t26 += v * b15;
	  v = a[12];
	  t12 += v * b0;
	  t13 += v * b1;
	  t14 += v * b2;
	  t15 += v * b3;
	  t16 += v * b4;
	  t17 += v * b5;
	  t18 += v * b6;
	  t19 += v * b7;
	  t20 += v * b8;
	  t21 += v * b9;
	  t22 += v * b10;
	  t23 += v * b11;
	  t24 += v * b12;
	  t25 += v * b13;
	  t26 += v * b14;
	  t27 += v * b15;
	  v = a[13];
	  t13 += v * b0;
	  t14 += v * b1;
	  t15 += v * b2;
	  t16 += v * b3;
	  t17 += v * b4;
	  t18 += v * b5;
	  t19 += v * b6;
	  t20 += v * b7;
	  t21 += v * b8;
	  t22 += v * b9;
	  t23 += v * b10;
	  t24 += v * b11;
	  t25 += v * b12;
	  t26 += v * b13;
	  t27 += v * b14;
	  t28 += v * b15;
	  v = a[14];
	  t14 += v * b0;
	  t15 += v * b1;
	  t16 += v * b2;
	  t17 += v * b3;
	  t18 += v * b4;
	  t19 += v * b5;
	  t20 += v * b6;
	  t21 += v * b7;
	  t22 += v * b8;
	  t23 += v * b9;
	  t24 += v * b10;
	  t25 += v * b11;
	  t26 += v * b12;
	  t27 += v * b13;
	  t28 += v * b14;
	  t29 += v * b15;
	  v = a[15];
	  t15 += v * b0;
	  t16 += v * b1;
	  t17 += v * b2;
	  t18 += v * b3;
	  t19 += v * b4;
	  t20 += v * b5;
	  t21 += v * b6;
	  t22 += v * b7;
	  t23 += v * b8;
	  t24 += v * b9;
	  t25 += v * b10;
	  t26 += v * b11;
	  t27 += v * b12;
	  t28 += v * b13;
	  t29 += v * b14;
	  t30 += v * b15;

	  t0  += 38 * t16;
	  t1  += 38 * t17;
	  t2  += 38 * t18;
	  t3  += 38 * t19;
	  t4  += 38 * t20;
	  t5  += 38 * t21;
	  t6  += 38 * t22;
	  t7  += 38 * t23;
	  t8  += 38 * t24;
	  t9  += 38 * t25;
	  t10 += 38 * t26;
	  t11 += 38 * t27;
	  t12 += 38 * t28;
	  t13 += 38 * t29;
	  t14 += 38 * t30;
	  // t15 left as is

	  // first car
	  c = 1;
	  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
	  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
	  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
	  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
	  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
	  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
	  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
	  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
	  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
	  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
	  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
	  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
	  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
	  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
	  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
	  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
	  t0 += c-1 + 37 * (c-1);

	  // second car
	  c = 1;
	  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
	  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
	  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
	  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
	  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
	  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
	  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
	  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
	  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
	  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
	  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
	  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
	  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
	  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
	  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
	  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
	  t0 += c-1 + 37 * (c-1);

	  o[ 0] = t0;
	  o[ 1] = t1;
	  o[ 2] = t2;
	  o[ 3] = t3;
	  o[ 4] = t4;
	  o[ 5] = t5;
	  o[ 6] = t6;
	  o[ 7] = t7;
	  o[ 8] = t8;
	  o[ 9] = t9;
	  o[10] = t10;
	  o[11] = t11;
	  o[12] = t12;
	  o[13] = t13;
	  o[14] = t14;
	  o[15] = t15;
	}

	function S(o, a) {
	  M(o, a, a);
	}

	function inv25519(o, i) {
	  var c = gf();
	  var a;
	  for (a = 0; a < 16; a++) c[a] = i[a];
	  for (a = 253; a >= 0; a--) {
	    S(c, c);
	    if(a !== 2 && a !== 4) M(c, c, i);
	  }
	  for (a = 0; a < 16; a++) o[a] = c[a];
	}

	function pow2523(o, i) {
	  var c = gf();
	  var a;
	  for (a = 0; a < 16; a++) c[a] = i[a];
	  for (a = 250; a >= 0; a--) {
	      S(c, c);
	      if(a !== 1) M(c, c, i);
	  }
	  for (a = 0; a < 16; a++) o[a] = c[a];
	}

	function crypto_scalarmult(q, n, p) {
	  var z = new Uint8Array(32);
	  var x = new Float64Array(80), r, i;
	  var a = gf(), b = gf(), c = gf(),
	      d = gf(), e = gf(), f = gf();
	  for (i = 0; i < 31; i++) z[i] = n[i];
	  z[31]=(n[31]&127)|64;
	  z[0]&=248;
	  unpack25519(x,p);
	  for (i = 0; i < 16; i++) {
	    b[i]=x[i];
	    d[i]=a[i]=c[i]=0;
	  }
	  a[0]=d[0]=1;
	  for (i=254; i>=0; --i) {
	    r=(z[i>>>3]>>>(i&7))&1;
	    sel25519(a,b,r);
	    sel25519(c,d,r);
	    A(e,a,c);
	    Z(a,a,c);
	    A(c,b,d);
	    Z(b,b,d);
	    S(d,e);
	    S(f,a);
	    M(a,c,a);
	    M(c,b,e);
	    A(e,a,c);
	    Z(a,a,c);
	    S(b,a);
	    Z(c,d,f);
	    M(a,c,_121665);
	    A(a,a,d);
	    M(c,c,a);
	    M(a,d,f);
	    M(d,b,x);
	    S(b,e);
	    sel25519(a,b,r);
	    sel25519(c,d,r);
	  }
	  for (i = 0; i < 16; i++) {
	    x[i+16]=a[i];
	    x[i+32]=c[i];
	    x[i+48]=b[i];
	    x[i+64]=d[i];
	  }
	  var x32 = x.subarray(32);
	  var x16 = x.subarray(16);
	  inv25519(x32,x32);
	  M(x16,x16,x32);
	  pack25519(q,x16);
	  return 0;
	}

	function crypto_scalarmult_base(q, n) {
	  return crypto_scalarmult(q, n, _9);
	}

	function crypto_box_keypair(y, x) {
	  randombytes(x, 32);
	  return crypto_scalarmult_base(y, x);
	}

	function crypto_box_beforenm(k, y, x) {
	  var s = new Uint8Array(32);
	  crypto_scalarmult(s, x, y);
	  return crypto_core_hsalsa20(k, _0, s, sigma);
	}

	var crypto_box_afternm = crypto_secretbox;
	var crypto_box_open_afternm = crypto_secretbox_open;

	function crypto_box(c, m, d, n, y, x) {
	  var k = new Uint8Array(32);
	  crypto_box_beforenm(k, y, x);
	  return crypto_box_afternm(c, m, d, n, k);
	}

	function crypto_box_open(m, c, d, n, y, x) {
	  var k = new Uint8Array(32);
	  crypto_box_beforenm(k, y, x);
	  return crypto_box_open_afternm(m, c, d, n, k);
	}

	var K = [
	  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
	  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
	  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
	  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
	  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
	  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
	  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
	  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
	  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
	  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
	  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
	  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
	  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
	  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
	  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
	  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
	  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
	  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
	  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
	  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
	  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
	  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
	  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
	  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
	  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
	  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
	  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
	  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
	  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
	  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
	  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
	  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
	  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
	  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
	  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
	  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
	  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
	  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
	  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
	  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
	];

	function crypto_hashblocks_hl(hh, hl, m, n) {
	  var wh = new Int32Array(16), wl = new Int32Array(16),
	      bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7,
	      bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7,
	      th, tl, i, j, h, l, a, b, c, d;

	  var ah0 = hh[0],
	      ah1 = hh[1],
	      ah2 = hh[2],
	      ah3 = hh[3],
	      ah4 = hh[4],
	      ah5 = hh[5],
	      ah6 = hh[6],
	      ah7 = hh[7],

	      al0 = hl[0],
	      al1 = hl[1],
	      al2 = hl[2],
	      al3 = hl[3],
	      al4 = hl[4],
	      al5 = hl[5],
	      al6 = hl[6],
	      al7 = hl[7];

	  var pos = 0;
	  while (n >= 128) {
	    for (i = 0; i < 16; i++) {
	      j = 8 * i + pos;
	      wh[i] = (m[j+0] << 24) | (m[j+1] << 16) | (m[j+2] << 8) | m[j+3];
	      wl[i] = (m[j+4] << 24) | (m[j+5] << 16) | (m[j+6] << 8) | m[j+7];
	    }
	    for (i = 0; i < 80; i++) {
	      bh0 = ah0;
	      bh1 = ah1;
	      bh2 = ah2;
	      bh3 = ah3;
	      bh4 = ah4;
	      bh5 = ah5;
	      bh6 = ah6;
	      bh7 = ah7;

	      bl0 = al0;
	      bl1 = al1;
	      bl2 = al2;
	      bl3 = al3;
	      bl4 = al4;
	      bl5 = al5;
	      bl6 = al6;
	      bl7 = al7;

	      // add
	      h = ah7;
	      l = al7;

	      a = l & 0xffff; b = l >>> 16;
	      c = h & 0xffff; d = h >>> 16;

	      // Sigma1
	      h = ((ah4 >>> 14) | (al4 << (32-14))) ^ ((ah4 >>> 18) | (al4 << (32-18))) ^ ((al4 >>> (41-32)) | (ah4 << (32-(41-32))));
	      l = ((al4 >>> 14) | (ah4 << (32-14))) ^ ((al4 >>> 18) | (ah4 << (32-18))) ^ ((ah4 >>> (41-32)) | (al4 << (32-(41-32))));

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      // Ch
	      h = (ah4 & ah5) ^ (~ah4 & ah6);
	      l = (al4 & al5) ^ (~al4 & al6);

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      // K
	      h = K[i*2];
	      l = K[i*2+1];

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      // w
	      h = wh[i%16];
	      l = wl[i%16];

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      b += a >>> 16;
	      c += b >>> 16;
	      d += c >>> 16;

	      th = c & 0xffff | d << 16;
	      tl = a & 0xffff | b << 16;

	      // add
	      h = th;
	      l = tl;

	      a = l & 0xffff; b = l >>> 16;
	      c = h & 0xffff; d = h >>> 16;

	      // Sigma0
	      h = ((ah0 >>> 28) | (al0 << (32-28))) ^ ((al0 >>> (34-32)) | (ah0 << (32-(34-32)))) ^ ((al0 >>> (39-32)) | (ah0 << (32-(39-32))));
	      l = ((al0 >>> 28) | (ah0 << (32-28))) ^ ((ah0 >>> (34-32)) | (al0 << (32-(34-32)))) ^ ((ah0 >>> (39-32)) | (al0 << (32-(39-32))));

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      // Maj
	      h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
	      l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      b += a >>> 16;
	      c += b >>> 16;
	      d += c >>> 16;

	      bh7 = (c & 0xffff) | (d << 16);
	      bl7 = (a & 0xffff) | (b << 16);

	      // add
	      h = bh3;
	      l = bl3;

	      a = l & 0xffff; b = l >>> 16;
	      c = h & 0xffff; d = h >>> 16;

	      h = th;
	      l = tl;

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      b += a >>> 16;
	      c += b >>> 16;
	      d += c >>> 16;

	      bh3 = (c & 0xffff) | (d << 16);
	      bl3 = (a & 0xffff) | (b << 16);

	      ah1 = bh0;
	      ah2 = bh1;
	      ah3 = bh2;
	      ah4 = bh3;
	      ah5 = bh4;
	      ah6 = bh5;
	      ah7 = bh6;
	      ah0 = bh7;

	      al1 = bl0;
	      al2 = bl1;
	      al3 = bl2;
	      al4 = bl3;
	      al5 = bl4;
	      al6 = bl5;
	      al7 = bl6;
	      al0 = bl7;

	      if (i%16 === 15) {
	        for (j = 0; j < 16; j++) {
	          // add
	          h = wh[j];
	          l = wl[j];

	          a = l & 0xffff; b = l >>> 16;
	          c = h & 0xffff; d = h >>> 16;

	          h = wh[(j+9)%16];
	          l = wl[(j+9)%16];

	          a += l & 0xffff; b += l >>> 16;
	          c += h & 0xffff; d += h >>> 16;

	          // sigma0
	          th = wh[(j+1)%16];
	          tl = wl[(j+1)%16];
	          h = ((th >>> 1) | (tl << (32-1))) ^ ((th >>> 8) | (tl << (32-8))) ^ (th >>> 7);
	          l = ((tl >>> 1) | (th << (32-1))) ^ ((tl >>> 8) | (th << (32-8))) ^ ((tl >>> 7) | (th << (32-7)));

	          a += l & 0xffff; b += l >>> 16;
	          c += h & 0xffff; d += h >>> 16;

	          // sigma1
	          th = wh[(j+14)%16];
	          tl = wl[(j+14)%16];
	          h = ((th >>> 19) | (tl << (32-19))) ^ ((tl >>> (61-32)) | (th << (32-(61-32)))) ^ (th >>> 6);
	          l = ((tl >>> 19) | (th << (32-19))) ^ ((th >>> (61-32)) | (tl << (32-(61-32)))) ^ ((tl >>> 6) | (th << (32-6)));

	          a += l & 0xffff; b += l >>> 16;
	          c += h & 0xffff; d += h >>> 16;

	          b += a >>> 16;
	          c += b >>> 16;
	          d += c >>> 16;

	          wh[j] = (c & 0xffff) | (d << 16);
	          wl[j] = (a & 0xffff) | (b << 16);
	        }
	      }
	    }

	    // add
	    h = ah0;
	    l = al0;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[0];
	    l = hl[0];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[0] = ah0 = (c & 0xffff) | (d << 16);
	    hl[0] = al0 = (a & 0xffff) | (b << 16);

	    h = ah1;
	    l = al1;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[1];
	    l = hl[1];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[1] = ah1 = (c & 0xffff) | (d << 16);
	    hl[1] = al1 = (a & 0xffff) | (b << 16);

	    h = ah2;
	    l = al2;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[2];
	    l = hl[2];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[2] = ah2 = (c & 0xffff) | (d << 16);
	    hl[2] = al2 = (a & 0xffff) | (b << 16);

	    h = ah3;
	    l = al3;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[3];
	    l = hl[3];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[3] = ah3 = (c & 0xffff) | (d << 16);
	    hl[3] = al3 = (a & 0xffff) | (b << 16);

	    h = ah4;
	    l = al4;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[4];
	    l = hl[4];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[4] = ah4 = (c & 0xffff) | (d << 16);
	    hl[4] = al4 = (a & 0xffff) | (b << 16);

	    h = ah5;
	    l = al5;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[5];
	    l = hl[5];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[5] = ah5 = (c & 0xffff) | (d << 16);
	    hl[5] = al5 = (a & 0xffff) | (b << 16);

	    h = ah6;
	    l = al6;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[6];
	    l = hl[6];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[6] = ah6 = (c & 0xffff) | (d << 16);
	    hl[6] = al6 = (a & 0xffff) | (b << 16);

	    h = ah7;
	    l = al7;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[7];
	    l = hl[7];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[7] = ah7 = (c & 0xffff) | (d << 16);
	    hl[7] = al7 = (a & 0xffff) | (b << 16);

	    pos += 128;
	    n -= 128;
	  }

	  return n;
	}

	function crypto_hash(out, m, n) {
	  var hh = new Int32Array(8),
	      hl = new Int32Array(8),
	      x = new Uint8Array(256),
	      i, b = n;

	  hh[0] = 0x6a09e667;
	  hh[1] = 0xbb67ae85;
	  hh[2] = 0x3c6ef372;
	  hh[3] = 0xa54ff53a;
	  hh[4] = 0x510e527f;
	  hh[5] = 0x9b05688c;
	  hh[6] = 0x1f83d9ab;
	  hh[7] = 0x5be0cd19;

	  hl[0] = 0xf3bcc908;
	  hl[1] = 0x84caa73b;
	  hl[2] = 0xfe94f82b;
	  hl[3] = 0x5f1d36f1;
	  hl[4] = 0xade682d1;
	  hl[5] = 0x2b3e6c1f;
	  hl[6] = 0xfb41bd6b;
	  hl[7] = 0x137e2179;

	  crypto_hashblocks_hl(hh, hl, m, n);
	  n %= 128;

	  for (i = 0; i < n; i++) x[i] = m[b-n+i];
	  x[n] = 128;

	  n = 256-128*(n<112?1:0);
	  x[n-9] = 0;
	  ts64(x, n-8,  (b / 0x20000000) | 0, b << 3);
	  crypto_hashblocks_hl(hh, hl, x, n);

	  for (i = 0; i < 8; i++) ts64(out, 8*i, hh[i], hl[i]);

	  return 0;
	}

	function add(p, q) {
	  var a = gf(), b = gf(), c = gf(),
	      d = gf(), e = gf(), f = gf(),
	      g = gf(), h = gf(), t = gf();

	  Z(a, p[1], p[0]);
	  Z(t, q[1], q[0]);
	  M(a, a, t);
	  A(b, p[0], p[1]);
	  A(t, q[0], q[1]);
	  M(b, b, t);
	  M(c, p[3], q[3]);
	  M(c, c, D2);
	  M(d, p[2], q[2]);
	  A(d, d, d);
	  Z(e, b, a);
	  Z(f, d, c);
	  A(g, d, c);
	  A(h, b, a);

	  M(p[0], e, f);
	  M(p[1], h, g);
	  M(p[2], g, f);
	  M(p[3], e, h);
	}

	function cswap(p, q, b) {
	  var i;
	  for (i = 0; i < 4; i++) {
	    sel25519(p[i], q[i], b);
	  }
	}

	function pack(r, p) {
	  var tx = gf(), ty = gf(), zi = gf();
	  inv25519(zi, p[2]);
	  M(tx, p[0], zi);
	  M(ty, p[1], zi);
	  pack25519(r, ty);
	  r[31] ^= par25519(tx) << 7;
	}

	function scalarmult(p, q, s) {
	  var b, i;
	  set25519(p[0], gf0);
	  set25519(p[1], gf1);
	  set25519(p[2], gf1);
	  set25519(p[3], gf0);
	  for (i = 255; i >= 0; --i) {
	    b = (s[(i/8)|0] >> (i&7)) & 1;
	    cswap(p, q, b);
	    add(q, p);
	    add(p, p);
	    cswap(p, q, b);
	  }
	}

	function scalarbase(p, s) {
	  var q = [gf(), gf(), gf(), gf()];
	  set25519(q[0], X);
	  set25519(q[1], Y);
	  set25519(q[2], gf1);
	  M(q[3], X, Y);
	  scalarmult(p, q, s);
	}

	function crypto_sign_keypair(pk, sk, seeded) {
	  var d = new Uint8Array(64);
	  var p = [gf(), gf(), gf(), gf()];
	  var i;

	  if (!seeded) randombytes(sk, 32);
	  crypto_hash(d, sk, 32);
	  d[0] &= 248;
	  d[31] &= 127;
	  d[31] |= 64;

	  scalarbase(p, d);
	  pack(pk, p);

	  for (i = 0; i < 32; i++) sk[i+32] = pk[i];
	  return 0;
	}

	var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);

	function modL(r, x) {
	  var carry, i, j, k;
	  for (i = 63; i >= 32; --i) {
	    carry = 0;
	    for (j = i - 32, k = i - 12; j < k; ++j) {
	      x[j] += carry - 16 * x[i] * L[j - (i - 32)];
	      carry = (x[j] + 128) >> 8;
	      x[j] -= carry * 256;
	    }
	    x[j] += carry;
	    x[i] = 0;
	  }
	  carry = 0;
	  for (j = 0; j < 32; j++) {
	    x[j] += carry - (x[31] >> 4) * L[j];
	    carry = x[j] >> 8;
	    x[j] &= 255;
	  }
	  for (j = 0; j < 32; j++) x[j] -= carry * L[j];
	  for (i = 0; i < 32; i++) {
	    x[i+1] += x[i] >> 8;
	    r[i] = x[i] & 255;
	  }
	}

	function reduce(r) {
	  var x = new Float64Array(64), i;
	  for (i = 0; i < 64; i++) x[i] = r[i];
	  for (i = 0; i < 64; i++) r[i] = 0;
	  modL(r, x);
	}

	// Note: difference from C - smlen returned, not passed as argument.
	function crypto_sign(sm, m, n, sk) {
	  var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
	  var i, j, x = new Float64Array(64);
	  var p = [gf(), gf(), gf(), gf()];

	  crypto_hash(d, sk, 32);
	  d[0] &= 248;
	  d[31] &= 127;
	  d[31] |= 64;

	  var smlen = n + 64;
	  for (i = 0; i < n; i++) sm[64 + i] = m[i];
	  for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];

	  crypto_hash(r, sm.subarray(32), n+32);
	  reduce(r);
	  scalarbase(p, r);
	  pack(sm, p);

	  for (i = 32; i < 64; i++) sm[i] = sk[i];
	  crypto_hash(h, sm, n + 64);
	  reduce(h);

	  for (i = 0; i < 64; i++) x[i] = 0;
	  for (i = 0; i < 32; i++) x[i] = r[i];
	  for (i = 0; i < 32; i++) {
	    for (j = 0; j < 32; j++) {
	      x[i+j] += h[i] * d[j];
	    }
	  }

	  modL(sm.subarray(32), x);
	  return smlen;
	}

	function unpackneg(r, p) {
	  var t = gf(), chk = gf(), num = gf(),
	      den = gf(), den2 = gf(), den4 = gf(),
	      den6 = gf();

	  set25519(r[2], gf1);
	  unpack25519(r[1], p);
	  S(num, r[1]);
	  M(den, num, D);
	  Z(num, num, r[2]);
	  A(den, r[2], den);

	  S(den2, den);
	  S(den4, den2);
	  M(den6, den4, den2);
	  M(t, den6, num);
	  M(t, t, den);

	  pow2523(t, t);
	  M(t, t, num);
	  M(t, t, den);
	  M(t, t, den);
	  M(r[0], t, den);

	  S(chk, r[0]);
	  M(chk, chk, den);
	  if (neq25519(chk, num)) M(r[0], r[0], I);

	  S(chk, r[0]);
	  M(chk, chk, den);
	  if (neq25519(chk, num)) return -1;

	  if (par25519(r[0]) === (p[31]>>7)) Z(r[0], gf0, r[0]);

	  M(r[3], r[0], r[1]);
	  return 0;
	}

	function crypto_sign_open(m, sm, n, pk) {
	  var i, mlen;
	  var t = new Uint8Array(32), h = new Uint8Array(64);
	  var p = [gf(), gf(), gf(), gf()],
	      q = [gf(), gf(), gf(), gf()];

	  mlen = -1;
	  if (n < 64) return -1;

	  if (unpackneg(q, pk)) return -1;

	  for (i = 0; i < n; i++) m[i] = sm[i];
	  for (i = 0; i < 32; i++) m[i+32] = pk[i];
	  crypto_hash(h, m, n);
	  reduce(h);
	  scalarmult(p, q, h);

	  scalarbase(q, sm.subarray(32));
	  add(p, q);
	  pack(t, p);

	  n -= 64;
	  if (crypto_verify_32(sm, 0, t, 0)) {
	    for (i = 0; i < n; i++) m[i] = 0;
	    return -1;
	  }

	  for (i = 0; i < n; i++) m[i] = sm[i + 64];
	  mlen = n;
	  return mlen;
	}

	var crypto_secretbox_KEYBYTES = 32,
	    crypto_secretbox_NONCEBYTES = 24,
	    crypto_secretbox_ZEROBYTES = 32,
	    crypto_secretbox_BOXZEROBYTES = 16,
	    crypto_scalarmult_BYTES = 32,
	    crypto_scalarmult_SCALARBYTES = 32,
	    crypto_box_PUBLICKEYBYTES = 32,
	    crypto_box_SECRETKEYBYTES = 32,
	    crypto_box_BEFORENMBYTES = 32,
	    crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES,
	    crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES,
	    crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES,
	    crypto_sign_BYTES = 64,
	    crypto_sign_PUBLICKEYBYTES = 32,
	    crypto_sign_SECRETKEYBYTES = 64,
	    crypto_sign_SEEDBYTES = 32,
	    crypto_hash_BYTES = 64;

	nacl.lowlevel = {
	  crypto_core_hsalsa20: crypto_core_hsalsa20,
	  crypto_stream_xor: crypto_stream_xor,
	  crypto_stream: crypto_stream,
	  crypto_stream_salsa20_xor: crypto_stream_salsa20_xor,
	  crypto_stream_salsa20: crypto_stream_salsa20,
	  crypto_onetimeauth: crypto_onetimeauth,
	  crypto_onetimeauth_verify: crypto_onetimeauth_verify,
	  crypto_verify_16: crypto_verify_16,
	  crypto_verify_32: crypto_verify_32,
	  crypto_secretbox: crypto_secretbox,
	  crypto_secretbox_open: crypto_secretbox_open,
	  crypto_scalarmult: crypto_scalarmult,
	  crypto_scalarmult_base: crypto_scalarmult_base,
	  crypto_box_beforenm: crypto_box_beforenm,
	  crypto_box_afternm: crypto_box_afternm,
	  crypto_box: crypto_box,
	  crypto_box_open: crypto_box_open,
	  crypto_box_keypair: crypto_box_keypair,
	  crypto_hash: crypto_hash,
	  crypto_sign: crypto_sign,
	  crypto_sign_keypair: crypto_sign_keypair,
	  crypto_sign_open: crypto_sign_open,

	  crypto_secretbox_KEYBYTES: crypto_secretbox_KEYBYTES,
	  crypto_secretbox_NONCEBYTES: crypto_secretbox_NONCEBYTES,
	  crypto_secretbox_ZEROBYTES: crypto_secretbox_ZEROBYTES,
	  crypto_secretbox_BOXZEROBYTES: crypto_secretbox_BOXZEROBYTES,
	  crypto_scalarmult_BYTES: crypto_scalarmult_BYTES,
	  crypto_scalarmult_SCALARBYTES: crypto_scalarmult_SCALARBYTES,
	  crypto_box_PUBLICKEYBYTES: crypto_box_PUBLICKEYBYTES,
	  crypto_box_SECRETKEYBYTES: crypto_box_SECRETKEYBYTES,
	  crypto_box_BEFORENMBYTES: crypto_box_BEFORENMBYTES,
	  crypto_box_NONCEBYTES: crypto_box_NONCEBYTES,
	  crypto_box_ZEROBYTES: crypto_box_ZEROBYTES,
	  crypto_box_BOXZEROBYTES: crypto_box_BOXZEROBYTES,
	  crypto_sign_BYTES: crypto_sign_BYTES,
	  crypto_sign_PUBLICKEYBYTES: crypto_sign_PUBLICKEYBYTES,
	  crypto_sign_SECRETKEYBYTES: crypto_sign_SECRETKEYBYTES,
	  crypto_sign_SEEDBYTES: crypto_sign_SEEDBYTES,
	  crypto_hash_BYTES: crypto_hash_BYTES
	};

	/* High-level API */

	function checkLengths(k, n) {
	  if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
	  if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
	}

	function checkBoxLengths(pk, sk) {
	  if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
	  if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
	}

	function checkArrayTypes() {
	  var t, i;
	  for (i = 0; i < arguments.length; i++) {
	     if ((t = Object.prototype.toString.call(arguments[i])) !== '[object Uint8Array]')
	       throw new TypeError('unexpected type ' + t + ', use Uint8Array');
	  }
	}

	function cleanup(arr) {
	  for (var i = 0; i < arr.length; i++) arr[i] = 0;
	}

	// TODO: Completely remove this in v0.15.
	if (!nacl.util) {
	  nacl.util = {};
	  nacl.util.decodeUTF8 = nacl.util.encodeUTF8 = nacl.util.encodeBase64 = nacl.util.decodeBase64 = function() {
	    throw new Error('nacl.util moved into separate package: https://github.com/dchest/tweetnacl-util-js');
	  };
	}

	nacl.randomBytes = function(n) {
	  var b = new Uint8Array(n);
	  randombytes(b, n);
	  return b;
	};

	nacl.secretbox = function(msg, nonce, key) {
	  checkArrayTypes(msg, nonce, key);
	  checkLengths(key, nonce);
	  var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
	  var c = new Uint8Array(m.length);
	  for (var i = 0; i < msg.length; i++) m[i+crypto_secretbox_ZEROBYTES] = msg[i];
	  crypto_secretbox(c, m, m.length, nonce, key);
	  return c.subarray(crypto_secretbox_BOXZEROBYTES);
	};

	nacl.secretbox.open = function(box, nonce, key) {
	  checkArrayTypes(box, nonce, key);
	  checkLengths(key, nonce);
	  var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
	  var m = new Uint8Array(c.length);
	  for (var i = 0; i < box.length; i++) c[i+crypto_secretbox_BOXZEROBYTES] = box[i];
	  if (c.length < 32) return false;
	  if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return false;
	  return m.subarray(crypto_secretbox_ZEROBYTES);
	};

	nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
	nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
	nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;

	nacl.scalarMult = function(n, p) {
	  checkArrayTypes(n, p);
	  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
	  if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
	  var q = new Uint8Array(crypto_scalarmult_BYTES);
	  crypto_scalarmult(q, n, p);
	  return q;
	};

	nacl.scalarMult.base = function(n) {
	  checkArrayTypes(n);
	  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
	  var q = new Uint8Array(crypto_scalarmult_BYTES);
	  crypto_scalarmult_base(q, n);
	  return q;
	};

	nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
	nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;

	nacl.box = function(msg, nonce, publicKey, secretKey) {
	  var k = nacl.box.before(publicKey, secretKey);
	  return nacl.secretbox(msg, nonce, k);
	};

	nacl.box.before = function(publicKey, secretKey) {
	  checkArrayTypes(publicKey, secretKey);
	  checkBoxLengths(publicKey, secretKey);
	  var k = new Uint8Array(crypto_box_BEFORENMBYTES);
	  crypto_box_beforenm(k, publicKey, secretKey);
	  return k;
	};

	nacl.box.after = nacl.secretbox;

	nacl.box.open = function(msg, nonce, publicKey, secretKey) {
	  var k = nacl.box.before(publicKey, secretKey);
	  return nacl.secretbox.open(msg, nonce, k);
	};

	nacl.box.open.after = nacl.secretbox.open;

	nacl.box.keyPair = function() {
	  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
	  var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
	  crypto_box_keypair(pk, sk);
	  return {publicKey: pk, secretKey: sk};
	};

	nacl.box.keyPair.fromSecretKey = function(secretKey) {
	  checkArrayTypes(secretKey);
	  if (secretKey.length !== crypto_box_SECRETKEYBYTES)
	    throw new Error('bad secret key size');
	  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
	  crypto_scalarmult_base(pk, secretKey);
	  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
	};

	nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
	nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
	nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
	nacl.box.nonceLength = crypto_box_NONCEBYTES;
	nacl.box.overheadLength = nacl.secretbox.overheadLength;

	nacl.sign = function(msg, secretKey) {
	  checkArrayTypes(msg, secretKey);
	  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
	    throw new Error('bad secret key size');
	  var signedMsg = new Uint8Array(crypto_sign_BYTES+msg.length);
	  crypto_sign(signedMsg, msg, msg.length, secretKey);
	  return signedMsg;
	};

	nacl.sign.open = function(signedMsg, publicKey) {
	  if (arguments.length !== 2)
	    throw new Error('nacl.sign.open accepts 2 arguments; did you mean to use nacl.sign.detached.verify?');
	  checkArrayTypes(signedMsg, publicKey);
	  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
	    throw new Error('bad public key size');
	  var tmp = new Uint8Array(signedMsg.length);
	  var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
	  if (mlen < 0) return null;
	  var m = new Uint8Array(mlen);
	  for (var i = 0; i < m.length; i++) m[i] = tmp[i];
	  return m;
	};

	nacl.sign.detached = function(msg, secretKey) {
	  var signedMsg = nacl.sign(msg, secretKey);
	  var sig = new Uint8Array(crypto_sign_BYTES);
	  for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
	  return sig;
	};

	nacl.sign.detached.verify = function(msg, sig, publicKey) {
	  checkArrayTypes(msg, sig, publicKey);
	  if (sig.length !== crypto_sign_BYTES)
	    throw new Error('bad signature size');
	  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
	    throw new Error('bad public key size');
	  var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
	  var m = new Uint8Array(crypto_sign_BYTES + msg.length);
	  var i;
	  for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
	  for (i = 0; i < msg.length; i++) sm[i+crypto_sign_BYTES] = msg[i];
	  return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
	};

	nacl.sign.keyPair = function() {
	  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
	  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
	  crypto_sign_keypair(pk, sk);
	  return {publicKey: pk, secretKey: sk};
	};

	nacl.sign.keyPair.fromSecretKey = function(secretKey) {
	  checkArrayTypes(secretKey);
	  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
	    throw new Error('bad secret key size');
	  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
	  for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32+i];
	  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
	};

	nacl.sign.keyPair.fromSeed = function(seed) {
	  checkArrayTypes(seed);
	  if (seed.length !== crypto_sign_SEEDBYTES)
	    throw new Error('bad seed size');
	  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
	  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
	  for (var i = 0; i < 32; i++) sk[i] = seed[i];
	  crypto_sign_keypair(pk, sk, true);
	  return {publicKey: pk, secretKey: sk};
	};

	nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
	nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
	nacl.sign.seedLength = crypto_sign_SEEDBYTES;
	nacl.sign.signatureLength = crypto_sign_BYTES;

	nacl.hash = function(msg) {
	  checkArrayTypes(msg);
	  var h = new Uint8Array(crypto_hash_BYTES);
	  crypto_hash(h, msg, msg.length);
	  return h;
	};

	nacl.hash.hashLength = crypto_hash_BYTES;

	nacl.verify = function(x, y) {
	  checkArrayTypes(x, y);
	  // Zero length arguments are considered not equal.
	  if (x.length === 0 || y.length === 0) return false;
	  if (x.length !== y.length) return false;
	  return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
	};

	nacl.setPRNG = function(fn) {
	  randombytes = fn;
	};

	(function() {
	  // Initialize PRNG if environment provides CSPRNG.
	  // If not, methods calling randombytes will throw.
	  var crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
	  if (crypto && crypto.getRandomValues) {
	    // Browsers.
	    var QUOTA = 65536;
	    nacl.setPRNG(function(x, n) {
	      var i, v = new Uint8Array(n);
	      for (i = 0; i < n; i += QUOTA) {
	        crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
	      }
	      for (i = 0; i < n; i++) x[i] = v[i];
	      cleanup(v);
	    });
	  } else if (true) {
	    // Node.js.
	    crypto = __webpack_require__(14);
	    if (crypto && crypto.randomBytes) {
	      nacl.setPRNG(function(x, n) {
	        var i, v = crypto.randomBytes(n);
	        for (i = 0; i < n; i++) x[i] = v[i];
	        cleanup(v);
	      });
	    }
	  }
	})();

	})(typeof module !== 'undefined' && module.exports ? module.exports : (self.nacl = self.nacl || {}));


/***/ },
/* 14 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 15 */
/***/ function(module, exports) {

	// The storage object only needs to contain "save", "clear", and "get"
	module.exports = {
	  localStorage: {
	    set: function(string) {
	      localStorage.setItem('auth', string);
	    },
	    get: function() {
	      return localStorage.getItem('auth');
	    },
	    clear: function() {
	      localStorage.removeItem('auth');
	    }
	  }
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var nacl = __webpack_require__(13),
	    base64 = __webpack_require__(12);

	var utils = __webpack_require__(11);

	module.exports = {
	  /**
	   * Call this method in order to authenticate with SAFE, using either previous authentication
	   * or new.
	   * @returns {Promise}
	   */
	  authenticate: function () {
	    // Get stored auth data.
	    var stored = this.storage.get();

	    // If nothing stored, proceed with new authorization
	    if (!stored) {
	      this.log('No auth data stored, starting authorization from scratch...');
	      return this.auth.authorize();
	    }

	    // Otherwise, set the auth data on the Request object so that it can be used for requests
	    this.log('Auth data stored, checking validity...');
	    this._auth = utils.unserialize(stored);

	    // Use the saved auth data to check if we're already authorized. If not, it will clear the stored
	    // data, then proceed with new authorization.
	    return this.auth.isAuth()
	      .then(function(result) {
	        if (result === false)
	          return this.auth.authorize();
	      }.bind(this));
	  },

	  /**
	   * Requests authorization from the safe launcher.
	   * @returns {*}
	   */
	  authorize: function () {
	    this.log('Authorizing...');
	    // Generate new asymmetric key pair and nonce, e.g. public-key encryption
	    var asymKeys  = nacl.box.keyPair(),
	        asymNonce = nacl.randomBytes(nacl.box.nonceLength);

	    // The payload for the request
	    var authPayload = {
	      app: this.app,
	      publicKey: base64.fromByteArray(asymKeys.publicKey),
	      nonce: base64.fromByteArray(asymNonce),
	      permissions: this.permissions
	    };

	    // Proceed with request
	    return this.Request
	      .post('/auth')
	      .body(authPayload)
	      .execute()
	      .then(function (json) {
	        // We received the launcher's private key + encrypted symmetrical keys (i.e. private key encryption)
	        var launcherPubKey = base64.toByteArray(json.publicKey);
	        var messageWithSymKeys = base64.toByteArray(json.encryptedKey);

	        // Decrypt the private key/nonce
	        var key = nacl.box.open(messageWithSymKeys, asymNonce, launcherPubKey, asymKeys.secretKey);

	        // Save auth data for future requests
	        this._auth = {
	          token: json.token,
	          symKey: key.slice(0, nacl.secretbox.keyLength),
	          symNonce: key.slice(nacl.secretbox.keyLength)
	        };

	        // Set the auth data for future requests
	        this.storage.set(utils.serialize(this._auth));
	        this.log('Authorized');
	      }.bind(this), function(res) {
	        this.log('Could not authorize.');
	        this.storage.clear();
	      }.bind(this));
	  },

	  /**
	   * Checks if we're authenticated on the SAFE network
	   * @returns {*}
	   */
	  isAuth: function () {
	    this.log('Checking if authorized...');
	    return this.Request.get('/auth').auth().execute()
	      // let's use our own function here, that resolve true or false,
	      // rather than throwing an error if invalid token
	      .then(function () {
	        this.log('Authorized');
	        return true;
	      }.bind(this), function (response) {
	        this.log('Not authorized, or received error.', response);
	        if (response.status === 401) {
	          // Remove any auth from storage and Request class
	          this.log('Not authorized, removing any stored auth data.');
	          clearAuthData.call(this);

	          // Return false
	          return false;
	        } else {
	          // Any other status is another error, throw the response
	          throw response;
	        }
	      }.bind(this));
	  },

	  /**
	   * Deauthorizes you from the launcher, and removed saved auth data from storage.
	   * @returns {*}
	   */
	  deauthorize: function () {
	    this.log('Deauthorizing...');
	    return this.Request.delete('/auth').auth().execute()
	      .then(function (response) {
	        // Clear auth data from storage upon deauthorization
	        this.storage.clear();
	        clearAuthData.call(this);

	        this.log('Deauthorized and cleared from storage.');

	        return response;
	      }.bind(this));
	  }
	}

	function clearAuthData() {
	  this._auth = {
	    token: null,
	    symKey: null,
	    symNonce: null
	  };
	}

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = {
	  listNames: function() {
	    return this.Request.get('/dns').auth().execute();
	  },

	  createName: function(name) {
	    return this.Request.post('/dns/' + encodeURIComponent(name)).auth().execute();
	  },

	  deleteName: function(name) {
	    return this.Request.delete('/dns/' + encodeURIComponent(name)).auth().execute();
	  },

	  listServices: function(name) {
	    return this.Request.get('/dns/'+encodeURIComponent(name)).auth().execute();
	  },

	  createServiceAndName: function(payload) {
	    return this.Request.post('/dns').auth().body(payload).execute();
	  },

	  createServiceForName: function(payload) {
	    return this.Request.put('/dns').auth().body(payload).execute();
	  },

	  getServiceDir: function(serviceName, name) {
	    // Surprise! You can't authenticate this request.
	    return this.Request.get('/dns/'+encodeURIComponent(serviceName)+'/'+encodeURIComponent(name)).execute();
	  },

	  getFile: function(serviceName, name, filePath, options) {
	    var query = {};
	    if (options.offset) query.offset = options.offset;
	    if (options.length) query.length = options.length;

	    return this.Request
	      .get('/dns/'+encodeURIComponent(serviceName)+'/'+encodeURIComponent(name)+'/'+encodeURIComponent(filePath))
	      .query(query)
	      .returnMeta()
	      .execute();
	  },

	  deleteService: function(serviceName, name) {
	    return this.Request.delete('/dns/'+encodeURIComponent(serviceName)+'/'+encodeURIComponent(name)).auth().execute();
	  }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var toUTF8 = __webpack_require__(11).decodeUTF8;

	module.exports = {
	  createDirectory: function(dir, options) {
	    // Metadata needs to be base64 encoded
	    if (options && options.metadata) options.metadata = btoa(options.metadata);

	    var payload = Object.assign({}, {dirPath: dir}, options);
	    return this.Request.post('/nfs/directory').auth().body(payload).execute();
	  },

	  getDirectory: function(dir, options) {
	    return this.Request
	      .get('/nfs/directory/'+encodeURIComponent(dir)+'/'+pathSharedString(options.isPathShared))
	      .auth()
	      .execute()
	      .then(function(dir) {
	        // Metadata needs to be base64 decoded
	        if (dir.info.metadata) dir.info.metadata = atob(dir.info.metadata);

	        return dir;
	      });
	  },

	  deleteDirectory: function(dir, options) {
	    return this.Request.delete('/nfs/directory/'+encodeURIComponent(dir)+'/'+pathSharedString(options.isPathShared)).auth().execute();
	  },

	  createFile: function(file, options) {
	    // Metadata needs to be base64 encoded
	    if (options && options.metadata) options.metadata = btoa(options.metadata);

	    var payload = Object.assign({}, {filePath: file}, options);
	    return this.Request.post('/nfs/file').auth().body(payload).execute();
	  },

	  updateFile: function(file, content, options) {
	    // If content is a TypedArray, then convert it to a string first.
	    if (ArrayBuffer.isView(content)) content = toUTF8(content);

	    var query = {};
	    if (options.offset) query.offset = options.offset;

	    return this.Request.put('/nfs/file/'+encodeURIComponent(file)+'/'+pathSharedString(options.isPathShared))
	      .auth().body(content).query(query).execute();
	  },

	  getFile: function(file, options) {
	    var query = {};
	    if (options.offset) query.offset = options.offset;
	    if (options.length) query.length = options.length;
	    return this.Request
	      .get('/nfs/file/'+encodeURIComponent(file)+'/'+pathSharedString(options.isPathShared))
	      .query(query)
	      .auth()
	      .returnMeta()
	      .execute();
	  },

	  deleteFile: function(file, options) {
	    return this.Request.delete('/nfs/file/'+encodeURIComponent(file)+'/'+pathSharedString(options.isPathShared)).auth().execute();
	  }

	};

	/**
	 * Returns a string "true" or "false"
	 *
	 * @param isPathShared
	 * @returns {string}
	 */
	function pathSharedString(isPathShared) {
	  if (typeof isPathShared === 'string') {
	    return isPathShared === 'true' ? 'true' : 'false';
	  } else {
	    return isPathShared ? 'true' : 'false';
	  }
	}

/***/ }
/******/ ]);