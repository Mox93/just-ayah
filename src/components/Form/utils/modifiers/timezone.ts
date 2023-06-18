import { FieldPath } from "react-hook-form";

import { Timezone, timezoneSelectorProps } from "models/blocks";
import { PathsOrConverters } from "utils/render";
import { createModifier } from "utils/transformer";

interface TimezoneMapperProps {
  renderSections?: PathsOrConverters<Timezone>;
  searchFields?: FieldPath<Timezone>[];
}

interface TimezoneMapperPropsInternal extends TimezoneMapperProps {
  setValue?: (value: any) => void;
  selected?: any;
}

const timezoneMapper = createModifier<TimezoneMapperProps>(
  ({
    renderSections = ["label"],
    searchFields = ["label"],
    setValue,
    selected,
    ...props
  }: TimezoneMapperPropsInternal) => ({
    ...props,
    searchFields,
    setValue: (value: any) => setValue?.(value?.tzCode),
    ...timezoneSelectorProps(renderSections, selected),
  })
);

export default timezoneMapper;
