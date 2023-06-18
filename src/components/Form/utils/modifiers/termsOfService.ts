import { get, useFormState, useWatch } from "react-hook-form";

import { createModifier } from "utils/transformer";

import { ProcessedProps } from "../formModifiers";

const termsOfServiceMapper = createModifier(
  ({
    isRequired,
    isInvalid,
    errorMessage: _,
    rules: { required, ...rules } = {},
    ...props
  }: ProcessedProps<{ name: string }, Record<string, any>>) => {
    const { name, formHook: { setValue, control } = {} } = props;

    const terms = useWatch({ name, control });
    const { errors } = useFormState({ control, name });
    const errorMessage = get(errors, name);

    return {
      ...props,
      rules: { ...rules, required: true },
      onAccept: (url: string) => {
        setValue?.(name, url, { shouldValidate: true });
      },
      status: errorMessage ? "invalid" : terms ? "accepted" : "idle",
    };
  }
);

export default termsOfServiceMapper;
