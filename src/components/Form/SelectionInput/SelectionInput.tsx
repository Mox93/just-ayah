import { forwardRef, ReactNode, Ref } from "react";

import { applyInOrder, capitalize, cn, FunctionOrChain, identity } from "utils";

import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";
import { InputProps, Location } from "../Input";
import { Converter, GetKey } from "models";
import { filterByPosition } from "utils/position";

export interface SelectionInputProps<TOption>
  extends Omit<InputProps, "value" | "id"> {
  options: TOption[];
  type: "radio" | "checkbox";
  renderElement?: FunctionOrChain<TOption, ReactNode>;
  keepFormat?: boolean;
  getKey?: GetKey<TOption>;
  getValue?: Converter<TOption, string>;
}

const { before, after } = filterByPosition<Location>();

export default forwardRef(function SelectionInput<TOption>(
  {
    label,
    isRequired,
    isInvalid,
    className,
    options,
    children,
    name,
    dir,
    errorMessage,
    keepFormat,
    renderElement = identity,
    getKey = identity,
    getValue = identity,
    ...props
  }: SelectionInputProps<TOption>,
  ref: Ref<HTMLInputElement>
) {
  const render = applyInOrder(renderElement);

  return (
    <div className={cn("SelectionInput", className)} dir={dir}>
      <FieldHeader {...{ label, isRequired, isInvalid }}>
        {children}
      </FieldHeader>

      {before("field", children)}
      <FieldWrapper addPartitions isInvalid={isInvalid}>
        {options.map((option) => {
          const key = getKey(option);
          const id = `${name}_${key}`;
          const label = render(option);

          return (
            <div className="option" key={key}>
              <input
                {...{ ...props, ref, name, id }}
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
      {after("field", children)}
      {errorMessage}
    </div>
  );
});
