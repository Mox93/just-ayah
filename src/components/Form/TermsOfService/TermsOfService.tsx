import {
  forwardRef,
  InputHTMLAttributes,
  Ref,
  useEffect,
  useState,
  VFC,
} from "react";

import { ReactComponent as AcceptedIcon } from "assets/icons/success-svgrepo-com.svg";
import { ReactComponent as IdleIcon } from "assets/icons/minus-circle-svgrepo-com.svg";
import { ReactComponent as InvalidIcon } from "assets/icons/block-svgrepo-com.svg";
import { Button } from "components/Buttons";
import Container from "components/Container";
import { usePopupContext } from "context";
import { useGlobalT, useMessageT } from "hooks";
import { cn } from "utils";

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

const TermsOfService: VFC<TermsOfServiceProps> = (
  { url, isInvalid, onAccept, ...props },
  ref: Ref<HTMLInputElement>
) => {
  const [status, setStatus] = useState<"idle" | "invalid" | "accepted">("idle");

  useEffect(() => {
    if (isInvalid) setStatus("invalid");
  }, [isInvalid]);

  const Icon = icons[status];

  const glb = useGlobalT();
  const msg = useMessageT();

  const { openModal, closeModal } = usePopupContext();

  return (
    <>
      <input {...props} value={url} type="checkbox" ref={ref} hidden />
      <Button
        variant="plain-text"
        className={cn("TermsOfService", status)}
        iconButton
        onClick={() =>
          openModal(
            <Container className="TermsOfService modal">
              {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
              <iframe src={url} allow="autoplay" />
              <Button
                variant="success-solid"
                onClick={() => {
                  setStatus("accepted");
                  onAccept?.(url);
                  closeModal();
                }}
              >
                {glb("acceptTermsOfService")}
              </Button>
            </Container>,
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
};

export default forwardRef(TermsOfService);
