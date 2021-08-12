/** @license React vundefined
 * create-subscription.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

if (process.env.NODE_ENV !== "production") {
  (function() {
'use strict';

var React = require('react');

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

function error(format) {
  {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    printWarning('error', format, args);
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();

    if (stack !== '') {
      format += '%s';
      args = args.concat([stack]);
    }

    var argsWithFormat = args.map(function (item) {
      return '' + item;
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);
  }
}

function createSubscription(config) {
  var getCurrentValue = config.getCurrentValue,
      _subscribe = config.subscribe;

  {
    if (typeof getCurrentValue !== 'function') {
      error('Subscription must specify a getCurrentValue function');
    }

    if (typeof _subscribe !== 'function') {
      error('Subscription must specify a subscribe function');
    }
  }

  // Reference: https://gist.github.com/bvaughn/d569177d70b50b58bff69c3c4a5353f3
  var Subscription = /*#__PURE__*/function (_React$Component) {
    _inheritsLoose(Subscription, _React$Component);

    function Subscription() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
      _this.state = {
        source: _this.props.source,
        value: _this.props.source != null ? getCurrentValue(_this.props.source) : undefined
      };
      _this._hasUnmounted = false;
      _this._unsubscribe = null;
      return _this;
    }

    Subscription.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.source !== prevState.source) {
        return {
          source: nextProps.source,
          value: nextProps.source != null ? getCurrentValue(nextProps.source) : undefined
        };
      }

      return null;
    };

    var _proto = Subscription.prototype;

    _proto.componentDidMount = function componentDidMount() {
      this.subscribe();
    };

    _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
      if (this.state.source !== prevState.source) {
        this.unsubscribe();
        this.subscribe();
      }
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      this.unsubscribe(); // Track mounted to avoid calling setState after unmounting
      // For source like Promises that can't be unsubscribed from.

      this._hasUnmounted = true;
    };

    _proto.render = function render() {
      return this.props.children(this.state.value);
    };

    _proto.subscribe = function subscribe() {
      var _this2 = this;

      var source = this.state.source;

      if (source != null) {
        var _callback = function (value) {
          if (_this2._hasUnmounted) {
            return;
          }

          _this2.setState(function (state) {
            // If the value is the same, skip the unnecessary state update.
            if (value === state.value) {
              return null;
            } // If this event belongs to an old or uncommitted data source, ignore it.


            if (source !== state.source) {
              return null;
            }

            return {
              value: value
            };
          });
        }; // Store the unsubscribe method for later (in case the subscribable prop changes).


        var unsubscribe = _subscribe(source, _callback);

        if (!(typeof unsubscribe === 'function')) {
          {
            throw Error( "A subscription must return an unsubscribe function." );
          }
        } // It's safe to store unsubscribe on the instance because
        // We only read or write that property during the "commit" phase.


        this._unsubscribe = unsubscribe; // External values could change between render and mount,
        // In some cases it may be important to handle this case.

        var _value = getCurrentValue(this.props.source);

        if (_value !== this.state.value) {
          this.setState({
            value: _value
          });
        }
      }
    };

    _proto.unsubscribe = function unsubscribe() {
      if (typeof this._unsubscribe === 'function') {
        this._unsubscribe();
      }

      this._unsubscribe = null;
    };

    return Subscription;
  }(React.Component);

  return Subscription;
}

exports.createSubscription = createSubscription;
  })();
}
