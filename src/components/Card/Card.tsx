import { forwardRef, PropsWithChildren, Ref } from "react";
import { cn } from "utils";

interface CardProps {
  className?: string;
  variant?: "menu" | "container" | null;
}

const Card = (
  { className, children, variant = "container" }: PropsWithChildren<CardProps>,
  ref: Ref<HTMLDivElement>
) => {
  return (
    <div ref={ref} className={cn("Card", variant, className)}>
      {children}
    </div>
  );
};

export default forwardRef(Card);
