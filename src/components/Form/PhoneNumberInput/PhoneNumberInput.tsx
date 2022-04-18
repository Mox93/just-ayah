import { countryList } from "models/country";
import { PhoneNumberInfo } from "models/phoneNumber";
import { PositionalElement } from "utils/position";
import AutoCompleatInput from "../AutoCompleatInput";
import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";
import Input, { InputProps } from "../Input";

type PhoneNumberParent = { [key: string | number]: PhoneNumberInfo };

interface PhoneNumberInputProps extends InputProps {}

const PhoneNumberInput = ({
  label,
  required,
  isRequired,
  isInvalid,
  name,
  children,
  ...props
}: PhoneNumberInputProps) => {
  return (
    <div className="PhoneNumberInput">
      {label && (
        <FieldHeader {...{ label, required, isRequired, isInvalid }}>
          {children as PositionalElement<"header">}
        </FieldHeader>
      )}

      <FieldWrapper dir="ltr" isInvalid={isInvalid}>
        <AutoCompleatInput
          {...props}
          name={`${name}.code`}
          options={["+20", "+955"]}
          dir="ltr"
          className="countryCode"
          placeholder="+00"
        />

        <Input
          {...props}
          name={`${name}.number`}
          dir="ltr"
          className="dialNumber"
          placeholder="000-000-0000"
        />
      </FieldWrapper>
    </div>
  );
};

export default PhoneNumberInput;
