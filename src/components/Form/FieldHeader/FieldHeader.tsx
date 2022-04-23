import { FC } from "react";

import { cn } from "utils";
import { filterByPosition, PositionalElement } from "utils/position";
import { useDirT } from "utils/translation";

type Location = "header";

interface FieldHeaderProps {
  label?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  required?: boolean;
  children?: PositionalElement<string>;
}

const { before, after } = filterByPosition<Location>();

const FieldHeader: FC<FieldHeaderProps> = ({
  label,
  required,
  isInvalid,
  isRequired,
  children,
}) => {
  const dirT = useDirT();

  return label ? (
    <div className="FieldHeader" dir={dirT}>
      {before("header", children as PositionalElement<Location>)}
      <h3
        className={cn(
          { required: isRequired ?? required, invalid: isInvalid },
          "label"
        )}
      >
        {label}
      </h3>
      {after("header", children as PositionalElement<Location>)}
    </div>
  ) : null;
};

export default FieldHeader;
