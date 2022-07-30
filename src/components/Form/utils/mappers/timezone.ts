import { useTimezoneSelector } from "hooks";
import { Timezone } from "models/timezone";
import { omit } from "utils";
import { PathsOrConverters } from "utils/render";
import { createModifier } from "utils/transformer";

interface TimezoneMapperProps {
  renderSections?: PathsOrConverters<Timezone>;
  setValue?: (value: any) => void;
  selected?: any;
  searchable?: boolean;
}

const timezoneMapper = createModifier<{
  renderSections?: (keyof Timezone)[];
}>(
  ({
    renderSections = ["label"],
    setValue: _setValue = omit,
    selected,
    searchable,
    ...props
  }: TimezoneMapperProps) => ({
    ...props,
    searchable: searchable ?? true,
    setValue: (value: any) => _setValue(value?.tzCode),
    ...useTimezoneSelector({
      renderSections,
      selectedTimezone: selected,
    }),
  })
);

export default timezoneMapper;
