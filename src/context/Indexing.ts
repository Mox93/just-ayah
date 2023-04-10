import { doc } from "firebase/firestore";
import { useCallback } from "react";
import { createStore, StoreApi } from "zustand";

import { RequestStateMap, UserIndex, userIndexListSchema } from "models/blocks";
import { CourseIndex, courseIndexListSchema } from "models/course";
import { db } from "services/firebase";

import { onSnapshotFactory, SnapshotState, useLazySnapshot } from "./_internal";

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
  const [getter, status] = useLazySnapshot(indexStore);

  return [
    useCallback(() => {
      const index = getter();
      return modifier ? modifier(index) : index;
    }, [getter, modifier]),
    status,
  ];
}
