import { Schema, z, ZodType, ZodTypeDef, ZodUnion } from "zod";

import { Merge } from "models";

export function nonEmptyArray<S extends ZodType>(schema: S) {
  return z.tuple([schema]).rest(schema);
}

export function indexList<A extends any[], R extends Record<string, any>>(
  schema: ZodUnion<[Schema<A, ZodTypeDef, any>, Schema<R, ZodTypeDef, any>]>
) {
  return schema.transform<Merge<R[string], { id: string }>[]>((value) =>
    Array.isArray(value)
      ? value
      : Object.entries<R[string]>(value).map(([id, data]) => ({ id, ...data }))
  );
}

export function indexMap<A extends any[], R extends Record<string, any>>(
  schema: ZodUnion<[Schema<A>, Schema<R>]>
) {
  return schema.transform<R>((value) =>
    Array.isArray(value)
      ? value.reduce(
          (obj, { id, ...userIndex }) => ({ ...obj, [id]: userIndex }),
          {}
        )
      : value
  );
}
