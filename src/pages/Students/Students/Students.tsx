import { lazy } from "react";
import { Outlet } from "react-router-dom";

import { useStudentIndex, useSetHeaderProps, useStudentContext } from "context";
import { usePageT } from "hooks";

const NewStudent = lazy(() => import("../NewStudent"));

export default function Students() {
  const pgT = usePageT("student");

  const { getStudent } = useStudentContext();
  const [dataIndex, indexState] = useStudentIndex();

  useSetHeaderProps({
    title: pgT("title"),
    dataIndex,
    indexState,
    onSearchSelect: ({ value: { id } }) =>
      // TODO Redirect to profile page
      getStudent(id).then((data) => console.log(data)),
    newEntityButton: <NewStudent />,
  });

  return <Outlet />;
}
