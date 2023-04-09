import Logo from "assets/icons/logo-dark-bg.svg";
import { DropdownButton } from "components/Buttons";
import { useSidebarStore } from "context";
import { useGlobalT } from "hooks";
import { cn } from "utils";

import HiddenLabel from "../HiddenLabel";
import { useNavTree } from "../Navbar.utils";
import NavGroup from "../NavGroup";
import NavItem from "../NavItem";
import UserMenu from "../UserMenu";

export default function Navbar() {
  const glb = useGlobalT();

  const isExpanded = useSidebarStore((state) => state.isExpanded);
  const toggleExpand = useSidebarStore((state) => state.toggleExpand);

  const navTree = useNavTree();

  return (
    <nav className={cn("Navbar", { isExpanded })}>
      <DropdownButton
        size={null}
        variant={"primary-ghost"}
        className="navController"
        onClick={toggleExpand}
        isOpen={isExpanded}
        iconButton
      />
      <HiddenLabel
        className="companyLogo"
        label={<h3 className="companyName">{glb("justAyah")}</h3>}
      >
        <img src={Logo} alt="logo" />
      </HiddenLabel>
      <div className="navigation">
        {navTree.map(({ name, url, subitems, ...props }) =>
          subitems ? (
            <NavGroup key={name} {...{ ...props, subitems }} />
          ) : (
            <NavItem key={name} {...{ ...props, url }} />
          )
        )}
      </div>
      <UserMenu />
    </nav>
  );
}
