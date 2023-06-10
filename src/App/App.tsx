import { StrictMode, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import { Await } from "components/Await";
import LoadingPopup from "components/LoadingPopup";
import {
  AuthProvider,
  LeadProvider,
  PopupOutlet,
  PopupProvider,
  StudentProvider,
  TeacherProvider,
  StudentEnrollProvider,
  TeacherEnrollProvider,
} from "context";

import { Nest, Network } from "./components";
import { usePageSync } from "./hooks";
import { RoutHandler } from "./routes";

import "services/i18n";

function App() {
  usePageSync();

  return (
    <Nest>
      <StrictMode />

      {/* General UI Providers */}
      <PopupProvider />
      <Suspense fallback={<LoadingPopup />} />
      <Await />
      <>
        <Nest>
          {/* Path Specific Providers */}
          <BrowserRouter />

          {/* Role Specific Providers */}
          <AuthProvider />

          {/* System Data Providers */}
          <LeadProvider />
          <StudentProvider />
          <StudentEnrollProvider />
          <TeacherProvider />
          <TeacherEnrollProvider />

          {/* Page Content */}
          <>
            <RoutHandler />
            <Await>
              <PopupOutlet />
            </Await>
          </>
        </Nest>
        <Network />
      </>
    </Nest>
  );
}

export default App;
