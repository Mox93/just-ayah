import { ReactElement, createElement, Children } from "react";

const positions = ["before", "after"] as const;

type PositionWrapper<TPosition extends typeof positions[number]> = <
  TLocation extends string,
  TProps = any
>(
  location: TLocation,
  children: ReactElement<TProps>
) => ReactElement<TProps & { position: `${TPosition}-${TLocation}` }>;

type FilterByPosition = <TLocation extends string>() => {
  [P in typeof positions[number]]: (
    location: TLocation,
    children?: PositionalElement<TLocation>
  ) => PositionalElement<TLocation>;
};

type Position<
  TLocation extends string,
  TPosition extends string = typeof positions[number]
> = `${TPosition}-${TLocation}`;

export type PositionalElement<TLocation extends string> =
  | ReactElement<{ position: Position<TLocation> }>
  | ReactElement<{ position: Position<TLocation> }>[]
  | undefined
  | null;

export const before: PositionWrapper<"before"> = (
  location,
  { type, props }
) => {
  return createElement(type, {
    ...props,
    position: `before-${location}`,
  });
};

export const after: PositionWrapper<"after"> = (
  location,
  { type, props, key }
) => {
  return createElement(type, {
    ...props,
    position: `after-${location}`,
    key,
  });
};

export const filterByPosition: FilterByPosition = () => ({
  before: (location, children) =>
    Children.map(children, (child) =>
      child?.props.position === `before-${location}` ? child : null
    ),
  after: (location, children) =>
    Children.map(children, (child) =>
      child?.props.position === `after-${location}` ? child : null
    ),
});
