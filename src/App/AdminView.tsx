import { FunctionComponent } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import CourseProfile from "pages/Courses/CourseProfile";
import Courses from "pages/Courses";
import NewCourse from "pages/Courses/NewCourse";
import SignUp from "pages/Admin/SignUp";
import Home from "pages/Admin/Home";
import StudentProfile from "pages/Students/StudentProfile";
import Students from "pages/Students";
import NewTeacher from "pages/Teachers/NewTeacher";
import TeacherProfile from "pages/Teachers/TeacherProfile";
import Teachers from "pages/Teachers";
import useAuthGuard from "utils/authGuard";
import StudentForm from "pages/Students/StudentForm";

interface AdminViewProps {}

const AdminView: FunctionComponent<AdminViewProps> = () => {
  return (
    <Routes>
      <Route
        {...useAuthGuard({
          path: "/",
          to: "/sign-up",
          element: <Home />,
        })}
      >
        <Route path="courses" element={<Courses />}>
          <Route path=":id" element={<CourseProfile />} />
          <Route path="new" element={<NewCourse />} />
        </Route>
        <Route path="students" element={<Students />}>
          <Route path=":id" element={<StudentProfile />} />
          <Route path="new" element={<StudentForm />} />
        </Route>
        <Route path="teachers" element={<Teachers />}>
          <Route path=":id" element={<TeacherProfile />} />
          <Route path="new" element={<NewTeacher />} />
        </Route>
      </Route>
      <Route
        {...useAuthGuard({
          path: "/sign-up",
          to: "/",
          guestOnly: true,
          element: <SignUp />,
        })}
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

export default AdminView;
