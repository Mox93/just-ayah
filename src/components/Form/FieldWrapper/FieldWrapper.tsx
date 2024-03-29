import { Children, forwardRef, PropsWithChildren, ReactNode } from "react";

import { cn, oneOf } from "utils";

type Partition = (ket: string | number) => ReactNode;

const injectPartitions = (children: ReactNode, partition?: Partition) => {
  const newChildren: ReactNode[] = [];

  Children.forEach(children, (child, index) => {
    if (!oneOf(child, [null, undefined, false]) && index > 0)
      newChildren.push(
        partition ? partition(index) : <div className="partition" key={index} />
      );
    newChildren.push(child);
  });

  return newChildren;
};

type FieldWrapperProps = PropsWithChildren<{
  className?: string;
  isInvalid?: boolean;
  dir?: string;
  addPartitions?: boolean;
  contentFullWidth?: boolean;
  alwaysVisible?: boolean;
  expandable?: boolean;
  partition?: Partition;
}>;

export default forwardRef<HTMLDivElement, FieldWrapperProps>(
  function FieldWrapper(
    {
      className,
      children,
      isInvalid,
      dir,
      addPartitions,
      contentFullWidth,
      alwaysVisible,
      expandable,
      partition,
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "FieldWrapper",
          { invalid: isInvalid, contentFullWidth, alwaysVisible, expandable },
          className
        )}
        dir={dir}
      >
        {addPartitions ? injectPartitions(children, partition) : children}
      </div>
    );
  }
);
