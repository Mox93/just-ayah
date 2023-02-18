import { ReactNode } from "react";

import SuccessIcon from "assets/icons/checked-svgrepo-com.svg";
import ErrorIcon from "assets/icons/cancel-svgrepo-com.svg";
import Container from "components/Container";
import { cn } from "utils";

interface FlashCardProps {
  children: ReactNode;
  state?: "success" | "error";
  className?: string;
}

export default function FlashCard({
  className,
  state,
  children,
}: FlashCardProps) {
  return (
    <Container
      variant="card"
      className={cn("FlashCard", className, state)}
      header={
        state && (
          <img
            src={state === "success" ? SuccessIcon : ErrorIcon}
            alt={state}
            className="hero"
          />
        )
      }
    >
      {children}
    </Container>
  );
}
