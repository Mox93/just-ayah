import { Children, createElement, FC, isValidElement } from "react";

import { cn } from "utils";

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
      {addPartitions
        ? Children.map(children, (child) =>
            isValidElement(child)
              ? createElement(child.type, {
                  ...child.props,
                  className: cn(child.props.className, "partition"),
                })
              : child
          )
        : children}
    </div>
  );
};

export default FieldWrapper;
