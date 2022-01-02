import { FunctionComponent, InputHTMLAttributes, useState } from "react";
import { cn, identity, omit } from "../utils";

type InputTypes = "text" | "tel" | "email" | "url" | "date" | "password";

interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  type?: InputTypes;
  onChange?: (value: any, valid: boolean) => void;
  validators?: [(value: any) => boolean];
  map?: (value: string | number | readonly string[] | undefined) => any;
}

const InputField: FunctionComponent<InputFieldProps> = ({
  className,
  dir,
  label,
  required = false,
  onChange = omit,
  validators = [() => true],
  map = identity,
  value,
  ...props
}) => {
  const [visited, setVisited] = useState(false);
  const invalid = visited
    ? (required && !value) ||
      !validators.every((validate) => validate(map(value)))
    : false;

  return (
    <label className={`input-field ${className}`}>
      <h3 className={cn({ required, invalid }, "title")}>{label}</h3>
      <input
        {...{ ...props, required, value }}
        dir={dir || "auto"}
        className={cn({ invalid }, "field")}
        onChange={(e) => {
          setVisited(true);
          const value = e.target.value && map(e.target.value);
          onChange(
            value,
            validators.every((validator) => validator(value))
          );
        }}
        onBlur={(e) => setVisited(true)}
      />
    </label>
  );
};

export default InputField;
