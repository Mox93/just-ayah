import { useEffect, useState } from "react";

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
  const remainingTime = (): [TimeDelta, boolean] => {
    const now = new Date();
    const remaining = getTimeDelta(expiresAt, now, maxUnit);
    const isExpired = expiresAt <= now;

    return [remaining, isExpired];
  };

  const [[countdown, isExpired], setCountdown] =
    useState<[TimeDelta, boolean]>(remainingTime);

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
