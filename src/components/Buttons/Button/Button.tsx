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

export type ButtonSize = "large" | "medium" | "small";
export type ButtonVariant = `${ColorVariant}-${FillVariant}` | "plain-text";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: ButtonVariant | null;
  size?: ButtonSize | null;
  keepFocused?: boolean;
  keepFormat?: boolean;
}

const Button = (
  {
    children,
    className,
    isLoading,
    variant = "primary-solid",
    size = "medium",
    keepFocused,
    keepFormat,
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
