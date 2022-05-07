import { CountryCode, getCountry } from "./country";

export interface PhoneNumberInfo {
  code: CountryCode;
  number: string;
  tags?: string[];
}

export type PhoneNumberList = [PhoneNumberInfo, ...PhoneNumberInfo[]];

// const notInPhoneNumber = /\D/g; // /(?<!^)\+|[^\+0-9]+/g

export const phoneNumberTags = ["call", "whatsapp", "telegram"] as const;

export type PhoneNumberTags = typeof phoneNumberTags[number];

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
  phoneNumbers: PhoneNumberList,
  tag: string
): string => {
  for (let key in phoneNumbers) {
    const obj = phoneNumbers[key];

    if (obj.tags?.includes(tag)) {
      return phoneNumberToString(obj);
    }
  }

  return phoneNumbers[0] ? phoneNumberToString(phoneNumbers[0]) : "";
};

export const phoneNumberToString = (obj: PhoneNumberInfo) => {
  const countryCode = getCountryCode(obj.code);
  return countryCode ? `${countryCode}-${obj.number}` : obj.number;
};

export const getCountryCode = (code: CountryCode): string => {
  const country = getCountry(code);
  return country ? `+${country.phone}` : "";
};

export const filterPhoneNumberList = ([
  mainPhoneNumber,
  ...otherPhoneNumbers
]: PhoneNumberList) => {
  const output: PhoneNumberList = [mainPhoneNumber];

  otherPhoneNumbers.forEach((phoneNumber) => {
    if (phoneNumber.code && phoneNumber.number) output.push(phoneNumber);
  });

  return output;
};
