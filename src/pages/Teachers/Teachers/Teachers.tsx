import { lazy } from "react";
import { Outlet } from "react-router-dom";

import { useTeacherIndex, useSetHeaderProps, useTeacherContext } from "context";
import { usePageT } from "hooks";

const NewTeacher = lazy(() => import("../NewTeacher"));

export default function Teachers() {
  const pgT = usePageT("teacher");
  const { getTeacher } = useTeacherContext();
  const [dataIndex, indexState] = useTeacherIndex();

  useSetHeaderProps({
    title: pgT("title"),
    dataIndex,
    indexState,
    onSearchSelect: ({ value: { id } }) =>
      // TODO Redirect to profile page
      getTeacher(id).then((data) => console.log(data)),
    newEntityButton: <NewTeacher />,
  });

  return <Outlet />;
}
