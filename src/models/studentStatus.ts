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

export const getStudentStatus = (
  status?: StudentStatus,
  glb: (value: string) => string = identity
): string => {
  return status
    ? status.type === "postponed" && status.date
      ? `${glb(status.type)} (${shortDateRep(status.date)})`
      : glb(status.type)
    : glb(UNKNOWN);
};

export const studentStatusFromDB = (
  status?: StudentStatusInDB
): StudentStatus | undefined => {
  return status && status.type === "postponed"
    ? { ...status, date: dateFromDB(status.date) }
    : status;
};
