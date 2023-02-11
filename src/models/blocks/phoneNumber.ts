import { assert } from "utils";
import { z, ZodTypeAny } from "zod";

import { countryCodeSchema, countrySchema } from "./country";
import { nonEmptyArray } from "./schemas";

export const phoneNumberTagsSchema = z.enum(["call", "whatsapp", "telegram"]);

export type PhoneNumberTag = z.infer<typeof phoneNumberTagsSchema>;

export const phoneNumberTagListSchema = z
  .array(phoneNumberTagsSchema)
  .default([]);

export const phoneNumberTagSetSchema = z
  .set(phoneNumberTagsSchema)
  .default(new Set<PhoneNumberTag>());

const _phoneNumberSchema = z.object({
  code: z.union([countryCodeSchema, z.literal("")]), // TODO use only `countryCodeSchema` once all country codes are valid in the DB
  number: z.string().regex(/^\d+$/g).max(15),
  tags: z.union([
    phoneNumberTagSetSchema,
    phoneNumberTagListSchema.transform((value) => new Set(value)),
  ]),
});

type PhoneNumber = z.infer<typeof _phoneNumberSchema>;

const _simplePhoneNumberSchema = _phoneNumberSchema.merge(
  z.object({
    tags: z.union([
      phoneNumberTagListSchema,
      phoneNumberTagSetSchema.transform((value) => Array.from(value.keys())),
    ]),
  })
);

export type SimplePhoneNumber = z.infer<typeof _simplePhoneNumberSchema>;

export const phoneNumberSchema = extendPhoneNumberSchema(_phoneNumberSchema);

export const simplePhoneNumberSchema = extendPhoneNumberSchema(
  _simplePhoneNumberSchema
);

export function isPhoneNumber(value: any): value is PhoneNumber {
  return ["code", "number"].every((key) => !!value[key]);
}

export function phoneNumberString(phoneNumber: PhoneNumber) {
  const country = countrySchema.safeParse(phoneNumber.code);

  return country.success
    ? `+${country.data.phone}-${phoneNumber.number}`
    : phoneNumber.number;
}

export const phoneNumberListSchema = z.preprocess(
  filterValidPhoneNumbers,
  nonEmptyArray(phoneNumberSchema)
);

export const simplePhoneNumberListSchema = z.preprocess(
  filterValidPhoneNumbers,
  nonEmptyArray(simplePhoneNumberSchema)
);

export type PhoneNumberList = z.infer<typeof phoneNumberListSchema>;

function filterValidPhoneNumbers(phoneNumbers: unknown): PhoneNumber[] {
  assert(Array.isArray(phoneNumbers));
  return phoneNumbers.filter((value) => isPhoneNumber(value));
}

function findPhoneNumberByTags(
  phoneNumbers: PhoneNumberList,
  tags: [PhoneNumberTag, ...PhoneNumberTag[]],
  options?: { matchAll?: boolean; returnFallBack?: true }
): PhoneNumber;
function findPhoneNumberByTags(
  phoneNumbers: PhoneNumberList,
  tags: [PhoneNumberTag, ...PhoneNumberTag[]],
  options: { matchAll?: boolean; returnFallBack: false }
): PhoneNumber | undefined;
function findPhoneNumberByTags(
  phoneNumbers: PhoneNumberList,
  tags: [PhoneNumberTag, ...PhoneNumberTag[]],
  {
    matchAll,
    returnFallBack = true,
  }: { matchAll?: boolean; returnFallBack?: boolean } = {}
) {
  const filter = matchAll ? tags.every.bind(tags) : tags.some.bind(tags);

  const phoneNumber = phoneNumbers.find(({ tags: _tags }) =>
    filter((tag) => _tags.has(tag))
  );

  return phoneNumber || (returnFallBack ? phoneNumbers[0] : undefined);
}

export function filterPhoneNumberByTags(
  phoneNumbers: PhoneNumberList,
  tags: [PhoneNumberTag, ...PhoneNumberTag[]],
  matchAll?: boolean
) {
  const filter = matchAll ? tags.every.bind(tags) : tags.some.bind(tags);

  return phoneNumbers.filter(({ tags: _tags }) =>
    filter((tag) => _tags.has(tag))
  );
}

function extendPhoneNumberSchema<S extends ZodTypeAny>(schema: S) {
  return z.union([
    schema,
    z
      .string()
      .max(17)
      .regex(new RegExp(`^(${countryCodeSchema.options.join("|")})-\\d+$`))
      .transform<z.infer<S>>((value) => {
        const [code, number] = value.split("-");
        return schema.parse({ code, number });
      }),
  ]);
}

export { findPhoneNumberByTags };
