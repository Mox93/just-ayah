import { ReactNode } from "react";

import { cn } from "utils";
import { passPropsToFormChildren } from "../utils/formModifiers";

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
      {passPropsToFormChildren(children, props)}
    </div>
  );
}
