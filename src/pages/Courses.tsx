import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";

interface CoursesProps {}

const Courses: FunctionComponent<CoursesProps> = () => {
  return (
    <div>
      <h1>Courses</h1>
      <Outlet />
    </div>
  );
};

export default Courses;
