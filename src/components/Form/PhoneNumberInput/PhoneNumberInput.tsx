import { ChangeEvent, Ref, useState } from "react";

import { Merge } from "models";
import { Country } from "models/country";
import { PhoneNumberInfo } from "models/phoneNumber";
import { cn, omit } from "utils";

import CountrySelectorInput from "../CountrySelectorInput";
import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";
import Input, { InputProps } from "../Input";

type PhoneNumberInputProps = Merge<
  InputProps,
  {
    value?: Partial<PhoneNumberInfo>;
    innerRef?: {
      [key in keyof PhoneNumberInfo]+?: Ref<HTMLInputElement>;
    };
    onChange?: (value?: Partial<PhoneNumberInfo>) => void;
  }
>;

const PhoneNumberInput = ({
  label,
  required,
  isRequired,
  isInvalid,
  name,
  children,
  value,
  innerRef,
  onChange = omit,
  errorMessage,
  className,
  ...props
}: PhoneNumberInputProps) => {
  const [_, setInnerValue] = useState<Partial<PhoneNumberInfo>>();

  const handleCode = (value?: Country) =>
    setInnerValue((state) => {
      const newState = { ...state, code: value?.code };
      onChange(newState);
      return newState;
    });

  const handleNumber = (event: ChangeEvent<HTMLInputElement>) =>
    setInnerValue((state) => {
      const newState = {
        ...state,
        number: event.target.value,
      };
      onChange(newState);
      return newState;
    });

  // TODO add tags
  return (
    <div className={cn("PhoneNumberInput", className)}>
      <FieldHeader {...{ label, required, isRequired, isInvalid }}>
        {children}
      </FieldHeader>

      <FieldWrapper dir="ltr" isInvalid={isInvalid} addPartitions>
        <CountrySelectorInput
          {...props}
          name={`${name}.code`}
          renderSections={["emoji", "code", "phone"]}
          dir="ltr"
          className="countryCode"
          placeholder="+00"
          ref={innerRef?.code}
          value={value?.code}
          setValue={handleCode}
        />

        <Input
          {...props}
          ref={innerRef?.number}
          value={value?.number}
          onChange={handleNumber}
          name={`${name}.number`}
          dir="ltr"
          className="dialNumber"
          placeholder="000-000-0000"
        />
      </FieldWrapper>
      {errorMessage}
    </div>
  );
};

export default PhoneNumberInput;
