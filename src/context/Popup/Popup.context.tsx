import Popup, { PopupProps } from "./Popup.component";
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useState,
} from "react";
import { omit } from "utils";

type ShowPopup = (content: ReactNode, closable?: boolean) => void;
type UpdatePopup = (props: PopupProps) => void;
type ClosePopup = () => void;

interface PopupContextObj {
  showPopup: ShowPopup;
  updatePopup: UpdatePopup;
  closePopup: ClosePopup;
}

const PopupContext = createContext<PopupContextObj>({
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
    setProps({ children: content, ...(closable ? { close: closePopup } : {}) });
    setIsOpen(true);
  };

  const updatePopup: UpdatePopup = (props) => {
    setProps((state) => ({ ...state, ...props }));
  };

  const closePopup: ClosePopup = () => setIsOpen(false);

  return (
    <PopupContext.Provider value={{ showPopup, closePopup, updatePopup }}>
      {children}
      {isOpen && <Popup {...props} />}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
