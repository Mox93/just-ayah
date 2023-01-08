import { countries } from "countries-list";
import { pluck } from "utils";
import { PathsOrConverters, renderAttributes } from "utils/render";

export type CountryCode = Exclude<keyof typeof countries, "IL">;

export const countryList = Object.keys(countries)
  .filter((code) => code !== "IL")
  .map((code) => ({
    ...countries[code as CountryCode],
    code: code as CountryCode,
  }));

export type Country = typeof countryList[number];

export const getCountry = (code?: CountryCode): Country | undefined =>
  code && countries[code] && { ...countries[code], code };

export const countrySelectorProps = (
  renderSections: PathsOrConverters<Country>,
  selectedCountry?: CountryCode
) => ({
  renderElement: renderAttributes(
    renderSections.map((field) =>
      field === "phone" ? (obj: Country) => `+${obj["phone"]}` : field
    )
  ),
  options: countryList,
  getKey: pluck<Country>("code"),
  selected: getCountry(selectedCountry),
});
