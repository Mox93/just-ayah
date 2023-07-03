import { ReactElement, useEffect } from "react";

import { Fader } from "components/Animation";
import { CloseButton } from "components/Buttons";
import { cn, subscribeEvents, oneOf } from "utils";

export type ModalProps = {
  children: ReactElement;
  className?: string;
  center?: boolean;
  isOpen?: boolean;
  dir?: string;
  unmount: VoidFunction;
} & (
  | { close: VoidFunction; dismissible?: boolean }
  | { close?: never; dismissible?: false }
);

export default function Modal({
  children,
  dismissible,
  center,
  isOpen,
  dir,
  className,
  close,
  unmount,
}: ModalProps) {
  useEffect(
    () =>
      subscribeEvents(
        document,
        dismissible
          ? { keyup: ({ key }) => oneOf(key, ["Escape"]) && close?.() }
          : {}
      ),
    [close, dismissible]
  );

  return (
    <div className={cn("Modal", className)} dir={dir}>
      <div className="background" onClick={dismissible ? close : undefined} />
      <div className={cn("foreground", { center })}>
        <Fader expand isOpen={isOpen} afterFadeOut={unmount}>
          <div className="body">
            {children}
            {close && <CloseButton onClick={close} />}
          </div>
        </Fader>
      </div>
    </div>
  );
}
