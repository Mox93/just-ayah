import { useMessageT } from "hooks";
import { Trans } from "react-i18next";

interface ErrorToastProps {
  i18nKey: string;
  message: string;
}

export default function ErrorToast({ i18nKey, message }: ErrorToastProps) {
  const msg = useMessageT("toast");

  return (
    <>
      <Trans t={msg} i18nKey={i18nKey}>
        <b>Success:</b> {message}
      </Trans>
    </>
  );
}
