import {
  Change,
  DocumentSnapshot,
  EventContext,
  QueryDocumentSnapshot,
} from "./lib";

export type DBEventHandler = (
  change: Change<DocumentSnapshot>,
  context: EventContext
) => any;

export type DBUpdateHandler = (
  change: Change<QueryDocumentSnapshot>,
  context: EventContext
) => any;

export type EventType = "create" | "delete" | "update";

export interface UserName {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName?: string;
}

export interface PhoneNumber {
  code: string;
  number: string;
}
