import { forwardRef, InputHTMLAttributes } from "react";

import { ReactComponent as AcceptedIcon } from "assets/icons/success-svgrepo-com.svg";
import { ReactComponent as IdleIcon } from "assets/icons/minus-circle-svgrepo-com.svg";
import { ReactComponent as InvalidIcon } from "assets/icons/block-svgrepo-com.svg";
import { Button } from "components/Buttons";
import { openModal, closeModal } from "context";
import { useMessageT } from "hooks";
import { cn, mergeCallbacks, pass } from "utils";

import TermsOfServicePopup from "./TermsOfServicePopup";

const ICONS = {
  invalid: <InvalidIcon className="icon" />,
  accepted: <AcceptedIcon className="icon" />,
  idle: <IdleIcon className="icon" />,
};

const COLOR_MAP = {
  invalid: "danger",
  accepted: "success",
  idle: "gray",
} as const;

export type TermsStatus = "idle" | "invalid" | "accepted";

interface TermsOfServiceProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "type" | "hidden" | "ref"
  > {
  url: string;
  status?: TermsStatus;
  onAccept?: (url: string) => void;
}

export default forwardRef<HTMLInputElement, TermsOfServiceProps>(
  function TermsOfService({ url, status = "idle", onAccept, ...props }, ref) {
    const msg = useMessageT();

    return (
      <>
        <input {...props} value={url} type="checkbox" ref={ref} hidden />
        <Button
          variant={`${COLOR_MAP[status]}-text`}
          className={cn("TermsOfService", status)}
          iconButton
          onClick={() =>
            openModal(
              <TermsOfServicePopup
                url={url}
                onAccept={mergeCallbacks(
                  // pass(setStatus, "accepted"),
                  pass(onAccept, url),
                  closeModal
                )}
              />,
              {
                center: true,
                closable: true,
                dismissible: true,
                dir: "rtl",
              }
            )
          }
        >
          {ICONS[status]}
          {msg("termsOfService")}
        </Button>
      </>
    );
  }
);
