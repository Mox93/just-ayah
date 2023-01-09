import { get } from "lodash";
import { Primitive } from "type-fest";

import { Path } from "models";

export const identity = (value: any) => value;

export const omit = () => {};

interface OneOf {
  <U extends Primitive, T extends Readonly<[U, ...U[]]>>(
    value: any,
    values: T
  ): value is T[number];
  <U extends Primitive, T extends [U, ...U[]]>(
    value: any,
    values: T
  ): value is T[number];
}

export const oneOf: OneOf = <U extends any, T extends Readonly<[U, ...U[]]>>(
  value: any,
  values: T
): value is T[number] => values.includes(value);

interface Pass {
  <A, T extends A[], R>(func?: (...args: T) => R, ...args: T): () => R;
  <T>(value: T): () => T;
}

export const pass: Pass =
  (funcOrValue: any, ...args: any[]) =>
  () =>
    typeof funcOrValue === "function" ? funcOrValue(...args) : funcOrValue;

export const pluck =
  <T, P extends Path<T> = Path<T>>(path: P) =>
  (obj: T) =>
    get(obj, path);

export const envAction =
  (env: string, action: (...value: any) => any) =>
  (...value: any) =>
    process.env.REACT_APP_ENV === env && action(...value);

export const devOnly = (action: (...value: any) => any) =>
  envAction("development", action);

export const prodOnly = (action: (...value: any) => any) =>
  envAction("production", action);

export const hasAtLeastOne = <T>(array?: T[]): array is [T, ...T[]] =>
  !!array?.length;

export function assert(
  value: unknown,
  message?: string | Error
): asserts value {
  if (!value) {
    throw message instanceof Error ? message : new Error(message);
  }
}
