import { forwardRef, ReactNode, Ref } from "react";

import { useDirT } from "hooks";
import { applyInOrder, capitalize, cn, FunctionOrChain, identity } from "utils";

import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";
import { InputProps } from "../Input";
import { Converter, GetKey } from "models";

export interface SelectionInputProps<TOption>
  extends Omit<InputProps, "value" | "id"> {
  options: TOption[];
  type: "radio" | "checkbox";
  renderElement?: FunctionOrChain<TOption, ReactNode>;
  keepFormat?: boolean;
  getKey?: GetKey<TOption>;
  getValue?: Converter<TOption, string>;
}

const SelectionInput = <TOption,>(
  {
    label,
    isRequired,
    isInvalid,
    className,
    options,
    children,
    name,
    type,
    dir,
    errorMessage,
    keepFormat,
    renderElement = identity,
    getKey = identity,
    getValue = identity,
    ...props
  }: SelectionInputProps<TOption>,
  ref: Ref<HTMLInputElement>
) => {
  const dirT = useDirT();

  return (
    <div className={cn("SelectionInput", className)} dir={dir || dirT}>
      <FieldHeader {...{ label, isRequired, isInvalid }}>
        {children}
      </FieldHeader>

      <FieldWrapper addPartitions isInvalid={isInvalid}>
        {options.map((option) => {
          const key = getKey(option);
          const id = `${name}_${key}`;
          const label = applyInOrder(renderElement)(option);

          return (
            <div className="option" key={key}>
              <input
                {...{ ...props, ref, name, type, id }}
                value={getValue(option)}
              />
              <label htmlFor={id}>
                {typeof label !== "string" || keepFormat
                  ? label
                  : capitalize(label)}
              </label>
            </div>
          );
        })}
      </FieldWrapper>
      {errorMessage}
    </div>
  );
};

export default forwardRef(SelectionInput);
