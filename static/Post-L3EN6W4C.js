import {
  React,
  init_react_shim
} from "https://react-lazy-ssr-workers.pages.dev/chunk-F2YDFNRX.js";

// src/Post.js
init_react_shim();
function Post() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", null, "Hello world"), /* @__PURE__ */ React.createElement("p", null, "This demo is ", /* @__PURE__ */ React.createElement("b", null, "artificially slowed down"), ". Open", " ", /* @__PURE__ */ React.createElement("code", null, "server/delays.js"), " to adjust how much different things are slowed down."), /* @__PURE__ */ React.createElement("p", null, 'Notice how HTML for comments "streams in" before the JS (or React) has loaded on the page.'), /* @__PURE__ */ React.createElement("p", null, "Also notice that the JS for comments and sidebar has been code-split, but HTML for it is still included in the server output."));
}
export {
  Post as default
};
