import { get } from "lodash";
import { useMemo } from "react";
import { useFormState, useWatch } from "react-hook-form";

import { SimplePhoneNumber } from "models/blocks";
import { cn } from "utils";
import { createModifier } from "utils/transformer";

import ErrorMessage from "../../ErrorMessage";

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

export default function phoneNumberMapper<TFieldValues extends {}>() {
  return createModifier<NamedChildProps<TFieldValues>>(
    ({
      formHook,
      rules: { setValueAs, ...rules } = {},
      name,
      noErrorMessage,
      ...props
    }: WithFormHook<TFieldValues, NamedChildProps<TFieldValues>>) => {
      if (!formHook) return { ...props, name };

      const { CODE, NUMBER, TAGS } = Object.entries(FIELDS).reduce(
        (obj, [key, subName]) => {
          obj[key as keyof typeof FIELDS] = `${name}.${subName}` as typeof name;
          return obj;
        },
        {} as Record<keyof typeof FIELDS, typeof name>
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
            setValueAs: (v: string) =>
              setValueAs ? setValueAs(v?.trim()) : v?.trim(),
            pattern: {
              value: /^[0-9]{5,16}$/g,
              message: "wrongPhoneNumber",
            } as any, // HACK: TS is trying to assign the inferred type to undefined
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
          <ErrorMessage name={fieldWithError as any} errors={errors} />
        ),
      };
    }
  );
}
