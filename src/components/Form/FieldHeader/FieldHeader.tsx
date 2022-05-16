import { FC } from "react";

import { cn, capitalize } from "utils";
import { filterByPosition, PositionalElement } from "utils/position";
import { useDirT, useLanguage } from "utils/translation";

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
  const [lang] = useLanguage();

  return label ? (
    <div className="FieldHeader" dir={dirT}>
      {before("header", children as PositionalElement<Location>)}
      <h4
        className={cn(
          {
            required: isRequired ?? required,
            invalid: isInvalid,
            title: lang !== "ar",
          },
          "label"
        )}
      >
        {capitalize(label)}
      </h4>
      {after("header", children as PositionalElement<Location>)}
    </div>
  ) : null;
};

export default FieldHeader;
