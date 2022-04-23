import { FC } from "react";

import { cn } from "utils";
import { handleFormChildren } from "../utils/formChild";

export interface InputGroupProps {
  className?: string;
  dir?: string;
}

const InputGroup: FC<InputGroupProps> = ({
  className,
  children,
  dir,
  ...props
}) => {
  return (
    <div className={cn("InputGroup", className)} dir={dir}>
      {handleFormChildren(children, props)}
    </div>
  );
};

export default InputGroup;
