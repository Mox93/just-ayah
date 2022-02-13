import { identity } from "utils";

export const noWorkReasons = [
  "student",
  "housewife",
  "unemployed",
  "retired",
] as const;

export type WorkStatus =
  | { doesWork: true; occupation: string }
  | {
      doesWork: false;
      reason: typeof noWorkReasons[number];
    }
  | { doesWork: false; reason: "other"; explanation: string };

export const getOccupation = (
  status: WorkStatus,
  pi: (value: string) => string = identity
): string =>
  status.doesWork
    ? status.occupation
    : status.reason === "other"
    ? status.explanation
    : pi(status.reason);
