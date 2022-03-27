import { FunctionComponent } from "react";
import { cn, omit } from "utils";

interface CheckBoxProps {
  name: string;
  label: string;
  className?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckBox: FunctionComponent<CheckBoxProps> = ({
  checked = false,
  className,
  label,
  onChange = omit,
  ...props
}) => {
  return (
    <label className={cn("CheckBox", className)}>
      <input
        {...props}
        checked={checked}
        className="field"
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
      />
      <h3 className="title">{label}</h3>
    </label>
  );
};

export default CheckBox;
