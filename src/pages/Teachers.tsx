import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";

interface TeachersProps {}

const Teachers: FunctionComponent<TeachersProps> = () => {
  return (
    <div>
      <h1>Teachers</h1>
      <Outlet />
    </div>
  );
};

export default Teachers;
