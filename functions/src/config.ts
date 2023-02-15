export const STUDENT_COLLECTION_PATH = "/students";
export const STUDENT_DOC_PATH = (subpath: string) =>
  `${STUDENT_COLLECTION_PATH}/${subpath}`;
export const STUDENT_INDEX_PATH = "/meta/studentIndex";

export const TEACHER_COLLECTION_PATH = "/teachers";
export const TEACHER_DOC_PATH = (subpath: string) =>
  `${TEACHER_COLLECTION_PATH}/${subpath}`;
export const TEACHER_INDEX_PATH = "/meta/teacherIndex";
