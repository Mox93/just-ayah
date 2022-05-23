import { FC, FormHTMLAttributes } from "react";

import { Button } from "components/Buttons";
import { useDirT } from "hooks";
import { cn } from "utils";

interface MiniFormProps extends FormHTMLAttributes<HTMLFormElement> {
  canReset?: boolean;
  isInvalid?: boolean;
}

const MiniForm: FC<MiniFormProps> = ({
  children,
  className,
  dir,
  canReset = false,
  isInvalid = false,
  ...props
}) => {
  const dirT = useDirT();

  return (
    <form className={cn("MiniForm", className)} {...props} dir={dir || dirT}>
      {children}

      <Button
        className="submit"
        variant="success-solid"
        type="submit"
        disabled={isInvalid}
      />
      {canReset && (
        // TODO add popup for reset confirmation.
        <Button variant="danger-text" className="reset" type="reset" />
      )}
    </form>
  );
};

export default MiniForm;
