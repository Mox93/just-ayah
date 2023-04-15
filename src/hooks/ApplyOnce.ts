import { useEffect, useRef } from "react";
import { ValueOrGetter } from "utils";
import useRefSync from "./RefSync";

export default function useApplyOnce(
  action: ValueOrGetter<VoidFunction>,
  condition = true
) {
  const isFirstTime = useRef(false);
  const actionRef = useRefSync(action);

  useEffect(() => {
    if (condition && !isFirstTime.current) {
      isFirstTime.current = true;
      return actionRef.current();
    }
  }, [actionRef, condition]);
}
