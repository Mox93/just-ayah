import { MutableRefObject, Ref } from "react";

export function mergeRefs<T>(...refs: (Ref<T | null> | undefined)[]) {
  return (instance: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        (ref as MutableRefObject<T | null>).current = instance;
      }
    });
  };
}

export function mergeCallbacks(...callbacks: any[]) {
  const validCallbacks = callbacks.filter(
    (callback) => typeof callback === "function"
  );

  return validCallbacks.length
    ? (...args: any) => {
        validCallbacks.forEach((callback) => callback!(...args));
      }
    : undefined;
}
