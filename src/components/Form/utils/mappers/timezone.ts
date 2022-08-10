import { FieldPath } from "react-hook-form";

import { useTimezoneSelector } from "hooks";
import { Timezone } from "models/timezone";
import { omit } from "utils";
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
    setValue: _setValue = omit,
    selected,
    ...props
  }: TimezoneMapperPropsInternal) => ({
    ...props,
    searchFields,
    setValue: (value: any) => _setValue(value?.tzCode),
    ...useTimezoneSelector({
      renderSections,
      selectedTimezone: selected,
    }),
  })
);

export default timezoneMapper;
