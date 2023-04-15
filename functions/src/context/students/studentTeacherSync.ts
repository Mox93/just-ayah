import { DOC_ID_VAR, TEACHER_DOC_PATH } from "@config";
import { db, FieldValue } from "@lib";
import { DBEventHandler } from "@types";
import { getFullName } from "@utils";

export const studentTeacherSync: DBEventHandler = (change, context) => {
  const oldData = change.before.data();
  const newData = change.after.data();

  const oldTeacherId = oldData?.meta?.teacher?.id;
  const newTeacherId = newData?.meta?.teacher?.id;

  // Check form no change in teacher id
  if (oldTeacherId === newTeacherId) {
    return null;
  }

  const id = context.params[DOC_ID_VAR];
  const path = `meta.students.${id}`;

  // Checks for a delete
  if (!change.after.exists && oldTeacherId)
    return db
      .doc(TEACHER_DOC_PATH(oldTeacherId))
      .update({ [path]: FieldValue.delete() });

  const actions = [];

  // Add student to new teacher
  if (newTeacherId)
    actions.push(
      db.doc(TEACHER_DOC_PATH(newTeacherId)).update({
        [path]: { name: getFullName(newData) },
      })
    );

  // Remove student from old teacher
  if (oldTeacherId)
    actions.push(
      db.doc(TEACHER_DOC_PATH(oldTeacherId)).update({
        [path]: FieldValue.delete(),
      })
    );

  return actions;
};
