import { createElement, FC, forwardRef, ReactElement } from "react";
import { UnionToIntersection } from "type-fest";

type SimpleFC<TPropsIn, TPropsOut = any> = (
  props: TPropsIn
) => ReactElement<TPropsOut> | null;

export type Modifier<TExtraProps = {}> = <TPropsIn>(
  Component: SimpleFC<TPropsIn>
) => SimpleFC<TPropsIn & TExtraProps>;

export type Modifiers<TExtraProps extends {}[] = [{}]> = {
  [Idx in keyof TExtraProps]: Modifier<TExtraProps[Idx]>;
};

type CreateModifier = <TExtraProps = {}>(
  propsModifier: (props: any, originalProps?: any) => any
) => Modifier<TExtraProps>;

export const createModifier: CreateModifier = (propsModifier) => (Component) =>
  forwardRef(({ __originalProps, ...props }: any, ref) => {
    const originalProps = __originalProps || props;
    return createElement(Component as FC, {
      ...propsModifier({ ...props, ...(ref && { ref }) }, originalProps),
      __originalProps: originalProps,
    });
  });

const sanitize: Modifier = (Component) =>
  forwardRef(({ __originalProps, ...props }: any, ref) =>
    createElement(Component as FC, { ...props, ...(ref && { ref }) })
  );

type Transformer = <TPropsIn, TExtraProps extends {}[]>(
  Component: SimpleFC<TPropsIn>,
  ...modifiers: Modifiers<TExtraProps>
) => SimpleFC<TPropsIn & UnionToIntersection<TExtraProps[number]>, TPropsIn>;

export const transformer: Transformer = (Component, ...modifiers) =>
  modifiers.reduceRight(
    (element, modifier) => modifier(element),
    sanitize(Component) as any
  );
