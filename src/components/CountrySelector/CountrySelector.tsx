import { FunctionComponent } from "react";

import { CountryCode, countryList, getCountry } from "models/country";
import DropdownMenu from "components/DropdownMenu";

interface CountrySelectorProps {
  label: string;
  name?: string;
  selected?: CountryCode;
  onChange: (value: CountryCode) => void;
  required?: boolean;
}

const CountrySelector: FunctionComponent<CountrySelectorProps> = (props) => {
  return (
    <DropdownMenu
      {...props}
      className="CountrySelector"
      options={countryList}
      mapValue={(code) => getCountry(code)?.native}
      mapKey={(country) => country.code}
      mapSelection={(country) => country.code}
      renderElement={(country) => (
        <div className="info">
          <p className="flag">{country.emoji}</p>
          <p className="name" dir="auto">
            {country.native}
          </p>
        </div>
      )}
    />
  );
};

export default CountrySelector;
