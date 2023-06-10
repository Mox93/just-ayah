export type DocumentEventHandlerMap = Partial<{
  [K in keyof DocumentEventMap]: (event: DocumentEventMap[K]) => void;
}>;

export type WindowEventHandlerMap = Partial<{
  [K in keyof WindowEventMap]: (event: WindowEventMap[K]) => void;
}>;

export type HTMLElementEventHandlerMap = Partial<{
  [K in keyof HTMLElementEventMap]: (event: HTMLElementEventMap[K]) => void;
}>;

export function eventFactory(
  target: Document,
  events: DocumentEventHandlerMap
): [VoidFunction, VoidFunction];
export function eventFactory(
  target: Window,
  events: WindowEventHandlerMap
): [VoidFunction, VoidFunction];
export function eventFactory(
  target: HTMLElement | null,
  events: HTMLElementEventHandlerMap
): [VoidFunction, VoidFunction];
export function eventFactory(target: any, events: Record<string, Function>) {
  return [
    () =>
      Object.entries(events).forEach(([type, callback]) =>
        target?.addEventListener(type, callback)
      ),
    () =>
      Object.entries(events).forEach(([type, callback]) =>
        target?.removeEventListener(type, callback)
      ),
  ];
}

export function subscribeEvents(
  target: Document,
  events: DocumentEventHandlerMap
): VoidFunction;
export function subscribeEvents(
  target: Window,
  events: WindowEventHandlerMap
): VoidFunction;
export function subscribeEvents(
  target: HTMLElement | null,
  events: HTMLElementEventHandlerMap
): VoidFunction;
export function subscribeEvents(target: any, events: Record<string, Function>) {
  const [addEventListeners, removeEventListeners] = eventFactory(
    target,
    events
  );

  addEventListeners();

  return removeEventListeners;
}
