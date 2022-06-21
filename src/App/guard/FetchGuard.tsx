import { ReactElement, useEffect, useState, VFC } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";

import LoadingPopup from "components/LoadingPopup";
import { useGlobalT } from "hooks";
import NotFound from "pages/NotFound";
import { pass } from "utils";

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
  const _loading = loading ?? <LoadingPopup message={glb("loading")} />;

  useEffect(() => {
    Promise.resolve(fetcher(params))
      .then((data: any) => {
        location.state = { ...(location.search as any), data };
        setFetchState(data ? "success" : "notFound");
        // console.log("Fetch Succeeded", data);
      })
      .catch((error) => {
        // console.log("Fetch Failed", error);
        setFetchState("failed");
      });
  }, []);

  switch (fetchState) {
    case "loading":
      return _loading;
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