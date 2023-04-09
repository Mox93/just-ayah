import { memo } from "react";
import { Outlet } from "react-router-dom";

import { useSetHeaderProps } from "context";
import { usePageT } from "hooks";

import NewCourse from "../NewCourse";

export default memo(function Courses() {
  const pgT = usePageT("course");

  useSetHeaderProps({ title: pgT("title"), newEntityButton: <NewCourse /> });

  return <Outlet />;
});
