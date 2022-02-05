import { countries } from "countries-list";
import { Keys } from ".";

export type CountryCode = Keys<Omit<typeof countries, "IL">>;

export const countryList = Object.keys(countries)
  .filter((code) => code !== "IL")
  .map((code) => ({ ...countries[code as CountryCode], code }));

export const getCountryName = (code?: string) => {
  const country = countries[code as CountryCode]
  return country?.native || code
};
