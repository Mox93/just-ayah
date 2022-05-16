import { VFC } from "react";
import { Outlet } from "react-router-dom";

interface StudentsProps {}

const Students: VFC<StudentsProps> = () => {
  return (
    <div className="Students">
      <Outlet />
    </div>
  );
};

export default Students;
