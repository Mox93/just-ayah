import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";

interface StudentsProps {}

const Students: FunctionComponent<StudentsProps> = () => {
  return (
    <div>
      <h1>Students</h1>
      <Outlet />
    </div>
  );
};

export default Students;
