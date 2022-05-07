import { FC, FormHTMLAttributes } from "react";

import { Button, ButtonProps } from "components/Buttons";
import { cn } from "utils";
import { useDirT, useGlobalT } from "utils/translation";

import InputGroup from "../InputGroup";

type FormButton = Omit<ButtonProps, "type">;

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  submitProps?: FormButton;
  resetProps?: FormButton;
}

const Form: FC<FormProps> = ({
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
}) => {
  const dirT = useDirT();
  const glb = useGlobalT();

  return (
    <form {...props} className={cn("Form", className)} dir={dir || dirT}>
      {children}

      <InputGroup className="actions">
        <Button
          {...submitProps}
          className={cn(submitClassName, "submit")}
          type="submit"
        >
          {submitChildren ?? glb("submit")}
        </Button>
        {resetProps && (
          // TODO add popup for reset confirmation.
          <Button
            variant="danger-ghost"
            {...resetProps}
            className={cn(resetProps.className, "reset")}
            type="reset"
          >
            {resetProps.children ?? glb("clearForm")}
          </Button>
        )}
      </InputGroup>
    </form>
  );
};

export default Form;
