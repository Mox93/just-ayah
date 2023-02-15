import { STUDENT_DOC_PATH, STUDENT_INDEX_PATH } from "../config";
import { document } from "../lib";
import { indexing, merge } from "../utils";
import { studentTeacherUpdate } from "./studentTeacherUpdate";

export const onStudentDocWrite = document(
  STUDENT_DOC_PATH("{documentId}")
).onWrite(merge(indexing(STUDENT_INDEX_PATH), studentTeacherUpdate));
