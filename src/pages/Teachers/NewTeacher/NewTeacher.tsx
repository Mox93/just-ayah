import { NewUserTabs } from "components/NewUser";
import { useTeacherContext } from "context";
import { usePageT } from "hooks";
import Teacher from "models/teacher";

import TeacherForm from "../TeacherForm";

export default function NewTeacher() {
  const tch = usePageT("teacher");

  const { addTeacher } = useTeacherContext();

  return (
    <NewUserTabs
      variant="teacher"
      title={tch("newTeachers")}
      UserForm={TeacherForm}
      addUser={addTeacher}
      UserClass={Teacher.DB}
    />
  );
}
