import { DOC_ID_CARD, STUDENT_DOC_PATH, STUDENT_INDEX_PATH } from "../config";
import { document } from "../lib";
import { userIndexing, merge } from "../utils";
import { studentTeacherSync } from "./studentTeacherSync";

export const onStudentDocWrite = document(
  STUDENT_DOC_PATH(DOC_ID_CARD)
).onWrite(merge(userIndexing(STUDENT_INDEX_PATH), studentTeacherSync));
