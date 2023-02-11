import { z } from "zod";

import { dbConverter } from "utils";

import { DataModel, BaseModel } from "./abstract";
import {
  phoneNumberListSchema,
  simplePhoneNumberListSchema,
  trackableSchema,
} from "./blocks";

const statusSchema = z.enum([
  "registered",
  "contacted",
  "postponed",
  "uninterested",
]);

const metaSchema = trackableSchema.extend({
  status: statusSchema.default("postponed"),
});

const leadSchema = z.object({
  fullName: z.string(),
  phoneNumber: phoneNumberListSchema,
  facebook: z.string().url().optional(),
  message: z.string().optional(),
  meta: metaSchema.default({}),
});

const leadDBSchema = leadSchema.extend({
  phoneNumber: simplePhoneNumberListSchema,
});

const leadFormSchema = leadSchema.extend({
  phoneNumber: simplePhoneNumberListSchema,
});

export default class Lead extends DataModel(leadSchema) {
  static DB = BaseModel(leadDBSchema);
}

export const leadConverter = dbConverter(Lead, leadDBSchema);

export type LeadDB = InstanceType<typeof Lead.DB>;
export type LeadDBData = LeadDB["data"];

export type LeadFormData = z.infer<typeof leadFormSchema>;
