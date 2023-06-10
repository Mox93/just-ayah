import { useEffect, useState } from "react";
import { subscribeEvents } from "utils";

export default function useNetwork(): boolean {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const updateNetworkStatus = () => setIsOnline(window.navigator.onLine);

    return subscribeEvents(window, {
      online: updateNetworkStatus,
      offline: updateNetworkStatus,
    });
  }, []);

  return isOnline;
}
