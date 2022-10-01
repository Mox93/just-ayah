import { VFC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useStudentContext, useTeacherContext } from "context";
import { Admin, SignIn } from "pages/Admin";
import { CourseList, CourseProfile, Courses } from "pages/Courses";
import {
  CustomerList,
  CustomerProfile,
  Customers,
  NewCustomer,
} from "pages/Customers";
import {
  Students,
  StudentList,
  StudentProfile,
  StudentEnroll,
} from "pages/Students";
import NotFound from "pages/NotFound";
import { TeacherList, TeacherProfile, Teachers } from "pages/Teachers";
import MainUI from "pages/UI/Main";
import FormUI from "pages/UI/Form";

import { UserGuard, FetchGuard, AuthGuard } from "./guard";
import Unauthorized from "pages/Unauthorized";
import { Student } from "models/student";
import { Teacher } from "models/teacher";
import TeacherEnroll from "pages/Teachers/TeacherEnroll";
// import AdminView from "./AdminView";
// import PublicView from "./PublicView";

interface ViewHandlerProps {}

const ViewHandler: VFC<ViewHandlerProps> = () => {
  // const parts = window.location.hostname.split(".");
  // const subdomain = parts.length > 1 ? parts[0] : null;

  // switch (subdomain) {
  //   case "admin":
  //     return <AdminView />;
  //   default:
  //     return <PublicView />;
  // }
  const { getStudent } = useStudentContext();
  const { getTeacher } = useTeacherContext();

  return (
    <Routes>
      <Route path="/">
        {/* Admin */}
        <Route element={<UserGuard redirect="/sign-in" />}>
          <Route path="admin" element={<Admin />}>
            <Route element={<AuthGuard />}>
              {/* Home */}
              <Route index />

              {/* Courses */}
              <Route path="courses" element={<Courses />}>
                <Route index element={<CourseList />} />
                <Route path=":id" element={<CourseProfile />} />
              </Route>

              {/* Leads */}
              <Route path="leads" element={<Customers />}>
                <Route index element={<CustomerList />} />
                <Route path=":id" element={<CustomerProfile />} />
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
        <Route element={<UserGuard redirect="/admin" guestOnly />}>
          <Route path="sign-in" element={<SignIn />} />
        </Route>

        <Route path="reach-out" element={<NewCustomer />} />

        <Route path="students">
          <Route
            path="new/:id"
            element={
              <FetchGuard
                fetcher={({ id }: Student) => getStudent(id)}
                failed={<Unauthorized />}
              />
            }
          >
            <Route index element={<StudentEnroll />} />
          </Route>
        </Route>

        <Route path="teachers">
          <Route
            path="new/:id"
            element={
              <FetchGuard
                fetcher={({ id }: Teacher) => getTeacher(id)}
                failed={<Unauthorized />}
              />
            }
          >
            <Route index element={<TeacherEnroll />} />
          </Route>
        </Route>

        <Route path="ui" element={<FetchGuard fetcher={() => {}} />}>
          <Route index element={<MainUI />} />
          <Route path="form" element={<FormUI />} />
        </Route>

        <Route element={<UserGuard redirect="/reach-out" />}>
          <Route index element={<Navigate replace to={"admin"} />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default ViewHandler;
