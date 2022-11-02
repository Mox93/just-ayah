import { cloneDeep, get, isArray, isPlainObject, set } from "lodash";
import { Path } from "react-hook-form";

import { UpdateObject } from "models";

interface PathsOptions<TFieldName> {
  parentKey?: TFieldName;
  includeAll?: boolean;
}

export const paths = <
  TFieldValues,
  TFieldName extends Path<TFieldValues> = Path<TFieldValues>
>(
  obj: TFieldValues,
  { parentKey, includeAll }: PathsOptions<TFieldName> = {}
): TFieldName[] => {
  const leafs: TFieldName[] = [];

  if (
    !includeAll &&
    isArray(obj) &&
    obj.every((value) => !isPlainObject(value))
  ) {
    parentKey && leafs.push(parentKey);
    // console.log("array of primitive types", obj);
  } else if (isArray(obj) || isPlainObject(obj)) {
    Object.entries(obj as Object).forEach(([key, subObj]) => {
      paths(subObj, {
        parentKey: parentKey ? `${parentKey}.${key}` : key,
        includeAll,
      }).forEach((path) => leafs.push(path as TFieldName));
    });
  } else if (parentKey) {
    leafs.push(parentKey);
  }

  return leafs;
};

export const applyUpdates = <T extends Object>(
  obj: T,
  updates: UpdateObject<T>
): T => {
  const result = cloneDeep(obj);

  Object.keys(updates as any).forEach((path) =>
    set(result, path, get(updates as any, path))
  );

  return result;
};
