import * as functions from "firebase-functions";

import { db, FieldValue } from "../utils";

interface PhoneNumber {
  code: string;
  number: string;
}

const parsePhoneNumber = ({ code, number }: PhoneNumber) => `${code}-${number}`;

export const studentIndexing = functions.firestore
  .document("/students/{documentId}")
  .onWrite((change, context) => {
    const id = context.params.documentId;

    // Checks for a delete
    if (!change.after.exists) {
      return db.doc("meta/studentIndex").update({ [id]: FieldValue.delete() });
    }

    const oldData = change.before.data();
    const newData = change.after.data();

    const oldPhoneNumber = new Set<string>(
      (oldData?.phoneNumber || []).map(parsePhoneNumber)
    );
    const newPhoneNumber = new Set<string>(
      (newData?.phoneNumber || []).map(parsePhoneNumber)
    );

    // Checks for an irrelevant update
    if (
      newData?.awaitEnroll ||
      (oldData?.firstName === newData?.firstName &&
        oldData?.middleName === newData?.middleName &&
        oldData?.lastName === newData?.lastName &&
        oldPhoneNumber.size === newPhoneNumber.size &&
        Array.from(oldPhoneNumber)?.every((number) =>
          newPhoneNumber.has(number)
        ))
    ) {
      return null;
    }

    const name = [newData?.firstName, newData?.middleName, newData?.lastName]
      .filter((val) => !!val)
      .join(" ");
    const phoneNumber = Array.from(newPhoneNumber);

    return db.doc("meta/studentIndex").update({ [id]: { name, phoneNumber } });
  });
