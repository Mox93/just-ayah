import { cloneDeep, isPlainObject } from "lodash";
import { useEffect, useRef } from "react";
import {
  SubmitErrorHandler,
  useForm,
  UseFormProps,
  UseFormReset,
} from "react-hook-form";
import { PartialDeep } from "type-fest";

import { applyUpdates } from "utils";

import { LocalStorageOptions, useLocalStorage } from ".";

interface Storage<TData> extends LocalStorageOptions<TData> {
  key: string;
}

export type SubmitHandler<TFieldValues extends {}> = (
  data: TFieldValues,
  options: {
    event?: React.BaseSyntheticEvent;
    reset: UseFormReset<TFieldValues>;
  }
) => any | Promise<any>;

interface UseSmartFormProps<TFieldValues extends {}>
  extends UseFormProps<TFieldValues> {
  storage?: Storage<PartialDeep<TFieldValues>>;
  resetToDefaultValues?: boolean;
  onSubmit?: SubmitHandler<TFieldValues>;
  onFail?: SubmitErrorHandler<TFieldValues>;
}

export default function useSmartForm<TFieldValues extends {}>({
  storage,
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

  const emptyValues = useRef<any>();

  useEffect(() => {
    //TODO filter out empty fields
    const subscription = watch((data) => {
      formSession?.set(data as PartialDeep<TFieldValues>);
      emptyValues.current = Object.entries(data).reduce(
        (obj, [key, value]) => ({
          ...obj,
          [key]: isPlainObject(value) ? {} : null,
        }),
        {}
      );
    });

    return subscription.unsubscribe;
  }, [watch]);

  const handleReset: UseFormReset<TFieldValues> = (values, options) => {
    reset({ ...emptyValues.current, ...values }, options);
    formSession?.clear();
  };

  return {
    formHook,
    onSubmit: handleSubmit(
      // FIXME handleReset should only happen when submit is successful
      (data, event) =>
        onSubmit?.(data, {
          event,
          reset: handleReset,
        }),
      onFail
    ),
    onReset: () => handleReset(defaultValues as TFieldValues),
  };
}
