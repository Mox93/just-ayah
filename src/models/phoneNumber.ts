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
