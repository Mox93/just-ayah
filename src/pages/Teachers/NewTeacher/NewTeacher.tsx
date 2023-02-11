import { VFC } from "react";

import { NewUserTabs } from "components/NewUser";
import { useTeacherContext } from "context";
import { usePageT } from "hooks";
import Teacher from "models/teacher";

import TeacherForm from "../TeacherForm";

interface NewTeacherProps {}

const NewTeacher: VFC<NewTeacherProps> = () => {
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
};

export default NewTeacher;
