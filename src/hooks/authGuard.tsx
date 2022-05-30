import { Navigate, RouteProps } from "react-router-dom";

import { useAuthContext } from "context";

interface authGuardProps extends RouteProps {
  guestOnly?: boolean;
  to: string;
}

const useAuthGuard = ({
  element,
  path,
  guestOnly = false,
  to,
  ...rest
}: authGuardProps): RouteProps => {
  const { authorized } = useAuthContext();

  const [authCase, noAuthCase] = guestOnly
    ? [<Navigate to={to} />, element]
    : [element, <Navigate to={to} />];

  return {
    ...rest,
    element: authorized(path) ? authCase : noAuthCase,
    path,
  };
};

export default useAuthGuard;