import { cloneDeep, isPlainObject } from "lodash";
import { useEffect, useRef } from "react";
import {
  SubmitErrorHandler,
  useForm,
  UseFormProps,
  UseFormReset,
} from "react-hook-form";
import { PartialDeep } from "type-fest";

import { LocalStorageOptions, useLocalStorage } from "hooks";
import { applyUpdates, singleton } from "utils";

export type SubmitHandler<T extends {}> = (
  data: T,
  options: {
    event?: React.BaseSyntheticEvent;
    reset: UseFormReset<T>;
  }
) => any | Promise<any>;

export default singleton(function formHookFactory<T extends {}>() {
  interface Storage extends LocalStorageOptions<PartialDeep<T>> {
    key: string;
  }

  interface _UseFormProps extends UseFormProps<T> {
    storage?: Storage;
    resetToDefaultValues?: boolean;
    onSubmit?: SubmitHandler<T>;
    onFail?: SubmitErrorHandler<T>;
  }

  function _useForm({
    storage,
    resetToDefaultValues,
    onSubmit,
    onFail,
    ...config
  }: _UseFormProps) {
    const { key, ...options } = storage || {};
    const formSession = useLocalStorage<PartialDeep<T>>(key, options);

    config = cloneDeep(config);
    const { defaultValues } = config;

    const { handleSubmit, ...formHook } = useForm<T>({
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
        formSession?.set(data as PartialDeep<T>);
        emptyValues.current = Object.entries(data).reduce(
          (obj, [key, value]) => {
            obj[key] = isPlainObject(value) ? {} : null;
            return obj;
          },
          {} as any
        );
      });

      return subscription.unsubscribe;
    }, [watch]);

    const handleReset: UseFormReset<T> = (values, options) => {
      reset({ ...emptyValues.current, ...values }, options);
      formSession?.clear();
    };

    return {
      formHook,
      onSubmit: handleSubmit(
        (data, event) =>
          onSubmit?.(data, {
            event,
            reset: handleReset,
          }),
        onFail
      ),
      onReset: () => handleReset(defaultValues as T),
    };
  }

  return _useForm;
});
