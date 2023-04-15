import { COURSES_DOC_PATH, DOC_ID_CARD } from "@config";
import { document } from "@lib";
import { merge } from "@utils";

import { indexing } from "./indexing";

export const onCourseDocWrite = document(COURSES_DOC_PATH(DOC_ID_CARD)).onWrite(
  merge(indexing)
);
