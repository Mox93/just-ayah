import { useCountrySelector } from "hooks";
import { Country } from "models/country";
import { omit } from "utils/functions";
import { PathsOrConverters } from "utils/render";
import { createModifier } from "utils/transformer";

interface CountryMapperProps {
  renderSections: PathsOrConverters<Country>;
  setValue?: (value: any) => void;
  selected?: any;
  searchable?: boolean;
}

const countryMapper = createModifier<{
  renderSections: (keyof Country)[];
}>(
  ({
    renderSections,
    setValue = omit,
    selected,
    searchable,
    ...props
  }: CountryMapperProps) => ({
    ...props,
    searchable: searchable ?? true,
    setValue: (value: any) => setValue(value?.code),
    ...useCountrySelector({
      renderSections,
      selectedCountry: selected,
    }),
  })
);

export default countryMapper;
