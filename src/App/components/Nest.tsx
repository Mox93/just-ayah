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
  const [child, ...parents] = Children.toArray(children)
    .filter(isValidElement)
    .reverse();

  return parents.reduce<ReactElement>(
    (child, parent) => cloneElement(parent, {}, child),
    child
  );
};

export default Nest;
