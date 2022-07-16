import { FC, HTMLAttributes, ReactNode } from "react";

import { cn } from "utils";

interface EllipsisProps extends HTMLAttributes<HTMLParagraphElement> {
  component?: string | FC<any>;
}

const Ellipsis: FC<EllipsisProps> = ({
  children,
  className,
  component: Component = "p",
  ...props
}) => {
  return typeof children === "string" ? (
    <Component {...props} className={cn("Ellipsis", className)}>
      {children}
    </Component>
  ) : (
    <>{children}</>
  );
};

export default Ellipsis;

export const ellipsis = (props?: EllipsisProps) => (value: ReactNode) =>
  <Ellipsis {...props}>{value}</Ellipsis>;
