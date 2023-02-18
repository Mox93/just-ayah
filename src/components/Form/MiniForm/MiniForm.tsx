import { FormHTMLAttributes, ReactElement } from "react";

import { Button } from "components/Buttons";
import { CheckMark } from "components/Icons";
import { useDirT } from "hooks";
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
  dir,
  isInvalid,
  submitProps,
  resetProps,
  ...props
}: MiniFormProps) {
  const dirT = useDirT();

  return (
    <form {...props} className={cn("MiniForm", className)} dir={dir || dirT}>
      {children}

      <Button
        variant="success-solid"
        dir={dir}
        {...submitProps}
        className={cn("submit", submitProps?.className)}
        type="submit"
        disabled={isInvalid}
        children={submitProps?.children || <CheckMark />}
      />
      {resetProps && (
        // TODO add popup for reset confirmation.
        <Button
          variant="danger-text"
          dir={dir}
          {...resetProps}
          className={cn("reset", resetProps?.className)}
          type="reset"
        />
      )}
    </form>
  );
}
