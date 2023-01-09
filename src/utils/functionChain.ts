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
  (value: TIn) =>
    chain.reduce((node, func) => func(node), value) as unknown as TOut;

export const applyInOrder = <TIn = any, TOut = any>(
  ...funcOrChain: FunctionOrChain<TIn, TOut>[]
) => {
  const chain: Function[] = [];

  funcOrChain.forEach((foc) =>
    typeof foc === "function" ? chain.push(foc) : chain.push(...foc)
  );

  return reduceChain<TIn, TOut>(chain);
};
