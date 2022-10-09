import { document } from "../lib";
import { indexing } from "../utils";

export const teacherIndexing = document("/teachers/{documentId}").onWrite(
  indexing("meta/teacherIndex")
);
