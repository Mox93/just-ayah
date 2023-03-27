import { DBEventHandler, EventType } from "../types";

export const merge =
  (...handlers: DBEventHandler[]): DBEventHandler =>
  (change, context) =>
    handlers.reduce(
      (obj, handler) => ({ ...obj, [handler.name]: handler(change, context) }),
      {}
    );

export const exclude =
  (
    handler: DBEventHandler,
    ...events: [EventType] | [EventType, EventType]
  ): DBEventHandler =>
  (change, context) => {
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
