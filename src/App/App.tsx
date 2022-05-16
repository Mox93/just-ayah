import { StrictMode, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "context/Auth";
import { CustomersProvider } from "context/Customers";
import { StudentsProvider } from "context/Students";
import { PopupProvider } from "context/Popup";

import "services/i18n";
import "styles/index.scss";

import Composer from "./Composer";
import ViewHandler from "./ViewHandler";

function App() {
  return (
    <Composer
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
    </Composer>
  );
}

export default App;
