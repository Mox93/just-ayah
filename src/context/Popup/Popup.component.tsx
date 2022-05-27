import { FunctionComponent, ReactNode, useEffect } from "react";

import { CloseButton } from "components/Buttons";
import Container from "components/Container";
import { useDirT } from "hooks";
import { cn } from "utils";

export interface PopupProps {
  children?: ReactNode;
  close?: () => void;
}

const Popup: FunctionComponent<PopupProps> = ({ children, close }) => {
  const dir = useDirT();

  const handelEscape = (event: KeyboardEvent) =>
    event.key === "Escape" && close!();

  useEffect(() => {
    close && document.addEventListener("keyup", handelEscape);

    return () => close && document.removeEventListener("keyup", handelEscape);
  }, []);

  return (
    <div className="Popup" dir={dir}>
      <div className="background" onClick={close} />
      <Container
        variant="card"
        className={cn({ closable: close }, "foreground")}
      >
        {close && <CloseButton onClick={close} />}
        {children}
      </Container>
    </div>
  );
};

export default Popup;
