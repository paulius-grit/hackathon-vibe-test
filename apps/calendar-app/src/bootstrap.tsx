import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="p-8">
      <p className="mb-4 text-sm text-muted-foreground">
        ⚡ Running in standalone mode
      </p>
      <App />
    </div>
  </React.StrictMode>
);
