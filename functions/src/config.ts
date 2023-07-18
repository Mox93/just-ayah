import { defineInt, defineString } from "@lib";

// GENERAL
export const DOC_ID_VAR = "documentId";
export const DOC_ID_CARD = `{${DOC_ID_VAR}}` as const;

// STUDENTS
export const STUDENT_COLLECTION_PATH = "/students";
export const STUDENT_META_PATH = "/meta/students";
export const STUDENT_DOC_PATH = generateDocPath(STUDENT_COLLECTION_PATH);
export const STUDENT_INDEX_PATH = generateIndexPath("student");

// TEACHERS
export const TEACHER_COLLECTION_PATH = "/teachers";
export const TEACHER_DOC_PATH = generateDocPath(TEACHER_COLLECTION_PATH);
export const TEACHER_INDEX_PATH = generateIndexPath("teacher");

// COURSES
export const COURSES_COLLECTION_PATH = "/courses";
export const COURSES_DOC_PATH = generateDocPath(COURSES_COLLECTION_PATH);
export const COURSES_INDEX_PATH = generateIndexPath("course");

// TEMP
export const TEMP_PATH = "/meta/temp";
export const TEMP_SESSION_TRACK_PATH = generateDocPath(
  `${TEMP_PATH}/sessionTrack`
);
export const TEMP_STUDENT_PATH = generateDocPath(`${TEMP_PATH}/students`);
export const TEMP_DELETED_PATH = `${TEMP_PATH}/deleted` as const;

// GOOGLE_SHEETS
export const DATA_SHEET_ID = defineString("DATA_SHEET_ID").value();
export const LOGS_SHEET_ID = defineString("LOGS_SHEET_ID").value();
export const LOGS_RANGE_NAME = defineString("LOGS_RANGE_NAME").value();
export const LOGS_TAB_NAME = defineString("LOGS_TAB_NAME").value();
export const LOGS_TAB_ID = defineInt("LOGS_TAB_ID").value();
export const STUDENT_SHEET_ID = defineString("STUDENT_SHEET_ID").value();
export const STUDENT_RANGE_NAME = defineString("STUDENT_RANGE_NAME").value();
export const META_DATA_RANGES = [
  "staff",
  "subscriptions",
  "monthlySessions",
  "recitationRules",
] as const;
export const CUSTOM_META_DATA_RANGES = [
  "teachers",
  "students",
  "assignedTeachers",
  "courses",
  "chapters",
  "sessionStatus",
] as const;

// UTILS
function generateDocPath<P extends string>(path: P) {
  return <S extends string>(subpath: S) => `${path}/${subpath}` as const;
}

function generateIndexPath<N extends string>(name: N) {
  return `/meta/${name}Index` as const;
}
