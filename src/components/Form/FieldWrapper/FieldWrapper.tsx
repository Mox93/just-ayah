import { Children, FC, ReactNode } from "react";

import { cn } from "utils";

const injectPartitions = (children: ReactNode) => {
  const newChildren: ReactNode[] = [];

  Children.forEach(children, (child, index) => {
    console.log("FieldWrapper", child);

    if (index > 0) newChildren.push(<div className="partition" />);
    newChildren.push(child);
  });

  return newChildren;
};

interface FieldWrapperProps {
  isInvalid?: boolean;
  dir?: string;
  addPartitions?: boolean;
}

const FieldWrapper: FC<FieldWrapperProps> = ({
  children,
  isInvalid,
  dir,
  addPartitions,
}) => {
  return (
    <div className={cn("FieldWrapper", { invalid: isInvalid })} dir={dir}>
      {addPartitions ? injectPartitions(children) : children}
    </div>
  );
};

export default FieldWrapper;
