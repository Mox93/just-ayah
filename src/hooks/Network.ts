import { useEffect, useState } from "react";

const STATES = ["online", "offline"];

export default function useNetwork(): boolean {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(window.navigator.onLine);
    };

    STATES.forEach((event) =>
      window.addEventListener(event, updateNetworkStatus)
    );

    return () =>
      STATES.forEach((event) =>
        window.removeEventListener(event, updateNetworkStatus)
      );
  }, []);

  return isOnline;
}
