import { subscriptionSchema } from "./blocks/status";
import { z } from "zod";

import { dbConverter } from "utils";

import { BaseModel, DataModel } from "./abstract";
import { dateSchema, trackableSchema } from "./blocks";

export const currenciesSchema = z.enum(["EGP", "USD", "SAR"]);

const collectionRefSchema = z.discriminatedUnion("collection", [
  z.object({
    collection: z.literal("students"),
    docId: z.string(),
    subscription: subscriptionSchema,
    sessions: z.number().int().positive(),
  }),
  z.object({
    collection: z.literal("teachers"),
    docId: z.string(),
    dailyHours: z.number().positive(),
  }),
]);

export const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: currenciesSchema,
  reciteURL: z.string().url().optional(),
  notes: z.string().optional(),
  meta: trackableSchema,
  ref: collectionRefSchema,
});

export const paymentRefSchema = z.object({
  lastPayment: paymentSchema,
  nextPaymentDate: dateSchema,
});

export class Payment extends DataModel(paymentSchema) {
  static DB = BaseModel(paymentSchema);
}

export const paymentConverter = dbConverter(Payment, paymentSchema);

export type PaymentDB = InstanceType<typeof Payment.DB>;
export type PaymentDBData = PaymentDB["data"];

export type PaymentFormData = PaymentDBData;
