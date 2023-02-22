import { useDirT } from "hooks";
import { cn, capitalize } from "utils";
import { filterByPosition, PositionalElement } from "utils/position";

type Location = "header";

interface FieldHeaderProps {
  htmlFor?: string;
  label?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  required?: boolean;
  children?: PositionalElement<string>;
}

const { before, after } = filterByPosition<Location>();

export default function FieldHeader({
  htmlFor,
  label,
  required,
  isInvalid,
  isRequired,
  children,
}: FieldHeaderProps) {
  const dirT = useDirT();

  return label ? (
    <label className="FieldHeader" dir={dirT} htmlFor={htmlFor}>
      {before("header", children as PositionalElement<Location>)}
      <h4
        className={cn(
          {
            required: isRequired ?? required,
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
