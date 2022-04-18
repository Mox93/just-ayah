import { cn } from "utils";
import { filterByPosition, PositionalElement } from "utils/position";

type Location = "header";

interface FieldHeaderProps {
  label?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  required?: boolean;
  children?: PositionalElement<Location>;
}

const { before, after } = filterByPosition<Location>();

const FieldHeader = ({
  label,
  required,
  isInvalid,
  isRequired,
  children,
}: FieldHeaderProps) => {
  return (
    <div className="FieldHeader">
      {before("header", children)}
      <h3
        className={cn(
          { required: isRequired ?? required, invalid: isInvalid },
          "label"
        )}
      >
        {label}
      </h3>
      {after("header", children)}
    </div>
  );
};

export default FieldHeader;
