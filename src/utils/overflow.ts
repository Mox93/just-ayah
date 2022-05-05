import { useDirT } from "./translation";

export type OverflowDir = "start" | "end";

export const useOverflowDir = (direction?: OverflowDir) => {
  const dirT = useDirT();

  if (!direction) return;

  let overflowDir = { start: "rtl", end: "ltr" };

  if (dirT === "rtl") {
    overflowDir = { start: "ltr", end: "rtl" };
  }

  return overflowDir[direction];
};
