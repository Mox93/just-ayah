import { createStore, useStore } from "zustand";

import { Fader } from "components/Animation";
import Await from "components/Await";

import Loading, { LoadingProps } from "./Loading";
import Modal, { ModalProps } from "./Modal";
import Toast, { ToastProps } from "./Toast";

const OPEN = { isOpen: true, isVisible: true } as const;
const CLOSE = { isOpen: false, isVisible: false } as const;
const CLOSING = { isOpen: false, isVisible: true } as const;

type OpenModalOptions = Pick<ModalProps, "center" | "dir"> &
  (
    | { closable: true; dismissible?: boolean }
    | { closable?: never; dismissible?: false }
  );

type MaybeProps<TProps, WithActions extends boolean = true> = {
  isOpen: boolean;
} & ({ isVisible: true; props: TProps } | { isVisible: false; props?: never }) &
  (WithActions extends true
    ? {
        actions: {
          close: VoidFunction;
          unmount: VoidFunction;
        };
      }
    : { actions?: never });

interface PopupStore {
  modal: MaybeProps<ModalProps>;
  toast: MaybeProps<ToastProps>;
  loading: MaybeProps<LoadingProps, false>;
}

const popupStore = createStore<PopupStore>()((set, get) => {
  const createActions = (key: keyof PopupStore) => ({
    close: () => {
      const { isVisible, props, actions } = get()[key];
      if (isVisible) set({ [key]: { ...CLOSING, props, actions } });
    },
    unmount: () =>
      set(({ [key]: { actions } }) => ({ [key]: { ...CLOSE, actions } })),
  });

  return {
    modal: {
      ...CLOSE,
      actions: createActions("modal"),
    },
    toast: {
      ...CLOSE,
      actions: createActions("toast"),
    },
    loading: CLOSE,
  };
});

export function openModal(
  children: ModalProps["children"],
  { closable, ...props }: OpenModalOptions = {}
) {
  popupStore.setState(({ modal: { actions } }) => ({
    modal: {
      ...OPEN,
      actions,
      props: {
        ...props,
        children,
        ...(closable ? actions : { unmount: actions.unmount }),
      } as ModalProps,
    },
  }));
}

export const closeModal = popupStore.getState().modal.actions.close;

export function openToast(
  message: ToastProps["message"], // TODO change to children
  props: Pick<ToastProps, "dir" | "variant"> & {
    duration?: number;
  } = {}
) {
  popupStore.setState(({ toast: { actions } }) => ({
    toast: {
      ...OPEN,
      actions,
      props: {
        ...props,
        message,
        floating: true,
        close: actions.close,
      },
    },
  }));
}

export const closeToast = popupStore.getState().toast.actions.close;

export function startLoading(
  message?: LoadingProps["message"] // TODO change to children
) {
  popupStore.setState({ loading: { ...OPEN, props: { message } } });
}

export function stopLoading() {
  return popupStore.setState({ loading: CLOSE });
}

export function Popup() {
  return (
    <>
      <ShowModal />
      <ShowToast />
      <ShowLoading />
    </>
  );
}

function ShowModal() {
  const { props, isOpen, isVisible } = usePopupStore("modal");

  return <Await>{isVisible && <Modal {...props!} isOpen={isOpen} />}</Await>;
}

function ShowToast() {
  const {
    props,
    isOpen,
    actions: { close, unmount },
  } = usePopupStore("toast");

  return (
    <Await>
      <Fader
        isOpen={isOpen}
        expand
        move
        anchorPoint="top"
        afterFadeOut={unmount}
      >
        <Toast {...props!} close={close} />
      </Fader>
    </Await>
  );
}

function ShowLoading() {
  const { props, isOpen } = usePopupStore("loading");
  return <Await>{isOpen && <Loading {...props} />}</Await>;
}

function usePopupStore<K extends keyof PopupStore>(key: K) {
  return useStore(popupStore, (state) => state[key]);
}
