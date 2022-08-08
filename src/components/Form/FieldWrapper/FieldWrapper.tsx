import { Children, FC, ReactNode } from "react";

import { useDirT } from "hooks";
import { cn } from "utils";

const EMPTY: any[] = [null, undefined, false];

type Partition = (ket: string | number) => ReactNode;

const injectPartitions = (children: ReactNode, partition?: Partition) => {
  const newChildren: ReactNode[] = [];

  Children.forEach(children, (child, index) => {
    if (!EMPTY.includes(child) && index > 0)
      newChildren.push(
        partition ? partition(index) : <div className="partition" key={index} />
      );
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
  partition?: Partition;
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
  partition,
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
      {addPartitions ? injectPartitions(children, partition) : children}
    </div>
  );
};

export default FieldWrapper;
