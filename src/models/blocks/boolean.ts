import { identity } from "utils";

const trueLike = [true, "true", "yes", "t", "y"] as const;
const falseLike = [false, "false", "no", "f", "n"] as const;

export type TrueLike = typeof trueLike[number];
export type FalseLike = typeof falseLike[number];

export type BooleanLike = TrueLike | FalseLike;

function toBoolean(value: BooleanLike): boolean;
function toBoolean<T>(value: T): T;
function toBoolean(value: any) {
  const processedValue =
    typeof value === "string" ? value.toLocaleLowerCase() : value;

  return trueLike.includes(processedValue)
    ? true
    : falseLike.includes(processedValue)
    ? false
    : value;
}

function booleanToString(
  value: BooleanLike,
  trueValue: TrueLike,
  falseValue: FalseLike
): BooleanLike;
function booleanToString(value: BooleanLike): BooleanLike;
function booleanToString(
  value: BooleanLike,
  trueValue?: string,
  falseValue?: string
): string;
function booleanToString<T>(value: T): T;
function booleanToString(
  value: any,
  trueValue: any = "true",
  falseValue: any = "false"
) {
  const processedValue =
    typeof value === "string" ? value.toLocaleLowerCase() : value;

  return trueLike.includes(processedValue)
    ? trueValue
    : falseLike.includes(processedValue)
    ? falseValue
    : value;
}

export const booleanSelectorProps = (
  t: (value: string) => string = identity,
  trueValue?: string,
  falseValue?: string
) => ({
  type: "radio" as const,
  options: [true, false],
  renderElement: (value: BooleanLike) =>
    t(booleanToString(value, trueValue, falseValue)),
});

export { toBoolean, booleanToString };
