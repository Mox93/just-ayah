import { createContext, FC, ReactNode, useContext, useState } from "react";
import { omit } from "utils";

import Popup, { PopupProps } from "./Popup.component";

type ShowPopup = (
  children: ReactNode,
  options?: {
    closable?: boolean;
    dismissible?: boolean;
    center?: boolean;
  }
) => void;
type ClosePopup = () => void;

interface PopupContext {
  showPopup: ShowPopup;
  closePopup: ClosePopup;
}

const popupContext = createContext<PopupContext>({
  showPopup: omit,
  closePopup: omit,
});

interface PopupProviderProps {}

export const PopupProvider: FC<PopupProviderProps> = ({ children }) => {
  const [props, setProps] = useState<PopupProps>({});
  const [isOpen, setIsOpen] = useState(false);

  const showPopup: ShowPopup = (children, { closable, ...props } = {}) => {
    setProps({
      children,
      ...(closable && { close: closePopup }),
      ...props,
    });
    setIsOpen(true);
  };

  const closePopup: ClosePopup = () => setIsOpen(false);

  return (
    <popupContext.Provider value={{ showPopup, closePopup }}>
      {children}
      {isOpen && <Popup {...props} />}
    </popupContext.Provider>
  );
};

export const usePopupContext = () => useContext(popupContext);
