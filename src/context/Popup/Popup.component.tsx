import { FunctionComponent, ReactNode, useEffect } from "react";

import Card from "components/Card";
import { cn } from "utils";
import { useDirT } from "utils/translation";
import { CloseButton } from "components/Buttons";

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
      <Card className={cn({ closable: close }, "foreground")}>
        {close && <CloseButton onClick={close} />}
        {children}
      </Card>
    </div>
  );
};

export default Popup;
