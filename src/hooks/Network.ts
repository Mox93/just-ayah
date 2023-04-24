import { useState } from "react";
import useEventListener from "./EventListener";

export default function useNetwork(): boolean {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEventListener(window, () => {
    const updateNetworkStatus = () => setIsOnline(window.navigator.onLine);

    return {
      online: updateNetworkStatus,
      offline: updateNetworkStatus,
    };
  });

  return isOnline;
}
