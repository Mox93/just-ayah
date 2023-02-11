import { Children, forwardRef, PropsWithChildren, ReactNode, Ref } from "react";

import { useDirT } from "hooks";
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

const FieldWrapper = (
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
  }: FieldWrapperProps,
  ref: Ref<HTMLDivElement>
) => {
  const dirT = useDirT();

  return (
    <div
      ref={ref}
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

export default forwardRef(FieldWrapper);
