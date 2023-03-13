import { Outlet } from "react-router-dom";

import { Await } from "components/Await";
import { useHeader } from "hooks";
import { cn } from "utils";

import Header, { HeaderProps } from "./Header";

interface DashboardLayoutProps extends HeaderProps {
  className?: string;
}

export default function DashboardLayout({
  className,
  title,
  ...props
}: DashboardLayoutProps) {
  useHeader({ title });

  return (
    <main className={cn("DashboardLayout followSidebar", className)}>
      <Header {...props} title={title} />
      <Await subject={title}>
        <Outlet />
      </Await>
    </main>
  );
}
