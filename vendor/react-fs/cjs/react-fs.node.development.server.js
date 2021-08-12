/** @license React vundefined
 * react-fs.node.development.server.js
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
var fs = require('fs/promises');
var path = require('path');

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

var Pending = 0;
var Resolved = 1;
var Rejected = 2;

function createRecordFromThenable(thenable) {
  var record = {
    status: Pending,
    value: thenable,
    cache: null
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

function readRecord(record) {
  if (record.status === Resolved) {
    // This is just a type refinement.
    return record;
  } else {
    throw record.value;
  }
} // We don't want to normalize every path ourselves in production.
// However, relative or non-normalized paths will lead to cache misses.
// So we encourage the developer to fix it in DEV and normalize on their end.


function checkPathInDev(path$1) {
  {
    if (!path.isAbsolute(path$1)) {
      error('The provided path was not absolute: "%s". ' + 'Convert it to an absolute path first.', path$1);
    } else if (path$1 !== path.normalize(path$1)) {
      error('The provided path was not normalized: "%s". ' + 'Convert it to a normalized path first.', path$1);
    }
  }
}

function createAccessMap() {
  return new Map();
}

function access(path, mode) {
  checkPathInDev(path);

  if (mode == null) {
    mode = 0; // fs.constants.F_OK
  }

  var map = React.unstable_getCacheForType(createAccessMap);
  var accessCache = map.get(path);

  if (!accessCache) {
    accessCache = [];
    map.set(path, accessCache);
  }

  var record;

  for (var i = 0; i < accessCache.length; i += 2) {
    var cachedMode = accessCache[i];

    if (mode === cachedMode) {
      var cachedRecord = accessCache[i + 1];
      record = cachedRecord;
      break;
    }
  }

  if (!record) {
    var thenable = fs.access(path, mode);
    record = createRecordFromThenable(thenable);
    accessCache.push(mode, record);
  }

  readRecord(record); // No return value.
}

function createLstatMap() {
  return new Map();
}

function lstat(path, options) {
  checkPathInDev(path);
  var bigint = false;

  if (options && options.bigint) {
    bigint = true;
  }

  var map = React.unstable_getCacheForType(createLstatMap);
  var lstatCache = map.get(path);

  if (!lstatCache) {
    lstatCache = [];
    map.set(path, lstatCache);
  }

  var record;

  for (var i = 0; i < lstatCache.length; i += 2) {
    var cachedBigint = lstatCache[i];

    if (bigint === cachedBigint) {
      var cachedRecord = lstatCache[i + 1];
      record = cachedRecord;
      break;
    }
  }

  if (!record) {
    var thenable = fs.lstat(path, {
      bigint: bigint
    });
    record = createRecordFromThenable(thenable);
    lstatCache.push(bigint, record);
  }

  var stats = readRecord(record).value;
  return stats;
}

function createReaddirMap() {
  return new Map();
}

function readdir(path, options) {
  checkPathInDev(path);
  var encoding = 'utf8';
  var withFileTypes = false;

  if (typeof options === 'string') {
    encoding = options;
  } else if (options != null) {
    if (options.encoding) {
      encoding = options.encoding;
    }

    if (options.withFileTypes) {
      withFileTypes = true;
    }
  }

  var map = React.unstable_getCacheForType(createReaddirMap);
  var readdirCache = map.get(path);

  if (!readdirCache) {
    readdirCache = [];
    map.set(path, readdirCache);
  }

  var record;

  for (var i = 0; i < readdirCache.length; i += 3) {
    var cachedEncoding = readdirCache[i];
    var cachedWithFileTypes = readdirCache[i + 1];

    if (encoding === cachedEncoding && withFileTypes === cachedWithFileTypes) {
      var cachedRecord = readdirCache[i + 2];
      record = cachedRecord;
      break;
    }
  }

  if (!record) {
    var thenable = fs.readdir(path, {
      encoding: encoding,
      withFileTypes: withFileTypes
    });
    record = createRecordFromThenable(thenable);
    readdirCache.push(encoding, withFileTypes, record);
  }

  var files = readRecord(record).value;
  return files;
}

function createReadFileMap() {
  return new Map();
}

function readFile(path, options) {
  checkPathInDev(path);
  var map = React.unstable_getCacheForType(createReadFileMap);
  var record = map.get(path);

  if (!record) {
    var thenable = fs.readFile(path);
    record = createRecordFromThenable(thenable);
    map.set(path, record);
  }

  var resolvedRecord = readRecord(record);
  var buffer = resolvedRecord.value;

  if (!options) {
    return buffer;
  }

  var encoding;

  if (typeof options === 'string') {
    encoding = options;
  } else {
    var flag = options.flag;

    if (flag != null && flag !== 'r') {
      throw Error('The flag option is not supported, and always defaults to "r".');
    }

    if (options.signal) {
      throw Error('The signal option is not supported.');
    }

    encoding = options.encoding;
  }

  if (typeof encoding !== 'string') {
    return buffer;
  }

  var textCache = resolvedRecord.cache || (resolvedRecord.cache = []);

  for (var i = 0; i < textCache.length; i += 2) {
    if (textCache[i] === encoding) {
      return textCache[i + 1];
    }
  }

  var text = buffer.toString(encoding);
  textCache.push(encoding, text);
  return text;
}

function createReadlinkMap() {
  return new Map();
}

function readlink(path, options) {
  checkPathInDev(path);
  var encoding = 'utf8';

  if (typeof options === 'string') {
    encoding = options;
  } else if (options != null) {
    if (options.encoding) {
      encoding = options.encoding;
    }
  }

  var map = React.unstable_getCacheForType(createReadlinkMap);
  var readlinkCache = map.get(path);

  if (!readlinkCache) {
    readlinkCache = [];
    map.set(path, readlinkCache);
  }

  var record;

  for (var i = 0; i < readlinkCache.length; i += 2) {
    var cachedEncoding = readlinkCache[i];

    if (encoding === cachedEncoding) {
      var cachedRecord = readlinkCache[i + 1];
      record = cachedRecord;
      break;
    }
  }

  if (!record) {
    var thenable = fs.readlink(path, {
      encoding: encoding
    });
    record = createRecordFromThenable(thenable);
    readlinkCache.push(encoding, record);
  }

  var linkString = readRecord(record).value;
  return linkString;
}

function createRealpathMap() {
  return new Map();
}

function realpath(path, options) {
  checkPathInDev(path);
  var encoding = 'utf8';

  if (typeof options === 'string') {
    encoding = options;
  } else if (options != null) {
    if (options.encoding) {
      encoding = options.encoding;
    }
  }

  var map = React.unstable_getCacheForType(createRealpathMap);
  var realpathCache = map.get(path);

  if (!realpathCache) {
    realpathCache = [];
    map.set(path, realpathCache);
  }

  var record;

  for (var i = 0; i < realpathCache.length; i += 2) {
    var cachedEncoding = realpathCache[i];

    if (encoding === cachedEncoding) {
      var cachedRecord = realpathCache[i + 1];
      record = cachedRecord;
      break;
    }
  }

  if (!record) {
    var thenable = fs.realpath(path, {
      encoding: encoding
    });
    record = createRecordFromThenable(thenable);
    realpathCache.push(encoding, record);
  }

  var resolvedPath = readRecord(record).value;
  return resolvedPath;
}

function createStatMap() {
  return new Map();
}

function stat(path, options) {
  checkPathInDev(path);
  var bigint = false;

  if (options && options.bigint) {
    bigint = true;
  }

  var map = React.unstable_getCacheForType(createStatMap);
  var statCache = map.get(path);

  if (!statCache) {
    statCache = [];
    map.set(path, statCache);
  }

  var record;

  for (var i = 0; i < statCache.length; i += 2) {
    var cachedBigint = statCache[i];

    if (bigint === cachedBigint) {
      var cachedRecord = statCache[i + 1];
      record = cachedRecord;
      break;
    }
  }

  if (!record) {
    var thenable = fs.stat(path, {
      bigint: bigint
    });
    record = createRecordFromThenable(thenable);
    statCache.push(bigint, record);
  }

  var stats = readRecord(record).value;
  return stats;
}

exports.access = access;
exports.lstat = lstat;
exports.readFile = readFile;
exports.readdir = readdir;
exports.readlink = readlink;
exports.realpath = realpath;
exports.stat = stat;
  })();
}
