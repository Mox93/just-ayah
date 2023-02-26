import { z } from "zod";

import { dateSchema } from "./dateTime";

export const trackableSchema = z.object({
  dateCreated: dateSchema.default(() => new Date()),
  dateUpdated: dateSchema.optional(),
});

export function changeDateUpdated<T>(prefix?: string) {
  const path = prefix ? `${prefix}.dateUpdated` : "dateUpdated";
  return (updates: T) => ({ ...updates, [path]: new Date() });
}
