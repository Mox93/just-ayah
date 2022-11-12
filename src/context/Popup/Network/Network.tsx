import { useEffect, useRef, useState, VFC } from "react";

import { ReactComponent as Online } from "assets/icons/wifi-svgrepo-com.svg";
import { ReactComponent as Offline } from "assets/icons/wifi-off-svgrepo-com.svg";
import { useDirT, useMessageT, useNetwork } from "hooks";
import { cn } from "utils";

export interface NetworkProps {}

const Network: VFC<NetworkProps> = () => {
  const isOnline = useNetwork();
  const msg = useMessageT();
  const dirT = useDirT();
  const [isVisible, setIsVisible] = useState(!isOnline);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOnline) {
      timeout.current = setTimeout(() => setIsVisible(false), 3e3);
    } else {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
        setIsVisible(true);
      }
    }
  }, [isOnline]);

  return (
    <div
      dir={dirT}
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
};

export default Network;
