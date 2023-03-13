import { lazy } from "react";

import { DashboardLayout } from "components/Layouts";
import { useMetaContext, useTeacherContext } from "context";
import { usePageT } from "hooks";

const NewTeacher = lazy(() => import("../NewTeacher"));

export default function Teachers() {
  const tch = usePageT("teacher");
  const { teacherIndex } = useMetaContext();
  const { getTeacher } = useTeacherContext();

  return (
    <DashboardLayout
      className="Teachers"
      title={tch("title")}
      dataIndex={teacherIndex}
      onSearchSelect={({ value: { id } }) =>
        getTeacher(id).then((data) => console.log(data))
      } // TODO Redirect to profile page
      newEntityElement={<NewTeacher />}
    />
  );
}
