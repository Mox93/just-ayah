import { UNKNOWN } from "models";
import { identity } from "utils";

import { fromYesNo } from "../utils/yesNo";

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
  doesWork?: boolean;
  job?: string;
  reason?: NoWorkReason;
  explanation?: string;
};

export const parseWorkStatus = ({
  doesWork: dw,
  job,
  reason,
  explanation,
}: WorkStatusInfo): WorkStatus => {
  const doesWork = fromYesNo(dw);

  return doesWork
    ? { doesWork, job: job! }
    : reason !== "other"
    ? { doesWork: doesWork!, reason: reason! }
    : { doesWork: doesWork!, reason: reason!, explanation: explanation! };
};

export const getOccupation = (
  status?: WorkStatus,
  pi: (value: string) => string = identity
) =>
  status
    ? status.doesWork
      ? status.job
      : status.reason !== "other"
      ? pi(status.reason || UNKNOWN)
      : status.explanation || pi(status.reason)
    : pi(UNKNOWN);
