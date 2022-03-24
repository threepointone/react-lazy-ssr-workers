/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";
// import {renderToString} from 'react-dom/server';
// import {pipeToNodeWritable} from 'react-dom/server';
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
  // This is how you would wire it up previously:
  //
  // res.send(
  //   '<!DOCTYPE html>' +
  //   renderToString(
  //     <DataProvider data={data}>
  //       <App assets={assets} />
  //     </DataProvider>,
  //   )
  // );

  // The new wiring is a bit more involved.
  // TODO res.socket.on('error', error => {
  //   console.error('Fatal', error);
  // });
  // let didError = false;
  const data = createServerData();
  // const {startWriting, abort} = pipeToNodeWritable(
  let controller = new AbortController();
  try {
    const stream = await renderToReadableStream(
      <DataProvider data={data}>
        <App assets={assets} />
      </DataProvider>,
      {
        // onReadyToStream() {
        //  TODO?
        //   // If something errored before we started streaming, we set the error code appropriately.
        //   res.statusCode = didError ? 500 : 200;
        //   res.setHeader('Content-type', 'text/html');
        //   res.write('<!DOCTYPE html>');
        //   startWriting();
        // },

        signal: controller.signal,

        // onError(x) {
        //   didError = true;
        //   console.error(x);
        // },
      }
    );

    await stream.allReady;
    return new Response(stream, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    return new Response(
      '<!doctype html><p>Loading...</p><script src="/index.js"></script>',
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  // setTimeout(() => {
  //   stream.cancel();
  // }, ABORT_DELAY);
  // return stream;
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
