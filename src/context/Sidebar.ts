import { create } from "zustand";
import { persist } from "zustand/middleware";

import { startTimeout } from "utils";

interface SidebarStore {
  isExpanded: boolean;
  isFullyExpanded: boolean;
  toggleExpand: VoidFunction;
}

const useSidebarStore = create(
  persist<SidebarStore>(
    (set) => {
      let stopTimeout: VoidFunction | undefined;

      return {
        isExpanded: false,
        isFullyExpanded: false,
        toggleExpand: () => {
          set(({ isExpanded }) => {
            stopTimeout?.();

            if (!isExpanded) {
              stopTimeout = startTimeout(
                () => set({ isFullyExpanded: true }),
                200
              );
            }

            return isExpanded
              ? { isExpanded: false, isFullyExpanded: false }
              : { isExpanded: true };
          });
        },
      };
    },
    { name: "sidebar" }
  )
);

export default useSidebarStore;
