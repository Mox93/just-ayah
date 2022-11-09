import { useEffect, useState, VFC } from "react";

import { ReactComponent as Online } from "assets/icons/wifi-svgrepo-com.svg";
import { ReactComponent as Offline } from "assets/icons/wifi-off-svgrepo-com.svg";
import { useDirT, useMessageT, useNetwork } from "hooks";
import { cn } from "utils";

export interface NetworkProps {}

const Network: VFC<NetworkProps> = () => {
  const isOnline = useNetwork();
  const msg = useMessageT();
  const dirT = useDirT();
  const [isVisiable, setIsVisiable] = useState(!isOnline);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  useEffect(() => {
    console.log({ isOnline, isVisiable });

    if (isOnline) {
      setTimeoutId(setTimeout(() => setIsVisiable(false), 3e3));
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      setIsVisiable(true);
    }
  }, [isOnline]);

  return (
    <div
      dir={dirT}
      className={cn("Network", {
        online: isOnline,
        offline: !isOnline,
        isVisiable,
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
