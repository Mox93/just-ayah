import { Merge } from "models";
import { singleton } from "utils";
import { createModifier } from "utils/transformer";

import { FormProps } from "../../Form";
import formContextFactory from "../formContext";

export default singleton(function formFamilyFactory<T extends {}>() {
  const [FormProvider, useFormContext] = formContextFactory<T>();

  const formParent = createModifier<
    Merge<FormProps, Parameters<typeof FormProvider>[0]>
  >(({ children, formHook, noErrorMessage, ...props }) => ({
    ...props,
    children: (
      <FormProvider {...{ formHook, noErrorMessage }}>{children}</FormProvider>
    ),
  }));

  const formChild = createModifier((props) => ({
    ...useFormContext(),
    ...props,
  }));

  return { formParent, formChild };
});
