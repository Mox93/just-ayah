import { FunctionComponent } from "react";
import StudentList from "./StudentList";

interface StudentsProps {}

const Students: FunctionComponent<StudentsProps> = () => {
  return (
    <div className="students">
      <StudentList />
    </div>
  );
};

export default Students;
