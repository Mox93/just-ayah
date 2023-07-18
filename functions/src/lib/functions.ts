import * as functions from "firebase-functions";

export { defineInt, defineString } from "firebase-functions/params";
export { HttpsError, onCall } from "firebase-functions/v1/https";

export type Change<T> = functions.Change<T>;
export type EventContext = functions.EventContext;
export type DocumentSnapshot = functions.firestore.DocumentSnapshot;
export type QueryDocumentSnapshot = functions.firestore.QueryDocumentSnapshot;

export const document = functions.firestore.document;
export const user = functions.auth.user;
