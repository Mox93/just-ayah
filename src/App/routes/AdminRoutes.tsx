import { VFC } from "react";
import { Route, Routes } from "react-router-dom";

import { Admin, SignIn } from "pages/Admin";
import { Courses, NewCourse, CourseProfile } from "pages/Courses";
import { Students, StudentProfile, StudentEnroll } from "pages/Students";
import { NewTeacher, TeacherProfile, Teachers } from "pages/Teachers";
import UserGuard from "../guard/UserGuard";

interface AdminRoutesProps {}

const AdminRoutes: VFC<AdminRoutesProps> = () => {
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
            <Route path="new" element={<StudentEnroll />} />
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

export default AdminRoutes;