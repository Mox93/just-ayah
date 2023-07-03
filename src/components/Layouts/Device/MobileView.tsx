import { ReactNode, useEffect, useState } from "react";

import { isMobileView } from "./Device.utils";
import { subscribeEvents } from "utils";

interface MobileViewProps {
  children: ReactNode;
}

export default function MobileView({ children }: MobileViewProps) {
  const [isMobile, setIsMobile] = useState(isMobileView);

  useEffect(
    () =>
      subscribeEvents(window, {
        resize: () => setIsMobile(isMobileView),
      }),
    []
  );

  return isMobile ? <>{children}</> : null;
}
