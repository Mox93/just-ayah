import { Merge } from "models";
import { FormHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { UnpackNestedValue, useForm, UseFormProps } from "react-hook-form";
import { cn } from "utils";
import { useDirT, useGlobalT } from "utils/translation";
import { handleFormChildren } from "./utils/formChild";

export type FormProps<TFieldValues> = Merge<
  FormHTMLAttributes<HTMLFormElement>,
  {
    config?: UseFormProps<TFieldValues>;
    onSubmit: (
      data: UnpackNestedValue<TFieldValues>,
      event?: React.BaseSyntheticEvent
    ) => any | Promise<any>;
    submitButton?: ReactNode;
  }
>;

const Form = <TFieldValues,>({
  children,
  className,
  config,
  onSubmit,
  submitButton,
  ...props
}: PropsWithChildren<FormProps<TFieldValues>>) => {
  const dirT = useDirT();
  const glb = useGlobalT();

  const { handleSubmit, ...formHook } = useForm<TFieldValues>({
    ...config,
    // ...(config?.shouldUseNativeValidation === undefined
    //   ? { shouldUseNativeValidation: true }
    //   : {}),
  });

  const {
    formState: { isSubmitting, isSubmitSuccessful },
  } = formHook;

  return (
    <form
      {...props}
      className={cn("Form", className)}
      dir={dirT}
      onSubmit={handleSubmit(onSubmit)}
    >
      {handleFormChildren(children, { formHook })}

      <button
        className={cn({ isSubmitting, isSubmitSuccessful }, "submit")}
        type="submit"
        disabled={isSubmitting || isSubmitSuccessful}
      >
        {submitButton ?? glb("submit")}
      </button>
    </form>
  );
};

export default Form;
