import { z } from "zod";

import { identity } from "utils";

import { Converter, OTHER, UNKNOWN } from "../types";
import { falseLike, trueLike } from "./boolean";

export const noWorkReasonSchema = z.enum(["student", "housewife", "retired"]);

export const noWorkReasons = [...noWorkReasonSchema.options, OTHER];

const noWorkSchema = z.discriminatedUnion("value", [
  z.object({
    value: z.literal(OTHER),
    other: z.string(),
  }),
  z.object({
    value: noWorkReasonSchema,
  }),
]);

export const workStatusSchema = z.discriminatedUnion("doesWork", [
  z.object({
    doesWork: z.literal(true),
    job: z.string(),
  }),
  z.object({
    doesWork: trueLike,
    job: z.string(),
  }),
  z.object({
    doesWork: z.literal(false),
    status: noWorkSchema,
  }),
  z.object({
    doesWork: falseLike,
    status: noWorkSchema,
  }),
]);

export type WorkStatus = z.infer<typeof workStatusSchema>;

export function workStatusString(
  workStatus: WorkStatus,
  t: Converter<string> = identity
) {
  return workStatus.doesWork
    ? workStatus.job || t(UNKNOWN)
    : workStatus.status.value === OTHER
    ? workStatus.status.other || t(OTHER)
    : t(workStatus.status.value);
}
