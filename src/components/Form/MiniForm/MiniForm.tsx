import { FormHTMLAttributes, ReactElement } from "react";

import { ReactComponent as CheckMarkIcon } from "assets/icons/checkmark-svgrepo-com.svg";
import { Button } from "components/Buttons";
import { cn } from "utils";

import { FormButton } from "../Form";

interface MiniFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactElement;
  submitProps?: FormButton;
  resetProps?: FormButton;
  isInvalid?: boolean;
}

export default function MiniForm({
  children,
  className,
  isInvalid,
  submitProps,
  resetProps,
  ...props
}: MiniFormProps) {
  return (
    <form {...props} className={cn("MiniForm", className)}>
      {children}

      <Button
        variant="success-solid"
        {...submitProps}
        className={cn("submit", submitProps?.className)}
        type="submit"
        disabled={isInvalid}
        children={
          submitProps?.children || <CheckMarkIcon className="CheckMark icon" />
        }
      />
      {resetProps && (
        // TODO add popup for reset confirmation.
        <Button
          variant="danger-text"
          {...resetProps}
          className={cn("reset", resetProps?.className)}
          type="reset"
        />
      )}
    </form>
  );
}
