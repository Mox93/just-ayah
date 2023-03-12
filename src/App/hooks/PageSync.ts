import { useEffect } from "react";

import { useDirT, useLanguage } from "hooks";
import { windowEventFactory } from "utils";

export default function usePageSync() {
  const [, setLanguage] = useLanguage();
  const dirT = useDirT();

  useEffect(() => {
    const [addEvents, removeEvents] = windowEventFactory({
      storage: ({ key, newValue }) => {
        if (key === "i18nextLng" && newValue) setLanguage(newValue);
      },
    });

    addEvents();

    return removeEvents;
  }, [setLanguage]);

  useEffect(() => {
    document.body.setAttribute("dir", dirT);
  }, [dirT]);
}
