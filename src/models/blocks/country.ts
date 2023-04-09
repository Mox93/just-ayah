import { z } from "zod";
import { countries } from "countries-list";

import { PathsOrConverters, renderAttributes } from "utils/render";

export type CountryCode = Exclude<keyof typeof countries, "IL">;

export const countryCodeList = Object.keys(countries).filter(
  (code) => code !== "IL"
) as [CountryCode, ...CountryCode[]];

const _countryCodeSchema = z.enum(countryCodeList);

export const _countrySchema = z.object({
  code: _countryCodeSchema,
  capital: z.string(),
  continent: z.string(),
  currency: z.string(),
  emoji: z.string(),
  emojiU: z.string(),
  languages: z.string().array(),
  name: z.string(),
  native: z.string(),
  phone: z.string(),
});

export const countryCodeSchema = z.union([
  _countryCodeSchema,
  _countrySchema.transform((value) => value.code),
]);

export const countrySchema = countryCodeSchema.transform((value) => ({
  ...countries[value],
  code: value,
}));

export const countryList = countryCodeList.map((code) => ({
  ...countries[code as CountryCode],
  code: code as CountryCode,
}));

export type Country = z.infer<typeof _countrySchema>;

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
    getKey: (option: Country) => option.code,
    selected: getCountry(selectedCountry),
  };
}
