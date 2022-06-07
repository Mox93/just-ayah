import { useTimezoneSelector } from "hooks";
import { Timezone } from "models/timezone";
import { omit } from "utils";
import { createModifier } from "utils/transformer";

interface TimezoneMapperProps {
  renderSections?: (keyof Timezone)[];
  setValue?: (value: any) => void;
  selected?: any;
  searchable?: boolean;
}

export const timezoneMapper = createModifier<{
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
