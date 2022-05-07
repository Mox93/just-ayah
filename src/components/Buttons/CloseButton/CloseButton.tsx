import { ReactComponent as Cross } from "assets/icons/close-svgrepo-com.svg";
import { HTMLAttributes, VFC } from "react";
import { cn } from "utils";

interface CloseButtonProps extends HTMLAttributes<HTMLButtonElement> {}

const CloseButton: VFC<CloseButtonProps> = ({ className, ...props }) => {
  return (
    <button className={cn("CloseButton", className)} {...props}>
      <Cross className="icon" />
    </button>
  );
};

export default CloseButton;
