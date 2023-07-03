import { ReactNode, useEffect, useState } from "react";

import { isDesktopView } from "./Device.utils";
import { subscribeEvents } from "utils";

interface DesktopViewProps {
  children: ReactNode;
}

export default function DesktopView({ children }: DesktopViewProps) {
  const [isDesktop, setIsDesktop] = useState(isDesktopView);

  useEffect(
    () =>
      subscribeEvents(window, {
        resize: () => setIsDesktop(isDesktopView),
      }),
    []
  );

  return isDesktop ? <>{children}</> : null;
}
