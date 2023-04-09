import { cn } from "utils";

interface LoadingDotsProps {
  className?: string;
}

export default function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("LoadingDots", className)}>
      <div className="dot1" />
      <div className="dot2" />
      <div className="dot3" />
    </div>
  );
}
