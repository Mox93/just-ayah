import { VFC } from "react";

import { ReactComponent as Spinner } from "assets/icons/loading-spinner.svg";
import { cn } from "utils";

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: VFC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div className={cn("LoadingSpinner", className)}>
      <Spinner className="spinner" />
    </div>
  );
};

export default LoadingSpinner;
