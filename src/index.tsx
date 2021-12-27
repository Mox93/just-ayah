import React from "react";
import ReactDOM from "react-dom";

import "./styles/index.css";
import App from "./components/App";
import "./services/i18n";
import { AuthProvider } from "./context/Auth";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
