import { HTMLAttributes } from "react";

import { ReactComponent as Cross } from "assets/icons/close-svgrepo-com.svg";
import { cn } from "utils";

interface CloseButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export default function CloseButton({ className, ...props }: CloseButtonProps) {
  return (
    <button {...props} className={cn("CloseButton", className)}>
      <Cross className="icon" />
    </button>
  );
}
