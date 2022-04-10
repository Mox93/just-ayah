import { countries, Country } from "countries-list";

export type CountryCode = Exclude<keyof typeof countries, "IL">;

export const countryList = Object.keys(countries)
  .filter((code) => code !== "IL")
  .map((code) => ({ ...countries[code as CountryCode], code }));

export const getCountry = (code?: string): Country | undefined =>
  countries[code as CountryCode];
