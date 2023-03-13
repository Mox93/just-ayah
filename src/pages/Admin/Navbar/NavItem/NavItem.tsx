import { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import { useNavT } from "hooks";
import { cn } from "utils";

import HiddenLabel from "../HiddenLabel";

interface NavItemProps {
  icon: ReactElement;
  label: string;
  url: string;
}

export default function NavItem({ icon, label, url }: NavItemProps) {
  const navT = useNavT();

  return (
    <NavLink
      to={url}
      className={({ isActive }) => cn("NavItem", { isActive })}
      end
    >
      <HiddenLabel label={<h4>{navT(label)}</h4>}>{icon}</HiddenLabel>
    </NavLink>
  );
}
