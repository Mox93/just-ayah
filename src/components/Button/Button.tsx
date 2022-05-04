import { ButtonHTMLAttributes, FC } from "react";
import { cn } from "utils";

type ColorVariant = "primary" | "secondary" | "success" | "warning" | "danger";
type FillVariant = "solid" | "outline";
type Variant = `${ColorVariant}-${FillVariant}`;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: Variant;
}

const Button: FC<ButtonProps> = ({
  children,
  className,
  isLoading,
  variant = "primary-solid",
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn("Button", variant, { loading: isLoading }, className)}
    >
      {children}
    </button>
  );
};

export default Button;
