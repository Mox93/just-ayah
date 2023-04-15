import { get, isEqual, memoize } from "lodash";
import { Primitive } from "type-fest";

import { Path } from "models";

export const sortBy = memoize(
  <T extends {}>(path: Path<T>) =>
    (list: T[]) =>
      list.sort((a, b) => (get(a, path) > get(b, path) ? 1 : -1))
);

export function oneOf<U extends Primitive, T extends Readonly<[U, ...U[]]>>(
  value: any,
  values: T
): value is T[number];
export function oneOf<U extends Primitive, T extends [U, ...U[]]>(
  value: any,
  values: T
): value is T[number] {
  return values.includes(value);
}

export function hasAtLeastOne<T>(array?: T[]): array is [T, ...T[]] {
  return !!array?.length;
}

export function isWildCard(array?: any): array is ["*"] {
  return isEqual(array, ["*"]);
}
