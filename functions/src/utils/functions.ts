import { DBEventHandler, EventType } from "@types";

type HandlerIn<T, X, R> = (change: T, context: X) => R;
type HandlerOut<T, X, R> = (change: T, context: X) => Promise<Awaited<R>[]>;

export function merge<T, X, R, H extends HandlerIn<T, X, R>>(
  ...handlers: [H, ...H[]]
): HandlerOut<T, X, R> {
  return (change, context) =>
    Promise.all(handlers.map((handler) => handler(change, context)));
}

export function exclude(
  handler: DBEventHandler,
  ...events: [EventType] | [EventType, EventType]
): DBEventHandler {
  return (change, context) => {
    if (events.includes("delete") && !change.after.exists) return null;

    if (events.includes("create") && !change.before.exists) return null;

    if (
      events.includes("update") &&
      change.before.exists &&
      change.after.exists
    )
      return null;

    return handler(change, context);
  };
}
