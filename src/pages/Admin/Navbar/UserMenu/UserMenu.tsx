import { ReactComponent as SettingsIcon } from "assets/icons/settings-svgrepo-com.svg";
import { ReactComponent as LogoutIcon } from "assets/icons/turn-off-svgrepo-com.svg";
import { ReactComponent as ProfileIcon } from "assets/icons/user-svgrepo-com.svg";
import { Button } from "components/Buttons";
import Container from "components/Container";
import Ellipsis from "components/Ellipsis";
import { Avatar } from "components/Icons";
import { useAuthContext } from "context";
import { useDropdown, useGlobalT } from "hooks";
import { Link } from "react-router-dom";

import HiddenLabel from "../HiddenLabel/HiddenLabel";

export default function UserMenu() {
  const glb = useGlobalT();

  const { user, signOut } = useAuthContext();
  const { displayName, email, photoURL } = user || {};

  const { driverRef, drivenRef, dropdownWrapper } = useDropdown<
    HTMLElement,
    HTMLDivElement
  >({
    className: "UserMenu",
    onClick: "toggle",
    anchorPoint: "bottom-start",
    sideMounted: true,
  });

  const avatar = <Avatar url={photoURL} />;

  const label = (e1 = "h5", e2 = "h6") => (
    <div>
      {displayName && (
        <Ellipsis className="displayName" Component={e1} dir="auto">
          {displayName}
        </Ellipsis>
      )}
      {email && (
        <Ellipsis className="email" Component={e2} dir="ltr">
          {email}
        </Ellipsis>
      )}
    </div>
  );

  return dropdownWrapper(
    <HiddenLabel
      ref={driverRef}
      Component="button"
      className="keepFocusOutline"
      label={label()}
    >
      {avatar}
    </HiddenLabel>,
    <Container
      ref={drivenRef}
      variant="menu"
      header={
        <>
          {avatar}
          {label("h3", "h5")}
        </>
      }
    >
      <Link className="navLink" to="/admin/account">
        <ProfileIcon className="icon" />
        {glb("myAccount")}
      </Link>
      <Link className="navLink" to="/admin/settings">
        <SettingsIcon className="icon" />
        {glb("settings")}
      </Link>
      <Button variant="danger-text" className="logout" onClick={signOut}>
        <LogoutIcon className="icon" />
        {glb("logout")}
      </Button>
    </Container>
  );
}
