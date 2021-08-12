/** @license React vundefined
 * react-fetch.browser.development.js
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

var react = require('react');

var Pending = 0;
var Resolved = 1;
var Rejected = 2;
// TODO: this is a browser-only version. Add a separate Node entry point.
var nativeFetch = window.fetch;

function getRecordMap() {
  return react.unstable_getCacheForType(createRecordMap);
}

function createRecordMap() {
  return new Map();
}

function createRecordFromThenable(thenable) {
  var record = {
    status: Pending,
    value: thenable
  };
  thenable.then(function (value) {
    if (record.status === Pending) {
      var resolvedRecord = record;
      resolvedRecord.status = Resolved;
      resolvedRecord.value = value;
    }
  }, function (err) {
    if (record.status === Pending) {
      var rejectedRecord = record;
      rejectedRecord.status = Rejected;
      rejectedRecord.value = err;
    }
  });
  return record;
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
  this.ok = nativeResponse.ok;
  this.redirected = nativeResponse.redirected;
  this.status = nativeResponse.status;
  this.statusText = nativeResponse.statusText;
  this.type = nativeResponse.type;
  this.url = nativeResponse.url;
  this._response = nativeResponse;
  this._arrayBuffer = null;
  this._blob = null;
  this._json = null;
  this._text = null;
}

Response.prototype = {
  constructor: Response,
  arrayBuffer: function () {
    return readRecordValue(this._arrayBuffer || (this._arrayBuffer = createRecordFromThenable(this._response.arrayBuffer())));
  },
  blob: function () {
    return readRecordValue(this._blob || (this._blob = createRecordFromThenable(this._response.blob())));
  },
  json: function () {
    return readRecordValue(this._json || (this._json = createRecordFromThenable(this._response.json())));
  },
  text: function () {
    return readRecordValue(this._text || (this._text = createRecordFromThenable(this._response.text())));
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

    var thenable = nativeFetch(url, options);
    record = createRecordFromThenable(thenable);
    map.set(url, record);
  }

  return record;
}

function preload(url, options) {
  preloadRecord(url, options); // Don't return anything.
}
function fetch(url, options) {
  var record = preloadRecord(url, options);
  var nativeResponse = readRecordValue(record);

  if (nativeResponse._reactResponse) {
    return nativeResponse._reactResponse;
  } else {
    return nativeResponse._reactResponse = new Response(nativeResponse);
  }
}

exports.fetch = fetch;
exports.preload = preload;
  })();
}
