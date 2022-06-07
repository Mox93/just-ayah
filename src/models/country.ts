import { countries } from "countries-list";

export type CountryCode = Exclude<keyof typeof countries, "IL">;

export const countryList = Object.keys(countries)
  .filter((code) => code !== "IL")
  .map((code) => ({
    ...countries[code as CountryCode],
    code: code as CountryCode,
  }));

export type Country = typeof countryList[number];

export const getCountry = (code?: CountryCode): Country | undefined =>
  code && { ...countries[code], code };
