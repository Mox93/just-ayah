import { useDirT } from "./translation";

export type OverflowDir = "start" | "end";

export const useOverflowDir = (direction?: OverflowDir, fallback?: string) => {
  const dirT = useDirT();

  if (dirT === "rtl" && direction === "start") return "ltr";
  if (dirT === "rtl" && direction === "end") return "rtl";
  if (dirT === "ltr" && direction === "start") return "rtl";
  if (dirT === "ltr" && direction === "end") return "ltr";
  return fallback;
};
