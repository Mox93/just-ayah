import { VFC } from "react";

import { cn } from "utils";

interface LoadingDotsProps {
  className?: string;
}

const LoadingDots: VFC<LoadingDotsProps> = ({ className }) => {
  return (
    <div className={cn("LoadingDots", className)}>
      <div className="dot1" />
      <div className="dot2" />
      <div className="dot3" />
    </div>
  );
};

export default LoadingDots;
