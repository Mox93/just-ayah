import timezones from "timezones-list";

export type Timezone = typeof timezones[number];

const timezoneMap: Record<string, Timezone> = timezones.reduce(
  (obj, tz) => ({ ...obj, [tz.tzCode]: tz }),
  {}
);

export const timeZoneList = timezones;

export const getTimezoneCode = (tz: Timezone) => tz.tzCode;

export const getTimezone = (code?: string) =>
  code ? timezoneMap[code] : undefined;
