import { cloneElement, forwardRef, ReactElement } from "react";

import { isRefElement } from "lib/react-is";
import { mergeRefs } from "utils";

import { useFader, UseFaderProps } from "./Fader.utils";

type FaderProps = UseFaderProps & {
  children: ReactElement;
};

export default forwardRef<HTMLElement, FaderProps>(function Fader(
  { children, isOpen, ...props },
  ref
) {
  const [_ref, isVisible] = useFader({ ...props, isOpen, ref });

  if (!isRefElement) return isOpen ? children : null;

  return isVisible
    ? cloneElement(children, { ref: mergeRefs(ref, _ref) })
    : null;
});
