import { Outlet } from "react-router-dom";

import { useSetHeaderProps } from "context";
import { usePageT } from "hooks";

export default function Home() {
  const pgT = usePageT("admin");

  useSetHeaderProps({ title: pgT("title") });

  return <Outlet />;
}
