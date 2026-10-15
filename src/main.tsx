import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/barlow-condensed/latin-800.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "./styles/global.css";
import "./styles/v2.css";
import "./styles/v3.css";
import "./styles/hero-art.css";
import AppRoot from "./AppRoot";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>,
);
