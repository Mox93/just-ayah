import { assert } from "./validations";

export function range(end: number): number[];
export function range(start: number, end: number, step?: number): number[];
export function range(startOrEnd: number, end?: number, step = 1) {
  assert(step, "'step' must be a non zero number");

  const [startAt, endAt] =
    typeof end === "number" ? [startOrEnd, end] : [0, startOrEnd];

  const delta = startAt < endAt ? Math.abs(step) : -Math.abs(step);
  const length = Math.floor(Math.abs((endAt - startAt) / delta));
  const output: number[] = Array(length);

  for (let i = 0; i < length; i++) {
    output[i] = startAt + delta * i;
  }

  return output;
}
