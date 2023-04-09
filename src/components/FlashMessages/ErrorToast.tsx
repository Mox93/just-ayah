import { useMessageT } from "hooks";
import { Trans } from "react-i18next";

interface ErrorToastProps {
  error?: any;
  message?: string;
}

export default function ErrorToast({
  error,
  message = "something went wrong!",
}: ErrorToastProps) {
  const msg = useMessageT("toast");

  return (
    <>
      <Trans t={msg} i18nKey="error">
        <b>Error:</b> {message}
      </Trans>
      {error && <code>{error}</code>}
    </>
  );
}
