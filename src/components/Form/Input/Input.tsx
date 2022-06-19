import { forwardRef, InputHTMLAttributes, ReactNode, Ref } from "react";

import { useDirT } from "hooks";
import { cn } from "utils";
import { filterByPosition, PositionalElement } from "utils/position";

import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";

const locations = ["header", "field", "input"] as const;
type Location = typeof locations[number];

const { before, after } = filterByPosition<Location>();

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  children?: PositionalElement<Location>;
  labelRef?: Ref<HTMLLabelElement>;
  errorMessage?: ReactNode;
  visibleBorder?: boolean;
}

const Input = (
  {
    className,
    dir,
    label,
    placeholder,
    required,
    isInvalid,
    isRequired,
    children,
    labelRef,
    errorMessage,
    visibleBorder,
    ...props
  }: InputProps,
  ref: Ref<HTMLInputElement>
) => {
  const dirT = useDirT();

  return (
    <label className={cn("Input", className)} ref={labelRef} dir={dir || dirT}>
      <FieldHeader {...{ label, required, isRequired, isInvalid }}>
        {children}
      </FieldHeader>

      {before("field", children)}
      <FieldWrapper {...{ isInvalid, dir }} alwaysVisible={visibleBorder}>
        {before("input", children)}
        <input
          {...props}
          {...{ required, ref }}
          dir="auto"
          placeholder={placeholder || label || " "}
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
