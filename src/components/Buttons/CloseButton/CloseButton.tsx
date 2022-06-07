import { ReactComponent as Cross } from "assets/icons/close-svgrepo-com.svg";
import { useDirT } from "hooks";
import { HTMLAttributes, VFC } from "react";
import { cn } from "utils";

interface CloseButtonProps extends HTMLAttributes<HTMLButtonElement> {}

const CloseButton: VFC<CloseButtonProps> = ({ className, dir, ...props }) => {
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
};

export default CloseButton;
