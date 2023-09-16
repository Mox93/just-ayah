import { countries } from "countries-list";

export type CountryCode = Exclude<keyof typeof countries, "IL">;

export const countryCodeList = Object.keys(countries).filter(
  (code) => code !== "IL"
) as [CountryCode, ...CountryCode[]];

export function getCountry(code?: CountryCode) {
  return code && countries[code] && { ...countries[code], code };
}
