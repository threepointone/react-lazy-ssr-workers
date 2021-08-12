/** @license React vundefined
 * react-noop-renderer-server.development.js
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

var ReactFizzServer = require('react-server');

/**
 * This is a renderer of React that doesn't have a render target output.
 * It is useful to demonstrate the internals of the reconciler in isolation
 * and for testing semantics of reconciliation separate from the host
 * environment.
 */
var POP = Buffer.from('/', 'utf8');
var opaqueID = 0;
var ReactNoopServer = ReactFizzServer({
  scheduleWork: function (callback) {
    callback();
  },
  beginWriting: function (destination) {},
  writeChunk: function (destination, buffer) {
    var stack = destination.stack;

    if (buffer === POP) {
      stack.pop();
      return;
    } // We assume one chunk is one instance.


    var instance = JSON.parse(Buffer.from(buffer).toString('utf8'));

    if (stack.length === 0) {
      destination.root = instance;
    } else {
      var parent = stack[stack.length - 1];
      parent.children.push(instance);
    }

    stack.push(instance);
  },
  completeWriting: function (destination) {},
  close: function (destination) {},
  closeWithError: function (destination, error) {},
  flushBuffered: function (destination) {},
  createSuspenseBoundaryID: function () {
    // The ID is a pointer to the boundary itself.
    return {
      state: 'pending',
      children: []
    };
  },
  makeServerID: function () {
    return opaqueID++;
  },
  getChildFormatContext: function () {
    return null;
  },
  pushTextInstance: function (target, text) {
    var textInstance = {
      text: text,
      hidden: false
    };
    target.push(Buffer.from(JSON.stringify(textInstance), 'utf8'), POP);
  },
  pushStartInstance: function (target, type, props) {
    var instance = {
      type: type,
      children: [],
      prop: props.prop,
      hidden: false
    };
    target.push(Buffer.from(JSON.stringify(instance), 'utf8'));
    return props.children;
  },
  pushEndInstance: function (target, type, props) {
    target.push(POP);
  },
  writePlaceholder: function (destination, responseState, id) {
    var parent = destination.stack[destination.stack.length - 1];
    destination.placeholders.set(id, {
      parent: parent,
      index: parent.children.length
    });
  },
  writeStartCompletedSuspenseBoundary: function (destination, responseState, suspenseInstance) {
    suspenseInstance.state = 'complete';
    var parent = destination.stack[destination.stack.length - 1];
    parent.children.push(suspenseInstance);
    destination.stack.push(suspenseInstance);
  },
  writeStartPendingSuspenseBoundary: function (destination, responseState, suspenseInstance) {
    suspenseInstance.state = 'pending';
    var parent = destination.stack[destination.stack.length - 1];
    parent.children.push(suspenseInstance);
    destination.stack.push(suspenseInstance);
  },
  writeStartClientRenderedSuspenseBoundary: function (destination, responseState, suspenseInstance) {
    suspenseInstance.state = 'client-render';
    var parent = destination.stack[destination.stack.length - 1];
    parent.children.push(suspenseInstance);
    destination.stack.push(suspenseInstance);
  },
  writeEndCompletedSuspenseBoundary: function (destination) {
    destination.stack.pop();
  },
  writeEndPendingSuspenseBoundary: function (destination) {
    destination.stack.pop();
  },
  writeEndClientRenderedSuspenseBoundary: function (destination) {
    destination.stack.pop();
  },
  writeStartSegment: function (destination, responseState, formatContext, id) {
    var segment = {
      children: []
    };
    destination.segments.set(id, segment);

    if (destination.stack.length > 0) {
      throw new Error('Segments are only expected at the root of the stack.');
    }

    destination.stack.push(segment);
  },
  writeEndSegment: function (destination, formatContext) {
    destination.stack.pop();
  },
  writeCompletedSegmentInstruction: function (destination, responseState, contentSegmentID) {
    var _placeholder$parent$c;

    var segment = destination.segments.get(contentSegmentID);

    if (!segment) {
      throw new Error('Missing segment.');
    }

    var placeholder = destination.placeholders.get(contentSegmentID);

    if (!placeholder) {
      throw new Error('Missing placeholder.');
    }

    (_placeholder$parent$c = placeholder.parent.children).splice.apply(_placeholder$parent$c, [placeholder.index, 0].concat(segment.children));
  },
  writeCompletedBoundaryInstruction: function (destination, responseState, boundary, contentSegmentID) {
    var segment = destination.segments.get(contentSegmentID);

    if (!segment) {
      throw new Error('Missing segment.');
    }

    boundary.children = segment.children;
    boundary.state = 'complete';
  },
  writeClientRenderBoundaryInstruction: function (destination, responseState, boundary) {
    boundary.status = 'client-render';
  }
});

function render(children, options) {
  var destination = {
    root: null,
    placeholders: new Map(),
    segments: new Map(),
    stack: [],
    abort: function () {
      ReactNoopServer.abort(request);
    }
  };
  var request = ReactNoopServer.createRequest(children, destination, null, null, options ? options.progressiveChunkSize : undefined, options ? options.onError : undefined, options ? options.onCompleteAll : undefined, options ? options.onReadyToStream : undefined);
  ReactNoopServer.startWork(request);
  ReactNoopServer.startFlowing(request);
  return destination;
}

exports.render = render;
  })();
}
