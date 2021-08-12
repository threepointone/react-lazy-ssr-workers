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
import { JS_BUNDLE_DELAY } from "./delays";

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

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
    // This should only happen in "production"
    if (req.url.endsWith(".js") || req.url.endsWith(".css")) {
      if (req.url.endsWith(".js")) {
        // Artificially delay serving JS
        await sleep(JS_BUNDLE_DELAY);
      }
      return fetch(req);
    }
    return app.handle(req).catch(onError);
  },
};
