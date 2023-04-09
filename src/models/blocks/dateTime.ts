import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const weekDaySchema = z.enum([
  "Fri",
  "Sat",
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
]);

export type WeekDay = z.infer<typeof weekDaySchema>;

export const dateSchema = z
  .union([z.coerce.date(), z.instanceof(Timestamp)])
  .transform((value) => (value instanceof Timestamp ? value.toDate() : value));

export type DateValue = z.input<typeof dateSchema>;
