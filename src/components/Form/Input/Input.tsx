import { forwardRef, InputHTMLAttributes, ReactNode, Ref } from "react";

import { cn } from "utils";
import { filterByPosition, PositionalElement } from "utils/position";

import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";

const locations = ["header", "field", "input"] as const;
type Location = typeof locations[number];

const { before, after } = filterByPosition<Location>();

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  autoDir?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  children?: PositionalElement<Location>;
  labelRef?: Ref<HTMLLabelElement>;
  errorMessage?: ReactNode;
}

const Input = (
  {
    className,
    dir,
    label,
    placeholder,
    autoDir,
    required,
    isInvalid,
    isRequired,
    children,
    labelRef,
    errorMessage,
    ...props
  }: InputProps,
  ref: Ref<HTMLInputElement>
) => {
  return (
    <label className={cn("Input", className)} ref={labelRef} dir={dir}>
      <FieldHeader {...{ label, required, isRequired, isInvalid }}>
        {children}
      </FieldHeader>

      {before("field", children)}
      <FieldWrapper isInvalid={isInvalid}>
        {before("input", children)}
        <input
          {...props}
          {...{ required, ref }}
          dir={autoDir ? "auto" : dir}
          placeholder={placeholder || label}
          className="field"
        />
        {after("input", children)}
      </FieldWrapper>
      {after("field", children)}
      {errorMessage}
    </label>
  );
};

export default forwardRef(Input);
