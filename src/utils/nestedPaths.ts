import { isPlainObject } from "lodash";

import { Path } from "models";

interface Options<TFieldName> {
  parentKey?: TFieldName;
  includeAll?: boolean;
}

export const nestedPaths = <
  TFieldValues,
  TFieldName extends Path<TFieldValues> = Path<TFieldValues>
>(
  obj: TFieldValues,
  { parentKey, includeAll }: Options<TFieldName> = {}
): TFieldName[] => {
  const keys: TFieldName[] = [];

  if (
    !includeAll &&
    Array.isArray(obj) &&
    obj.every((value) => !isPlainObject(value))
  ) {
    parentKey && keys.push(parentKey);
    // console.log("array of primitive types", obj);
  } else if (Array.isArray(obj) || isPlainObject(obj)) {
    Object.entries(obj as Object).forEach(([key, subObj]) => {
      nestedPaths(subObj, {
        parentKey: parentKey ? `${parentKey}.${key}` : key,
        includeAll,
      }).forEach((path) => keys.push(path as TFieldName));
    });
  } else if (parentKey) {
    keys.push(parentKey);
  }

  return keys;
};
