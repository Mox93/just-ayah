import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useState,
} from "react";
import { omit } from "utils";

import Popup, { PopupProps } from "./Popup.component";

type ShowPopup = (content: ReactNode, closable?: boolean) => void;
type UpdatePopup = (props: PopupProps) => void;
type ClosePopup = () => void;

interface PopupContext {
  showPopup: ShowPopup;
  updatePopup: UpdatePopup;
  closePopup: ClosePopup;
}

const popupContext = createContext<PopupContext>({
  showPopup: omit,
  updatePopup: omit,
  closePopup: omit,
});

interface PopupProviderProps {}

export const PopupProvider: FunctionComponent<PopupProviderProps> = ({
  children,
}) => {
  const [props, setProps] = useState<PopupProps>({});
  const [isOpen, setIsOpen] = useState(false);

  const showPopup: ShowPopup = (
    content: ReactNode,
    closable: boolean = true
  ) => {
    setProps({ children: content, ...(closable && { close: closePopup }) });
    setIsOpen(true);
  };

  const updatePopup: UpdatePopup = (props) => {
    setProps((state) => ({ ...state, ...props }));
  };

  const closePopup: ClosePopup = () => setIsOpen(false);

  return (
    <popupContext.Provider value={{ showPopup, closePopup, updatePopup }}>
      {children}
      {isOpen && <Popup {...props} />}
    </popupContext.Provider>
  );
};

export const usePopupContext = () => useContext(popupContext);
