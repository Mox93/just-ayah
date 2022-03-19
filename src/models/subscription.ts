import { UNKNOWN } from "models";
import { identity } from "utils";

export const subscriptions = ["fullPay", "partialPay", "noPay"] as const;

export type SubscriptionType = typeof subscriptions[number];

export type Subscription =
  | { type: Exclude<SubscriptionType, "partialPay"> }
  | { type: "partialPay"; amount: number };

export const getSubscription = (
  obj?: Subscription,
  glb: (value: string) => string = identity
): string => {
  return obj
    ? obj.type === "partialPay"
      ? `${glb(obj.type)} (${obj.amount})`
      : glb(obj.type)
    : glb(UNKNOWN);
};
