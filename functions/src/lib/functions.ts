import * as functions from "firebase-functions";

import {
  defineInt as _defineInt,
  defineString as _defineString,
} from "firebase-functions/params";
export { HttpsError, onCall } from "firebase-functions/v1/https";

export type Change<T> = functions.Change<T>;
export type EventContext = functions.EventContext;
export type DocumentSnapshot = functions.firestore.DocumentSnapshot;
export type QueryDocumentSnapshot = functions.firestore.QueryDocumentSnapshot;

export const document = functions.firestore.document;
export const user = functions.auth.user;

export function defineInt(...args: Parameters<typeof _defineInt>) {
  return _defineInt(...args) as number & ReturnType<typeof _defineInt>;
}

export function defineString(...args: Parameters<typeof _defineString>) {
  return _defineString(...args) as string & ReturnType<typeof _defineString>;
}
