import { Navigate, RouteProps } from "react-router-dom";

import { useAuth } from "../context/Auth";

interface ProtectProps extends RouteProps {}

const useProtect = ({ element, path, ...rest }: ProtectProps): RouteProps => {
  const { authorized } = useAuth();

  return {
    ...rest,
    element: authorized(path) ? element : <Navigate to="/enter" />,
    path,
  };
};

export default useProtect;
