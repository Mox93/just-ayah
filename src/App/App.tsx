import { StrictMode, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import {
  AuthProvider,
  CourseProvider,
  CustomerProvider,
  MetaProvider,
  StudentProvider,
  PopupProvider,
  TeacherProvider,
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
        AuthProvider,
        MetaProvider,
        TeacherProvider,
        CourseProvider,
        CustomerProvider,
        StudentProvider,
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
