import { InputHTMLAttributes, ReactNode, Ref } from "react";

import { cn } from "utils";
import { filterByPosition, PositionalElement } from "utils/position";
import { useDirT } from "utils/translation";

import { forwardRef } from "react";
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
  setValue?: (value: any) => void;
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
    setValue,
    labelRef,
    errorMessage,
    ...props
  }: InputProps,
  ref: Ref<HTMLInputElement>
) => {
  const dirT = useDirT();

  return (
    <label className={cn("Input", className)} ref={labelRef} dir={dirT}>
      {label && (
        <FieldHeader {...{ label, required, isRequired, isInvalid }}>
          {children as PositionalElement<"header">}
        </FieldHeader>
      )}

      {before("field", children)}
      <FieldWrapper isInvalid={isInvalid} dir={dir}>
        {before("input", children)}
        <input
          {...props}
          {...{ required, ref }}
          dir={autoDir ? "auto" : dir || dirT}
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
