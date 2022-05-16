import { ButtonHTMLAttributes, forwardRef, Ref, useRef } from "react";
import { cn, mergeCallbacks, mergeRefs, capitalize } from "utils";

type ColorVariant =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "gray";
type FillVariant = "solid" | "outline" | "text" | "ghost";
type Size = "default" | "tight";
type Variant = `${ColorVariant}-${FillVariant}`;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: Variant | null;
  size?: Size | null;
  keepFocused?: boolean;
  keepFormat?: boolean;
}

const Button = (
  {
    children,
    className,
    isLoading,
    variant = "primary-solid",
    size = "default",
    keepFocused = false,
    keepFormat = false,
    onClick,
    ...props
  }: ButtonProps,
  ref: Ref<HTMLButtonElement>
) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const blur = () => keepFocused || buttonRef.current?.blur();

  return (
    <button
      {...props}
      ref={mergeRefs(buttonRef, ref)}
      className={cn("Button", variant, size, { loading: isLoading }, className)}
      onClick={mergeCallbacks(onClick, blur)}
    >
      {typeof children !== "string" || keepFormat
        ? children
        : capitalize(children)}
    </button>
  );
};

export default forwardRef(Button);
