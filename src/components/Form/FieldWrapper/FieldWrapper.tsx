import { FC } from "react";
import { cn } from "utils";

interface FieldWrapperProps {
  isInvalid?: boolean;
  dir?: string;
}

const FieldWrapper: FC<FieldWrapperProps> = ({ children, isInvalid, dir }) => {
  return (
    <div className={cn("FieldWrapper", { invalid: isInvalid })} dir={dir}>
      {children}
    </div>
  );
};

export default FieldWrapper;
