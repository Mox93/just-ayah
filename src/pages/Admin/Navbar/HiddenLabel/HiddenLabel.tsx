import { useSidebarStore } from "context";
import { cloneElement, forwardRef, HTMLAttributes, ReactElement } from "react";

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

export default forwardRef<HTMLElement, HiddenLabelProps>(function HiddenLabel(
  { className, children, label, Component = "div", ...props },
  ref
) {
  const showLabel = useSidebarStore((state) => state.isFullyExpanded);

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
