import { ReactComponent as Spinner } from "assets/icons/loading-spinner.svg";
import { useDirT } from "hooks";
import { cn } from "utils";

interface LoadingSpinnerProps {
  className?: string;
  icon?: boolean;
  dir?: string;
}

export default function LoadingSpinner({
  className,
  icon,
  dir,
}: LoadingSpinnerProps) {
  const dirT = useDirT();

  return (
    <div
      className={cn("LoadingSpinner", className, { icon })}
      dir={dir || dirT}
    >
      <Spinner className="spinner" />
    </div>
  );
}
