import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Leva } from "leva";
import "./style.css";

const root = document.getElementById("root");
if(root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Leva collapsed />
      <App />
    </React.StrictMode>,
  );
}
