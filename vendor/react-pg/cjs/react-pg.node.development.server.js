/** @license React vundefined
 * react-pg.node.development.server.js
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
var pg = require('pg');
var utils = require('pg/lib/utils');

var Pending = 0;
var Resolved = 1;
var Rejected = 2;

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

function Pool(options) {
  this.pool = new pg.Pool(options); // Unique function per instance because it's used for cache identity.

  this.createRecordMap = function () {
    return new Map();
  };
}

Pool.prototype.query = function (query, values) {
  var pool = this.pool;
  var outerMap = react.unstable_getCacheForType(this.createRecordMap);
  var innerMap = outerMap;
  var key = query;

  if (values != null) {
    // If we have parameters, each becomes as a nesting layer for Maps.
    // We want to find (or create as needed) the innermost Map, and return that.
    for (var i = 0; i < values.length; i++) {
      var nextMap = innerMap.get(key);

      if (nextMap === undefined) {
        nextMap = new Map();
        innerMap.set(key, nextMap);
      } else if (!(nextMap instanceof Map)) {
        {
          {
            throw Error( "This query has received more parameters than the last time the same query was used. Always pass the exact number of parameters that the query needs." );
          }
        }
      }

      innerMap = nextMap; // Postgres bindings convert everything to strings:
      // https://node-postgres.com/features/queries#parameterized-query
      // We reuse their algorithm instead of reimplementing.

      key = utils.prepareValue(values[i]);
    }
  }

  var record = innerMap.get(key);

  if (!record) {
    var thenable = pool.query(query, values);
    record = createRecordFromThenable(thenable);
    innerMap.set(key, record);
  } else if (record instanceof Map) {
    {
      {
        throw Error( "This query has received fewer parameters than the last time the same query was used. Always pass the exact number of parameters that the query needs." );
      }
    }
  }

  var result = readRecordValue(record);
  return result;
};

exports.Pool = Pool;
  })();
}
