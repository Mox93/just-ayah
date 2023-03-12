import { z } from "zod";

import { phoneNumberStringSchema } from "./phoneNumber";

export const userSchema = z.object({
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
});

const _userIndexSchema = z.object({
  name: z.string(),
  phoneNumber: z.array(phoneNumberStringSchema).optional(),
});

type _UserIndex = z.infer<typeof _userIndexSchema>;

export const userIndexSchema = _userIndexSchema.extend({ id: z.string() });

export type UserIndex = z.infer<typeof userIndexSchema>;

const userIndexesSchema = z.union([
  z.array(userIndexSchema),
  z.record(z.string(), _userIndexSchema),
]);

export const userIndexListSchema = userIndexesSchema.transform<UserIndex[]>(
  (value) =>
    Array.isArray(value)
      ? value
      : Object.entries(value).map(([id, value]) => ({ id, ...value }))
);

export const userIndexMapSchema = userIndexesSchema.transform<{
  [x: string]: _UserIndex;
}>((value) =>
  Array.isArray(value)
    ? value.reduce(
        (obj, { id, ...userIndex }) => ({ ...obj, [id]: userIndex }),
        {}
      )
    : value
);
