import { StrictMode, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "context/Auth";
import { CustomersProvider } from "context/Customers";
import { StudentsProvider } from "context/Students";
import { PopupProvider } from "context/Popup";

import "services/i18n";
import "styles/index.scss";
import "styles/components.scss";
import "styles/pages.scss";

import Compose from "./Compose";
import ViewHandler from "./ViewHandler";

function App() {
  return (
    <Compose
      components={[
        StrictMode,
        BrowserRouter,
        AuthProvider,
        StudentsProvider,
        CustomersProvider,
        [Suspense, { fallback: "...is loading" }],
        PopupProvider,
      ]}
    >
      <div className="App">
        <ViewHandler />
      </div>
    </Compose>
  );
}

export default App;
