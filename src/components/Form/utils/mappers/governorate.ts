import { FieldPath, useFormState, useWatch } from "react-hook-form";

import { createModifier } from "utils/transformer";

import { NamedChildProps, WithFormHook } from "../formModifiers";

type GovernorateMapperProps<TFieldValues extends {}> =
  NamedChildProps<TFieldValues> & {
    countryField?: FieldPath<TFieldValues>;
  };

const governorateMapper = <TFieldValues extends {}>() =>
  createModifier<GovernorateMapperProps<TFieldValues>>(
    ({
      formHook,
      name,
      countryField,
      ...props
    }: WithFormHook<TFieldValues, GovernorateMapperProps<TFieldValues>>) => {
      if (!formHook) return { ...props, name };

      const { control, setValue } = formHook;

      const { isSubmitted } = useFormState({ control });

      const [selected, country] = useWatch({
        control,
        name: [name, ...(countryField ? [countryField] : [])],
      });

      return {
        ...props,
        name,
        ...(country && { country }),
        selected,
        formHook,
        setValue: (value: any) =>
          setValue(name, value, { shouldValidate: isSubmitted }),
      };
    }
  );

export default governorateMapper;
