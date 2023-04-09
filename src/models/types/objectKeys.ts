import { OptionalKeysOf, RequiredKeysOf } from "type-fest";

type TupleUnion<U extends string | number | symbol, R extends any[] = []> = {
  [S in U]: Exclude<U, S> extends never
    ? [...R, S]
    : TupleUnion<Exclude<U, S>, [...R, S]>;
}[U];

export type TupleOfAllKeys<T> = TupleUnion<keyof T>;

export type TupleOfRequiredKeys<T> = T extends {} | []
  ? TupleUnion<RequiredKeysOf<T>>
  : [];

export type TupleOfOptionalKeys<T> = T extends {} | []
  ? TupleUnion<OptionalKeysOf<T>>
  : [];
