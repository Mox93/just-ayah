import { FieldPath } from "react-hook-form";

import { createModifier } from "utils/transformer";

import { NamedChildProps, WithFormHook } from "../formModifiers";

type GovernorateMapperProps<TFieldValues> = NamedChildProps<TFieldValues> & {
  countryField?: FieldPath<TFieldValues>;
};

export const governorateMapper = <TFieldValues>() =>
  createModifier<GovernorateMapperProps<TFieldValues>>(
    ({
      formHook,
      name,
      countryField,
      ...props
    }: WithFormHook<TFieldValues, GovernorateMapperProps<TFieldValues>>) => {
      if (!formHook) return { ...props, name };

      const {
        watch,
        setValue,
        formState: { isSubmitted },
      } = formHook;

      return {
        ...props,
        name,
        ...(countryField && { country: watch(countryField) }),
        selected: watch(name),
        formHook,
        setValue: (value: any) =>
          setValue(name, value, { shouldValidate: isSubmitted }),
      };
    }
  );
