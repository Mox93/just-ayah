import { FunctionComponent } from "react";
import InputField from "./InputField";

interface DatePickerProps {
  label: string;
  value?: Date;
  required?: boolean;
  onChange: (date: Date, valid: boolean) => void;
  validators?: [(value: Date) => boolean];
}

const DatePicker: FunctionComponent<DatePickerProps> = ({
  value,
  ...props
}) => {
  return (
    <InputField
      {...props}
      type="date"
      map={(value) =>
        typeof value === "string" || typeof value === "number"
          ? new Date(value)
          : undefined
      }
      value={value && value.toISOString().slice(0, 10)}
      required
    />
  );
};

export default DatePicker;
