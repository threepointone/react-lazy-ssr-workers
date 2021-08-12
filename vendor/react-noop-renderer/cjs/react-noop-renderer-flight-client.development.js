/** @license React vundefined
 * react-noop-renderer-flight-client.development.js
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

var flightModules = require('react-noop-renderer/flight-modules');
var ReactFlightClient = require('react-client/flight');

/**
 * This is a renderer of React that doesn't have a render target output.
 * It is useful to demonstrate the internals of the reconciler in isolation
 * and for testing semantics of reconciliation separate from the host
 * environment.
 */

var _ReactFlightClient = ReactFlightClient({
  supportsBinaryStreams: false,
  resolveModuleReference: function (idx) {
    return idx;
  },
  preloadModule: function (idx) {},
  requireModule: function (idx) {
    return flightModules.readModule(idx);
  },
  parseModel: function (response, json) {
    return JSON.parse(json, response._fromJSON);
  }
}),
    createResponse = _ReactFlightClient.createResponse,
    processStringChunk = _ReactFlightClient.processStringChunk,
    close = _ReactFlightClient.close;

function read(source) {
  var response = createResponse(source);

  for (var i = 0; i < source.length; i++) {
    processStringChunk(response, source[i], 0);
  }

  close(response);
  return response.readRoot();
}

exports.read = read;
  })();
}
