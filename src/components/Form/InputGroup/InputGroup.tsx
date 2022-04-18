import { FC, InputHTMLAttributes } from "react";
import { cn } from "utils";
import { handleFormChildren } from "../utils/formChild";

export interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  canWrap?: boolean;
}

const InputGroup: FC<InputGroupProps> = ({
  canWrap,
  children,
  dir,
  ...props
}) => {
  return (
    <div className={cn({ canWrap }, "InputGroup")} dir={dir}>
      {handleFormChildren(children, { ...props })}
    </div>
  );
};

export default InputGroup;
