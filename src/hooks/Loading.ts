import { useState } from "react";

interface Action<T> {
  (stopLoading: VoidFunction): T;
}

export default function useLoading<T>(action: Action<T>) {
  const [isLoading, setIsLoading] = useState(false);

  return [
    () => {
      setIsLoading(true);
      return action(() => setIsLoading(false));
    },
    isLoading,
  ] as const;
}
