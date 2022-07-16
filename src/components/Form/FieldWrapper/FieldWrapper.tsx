import { Children, FC, ReactNode } from "react";

import { useDirT } from "hooks";
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
  className?: string;
  isInvalid?: boolean;
  dir?: string;
  addPartitions?: boolean;
  contentFullWidth?: boolean;
  alwaysVisible?: boolean;
  expandable?: boolean;
}

const FieldWrapper: FC<FieldWrapperProps> = ({
  className,
  children,
  isInvalid,
  dir,
  addPartitions,
  contentFullWidth,
  alwaysVisible,
  expandable,
}) => {
  const dirT = useDirT();

  return (
    <div
      className={cn(
        "FieldWrapper",
        { invalid: isInvalid, contentFullWidth, alwaysVisible, expandable },
        className
      )}
      dir={dir || dirT}
    >
      {addPartitions ? injectPartitions(children) : children}
    </div>
  );
};

export default FieldWrapper;
