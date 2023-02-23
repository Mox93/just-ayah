import { PropsWithChildren } from "react";

import Logo from "assets/icons/logo.svg";
import LanguageSelector from "components/LanguageSelector";
import { useDirT } from "hooks";
import { cn, toTitle } from "utils";

interface HeaderProps extends PropsWithChildren {
  title?: string;
  className?: string;
}

export default function Header({ className, title, children }: HeaderProps) {
  const dirT = useDirT();

  return (
    <div className={cn("Header", className)} dir={dirT}>
      <div className="wrapper">
        {title && <h2 className="title followSidebar">{toTitle(title)}</h2>}
        {children && (
          <div className="actions">
            {children}
            <LanguageSelector />
          </div>
        )}
      </div>
      <img src={Logo} alt="just ayah logo" className="logo" />
    </div>
  );
}
