import { Children, cloneElement, isValidElement, ReactElement } from "react";

interface NestProps {
  children: [ReactElement, ReactElement, ...ReactElement[]];
}

export default function Nest({ children }: NestProps) {
  const [child, ...parents] = Children.toArray(children)
    .filter(isValidElement)
    .reverse();

  return parents.reduce<ReactElement>(
    (child, parent) => cloneElement(parent, {}, child),
    child
  );
}
