import { ReactElement, useEffect, useState, VFC } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";

import LoadingPopup from "components/LoadingPopup";
import { useGlobalT } from "hooks";
import NotFound from "pages/NotFound";
import { devOnly, pass } from "utils";

interface FetchGuardProps {
  fetcher?: Function;
  loading?: ReactElement;
  notFound?: ReactElement;
  failed?: ReactElement;
}

const FetchGuard: VFC<FetchGuardProps> = ({
  fetcher = pass({}),
  loading,
  notFound = <NotFound />,
  failed = <NotFound />,
}) => {
  const glb = useGlobalT();
  const [fetchState, setFetchState] = useState<
    "loading" | "success" | "failed" | "notFound"
  >("loading");
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    Promise.resolve(fetcher(params))
      .then((data: any) => {
        location.state = { ...(location.search as any), data };
        setFetchState(data ? "success" : "notFound");
        devOnly(() => console.log("Fetch Succeeded", data));
      })
      .catch((error) => {
        devOnly(() => console.log("Fetch Failed", error));
        setFetchState("failed");
      });
  }, []);

  switch (fetchState) {
    case "loading":
      return loading ?? <LoadingPopup message={glb("loading")} />;
    case "success":
      return <Outlet />;
    case "notFound":
      return notFound;
    case "failed":
      return failed;
    default:
      return <>Something went wrong!</>;
  }
};

export default FetchGuard;
