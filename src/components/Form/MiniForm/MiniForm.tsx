import { FC, FormHTMLAttributes } from "react";

import { Button } from "components/Buttons";
import { CheckMark } from "components/Icons";
import { useDirT } from "hooks";
import { cn } from "utils";

import { FormButton } from "../Form";

interface MiniFormProps extends FormHTMLAttributes<HTMLFormElement> {
  submitProps?: FormButton;
  resetProps?: FormButton;

  isInvalid?: boolean;
}

const MiniForm: FC<MiniFormProps> = ({
  children,
  className,
  dir,
  isInvalid,
  submitProps,
  resetProps,
  ...props
}) => {
  const dirT = useDirT();

  return (
    <form className={cn("MiniForm", className)} {...props} dir={dir || dirT}>
      {children}

      <Button
        variant="success-solid"
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
          {...resetProps}
          className={cn("reset", resetProps?.className)}
          type="reset"
        />
      )}
    </form>
  );
};

export default MiniForm;
