import { useCountrySelector } from "hooks";
import { Country, getCountryCode } from "models/country";
import { omit } from "utils/functions";
import { createModifier } from "utils/transformer";

interface CountryMapperProps {
  renderSections: (keyof Country)[];
  setValue?: (value: any) => void;
  selected?: any;
}

export const countryMapper = createModifier<{
  renderSections: (keyof Country)[];
}>(
  ({
    renderSections,
    setValue: _setValue = omit,
    selected,
    ...props
  }: CountryMapperProps) => ({
    ...props,
    setValue: (value: any) => _setValue(getCountryCode(value)),
    ...useCountrySelector({
      renderSections,
      selectedCountry: selected,
    }),
  })
);
