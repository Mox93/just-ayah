import { forwardRef, Ref } from "react";

import { DropdownArrow } from "components/Icons";
import { cn } from "utils";

import Button, { ButtonProps } from "../Button";

interface DropdownButtonProps extends ButtonProps {
  isOpen?: boolean;
}

const DropdownButton = (
  { children, className, isOpen, dir, ...props }: DropdownButtonProps,
  ref: Ref<HTMLButtonElement>
) => {
  return (
    <Button
      {...{ ...props, ref, dir }}
      className={cn("DropdownButton", className)}
    >
      {children}
      <DropdownArrow {...{ isOpen, dir }} />
    </Button>
  );
};

export default forwardRef(DropdownButton);
