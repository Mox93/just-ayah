import { Route, Routes } from "react-router-dom";

import { Admin, SignIn } from "pages/Admin";
import { Courses, NewCourse, CourseProfile } from "pages/Courses";
import { Students, StudentProfile, StudentEnroll } from "pages/Students";
import { TeacherEnroll, TeacherProfile, Teachers } from "pages/Teachers";
import UserGuard from "../guards/UserGuard";

export default function AdminRoutes() {
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
            <Route path="new" element={<TeacherEnroll />} />
          </Route>
        </Route>
      </Route>

      <Route element={<UserGuard redirect="/" guestOnly />}>
        <Route path="/sign-up" element={<SignIn />} />
      </Route>
    </Routes>
  );
}
