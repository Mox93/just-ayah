import { forwardRef, ReactNode, Ref } from "react";
import { cn, identity } from "utils";
import { useDirT } from "utils/translation";
import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";
import { InputProps } from "../Input";

interface SelectionInputProps<TOption>
  extends Omit<InputProps, "hidden" | "value" | "id"> {
  options: TOption[];
  type: "radio" | "checkbox";
  renderElement?: (option: TOption) => ReactNode;
  getKey?: (option: TOption) => string | number;
  getValue?: (option: TOption) => string;
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

          return (
            <div className="option" key={key}>
              <input
                {...props}
                {...{ ref, name, type, id }}
                value={getValue(option)}
              />
              <label htmlFor={id}>{renderElement(option)}</label>
            </div>
          );
        })}
      </FieldWrapper>
      {errorMessage}
    </div>
  );
};

export default forwardRef(SelectionInput);
