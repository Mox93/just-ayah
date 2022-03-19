import { identity } from "utils";

export const noWorkReasons = [
  "student",
  "housewife",
  "retired",
  "other",
] as const;

export type NoWorkReason = typeof noWorkReasons[number];

export type WorkStatus =
  | { doesWork: true; job: string }
  | {
      doesWork: false;
      reason: Exclude<NoWorkReason, "other">;
    }
  | { doesWork: false; reason: "other"; explanation: string };

export const getOccupation = (
  status: WorkStatus,
  pi: (value: string) => string = identity
): string =>
  status.doesWork
    ? status.job
    : status.reason === "other"
    ? status.explanation
    : pi(status.reason);
