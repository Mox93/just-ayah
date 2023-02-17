import { HTMLAttributes } from "react";

import { ReactComponent as Cross } from "assets/icons/close-svgrepo-com.svg";
import { useDirT } from "hooks";
import { cn } from "utils";

interface CloseButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export default function CloseButton({
  className,
  dir,
  ...props
}: CloseButtonProps) {
  const dirT = useDirT();

  return (
    <button
      {...props}
      className={cn("CloseButton", className)}
      dir={dir || dirT}
    >
      <Cross className="icon" />
    </button>
  );
}
