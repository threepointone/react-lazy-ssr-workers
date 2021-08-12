/** @license React vundefined
 * react-fs.node.production.min.server.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var f=require("react"),g=require("fs/promises");function h(c){var a={status:0,value:c,cache:null};c.then(function(c){0===a.status&&(a.status=1,a.value=c)},function(c){0===a.status&&(a.status=2,a.value=c)});return a}function k(c){if(1===c.status)return c;throw c.value;}function m(){return new Map}function n(){return new Map}function p(){return new Map}function q(){return new Map}function r(){return new Map}function t(){return new Map}function u(){return new Map}
exports.access=function(c,a){null==a&&(a=0);var d=f.unstable_getCacheForType(m),b=d.get(c);b||(b=[],d.set(c,b));for(d=0;d<b.length;d+=2)if(a===b[d]){var e=b[d+1];break}e||(c=g.access(c,a),e=h(c),b.push(a,e));k(e)};exports.lstat=function(c,a){var d=!1;a&&a.bigint&&(d=!0);var b=f.unstable_getCacheForType(n);a=b.get(c);a||(a=[],b.set(c,a));for(b=0;b<a.length;b+=2)if(d===a[b]){var e=a[b+1];break}e||(c=g.lstat(c,{bigint:d}),e=h(c),a.push(d,e));return k(e).value};
exports.readFile=function(c,a){var d=f.unstable_getCacheForType(q),b=d.get(c);b||(b=g.readFile(c),b=h(b),d.set(c,b));d=k(b);c=d.value;if(!a)return c;if("string"!==typeof a){b=a.flag;if(null!=b&&"r"!==b)throw Error('The flag option is not supported, and always defaults to "r".');if(a.signal)throw Error("The signal option is not supported.");a=a.encoding}if("string"!==typeof a)return c;d=d.cache||(d.cache=[]);for(b=0;b<d.length;b+=2)if(d[b]===a)return d[b+1];c=c.toString(a);d.push(a,c);return c};
exports.readdir=function(c,a){var d="utf8",b=!1;"string"===typeof a?d=a:null!=a&&(a.encoding&&(d=a.encoding),a.withFileTypes&&(b=!0));var e=f.unstable_getCacheForType(p);a=e.get(c);a||(a=[],e.set(c,a));for(e=0;e<a.length;e+=3){var v=a[e+1];if(d===a[e]&&b===v){var l=a[e+2];break}}l||(c=g.readdir(c,{encoding:d,withFileTypes:b}),l=h(c),a.push(d,b,l));return k(l).value};
exports.readlink=function(c,a){var d="utf8";"string"===typeof a?d=a:null!=a&&a.encoding&&(d=a.encoding);var b=f.unstable_getCacheForType(r);a=b.get(c);a||(a=[],b.set(c,a));for(b=0;b<a.length;b+=2)if(d===a[b]){var e=a[b+1];break}e||(c=g.readlink(c,{encoding:d}),e=h(c),a.push(d,e));return k(e).value};
exports.realpath=function(c,a){var d="utf8";"string"===typeof a?d=a:null!=a&&a.encoding&&(d=a.encoding);var b=f.unstable_getCacheForType(t);a=b.get(c);a||(a=[],b.set(c,a));for(b=0;b<a.length;b+=2)if(d===a[b]){var e=a[b+1];break}e||(c=g.realpath(c,{encoding:d}),e=h(c),a.push(d,e));return k(e).value};
exports.stat=function(c,a){var d=!1;a&&a.bigint&&(d=!0);var b=f.unstable_getCacheForType(u);a=b.get(c);a||(a=[],b.set(c,a));for(b=0;b<a.length;b+=2)if(d===a[b]){var e=a[b+1];break}e||(c=g.stat(c,{bigint:d}),e=h(c),a.push(d,e));return k(e).value};
