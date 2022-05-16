import { FunctionChain, reduceChain } from "./array";

export const identity = (value: any) => value;
export const omit = () => {};

type Pass = {
  (func: Function, ...args: any): () => any;
  (value: any): () => any;
};
export const pass: Pass =
  (funcOrValue, ...args) =>
  () =>
    typeof funcOrValue === "function" ? funcOrValue(...args) : funcOrValue;

export type FunctionOrChain<TIn = any, TOut = any> =
  | ((value: TIn) => TOut)
  | FunctionChain<TIn, TOut>;

export const applyInOrder = (funcOrChain: FunctionOrChain) =>
  typeof funcOrChain === "function" ? funcOrChain : reduceChain(funcOrChain);
