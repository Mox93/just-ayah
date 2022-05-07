import { ButtonHTMLAttributes, FC } from "react";
import { cn, toCapitalized } from "utils";
import { useLanguage } from "utils/translation";

type ColorVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "gray";
type FillVariant = "solid" | "outline" | "ghost";
type Size = "default" | "small";
type Variant = `${ColorVariant}-${FillVariant}`;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: Variant | null;
  size?: Size;
}

const Button: FC<ButtonProps> = ({
  children,
  className,
  isLoading,
  variant = "primary-solid",
  size = "default",
  ...props
}) => {
  const [lang] = useLanguage();

  return (
    <button
      {...props}
      className={cn(
        "Button",
        variant,
        size,
        { loading: isLoading, title: lang !== "ar" },
        className
      )}
    >
      {typeof children == "string" ? toCapitalized(children) : children}
    </button>
  );
};

export default Button;
