import { FieldPath } from "react-hook-form";

import { Country, countrySelectorProps } from "models/blocks";
import { PathsOrConverters } from "utils/render";
import { createModifier } from "utils/transformer";

interface CountryMapperProps {
  renderSections: PathsOrConverters<Country>;
  searchFields?: FieldPath<Country>[];
}

interface CountryMapperPropsInternal extends CountryMapperProps {
  setValue?: (value: any) => void;
  selected?: any;
}

const countryMapper = createModifier<CountryMapperProps>(
  ({
    renderSections,
    setValue,
    selected,
    searchFields = ["name", "native"],
    ...props
  }: CountryMapperPropsInternal) => ({
    ...props,
    searchFields,
    setValue: (value: any) => setValue?.(value?.code),
    ...countrySelectorProps(renderSections, selected),
  })
);

export default countryMapper;
