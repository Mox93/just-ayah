import { useEffect, useRef } from "react";
import { ValueOrGetter } from "utils";
import useRefSync from "./RefSync";

export default function useUpdate(
  action: ValueOrGetter<VoidFunction>,
  dependencies?: any[]
) {
  const isFirstTime = useRef(true);
  const actionRef = useRefSync(action);

  useEffect(() => {
    if (!isFirstTime.current) return actionRef.current();

    isFirstTime.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
