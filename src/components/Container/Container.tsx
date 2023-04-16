import { forwardRef, ReactNode } from "react";

import { cn } from "utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  variant?: "menu" | "card" | "form";
  dir?: string;
  header?: ReactNode;
  footer?: ReactNode;
  flat?: boolean;
  alwaysRound?: boolean;
}

export default forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { className, children, variant, dir, header, footer, flat, alwaysRound },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("Container", variant, className, { flat, alwaysRound })}
      dir={dir}
    >
      {header && <div className="header">{header}</div>}
      <div className="body">{children}</div>
      {footer && <div className="footer">{footer}</div>}
    </div>
  );
});
