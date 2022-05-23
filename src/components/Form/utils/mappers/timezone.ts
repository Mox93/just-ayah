import { useTimezoneSelector } from "hooks";
import { Timezone, getTimezoneCode } from "models/timezone";
import { omit } from "utils";
import { createModifier } from "utils/transformer";

interface TimezoneMapperProps {
  renderSections?: (keyof Timezone)[];
  setValue?: (value: any) => void;
  selected?: any;
}

export const timezoneMapper = createModifier<{
  renderSections?: (keyof Timezone)[];
}>(
  ({
    renderSections = ["label"],
    setValue: _setValue = omit,
    selected,
    ...props
  }: TimezoneMapperProps) => ({
    ...props,
    setValue: (value: any) => _setValue(getTimezoneCode(value)),
    ...useTimezoneSelector({
      renderSections,
      selectedTimezone: selected,
    }),
  })
);
