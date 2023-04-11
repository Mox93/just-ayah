import { PhoneNumber, UserName } from "@types";

export function getFullName({
  firstName,
  middleName,
  lastName,
  fullName,
}: UserName) {
  return (
    fullName ||
    [firstName, middleName, lastName].filter((val) => !!val).join(" ")
  );
}

export function parsePhoneNumber({ code, number }: PhoneNumber) {
  return `${code}-${number}`;
}
