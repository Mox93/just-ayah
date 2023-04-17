import { ReactElement, Ref } from "react";

import { CloseButton } from "components/Buttons";
import { cn, oneOf, pass } from "utils";
import { useEventListener } from "hooks";

export type ModalProps = {
  children: ReactElement;
  className?: string;
  dismissible?: boolean;
  center?: boolean;
  dir?: string;
  close?: VoidFunction;
  bodyRef?: Ref<HTMLDivElement>;
};

export default function Modal({
  children,
  close,
  dismissible,
  center,
  dir,
  bodyRef,
  className,
}: ModalProps) {
  useEventListener(
    document,
    dismissible
      ? {
          keyup: ({ key }) => oneOf(key, ["Escape"]) && close?.(),
        }
      : {}
  );

  return (
    <div className={cn("Modal", className)} dir={dir}>
      <div className="background" onClick={pass(dismissible && close)} />
      <div className={cn("foreground", { center })}>
        <div className="body" ref={bodyRef}>
          {children}
          {close && <CloseButton onClick={close} />}
        </div>
      </div>
    </div>
  );
}
