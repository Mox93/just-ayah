import { StrictMode, Suspense, useRef } from "react";
import { BrowserRouter } from "react-router-dom";

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
import { devOnly } from "utils";

import { Nest, Network } from "./components";
import { RoutHandler } from "./routes";

import "services/i18n";
import "styles/index.scss";

function useTrackRerender() {
  const { current: now } = useRef(new Date());

  devOnly(() =>
    console.log(">>> App rerender", new Date().getTime() - now.getTime())
  )();
}

function App() {
  useTrackRerender();

  return (
    <Nest>
      <StrictMode />

      {/* General UI Providers */}
      <PopupProvider />
      <Suspense fallback={<LoadingPopup message="loading" />} />
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
