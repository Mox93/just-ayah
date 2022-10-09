import { StrictMode, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import LoadingPopup from "components/LoadingPopup";
import {
  AuthProvider,
  CourseProvider,
  CustomerProvider,
  MetaProvider,
  StudentProvider,
  PopupProvider,
  TeacherProvider,
  StudentEnrollProvider,
  TeacherEnrollProvider,
} from "context";
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
        [Suspense, { fallback: <LoadingPopup message="loading" /> }],
        AuthProvider,
        MetaProvider,
        TeacherProvider,
        CourseProvider,
        CustomerProvider,
        StudentProvider,
        StudentEnrollProvider,
        TeacherEnrollProvider,
        PopupProvider,
      ]}
    >
      <ViewHandler />
    </Composer>
  );
}

export default App;
