import { FieldPath } from "react-hook-form";

import { Timezone, timezoneSelectorProps } from "models/timezone";
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
    setValue: _setValue,
    selected,
    ...props
  }: TimezoneMapperPropsInternal) => ({
    ...props,
    searchFields,
    setValue: (value: any) => _setValue?.(value?.tzCode),
    ...timezoneSelectorProps(renderSections, selected),
  })
);

export default timezoneMapper;
