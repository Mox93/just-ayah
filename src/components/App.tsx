import { Suspense } from "react";
import { Navigate, Routes, Route } from "react-router-dom";

import Courses from "../pages/Courses";
import Curriculum from "../pages/Curriculum";
import Entrance from "../pages/Entrance";
import Home from "../pages/Home";
import NewCourse from "../pages/NewCource";
import NewStudent from "../pages/NewStudent";
import NewTeacher from "../pages/NewTeacher";
import StudentProfile from "../pages/StudentProfile";
import Students from "../pages/Students";
import TeacherProfile from "../pages/TeacherProfile";
import Teachers from "../pages/Teachers";
import useAuthGuard from "../utils/authGuard";
import StudentForm from "./StudentForm";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          {...useAuthGuard({
            path: "/",
            to: "/enter",
            element: <Home />,
          })}
        >
          <Route path="courses" element={<Courses />}>
            <Route path=":id" element={<Curriculum />} />
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
        <Route path="join" element={<NewStudent />} />
        <Route
          {...useAuthGuard({
            path: "enter",
            guestOnly: true,
            element: <Entrance />,
          })}
        />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Suspense fallback="...is loading">
      <App />
    </Suspense>
  );
}
