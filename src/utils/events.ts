import { RefObject } from "react";

import { omit } from "./functions";

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

type HTMLElementEventHandlerMap = Partial<{
  [K in keyof HTMLElementEventMap]: (event: HTMLElementEventMap[K]) => void;
}>;

export function refEventFactory<T extends RefObject<HTMLElement>>(
  target: T,
  events: HTMLElementEventHandlerMap
) {
  return target.current ? eventFactory(target.current, events) : [omit, omit];
}

function eventFactory(
  target: Document,
  events: DocumentEventHandlerMap
): [VoidFunction, VoidFunction];
function eventFactory(
  target: Window,
  events: WindowEventHandlerMap
): [VoidFunction, VoidFunction];
function eventFactory(
  target: HTMLElement,
  events: HTMLElementEventHandlerMap
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
