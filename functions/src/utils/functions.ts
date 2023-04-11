import { DBEventHandler, DBUpdateHandler, EventType } from "@types";

function merge(...handlers: DBEventHandler[]): DBEventHandler;
function merge(...handlers: DBUpdateHandler[]): DBUpdateHandler;
function merge<H extends DBEventHandler>(...handlers: H[]): DBEventHandler {
  return (change, context) =>
    handlers.reduce(
      (obj, handler) => ({ ...obj, [handler.name]: handler(change, context) }),
      {}
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

export { merge };
