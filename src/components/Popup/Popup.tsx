import { FunctionComponent, ReactNode } from "react";
import { cn } from "utils";

export interface PopupProps {
  children?: ReactNode;
  visible?: boolean;
  close?: () => void;
}

const Popup: FunctionComponent<PopupProps> = ({
  children,
  visible = true,
  close,
}) => {
  return visible ? (
    <div className="Popup">
      <div className="background" onClick={close} />
      <div className={cn({ closable: Boolean(close) }, "card container")}>
        {close && (
          <button className="closeButton" onClick={close}>
            x
          </button>
        )}
        {children}
      </div>
    </div>
  ) : null;
};

export default Popup;
