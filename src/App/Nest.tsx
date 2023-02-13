import {
  Children,
  cloneElement,
  FC,
  isValidElement,
  ReactElement,
} from "react";

interface NestProps {
  children: [ReactElement, ReactElement, ...ReactElement[]];
}

const Nest: FC<NestProps> = ({ children }) => {
  const [head, ...tail] = Children.toArray(children)
    .filter(isValidElement)
    .reverse();

  return tail.reduce<ReactElement>(
    (child, parent) => cloneElement(parent, {}, child),
    head
  );
};

export default Nest;
