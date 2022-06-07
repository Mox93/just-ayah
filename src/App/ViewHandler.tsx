import { VFC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Admin from "pages/Admin";
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
  NewStudent,
} from "pages/Students";
import NotFound from "pages/NotFound";
import SignIn from "pages/SignIn";
import { TeacherList, TeacherProfile, Teachers } from "pages/Teachers";
import MainUI from "pages/UI/Main";
import FormUI from "pages/UI/Form";

import AuthGuard from "./AuthGuard";
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

  return (
    <Routes>
      <Route path="/">
        {/* Admin */}
        <Route element={<AuthGuard redirect="/sign-in" />}>
          <Route path="admin" element={<Admin />}>
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

        {/* Public */}
        <Route element={<AuthGuard redirect="/admin" guestOnly />}>
          <Route path="sign-in" element={<SignIn />} />
        </Route>

        <Route path="reach-out" element={<NewCustomer />} />
        <Route path="enroll" element={<NewStudent />} />

        <Route path="ui">
          <Route index element={<MainUI />} />
          <Route path="form" element={<FormUI />} />
        </Route>

        <Route element={<AuthGuard redirect="/reach-out" />}>
          <Route index element={<Navigate replace to={"admin"} />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default ViewHandler;
