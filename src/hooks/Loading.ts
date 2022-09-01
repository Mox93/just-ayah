import { useState } from "react";

type Action = (stopLoading: () => void) => void;
type UseLoadingResult = [() => void, boolean];

const useLoading = (action: Action): UseLoadingResult => {
  const [isLoading, setIsLoading] = useState(false);

  return [
    () => {
      setIsLoading(true);
      action(() => setIsLoading(false));
    },
    isLoading,
  ];
};

export default useLoading;
