import { doc } from "firebase/firestore";
import { useCallback, useMemo } from "react";
import { createStore, StoreApi, useStore } from "zustand";

import {
  requestStateMap,
  RequestStateMap,
  UserIndex,
  userIndexListSchema,
} from "models/blocks";
import { CourseIndex, courseIndexListSchema } from "models/course";
import { db } from "services/firebase";

import { onSnapshotFactory, SnapshotState } from "./_internal";

export function useStudentIndex(sort?: (index: UserIndex[]) => UserIndex[]) {
  return useIndex(studentIndexStore, sort);
}

export function useTeacherIndex(sort?: (index: UserIndex[]) => UserIndex[]) {
  return useIndex(teacherIndexStore, sort);
}

export function useCourseIndex(sort?: (index: CourseIndex[]) => CourseIndex[]) {
  return useIndex(courseIndexStore, sort);
}

// TODO we need to figure out where to use this
export function indexUnsubscribe() {
  studentIndexStore.getState().unsubscribe?.();
  teacherIndexStore.getState().unsubscribe?.();
  courseIndexStore.getState().unsubscribe?.();
}

/********************\
|*** INDEX STORES ***|
\********************/

const studentIndexStore = createStore(
  onSnapshotFactory(doc(db, "meta", "studentIndex"), userIndexListSchema, [])
);

const teacherIndexStore = createStore(
  onSnapshotFactory(doc(db, "meta", "teacherIndex"), userIndexListSchema, [])
);

const courseIndexStore = createStore(
  onSnapshotFactory(doc(db, "meta", "courseIndex"), courseIndexListSchema, [])
);

/********************\
|*** HOOK FACTORY ***|
\********************/

function useIndex<T>(
  indexStore: StoreApi<SnapshotState<T>>,
  modifier?: (index: T) => T
): [() => T, RequestStateMap] {
  const subscribe = useStore(indexStore, (state) => state.subscribe);
  const state = useStore(indexStore, (state) => state.state);
  const index = useStore(indexStore, (state) => state.data);

  return [
    useCallback(() => {
      subscribe();
      return modifier ? modifier(index) : index;
    }, [index, modifier, subscribe]),
    useMemo(() => requestStateMap(state), [state]),
  ];
}
