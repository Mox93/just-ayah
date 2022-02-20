import timezones from "timezones-list";

type TimeZone = typeof timezones[number];

export const timeZoneList = timezones;

export const getTimeZone = (tzCode?: string): TimeZone | undefined =>
  tzCode ? timeZoneList.find((tz) => tz.tzCode === tzCode) : undefined;
