/** @license React vundefined
 * react-pg.node.production.min.server.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var h=require("react"),k=require("pg"),l=require("pg/lib/utils");function m(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,e=1;e<arguments.length;e++)b+="&args[]="+encodeURIComponent(arguments[e]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}
function n(a){var b={status:0,value:a};a.then(function(a){0===b.status&&(b.status=1,b.value=a)},function(a){0===b.status&&(b.status=2,b.value=a)});return b}function p(a){this.pool=new k.Pool(a);this.createRecordMap=function(){return new Map}}
p.prototype.query=function(a,b){var e=this.pool,d=h.unstable_getCacheForType(this.createRecordMap),f=a;if(null!=b)for(var c=0;c<b.length;c++){var g=d.get(f);if(void 0===g)g=new Map,d.set(f,g);else if(!(g instanceof Map))throw Error(m(382));d=g;f=l.prepareValue(b[c])}c=d.get(f);if(!c)a=e.query(a,b),c=n(a),d.set(f,c);else if(c instanceof Map)throw Error(m(383));if(1===c.status)d=c.value;else throw c.value;return d};exports.Pool=p;
