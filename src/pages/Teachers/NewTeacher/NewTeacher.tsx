import { lazy } from "react";

import { NewUserTabs } from "components/NewUser";
import { useTeacherContext } from "context";
import { usePageT } from "hooks";
import Teacher from "models/teacher";

const TeacherForm = lazy(() => import("../TeacherForm"));

export default function NewTeacher() {
  const tch = usePageT("teacher");

  const { addTeacher } = useTeacherContext();

  return (
    <NewUserTabs
      variant="teacher"
      title={tch("newTeachers")}
      UserForm={TeacherForm as any} // HACK for some reason it's rejecting the type
      addUser={addTeacher}
      UserClass={Teacher.DB}
    />
  );
}
