import { ButtonHTMLAttributes, Children, forwardRef, Ref, useRef } from "react";

import { cn, mergeCallbacks, mergeRefs, capitalize } from "utils";
import { LoadingDots } from "components/Icons";

type ColorVariant =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "gray";
type FillVariant = "solid" | "outline" | "text" | "ghost";

export type SizeVariant = "large" | "medium" | "small";
export type ButtonVariant = `${ColorVariant}-${FillVariant}` | "plain-text";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: ButtonVariant | null;
  size?: SizeVariant | null;
  keepFocused?: boolean;
  keepFormat?: boolean;
  iconButton?: boolean;
}

export default forwardRef(function Button(
  {
    children,
    className,
    isLoading,
    variant = "primary-solid",
    size = "medium",
    type = "button",
    keepFocused,
    keepFormat,
    dir,
    iconButton,
    disabled,
    onClick,
    ...props
  }: ButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      {...props}
      type={type}
      dir={dir}
      ref={mergeRefs(buttonRef, ref)}
      className={cn(
        "Button",
        variant,
        size,
        { isLoading, iconButton, noDisableStyle: isLoading },
        className
      )}
      onClick={mergeCallbacks(
        onClick,
        () => keepFocused || buttonRef.current?.blur()
      )}
      disabled={isLoading || disabled}
    >
      {Children.map(children, (child) =>
        keepFormat ? child : capitalize(child)
      )}
      {isLoading && <LoadingDots className="loadingIndicator" />}
    </button>
  );
});
