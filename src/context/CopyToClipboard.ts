import { create } from "zustand";

import { startTimeout } from "utils";

export const useCopyToClipboard = create<{
  copied?: string;
  copyToClipboard: (value: string) => void;
}>()((set) => {
  let stopTimeout: VoidFunction | undefined;

  return {
    copyToClipboard: (value: string) => {
      stopTimeout?.();
      navigator.clipboard.writeText(value);
      set({ copied: value });

      stopTimeout = startTimeout(() => {
        set({ copied: undefined });
        stopTimeout = undefined;
      }, 1e3);
    },
  };
});
