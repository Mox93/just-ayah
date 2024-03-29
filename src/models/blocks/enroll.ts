import { z } from "zod";

import { shiftDate } from "../_blocks/dateTime";
import { booleanSchema } from "./boolean";
import { dateSchema } from "./dateTime";
import { trackableSchema } from "./trackable";

export const enrollSchema = trackableSchema.extend({
  name: z.string().optional(),
  awaiting: booleanSchema,
  expiresAt: dateSchema,
  termsUrl: z.string().optional(),
});

export type Enroll = z.infer<typeof enrollSchema>;

interface EnrollCreateProps {
  name?: string;
  duration?: number;
}

export function createEnroll<T extends EnrollCreateProps>({
  duration = 48,
  ...props
}: T): Enroll {
  return enrollSchema.parse({
    ...props,
    awaiting: true,
    expiresAt: shiftDate(new Date(), { hour: duration }),
  });
}

export function refreshEnroll(enroll: Enroll, duration?: number): Enroll {
  return createEnroll({ ...enroll, duration, dateUpdated: new Date() });
}

export function sealEnroll<T>(updates: T) {
  return { ...updates, "enroll.awaiting": false };
}
