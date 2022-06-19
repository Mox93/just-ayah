import { FC, ReactNode, useEffect } from "react";

import { CloseButton } from "components/Buttons";
import Container from "components/Container";
import { useDirT } from "hooks";
import { cn } from "utils";

export interface PopupProps {
  children?: ReactNode;
  dismissible?: boolean;
  close?: () => void;
}

const Popup: FC<PopupProps> = ({ children, close, dismissible }) => {
  const dirT = useDirT();

  useEffect(() => {
    if (!dismissible) return;

    const handelEscape = (event: KeyboardEvent) =>
      event.key === "Escape" && close!();

    close && document.addEventListener("keyup", handelEscape);

    return () => close && document.removeEventListener("keyup", handelEscape);
  }, []);

  return (
    <div className="Popup" dir={dirT}>
      <div
        className="background"
        onClick={() => dismissible && close && close()}
      />
      <Container
        variant="card"
        className={cn({ closable: close }, "foreground")}
        header={close && <CloseButton onClick={close} />}
      >
        {children}
      </Container>
    </div>
  );
};

export default Popup;
