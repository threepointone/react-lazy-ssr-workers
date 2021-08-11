/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

"use strict";

import render from "./render";
import { Router } from "itty-router";
// app.use((req, res, next) => {
//   if (req.url.endsWith('.js')) {
//     // Artificially delay serving JS
//     // to demonstrate streaming HTML.
//     setTimeout(next, JS_BUNDLE_DELAY);
//   } else {
//     next();
//   }
// });

const { JS_BUNDLE_DELAY } = require("./delays");
const app = Router();

app.all("*", (request) => {
  console.log(request.url);
  return new Response(render(request));
});

function onError(error) {
  return new Response(error.message || "Server Error", {
    status: error.status || 500,
  });
}

export default {
  async fetch(req) {
    return app.handle(req).catch(onError);
  },
};
