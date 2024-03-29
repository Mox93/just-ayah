import ReactJson from "react-json-view";

import { Button } from "components/Buttons";
import { ErrorMessage } from "components/FlashMessages";
import { openModal } from "context";
import { useLoading } from "hooks";
import SuccessMessage from "temp/SuccessMessage";

import { refreshMetaData, useMetaData } from "../api";

export default function Temp() {
  const metaData = useMetaData();

  const [refresh, isLoading] = useLoading((stopLoading) => {
    refreshMetaData()
      .then(() =>
        openModal(<SuccessMessage />, { center: true, closable: true })
      )
      .catch((error) =>
        openModal(<ErrorMessage error={error} />, {
          center: true,
          closable: true,
        })
      )
      .finally(stopLoading);
  });

  return (
    <div className="MetaData" dir="ltr">
      <Button onClick={refresh} isLoading={isLoading}>
        refresh
      </Button>
      {metaData ? <ReactJson src={metaData} name="metaData" collapsed /> : null}
    </div>
  );
}
