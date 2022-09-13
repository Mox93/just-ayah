import { FC } from "react";

import SuccessIcon from "assets/icons/checked-svgrepo-com.svg";
import ErrorIcon from "assets/icons/cancel-svgrepo-com.svg";
import Container from "components/Container";
import { cn } from "utils";

interface FlashMessageProps {
  state?: "success" | "error";
  className?: string;
}

const FlashMessage: FC<FlashMessageProps> = ({
  className,
  state,
  children,
}) => {
  return (
    <Container
      variant="card"
      className={cn("FlashMessage", className, state)}
      header={
        state && (
          <img
            src={state === "success" ? SuccessIcon : ErrorIcon}
            alt="hero"
            className="hero"
          />
        )
      }
    >
      {children}
    </Container>
  );
};

export default FlashMessage;
