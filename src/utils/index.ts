import { MutableRefObject, Ref } from "react";

// PLACEHOLDER FUNCTIONS
export const identity = (value: any) => value;

export const omit = () => {};

// SIMPLE CONVERTER FUNCTIONS
export const fromYesNo = (value?: string) =>
  value === "yes" ? true : value === "no" ? false : undefined;

export const toYesNo = (value?: boolean) =>
  value === true ? "yes" : value === false ? "no" : undefined;

// PASSTHROUGH FUNCTIONS
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

// PASSING DEFAULT EXPORTS AS NAMED EXPORTS FOR AUTO IMPORT
export { default as cn } from "classnames";
