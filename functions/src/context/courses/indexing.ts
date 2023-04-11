import { COURSES_INDEX_PATH, DOC_ID_VAR } from "../../config";
import { db, FieldValue } from "../../lib";
import { DBEventHandler } from "../../types";

export const indexing: DBEventHandler = (change, context) => {
  const id = context.params[DOC_ID_VAR];

  // Checks for a delete
  if (!change.after.exists) {
    return db.doc(COURSES_INDEX_PATH).update({ [id]: FieldValue.delete() });
  }

  const oldData = change.before.data();
  const newData = change.after.data()!;

  // Checks for an irrelevant update
  if (
    oldData?.name === newData.name &&
    oldData?.sessionCount === newData.sessionCount
  ) {
    return null;
  }

  const { name, sessionCount } = newData;

  return db.doc(COURSES_INDEX_PATH).update({ [id]: { name, sessionCount } });
};
