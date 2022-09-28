import { ReactElement, VFC } from "react";
import { Outlet } from "react-router-dom";

import Header from "components/Header";
import { useHeader } from "hooks";
import { cn } from "utils";

interface MainLayoutProps {
  name?: string;
  title?: string;
  actions?: ReactElement;
}

const MainLayout: VFC<MainLayoutProps> = ({ name, title, actions }) => {
  useHeader({ title });

  return (
    <main className={cn("MainLayout", name)}>
      <Header title={title}>{actions}</Header>
      <Outlet />
    </main>
  );
};

export default MainLayout;
