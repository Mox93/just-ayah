import { get } from "lodash";
import { FieldPath } from "react-hook-form";

export const identity = (value: any) => value;
export const omit = () => {};

type Pass = {
  (func?: Function, ...args: any): () => any;
  (value: any): () => any;
};
export const pass: Pass =
  (funcOrValue, ...args) =>
  () =>
    typeof funcOrValue === "function" ? funcOrValue(...args) : funcOrValue;

export const pluck =
  <TObject>(path: FieldPath<TObject>) =>
  (obj?: TObject) =>
    get(obj, path);

/****************************\
|****** Function Chain ******|
\****************************/

export type FunctionChain<TIn = any, TOut = any> = [
  (value: TIn) => any,
  ...Function[],
  (value: any) => TOut
];

export type FunctionOrChain<TIn = any, TOut = any> =
  | ((value: TIn) => TOut)
  | FunctionChain<TIn, TOut>;

export const reduceChain =
  <TIn, TOut>(chain: Function[]) =>
  (value: TIn): TOut =>
    chain.reduce((node, func) => func(node), value) as any;

export const applyInOrder = <TIn = any, TOut = any>(
  ...funcOrChain: FunctionOrChain<TIn, TOut>[]
) => {
  const chain: Function[] = [];

  funcOrChain.forEach((foc) =>
    typeof foc === "function" ? chain.push(foc) : chain.push(...foc)
  );

  return reduceChain<TIn, TOut>(chain);
};
