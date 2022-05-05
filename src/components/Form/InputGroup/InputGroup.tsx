import { FC } from "react";

import { cn } from "utils";
import { handleFormChildren } from "../utils/formModifiers";

export interface InputGroupProps {
  className?: string;
}

const InputGroup: FC<InputGroupProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn("InputGroup", className)}>
      {handleFormChildren(children, props)}
    </div>
  );
};

export default InputGroup;
