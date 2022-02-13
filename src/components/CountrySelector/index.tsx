import { FunctionComponent } from "react";

import { CountryCode, countryList, getCountryName } from "models/country";
import DropdownMenu from "components/DropdownMenu";

import "./style.scss";

interface CountrySelectorProps {
  label: string;
  selected?: CountryCode;
  onChange: (value: CountryCode) => void;
  required?: boolean;
}

const CountrySelector: FunctionComponent<CountrySelectorProps> = (props) => {
  return (
    <DropdownMenu
      {...props}
      className="CountrySelector"
      name="country"
      options={countryList}
      getValue={getCountryName}
      getKey={(country) => country.code}
      map={(country) => country.code}
      renderElement={(country) => (
        <>
          <img
            className="flag"
            loading="lazy"
            src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
            alt={country.code}
          />
          <div className="info">
            <p className="name" dir="auto">
              {country.native}
            </p>
            <p className="phone" dir="ltr">
              (+{country.phone})
            </p>
          </div>
        </>
      )}
    />
  );
};

export default CountrySelector;
