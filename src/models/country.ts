import { countries, Country } from "countries-list";
import { Keys } from ".";

export type CountryCode = Keys<Omit<typeof countries, "IL">>;

export const countryList = Object.keys(countries)
  .filter((code) => code !== "IL")
  .map((code) => ({ ...countries[code as CountryCode], code }));

export const getCountry = (code?: string): Country | undefined =>
  countries[code as CountryCode];
