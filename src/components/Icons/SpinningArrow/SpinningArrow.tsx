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
  const ref = useRef<SVGSVGElement>(null);
  const wasOpen = useRef(isOpen);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (ref.current) {
      if (isOpen && !wasOpen.current) {
        ref.current.classList.remove("closing");
        ref.current.classList.add("opening");
      } else if (!isOpen && wasOpen.current) {
        ref.current.classList.remove("opening");
        ref.current.classList.add("closing");
      }

      timeout = setTimeout(
        () => ref.current?.classList.remove("opening", "closing"),
        variant === "dropdown" ? 451 : 301
      );
    }

    wasOpen.current = isOpen;

    return () => timeout && clearTimeout(timeout);
  }, [isOpen, variant]);

  return (
    <div
      {...props}
      className={cn("SpinningArrow", className, variant)}
      dir={dir}
    >
      <Angle ref={ref} className={cn("icon", { isOpen })} />
    </div>
  );
}
