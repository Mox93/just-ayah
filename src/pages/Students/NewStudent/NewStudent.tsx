import { lazy } from "react";

import { NewUserTabs } from "components/NewUser";
import { useStudentContext } from "context";
import { usePageT } from "hooks";
import Student from "models/student";

const StudentForm = lazy(() => import("../StudentForm"));

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
