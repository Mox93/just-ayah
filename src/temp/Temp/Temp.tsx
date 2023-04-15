import ReactJson from "react-json-view";

import { Button } from "components/Buttons";
import { usePopupContext } from "context";
import { useLoading } from "hooks";

import { refreshMetaData, useMetaData } from "../utils";
import SuccessMessage from "temp/SuccessMessage";

export default function Temp() {
  const metaData = useMetaData();

  const { openModal } = usePopupContext();

  const [refresh, isLoading] = useLoading((stopLoading) => {
    refreshMetaData()
      .then(() =>
        openModal(<SuccessMessage />, { center: true, closable: true })
      )
      .finally(stopLoading);
  });

  return (
    <div className="Temp" dir="ltr">
      <Button onClick={refresh} isLoading={isLoading}>
        refresh
      </Button>
      {metaData && <ReactJson src={metaData} name="metaData" collapsed />}
    </div>
  );
}
