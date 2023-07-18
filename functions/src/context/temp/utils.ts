import { TEMP_DELETED_PATH } from "@config";
import { db } from "@lib";

export async function moveToDeleted(path: string) {
  const sourceRef = db.doc(path);
  const targetRef = db.collection(TEMP_DELETED_PATH).doc();

  return db.runTransaction(async (t) => {
    const data = (await t.get(sourceRef)).data();

    if (data) {
      t.create(targetRef, { data, path, dateCreated: new Date() });
      t.delete(sourceRef);
    }
  });
}
