import { UnionToIntersection } from "models";
import { createElement, forwardRef, ReactElement } from "react";

type SimpleFC<TPropsIn, TPropsOut = any> = (
  props: TPropsIn
) => ReactElement<TPropsOut> | null;

export type Modifier<TExtraProps = {}> = <TPropsIn>(
  Component: SimpleFC<TPropsIn>
) => SimpleFC<TPropsIn & TExtraProps>;

export type Modifiers<TExtraProps extends Array<{}> = [{}]> = {
  [Idx in keyof TExtraProps]: Modifier<TExtraProps[Idx]>;
};

type CreateModifier = <TExtraProps = {}>(
  propsModifier: (props: any, originalProps?: any) => any
) => Modifier<TExtraProps>;

export const createModifier: CreateModifier = (propsModifier) => (Component) =>
  forwardRef(({ __originalProps, ...props }: any, ref) => {
    const originalProps = __originalProps || props;
    return createElement(Component, {
      ...propsModifier({ ...props, ...(ref && { ref }) }, originalProps),
      __originalProps: originalProps,
    });
  });

const sanitize: Modifier = (Component) =>
  forwardRef(({ __originalProps, ...props }: any, ref) =>
    createElement(Component, { ...props, ...(ref && { ref }) })
  );

type Transformer = <TPropsIn, TExtraProps extends Array<{}>>(
  Component: SimpleFC<TPropsIn>,
  ...modifiers: Modifiers<TExtraProps>
) => SimpleFC<TPropsIn & UnionToIntersection<TExtraProps[number]>, TPropsIn>;

export const transformer: Transformer = (Component, ...modifiers) =>
  modifiers.reduceRight(
    (element, modifier) => modifier(element),
    sanitize(Component)
  );
