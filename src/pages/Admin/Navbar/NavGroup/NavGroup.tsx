import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import Container from "components/Container";
import { SpinningArrow } from "components/Icons";
import { useSidebarStore } from "context";
import { useDropdown, useNavT } from "hooks";
import { cn } from "utils";

import HiddenLabel from "../HiddenLabel";
import { NavSubitems } from "../Navbar.utils";
import { useDelayClose, useHasActivePath } from "./NavGroup.utils";

interface NavGroupProps {
  icon: ReactElement;
  label: string;
  subitems: NavSubitems;
}

export default function NavGroup({ icon, label, subitems }: NavGroupProps) {
  const navT = useNavT();

  const ref = useRef<HTMLDivElement>(null);

  const isFullyExpanded = useSidebarStore((state) => state.isFullyExpanded);
  const hasActivePath = useHasActivePath(() => subitems.map(({ url }) => url));
  const [isOpen, setIsOpen] = useState(hasActivePath);

  const isCollapsed = !isFullyExpanded || !isOpen;
  const isVisible = useDelayClose(!isCollapsed);

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

  useEffect(() => {
    if (!ref.current) return;

    ref.current.style.setProperty("--items-count", `${subitems.length}`);
  }, [subitems.length, isVisible]);

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
      {isVisible && (
        <div
          className={cn("subitems", {
            expanding: !isCollapsed,
            collapsing: isCollapsed,
          })}
          ref={ref}
        >
          {navLinks}
        </div>
      )}
    </>
  );
}
