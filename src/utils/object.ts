import { isArray, isPlainObject } from "lodash";
import { FieldPath } from "react-hook-form";

interface PathsOptions<TFieldName> {
  parentKey?: TFieldName;
  includeAll?: boolean;
}

export const paths = <
  TFieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
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
    Object.entries(obj).forEach(([key, subObj]) => {
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
