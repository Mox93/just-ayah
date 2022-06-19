import { VFC } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { useAuthContext } from "context";
import Unauthorized from "pages/Unauthorized";

const AuthGuard: VFC = () => {
  const { authorized } = useAuthContext();
  const location = useLocation();

  return authorized(location.pathname) ? <Outlet /> : <Unauthorized />;
};

export default AuthGuard;
