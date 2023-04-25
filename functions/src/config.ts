import { defineString } from "@lib";

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

// UTILS
function generateDocPath<P extends string>(path: P) {
  return <S extends string>(subpath: S): `${P}/${S}` => `${path}/${subpath}`;
}

function generateIndexPath<N extends string>(name: N): `/meta/${N}Index` {
  return `/meta/${name}Index`;
}

// GOOGLE_SHEETS
export const DATA_SHEET_ID = defineString("DATA_SHEET_ID").value();
export const LOGS_SHEET_ID = defineString("LOGS_SHEET_ID").value();
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
export const TEMP_PATH = "/meta/temp";
export const TEMP_SESSION_TRACK_PATH = <I extends string>(
  id: I
): `${typeof TEMP_PATH}/sessionTrack/${I}` => `${TEMP_PATH}/sessionTrack/${id}`;
export const TEMP_DELETED_PATH = `${TEMP_PATH}/deleted` as const;
