import { useState } from "react";

export default function useLoading<T>(
  action: (stopLoading: VoidFunction) => T
) {
  const [isLoading, setIsLoading] = useState(false);

  return [
    () => {
      setIsLoading(true);
      return action(() => setIsLoading(false));
    },
    isLoading,
  ] as const;
}
