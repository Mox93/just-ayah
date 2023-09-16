import { TEMP_DELETED_PATH } from "@config";
import { db } from "@lib";

export async function moveToDeleted(path: string, id: string) {
  const sourceRef = db.collection(path).doc(id);
  const targetRef = db.collection(TEMP_DELETED_PATH).doc();

  return await db.runTransaction(async (t) => {
    const data = (await t.get(sourceRef)).data();

    if (data) {
      await t.create(targetRef, { data, path, id, dateCreated: new Date() });
      await t.delete(sourceRef);
    }
  });
}
