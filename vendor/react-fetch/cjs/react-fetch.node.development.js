/** @license React vundefined
 * react-fetch.node.development.js
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

var http = require('http');
var https = require('https');
var react = require('react');

function nodeFetch(url, options, onResolve, onReject) {
  var _URL = new URL(url),
      hostname = _URL.hostname,
      pathname = _URL.pathname,
      search = _URL.search,
      port = _URL.port,
      protocol = _URL.protocol;

  var nodeOptions = {
    hostname: hostname,
    port: port,
    path: pathname + search // TODO: cherry-pick supported user-passed options.

  };
  var nodeImpl = protocol === 'https:' ? https : http;
  var request = nodeImpl.request(nodeOptions, function (response) {
    // TODO: support redirects.
    onResolve(new Response(response));
  });
  request.on('error', function (error) {
    onReject(error);
  });
  request.end();
}

var Pending = 0;
var Resolved = 1;
var Rejected = 2;

function getRecordMap() {
  return react.unstable_getCacheForType(createRecordMap);
}

function createRecordMap() {
  return new Map();
}

function readRecordValue(record) {
  if (record.status === Resolved) {
    return record.value;
  } else {
    throw record.value;
  }
}

function Response(nativeResponse) {
  this.headers = nativeResponse.headers;
  this.ok = nativeResponse.statusCode >= 200 && nativeResponse.statusCode < 300;
  this.redirected = false; // TODO

  this.status = nativeResponse.statusCode;
  this.statusText = nativeResponse.statusMessage;
  this.type = 'basic';
  this.url = nativeResponse.url;
  this._response = nativeResponse;
  this._json = null;
  this._text = null;
  var callbacks = [];

  function wake() {
    // This assumes they won't throw.
    while (callbacks.length > 0) {
      var cb = callbacks.pop();
      cb();
    }
  }

  var bufferRecord = this._bufferRecord = {
    status: Pending,
    value: {
      then: function (cb) {
        callbacks.push(cb);
      }
    }
  };
  var data = [];
  nativeResponse.on('data', function (chunk) {
    return data.push(chunk);
  });
  nativeResponse.on('end', function () {
    if (bufferRecord.status === Pending) {
      var resolvedRecord = bufferRecord;
      resolvedRecord.status = Resolved;
      resolvedRecord.value = Buffer.concat(data);
      wake();
    }
  });
  nativeResponse.on('error', function (err) {
    if (bufferRecord.status === Pending) {
      var rejectedRecord = bufferRecord;
      rejectedRecord.status = Rejected;
      rejectedRecord.value = err;
      wake();
    }
  });
}

Response.prototype = {
  constructor: Response,
  arrayBuffer: function () {
    var buffer = readRecordValue(this._bufferRecord);
    return buffer;
  },
  blob: function () {
    // TODO: Is this needed?
    throw new Error('Not implemented.');
  },
  json: function () {
    if (this._json !== null) {
      return this._json;
    }

    var buffer = readRecordValue(this._bufferRecord);
    var json = JSON.parse(buffer.toString());
    this._json = json;
    return json;
  },
  text: function () {
    if (this._text !== null) {
      return this._text;
    }

    var buffer = readRecordValue(this._bufferRecord);
    var text = buffer.toString();
    this._text = text;
    return text;
  }
};

function preloadRecord(url, options) {
  var map = getRecordMap();
  var record = map.get(url);

  if (!record) {
    if (options) {
      if (options.method || options.body || options.signal) {
        // TODO: wire up our own cancellation mechanism.
        // TODO: figure out what to do with POST.
        throw Error('Unsupported option');
      }
    }

    var callbacks = [];
    var wakeable = {
      then: function (cb) {
        callbacks.push(cb);
      }
    };

    var wake = function () {
      // This assumes they won't throw.
      while (callbacks.length > 0) {
        var cb = callbacks.pop();
        cb();
      }
    };

    var newRecord = record = {
      status: Pending,
      value: wakeable
    };
    nodeFetch(url, options, function (response) {
      if (newRecord.status === Pending) {
        var resolvedRecord = newRecord;
        resolvedRecord.status = Resolved;
        resolvedRecord.value = response;
        wake();
      }
    }, function (err) {
      if (newRecord.status === Pending) {
        var rejectedRecord = newRecord;
        rejectedRecord.status = Rejected;
        rejectedRecord.value = err;
        wake();
      }
    });
    map.set(url, record);
  }

  return record;
}

function preload(url, options) {
  preloadRecord(url, options); // Don't return anything.
}
function fetch(url, options) {
  var record = preloadRecord(url, options);
  var response = readRecordValue(record);
  return response;
}

exports.fetch = fetch;
exports.preload = preload;
  })();
}
