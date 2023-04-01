import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStore {
  isExpanded: boolean;
  isFullyExpanded: boolean;
  toggleExpand: VoidFunction;
}

const useSidebarStore = create(
  persist<SidebarStore>(
    (set) => {
      let timeout: NodeJS.Timeout | null;

      return {
        isExpanded: false,
        isFullyExpanded: false,
        toggleExpand: () => {
          set(({ isExpanded }) => {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }

            if (!isExpanded) {
              timeout = setTimeout(() => set({ isFullyExpanded: true }), 200);
            }

            return isExpanded
              ? { isExpanded: false, isFullyExpanded: false }
              : { isExpanded: true };
          });
        },
      };
    },
    {
      name: "sidebar",
    }
  )
);

export default useSidebarStore;
