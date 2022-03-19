import { UNKNOWN } from "models";
import { identity } from "utils";
import { dateFromDB, DateInDB, shortDateRep } from "./dateTime";

export const studentStatuses = [
  "pending",
  "active",
  "postponed",
  "finished",
  "canceled",
] as const;

export type StudentStatusType = typeof studentStatuses[number];

export type StudentStatus =
  | { type: Exclude<StudentStatusType, "postponed"> }
  | { type: "postponed"; date: Date };

export type StudentStatusInDB =
  | { type: Exclude<StudentStatusType, "postponed"> }
  | { type: "postponed"; date: DateInDB };

export const getStatus = (
  obj?: StudentStatus,
  glb: (value: string) => string = identity
): string => {
  return obj
    ? obj.type === "postponed"
      ? `${glb(obj.type)} (${shortDateRep(obj.date)})`
      : glb(obj.type)
    : glb(UNKNOWN);
};

export const statusFromDB = (
  status?: StudentStatusInDB
): StudentStatus | undefined => {
  return status && status.type === "postponed"
    ? { ...status, date: dateFromDB(status.date) }
    : status;
};
