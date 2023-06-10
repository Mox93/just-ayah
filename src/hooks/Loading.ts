import { useState } from "react";

export default function useLoading<T, A extends T[], R>(
  action: (stopLoading: VoidFunction, ...args: A) => R
) {
  const [isLoading, setIsLoading] = useState(false);

  return [
    (...args: A) => {
      setIsLoading(true);
      return action(() => setIsLoading(false), ...args);
    },
    isLoading,
  ] as const;
}
