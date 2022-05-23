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

export type FunctionChain<TIn = any, TOut = any> = [
  (value: TIn) => any,
  ...Function[],
  (value: any) => TOut
];

export const reduceChain =
  <TIn, TOut>(chain: FunctionChain<TIn, TOut>) =>
  (value: TIn): TOut =>
    chain.reduce((node, func) => func(node), value) as any;

export type FunctionOrChain<TIn = any, TOut = any> =
  | ((value: TIn) => TOut)
  | FunctionChain<TIn, TOut>;

export const applyInOrder = <TIn = any, TOut = any>(
  funcOrChain: FunctionOrChain<TIn, TOut>
) =>
  typeof funcOrChain === "function" ? funcOrChain : reduceChain(funcOrChain);
