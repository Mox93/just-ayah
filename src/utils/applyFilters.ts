import { cloneDeep, get, set, unset } from "lodash";
import { Primitive } from "type-fest";

import { GenericObject, Path, PathValue, SubsetOf } from "models";

import { oneOf } from ".";

type ValidationFilter<T> = {
  [path in Path<T>]?: (value: PathValue<T, path>, values: T) => boolean;
} & {
  __byValue__?: (value: T extends Primitive ? T : T[keyof T]) => boolean;
};

export type Filter<T> =
  | {
      type: "pick" | "exclude";
      fields: [Path<T>, ...Path<T>[]];
      validations?: ValidationFilter<T>;
    }
  | {
      type?: never;
      fields?: never;
      validations: ValidationFilter<T>;
    };

export const applyFilters = <T>(
  obj: SubsetOf<T>,
  filter: Filter<T>
): SubsetOf<T> => {
  let result: GenericObject = {};
  const {
    type,
    fields,
    validations: { __byValue__, ...validations } = {},
  } = filter;

  if (type === "pick") {
    fields!.forEach((path) => set(result, path, get(obj, path)));
  } else {
    result = cloneDeep(obj) as GenericObject;

    if (type === "exclude") {
      fields!.forEach((path) => unset(result, path));
    }
  }

  Object.entries<Function>(validations).forEach(([path, validate]) => {
    const value = get(result, path);
    if (value !== undefined && !validate(value)) unset(result, path);
  });

  if (__byValue__)
    Object.entries(result).forEach(
      ([key, value]) => __byValue__(value) || unset(result, key)
    );

  return result as SubsetOf<T>;
};

export const noEmptyValues = {
  validations: {
    __byValue__: (value: any) => !oneOf(value, [undefined, null, ""]),
  },
};
