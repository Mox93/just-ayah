import { TEACHER_DOC_PATH, TEACHER_INDEX_PATH } from "../config";
import { document } from "../lib";
import { indexing, merge } from "../utils";

export const onTeacherDocWrite = document(
  TEACHER_DOC_PATH("{documentId}")
).onWrite(merge(indexing(TEACHER_INDEX_PATH)));
