import { useEffect, useRef } from "react";

export default function useApplyOnce(
  action: VoidFunction | (() => VoidFunction),
  condition = true
) {
  const isFirstTime = useRef(false);
  const actionRef = useRef(action);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  useEffect(() => {
    if (condition && !isFirstTime.current) {
      isFirstTime.current = true;
      return actionRef.current();
    }
  }, [condition]);
}
