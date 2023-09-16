import { DBEventHandler, EventType } from "@types";

export function merge<T, X, R, H extends (change: T, context: X) => R>(
  ...handlers: [H, ...H[]]
) /* : (change: T, context: X) => Promise<Awaited<R>[]> */ {
  return (change: T, context: X) =>
    Promise.all(
      handlers.map(async (handler) => await handler(change, context))
    );
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
