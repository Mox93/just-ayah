import { VFC } from "react";

import { NewUserTabs } from "components/NewUser";
import { useStudentContext } from "context";
import { usePageT } from "hooks";
import Student from "models/student";

import StudentForm from "../StudentForm";

interface NewStudentProps {}

const NewStudent: VFC<NewStudentProps> = () => {
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
};

export default NewStudent;
