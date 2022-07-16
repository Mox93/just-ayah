import { FC } from "react";

import { ReactComponent as Logo } from "assets/icons/logo.svg";
import { cn, toTitle } from "utils";

interface HeaderProps {
  title: string;
  className?: string;
}

const Header: FC<HeaderProps> = ({ className, title, children }) => {
  return (
    <div className={cn("Header", className)}>
      <div className="wrapper">
        <h2 className="title followSidebar">{toTitle(title)}</h2>
        {children && <div className="actions">{children}</div>}
      </div>
      <Logo className="logo" />
    </div>
  );
};

export default Header;
