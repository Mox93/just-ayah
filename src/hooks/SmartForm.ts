import { cloneDeep, isPlainObject, mapValues } from "lodash";
import { useCallback } from "react";
import {
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
} from "react-hook-form";

import { mergeCallbacks, omit } from "utils";

import { useFormPersist } from ".";

interface UseSmartFormProps<TFieldValues> extends UseFormProps<TFieldValues> {
  storageKey?: string;
  resetOnSubmit?: boolean;
  resetToDefaultValues?: boolean;
  onSubmit?: SubmitHandler<TFieldValues>;
  onFail?: SubmitErrorHandler<TFieldValues>;
}

const useSmartForm = <TFieldValues>({
  storageKey,
  resetOnSubmit,
  resetToDefaultValues,
  onSubmit = omit,
  onFail,
  ...config
}: UseSmartFormProps<TFieldValues> = {}) => {
  config = cloneDeep(config);

  const { handleSubmit, ...formHook } = useForm<TFieldValues>(config);

  const { watch, setValue, reset } = formHook;

  // const clear = omit;
  const { clear } = useFormPersist(
    storageKey
      ? {
          storageKey,
          watch,
          setValue,
        }
      : undefined
  );

  const { defaultValues } = config;

  const handleReset = useCallback(
    (useDefaultValue?: boolean) => () => {
      const values = watch();
      const resetValues = mapValues(values as any, (value) =>
        isPlainObject(value) ? {} : null
      );

      const _defaultValues = useDefaultValue ? defaultValues : {};

      reset({ ...resetValues, ..._defaultValues } as any);
      clear();
    },
    [defaultValues, reset, clear, watch]
  );

  return {
    formHook,
    onSubmit: handleSubmit(
      mergeCallbacks(onSubmit, resetOnSubmit && handleReset()) as any,
      onFail
    ),
    onReset: handleReset(resetToDefaultValues),
  };
};

export default useSmartForm;
