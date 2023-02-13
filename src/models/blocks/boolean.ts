import { z } from "zod";

import { identity, pass } from "utils";

import { Converter } from "../types";

export const trueLike = z
  .enum(["true", "yes", "t", "y"])
  .transform(pass(true as const));
export const falseLike = z
  .enum(["false", "no", "f", "n"])
  .transform(pass(false as const));

export const booleanSchema = z.union([trueLike, falseLike, z.boolean()]);

export type TrueLike = z.input<typeof trueLike>;
export type FalseLike = z.input<typeof falseLike>;
export type BooleanType = z.input<typeof booleanSchema>;

function booleanString(
  value: boolean,
  trueValue?: TrueLike,
  falseValue?: FalseLike
): TrueLike | FalseLike;
function booleanString(value: boolean): `${boolean}`;
function booleanString(
  value: boolean,
  trueValue?: string,
  falseValue?: string
): string;
function booleanString(
  value: boolean,
  trueValue: any = "true",
  falseValue: any = "false"
) {
  return value ? trueValue : falseValue;
}

export function booleanSelectorProps(
  t: Converter<string> = identity,
  trueValue?: string,
  falseValue?: string
) {
  return {
    type: "radio" as const,
    options: [true, false],
    renderElement: (value: BooleanType) =>
      t(booleanString(booleanSchema.parse(value), trueValue, falseValue)),
  };
}

export { booleanString };
