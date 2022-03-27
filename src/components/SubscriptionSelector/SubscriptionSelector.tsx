import {
  Subscription,
  subscriptions,
  SubscriptionType,
} from "models/subscription";
import { FunctionComponent, useEffect, useState } from "react";
import { cn } from "utils";
import { useGlobalT } from "utils/translation";

interface SubscriptionSelectorProps {
  onChange: (subscription: Subscription) => void;
}

const SubscriptionSelector: FunctionComponent<SubscriptionSelectorProps> = ({
  onChange,
}) => {
  const glb = useGlobalT();

  const [selected, setSelected] = useState<SubscriptionType>();
  const [amount, setAmount] = useState(90);

  useEffect(() => {
    if (selected && selected !== "partialPay") {
      onChange({ type: selected });
    }
  }, [selected]);

  return (
    <div className="SubscriptionSelector">
      {subscriptions.map((type) =>
        type === "partialPay" && selected === "partialPay" ? (
          <div key={type} className="partialPay amount">
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
              }}
            />
            <button onClick={() => amount && onChange({ type, amount })} />
          </div>
        ) : (
          <button
            key={type}
            className={cn("colorCoded", type)}
            onClick={() => setSelected(type)}
          >
            {glb(type)}
          </button>
        )
      )}
    </div>
  );
};

export default SubscriptionSelector;
