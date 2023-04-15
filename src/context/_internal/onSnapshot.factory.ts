import {
  DocumentData,
  DocumentReference,
  onSnapshot,
} from "firebase/firestore";
import { useCallback, useMemo } from "react";
import { Schema, ZodTypeDef } from "zod";
import { StateCreator, StoreApi, useStore } from "zustand";
import { shallow } from "zustand/shallow";

import { ERROR } from "models";
import { RequestState, RequestStateMap, requestStateMap } from "models/blocks";
import { IS_DEV } from "models/config";

export interface SnapshotState<T> {
  data: T;
  state: RequestState;
  subscribe: VoidFunction;
  unsubscribe?: VoidFunction;
}

export default function onSnapshotFactory<T, I>(
  docRef: DocumentReference<DocumentData>,
  schema: Schema<T, ZodTypeDef, I>,
  defaultData: T
): StateCreator<SnapshotState<T>, [], [], SnapshotState<T>> {
  let isSubscribed = false;

  return (set) => ({
    data: defaultData,
    state: "idle",
    subscribe: () => {
      if (isSubscribed) return;

      isSubscribed = true;

      set({ state: "loading" });

      const unsubscribe = onSnapshot(docRef, {
        next: (snapshot) => {
          const result = schema.safeParse(snapshot.data());

          if (!result.success) {
            if (IS_DEV) console.log(ERROR, result.error);

            set({ state: "failure" });

            return;
          }

          if (IS_DEV) console.log("GOT DATA", docRef.path, result.data);

          set({ data: result.data, state: "success" });
        },
      });

      set({
        unsubscribe: () => {
          isSubscribed = false;

          unsubscribe();

          if (IS_DEV) console.log("UNSUBSCRIBED", docRef.path);

          set({ state: "idle" });
        },
      });
    },
  });
}

/********************\
|*** HOOK FACTORY ***|
\********************/

function useLazySnapshot<T>(
  indexStore: StoreApi<SnapshotState<T>>
): [() => T, RequestStateMap];
function useLazySnapshot<T, U>(
  indexStore: StoreApi<SnapshotState<T>>,
  selector: (data: T) => U
): [() => U | undefined, RequestStateMap];
function useLazySnapshot<T, U>(
  indexStore: StoreApi<SnapshotState<T>>,
  selector?: (data: T) => U
): [() => T | U, RequestStateMap] {
  const subscribe = useStore(indexStore, (state) => state.subscribe);
  const state = useStore(indexStore, (state) => state.state);
  const data = useStore(
    indexStore,
    (state) => (selector ? selector(state.data) : state.data),
    shallow
  );

  return [
    useCallback(() => {
      subscribe();
      return data;
    }, [data, subscribe]),
    useMemo(() => requestStateMap(state), [state]),
  ];
}

export { useLazySnapshot };
