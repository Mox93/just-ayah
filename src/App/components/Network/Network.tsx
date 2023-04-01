import { useEffect, useRef, useState } from "react";

import { ReactComponent as Online } from "assets/icons/wifi-svgrepo-com.svg";
import { ReactComponent as Offline } from "assets/icons/wifi-off-svgrepo-com.svg";
import { useMessageT, useNetwork } from "hooks";
import { cn } from "utils";

export default function Network() {
  const isOnline = useNetwork();
  const msg = useMessageT();
  const [isVisible, setIsVisible] = useState(!isOnline);
  const timeout = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (isOnline) {
      timeout.current = setTimeout(() => setIsVisible(false), 3e3);
    } else {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = undefined;
        setIsVisible(true);
      }
    }
  }, [isOnline]);

  return (
    <div
      className={cn("Network", {
        online: isOnline,
        offline: !isOnline,
        isVisible,
      })}
    >
      {isOnline ? (
        <>
          <Online className="icon" />
          {msg("online")}
        </>
      ) : (
        <>
          <Offline className="icon" />
          {msg("offline")}
        </>
      )}
    </div>
  );
}
