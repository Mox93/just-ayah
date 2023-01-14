import { get } from "lodash";
import { Primitive } from "type-fest";

import { Path } from "models";

export function identity(value: any) {
  return value;
}

export function omit() {}

function oneOf<U extends Primitive, T extends Readonly<[U, ...U[]]>>(
  value: any,
  values: T
): value is T[number];
function oneOf<U extends Primitive, T extends [U, ...U[]]>(
  value: any,
  values: T
): value is T[number] {
  return values.includes(value);
}

function pass<R, A = unknown, T extends A[] = any[]>(
  func: (...args: T) => R,
  ...args: T
): () => R;
function pass<T>(value: T): () => T;
function pass(funcOrValue: any, ...args: any[]) {
  return () =>
    typeof funcOrValue === "function" ? funcOrValue(...args) : funcOrValue;
}

export function pluck<T>(path: Path<T>) {
  return (obj?: T) => get(obj, path);
}

function envAction<T, A, Args extends [...A[]]>(
  env: string,
  action: (...args: Args) => T
) {
  return process.env.REACT_APP_ENV === env
    ? (...value: any) => action(...value)
    : omit;
}

export function devOnly<T, A, Args extends [...A[]]>(
  action: (...args: Args) => T
) {
  return envAction("development", action);
}

export function prodOnly<T, A, Args extends [...A[]]>(
  action: (...args: Args) => T
) {
  return envAction("production", action);
}

export function hasAtLeastOne<T>(array?: T[]): array is [T, ...T[]] {
  return !!array?.length;
}

export function assert(
  value: unknown,
  message?: string | Error
): asserts value {
  if (!value) {
    throw message instanceof Error ? message : new Error(message);
  }
}

export { pass, oneOf };
