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
