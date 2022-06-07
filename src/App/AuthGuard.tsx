import { VFC } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthContext } from "context";

interface AuthGuardProps {
  redirect: string;
  guestOnly?: boolean;
}

const AuthGuard: VFC<AuthGuardProps> = ({ redirect, guestOnly }) => {
  const { authorized } = useAuthContext();
  const location = useLocation();

  const nav = <Navigate to={redirect} state={{ from: location }} replace />;
  const outlet = <Outlet />;
  const [authCase, noAuthCase] = guestOnly ? [nav, outlet] : [outlet, nav];

  return authorized(location.pathname) ? authCase : noAuthCase;
};

export default AuthGuard;
