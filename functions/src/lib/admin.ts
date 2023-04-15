import * as admin from "firebase-admin";

export { FieldValue, Timestamp } from "firebase-admin/firestore";

export const auth = admin.auth();
export const db = admin.firestore();
