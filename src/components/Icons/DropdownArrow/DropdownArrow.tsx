import { HTMLAttributes, useEffect, useRef } from "react";

import { ReactComponent as Angle } from "assets/icons/angle-up-svgrepo-com.svg";
import { cn } from "utils";
import { useDirT } from "hooks";

interface DropdownArrowProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
}

export default function DropdownArrow({
  isOpen,
  className,
  dir,
  ...props
}: DropdownArrowProps) {
  const dirT = useDirT();
  const wasOpen = useRef(isOpen);

  useEffect(() => {
    wasOpen.current = isOpen;
  }, [isOpen]);

  return (
    <div
      {...props}
      className={cn("DropdownArrow", className)}
      dir={dir || dirT}
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
