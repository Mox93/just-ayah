import { HTMLAttributes } from "react";

import { ReactComponent as CheckMarkIcon } from "assets/icons/checkmark-svgrepo-com.svg";
import { useDirT } from "hooks";
import { cn } from "utils";

interface CheckMarkProps extends HTMLAttributes<SVGSVGElement> {}

export default function CheckMark({ className, ...props }: CheckMarkProps) {
  const dirT = useDirT();

  if (!props.dir) props.dir = dirT;

  return (
    <CheckMarkIcon {...props} className={cn("CheckMark icon", className)} />
  );
}
