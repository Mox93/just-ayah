import { FC, useEffect } from "react";

import { CloseButton } from "components/Buttons";
import { useDirT } from "hooks";
import { cn } from "utils";

export type ModalProps = {
  dismissible?: boolean;
  center?: boolean;
  dir?: string;
  close?: VoidFunction;
};

const Modal: FC<ModalProps> = ({
  children,
  close,
  dismissible,
  center,
  dir,
}) => {
  const dirT = useDirT();

  useEffect(() => {
    if (!dismissible) return;

    const handelEscape = (event: KeyboardEvent) =>
      event.key === "Escape" && close!();

    close && document.addEventListener("keyup", handelEscape);

    return () => close && document.removeEventListener("keyup", handelEscape);
  }, [dismissible, close]);

  return (
    <div className="Modal" dir={dir || dirT}>
      <div
        className="background"
        onClick={() => dismissible && close && close()}
      />
      <div className={cn("foreground", { center })}>
        <div className="body">
          {children}
          {close && <CloseButton onClick={close} dir={dir || dirT} />}
        </div>
      </div>
    </div>
  );
};

export default Modal;
