import { FunctionComponent, ReactNode } from "react";
import { cn } from "utils";

export interface PopupProps {
  children?: ReactNode;
  close?: () => void;
}

const Popup: FunctionComponent<PopupProps> = ({ children, close }) => {
  return (
    <div className="Popup">
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
