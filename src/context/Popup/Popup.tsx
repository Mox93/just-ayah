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

import { assert, mergeCallbacks, pass } from "utils";

import Modal, { ModalProps } from "./Modal";
import Network from "./Network";
import Toast, { ToastProps, ToastVariant } from "./Toast";

type OpenModal = (
  children: ReactNode,
  options?: {
    closable?: boolean;
    dismissible?: boolean;
    center?: boolean;
    dir?: string;
  }
) => void;

type OpenToast = (
  message: string | ReactElement,
  options?: {
    variant?: ToastVariant;
    duration?: number;
    dir?: string;
  }
) => void;

interface PopupContext {
  openModal: OpenModal;
  closeModal: VoidFunction;
  openToast: OpenToast;
  closeToast: VoidFunction;
}

const popupContext = createContext<PopupContext | null>(null);

export function usePopupProvider(): [FC, ReactElement] {
  const [{ modal, toast }, dispatch] = useReducer(reduce, {
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
    []
  );

  const closeToast = useCallback(() => dispatch({ type: "closeToast" }), []);

  const openToast = useCallback<OpenToast>(
    (message, { duration = 7e3, ...props } = {}) => {
      const timeoutId = setTimeout(closeToast, duration);

      dispatch({
        type: "openToast",
        payload: {
          ...props,
          message,
          close: mergeCallbacks(closeToast, pass(clearTimeout, timeoutId)),
        },
      });
    },
    []
  );

  return [
    useCallback(
      ({ children }) => (
        <popupContext.Provider
          value={{ openModal, closeModal, openToast, closeToast }}
        >
          {children}
        </popupContext.Provider>
      ),
      []
    ),
    <>
      {modal.isOpen && <Modal {...modal.props} />}
      {toast.isOpen && <Toast {...toast.props} />}
      <Network />
    </>,
  ];
}

export const usePopupContext = () => {
  const context = useContext(popupContext);
  assert(context !== null);
  return context;
};

type PropsOrNot<TProps> =
  | { isOpen: true; props: TProps }
  | { isOpen: false; props?: never };

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
