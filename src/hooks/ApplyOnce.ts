import { useEffect, useRef } from "react";

export default function useApplyOnce(
  action: VoidFunction | (() => VoidFunction),
  condition = true
) {
  const applied = useRef(false);

  useEffect(() => {
    if (condition && !applied.current) {
      applied.current = true;
      return action();
    }
  }, [condition]);
}
