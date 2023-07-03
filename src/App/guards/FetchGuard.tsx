import { ReactElement, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";

import Await from "components/Await";
import LoadingPopup from "components/LoadingPopup";
import { useApplyOnce, useGlobalT } from "hooks";
import { Location } from "models";
import { IS_DEV } from "models/config";
import { NotFound } from "pages/Fallback";

interface FetchGuardProps {
  fetcher: Function;
  loading?: ReactElement;
  notFound?: ReactElement;
  failed?: ReactElement;
}

export default function FetchGuard({
  fetcher,
  loading,
  notFound = <NotFound />,
  failed = <NotFound />,
}: FetchGuardProps) {
  const glb = useGlobalT();
  const [fetchState, setFetchState] = useState<
    "loading" | "success" | "failed" | "notFound"
  >("loading");
  const params = useParams();
  const location = useLocation() as Location<{} | undefined>;

  useApplyOnce(() => {
    Promise.resolve(fetcher(params))
      .then((data: any) => {
        if (data) location.state = { ...location.state, data };
        setFetchState(data ? "success" : "notFound");
        if (IS_DEV) console.log("Fetch Completed", data);
      })
      .catch((error) => {
        if (IS_DEV) console.log("Fetch Failed", error);
        setFetchState("failed");
      });
  });

  switch (fetchState) {
    case "loading":
      return loading ?? <LoadingPopup message={glb("loading")} />;
    case "success":
      return (
        <Await>
          <Outlet />
        </Await>
      );
    case "notFound":
      return notFound;
    case "failed":
      return failed;
    default:
      return <>Something went wrong!</>;
  }
}
