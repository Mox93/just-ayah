import { ReactComponent as Spinner } from "assets/icons/loading-spinner.svg";
import { cn } from "utils";

interface LoadingSpinnerProps {
  className?: string;
  icon?: boolean;
}

export default function LoadingSpinner({
  className,
  icon,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("LoadingSpinner", className, { icon })}>
      <Spinner className="spinner" />
    </div>
  );
}
