import { DOC_ID_CARD, TEACHER_DOC_PATH, TEACHER_INDEX_PATH } from "../config";
import { document } from "../lib";
import { userIndexing, merge } from "../utils";

export const onTeacherDocWrite = document(
  TEACHER_DOC_PATH(DOC_ID_CARD)
).onWrite(merge(userIndexing(TEACHER_INDEX_PATH)));
