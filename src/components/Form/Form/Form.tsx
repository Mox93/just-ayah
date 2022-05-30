import { FC, FormHTMLAttributes } from "react";

import { Button, ButtonProps } from "components/Buttons";
import Container from "components/Container";
import { useDirT, useGlobalT } from "hooks";
import { cn } from "utils";

import InputGroup from "../InputGroup";

export type FormButton = Omit<ButtonProps, "type">;

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
    <Container variant="card" className={cn("Form", className)}>
      <form {...props} className="body" dir={dir || dirT}>
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
              variant="danger-text"
              {...resetProps}
              className={cn(resetProps.className, "reset")}
              type="reset"
            >
              {resetProps.children ?? glb("clearForm")}
            </Button>
          )}
        </InputGroup>
      </form>
    </Container>
  );
};

export default Form;
