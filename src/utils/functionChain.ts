import { identity } from "utils";

export type FunctionChain<TIn, TOut> = [
  (value: TIn) => any,
  ...Function[],
  (value: any) => TOut
];

export type FunctionOrChain<TIn, TOut> =
  | ((value: TIn) => TOut)
  | FunctionChain<TIn, TOut>;

function reduceChain<TIn, TOut>(chain: Function[]) {
  return (value: TIn) =>
    chain.reduce((node, func) => func(node), value) as unknown as TOut;
}

function applyInOrder<TIn, TOut>(
  funcOrChain: FunctionOrChain<TIn, TOut>[] | FunctionOrChain<TIn, TOut>
): (value: TIn) => TOut;
function applyInOrder<TIn, TOut>(
  funcOrChain: FunctionOrChain<TIn, TOut>[] | FunctionOrChain<TIn, TOut>,
  args: TIn
): TOut;
function applyInOrder<TIn, TOut>(
  funcOrChain: FunctionOrChain<TIn, TOut>[] | FunctionOrChain<TIn, TOut>,
  value?: TIn
) {
  const chain: Function[] =
    typeof funcOrChain === "function"
      ? [funcOrChain]
      : funcOrChain.flatMap(identity);

  const callback = reduceChain<TIn, TOut>(chain);

  return value === undefined ? callback : callback(value);
}

export { applyInOrder };
