import { Children, FC, ReactNode } from "react";

import { cn } from "utils";

const injectPartitions = (children: ReactNode) => {
  const newChildren: ReactNode[] = [];

  Children.forEach(children, (child, index) => {
    if (index > 0) newChildren.push(<div className="partition" key={index} />);
    newChildren.push(child);
  });

  return newChildren;
};

interface FieldWrapperProps {
  isInvalid?: boolean;
  dir?: string;
  addPartitions?: boolean;
  contentFullWidth?: boolean;
}

const FieldWrapper: FC<FieldWrapperProps> = ({
  children,
  isInvalid,
  dir,
  addPartitions,
  contentFullWidth,
}) => {
  return (
    <div
      className={cn("FieldWrapper", { invalid: isInvalid, contentFullWidth })}
      dir={dir}
    >
      {addPartitions ? injectPartitions(children) : children}
    </div>
  );
};

export default FieldWrapper;
