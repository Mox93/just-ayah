import { Navigate, Outlet, To, useLocation } from "react-router-dom";

import { Await } from "components/Await";
import { useAuthContext } from "context";

interface UserGuardProps {
  redirect: To;
  guestOnly?: boolean;
}

export default function UserGuard({ redirect, guestOnly }: UserGuardProps) {
  const { authenticated } = useAuthContext();
  const location = useLocation();

  const nav = <Navigate to={redirect} state={{ from: location }} replace />;
  const view = (
    <Await>
      <Outlet />
    </Await>
  );
  const [userCase, guestCase] = guestOnly ? [nav, view] : [view, nav];

  return authenticated(location) ? userCase : guestCase;
}
