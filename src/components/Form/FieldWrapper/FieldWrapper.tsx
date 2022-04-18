import { FC } from "react";
import { cn } from "utils";
import { useDirT } from "utils/translation";

interface FieldWrapperProps {
  isInvalid?: boolean;
  dir?: string;
}

const FieldWrapper: FC<FieldWrapperProps> = ({ children, isInvalid, dir }) => {
  const dirT = useDirT();

  return (
    <div
      className={cn("FieldWrapper", { invalid: isInvalid })}
      dir={dir || dirT}
    >
      {children}
    </div>
  );
};

export default FieldWrapper;
