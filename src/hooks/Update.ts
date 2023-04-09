import { useEffect, useRef } from "react";

export default function useUpdate(
  action: () => void | (() => void),
  dependencies?: any[]
) {
  const isFirstTime = useRef(true);
  const actionRef = useRef(action);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  useEffect(() => {
    if (!isFirstTime.current) return actionRef.current();

    isFirstTime.current = false;
  }, dependencies);
}
