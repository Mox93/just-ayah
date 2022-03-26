import cn from "classnames";
import { FunctionComponent, useState } from "react";

import DropdownMenu from "components/DropdownMenu";
import InputField, { InputFieldProps } from "components/InputField";
import { countryList } from "models/country";
import {
  addTag,
  getCountryCode,
  PhoneNumberInfo,
  removeTag,
  sanitizePhoneNumber,
} from "models/phoneNumber";

import CheckBox from "components/CheckBox";
import { identity, omit } from "utils";
import { usePersonalInfoT } from "utils/translation";

interface PhoneNumberProps extends Omit<InputFieldProps, "value" | "map"> {
  value?: Partial<PhoneNumberInfo>;
  tags?: { name: string; option: string }[];
  map?: (value: Partial<PhoneNumberInfo>) => any;
}

const PhoneNumber: FunctionComponent<PhoneNumberProps> = ({
  label,
  tags,
  value = {},
  onChange = omit,
  map = identity,
  required = false,
  ...props
}) => {
  const pi = usePersonalInfoT();

  const [validCode, setValidCode] = useState(!required);
  const [validNumber, setValidNumber] = useState(!required);

  // TODO handle invalid css class to title

  return (
    <div className="PhoneNumber">
      <h3 className={cn({ required }, "title")}>{label}</h3>
      <div className="data" dir="ltr">
        <DropdownMenu
          required={required}
          className="code"
          placeholder={pi("countryCode")}
          options={countryList}
          selected={value.code}
          mapKey={(country) => country.code}
          mapValue={getCountryCode}
          mapSelection={(country) => country.code}
          onChange={(code: string, valid) => {
            setValidCode(valid);
            onChange(map({ ...value, code }), validCode && validNumber);
          }}
          renderElement={(country) => (
            <>
              <p className="flag">{country.emoji}</p>
              <p className="countryCode">{country.code}</p>
              <p className="dialCode">+{country.phone}</p>
            </>
          )}
        />
        <InputField
          required={required}
          {...props}
          placeholder={pi("phoneNumber")}
          name="phoneNumber"
          className="number"
          type="tel"
          map={sanitizePhoneNumber}
          value={value.number}
          onChange={(number, valid) => {
            setValidNumber(valid);
            onChange(map({ ...value, number }), validCode && validNumber);
          }}
        />
      </div>
      {tags && (
        <div className="tags">
          {tags.map(({ name, option }) => (
            <CheckBox
              key={option}
              name={option}
              label={name}
              checked={value.tags?.includes(option)}
              onChange={(checked) =>
                onChange(
                  map(
                    checked ? addTag(value, option) : removeTag(value, option)
                  ),
                  true
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhoneNumber;
