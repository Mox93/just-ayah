import { ReactElement } from "react";

import { LoadingSpinner } from "components/Icons";

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
