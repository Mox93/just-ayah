import { cloneDeep, get, unset } from "lodash";
import { useEffect } from "react";
import { FieldPath, UseFormSetValue, UseFormWatch } from "react-hook-form";

import { omit, pass, paths } from "utils";

interface FormPersistConfig<
  TFieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  storageKey: string;
  watch: UseFormWatch<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  storage?: Storage;
  exclude?: TFieldName[];
  onDataRestored?: (data: TFieldValues) => void;
  validate?: boolean;
  dirty?: boolean;
  touch?: boolean;
  onTimeout?: () => void;
  timeout?: number;
}

const useFormPersist = <TFieldValues>(
  config?: FormPersistConfig<TFieldValues>
) => {
  const {
    storageKey,
    watch = pass({}),
    setValue = omit,
    storage,
    exclude = [],
    onDataRestored,
    validate,
    dirty,
    touch,
    onTimeout,
    timeout,
  } = config || {};

  const watchedValues = storageKey && watch();
  const _storage = storage || window.localStorage;
  const clearStorage = () => storageKey && _storage.removeItem(storageKey);

  // Read from storage
  useEffect(() => {
    if (!storageKey) return;

    const str = _storage.getItem(storageKey);

    if (str) {
      const { _timestamp = null, ...values } = JSON.parse(str);
      const currTimestamp = Date.now();

      if (timeout && currTimestamp - _timestamp > timeout) {
        onTimeout && onTimeout();
        clearStorage();
        return;
      }

      exclude.forEach((key) => unset(values, key));

      paths(values).forEach((path) => {
        const value = get(values, path);

        setValue(path as FieldPath<TFieldValues>, value, {
          shouldValidate: validate,
          shouldDirty: dirty,
          shouldTouch: touch,
        });
      });

      if (onDataRestored) {
        onDataRestored(values);
      }
    }
  }, [storage, storageKey, onDataRestored, setValue]);

  // Write to storage
  useEffect(() => {
    if (!storageKey) return;

    const values = cloneDeep(watchedValues);

    exclude.forEach((key) => unset(values, key));

    if (Object.keys(values).length) {
      if (timeout !== undefined) values._timestamp = Date.now();

      _storage.setItem(storageKey, JSON.stringify(values));
    }
  }, [watchedValues, timeout]);

  return { clear: clearStorage };
};

export default useFormPersist;
