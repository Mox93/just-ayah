import timezones from "timezones-list";

import { pluck } from "utils";
import { PathsOrConverters, renderAttributes } from "utils/render";

export type Timezone = typeof timezones[number];

const timezoneMap: Record<string, Timezone> = timezones.reduce(
  (obj, tz) => ({ ...obj, [tz.tzCode]: tz }),
  {}
);

export const timeZoneList = timezones;

export const getTimezone = (code?: string) =>
  code ? timezoneMap[code] : undefined;

export const timezoneSelectorProps = (
  renderSections: PathsOrConverters<Timezone>,
  selectedTimezone: string
) => ({
  renderElement: renderAttributes<Timezone>(renderSections),
  options: timeZoneList,
  getKey: pluck<Timezone>("tzCode"),
  selected: getTimezone(selectedTimezone),
});
