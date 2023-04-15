import { doc } from "firebase/firestore";
import { createStore } from "zustand";

import { teacherMetaSchema } from "models/teacher";
import { db } from "services/firebase";

import { onSnapshotFactory, useLazySnapshot } from "../_internal";

export function useTeacherTermsUrl() {
  return useLazySnapshot(teacherMetaStore, (data) => data.termsUrl[0]);
}

/*******************\
|*** META STORES ***|
\*******************/

const teacherMetaStore = createStore(
  onSnapshotFactory(doc(db, "meta", "teachers"), teacherMetaSchema, {
    termsUrl: [],
  })
);
