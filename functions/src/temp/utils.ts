import { TEMP_DELETED_PATH } from "@config";
import { HttpsError, Timestamp, db } from "@lib";

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

interface IsDuplicatedSessionData {
  student?: string;
  date?: string;
}

export function isDuplicatedSession(path: string) {
  return async (data?: IsDuplicatedSessionData) => {
    if (!data || !data.student || !data?.date)
      throw new HttpsError(
        "invalid-argument",
        "Values for 'student' and/or 'date' were not provided!"
      );

    const { student, date: dateString } = data;

    const date = Timestamp.fromDate(new Date(dateString));

    const snapshot = await db
      .collection(path)
      .where("student", "==", student)
      .where("date", "==", date)
      .get();

    if (snapshot.empty) {
      return { duplicated: false };
    }

    const sessions: Record<string, any> = {};

    snapshot.forEach((doc) => {
      sessions[doc.id] = doc.data();
    });

    return { duplicated: true, sessions };
  };
}
