import { VFC } from "react";
import { Outlet } from "react-router-dom";

interface CoursesProps {}

const Courses: VFC<CoursesProps> = () => {
  return (
    <div>
      <h1>Courses</h1>
      <Outlet />
    </div>
  );
};

export default Courses;
