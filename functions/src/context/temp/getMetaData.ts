import { TEMP_PATH } from "@config";
import { db, onCall } from "@lib";
import { getFreshMetaData, updateMetaData } from "@services";
import { CachedMetaData } from "@types";

export const getMetaData = onCall(async (options) => {
  const { fresh = false } = options || {};

  if (!fresh) {
    const {
      metaData: { ttl, updatedAt, data },
    } = (await db.doc(TEMP_PATH).get()).data() as {
      metaData: CachedMetaData;
    };

    if (updatedAt.toDate().getTime() + ttl > new Date().getTime()) {
      return data;
    }
  }

  const result = await getFreshMetaData();

  await updateMetaData(result);

  return result;
});
