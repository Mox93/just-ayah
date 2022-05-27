import { forwardRef, PropsWithChildren, Ref } from "react";
import { cn } from "utils";

interface ContainerProps {
  className?: string;
  variant?: "menu" | "card";
}

const Container = (
  { className, children, variant }: PropsWithChildren<ContainerProps>,
  ref: Ref<HTMLDivElement>
) => {
  return (
    <div ref={ref} className={cn("Container", variant, className)}>
      {children}
    </div>
  );
};

export default forwardRef(Container);
