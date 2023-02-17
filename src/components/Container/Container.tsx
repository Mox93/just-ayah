import { forwardRef, ReactNode, Ref } from "react";

import { useDirT } from "hooks";
import { cn } from "utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  variant?: "menu" | "card" | "form";
  dir?: string;
  header?: ReactNode;
  footer?: ReactNode;
  flat?: boolean;
}

export default forwardRef(function Container(
  { className, children, variant, dir, header, footer, flat }: ContainerProps,
  ref: Ref<HTMLDivElement>
) {
  const dirT = useDirT();
  dir = dir || dirT;

  return (
    <div
      ref={ref}
      className={cn("Container", variant, className, { flat })}
      dir={dir}
    >
      {header && (
        <div className="header" dir={dir}>
          {header}
        </div>
      )}
      <div className="body" dir={dir}>
        {children}
      </div>
      {footer && (
        <div className="footer" dir={dir}>
          {footer}
        </div>
      )}
    </div>
  );
});
