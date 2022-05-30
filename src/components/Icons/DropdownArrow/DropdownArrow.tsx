import { HTMLAttributes, useEffect, useReducer, VFC } from "react";

import { ReactComponent as Angle } from "assets/icons/angle-up-svgrepo-com.svg";
import { cn } from "utils";
import { useDirT } from "hooks";

type State = { wasOpen: boolean; action?: "opening" | " closing" };
type Action = { isOpen?: boolean };

const reduce = ({ wasOpen, action }: State, { isOpen }: Action): State => {
  switch (isOpen) {
    case undefined:
      return { wasOpen: false };
    case wasOpen:
      return { wasOpen, action };
    default:
      return { wasOpen: isOpen, action: isOpen ? "opening" : " closing" };
  }
};

interface DropdownArrowProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
}

const DropdownArrow: VFC<DropdownArrowProps> = ({
  isOpen,
  className,
  dir,
  ...props
}) => {
  const dirT = useDirT();

  const [{ action }, dispatch] = useReducer(reduce, { wasOpen: false });
  useEffect(() => dispatch({ isOpen }), [isOpen]);

  return (
    <div
      {...props}
      className={cn("DropdownArrow", className)}
      dir={dir || dirT}
    >
      <Angle className={cn("icon", { isOpen }, action)} />
    </div>
  );
};

export default DropdownArrow;
