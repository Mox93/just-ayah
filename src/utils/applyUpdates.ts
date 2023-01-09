import { cloneDeep, set } from "lodash";

import { GenericObject, Merge, SubsetOf, UpdateObject } from "models";

interface ApplyUpdates {
  <T>(obj: T, updates: UpdateObject<T> | SubsetOf<T>): T;
  <T>(obj: SubsetOf<T>, updates: UpdateObject<T> | SubsetOf<T>): SubsetOf<T>;
  <T1, T2>(obj: T1, updates: T2): Merge<T1, T2>;
}

export const applyUpdates: ApplyUpdates = <T>(
  obj: SubsetOf<T>,
  updates: UpdateObject<T> | SubsetOf<T>
): SubsetOf<T> => {
  const result = cloneDeep(obj) as GenericObject;
  Object.entries(updates as GenericObject).forEach(([path, value]) =>
    set(result, path, value)
  );
  return result;
};
