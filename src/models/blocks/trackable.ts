import { z } from "zod";

import { dateSchema } from "../_blocks/dateTime";

export const trackableSchema = z.object({
  dateCreated: dateSchema.default(() => new Date()),
  dateUpdated: dateSchema.optional(),
});
