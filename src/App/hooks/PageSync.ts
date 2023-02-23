import { useEffect } from "react";

import { useLanguage } from "hooks";
import { windowEventFactory } from "utils";

export default function usePageSync() {
  const [_, setLanguage] = useLanguage();

  useEffect(() => {
    const [addEvents, removeEvents] = windowEventFactory({
      storage: ({ key, newValue }) => {
        if (key === "i18nextLng" && newValue) setLanguage(newValue);
      },
    });

    addEvents();

    return removeEvents;
  }, []);
}
