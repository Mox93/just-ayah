import { UnionToIntersection } from "models";
import { ReactElement } from "react";

type SimpleFC<TPropsIn, TPropsOut = any> = (
  props: TPropsIn
) => ReactElement<TPropsOut> | null;

export type Modifier<TExtraProps = {}> = <TPropsIn>(
  Component: SimpleFC<TPropsIn>
) => SimpleFC<TPropsIn & TExtraProps>;

export type Modifiers<TExtraProps extends Array<{}> = [{}]> = {
  [Idx in keyof TExtraProps]: Modifier<TExtraProps[Idx]>;
};

type Transformer = <TPropsIn, TExtraProps extends Array<{}>>(
  Component: SimpleFC<TPropsIn>,
  ...modifiers: Modifiers<TExtraProps>
) => SimpleFC<TPropsIn & UnionToIntersection<TExtraProps[number]>, TPropsIn>;

export const transformer: Transformer = (Component, ...modifiers) =>
  modifiers
    .reverse()
    .reduce((element, modifier) => modifier(element), Component);
