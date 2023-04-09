import { ReactElement, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

import Container from "components/Container";
import { SpinningArrow } from "components/Icons";
import { useSidebarStore } from "context";
import { useDropdown, useNavT } from "hooks";
import { cn } from "utils";

import HiddenLabel from "../HiddenLabel";
import { NavSubitems, useHasActivePath } from "../Navbar.utils";

interface NavGroupProps {
  icon: ReactElement;
  label: string;
  subitems: NavSubitems;
}

export default function NavGroup({ icon, label, subitems }: NavGroupProps) {
  const navT = useNavT();

  const isFullyExpanded = useSidebarStore((state) => state.isFullyExpanded);

  const [hasActivePath, setHasActivePath] = useState(false);

  const _hasActivePath = useHasActivePath(
    () => subitems.map(({ url }) => url),
    setHasActivePath
  );

  const [isOpen, setIsOpen] = useState(_hasActivePath);

  const isCollapsed = !isFullyExpanded || !isOpen;

  const { driverRef, drivenRef, dropdownWrapper, toggle, close } = useDropdown<
    HTMLElement,
    HTMLDivElement
  >({ className: "NavGroup", sideMounted: true });

  const navLinks = useMemo(
    () =>
      subitems.map(({ url, label, name: child }) => (
        <NavLink
          key={child}
          to={url}
          className={({ isActive }) => cn("navChild", { isActive })}
          onClick={close}
        >
          <h4 className="label">{navT(label)}</h4>
        </NavLink>
      )),
    [close, navT, subitems]
  );

  return (
    <>
      {dropdownWrapper(
        <HiddenLabel
          ref={driverRef}
          Component="button"
          className={cn({ isActive: hasActivePath && isCollapsed })}
          label={
            <div>
              <h4>{navT(label)}</h4>
              <SpinningArrow variant="expand" isOpen={isOpen} />
            </div>
          }
          onClick={() =>
            isFullyExpanded ? setIsOpen((state) => !state) : toggle()
          }
        >
          {icon}
        </HiddenLabel>,
        <Container
          ref={drivenRef}
          className={cn("subitemsMenu")}
          variant="menu"
          header={<h4 className="label">{navT(label)}</h4>}
        >
          {navLinks}
        </Container>
      )}
      {isCollapsed || <div className={cn("subitems")}>{navLinks}</div>}
    </>
  );
}
