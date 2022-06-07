import { useMemo } from "react";
import { get } from "react-hook-form";

import ErrorMessage from "components/Form/ErrorMessage";
import { PhoneNumberInfo } from "models/phoneNumber";
import { cn } from "utils";
import { createModifier } from "utils/transformer";

import {
  DefaultInputProps,
  NamedChildProps,
  RegisterMap,
  WithFormHook,
} from "../formModifiers";

const fields = ["code", "number", "tags"] as const;

export const phoneNumberMapper = <TFieldValues>() =>
  createModifier<NamedChildProps<TFieldValues>>(
    ({
      formHook,
      rules,
      name,
      noErrorMessage,
      ...props
    }: WithFormHook<TFieldValues, NamedChildProps<TFieldValues>>) => {
      if (!formHook) return { ...props, name };

      const {
        register,
        setValue,
        formState: { errors, isSubmitted },
        watch,
      } = formHook;

      const innerProps = useMemo<RegisterMap<PhoneNumberInfo>>(() => {
        const [codeName, numberName, tagName]: any = fields.map(
          (subName) => `${name}.${subName}`
        );

        return {
          code: {
            ...register(codeName, rules),
            setValue: (value?: any) =>
              setValue(codeName, value?.code, {
                shouldValidate: isSubmitted,
              }),

            selected: watch(codeName),
          },
          number: register(numberName, {
            ...rules,
            pattern: {
              value: /^[0-9]{5,16}$/g,
              message: "wrongPhoneNumber",
            },
          }),
          tags: register(tagName, {
            ...(rules?.required && {
              validate: {
                ...(typeof rules?.validate === "function"
                  ? { main: rules?.validate }
                  : rules?.validate),
                contactMethod: (v?: any) =>
                  (!!v && (v.length || 0) > 0) || "noContactMethod",
              },
            }),
          }),
        };
      }, [name, rules, isSubmitted, register, setValue, watch]);

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
        errorMessage:
          !noErrorMessage &&
          ErrorMessage({
            name: `${name}.${fieldWithError}` as any,
            errors,
          }),
      };
    }
  );
