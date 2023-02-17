import { forwardRef, InputHTMLAttributes, ReactNode, Ref } from "react";

import { useDirT, useUniqueId } from "hooks";
import { cn } from "utils";
import { filterByPosition, PositionalElement } from "utils/position";

import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";

const locations = ["header", "field", "input"] as const;
export type Location = typeof locations[number];

const { before, after } = filterByPosition<Location>();

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  children?: PositionalElement<Location>;
  fieldRef?: Ref<HTMLDivElement>;
  errorMessage?: ReactNode;
  visibleBorder?: boolean;
}

export default forwardRef(function Input(
  {
    className,
    dir,
    label,
    placeholder,
    required,
    isInvalid,
    isRequired,
    children,
    fieldRef,
    errorMessage,
    visibleBorder,
    id,
    name,
    ...props
  }: InputProps,
  ref: Ref<HTMLInputElement>
) {
  const dirT = useDirT();
  const _id = useUniqueId(name || "input");

  return (
    <div className={cn("Input", className)} dir={dir || dirT}>
      <FieldHeader
        htmlFor={id || _id}
        {...{ label, required, isRequired, isInvalid }}
      >
        {children}
      </FieldHeader>

      {before("field", children)}
      <FieldWrapper
        {...{ isInvalid, dir }}
        alwaysVisible={visibleBorder}
        ref={fieldRef}
      >
        {before("input", children)}
        <input
          {...{ ...props, required, ref, name }}
          id={id || _id}
          dir="auto"
          placeholder={placeholder || label || " "}
          className="field"
        />
        {after("input", children)}
      </FieldWrapper>
      {after("field", children)}
      {errorMessage}
    </div>
  );
});
