import { lazy } from "react";

import { DashboardLayout } from "components/Layouts";
import { useMetaContext, useStudentContext } from "context";
import { usePageT } from "hooks";

const NewStudent = lazy(() => import("../NewStudent"));

export default function Students() {
  const stu = usePageT("student");
  const { studentIndex } = useMetaContext();
  const { getStudent } = useStudentContext();

  return (
    <DashboardLayout
      className="Students"
      title={stu("title")}
      dataIndex={studentIndex}
      onSearchSelect={({ value: { id } }) =>
        getStudent(id).then((data) => console.log(data))
      } // TODO Redirect to profile page
      newEntityElement={<NewStudent />}
    />
  );
}
