import { z } from "zod";

import { Converter } from "models";
import { identity, oneOf } from "utils";

const trueLike = z.enum(["true", "yes", "t", "y"]);
const falseLike = z.enum(["false", "no", "f", "n"]);
export const booleanSchema = z
  .union([trueLike, falseLike, z.boolean()])
  .transform((value) =>
    oneOf(value, trueLike.options)
      ? true
      : oneOf(value, falseLike.options)
      ? false
      : value
  );

export type TrueLike = z.infer<typeof trueLike>;
export type FalseLike = z.infer<typeof falseLike>;
export type BooleanType = z.input<typeof booleanSchema>;

function booleanString(
  value: BooleanType,
  trueValue?: TrueLike,
  falseValue?: FalseLike
): TrueLike | FalseLike;
function booleanString(value: BooleanType): `${boolean}`;
function booleanString(
  value: BooleanType,
  trueValue?: string,
  falseValue?: string
): string;
function booleanString(
  value: BooleanType,
  trueValue: any = "true",
  falseValue: any = "false"
) {
  return booleanSchema.parse(value) ? trueValue : falseValue;
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
      t(booleanString(value, trueValue, falseValue)),
  };
}

export { booleanString };
