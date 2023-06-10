import { useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { useRefSync, useUpdate } from "hooks";
import { startTimeout } from "utils";

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

    let stopTimeout: VoidFunction | undefined;

    if (isOpen) setIsVisible(true);
    else stopTimeout = startTimeout(() => setIsVisible(false), duration);

    wasOpenRef.current = isOpen;

    return stopTimeout;
  }, [isOpen, duration]);

  return isVisible;
}
