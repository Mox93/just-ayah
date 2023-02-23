import { ReactElement, useEffect } from "react";

import { CloseButton } from "components/Buttons";
import { useDirT } from "hooks";
import { cn, documentEventFactory, oneOf, pass } from "utils";

export type ModalProps = {
  children: ReactElement;
  dismissible?: boolean;
  center?: boolean;
  dir?: string;
  close?: VoidFunction;
};

export default function Modal({
  children,
  close,
  dismissible,
  center,
  dir,
}: ModalProps) {
  const dirT = useDirT();

  useEffect(() => {
    if (!dismissible) return;

    const [addEvents, removeEvents] = documentEventFactory({
      keyup: ({ key }) => oneOf(key, ["Escape"]) && close?.(),
    });

    addEvents();

    return removeEvents;
  }, [dismissible, close]);

  return (
    <div className="Modal" dir={dir || dirT}>
      <div
        className="background"
        onClick={pass(dismissible && close && close)}
      />
      <div className={cn("foreground", { center })}>
        <div className="body">
          {children}
          {close && <CloseButton onClick={close} dir={dir} />}
        </div>
      </div>
    </div>
  );
}
