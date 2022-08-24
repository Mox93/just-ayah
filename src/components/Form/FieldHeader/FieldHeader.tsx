import { FC } from "react";

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
  linked?: boolean;
}

const { before, after } = filterByPosition<Location>();

const FieldHeader: FC<FieldHeaderProps> = ({
  htmlFor,
  label,
  required,
  isInvalid,
  isRequired,
  children,
  linked,
}) => {
  const dirT = useDirT();

  return label ? (
    <label
      className="FieldHeader"
      dir={dirT}
      htmlFor={htmlFor}
      onClick={(e) => linked || e.preventDefault()}
    >
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
};

export default FieldHeader;
