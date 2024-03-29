import { FormHTMLAttributes } from "react";

import { Button, ButtonProps } from "components/Buttons";
import { useGlobalT } from "hooks";
import { cn } from "utils";

import InputGroup from "../InputGroup";

export type FormButton = Omit<ButtonProps, "type">;

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  submitProps?: FormButton;
  resetProps?: FormButton;
}

export default function Form({
  children,
  className,
  submitProps: {
    className: submitClassName,
    children: submitChildren,
    ...submitProps
  } = {},
  resetProps,
  dir,
  ...props
}: FormProps) {
  const glb = useGlobalT();

  return (
    <form {...props} className={cn("Form", className)} dir={dir}>
      {children}

      <InputGroup className="actions">
        <Button
          {...submitProps}
          className={cn(submitClassName, "submit")}
          type="submit"
          dir={dir}
        >
          {submitChildren ?? glb("submit")}
        </Button>
        {resetProps && (
          // TODO add popup for reset confirmation.
          <Button
            variant="danger-text"
            {...resetProps}
            className={cn(resetProps.className, "reset")}
            type="reset"
            dir={dir}
          >
            {resetProps.children ?? glb("clearForm")}
          </Button>
        )}
      </InputGroup>
    </form>
  );
}
