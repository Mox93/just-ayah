import { identity } from "utils";

import { BooleanLike, booleanToString, toBoolean } from "./boolean";

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

export type WorkStatusInfo = {
  doesWork?: BooleanLike;
  job?: string;
  reason?: NoWorkReason;
  explanation?: string;
};

export const parseWorkStatus = ({
  doesWork,
  job,
  reason,
  explanation,
}: WorkStatusInfo): WorkStatus => {
  doesWork = toBoolean(doesWork!);

  return doesWork
    ? { doesWork, job: job! }
    : reason !== "other"
    ? { doesWork: doesWork!, reason: reason! }
    : { doesWork: doesWork!, reason: reason!, explanation: explanation! };
};

export const workStatusToInfo = ({
  doesWork,
  ...rest
}: WorkStatus): WorkStatusInfo => ({
  doesWork: booleanToString(doesWork),
  ...rest,
});

export const getOccupation = (
  status?: WorkStatus,
  pi: (value: string) => string = identity
) =>
  status
    ? status.doesWork
      ? status.job
      : status.reason !== "other"
      ? pi(status.reason)
      : status.explanation || pi(status.reason)
    : "";
