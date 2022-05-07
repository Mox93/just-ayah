import { FC } from "react";
import { cn } from "utils";

interface CardProps {
  className?: string;
}

const Card: FC<CardProps> = ({ className, children }) => {
  return <div className={cn("Card", className)}>{children}</div>;
};

export default Card;
