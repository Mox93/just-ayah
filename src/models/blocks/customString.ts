import { z } from "zod";

import { OTHER } from "models/types";

export const emailSchema = z.union([
  z.string().email().optional(),
  z.literal(""),
]);

export const urlSchema = z.union([z.string().url().optional(), z.literal("")]);

export const leadsSchema = z.enum([
  "facebook",
  "linkedin",
  "tiktok",
  "friend",
  OTHER,
]);

export type Leads = z.infer<typeof leadsSchema>;
