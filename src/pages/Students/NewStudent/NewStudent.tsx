import { NewUserTabs } from "components/NewUser";
import { useStudentContext } from "context";
import { usePageT } from "hooks";
import Student from "models/student";

import StudentForm from "../StudentForm";

export default function NewStudent() {
  const stu = usePageT("student");

  const { addStudent } = useStudentContext();

  return (
    <NewUserTabs
      variant="student"
      title={stu("newStudents")}
      UserForm={StudentForm}
      addUser={addStudent}
      UserClass={Student.DB}
    />
  );
}
