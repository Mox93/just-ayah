import { forwardRef, ReactNode, Ref } from "react";

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
  return (
    <div
      ref={ref}
      className={cn("Container", variant, className, { flat })}
      dir={dir}
    >
      {header && <div className="header">{header}</div>}
      <div className="body">{children}</div>
      {footer && <div className="footer">{footer}</div>}
    </div>
  );
});
