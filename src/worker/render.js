/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";
import { renderToReadableStream } from "react-dom/server.browser";
import App from "../App";
import { DataProvider } from "../data";
import { API_DELAY, ABORT_DELAY } from "./delays";

// In a real setup, you'd read it from webpack build stats.
let assets = {
  "index.js": `/index.js`,
  "main.css": `/main.css`,
};

export default async function render(url, res) {
  const data = createServerData();
  let controller = new AbortController();
  try {
    const stream = await renderToReadableStream(
      <DataProvider data={data}>
        <App assets={assets} />
      </DataProvider>,
      {
        signal: controller.signal,
      }
    );

    await stream.allReady;
    return new Response(stream, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    console.error("Server Error", err);
    return new Response(
      '<!doctype html><p>Loading...</p><script src="/index.js"></script>',
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}

// Simulate a delay caused by data fetching.
// We fake this because the streaming HTML renderer
// is not yet integrated with real data fetching strategies.
function createServerData() {
  let done = false;
  let promise = null;
  return {
    read() {
      if (done) {
        return;
      }
      if (promise) {
        throw promise;
      }
      promise = new Promise((resolve) => {
        setTimeout(() => {
          done = true;
          promise = null;
          resolve();
        }, API_DELAY);
      });
      throw promise;
    },
  };
}
