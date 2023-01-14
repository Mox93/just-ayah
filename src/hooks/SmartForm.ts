import { cloneDeep, isPlainObject, mapValues } from "lodash";
import { useCallback, useEffect } from "react";
import {
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
} from "react-hook-form";

import { applyUpdates, mergeCallbacks } from "utils";

import { LocalStorageOptions, useLocalStorage } from ".";

interface Storage<TData> extends LocalStorageOptions<TData> {
  key: string;
}

interface UseSmartFormProps<TFieldValues extends FieldValues>
  extends UseFormProps<TFieldValues> {
  storage?: Storage<TFieldValues>;
  resetOnSubmit?: boolean;
  resetToDefaultValues?: boolean;
  onSubmit?: SubmitHandler<TFieldValues>;
  onFail?: SubmitErrorHandler<TFieldValues>;
}

const useSmartForm = <TFieldValues extends FieldValues>({
  storage,
  resetOnSubmit,
  resetToDefaultValues,
  onSubmit,
  onFail,
  ...config
}: UseSmartFormProps<TFieldValues> = {}) => {
  const { key, ...options } = storage || {};
  const formSession = useLocalStorage<TFieldValues>(key, options);

  config = cloneDeep(config);

  const { handleSubmit, ...formHook } = useForm<TFieldValues>({
    ...config,
    defaultValues: formSession?.data
      ? config.defaultValues
        ? (applyUpdates(
            config.defaultValues,
            /**
             * TODO need to make sure the data coming from here only contains keys the user has changed,
             * otherwise it will needlessly override defaultValues
             **/
            formSession.data
          ) as typeof config.defaultValues)
        : (formSession?.data as typeof config.defaultValues)
      : config.defaultValues,
  });

  const { watch, reset } = formHook;

  useEffect(() => {
    //TODO filter out empty fields
    const subscription = watch((data) =>
      formSession?.set(data as TFieldValues)
    );
    return subscription.unsubscribe;
  }, [formSession, watch]);

  const { defaultValues } = config;

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
      formSession?.remove();
    },
    [defaultValues, reset, formSession, watch]
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
};

export default useSmartForm;
