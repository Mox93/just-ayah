import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { assert } from "utils";

import Loading, { LoadingProps } from "./Loading";
import Modal, { ModalProps } from "./Modal";
import Toast, { ToastProps } from "./Toast";
import { Fader, useFader } from "components/Animation";

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

  const closeModal = useRef(() => dispatch({ type: "closeModal" }));

  const openModal = useRef<OpenModal>((children, { closable, ...props } = {}) =>
    dispatch({
      type: "openModal",
      payload: {
        ...props,
        children,
        ...(closable && { close: closeModal.current }),
      },
    })
  );

  const closeToast = useRef(() => dispatch({ type: "closeToast" }));

  const openToast = useRef<OpenToast>((message, props) => {
    dispatch({
      type: "openToast",
      payload: {
        ...props,
        message,
        close: closeToast.current,
      },
    });
  });

  const startLoading = useRef<StartLoading>((message) =>
    dispatch({ type: "startLoading", payload: { message } })
  );

  const stopLoading = useRef(() => dispatch({ type: "stopLoading" }));

  return (
    <popupContext.Provider
      value={{
        openModal: openModal.current,
        closeModal: closeModal.current,
        openToast: openToast.current,
        closeToast: closeToast.current,
        startLoading: startLoading.current,
        stopLoading: stopLoading.current,
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
  const { modal, toast } = usePopupOutletContext();
  const { closeModal, closeToast } = usePopupContext();

  const [modalIsOpen, setModalIsOpen] = useState(modal.isOpen);
  const [toastIsOpen, setToastIsOpen] = useState(toast.isOpen);

  useEffect(() => {
    setModalIsOpen(modal.isOpen);
  }, [modal.isOpen]);

  useEffect(() => {
    setToastIsOpen(toast.isOpen);
  }, [toast.isOpen]);

  const [ref, isVisible] = useFader<HTMLDivElement>({
    isOpen: modalIsOpen,
    expand: true,
    // duration: 1e4,
    afterFadeOut: closeModal,
  });

  const modalCloser = useMemo(
    () => modal.props?.close && (() => setModalIsOpen(false)),
    [modal.props?.close]
  );
  const toastCloser = useMemo(
    () => toast.props?.close && (() => setToastIsOpen(false)),
    [toast.props?.close]
  );

  return (
    <>
      {isVisible && (
        <Modal {...modal.props!} bodyRef={ref} close={modalCloser} />
      )}
      <Fader
        isOpen={toastIsOpen}
        expand
        move
        anchorPoint="top"
        // duration={1e4}
        afterFadeOut={closeToast}
      >
        <Toast {...toast.props!} close={toastCloser} />
      </Fader>
    </>
  );
}

function usePopupOutletContext() {
  const context = useContext(popupOutletContext);
  assert(context !== null);
  return context;
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
