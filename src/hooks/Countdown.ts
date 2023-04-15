import { useCallback, useEffect } from "react";

import {
  getTimeDelta,
  tdToMs,
  TimeDelta,
  TimeDeltaUnits,
} from "models/_blocks";

import useStateSync from "./StateSync";

type CountdownState = [TimeDelta, boolean];

export default function useCountdown(
  expiresAt: Date,
  delta: TimeDelta = { minute: 1 },
  maxUnit?: TimeDeltaUnits
): CountdownState {
  const remainingTime = useCallback((): CountdownState => {
    const now = new Date();
    return [getTimeDelta(expiresAt, now, maxUnit), expiresAt <= now];
  }, [expiresAt, maxUnit]);

  const [[countdown, isExpired], setCountdown] = useStateSync(remainingTime);

  useEffect(() => {
    if (isExpired) return;

    const interval = setInterval(() => {
      setCountdown(remainingTime);
    }, tdToMs(delta));

    return () => clearInterval(interval);
  }, [delta, isExpired, remainingTime, setCountdown]);

  return [countdown, isExpired];
}
