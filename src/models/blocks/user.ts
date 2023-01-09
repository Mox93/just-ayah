import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
});
