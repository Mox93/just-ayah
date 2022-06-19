import { identity } from "utils";

export const capitalize = <T>(value: T): T =>
  typeof value === "string"
    ? (`${value.charAt(0).toUpperCase()}${value.slice(1)}` as any)
    : value;

export const toTitle = (value: string) =>
  value.split(" ").map(capitalize).join(" ");

export const concat = (...values: string[]) =>
  values.filter(identity).join(" ");
