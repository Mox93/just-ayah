import { Get, Primitive } from "type-fest";

type Join<
  L extends PropertyKey | undefined,
  R extends PropertyKey | undefined
> = L extends string | number
  ? R extends string | number
    ? `${L}.${R}`
    : L
  : R extends string | number
  ? R
  : undefined;

type IsTuple<T extends ReadonlyArray<any>> = number extends T["length"]
  ? false
  : true;

type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;

type PathImpl<K extends string | number, V> = V extends Primitive
  ? K
  : V extends Function
  ? never
  : K | Join<K, Path<V>>;

/**
 * Type which eagerly collects all paths through a type
 * @typeParam T - type which should be introspected
 * @example
 * ```
 * Path<{foo: {bar: string}}> = 'foo' | 'foo.bar'
 * ```
 */
export type Path<T> = T extends infer O
  ? O extends ReadonlyArray<infer V>
    ? IsTuple<O> extends true
      ? {
          [K in TupleKeys<O>]-?: PathImpl<K & string, O[K]>;
        }[TupleKeys<O>]
      : PathImpl<number, V>
    : { [K in keyof O]-?: PathImpl<K & string, O[K]> }[keyof O]
  : never;

/**
 * Type to evaluate the type which the given path points to.
 * @typeParam T - deeply nested type which is indexed by the path
 * @typeParam P - path into the deeply nested type
 * @example
 * ```
 * PathValue<{foo: {bar: string}}, 'foo.bar'> = string
 * PathValue<[number, string], '1'> = string
 * ```
 */
export type PathValue<T, P extends Path<T>> = Get<T, P>;
