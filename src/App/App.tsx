import { StrictMode, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import { Await } from "components/Await";
import LoadingPopup from "components/LoadingPopup";
import {
  AuthProvider,
  CourseProvider,
  LeadProvider,
  MetaProvider,
  PopupOutlet,
  PopupProvider,
  StudentProvider,
  TeacherProvider,
  StudentEnrollProvider,
  TeacherEnrollProvider,
} from "context";

import { Nest, Network } from "./components";
import { RoutHandler } from "./routes";

import "services/i18n";
import "styles/index.scss";

function App() {
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
          <MetaProvider />

          {/* System Data Providers */}
          <CourseProvider />
          <LeadProvider />
          <StudentProvider />
          <StudentEnrollProvider />
          <TeacherProvider />
          <TeacherEnrollProvider />

          {/* Page Content */}
          <>
            <RoutHandler />
            <PopupOutlet />
          </>
        </Nest>
        <Network />
      </>
    </Nest>
  );
}

export default App;
