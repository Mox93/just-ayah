import { HTMLAttributes, ReactElement } from "react";

import { cn } from "utils";

interface HighlightProps extends HTMLAttributes<HTMLParagraphElement> {
  children: string;
  sections?: (string | { value: string; index: number })[];
}

export default function Highlight({
  children,
  className,
  sections,
  ...props
}: HighlightProps) {
  let parts: (ReactElement | string)[] = [children];
  const highlights = sections?.map((highlight) =>
    typeof highlight === "string" ? { value: highlight, index: 0 } : highlight
  );

  highlights
    ?.sort(({ value: a }, { value: b }) => b.length - a.length)
    .forEach(({ value, index }, i) => {
      const newParts: (ReactElement | string)[] = [];

      parts.forEach((p, j) => {
        if (typeof p === "string" && p.toLowerCase().includes(value)) {
          const start = p.toLowerCase().indexOf(value, index);
          const end = start + value.length;

          newParts.push(
            ...(start > 0 ? [p.slice(0, start)] : []),
            <span className="target" key={`${i}-${j}`}>
              {p.slice(start, end)}
            </span>,
            ...(p.length > end ? [p.slice(end)] : [])
          );
        } else newParts.push(p);
      });

      parts = newParts;
    });

  return (
    <p className={cn("Highlight", className)} {...props}>
      {parts}
    </p>
  );
}
