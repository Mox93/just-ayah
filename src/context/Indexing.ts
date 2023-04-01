import { doc, onSnapshot } from "firebase/firestore";
import { useCallback, useMemo } from "react";
import { Schema, ZodTypeDef } from "zod";
import { create, StateCreator, StoreApi, UseBoundStore } from "zustand";

import { ERROR } from "models";
import {
  requestStateMap,
  RequestStateMap,
  UserIndex,
  userIndexListSchema,
} from "models/blocks";
import { IS_DEV } from "models/config";
import { CourseIndex, courseIndexListSchema } from "models/course";
import { db } from "services/firebase";

export function useStudentIndex(sort?: (index: UserIndex[]) => UserIndex[]) {
  return useIndex(useStudentIndexStore, sort);
}

export function useTeacherIndex(sort?: (index: UserIndex[]) => UserIndex[]) {
  return useIndex(useTeacherIndexStore, sort);
}

export function useCourseIndex(sort?: (index: CourseIndex[]) => CourseIndex[]) {
  return useIndex(useCourseIndexStore, sort);
}

export function indexUnsubscribe() {
  useStudentIndexStore.getState().unsubscribe?.();
  useTeacherIndexStore.getState().unsubscribe?.();
  useCourseIndexStore.getState().unsubscribe?.();
}

/********************\
|*** INDEX_STORES ***|
\********************/

const useStudentIndexStore = create(
  indexStateCreator("studentIndex", userIndexListSchema)
);

const useTeacherIndexStore = create(
  indexStateCreator("teacherIndex", userIndexListSchema)
);

const useCourseIndexStore = create(
  indexStateCreator("courseIndex", courseIndexListSchema)
);

/********************\
|*** HOOK_FACTORY ***|
\********************/

function useIndex<T>(
  storeHook: UseBoundStore<StoreApi<IndexState<T>>>,
  modifier?: (index: T[]) => T[]
): [() => T[], RequestStateMap] {
  const subscribe = storeHook((state) => state.subscribe);
  const state = storeHook((state) => state.state);
  const index = storeHook((state) => state.index);

  return [
    useCallback(() => {
      subscribe();
      return modifier ? modifier(index) : index;
    }, [index, modifier, subscribe]),
    useMemo(() => requestStateMap(state), [state]),
  ];
}

/*********************\
|*** INDEX_FACTORY ***|
\*********************/

interface IndexState<T> {
  index: T[];
  state: "idle" | "loading" | "success" | "failure";
  subscribe: () => void;
  unsubscribe?: VoidFunction;
}

function indexStateCreator<T, I>(
  docName: string,
  indexSchema: Schema<T[], ZodTypeDef, I>
): StateCreator<IndexState<T>, [], [], IndexState<T>> {
  let isSubscribed = false;

  return (set) => ({
    index: [],
    state: "idle",
    subscribe: () => {
      if (isSubscribed) return;

      isSubscribed = true;

      set({ state: "loading" });

      const unsubscribe = onSnapshot(doc(db, "meta", docName), {
        next: (snapshot) => {
          const result = indexSchema.safeParse(snapshot.data());

          if (!result.success) {
            if (IS_DEV) console.log(ERROR, result.error);

            set({ state: "failure" });

            return;
          }

          if (IS_DEV) console.log("GOT DATA", docName, result.data);

          set({ index: result.data, state: "success" });
        },
      });

      set({
        unsubscribe: () => {
          isSubscribed = false;

          unsubscribe();

          if (IS_DEV) console.log("UNSUBSCRIBED", docName);

          set({ state: "idle" });
        },
      });
    },
  });
}
