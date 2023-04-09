import { get } from "lodash";
import { Primitive } from "type-fest";

import { Path, PathValue } from "models";
import { IS_DEV, IS_PROD } from "models/config";

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
function pass<R, A = unknown, T extends A[] = any[]>(
  func: ((...args: T) => R) | undefined,
  ...args: T
): () => R | undefined;
function pass<T>(value: T): () => T;
function pass(funcOrValue: any, ...args: any[]) {
  return () =>
    typeof funcOrValue === "function" ? funcOrValue(...args) : funcOrValue;
}

// FIXME type signature dons't work properly
function pluck<T, S extends false = false>(
  path: Path<T>,
  strict?: S
): (obj?: T) => PathValue<T, typeof path> | undefined;
function pluck<T, S extends true>(
  path: Path<T>,
  strict: S
): (obj: T) => PathValue<T, typeof path>;
function pluck<T, S extends boolean = false>(path: Path<T>, strict?: S) {
  return (obj?: T) => {
    assert(obj || !strict);
    return get(obj, path);
  };
}

export function devOnly<T, A, Args extends [...A[]]>(
  action: (...args: Args) => T
) {
  return IS_DEV ? (...value: any) => action(...value) : omit;
}

export function prodOnly<T, A, Args extends [...A[]]>(
  action: (...args: Args) => T
) {
  return IS_PROD ? (...value: any) => action(...value) : omit;
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

export { oneOf, pass, pluck };
