import { ReactNode, createContext, useContext } from "react";
import { UseFormReturn } from "react-hook-form";

import { assert, singleton } from "utils";

export default singleton(function formContextFactory<T extends {}>() {
  type FormHook = Omit<UseFormReturn<T>, "handleSubmit">;

  interface FormContext {
    noErrorMessage?: boolean;
    formHook: FormHook;
  }

  interface FormProviderProps extends FormContext {
    children: ReactNode;
  }

  const formContext = createContext<FormContext | null>(null);

  function FormProvider({ children, ...props }: FormProviderProps) {
    return (
      <formContext.Provider value={props}>{children}</formContext.Provider>
    );
  }

  function useFormContext() {
    const context = useContext(formContext);
    assert(context !== null);
    return context;
  }

  return [FormProvider, useFormContext] as const;
});
