import { Country, CountryCode, countryList, getCountry } from "models/country";
import { pluck } from "utils";
import { PathsOrConverters, renderAttributes } from "utils/render";

interface CountryHookProps {
  renderSections: PathsOrConverters<Country>;
  selectedCountry?: CountryCode;
}

const useCountrySelector = ({
  renderSections,
  selectedCountry,
}: CountryHookProps) => ({
  renderElement: renderAttributes(
    renderSections.map((field) =>
      field === "phone" ? (obj: Country) => `+${obj["phone"]}` : field
    )
  ),
  options: countryList,
  getKey: pluck<Country>("code"),
  selected: getCountry(selectedCountry),
});

export default useCountrySelector;
