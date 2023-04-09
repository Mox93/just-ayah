// GENERAL
export const DOC_ID_VAR = "documentId";
export const DOC_ID_CARD = `{${DOC_ID_VAR}}` as const;

// STUDENTS
export const STUDENT_COLLECTION_PATH = "/students";
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
