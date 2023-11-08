import { ReactNode } from "react";

import FlashCard from "./FlashCard";

interface WarningMessageProps {
  title: string;
  message: string;
  actions?: ReactNode;
}

export default function WarningMessage({
  title,
  message,
  actions,
}: WarningMessageProps) {
  return (
    <FlashCard state="error" actions={actions}>
      <h2 className="accent">{title}</h2>
      <p>{message}</p>
    </FlashCard>
  );
}
