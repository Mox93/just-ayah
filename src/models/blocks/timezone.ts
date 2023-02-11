import timezones from "timezones-list";
import { z, ZodType } from "zod";

import { PathsOrConverters, renderAttributes } from "utils/render";

export type Timezone = typeof timezones[number];

const _tzCodeSchema = z
  .string()
  .refine((value) => Object.hasOwn(getTimezone(value) || {}, "tzCode"));

const _timezoneSchema: ZodType<Timezone> = z.object({
  label: z.string(),
  tzCode: z.string(),
  name: z.string(),
  utc: z.string(),
});

export const tzCodeSchema = z.union([
  _tzCodeSchema,
  _timezoneSchema.transform((value) => value.tzCode),
]);

export const timezoneSchema = z.union([
  _timezoneSchema,
  _tzCodeSchema.transform((value) => getTimezone(value)!),
]);

const timezoneMap: Record<string, Timezone> = timezones.reduce(
  (obj, tz) => ({ ...obj, [tz.tzCode]: tz }),
  {}
);

export function getTimezone(code?: string) {
  return code ? timezoneMap[code] : undefined;
}

export const timezoneSelectorProps = (
  renderSections: PathsOrConverters<Timezone>,
  selectedTimezone: string
) => ({
  renderElement: renderAttributes<Timezone>(renderSections),
  options: timezones,
  getKey: (option: Timezone) => option.tzCode,
  selected: getTimezone(selectedTimezone),
});
