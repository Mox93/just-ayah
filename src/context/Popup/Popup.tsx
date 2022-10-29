import {
  createContext,
  FC,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { omit } from "utils";

import Modal, { ModalProps } from "./Modal";
import Toast, { ToastProps, ToastVariant } from "./Toast";

type OpenModal = (
  children: ReactNode,
  options?: {
    closable?: boolean;
    dismissible?: boolean;
    center?: boolean;
  }
) => void;

type OpenToast = (
  message: string | ReactElement,
  options?: {
    variant?: ToastVariant;
    duration?: number;
  }
) => void;

interface PopupContext {
  openModal: OpenModal;
  closeModal: () => void;
  openToast: OpenToast;
  closeToast: () => void;
}

const popupContext = createContext<PopupContext>({
  openModal: omit,
  closeModal: omit,
  openToast: omit,
  closeToast: omit,
});

interface PopupProviderProps {}

export const PopupProvider: FC<PopupProviderProps> = ({ children }) => {
  const [{ modal: popup, toast }, dispatch] = useReducer(reduce, {
    modal: { isOpen: false },
    toast: { isOpen: false },
  });

  const closeModal = useCallback(() => dispatch({ type: "closeModal" }), []);

  const openModal = useCallback<OpenModal>(
    (children, { closable, ...props } = {}) =>
      dispatch({
        type: "openModal",
        payload: {
          ...props,
          children,
          ...(closable && { close: closeModal }),
        },
      }),
    [closeModal]
  );

  const closeToast = useCallback(() => dispatch({ type: "closeToast" }), []);

  const openToast = useCallback<OpenToast>(
    (message, { duration = 7e3, ...props } = {}) => {
      dispatch({
        type: "openToast",
        payload: {
          ...props,
          message,
          close: closeToast,
        },
      });

      setTimeout(closeToast, duration);
    },
    [closeToast]
  );

  return (
    <popupContext.Provider
      value={{ openModal, closeModal, openToast, closeToast }}
    >
      {children}
      {popup.isOpen && <Modal {...popup.props} />}
      {toast.isOpen && <Toast {...toast.props} />}
    </popupContext.Provider>
  );
};

export const usePopupContext = () => useContext(popupContext);

type PropsOrNot<TProps> = { props: TProps; isOpen: true } | { isOpen: false };

type State = {
  modal: PropsOrNot<ModalProps>;
  toast: PropsOrNot<ToastProps>;
};

type Action =
  | {
      type: "openModal";
      payload: PropsWithChildren<ModalProps>;
    }
  | {
      type: "closeModal";
    }
  | {
      type: "openToast";
      payload: ToastProps;
    }
  | {
      type: "closeToast";
    };

const reduce = (state: State, action: Action): State => {
  switch (action.type) {
    case "openModal":
      return {
        ...state,
        modal: { isOpen: true, props: action.payload },
      };

    case "closeModal":
      return {
        ...state,
        modal: { isOpen: false },
      };

    case "openToast":
      return {
        ...state,
        toast: { isOpen: true, props: { ...action.payload, floating: true } },
      };

    case "closeToast":
      return {
        ...state,
        toast: { isOpen: false },
      };
  }
};
