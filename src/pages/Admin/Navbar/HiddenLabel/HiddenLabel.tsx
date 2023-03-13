import { useSidebar } from "context";
import {
  cloneElement,
  forwardRef,
  HTMLAttributes,
  ReactElement,
  Ref,
} from "react";

import { cn } from "utils";

interface HiddenLabelCommonProps {
  children: ReactElement;
  label: ReactElement;
  className?: string;
}

type HiddenLabelProps = HiddenLabelCommonProps &
  (
    | ({ Component?: "div" } & HTMLAttributes<HTMLDialogElement>)
    | ({ Component: "button" } & HTMLAttributes<HTMLButtonElement>)
  );

export default forwardRef(function HiddenLabel(
  { className, children, label, Component = "div", ...props }: HiddenLabelProps,
  ref: Ref<HTMLElement>
) {
  const showLabel = useSidebar((state) => state.isFullyExpanded);

  return (
    <Component
      ref={ref}
      className={cn("HiddenLabel", className, { showLabel })}
      {...(props as any)}
    >
      {children}
      {cloneElement(label, { className: cn("label", label.props.className) })}
    </Component>
  );
});
