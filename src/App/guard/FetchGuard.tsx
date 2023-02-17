import { ReactElement, useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";

import { Await } from "components/Await";
import LoadingPopup from "components/LoadingPopup";
import { useGlobalT } from "hooks";
import { devOnly, omit } from "utils";
import { Location } from "models";
import { NotFound } from "pages/Fallback";

interface FetchGuardProps {
  fetcher?: Function;
  loading?: ReactElement;
  notFound?: ReactElement;
  failed?: ReactElement;
}

export default function FetchGuard({
  fetcher = omit,
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

  useEffect(() => {
    Promise.resolve(fetcher(params))
      .then((data: any) => {
        if (data) location.state = { ...location.state, data };
        setFetchState(data ? "success" : "notFound");
        devOnly(() => console.log("Fetch Succeeded", data))();
      })
      .catch((error) => {
        devOnly(() => console.log("Fetch Failed", error))();
        setFetchState("failed");
      });
  }, []);

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
