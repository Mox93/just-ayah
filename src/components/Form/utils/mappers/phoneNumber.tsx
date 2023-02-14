import { get } from "lodash";
import { useMemo } from "react";
import { useFormState, useWatch } from "react-hook-form";

import ErrorMessage from "components/Form/ErrorMessage";
import { SimplePhoneNumber } from "models/blocks";
import { cn, identity } from "utils";
import { createModifier } from "utils/transformer";

import {
  DefaultInputProps,
  NamedChildProps,
  RegisterMap,
  WithFormHook,
} from "../formModifiers";

const FIELDS = {
  CODE: "code",
  NUMBER: "number",
  TAGS: "tags",
} as const;

const phoneNumberMapper = <TFieldValues extends {}>() =>
  createModifier<NamedChildProps<TFieldValues>>(
    ({
      formHook,
      rules: { setValueAs, ...rules } = {},
      name,
      noErrorMessage,
      ...props
    }: WithFormHook<TFieldValues, NamedChildProps<TFieldValues>>) => {
      if (!formHook) return { ...props, name };

      const { CODE, NUMBER, TAGS } = Object.entries(FIELDS).reduce<
        Record<keyof typeof FIELDS, typeof name>
      >(
        (obj, [key, subName]) => ({
          ...obj,
          [key]: `${name}.${subName}` as typeof name,
        }),
        {} as any
      );

      const { register, setValue, control } = formHook;

      const { errors, isSubmitted } = useFormState({
        control,
        name: [CODE, NUMBER, TAGS],
      });

      const selected = useWatch({ control, name: CODE });

      const innerProps = useMemo<RegisterMap<SimplePhoneNumber>>(() => {
        return {
          code: {
            ...register(CODE, { ...rules, setValueAs }),
            setValue: (value?: any) =>
              setValue(CODE, value?.code, {
                shouldValidate: isSubmitted,
              }),
            selected,
          },
          number: register(NUMBER, {
            ...rules,

            setValueAs: (v: string) => (setValueAs || identity)(v?.trim()),
            pattern: {
              value: /^[0-9]{5,16}$/g,
              message: "wrongPhoneNumber",
            },
          }),
          tags: register(TAGS, {
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
      }, [
        register,
        CODE,
        rules,
        setValueAs,
        selected,
        NUMBER,
        TAGS,
        setValue,
        isSubmitted,
      ]);

      const fieldWithError = [CODE, NUMBER, TAGS].find((field) =>
        get(errors, field)
      );
      const { className } = props as DefaultInputProps;

      return {
        ...props,
        className: cn(className, "withErrors"),
        innerProps,
        name,
        isInvalid: !!fieldWithError,
        errorMessage: !noErrorMessage && (
          <ErrorMessage
            name={`${name}.${fieldWithError}` as any}
            errors={errors}
          />
        ),
      };
    }
  );

export default phoneNumberMapper;