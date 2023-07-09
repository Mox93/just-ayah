import { useMemo } from "react";
import { Trans } from "react-i18next";

import { ReactComponent as CopyIcon } from "assets/icons/copy-svgrepo-com.svg";
import { Button } from "components/Buttons";
import { useCopyToClipboard } from "context";
import { useMessageT } from "hooks";

import FlashCard from "./FlashCard";
import { cn, pass } from "utils";

interface ErrorMessageProps {
  error?: any;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  const fls = useMessageT("flash");
  const msg = useMessageT();

  const copied = useCopyToClipboard((state) => state.copied);
  const copyToClipboard = useCopyToClipboard((state) => state.copyToClipboard);

  const errorMessage = useMemo(
    () => error && JSON.stringify(error, null, 2),
    [error]
  );

  return (
    <FlashCard state="error">
      <Trans t={fls} i18nKey="error">
        <h2 className="accent">Something Went Wrong!</h2>
        <p>Please try again later.</p>
      </Trans>

      {errorMessage && (
        <div className="code" dir="ltr">
          <Button
            className="action"
            variant="primary-ghost"
            size="small"
            iconButton
            onClick={pass(copyToClipboard, errorMessage)}
          >
            <CopyIcon className="icon" />
          </Button>

          <div className={cn("headsUp", { active: copied === errorMessage })}>
            {msg("copied")}
          </div>
          <pre>{errorMessage}</pre>
        </div>
      )}
    </FlashCard>
  );
}
