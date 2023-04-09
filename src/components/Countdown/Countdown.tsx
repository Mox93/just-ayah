import { useCountdown, useGlobalT } from "hooks";
import { TimeDelta, timeDeltaUnits, TimeDeltaUnits } from "models/_blocks";
import { addZeros } from "utils";

interface CountdownProps {
  expiresAt: Date;
  expiredMessage?: string;
  interval?: TimeDelta;
  maxUnit?: TimeDeltaUnits;
}

export default function Countdown({
  expiresAt,
  interval,
  maxUnit,
  expiredMessage,
}: CountdownProps) {
  const glb = useGlobalT();

  const [countdown, isExpired] = useCountdown(expiresAt, interval, maxUnit);

  return isExpired ? (
    <p className="Countdown expired">{expiredMessage || glb("expired")}</p>
  ) : (
    <p className="Countdown active" dir="ltr">
      {timeDeltaUnits
        .filter((key) => typeof countdown[key] === "number")
        .map((key) => addZeros(countdown[key], key === "year" ? 4 : 2))
        .join(":")}
    </p>
  );
}
