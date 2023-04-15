import { DBEventHandler, EventType } from "@types";

type FunctionIn<D, C, R> = (change: D, context: C) => R;
type FunctionOut<D, C, R> = (
  change: D,
  context: C
) => Promise<Record<string, Awaited<R>>>;

export function merge<D, C, R, T extends FunctionIn<D, C, R>>(
  ...handlers: [T, ...T[]]
): FunctionOut<D, C, R> {
  return async (change, context) => {
    const result: Record<string, Awaited<R>> = {};

    await Promise.all(
      handlers.map(async (handler) => {
        result[handler.name] = await handler(change, context);
      })
    );

    return result;
  };
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
