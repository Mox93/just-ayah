import { useEffect, useState } from "react";
import { windowEventFactory } from "utils";

export default function useNetwork(): boolean {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(window.navigator.onLine);
    };

    const [addEvents, removeEvents] = windowEventFactory({
      online: updateNetworkStatus,
      offline: updateNetworkStatus,
    });

    addEvents();

    return removeEvents;
  }, []);

  return isOnline;
}
