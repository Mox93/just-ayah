import { z } from "zod";
import { countries } from "countries-list";

import { pluck } from "utils";
import { PathsOrConverters, renderAttributes } from "utils/render";

export type CountryCode = Exclude<keyof typeof countries, "IL">;

export const countryCodeList = Object.keys(countries).filter(
  (code) => code !== "IL"
) as [CountryCode, ...CountryCode[]];

export const countryCodeSchema = z.enum(countryCodeList);

export const countryList = countryCodeList.map((code) => ({
  ...countries[code as CountryCode],
  code: code as CountryCode,
}));

export const countrySchema = countryCodeSchema.transform((value) => ({
  ...countries[value],
  code: value,
}));

export type Country = z.infer<typeof countrySchema>;

export function getCountry(code?: CountryCode) {
  return code && countries[code] && { ...countries[code], code };
}

export function countrySelectorProps(
  renderSections: PathsOrConverters<Country>,
  selectedCountry?: CountryCode
) {
  return {
    renderElement: renderAttributes(
      renderSections.map((field) =>
        field === "phone" ? (obj: Country) => `+${obj.phone}` : field
      )
    ),
    options: countryList,
    getKey: pluck<Country>("code"),
    selected: getCountry(selectedCountry),
  };
}
