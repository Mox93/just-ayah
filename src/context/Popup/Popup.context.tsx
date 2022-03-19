import Popup, { PopupProps } from "./Popup.component";
import { ProviderProps } from "models";
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useState,
} from "react";
import { omit } from "utils";

interface PopupContextObj {
  showPopup: (content: ReactNode, closable?: boolean) => void;
  closePopup: () => void;
}

const PopupContext = createContext<PopupContextObj>({
  showPopup: omit,
  closePopup: omit,
});

interface PopupProviderProps extends ProviderProps {}

export const PopupProvider: FunctionComponent<PopupProviderProps> = ({
  children,
}) => {
  const [props, setProps] = useState<PopupProps>({});
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);
  const open = (content: ReactNode, closable: boolean = true) => {
    setProps({ children: content, ...(closable ? { close } : {}) });
    setIsOpen(true);
  };

  return (
    <PopupContext.Provider value={{ showPopup: open, closePopup: close }}>
      {children}
      {isOpen && <Popup {...props} />}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
