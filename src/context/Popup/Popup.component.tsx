import { FunctionComponent, ReactNode, useEffect } from "react";
import { cn } from "utils";
import { useDirT } from "utils/translation";

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
      <div className="Background" onClick={close} />
      <div className={cn({ closable: Boolean(close) }, "Card Container")}>
        {close && (
          <button className="closeButton" onClick={close}>
            x
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Popup;
