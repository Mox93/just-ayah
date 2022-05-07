import {
  Children,
  createElement,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  useMemo,
} from "react";
import {
  FieldPath,
  get,
  RegisterOptions,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
  UseFormRegisterReturn,
  UseFormReturn,
} from "react-hook-form";

import { Merge } from "models";
import { PhoneNumberInfo } from "models/phoneNumber";
import { cn, identity, mergeCallbacks } from "utils";
import { createModifier, Modifier } from "utils/transformer";

import ErrorMessage from "../ErrorMessage";
import { FormProps } from "../Form";

/*************************\
|***** From Modifier *****|
\*************************/

export type FormHook<TFieldValues> = Omit<
  UseFormReturn<TFieldValues>,
  "handleSubmit"
>;

type SmartFormProps<TFieldValues> = Merge<
  FormProps,
  {
    config?: UseFormProps<TFieldValues>;
    onSubmit?: SubmitHandler<TFieldValues>;
    onFail?: SubmitErrorHandler<TFieldValues>;
  }
>;

export const smartForm = <TFieldValues>() =>
  createModifier<SmartFormProps<TFieldValues>>(
    ({ config, children, onSubmit, onFail, ...props }) => {
      const { handleSubmit, ...formHook } = useForm<TFieldValues>({
        ...config,
        // ...(config?.shouldUnregister === undefined
        //   ? { shouldUnregister: true }
        //   : {}),
      });

      const { reset } = formHook;

      const processedProps = {
        ...props,
        children: handleFormChildren(children, { formHook }),
        onSubmit: handleSubmit(onSubmit, onFail),
        onReset: () => reset(config?.defaultValue),
      };

      return processedProps;
    }
  );

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
  "disabled",
  "required",
  "min",
  "max",
  "maxLength",
  "minLength",
  "pattern",
] as const;

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
        setValue: setValueByName,
        formState: { isSubmitted },
      } = formHook;

      const setValue = (value: any) =>
        setValueByName(name, convert(value), { shouldValidate: isSubmitted });

      return {
        ...props,
        name,
        formHook,
        setValue,
      };
    }
  );

export const singleField = <TFieldValues>(convert: Function = identity) =>
  createModifier<NamedChildProps<TFieldValues>>(
    ({ formHook, rules, name, ...props }: WithFormHook<TFieldValues>) => {
      if (!formHook) return { ...props, name };

      const {
        register,
        formState: { errors },
      } = formHook;
      const errorMessage = get(errors, name);
      const { className } = props as DefaultInputProps;

      return {
        ...props,
        className: cn(className, "withErrors"),
        isInvalid: !!errorMessage,
        errorMessage: ErrorMessage({ name, errors }),
        ...convert(register(name, rules)),
      };
    }
  );

export const phoneNumberMapper = <TFieldValues>() =>
  createModifier<NamedChildProps<TFieldValues>>(
    ({ formHook, rules, name, ...props }: WithFormHook<TFieldValues>) => {
      if (!formHook) return { ...props, name };

      const fields = ["code", "number", "tags"] as const;
      const {
        register,
        setValue,
        formState: { errors, isSubmitted },
      } = formHook;

      const innerProps = useMemo<RegisterMap<PhoneNumberInfo>>(
        () => ({
          code: {
            ...register(`${name}.code` as any, rules),
            setValue: (value: any) =>
              setValue(`${name}.code` as any, value?.code, {
                shouldValidate: isSubmitted,
              }),
          },
          number: register(`${name}.number` as any, {
            ...rules,
            pattern: {
              value: /^[0-9]{5,16}$/g,
              message: "wrongPhoneNumber",
            },
          }),
          tags: register(
            `${name}.tags` as any,
            rules?.required
              ? {
                  validate: {
                    ...(typeof rules?.validate === "function"
                      ? { main: rules?.validate }
                      : rules?.validate),
                    contactMethod: (v?: any) =>
                      (!!v && (v.length || 0) > 0) || "noContactMethod",
                  },
                }
              : {}
          ),
        }),
        [name, rules]
      );

      const fieldWithError = fields.find((field) =>
        get(errors, `${name}.${field}`)
      );
      const { className } = props as DefaultInputProps;

      return {
        ...props,
        className: cn(className, "withErrors"),
        innerProps,
        name,
        isInvalid: !!fieldWithError,
        errorMessage: ErrorMessage({
          name: `${name}.${fieldWithError}` as any,
          errors,
        }),
      };
    }
  );

export const GovernorateMapper = <TFieldValues>() =>
  createModifier<
    NamedChildProps<TFieldValues> & {
      countryField?: FieldPath<TFieldValues>;
    }
  >(
    ({
      formHook,
      name,
      countryField,
      ...props
    }: WithFormHook<TFieldValues> & {
      countryField?: FieldPath<TFieldValues>;
    }) => {
      if (!formHook) return { ...props, name };

      const {
        watch,
        setValue,
        formState: { isSubmitted },
      } = formHook;

      const country = countryField && watch(countryField);

      return {
        ...props,
        name,
        country,
        formHook,
        setValue: (value: any) =>
          setValue(name, value, { shouldValidate: isSubmitted }),
      };
    }
  );
