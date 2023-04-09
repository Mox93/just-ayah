import { z } from "zod";

import { userIndexSchema } from "./blocks/user";
import { courseIndexSchema } from "./course";

export const metaDataSchema = z.object({
  studentIndex: z.array(userIndexSchema),
  teacherIndex: z.array(userIndexSchema),
  courseIndex: z.array(courseIndexSchema),
});

export type MetaData = z.infer<typeof metaDataSchema>;
