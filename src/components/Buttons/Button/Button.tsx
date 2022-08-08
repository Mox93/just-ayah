import { ButtonHTMLAttributes, forwardRef, Ref, useRef } from "react";

import { useDirT } from "hooks";
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

const Button = (
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
    onClick,
    ...props
  }: ButtonProps,
  ref: Ref<HTMLButtonElement>
) => {
  const dirT = useDirT();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const blur = () => keepFocused || buttonRef.current?.blur();

  return (
    <button
      {...props}
      type={type}
      dir={dir || dirT}
      ref={mergeRefs(buttonRef, ref)}
      className={cn(
        "Button",
        variant,
        size,
        { loading: isLoading, iconButton },
        className
      )}
      onClick={mergeCallbacks(onClick, blur)}
    >
      {typeof children !== "string" || keepFormat
        ? children
        : capitalize(children)}
    </button>
  );
};

export default forwardRef(Button);
