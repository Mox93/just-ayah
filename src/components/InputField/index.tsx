import { FunctionComponent, InputHTMLAttributes, useState } from "react";

import { cn, identity, omit } from "utils";
import { useDirT } from "utils/translation";

import "./style.scss";

type InputTypes = "text" | "tel" | "email" | "url" | "date" | "password";

export interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
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
  onBlur = omit,
  validators = [() => true],
  map = identity,
  value = "",
  placeholder,
  ...props
}) => {
  const dirT = useDirT();
  const [visited, setVisited] = useState(false);

  if (required) {
    validators.push((value) => Boolean(value));
  }

  const invalid =
    visited && !validators.every((validator) => validator(map(value)));

  return (
    <label className={`InputField ${className}`}>
      {label && <h3 className={cn({ required, invalid }, "title")}>{label}</h3>}
      <input
        {...props}
        {...{ required, value }}
        dir={dir || value ? "auto" : dirT}
        placeholder={placeholder || label}
        className={cn({ invalid }, "field")}
        onChange={(e) => {
          setVisited(true);
          const value = map(e.target.value);
          onChange(
            value,
            validators.every((validator) => validator(value))
          );
        }}
        onBlur={(e) => {
          setVisited(true);
          onBlur(e);
        }}
      />
    </label>
  );
};

export default InputField;
