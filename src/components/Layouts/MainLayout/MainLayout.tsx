import { ReactElement } from "react";
import { Outlet } from "react-router-dom";

import { Await } from "components/Await";
import Header from "components/Header";
import { useHeader } from "hooks";
import { cn } from "utils";

interface MainLayoutProps {
  name?: string;
  title?: string;
  actions?: ReactElement;
}

export default function MainLayout({ name, title, actions }: MainLayoutProps) {
  useHeader({ title });

  return (
    <main className={cn("MainLayout", name)}>
      <Header title={title}>{actions}</Header>
      <Await subject={title}>
        <Outlet />
      </Await>
    </main>
  );
}
