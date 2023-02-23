type DocumentEventHandlerMap = Partial<{
  [K in keyof DocumentEventMap]: (event: DocumentEventMap[K]) => void;
}>;

export function documentEventFactory(events: DocumentEventHandlerMap) {
  return eventFactory(document, events);
}

type WindowEventHandlerMap = Partial<{
  [K in keyof WindowEventMap]: (event: WindowEventMap[K]) => void;
}>;

export function windowEventFactory(events: WindowEventHandlerMap) {
  return eventFactory(window, events);
}

function eventFactory(
  target: Document,
  events: DocumentEventHandlerMap
): [VoidFunction, VoidFunction];
function eventFactory(
  target: Window,
  events: WindowEventHandlerMap
): [VoidFunction, VoidFunction];
function eventFactory(target: any, events: Record<string, Function>) {
  return [
    () =>
      Object.entries(events).forEach(([type, callback]) =>
        target.addEventListener(type, callback)
      ),
    () =>
      Object.entries(events).forEach(([type, callback]) =>
        target.removeEventListener(type, callback)
      ),
  ];
}
