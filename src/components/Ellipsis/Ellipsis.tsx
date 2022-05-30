import { FC, HTMLAttributes, ReactNode } from "react";

import { cn } from "utils";

interface EllipsisProps extends HTMLAttributes<HTMLParagraphElement> {}

const Ellipsis: FC<EllipsisProps> = ({ children, ...props }) =>
  typeof children === "string" ? (
    <p {...props} className={cn("Ellipsis")}>
      {children}
    </p>
  ) : (
    <>{children}</>
  );

export default Ellipsis;

export const ellipsis = (value: ReactNode) => <Ellipsis>{value}</Ellipsis>;
