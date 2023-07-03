import { Navigate, Route, Routes, To } from "react-router-dom";

import { useStudentEnrollContext, useTeacherEnrollContext } from "context";
import { useLocalStorage } from "hooks";
import { IS_DEV } from "models/config";
import { Admin, Home, SignIn } from "pages/Admin";
import { CourseList, CourseProfile, Courses } from "pages/Courses";
import { NotFound, Unauthorized } from "pages/Fallback";
import { LeadList, LeadProfile, Leads, NewLead } from "pages/Leads";
import {
  Students,
  StudentList,
  StudentProfile,
  StudentEnroll,
} from "pages/Students";
import {
  Teachers,
  TeacherEnroll,
  TeacherList,
  TeacherProfile,
} from "pages/Teachers";
import { FormUI, MainUI, SandboxUI } from "pages/UI";
import { SessionReport, SessionTrack, Temp } from "temp";
import { getSessionTrack } from "temp/utils";
import { pass } from "utils";

import { UserGuard, FetchGuard, AuthGuard } from "../guards";
// import AdminView from "./AdminView";
// import PublicView from "./PublicView";

export default function RoutHandler() {
  // const parts = window.location.hostname.split(".");
  // const subdomain = parts.length > 1 ? parts[0] : null;

  // switch (subdomain) {
  //   case "admin":
  //     return <AdminView />;
  //   default:
  //     return <PublicView />;
  // }
  const { getStudentEnroll } = useStudentEnrollContext();
  const { getTeacherEnroll } = useTeacherEnrollContext();

  const signInSession = useLocalStorage<{ from?: To }>("signInSession");

  return (
    <Routes>
      {/* Admin */}
      <Route element={<UserGuard redirect="/sign-in" />}>
        <Route element={<AuthGuard />}>
          <Route path="admin" element={<Admin />}>
            {/* Home */}
            <Route index element={<Home />} />

            {/* Courses */}
            <Route path="courses" element={<Courses />}>
              <Route index element={<CourseList />} />
              <Route path=":id" element={<CourseProfile />} />
            </Route>

            {/* Leads */}
            <Route path="leads" element={<Leads />}>
              <Route index element={<LeadList />} />
              <Route path=":id" element={<LeadProfile />} />
            </Route>

            {/* Students */}
            <Route path="students" element={<Students />}>
              <Route index element={<StudentList />} />
              <Route path=":id" element={<StudentProfile />} />
            </Route>

            {/* Teachers */}
            <Route path="teachers" element={<Teachers />}>
              <Route index element={<TeacherList />} />
              <Route path=":id" element={<TeacherProfile />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Public */}
      <Route
        element={
          <UserGuard
            redirect={signInSession.data?.from || "/admin"}
            guestOnly
          />
        }
      >
        <Route path="sign-in" element={<SignIn />} />
      </Route>

      <Route path="reach-out" element={<NewLead />} />

      <Route path="students">
        {/* Not Implemented Yet */}
        <Route index element={<NotFound />} />

        <Route
          path="new/:id"
          element={
            <FetchGuard
              fetcher={({ id }: { id: string }) => getStudentEnroll(id)}
              failed={<Unauthorized />}
            />
          }
        >
          <Route index element={<StudentEnroll />} />
        </Route>
      </Route>

      <Route path="teachers">
        {/* Not Implemented Yet */}
        <Route index element={<NotFound />} />

        <Route
          path="new/:id"
          element={
            <FetchGuard
              fetcher={({ id }: { id: string }) => getTeacherEnroll(id)}
              failed={<Unauthorized />}
            />
          }
        >
          <Route index element={<TeacherEnroll />} />
        </Route>
      </Route>

      {/* Temporary Routes */}
      <Route path="temp">
        <Route index element={<Temp />} />
        <Route path="sessions">
          <Route path="track">
            <Route index element={<SessionTrack />} />
            <Route
              path=":id"
              element={
                <FetchGuard
                  fetcher={({ id }: { id: string }) => getSessionTrack(id)}
                  failed={<Unauthorized />}
                />
              }
            >
              <Route index element={<SessionTrack />} />
            </Route>
          </Route>
          <Route path="report" element={<SessionReport />} />
        </Route>
      </Route>

      {/* Dev Space */}
      <Route path="ui" element={<FetchGuard fetcher={pass(IS_DEV)} />}>
        <Route index element={<MainUI />} />
        <Route path="form" element={<FormUI />} />
        <Route path="sandbox" element={<SandboxUI />} />
      </Route>

      {/* Redirect From Root Landing Page */}
      <Route element={<UserGuard redirect="/reach-out" />}>
        <Route index element={<Navigate replace to={"admin"} />} />
      </Route>

      {/* Non Existing Pages */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
