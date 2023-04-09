import { createModifier } from "utils/transformer";

import { ProcessedProps } from "../formModifiers";

const termsOfServiceMapper = createModifier(
  ({
    isRequired,
    rules: { required, ...rules } = {},
    ...props
  }: ProcessedProps<{ name: string }, Record<string, any>>) => {
    const { name, formHook: { setValue } = {} } = props;
    return {
      ...props,
      rules: { required: required || true, ...rules },
      noErrorMessage: true,
      onAccept: (url: string) => setValue?.(name, url),
    };
  }
);

export default termsOfServiceMapper;
