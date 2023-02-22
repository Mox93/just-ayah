import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useReducer,
} from "react";

import { assert, mergeCallbacks } from "utils";

import Loading, { LoadingProps } from "./Loading";
import Modal, { ModalProps } from "./Modal";
import Toast, { ToastProps } from "./Toast";

type OpenModal = (
  children: ModalProps["children"],
  options?: Pick<ModalProps, "center" | "dir" | "dismissible"> & {
    closable?: boolean;
  }
) => void;

type OpenToast = (
  message: ToastProps["message"],
  options?: Pick<ToastProps, "dir" | "variant"> & {
    duration?: number;
  }
) => void;

type StartLoading = (message?: LoadingProps["message"]) => void;

type MaybeProps<TProps> =
  | { isOpen: true; props: TProps }
  | { isOpen: false; props?: never };

interface PopupContext {
  openModal: OpenModal;
  closeModal: VoidFunction;
  openToast: OpenToast;
  closeToast: VoidFunction;
  startLoading: StartLoading;
  stopLoading: VoidFunction;
}

interface PopupOutletContext {
  modal: MaybeProps<ModalProps>;
  toast: MaybeProps<ToastProps>;
}

const popupContext = createContext<PopupContext | null>(null);
const popupOutletContext = createContext<PopupOutletContext | null>(null);

export function PopupProvider({ children }: PropsWithChildren) {
  const [{ loading, ...outletValue }, dispatch] = useReducer(reduce, {
    modal: { isOpen: false },
    toast: { isOpen: false },
    loading: { isOpen: false },
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
          close: mergeCallbacks(closeToast, () => clearTimeout(timeoutId)),
        },
      });
    },
    []
  );

  const startLoading = useCallback<StartLoading>(
    (message) => dispatch({ type: "startLoading", payload: { message } }),
    []
  );

  const stopLoading = useCallback(() => dispatch({ type: "stopLoading" }), []);

  return (
    <popupContext.Provider
      value={{
        openModal,
        closeModal,
        openToast,
        closeToast,
        startLoading,
        stopLoading,
      }}
    >
      <popupOutletContext.Provider value={outletValue}>
        {children}
      </popupOutletContext.Provider>
      {loading.isOpen && <Loading {...loading.props} />}
    </popupContext.Provider>
  );
}

export function PopupOutlet() {
  const context = useContext(popupOutletContext);

  assert(context !== null);

  const { modal, toast } = context;

  return (
    <>
      {modal.isOpen && <Modal {...modal.props} />}
      {toast.isOpen && <Toast {...toast.props} />}
    </>
  );
}

export function usePopupContext() {
  const context = useContext(popupContext);
  assert(context !== null);
  return context;
}

interface State extends PopupOutletContext {
  loading: MaybeProps<LoadingProps>;
}

type Action =
  | { type: "openModal"; payload: ModalProps }
  | { type: "closeModal" }
  | { type: "openToast"; payload: ToastProps }
  | { type: "closeToast" }
  | { type: "startLoading"; payload: LoadingProps }
  | { type: "stopLoading" };

const CLOSE = { isOpen: false } as const;

function OPEN<T>(props: T) {
  return { isOpen: true, props } as const;
}

const reduce = (state: State, action: Action): State => {
  switch (action.type) {
    case "openModal":
      return { ...state, modal: OPEN(action.payload) };

    case "closeModal":
      return { ...state, modal: CLOSE };

    case "openToast":
      return { ...state, toast: OPEN({ ...action.payload, floating: true }) };

    case "closeToast":
      return { ...state, toast: CLOSE };

    case "startLoading":
      return { ...state, loading: OPEN(action.payload) };

    case "stopLoading":
      return { ...state, loading: CLOSE };
  }
};
