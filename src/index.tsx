import React from "react";
import ReactDOM from "react-dom";

import "./styles/index.scss";
import "./styles/components.scss";
import "./styles/pages.scss";
import App from "./components/App";
import "./services/i18n";
import { AuthProvider } from "./context/Auth";
import { BrowserRouter } from "react-router-dom";
import Compose from "./components/Compose";
import { StudentsProvider } from "./context/Students";

ReactDOM.render(
  <Compose
    components={[
      React.StrictMode,
      BrowserRouter,
      AuthProvider,
      StudentsProvider,
    ]}
  >
    <App />
  </Compose>,
  document.getElementById("root")
);
