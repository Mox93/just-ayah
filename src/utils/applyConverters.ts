import { cloneDeep, get, set } from "lodash";
import { PartialDeep } from "type-fest";

import { GenericObject, Path, PathValue, SubsetOf } from "models";

type RootConverter<T> = (values: T) => GenericObject;
type FieldConverter<T, P extends Path<T>> = (
  value: PathValue<T, P>,
  values: T
) => unknown;

export type Converters<T> = {
  [path in Path<T>]+?: FieldConverter<T, path>;
} & {
  __root__?: RootConverter<T>;
};

export type ConvertersMap<TData> = Record<string, Converters<TData>>;

interface ApplyConverters {
  <T>(obj: Partial<T>, _converters: Converters<T>): Partial<T>;
  <T>(obj: PartialDeep<T>, _converters: Converters<T>): PartialDeep<T>;
  <T>(obj: T, _converters: Converters<T>): T;
  <T>(obj: SubsetOf<T>, _converters: Converters<T>): SubsetOf<T>;
}

export const applyConverters: ApplyConverters = <T>(
  obj: SubsetOf<T>,
  _converters: Converters<T>
): SubsetOf<T> => {
  let result = cloneDeep(obj) as GenericObject;
  const { __root__, ...converters } = _converters;

  if (__root__) result = __root__(result);

  Object.entries<Function>(converters).forEach(([path, converter]) => {
    const value = get(obj, path);
    if (value !== undefined) set(result, path, converter(value));
  });

  return result;
};

export const addRootConverter = <T>(
  _converters: Converters<T>,
  root: RootConverter<T>
): Converters<T> => {
  const { __root__, ...converters } = _converters;

  return {
    ...converters,
    __root__: (values) => ({ ...__root__?.(values), ...root(values) }),
  };
};

export const mergeConverters = <TData>(
  ...convertersMaps: ConvertersMap<TData>[]
) => {
  const result: ConvertersMap<TData> = {};
  convertersMaps.forEach((convertersMap) =>
    Object.entries(convertersMap).forEach(([key, converters]) => {
      const _converters = result[key];
      if (!_converters) {
        result[key] = converters;
      } else {
        const { __root__, ...__converters } = converters;
        if (__root__) {
          result[key] = {
            ...addRootConverter(_converters, __root__),
            ...__converters,
          };
        }
      }
    })
  );
};
