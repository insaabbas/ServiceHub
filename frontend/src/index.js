import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // now includes both global and styles.css

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
