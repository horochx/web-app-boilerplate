import React from "react";
import ReactDOM from "react-dom";
import App from "lib/App";
import { register } from "lib/service-worker";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

if (process.env.NODE_ENV === "production") {
  setTimeout(() => {
    register((skipWaiting) => {
      const answer = window.confirm(
        "A new version of this page is available. Do you want to update now?"
      );

      if (answer) {
        skipWaiting();
      }
    });
  }, 0);
}
