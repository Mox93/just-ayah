import { z, ZodTypeAny } from "zod";

export function nonEmptyArray<S extends ZodTypeAny>(schema: S) {
  return z.tuple([schema]).rest(schema);
}
