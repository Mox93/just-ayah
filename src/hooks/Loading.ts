import { useState } from "react";

type Action = (stopLoading: VoidFunction) => void;
type UseLoadingResult = [VoidFunction, boolean];

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
