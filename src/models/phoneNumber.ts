export interface PhoneMap {
  number: string;
  tags?: string[];
}

const notInPhoneNumber = /(?<!^)\+|[^\+0-9]+/g;

export const sanitizePhoneNumber = (value: any) =>
  typeof value === "string"
    ? value.replace(notInPhoneNumber, "").slice(0, 16)
    : undefined;
