import timezones from "timezones-list";

export type Timezone = typeof timezones[number];

export const timeZoneList = timezones;

export const getTzCode = (tz: Timezone) => tz.tzCode;
