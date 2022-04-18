import { Merge } from "models";
import {
  Children,
  createElement,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import { FieldPath, RegisterOptions, UseFormReturn } from "react-hook-form";

/*
const RULES_PROP = [
  "required",
  "min",
  "max",
  "maxLength",
  "minLength",
  "pattern",
  // "validate",
  // "valueAsNumber",
  // "valueAsDate",
  // "value",
  // "setValueAs",
  // "shouldUnregister",
  // "onChange",
  // "onBlur",
  "disabled",
  // "deps",
] as const;

const EXCLUDE_PROPS = ["onChange", "onBlur", "value"] as const;
*/

type FormHook<TFieldValues> = Omit<UseFormReturn<TFieldValues>, "handleSubmit">;

type FormContainerProps<TFieldValues> = Merge<
  InputHTMLAttributes<HTMLInputElement>,
  { formHook?: FormHook<TFieldValues> }
>;

type FormChildProps<
  TFieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Merge<
  Omit<FormContainerProps<TFieldValues>, "children">,
  {
    name: TFieldName;
    rules?: RegisterOptions<TFieldValues, TFieldName>;
  }
>;

type WithFormChild<TComponent> = TComponent & { formChild?: boolean };

type ProcessedProps<TProps> = Partial<
  Merge<TProps, { setValue: (value: any) => void }>
>;

const isFormChild = <TFieldValues>(
  component: any
): component is ReactElement<
  FormChildProps<TFieldValues> | FormChildProps<TFieldValues>
> => {
  return component?.type?.formChild;
};

export type FormContainer<TFieldValues, TProps = any> = WithFormChild<
  (
    props: Merge<TProps, FormContainerProps<TFieldValues>>
  ) => ReactElement | null
>;

export type FormChild<TFieldValues, TProps = any> = WithFormChild<
  (props: Merge<TProps, FormChildProps<TFieldValues>>) => ReactElement | null
>;

export const handleFormChildren = <TFieldValues>(
  children: ReactNode,
  props: FormContainerProps<TFieldValues>
) =>
  Children.map(children, (child) =>
    isFormChild<TFieldValues>(child)
      ? createElement(child.type, {
          ...props,
          ...child.props,
          key: child.props.name,
        })
      : child
  );

/**
 * TODO:
 *  - Improve type annotation
 *  - Handle register and rules
 */

export const formChild = <TFieldValues>(
  Component: (props: any) => ReactElement | null
) => {
  const child: FormChild<TFieldValues> = ({ formHook, rules, ...props }) => {
    if (!formHook) return createElement(Component, props);

    const { onChange, onBlur, value, required, name, ...rest } = props;

    const { setValue, register } = formHook;
    const newProps: ProcessedProps<typeof props> = {
      setValue: (value) => setValue(name, value),
    };
    const processedRules: Partial<typeof rules> = { ...rules };

    if (processedRules?.required !== undefined) {
      newProps.required = !!processedRules?.required;
    } else if (required !== undefined) {
      processedRules.required = required;
    }

    return createElement(Component, {
      ...rest,
      ...newProps,
      ...register(name, rules),
    });
  };

  child.formChild = true;

  return child;
};

export const formContainer = <TFieldValues, TProps>(
  Component: (props: TProps) => ReactElement | null,
  ...propsModifiers: (<TPropsIn, TPropsOut>(props: TPropsIn) => TPropsOut)[]
) => {
  const child: FormContainer<TFieldValues> = (props) => {
    let newProps = { ...props };
    propsModifiers.forEach((modifier) => (newProps = modifier(newProps)));

    return createElement(Component, newProps as TProps);
  };

  child.formChild = true;

  return child;
};
