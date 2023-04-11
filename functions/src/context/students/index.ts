import {
  DOC_ID_CARD,
  STUDENT_COLLECTION_PATH,
  STUDENT_DOC_PATH,
  STUDENT_INDEX_PATH,
  STUDENT_META_PATH,
} from "@config";
import { document } from "@lib";
import { userIndexing, merge, syncTerms } from "@utils";

import { studentTeacherSync } from "./studentTeacherSync";

export const onStudentDocWrite = document(
  STUDENT_DOC_PATH(DOC_ID_CARD)
).onWrite(merge(userIndexing(STUDENT_INDEX_PATH), studentTeacherSync));

export const onStudentMetaUpdate = document(STUDENT_META_PATH).onUpdate(
  merge(syncTerms(STUDENT_COLLECTION_PATH))
);
