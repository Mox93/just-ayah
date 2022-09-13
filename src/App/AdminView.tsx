import { VFC } from "react";
import { Route, Routes } from "react-router-dom";

import Admin from "pages/Admin";
import { Courses, NewCourse, CourseProfile } from "pages/Courses";
import SignIn from "pages/SignIn";
import { Students, StudentProfile, StudentForm } from "pages/Students";
import { NewTeacher, TeacherProfile, Teachers } from "pages/Teachers";
import UserGuard from "./guard/UserGuard";

interface AdminViewProps {}

const AdminView: VFC<AdminViewProps> = () => {
  return (
    <Routes>
      <Route element={<UserGuard redirect="sign-in" />}>
        <Route path="/" element={<Admin />}>
          <Route path="courses" element={<Courses />}>
            <Route path=":id" element={<CourseProfile />} />
            <Route path="new" element={<NewCourse />} />
          </Route>
          <Route path="students" element={<Students />}>
            <Route path=":id" element={<StudentProfile />} />
            {/* <Route path="new" element={<StudentForm />} /> */}
          </Route>
          <Route path="teachers" element={<Teachers />}>
            <Route path=":id" element={<TeacherProfile />} />
            <Route path="new" element={<NewTeacher />} />
          </Route>
        </Route>
      </Route>

      <Route element={<UserGuard redirect="/" guestOnly />}>
        <Route path="/sign-up" element={<SignIn />} />
      </Route>
    </Routes>
  );
};

export default AdminView;
