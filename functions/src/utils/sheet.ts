import { Timestamp } from "@lib";
import { PhoneNumber } from "@types";

export function dateToCell(value: Date | Timestamp) {
  return (
    value instanceof Timestamp ? value.toDate() : value
  ).toLocaleDateString();
}

export function dateTimeToCell(value: Date | Timestamp) {
  return (value instanceof Timestamp ? value.toDate() : value)
    .toLocaleString("en-US", { timeZone: "Africa/Cairo" })
    .replace(",", "");
}

export function booleanToCell(value: boolean) {
  return value ? "TRUE" : "FALSE";
}

export function phoneNumberToCells(value?: PhoneNumber) {
  return [value?.number, value?.tags?.join(", ")];
}
