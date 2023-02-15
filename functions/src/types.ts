import { Change, DocumentSnapshot, EventContext } from "./lib";

export type DBEventHandler = (
  change: Change<DocumentSnapshot>,
  context: EventContext
) => any;

export type EventType = "create" | "delete" | "update";

export interface UserName {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName?: string;
}
