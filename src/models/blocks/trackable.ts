import { z } from "zod";

import { dateSchema } from "./dateTime";

export const trackableSchema = z.object({
  dateCreated: dateSchema.default(() => new Date()),
  dateUpdated: dateSchema.optional(),
});
