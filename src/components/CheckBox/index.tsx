import { FunctionComponent } from "react";
import { omit } from "utils";

import "./style.scss";

interface CheckBoxProps {
  name: string;
  label: string;
  className?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckBox: FunctionComponent<CheckBoxProps> = ({
  className,
  label,
  onChange = omit,
  ...props
}) => {
  return (
    <label className={`CheckBox ${className}`}>
      <input
        {...props}
        className="field"
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
      />
      <h3 className="title">{label}</h3>
    </label>
  );
};

export default CheckBox;
