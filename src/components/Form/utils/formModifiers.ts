import {
  Children,
  createElement,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import {
  FieldValues,
  FieldPath,
  get,
  RegisterOptions,
  UseFormRegisterReturn,
  UseFormReturn,
} from "react-hook-form";

import { Converter, Merge } from "models";
import { cn, identity, mergeCallbacks, mergeRefs, pass } from "utils";
import { createModifier, Transformer, transformer } from "utils/transformer";

import ErrorMessage from "../ErrorMessage";
import { FormProps } from "../Form";

/*************************\
|***** From Modifier *****|
\*************************/

export type FormHook<TFieldValues extends FieldValues> = Omit<
  UseFormReturn<TFieldValues>,
  "handleSubmit"
>;

type GenerateExtraProps<TFieldValues extends FieldValues, TProps = {}> = (
  props: Merge<
    TProps,
    {
      formHook: FormHook<TFieldValues>;
    }
  >
) => Record<string, any>;

type SmartFormProps<TFieldValues extends FieldValues> = Merge<
  FormProps,
  {
    formHook: FormHook<TFieldValues>;
    noErrorMessage?: boolean;
  }
>;

export const smartForm = <TFieldValues extends FieldValues>(
  extraProps: GenerateExtraProps<TFieldValues> = pass({})
) =>
  createModifier<SmartFormProps<TFieldValues>>(
    ({
      formHook,
      children,
      noErrorMessage,
      submitProps,
      ...props
    }: SmartFormProps<TFieldValues>) => {
      const {
        formState: { isSubmitting }, // TODO this is not working need to use Loading hook
      } = formHook;

      return {
        ...props,
        submitProps: { isLoading: isSubmitting, ...submitProps },
        children: handleFormChildren(children, { formHook, noErrorMessage }),
        ...extraProps({ formHook }),
      };
    }
  );

/*******************************\
|***** From Child Creation *****|
\*******************************/

type FormChild<Component = any> = Component & { formChild?: boolean };

/**
 * Must be the first modifier for it to work, otherwise the modifiers that proceed will overwrite it
 */

export const formChild: Transformer = (Component, ...modifiers) => {
  const Child = transformer(Component, ...modifiers);
  (Child as FormChild).formChild = true;
  return Child;
};

/*********************************\
|***** Form Child Validation *****|
\*********************************/

const isFormChild = (component: any): component is ReactElement => {
  return component?.type?.formChild;
};

export const handleFormChildren = (
  children: ReactNode,
  props: any
): ReactNode => {
  return Children.map(children, (child) => {
    return isFormChild(child)
      ? createElement(child.type, {
          ...props,
          ...child.props,
          key: child.props.name,
        })
      : child;
  });
};

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
  TFieldValues extends FieldValues,
  TExtraProps = {}
> = Merge<
  TExtraProps,
  {
    formHook?: FormHook<TFieldValues>;
  }
>;

type ProcessedProps<TProps, TFieldValues extends FieldValues> = Partial<
  Merge<
    TProps,
    {
      isRequired: boolean;
      formHook: FormHook<TFieldValues>;
      rules: RegisterOptions<TFieldValues>;
    }
  >
>;

export type RegisterMap<TFieldValues> = {
  [key in keyof TFieldValues]+?: UseFormRegisterReturn;
};

export interface NamedChildProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TFieldName;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
  noErrorMessage?: boolean;
  ref?: Ref<HTMLInputElement>;
}

type WithExtraProps<
  TFieldValues extends FieldValues,
  TProps = {},
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Merge<
  TProps,
  {
    extraProps?: GenerateExtraProps<TFieldValues, { name: TFieldName }>;
  }
>;

type SelectorHandlers<TFieldValues extends FieldValues> = WithExtraProps<
  TFieldValues,
  {
    toValue?: Function;
    toSelected?: Function;
  }
>;

export const processProps = <TFieldValues extends FieldValues>(
  convert: Converter<
    ProcessedProps<DefaultInputProps, TFieldValues>,
    ProcessedProps<DefaultInputProps, TFieldValues>
  > = identity
) =>
  createModifier<NamedChildProps<TFieldValues>>(
    ({
      formHook,
      rules,
      name,
      ...props
    }: WithFormHook<TFieldValues, NamedChildProps<TFieldValues>>) => {
      if (!formHook) return { ...props, name, rules };

      const { onChange, onBlur, value, required, ...rest } =
        props as DefaultInputProps;

      const processedRules = { ...rules };
      const processedProps: ProcessedProps<DefaultInputProps, TFieldValues> = {
        ...rest,
        name,
        required,
        isRequired: required || !!processedRules.required,
        rules: processedRules,
        formHook,
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

      return convert(processedProps);
    }
  );

export const trimWhitespace = <TFieldValues extends FieldValues>() =>
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

export const menu = <TFieldValues extends FieldValues>({
  toValue = identity,
  toSelected = identity,
  extraProps = pass({}),
}: SelectorHandlers<TFieldValues> = {}) =>
  createModifier<NamedChildProps<TFieldValues>>(
    ({
      formHook,
      name,
      ...props
    }: WithFormHook<TFieldValues, NamedChildProps<TFieldValues>>) => {
      if (!formHook) return { ...props, name };

      const {
        setValue: setValueByName,
        formState: { isSubmitted },
        watch,
      } = formHook;

      const setValue = (value: any) =>
        setValueByName(name, toValue(value), {
          shouldValidate: isSubmitted,
        });

      return {
        ...props,
        name,
        formHook,
        setValue,
        selected: toSelected(watch(name)),
        ...extraProps({ name, formHook }),
      };
    }
  );

export const registerField = <TFieldValues extends FieldValues>(
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

      const {
        register,
        formState: { errors },
      } = formHook;
      const errorMessage = get(errors, name);
      const { className } = props as DefaultInputProps;
      const { ref: registerRef, ...rest } = register(name, rules);

      return {
        ...props,
        className: cn(className, "withErrors"),
        isInvalid: !!errorMessage,
        ...(noErrorMessage
          ? {}
          : { errorMessage: ErrorMessage({ name, errors }) }),
        ...convert({ ref: mergeRefs(registerRef, ref), ...rest }),
      };
    }
  );
