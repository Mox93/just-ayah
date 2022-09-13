import { useCallback, useEffect, useState } from "react";

import {
  getTimeDelta,
  tdToMs,
  TimeDelta,
  TimeDeltaUnits,
} from "models/dateTime";

const useCountdown = (
  expiresAt: Date,
  delta: TimeDelta = { minute: 1 },
  maxUnit?: TimeDeltaUnits
): [TimeDelta, boolean] => {
  const remainingTime = useCallback((): [TimeDelta, boolean] => {
    const now = new Date();
    return [getTimeDelta(expiresAt, now, maxUnit), expiresAt <= now];
  }, [expiresAt, maxUnit]);

  const [[countdown, isExpired], setCountdown] =
    useState<[TimeDelta, boolean]>(remainingTime);

  useEffect(() => setCountdown(remainingTime), [remainingTime]);

  useEffect(() => {
    if (isExpired) return;

    const interval = setInterval(() => {
      setCountdown(remainingTime);
    }, tdToMs(delta));

    return () => clearInterval(interval);
  }, [isExpired]);

  return [countdown, isExpired];
};

export default useCountdown;
