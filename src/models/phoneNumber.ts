import { getCountry } from "./country";

export interface PhoneNumberInfo {
  code: string;
  number: string;
  tags?: string[];
}

export type PhoneNumberValidation = {
  [K in keyof Required<PhoneNumberInfo>]: boolean;
};

export const phoneNumberValidation: PhoneNumberValidation = {
  code: false,
  number: false,
  tags: true,
};

const notInPhoneNumber = /\D/g; // /(?<!^)\+|[^\+0-9]+/g

export const sanitizePhoneNumber = (value: any) =>
  typeof value === "string"
    ? value.replace(notInPhoneNumber, "").slice(0, 16)
    : undefined;

export const addTag = (
  obj: Partial<PhoneNumberInfo>,
  tag: string
): Partial<PhoneNumberInfo> => {
  const tags = obj.tags || [];

  if (!tags.includes(tag)) {
    tags.push(tag);
  }

  return { ...obj, tags };
};

export const removeTag = (
  obj: Partial<PhoneNumberInfo>,
  tag: string
): Partial<PhoneNumberInfo> => {
  if (!obj.tags) return obj;
  return { ...obj, tags: obj.tags.filter((aTag) => aTag !== tag) };
};

export const getPhoneNumberByTag = (
  numbers: { [idx: number]: PhoneNumberInfo },
  tag: string
): string => {
  for (let key in numbers) {
    const obj = numbers[key];

    if (obj.tags?.includes(tag)) {
      return phoneNumberToString(obj);
    }
  }

  return numbers[0] ? phoneNumberToString(numbers[0]) : "";
};

export const phoneNumberToString = (obj: PhoneNumberInfo) => {
  const countryCode = getCountryCode(obj.code);
  return countryCode ? `${countryCode}-${obj.number}` : obj.number;
};

export const getCountryCode = (code: string): string => {
  const country = getCountry(code);
  return country ? `+${country.phone}` : "";
};
