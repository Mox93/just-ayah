import { useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { useRefSync, useUpdate } from "hooks";

export function useHasActivePath(paths: () => string[]) {
  const pathname = useLocation().pathname.toLowerCase().replace(/\/$/g, "");

  const pathsRef = useRefSync(paths);

  const hasActivePath = useMemo(
    () =>
      pathsRef
        .current()
        .some((path) =>
          pathname.startsWith(path.toLowerCase().replace(/\/$/g, ""))
        ),
    [pathname, pathsRef]
  );

  return hasActivePath;
}

export function useDelayClose(isOpen: boolean, duration = 200) {
  const [isVisible, setIsVisible] = useState(isOpen);

  const wasOpenRef = useRef(isOpen);

  useUpdate(() => {
    if (isOpen === wasOpenRef.current) return;

    let timeout: NodeJS.Timeout;

    if (isOpen) setIsVisible(true);
    else timeout = setTimeout(() => setIsVisible(false), duration);

    wasOpenRef.current = isOpen;

    return () => timeout && clearTimeout(timeout);
  }, [isOpen, duration]);

  return isVisible;
}
