import { cn, capitalize } from "utils";
import { filterByPosition, PositionalElement } from "utils/position";

type Location = "header";

export interface FieldHeaderProps {
  htmlFor?: string;
  label?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  children?: PositionalElement<string>;
  className?: string;
}

const { before, after } = filterByPosition<Location>();

export default function FieldHeader({
  htmlFor,
  label,
  isInvalid,
  isRequired,
  children,
  className,
}: FieldHeaderProps) {
  return label ? (
    <label className={cn("FieldHeader", className)} htmlFor={htmlFor}>
      {before("header", children as PositionalElement<Location>)}
      <h4
        className={cn(
          {
            required: isRequired,
            invalid: isInvalid,
          },
          "label"
        )}
      >
        {capitalize(label)}
      </h4>
      {after("header", children as PositionalElement<Location>)}
    </label>
  ) : null;
}
