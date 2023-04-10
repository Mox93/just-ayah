import { doc } from "firebase/firestore";
import { createStore } from "zustand";

import { studentMetaSchema } from "models/student";
import { db } from "services/firebase";

import { onSnapshotFactory, useLazySnapshot } from "../_internal";

export function useStudentTermsUrl() {
  return useLazySnapshot(studentMetaStore, (data) => data.termsUrl[0]);
}

/*******************\
|*** META STORES ***|
\*******************/

const studentMetaStore = createStore(
  onSnapshotFactory(doc(db, "meta", "students"), studentMetaSchema, {
    termsUrl: [],
  })
);
