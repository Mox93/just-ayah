import { ReactElement, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";

import Await from "components/Await";
import LoadingPopup from "components/LoadingPopup";
import { useApplyOnce, useGlobalT } from "hooks";
import { Location } from "models";
import { IS_DEV } from "models/config";
import { NotFound } from "pages/Fallback";
import { RequestDataProvider } from "context";

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

  const params = useParams();
  const location = useLocation() as Location<{} | undefined>;

  const [fetchState, setFetchState] = useState<
    "loading" | "success" | "failed" | "notFound"
  >("loading");
  const [data, setData] = useState();

  useApplyOnce(() => {
    Promise.resolve(fetcher(params))
      .then((data: any) => {
        if (data) {
          location.state = { ...location.state, data };
          setData(data);
        }
        setFetchState(data ? "success" : "notFound");

        if (IS_DEV) console.log("Fetch Completed", data);
      })
      .catch((error) => {
        setFetchState("failed");

        if (IS_DEV) console.log("Fetch Failed", error);
      });
  });

  switch (fetchState) {
    case "loading":
      return loading ?? <LoadingPopup message={glb("loading")} />;
    case "success":
      return (
        <Await>
          <RequestDataProvider data={data!}>
            <Outlet />
          </RequestDataProvider>
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
