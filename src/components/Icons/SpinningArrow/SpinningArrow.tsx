import { HTMLAttributes, useEffect, useRef } from "react";

import { ReactComponent as Angle } from "assets/icons/angle-up-svgrepo-com.svg";
import { cn } from "utils";

export type SpinningArrowVariant = "dropdown" | "expand";
interface SpinningArrowProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  variant?: SpinningArrowVariant;
}

export default function SpinningArrow({
  isOpen,
  className,
  dir,
  variant = "dropdown",
  ...props
}: SpinningArrowProps) {
  const wasOpen = useRef(isOpen);

  useEffect(() => {
    wasOpen.current = isOpen;
  }, [isOpen]);

  return (
    <div
      {...props}
      className={cn("SpinningArrow", className, variant)}
      dir={dir}
    >
      <Angle
        className={cn("icon", {
          isOpen,
          opening: isOpen && !wasOpen.current,
          closing: wasOpen.current && !isOpen,
        })}
      />
    </div>
  );
}
