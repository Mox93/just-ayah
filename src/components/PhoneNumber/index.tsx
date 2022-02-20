import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import DropdownMenu from "components/DropdownMenu";
import InputField from "components/InputField";
import { countryList, getCountry } from "models/country";
import {
  addTag,
  PhoneNumberInfo,
  removeTag,
  sanitizePhoneNumber,
} from "models/phoneNumber";

import "./style.scss";
import CheckBox from "components/CheckBox";

interface PhoneNumberProps {
  label: string;
  value?: Partial<PhoneNumberInfo>;
  required?: boolean;
  onChange: (value: Partial<PhoneNumberInfo>) => void;
}

const PhoneNumber: FunctionComponent<PhoneNumberProps> = ({
  value = {},
  onChange,
  ...props
}) => {
  const { t } = useTranslation();
  const pi = (value: string) => t(`personal_info.${value}`);

  const availabilityOptions = ["WhatsApp", "call"];

  return (
    <div className="PhoneNumber">
      <div className="data" dir="ltr">
        <DropdownMenu
          className="code"
          label={pi("country_code")}
          options={countryList}
          selected={value.code}
          getKey={(country) => country.code}
          getValue={(code) => {
            const country = getCountry(code);
            return country ? `+${country.phone}` : "";
          }}
          map={(country) => country.code}
          onChange={(code: string) => onChange({ ...value, code })}
          renderElement={(country) => (
            <>
              <p className="flag">{country.emoji}</p>
              <p className="countryCode">{country.code}</p>
              <p className="dialCode">+{country.phone}</p>
            </>
          )}
        />
        <InputField
          {...props}
          name="phoneNumber"
          className="number"
          type="tel"
          map={sanitizePhoneNumber}
          value={value.number}
          onChange={(number: string) => onChange({ ...value, number })}
        />
      </div>
      <div className="tags">
        {availabilityOptions.map((option) => (
          <CheckBox
            key={option}
            name={option}
            label={pi(option)}
            checked={value.tags?.has(option)}
            onChange={(checked) =>
              checked ? addTag(value, option) : removeTag(value, option)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default PhoneNumber;
