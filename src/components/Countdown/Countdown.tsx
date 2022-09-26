import { VFC } from "react";

import { useCountdown, useGlobalT } from "hooks";
import { TimeDelta, timeDeltaUnits, TimeDeltaUnits } from "models/dateTime";
import { addZeros } from "utils";

interface CountdownProps {
  expiresAt: Date;
  expiredMessage?: string;
  interval?: TimeDelta;
  maxUnit?: TimeDeltaUnits;
}

const Countdown: VFC<CountdownProps> = ({
  expiresAt,
  interval,
  maxUnit,
  expiredMessage,
}) => {
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
};

export default Countdown;