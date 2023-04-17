import { useEffect } from "react";

import {
  DocumentEventHandlerMap,
  HTMLElementEventHandlerMap,
  ValueOrGetter,
  WindowEventHandlerMap,
  eventFactory,
  resolveValue,
} from "utils";

import useRefSync from "./RefSync";

function useEventListener(
  target: Document,
  events: ValueOrGetter<DocumentEventHandlerMap>
): void;
function useEventListener(
  target: Window,
  events: ValueOrGetter<WindowEventHandlerMap>
): void;
function useEventListener(
  target: HTMLElement | null,
  events: ValueOrGetter<HTMLElementEventHandlerMap>
): void;
function useEventListener(
  target: any,
  events: ValueOrGetter<Record<string, Function>>
) {
  const eventsRef = useRefSync(events);

  useEffect(() => {
    const [addEventListeners, removeEventListeners] = eventFactory(
      target,
      resolveValue(eventsRef.current)
    );

    addEventListeners();

    return removeEventListeners;
  }, [eventsRef, target]);
}

export default useEventListener;
