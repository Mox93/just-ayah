import { identity } from "utils";

/**
 * Makes the fist letter of a string uppercase,
 * unlike the css `text-transform: capitalize;`
 * which makes the first letter of every word uppercase.
 */
function capitalize(value: string): string;
function capitalize<T>(value: T): T;
function capitalize<T>(value: T) {
  return typeof value === "string"
    ? `${value.charAt(0).toUpperCase()}${value.slice(1)}`
    : value;
}

export function concat(...values: (string | undefined)[]) {
  return values.filter(identity).join(" ");
}

export function addZeros(x = 0, length = 2) {
  const actualLength = `${x}`.length;

  return actualLength < length
    ? `${Array(length - actualLength)
        .fill("0")
        .join()}${x}`
    : `${x}`;
}

export { capitalize };
