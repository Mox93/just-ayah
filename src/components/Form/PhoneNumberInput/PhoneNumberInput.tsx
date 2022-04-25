import { HTMLAttributes, ReactNode } from "react";

import { InnerProps } from "models";
import { cn } from "utils";
import { PositionalElement } from "utils/position";

import CountrySelectorInput, {
  CountrySelectorInputProps,
} from "../CountrySelectorInput";
import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";
import Input, { InputProps } from "../Input";

interface PhoneNumberInputProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  name?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  children?: PositionalElement<string>;
  errorMessage?: ReactNode;
  innerProps?: {
    code?: InnerProps<CountrySelectorInputProps>;
    number?: InnerProps<InputProps>;
  };
}

const PhoneNumberInput = ({
  label,
  isRequired,
  isInvalid,
  name,
  children,
  errorMessage,
  className,
  innerProps: { code: codeProps, number: numberProps } = {},
  ...props
}: PhoneNumberInputProps) => {
  // TODO add tags
  return (
    <div {...props} className={cn("PhoneNumberInput", className)}>
      <FieldHeader {...{ label, isRequired, isInvalid }}>
        {children}
      </FieldHeader>

      <FieldWrapper dir="ltr" isInvalid={isInvalid} addPartitions>
        <CountrySelectorInput
          name={`${name}.code`}
          renderSections={["emoji", "code", "phone"]}
          dir="ltr"
          placeholder="+00"
          {...codeProps}
          className={cn("countryCode", codeProps?.className)}
        />

        <Input
          name={`${name}.number`}
          dir="ltr"
          placeholder="000-000-0000"
          {...numberProps}
          className={cn("dialNumber", numberProps?.className)}
        />
      </FieldWrapper>
      {errorMessage}
    </div>
  );
};

export default PhoneNumberInput;
