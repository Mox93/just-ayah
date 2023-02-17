import { VFC } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Await } from "components/Await";
import { useAuthContext } from "context";
import { Unauthorized } from "pages/Fallback";

const AuthGuard: VFC = () => {
  const { authorized } = useAuthContext();
  const { pathname } = useLocation();

  return <Await>{authorized(pathname) ? <Outlet /> : <Unauthorized />}</Await>;
};

export default AuthGuard;
