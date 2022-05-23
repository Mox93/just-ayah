import { isArray, isPlainObject } from "lodash";
import { FieldPath } from "react-hook-form";

export const paths = <T>(obj: T, parentKey?: FieldPath<T>): FieldPath<T>[] => {
  const leaves: FieldPath<T>[] = [];

  if (isArray(obj) && obj.every((value) => !isPlainObject(value))) {
    parentKey && leaves.push(parentKey);
    // console.log("array of primitive types", obj);
  } else if (isArray(obj) || isPlainObject(obj)) {
    Object.keys(obj).forEach((key) => {
      paths((obj as any)[key], parentKey ? `${parentKey}.${key}` : key).forEach(
        (path) => leaves.push(path as FieldPath<T>)
      );
    });
  } else if (parentKey) {
    leaves.push(parentKey);
  }

  return leaves;
};
