import { FieldValue, db } from "../lib";
import { DBUpdateHandler } from "../types";

export function syncTerms(targetPath: string): DBUpdateHandler {
  return (change) => {
    // TODO get updated termsUrl
    const {
      termsUrl: [oldTermsUrl],
    } = change.before.data();
    const {
      termsUrl: [newTermsUrl],
    } = change.after.data();

    // Check for no change in termsUrl
    if (oldTermsUrl === newTermsUrl) {
      return null;
    }

    const collRef = db.collection(targetPath);
    const query = collRef.where("enroll.awaiting", "==", true);

    return db.runTransaction(async (t) => {
      // Get all awaiting enroll documents
      const enrolls = await t.get(query);

      // Replace the termsUrl with the new one
      enrolls.forEach(({ id }) =>
        t.update(collRef.doc(id), {
          "enroll.termsUrl": newTermsUrl || FieldValue.delete(),
        })
      );
    });
  };
}
