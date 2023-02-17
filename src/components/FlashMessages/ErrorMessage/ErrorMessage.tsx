import { Trans } from "react-i18next";

import { useMessageT } from "hooks";
import FlashCard from "../FlashCard";

interface ErrorMessageProps {
  error?: any;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  const msg = useMessageT("flash");

  return (
    <FlashCard state="error">
      <Trans t={msg} i18nKey="error">
        <h2 className="accent">Something Went Wrong!</h2>
        <p>Please try again later.</p>
      </Trans>

      {error && (
        <div className="code">
          <code>{JSON.stringify(error, null, 2)}</code>
        </div>
      )}
    </FlashCard>
  );
}
