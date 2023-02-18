import { ReactNode } from "react";

import { cn } from "utils";
import { handleFormChildren } from "../utils/formModifiers";

export interface InputGroupProps {
  children: ReactNode;
  className?: string;
}

export default function InputGroup({
  className,
  children,
  ...props
}: InputGroupProps) {
  return (
    <div className={cn("InputGroup", className)}>
      {handleFormChildren(children, props)}
    </div>
  );
}
