import { z } from "zod";

import { phoneNumberStringSchema } from "./phoneNumber";
import { indexList, indexMap } from "./schemas";

export const userSchema = z.object({
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
});

const _userIndexSchema = z.object({
  name: z.string(),
  phoneNumber: z.array(phoneNumberStringSchema).optional(),
});

export const userIndexSchema = _userIndexSchema.extend({ id: z.string() });

export type UserIndex = z.infer<typeof userIndexSchema>;

const userIndexesSchema = z.union([
  z.array(userIndexSchema),
  z.record(z.string(), _userIndexSchema),
]);

export const userIndexListSchema = indexList(userIndexesSchema);

export const userIndexMapSchema = indexMap(userIndexesSchema);
