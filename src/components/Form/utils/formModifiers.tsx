import { InputHTMLAttributes, ReactElement, Ref } from "react";
import {
  FieldPath,
  get,
  RegisterOptions,
  UseFormRegisterReturn,
  UseFormReturn,
  useWatch,
  useFormState,
} from "react-hook-form";

import { Merge } from "models";
import { cn, identity, mergeCallbacks, mergeRefs } from "utils";
import { createModifier } from "utils/transformer";

import ErrorMessage from "../ErrorMessage";

/*************************\
|***** From Modifier *****|
\*************************/

type FormHook<TFieldValues extends {}> = Omit<
  UseFormReturn<TFieldValues>,
  "handleSubmit"
>;

/********************************\
|***** Form Child Modifiers *****|
\********************************/

const COMMON_RULES = [
  "disabled",
  "required",
  "min",
  "max",
  "maxLength",
  "minLength",
  "pattern",
] as const;

export type DefaultInputProps = InputHTMLAttributes<HTMLInputElement>;

export type WithFormHook<
  TFieldValues extends {},
  TExtraProps extends {} = {}
> = Merge<
  TExtraProps,
  {
    formHook?: FormHook<TFieldValues>;
  }
>;

export type ProcessedProps<TProps extends {}, TFieldValues extends {}> = Merge<
  TProps,
  {
    isRequired?: boolean;
    isInvalid?: boolean;
    errorMessage?: ReactElement;
    formHook: FormHook<TFieldValues>;
    rules: RegisterOptions<TFieldValues>;
  }
>;

export type RegisterMap<TFieldValues> = {
  [key in keyof TFieldValues]+?: UseFormRegisterReturn;
};

export interface NamedChildProps<
  TFieldValues extends {},
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TFieldName;
  rules?: RegisterOptions<TFieldValues, TFieldName>;
  noErrorMessage?: boolean;
  ref?: Ref<HTMLInputElement>;
}

interface SelectorHandlers {
  toValue?: Function;
  toSelected?: Function;
}

export const processProps = <TFieldValues extends {}>() =>
  createModifier<NamedChildProps<TFieldValues>>(
    ({
      formHook,
      rules,
      name,
      noErrorMessage,
      ...props
    }: WithFormHook<TFieldValues, NamedChildProps<TFieldValues>>) => {
      if (!formHook) return { ...props, name, rules };

      const { onChange, onBlur, value, required, className, ...rest } =
        props as DefaultInputProps;

      const { control } = formHook;
      const { errors } = useFormState({ control, name });
      const errorMessage = get(errors, name);

      const processedRules: typeof rules = { ...rules };
      const processedProps: ProcessedProps<DefaultInputProps, TFieldValues> = {
        ...rest,
        name,
        required,
        isRequired: required || !!processedRules.required,
        rules: processedRules,
        formHook,
        className: cn(className, "withErrors"),
        isInvalid: !!errorMessage,
        ...(noErrorMessage
          ? {}
          : { errorMessage: <ErrorMessage name={name} errors={errors} /> }),
      };

      COMMON_RULES.forEach((key) => {
        const output: any = processedRules[key] ?? processedProps[key];
        if (output !== undefined) processedRules[key] = output;
      });

      const newOnChange = mergeCallbacks(rules?.onChange, onChange);
      if (newOnChange) processedRules.onChange = newOnChange;

      const newOnBlur = mergeCallbacks(rules?.onBlur, onBlur);
      if (newOnBlur) processedRules.onBlur = newOnBlur;

      if (value !== undefined && processedRules.value === undefined)
        processedRules.value = value as any;

      return processedProps;
    }
  );

export const trimWhitespace = <TFieldValues extends {}>() =>
  createModifier<NamedChildProps<TFieldValues> & { keepWhitespace?: boolean }>(
    ({
      keepWhitespace,
      rules: { setValueAs = identity, ...rules } = {},
      ...props
    }) => ({
      ...props,
      rules: {
        ...rules,
        setValueAs: keepWhitespace
          ? setValueAs
          : (v: string) => setValueAs(v?.trim()),
      },
    })
  );

export const menu = <TFieldValues extends {}>({
  toValue = identity,
  toSelected = identity,
}: SelectorHandlers = {}) =>
  createModifier<NamedChildProps<TFieldValues>>(
    ({
      formHook,
      name,
      setValue: _setValue,
      ...props
    }: Merge<
      WithFormHook<TFieldValues, NamedChildProps<TFieldValues>>,
      { setValue?: (value: any) => void }
    >) => {
      if (!formHook) return { ...props, name };

      const { setValue: setValueByName, control } = formHook;

      const { isSubmitted } = useFormState({ control });

      const selected = useWatch({ control, name });

      const setValue = (value: any) => {
        _setValue?.(value);
        setValueByName(name, toValue(value), {
          shouldValidate: isSubmitted,
        });
      };

      return {
        ...props,
        name,
        formHook,
        setValue,
        selected: toSelected(selected),
      };
    }
  );

export const registerField = <TFieldValues extends {}>(
  convert: Function = identity
) =>
  createModifier<NamedChildProps<TFieldValues>>(
    ({
      formHook,
      rules,
      name,
      noErrorMessage,
      ref,
      ...props
    }: WithFormHook<TFieldValues, NamedChildProps<TFieldValues>>) => {
      if (!formHook) return { ...props, name, ref };

      const { register } = formHook;
      const { ref: registerRef, ...rest } = register(name, rules);

      return {
        ...props,
        ...convert({ ref: mergeRefs(registerRef, ref), ...rest }),
      };
    }
  );
