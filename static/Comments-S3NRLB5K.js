import {
  React,
  __toModule,
  init_react_shim,
  require_react
} from "https://react-lazy-ssr-workers.pages.dev/chunk-F2YDFNRX.js";

// src/Comments.js
init_react_shim();

// src/data.js
init_react_shim();
var import_react = __toModule(require_react());
var DataContext = (0, import_react.createContext)(null);
var fakeData = [
  "Wait, it doesn't wait for React to load?",
  "How does this even work?",
  "I like marshmallows"
];
function useData() {
  const ctx = (0, import_react.useContext)(DataContext);
  if (ctx !== null) {
    ctx.read();
  }
  return fakeData;
}

// src/Comments.js
function Comments() {
  const comments = useData();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, comments.map((comment, i) => /* @__PURE__ */ React.createElement("p", {
    className: "comment",
    key: i
  }, comment)));
}
export {
  Comments as default
};
