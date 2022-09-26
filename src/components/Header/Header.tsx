import { FC } from "react";

import Logo from "assets/icons/logo.svg";
import { cn, toTitle } from "utils";

interface HeaderProps {
  title?: string;
  className?: string;
}

const Header: FC<HeaderProps> = ({ className, title, children }) => {
  return (
    <div className={cn("Header", className)}>
      <div className="wrapper">
        {title && <h2 className="title followSidebar">{toTitle(title)}</h2>}
        {children && <div className="actions">{children}</div>}
      </div>
      <img src={Logo} alt="just ayah logo" className="logo" />
    </div>
  );
};

export default Header;
