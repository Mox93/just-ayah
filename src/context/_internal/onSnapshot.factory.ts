import {
  DocumentData,
  DocumentReference,
  onSnapshot,
} from "firebase/firestore";
import { Schema, ZodTypeDef } from "zod";
import { StateCreator } from "zustand";

import { ERROR } from "models";
import { RequestState } from "models/blocks";
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
