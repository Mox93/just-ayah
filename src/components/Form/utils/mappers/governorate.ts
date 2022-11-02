import { FieldPath, FieldValues } from "react-hook-form";

import { createModifier } from "utils/transformer";

import { NamedChildProps, WithFormHook } from "../formModifiers";

type GovernorateMapperProps<TFieldValues extends FieldValues> =
  NamedChildProps<TFieldValues> & {
    countryField?: FieldPath<TFieldValues>;
  };

const governorateMapper = <TFieldValues extends FieldValues>() =>
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

export default governorateMapper;
