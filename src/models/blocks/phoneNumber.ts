import { z } from "zod";

import { assert } from "utils";

import { countryCodeSchema, countrySchema } from "./country";

export const phoneNumberTagsSchema = z.enum(["call", "whatsapp", "telegram"]);

export type PhoneNumberTag = z.infer<typeof phoneNumberTagsSchema>;

const _phoneNumberSchema = z.object({
  code: countryCodeSchema,
  number: z.string().regex(/^\d+$/g).max(15),
  tags: z.set(phoneNumberTagsSchema).default(() => new Set<PhoneNumberTag>()),
});

type _PhoneNumber = z.infer<typeof _phoneNumberSchema>;

function isPhoneNumber(value: any): value is _PhoneNumber {
  return ["code", "number"].every((key) => Object.hasOwn(value, key));
}

const phoneNumberMethods = {
  toString() {
    if (!isPhoneNumber(this)) {
      return JSON.stringify(this);
    }

    const dialCode = this.code
      ? `+${countrySchema.parse(this.code).phone}`
      : "";
    return dialCode ? `${dialCode}-${this.number}` : this.number;
  },
  isValid() {
    return isPhoneNumber(this);
  },
} as const;

export type PhoneNumber = _PhoneNumber & typeof phoneNumberMethods;

export const phoneNumberSchema = z
  .union([
    _phoneNumberSchema,
    z
      .string()
      .max(17)
      .regex(new RegExp(`(${countryCodeSchema.options.join("|")})-\\d+`))
      .transform((value) => {
        const [code, number] = value.split("-");
        return _phoneNumberSchema.parse({ code, number });
      }),
  ])
  .transform<PhoneNumber>((value) =>
    Object.assign(Object.create(phoneNumberMethods), value)
  );

const _phoneNumberListSchema = z
  .tuple([phoneNumberSchema])
  .rest(phoneNumberSchema);

export type _PhoneNumberList = z.infer<typeof _phoneNumberListSchema>;

function isPhoneNumberList(value: any): value is _PhoneNumberList {
  return (
    Array.isArray(value) &&
    value.every((phoneNumber) => isPhoneNumber(phoneNumber))
  );
}

const phoneNumberListMethods = {
  findByTag(tag: PhoneNumberTag, returnFallBack = true) {
    assert(isPhoneNumberList(this));
    const phoneNumber = this.find(({ tags }) => tags.has(tag));
    return phoneNumber || returnFallBack ? this[0] : undefined;
  },
  filterByTags(_tags: PhoneNumberTag[], method: "any" | "all" = "any") {
    assert(isPhoneNumberList(this));
    return this.filter(({ tags }) =>
      (method === "all" ? _tags.every : _tags.some)((tag) => tags.has(tag))
    );
  },
} as const;

export type PhoneNumberList = _PhoneNumberList & typeof phoneNumberListMethods;

export const phoneNumberListSchema =
  _phoneNumberListSchema.transform<PhoneNumberList>((value) =>
    Object.assign(Object.create(phoneNumberListMethods), value)
  );
