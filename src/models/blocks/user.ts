import { z } from "zod";

import { phoneNumberStringSchema } from "./phoneNumber";

export const userSchema = z.object({
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
});

export const userRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.array(phoneNumberStringSchema).optional(),
});

export type UserRef = z.infer<typeof userRefSchema>;
