import { document } from "../lib";
import { indexing } from "../utils";

export const studentIndexing = document("/students/{documentId}").onWrite(
  indexing("meta/studentIndex")
);
