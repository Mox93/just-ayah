import {
  forwardRef,
  InputHTMLAttributes,
  Ref,
  useEffect,
  useState,
} from "react";

import { ReactComponent as AcceptedIcon } from "assets/icons/success-svgrepo-com.svg";
import { ReactComponent as IdleIcon } from "assets/icons/minus-circle-svgrepo-com.svg";
import { ReactComponent as InvalidIcon } from "assets/icons/block-svgrepo-com.svg";
import { Button } from "components/Buttons";
import { usePopupContext } from "context";
import { useMessageT } from "hooks";
import { cn, mergeCallbacks, pass } from "utils";

import TermsOfServicePopup from "./TermsOfServicePopup";

const icons = {
  invalid: InvalidIcon,
  accepted: AcceptedIcon,
  idle: IdleIcon,
};

interface TermsOfServiceProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "type"> {
  url: string;
  isInvalid?: boolean;
  onAccept?: (url: string) => void;
}

export default forwardRef(function TermsOfService(
  { url, isInvalid, onAccept, ...props }: TermsOfServiceProps,
  ref: Ref<HTMLInputElement>
) {
  const msg = useMessageT();

  const [status, setStatus] = useState<"idle" | "invalid" | "accepted">("idle");

  useEffect(() => {
    if (isInvalid) setStatus("invalid");
  }, [isInvalid]);

  const { openModal, closeModal } = usePopupContext();

  const Icon = icons[status];

  return (
    <>
      <input {...props} value={url} type="checkbox" ref={ref} hidden />
      <Button
        variant="plain-text"
        className={cn("TermsOfService", status)}
        iconButton
        onClick={() =>
          openModal(
            <TermsOfServicePopup
              url={url}
              onAccept={mergeCallbacks(
                pass(setStatus, "accepted"),
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
        <Icon className="status" />
        {msg("termsOfService")}
      </Button>
    </>
  );
});
