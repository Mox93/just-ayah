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
import useAuthGuard from "utils/authGuard";
import { TeacherList, TeacherProfile, Teachers } from "pages/Teachers";
import MainUI from "pages/UI/Main";
import FormUI from "pages/UI/Form";
import SignIn from "pages/SignIn";

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

  const fallbackNav = <Navigate replace to={"/reach-out"} />;
  const fallbackAdminNav = <Navigate replace to={"/admin"} />;

  return (
    <Routes>
      <Route path="/">
        <Route
          {...useAuthGuard({
            path: "admin",
            to: "/sign-in",
            element: <Admin />,
          })}
        >
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

          {/* Fallback */}
          <Route path="*" element={fallbackAdminNav} />
        </Route>

        <Route
          {...useAuthGuard({
            path: "sign-in",
            to: "/admin",
            guestOnly: true,
            element: <SignIn />,
          })}
        />

        <Route path="reach-out" element={<NewCustomer />} />
        <Route path="enroll" element={<NewStudent />} />

        <Route path="ui">
          <Route index element={<MainUI />} />
          <Route path="form" element={<FormUI />} />
        </Route>

        <Route index element={fallbackNav} />
        <Route path="*" element={fallbackNav} />
      </Route>
    </Routes>
  );
};

export default ViewHandler;
