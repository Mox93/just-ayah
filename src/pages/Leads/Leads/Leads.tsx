import { Outlet } from "react-router-dom";

import { useSetHeaderProps } from "context";
import { usePageT } from "hooks";

export default function Leads() {
  const pgT = usePageT("lead");

  useSetHeaderProps({ title: pgT("title") });

  return <Outlet />;
}
