import * as functions from "firebase-functions";

export type Change<T> = functions.Change<T>;
export type EventContext = functions.EventContext;
export type DocumentSnapshot = functions.firestore.DocumentSnapshot;

export const document = functions.firestore.document;
