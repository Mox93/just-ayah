import { Merge } from "models";
import {
  Children,
  createElement,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import {
  FieldPath,
  get,
  RegisterOptions,
  UseFormReturn,
  ValidationRule,
  ValidationValue,
} from "react-hook-form";
import { Modifier } from "utils/transformer";
import { renderErrorMessage } from "../ErrorMessage";

/***** From Child Creation *****/

type FormChild<Component = any> = Component & { formChild?: boolean };

/**
 * Must be the first modifier for it to work, otherwise the modifiers that proceed will overwrite it
 */
export const formChild: Modifier = (Component) => {
  (Component as FormChild).formChild = true;
  return Component;
};

/***** Form Child Validation *****/

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

/***** Form Child Modifiers *****/

const COMMON_RULES = [
  "required",
  "min",
  "max",
  "maxLength",
  "minLength",
  "pattern",
] as const;

type FormHook<TFieldValues> = Omit<UseFormReturn<TFieldValues>, "handleSubmit">;

type DefaultInputProps = InputHTMLAttributes<HTMLInputElement>;

type WithFormHook<TFieldValues, TProps> = TProps & {
  formHook?: FormHook<TFieldValues>;
};

type ProcessedProps<TProps, TFieldValues> = Partial<
  Merge<
    TProps,
    {
      setValue: (value: any) => void;
      isRequired: boolean;
      isInvalid: boolean;
      errorMessage: ReactNode;
      formHook: FormHook<TFieldValues>;
      rules: RegisterOptions<TFieldValues>;
    }
  >
>;

export interface NamedChildProps<
  TFieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TFieldName;
  rules?: RegisterOptions<TFieldValues, TFieldName>;
}

const matchRoles = (
  complexRule: ValidationRule | undefined,
  simpleRule: ValidationValue | undefined
): any => {
  return complexRule ?? simpleRule;
};

const mergeCallbacks = (...callbacks: (Function | undefined)[]) => {
  const validCallbacks = callbacks.filter(
    (callback) => typeof callback === "function"
  );

  return validCallbacks
    ? (...args: any) => {
        validCallbacks.forEach((callback) => callback!(...args));
      }
    : undefined;
};

/**
 * TODO:
 *  - In case of no formHook maybe we still want to parse the rules
 */
export const processProps =
  <TFieldValues>(): Modifier<NamedChildProps<TFieldValues>> =>
  (Component) =>
  ({
    formHook,
    rules,
    name,
    ...props
  }: WithFormHook<TFieldValues, NamedChildProps<TFieldValues>>) => {
    if (!formHook) return createElement(Component, { ...props, name } as any);

    const {
      setValue,
      formState: { errors },
    } = formHook;
    const { onChange, onBlur, value, required, ...rest } =
      props as DefaultInputProps;

    const processedRules = { ...rules };
    const processedProps: ProcessedProps<DefaultInputProps, TFieldValues> = {
      ...rest,
      setValue: (value) => setValue(name, value, { shouldValidate: true }),
      name,
      required,
      isRequired: required || !!processedRules.required,
      isInvalid: !!get(errors, name),
      errorMessage: renderErrorMessage({ name, errors }),
      rules: processedRules,
      formHook,
    };

    COMMON_RULES.forEach((key) => {
      const output = matchRoles(processedRules[key], processedProps[key]);
      if (output !== undefined) processedRules[key] = output;
    });

    const newOnChange = mergeCallbacks(rules?.onChange, onChange);
    if (newOnChange) processedRules.onChange = newOnChange;

    const newOnBlur = mergeCallbacks(rules?.onBlur, onBlur);
    if (newOnBlur) processedRules.onBlur = newOnBlur;

    if (value !== undefined && processedRules.value === undefined)
      processedRules.value = value as any;

    return createElement(Component, processedProps as any);
  };

export const simpleChild =
  <TFieldValues>(): Modifier<NamedChildProps<TFieldValues>> =>
  (Component) =>
  ({
    formHook,
    rules,
    name,
    ...props
  }: WithFormHook<TFieldValues, NamedChildProps<TFieldValues>>) => {
    if (!formHook) return createElement(Component, { ...props, name } as any);

    const { register } = formHook;

    return createElement(Component, {
      ...props,
      ...register(name, rules),
    } as any);
  };

/**
 * TODO:
 *  - Figure out a way to modify the register
 */
export const complexChild =
  <TFieldValues>(): Modifier<NamedChildProps<TFieldValues>> =>
  (Component) =>
  ({
    formHook,
    rules,
    name,
    ...props
  }: WithFormHook<TFieldValues, NamedChildProps<TFieldValues>>) => {
    if (!formHook) return createElement(Component, { ...props, name } as any);

    return createElement(Component, {
      ...props,
      rules,
      formHook,
      name,
    } as any);
  };
