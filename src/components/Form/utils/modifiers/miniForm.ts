import { createModifier } from "utils/transformer";

import { WithFormHook } from "../formModifiers";

const miniFormMapper = createModifier(
  ({ formHook, ...props }: WithFormHook<{}, {}>) => ({
    ...props,
    formHook,
    ...(formHook && {
      isInvalid: Object.keys(formHook.formState.errors || {}).length > 0,
    }),
  })
);

export default miniFormMapper;
