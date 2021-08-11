function renderToReadableStream(children, options) {
  let request;
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  if (options && options.signal) {
    const signal = options.signal;
    const listener = () => {
      abort(request);
      writer.close();
      signal.removeEventListener("abort", listener);
    };
    signal.addEventListener("abort", listener);
  }

  request = createRequest(
    children,
    {
      enqueue(chunk) {
        writer.write(typeof chunk === "string" ? encoder.encode(chunk) : chunk);
      },
      close() {
        writer.close();
      },
      error(e) {
        abort(request);
        writer.abort(e.message);
        writer.close();
      },
      desiredSize: 512,
    },
    createResponseState(options ? options.identifierPrefix : undefined),
    createRootFormatContext(options ? options.namespaceURI : undefined),
    options ? options.progressiveChunkSize : undefined,
    options ? options.onError : undefined,
    options ? options.onCompleteAll : undefined,
    options ? options.onReadyToStream : undefined
  );
  startWork(request);
  startFlowing(request);
  return readable;
}
