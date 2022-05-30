import { FC, HTMLAttributes, ReactNode } from "react";

import { cn } from "utils";

interface EllipsisProps extends HTMLAttributes<HTMLParagraphElement> {}

const Ellipsis: FC<EllipsisProps> = ({ children, className, ...props }) =>
  typeof children === "string" ? (
    <p {...props} className={cn("Ellipsis", className)}>
      {children}
    </p>
  ) : (
    <>{children}</>
  );

export default Ellipsis;

export const ellipsis = (props?: EllipsisProps) => (value: ReactNode) =>
  <Ellipsis {...props}>{value}</Ellipsis>;
