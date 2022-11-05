import { VFC } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthContext } from "context";

interface UserGuardProps {
  redirect: string;
  guestOnly?: boolean;
}

const UserGuard: VFC<UserGuardProps> = ({ redirect, guestOnly }) => {
  const { authenticated } = useAuthContext();
  const location = useLocation();

  const nav = <Navigate to={redirect} state={{ from: location }} replace />;
  const [userCase, noUserCase] = guestOnly
    ? [nav, <Outlet />]
    : [<Outlet />, nav];

  return authenticated(location.pathname) ? userCase : noUserCase;
};

export default UserGuard;
