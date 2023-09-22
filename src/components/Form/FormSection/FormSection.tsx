import { ReactNode } from "react";

import { cn } from "utils";

import FieldHeader, { FieldHeaderProps } from "../FieldHeader";

interface FormSectionProps
  extends Omit<FieldHeaderProps, "label" | "children"> {
  children: ReactNode;
  className?: string;
  compact?: boolean;
  title?: string;
}

export default function FormSection({
  children,
  className,
  title,
  compact,
  ...props
}: FormSectionProps) {
  return (
    <div className={cn("FormSection", className, { compact })}>
      {title ? (
        <FieldHeader {...props} label={title} className="title" />
      ) : undefined}
      {children}
    </div>
  );
}
