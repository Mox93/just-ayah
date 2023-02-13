import { StrictMode, Suspense, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import LoadingPopup from "components/LoadingPopup";
import {
  AuthProvider,
  CourseProvider,
  LeadProvider,
  MetaProvider,
  StudentProvider,
  usePopupProvider,
  TeacherProvider,
  StudentEnrollProvider,
  TeacherEnrollProvider,
} from "context";
import "services/i18n";
import "styles/index.scss";

import Nest from "./Nest";
import { RoutHandler } from "./routes";
import { devOnly } from "utils";

const now = new Date();

function App() {
  const [PopupProvider, popups] = usePopupProvider();

  useEffect(() => {
    devOnly(() =>
      console.log(
        ">>> PopupProvider changed",
        new Date().getTime() - now.getTime()
      )
    );
  }, [PopupProvider]);

  useEffect(() => {
    devOnly(() =>
      console.log(">>> popups changed", new Date().getTime() - now.getTime())
    );
  }, [popups]);

  devOnly(() =>
    console.log(">>> App changed", new Date().getTime() - now.getTime())
  );

  return (
    <Nest>
      <StrictMode />
      <PopupProvider />
      <BrowserRouter />
      <Suspense fallback={<LoadingPopup message="loading" />} />
      {/* <Suspense fallback={<LoadingSpinner />} /> */}
      <AuthProvider />
      <MetaProvider />
      <TeacherProvider />
      <CourseProvider />
      <LeadProvider />
      <StudentProvider />
      <StudentEnrollProvider />
      <TeacherEnrollProvider />
      <>
        <RoutHandler />
        {popups}
      </>
    </Nest>
  );
}

export default App;
