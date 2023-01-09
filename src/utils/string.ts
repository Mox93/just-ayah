import { identity } from "utils";

interface Capitalize {
  (value: string): string;
  <T>(value: T): T;
}

export const capitalize: Capitalize = <T>(value: T) =>
  typeof value === "string"
    ? `${value.charAt(0).toUpperCase()}${value.slice(1)}`
    : value;

export const toTitle = (value: string) =>
  value.split(" ").map(capitalize).join(" ");

export const concat = (...values: string[]) =>
  values.filter(identity).join(" ");

export const addZeros = (x = 0, length = 2) => {
  const actualLength = `${x}`.length;

  return actualLength < length
    ? `${Array(length - actualLength)
        .fill("0")
        .join()}${x}`
    : `${x}`;
};
