import { get } from "lodash";

import { Path, PathValue } from "models";
import { IS_DEV, IS_PROD } from "models/config";

import { assert } from "./validations";

export function identity(value: any) {
  return value;
}

export function omit() {}

export function pass<R, A = unknown, T extends A[] = any[]>(
  func: (...args: T) => R,
  ...args: T
): () => R;
export function pass<R, A = unknown, T extends A[] = any[]>(
  func: ((...args: T) => R) | undefined,
  ...args: T
): () => R | undefined;
export function pass<T>(value: T): () => T;
export function pass(funcOrValue: any, ...args: any[]) {
  return () =>
    typeof funcOrValue === "function" ? funcOrValue(...args) : funcOrValue;
}

// FIXME type signature dons't work properly
export function pluck<T, S extends false = false>(
  path: Path<T>,
  strict?: S
): (obj?: T) => PathValue<T, typeof path> | undefined;
export function pluck<T, S extends true>(
  path: Path<T>,
  strict: S
): (obj: T) => PathValue<T, typeof path>;
export function pluck<T, S extends boolean = false>(path: Path<T>, strict?: S) {
  return (obj?: T) => {
    assert(obj || !strict);
    return get(obj, path);
  };
}

export function singleton<F extends () => any>(func: F) {
  let instance: ReturnType<F>;

  const newFunc = () => {
    if (instance !== undefined) return instance;
    instance = func();
    return instance;
  };

  return newFunc as F;
}

export function startTimeout(callback: VoidFunction, delay?: number) {
  const timeout = setTimeout(callback, delay);
  return () => clearTimeout(timeout);
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
