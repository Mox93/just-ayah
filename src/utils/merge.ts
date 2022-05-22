import { MutableRefObject, Ref } from "react";

export const mergeRefs =
  <T>(...refs: Ref<T>[]) =>
  (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<T>).current = node;
      }
    });
  };

export const mergeCallbacks = (...callbacks: (Function | undefined)[]) => {
  const validCallbacks = callbacks.filter(
    (callback) => typeof callback === "function"
  );

  return validCallbacks.length
    ? (...args: any) => {
        validCallbacks.forEach((callback) => callback!(...args));
      }
    : undefined;
};