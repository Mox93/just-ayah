import { Navigate, Outlet, useLocation } from "react-router-dom";

import { Await } from "components/Await";
import { useAuthContext } from "context";

interface UserGuardProps {
  redirect: string;
  guestOnly?: boolean;
}

export default function UserGuard({ redirect, guestOnly }: UserGuardProps) {
  const { authenticated } = useAuthContext();
  const location = useLocation();
  const { pathname } = location;

  const nav = <Navigate to={redirect} state={{ from: location }} replace />;
  const view = (
    <Await>
      <Outlet />
    </Await>
  );
  const [userCase, noUserCase] = guestOnly ? [nav, view] : [view, nav];

  return authenticated(pathname) ? userCase : noUserCase;
}
