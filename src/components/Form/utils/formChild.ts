import {
  Children,
  createElement,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  FieldPath,
  get,
  RegisterOptions,
  UseFormRegisterReturn,
  UseFormReturn,
} from "react-hook-form";

import { Merge } from "models";
import { PhoneNumberInfo } from "models/phoneNumber";
import { identity, mergeCallbacks } from "utils";
import { createModifier, Modifier } from "utils/transformer";

import ErrorMessage from "../ErrorMessage";

/*******************************\
|***** From Child Creation *****|
\*******************************/

type FormChild<Component = any> = Component & { formChild?: boolean };

/**
 * Must be the first modifier for it to work, otherwise the modifiers that proceed will overwrite it
 */
export const formChild: Modifier = (Component) => {
  (Component as FormChild).formChild = true;
  return Component;
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
  "required",
  "min",
  "max",
  "maxLength",
  "minLength",
  "pattern",
] as const;

type FormHook<TFieldValues> = Omit<UseFormReturn<TFieldValues>, "handleSubmit">;

type DefaultInputProps = InputHTMLAttributes<HTMLInputElement>;

type WithFormHook<TFieldValues> = NamedChildProps<TFieldValues> & {
  formHook?: FormHook<TFieldValues>;
};

type ProcessedProps<TProps, TFieldValues> = Partial<
  Merge<
    TProps,
    {
      isRequired: boolean;
      formHook: FormHook<TFieldValues>;
      rules: RegisterOptions<TFieldValues>;
    }
  >
>;

type RegisterMap<TFieldValues> = {
  [key in keyof TFieldValues]+?: UseFormRegisterReturn;
};

export interface NamedChildProps<
  TFieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TFieldName;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
}

/**
 * TODO:
 *  - In case of no formHook maybe we still want to parse the rules
 */
export const processProps = <TFieldValues>() =>
  createModifier<NamedChildProps<TFieldValues>>(
    ({ formHook, rules, name, ...props }: WithFormHook<TFieldValues>) => {
      if (!formHook) return { ...props, name };

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

      return processedProps;
    }
  );

export const selector = <TFieldValues>(convert: Function = identity) =>
  createModifier<NamedChildProps<TFieldValues>>(
    ({ formHook, name, ...props }: WithFormHook<TFieldValues>) => {
      if (!formHook) return { ...props, name };

      const {
        setValue,
        formState: { isSubmitted },
      } = formHook;

      return {
        ...props,
        name,
        formHook,
        setValue: (value: any) =>
          setValue(name, convert(value), { shouldValidate: isSubmitted }),
      };
    }
  );

export const singleField = <TFieldValues>() =>
  createModifier<NamedChildProps<TFieldValues>>(
    ({ formHook, rules, name, ...props }: WithFormHook<TFieldValues>) => {
      if (!formHook) return { ...props, name };

      const {
        register,
        formState: { errors },
      } = formHook;

      const errorMessage = get(errors, name);

      return {
        ...props,
        isInvalid: !!errorMessage,
        errorMessage: ErrorMessage({ name, errors }),
        ...register(name, rules),
      };
    }
  );

export const phoneNumberMapper = <TFieldValues>() =>
  createModifier<NamedChildProps<TFieldValues>>(
    ({ formHook, rules, name, ...props }: WithFormHook<TFieldValues>) => {
      if (!formHook) return { ...props, name };

      const fields = ["code", "number"] as const;
      const {
        register,
        setValue,
        formState: { errors, isSubmitted },
      } = formHook;

      const [registerMap, setRegisterMap] =
        useState<RegisterMap<PhoneNumberInfo>>();

      useEffect(() => {
        setRegisterMap(
          fields.reduce((obj, field) => {
            const processedRules = { ...rules };

            if (field === "number") {
              processedRules.pattern = {
                value: /^[0-9]{5,16}$/g,
                message: "wrongPhoneNumber",
              };
            }

            return {
              ...obj,
              [field]: register(`${name}.${field}` as any, processedRules),
            };
          }, {})
        );
      }, [name, rules]);

      const innerRef = fields.reduce(
        (obj, field) => ({ ...obj, [field]: registerMap?.[field]?.ref }),
        {}
      );

      const onChange = (value?: any) => {
        for (let field in value) {
          setValue(`${name}.${field}` as any, value![field], {
            shouldValidate: isSubmitted,
          });
        }
      };

      const fieldWithError = fields.find((field) =>
        get(errors, `${name}.${field}`)
      );

      return {
        ...props,
        onChange,
        innerRef,
        name,
        isInvalid: !!fieldWithError,
        errorMessage: ErrorMessage({
          name: `${name}.${fieldWithError}` as any,
          errors,
        }),
      };
    }
  );
