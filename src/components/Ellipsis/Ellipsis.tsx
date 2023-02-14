import { VFC, HTMLAttributes, ReactNode } from "react";

import { useDirT } from "hooks";
import { cn } from "utils";

interface EllipsisProps extends HTMLAttributes<HTMLElement> {
  Component?: string | VFC<HTMLAttributes<HTMLElement>>;
  position?: "start" | "center" | "end";
  children: string;
}

const Ellipsis: VFC<EllipsisProps> = ({
  children,
  className,
  Component = "p",
  position,
  dir,
  ...props
}) => {
  const dirT = useDirT();

  let parts: ReactNode = children;

  if (position === "center") {
    const part1 = children.slice(0, Math.ceil(children.length / 2 + 3));
    const part2 = children.slice(part1.length, -1);
    parts = (
      <>
        <span>{part1}</span>
        <span>{". . ."}</span>
        <span dir={dir || dirT}>{part2}</span>
      </>
    );
  }

  return (
    <Component
      {...props}
      className={cn("Ellipsis", className, position)}
      dir={dir || dirT}
    >
      {parts}
    </Component>
  );
};

export default Ellipsis;
