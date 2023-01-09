import { z } from "zod";

import { assert, identity } from "utils";

import { Converter, UNKNOWN } from "..";
import { booleanSchema } from "./boolean";

const noWorkReasonSchema = z.enum(["student", "housewife", "retired"]);

const _workStatusSchema = z.discriminatedUnion("doesWork", [
  z.object({
    doesWork: z.literal(true),
    job: z.string(),
  }),
  z.object({
    doesWork: z.literal(false),
    reason: z.literal("other"),
    explanation: z.string(),
  }),
  z.object({
    doesWork: z.literal(false),
    reason: noWorkReasonSchema,
  }),
]);

type _WorkStatus = z.infer<typeof _workStatusSchema>;

function isWorkStatus(value: any): value is _WorkStatus {
  return Object.hasOwn(value, "doesWork");
}

const workStatusMethods = {
  toString(t: Converter<string> = identity) {
    assert(isWorkStatus(this));

    return this.doesWork
      ? this.job || t(UNKNOWN)
      : this.reason !== "other"
      ? t(this.reason || UNKNOWN)
      : this.explanation || t(this.reason);
  },
} as const;

export type WorkStatus = _WorkStatus & typeof workStatusMethods;

export const workStatusSchema = z
  .object({
    doesWork: booleanSchema,
    job: z.string().optional(),
    reason: noWorkReasonSchema.optional(),
    explanation: z.string().optional(),
  })
  .transform<WorkStatus>((value) =>
    Object.assign(
      Object.create(workStatusMethods),
      _workStatusSchema.parse(value)
    )
  );
