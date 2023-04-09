import { useEffect, useRef } from "react";
import { ValueOrGetter } from "utils";

export default function useUpdate(
  action: ValueOrGetter<VoidFunction>,
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
