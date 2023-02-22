import { useEffect, useRef } from "react";

export default function useApplyOnce(action: VoidFunction, condition = true) {
  const applied = useRef(false);

  useEffect(() => {
    if (condition && !applied.current) {
      action();
      applied.current = true;
    }
  }, [condition]);
}
