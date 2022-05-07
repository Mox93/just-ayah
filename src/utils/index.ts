import { MutableRefObject, Ref } from "react";

/***********************************\
|****** PLACEHOLDER FUNCTIONS ******|
\***********************************/

export const identity = (value: any) => value;

export const omit = () => {};

/*****************************\
|****** MERGE FUNCTIONS ******|
\*****************************/

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

/*****************************\
|****** ARRAY FUNCTIONS ******| 
\*****************************/

type Range = {
  (end: number): number[];
  (start: number, end: number, step?: number): number[];
};

export const range: Range = (startOrEnd, end?: number, step?: number) => {
  const [startAt, endAt] = end ? [startOrEnd, end] : [0, startOrEnd];
  const [endOfLoop, x] =
    startAt < endAt
      ? [(i: number) => i < endAt, step || 1]
      : [(i: number) => i > endAt, step ? (step > 0 ? -step : step) : -1];

  const output: number[] = [];

  for (let i = startAt; endOfLoop(i); i += x) {
    output.push(i);
  }

  return output;
};

/******************************\
|****** STRING FUNCTIONS ******| 
\******************************/

export const toCapitalized = (value: string) =>
  `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

export const toTitle = (value: string) =>
  value.split(" ").map(toCapitalized).join(" ");

/********************************************************************\
|***** PASSING DEFAULT EXPORTS AS NAMED EXPORTS FOR AUTO IMPORT *****|
\********************************************************************/

export { default as cn } from "classnames";
