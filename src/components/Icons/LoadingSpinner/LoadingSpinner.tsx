import { ReactComponent as Spinner } from "assets/icons/loading-spinner.svg";
import { cn } from "utils";

interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={cn("LoadingSpinner", className)}>
      <Spinner className="spinner" />
    </div>
  );
}
