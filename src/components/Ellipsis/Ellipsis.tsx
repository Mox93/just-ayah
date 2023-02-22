import {
  ComponentType,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useDirT } from "hooks";
import { cn } from "utils";

interface EllipsisProps extends HTMLAttributes<HTMLElement> {
  Component?:
    | string
    | ComponentType<
        DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      >;
  position?: "start" | "center" | "end";
  children: string;
}

export default function Ellipsis({
  children,
  className,
  Component = "span",
  position,
  dir,
  ...props
}: EllipsisProps) {
  const dirT = useDirT();
  const outerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLElement>(null);

  const [parts, setParts] = useState<ReactNode>(children);

  useLayoutEffect(() => {
    const innerWidth = innerRef.current?.getBoundingClientRect().width || 0;
    const outerWidth = outerRef.current?.getBoundingClientRect().width || 0;

    if (position === "center" && innerWidth > outerWidth) {
      const part1 = children.slice(0, Math.ceil(children.length / 2));
      const part2 = children.slice(part1.length);
      setParts(
        <>
          <span className="start">{part1}</span>
          <span>{". . ."}</span>
          <span className="end" dir={dir || dirT}>
            {part2}
          </span>
        </>
      );
    } else {
      setParts(children);
    }
  }, [children, dir, dirT, position]);

  return (
    <Component
      {...props}
      ref={outerRef}
      className={cn("Ellipsis", className, position)}
      dir={dir || dirT}
    >
      {position === "center" && (
        <span className="sizeMeasure" ref={innerRef}>
          {children}
        </span>
      )}

      {parts}
    </Component>
  );
}
