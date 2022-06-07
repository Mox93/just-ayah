import { useCountrySelector } from "hooks";
import { Country } from "models/country";
import { omit } from "utils/functions";
import { createModifier } from "utils/transformer";

interface CountryMapperProps {
  renderSections: (keyof Country)[];
  setValue?: (value: any) => void;
  selected?: any;
  searchable?: boolean;
}

export const countryMapper = createModifier<{
  renderSections: (keyof Country)[];
}>(
  ({
    renderSections,
    setValue: _setValue = omit,
    selected,
    searchable,
    ...props
  }: CountryMapperProps) => ({
    ...props,
    searchable: searchable ?? true,
    setValue: (value: any) => _setValue(value?.code),
    ...useCountrySelector({
      renderSections,
      selectedCountry: selected,
    }),
  })
);
