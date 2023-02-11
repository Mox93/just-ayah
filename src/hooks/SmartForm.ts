import { cloneDeep, isPlainObject, mapValues } from "lodash";
import { useCallback, useEffect } from "react";
import {
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
} from "react-hook-form";
import { PartialDeep } from "type-fest";

import { applyUpdates, mergeCallbacks } from "utils";

import { LocalStorageOptions, useLocalStorage } from ".";

interface Storage<TData> extends LocalStorageOptions<TData> {
  key: string;
}

interface UseSmartFormProps<TFieldValues extends FieldValues>
  extends UseFormProps<TFieldValues> {
  storage?: Storage<PartialDeep<TFieldValues>>;
  resetOnSubmit?: boolean;
  resetToDefaultValues?: boolean;
  onSubmit?: SubmitHandler<TFieldValues>;
  onFail?: SubmitErrorHandler<TFieldValues>;
}

export default function useSmartForm<TFieldValues extends FieldValues>({
  storage,
  resetOnSubmit,
  resetToDefaultValues,
  onSubmit,
  onFail,
  ...config
}: UseSmartFormProps<TFieldValues> = {}) {
  const { key, ...options } = storage || {};
  const formSession = useLocalStorage<PartialDeep<TFieldValues>>(key, options);

  config = cloneDeep(config);
  const { defaultValues } = config;

  const { handleSubmit, ...formHook } = useForm<TFieldValues>({
    ...config,
    defaultValues: (formSession?.data
      ? defaultValues
        ? applyUpdates(
            defaultValues,
            /**
            // TODO need to make sure the data coming from here only contains keys the user has changed,
             * otherwise it will needlessly override defaultValues
             **/
            formSession.data
          )
        : formSession?.data
      : defaultValues) as typeof defaultValues,
  });

  const { watch, reset } = formHook;

  useEffect(() => {
    if (!key) return;

    //TODO filter out empty fields
    const subscription = watch((data) =>
      formSession?.set(data as PartialDeep<TFieldValues>)
    );
    return subscription.unsubscribe;
  }, [key, watch]);

  const handleReset = useCallback(
    (keepDefaultValue?: boolean) => () => {
      const values = watch();
      const resetValues = mapValues(values, (value) =>
        isPlainObject(value) ? {} : null
      );

      reset({
        ...resetValues,
        ...(keepDefaultValue ? defaultValues : {}),
      } as typeof defaultValues);
      formSession?.clear();
    },
    [defaultValues, reset, watch]
  );

  return {
    formHook,
    onSubmit: handleSubmit(
      mergeCallbacks(onSubmit, resetOnSubmit && handleReset()) as NonNullable<
        typeof onSubmit
      >,
      onFail
    ),
    onReset: handleReset(resetToDefaultValues),
  };
}
