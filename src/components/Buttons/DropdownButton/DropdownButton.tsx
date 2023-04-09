import { forwardRef } from "react";

import { SpinningArrow } from "components/Icons";
import { SpinningArrowVariant } from "components/Icons/SpinningArrow";
import { cn } from "utils";

import Button, { ButtonProps } from "../Button";

interface DropdownButtonProps extends ButtonProps {
  isOpen?: boolean;
  arrowVariant?: SpinningArrowVariant;
}

export default forwardRef<HTMLButtonElement, DropdownButtonProps>(
  function DropdownButton(
    { children, className, isOpen, dir, arrowVariant, ...props },
    ref
  ) {
    return (
      <Button
        {...{ ...props, ref, dir }}
        className={cn("DropdownButton", className, { withChildren: children })}
      >
        {children}
        <SpinningArrow {...{ isOpen, dir, variant: arrowVariant }} />
      </Button>
    );
  }
);
