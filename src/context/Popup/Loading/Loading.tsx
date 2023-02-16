import { LoadingSpinner } from "components/Icons";
import { ReactElement } from "react";

export interface LoadingProps {
  message?: string | ReactElement;
}

export default function Loading({ message }: LoadingProps) {
  return (
    <div className="Loading">
      <div className="body">
        <LoadingSpinner />
        {message}
      </div>
    </div>
  );
}
