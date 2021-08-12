/** @license React vundefined
 * react-suspense-test-utils.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

'use strict';

var React = require('react');

var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */
function invariant(condition, format, a, b, c, d, e, f) {
  throw new Error('Internal React error: invariant() is meant to be replaced at compile ' + 'time. There is no runtime version.');
}

var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;

function unsupported() {
  invariant();
}

function waitForSuspense(fn) {
  var cache = new Map();
  var testDispatcher = {
    getCacheForType: function (resourceType) {
      var entry = cache.get(resourceType);

      if (entry === undefined) {
        entry = resourceType(); // TODO: Warn if undefined?

        cache.set(resourceType, entry);
      }

      return entry;
    },
    readContext: unsupported,
    useContext: unsupported,
    useMemo: unsupported,
    useReducer: unsupported,
    useRef: unsupported,
    useState: unsupported,
    useLayoutEffect: unsupported,
    useCallback: unsupported,
    useImperativeHandle: unsupported,
    useEffect: unsupported,
    useDebugValue: unsupported,
    useDeferredValue: unsupported,
    useTransition: unsupported,
    useOpaqueIdentifier: unsupported,
    useMutableSource: unsupported,
    useCacheRefresh: unsupported
  }; // Not using async/await because we don't compile it.

  return new Promise(function (resolve, reject) {
    function retry() {
      var prevDispatcher = ReactCurrentDispatcher.current;
      ReactCurrentDispatcher.current = testDispatcher;

      try {
        var result = fn();
        resolve(result);
      } catch (thrownValue) {
        if (typeof thrownValue.then === 'function') {
          thrownValue.then(retry, retry);
        } else {
          reject(thrownValue);
        }
      } finally {
        ReactCurrentDispatcher.current = prevDispatcher;
      }
    }

    retry();
  });
}

exports.waitForSuspense = waitForSuspense;
