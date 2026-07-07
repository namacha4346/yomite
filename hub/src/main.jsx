import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";

// 通常はURL方式（BrowserRouter）。1ファイルのデモ配布時は
// VITE_DEMO=1 でハッシュ方式（HashRouter）にする（静的配布でも動く）。
const Router = import.meta.env.VITE_DEMO === "1" ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
