import { useEffect } from "react";

import { Merge } from "models";
import { singleton } from "utils";
import { createModifier } from "utils/transformer";

import { FormProps } from "../../Form";
import formContextFactory from "../formContext";

export default singleton(function formFamilyFactory<T extends {}>() {
  const { FormProvider, useFormContext } = formContextFactory<T>();

  const formParent = createModifier<
    Merge<FormProps, Parameters<typeof FormProvider>[0]>
  >(({ children, formHook, noErrorMessage, ...props }) => {
    const {
      setFocus,
      formState: { errors },
    } = formHook;

    useEffect(() => {
      const firstError = Object.keys(errors).find((field) => !!errors[field]);

      if (firstError) setFocus(firstError);
    }, [errors, setFocus]);

    return {
      ...props,
      children: (
        <FormProvider {...{ formHook, noErrorMessage }}>
          {children}
        </FormProvider>
      ),
    };
  });

  const formChild = createModifier((props) => ({
    ...useFormContext(),
    ...props,
  }));

  return { formParent, formChild };
});
