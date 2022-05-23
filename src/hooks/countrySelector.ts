import {
  Country,
  CountryCode,
  countryList,
  getCountry,
  getCountryCode,
} from "models/country";
import { renderAttributes } from "utils/render";

interface CountryHookProps {
  renderSections: (keyof Country)[];
  selectedCountry?: CountryCode;
}

const useCountrySelector = ({
  renderSections,
  selectedCountry,
}: CountryHookProps) => ({
  renderElement: renderAttributes(
    ...renderSections.map((field) =>
      field === "phone" ? (obj: Country) => `+${obj["phone"]}` : field
    )
  ),
  options: countryList,
  getKey: getCountryCode,
  selected: getCountry(selectedCountry),
});

export default useCountrySelector;
