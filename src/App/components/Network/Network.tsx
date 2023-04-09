import { useRef, useState } from "react";

import { ReactComponent as Online } from "assets/icons/wifi-svgrepo-com.svg";
import { ReactComponent as Offline } from "assets/icons/wifi-off-svgrepo-com.svg";
import { useMessageT, useNetwork, useUpdate } from "hooks";
import { cn } from "utils";
import { Fader } from "components/Animation";

export default function Network() {
  const isOnline = useNetwork();
  const msg = useMessageT();
  const [isVisible, setIsVisible] = useState(!isOnline);
  const timeout = useRef<NodeJS.Timeout | undefined>();

  useUpdate(() => {
    const stopTimeout = () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = undefined;
      }
    };

    if (isOnline) timeout.current = setTimeout(() => setIsVisible(false), 3e3);
    else {
      stopTimeout();
      setIsVisible(true);
    }

    return stopTimeout;
  }, [isOnline]);

  return (
    <Fader isOpen={isVisible} move anchorPoint="end" duration={200}>
      <div
        className={cn("Network", {
          online: isOnline,
          offline: !isOnline,
          // isVisible,
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
    </Fader>
  );
}
