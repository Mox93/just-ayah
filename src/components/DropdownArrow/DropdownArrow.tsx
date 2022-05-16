import { HTMLAttributes, useEffect, useReducer, VFC } from "react";

import { ReactComponent as Angle } from "assets/icons/angle-up-svgrepo-com.svg";
import { cn } from "utils";

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

interface DropdownArrowProps extends HTMLAttributes<SVGSVGElement> {
  isOpen?: boolean;
}

const DropdownArrow: VFC<DropdownArrowProps> = ({
  isOpen,
  className,
  ...props
}) => {
  const [{ action }, dispatch] = useReducer(reduce, { wasOpen: false });
  useEffect(() => dispatch({ isOpen }), [isOpen]);

  return (
    <Angle
      {...props}
      className={cn("DropdownArrow", { isOpen }, action, className)}
    />
  );
};

export default DropdownArrow;
