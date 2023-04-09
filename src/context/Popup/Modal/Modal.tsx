import { ReactElement, Ref, useEffect } from "react";

import { CloseButton } from "components/Buttons";
import { cn, documentEventFactory, oneOf, pass } from "utils";

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
  useEffect(() => {
    if (!dismissible) return;

    const [addEvents, removeEvents] = documentEventFactory({
      keyup: ({ key }) => oneOf(key, ["Escape"]) && close?.(),
    });

    addEvents();

    return removeEvents;
  }, [dismissible, close]);

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
