import { cloneDeep, set } from "lodash";

import { GenericObject, Merge, SubsetOf, UpdateObject } from "models";

function applyUpdates<T>(obj: T, updates: UpdateObject<T> | SubsetOf<T>): T;
function applyUpdates<T1, T2>(obj: T1, updates: T2): Merge<T1, T2>;
function applyUpdates<T>(
  obj: SubsetOf<T>,
  updates: UpdateObject<T> | SubsetOf<T>
): SubsetOf<T> {
  const result = cloneDeep(obj) as GenericObject;
  Object.entries(updates as GenericObject).forEach(([path, value]) =>
    set(result, path, value)
  );
  return result;
}

export { applyUpdates };
