import { useRef, useState } from "react";

import { ReactComponent as Online } from "assets/icons/wifi-svgrepo-com.svg";
import { ReactComponent as Offline } from "assets/icons/wifi-off-svgrepo-com.svg";
import { Fader } from "components/Animation";
import { useMessageT, useNetwork, useUpdate } from "hooks";
import { cn, startTimeout } from "utils";

export default function Network() {
  const isOnline = useNetwork();
  const msg = useMessageT();
  const [isVisible, setIsVisible] = useState(!isOnline);
  let stopTimeout = useRef<VoidFunction | undefined>();

  useUpdate(() => {
    if (isOnline)
      stopTimeout.current = startTimeout(() => setIsVisible(false), 3e3);
    else {
      stopTimeout.current?.();
      setIsVisible(true);
    }

    return stopTimeout.current;
  }, [isOnline]);

  return (
    <Fader isOpen={isVisible} move anchorPoint="end" duration={200}>
      <div className={cn("Network", { online: isOnline, offline: !isOnline })}>
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
