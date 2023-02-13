import { Timestamp } from "firebase/firestore";
import { RequireAtLeastOne } from "type-fest";
import { z } from "zod";

import { identity, range, addZeros } from "utils";

import { Converter } from "../types";

export interface DateInfo {
  day: number;
  month: number;
  year: number;
}

export interface TimeInfo {
  hour: number;
  minute: number;
}

export const timeDeltaUnits = [
  "year",
  "month",
  "day",
  "hour",
  "minute",
] as const;

export type TimeDeltaUnits = typeof timeDeltaUnits[number];

export type TimeDelta = { [key in TimeDeltaUnits]+?: number };

export interface TimeInfo12H {
  hour: number;
  minute: number;
  period: "AM" | "PM";
}

export const hours = (h24?: boolean) => (h24 ? range(24) : range(1, 13));
export const minutes = (interval = 1) => range(0, 60, interval);

export const weekDaySchema = z.enum([
  "Fri",
  "Sat",
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
]);

export type WeekDay = z.infer<typeof weekDaySchema>;

export const getAge = (date: string | number | Date) => {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

export const historyRep = (date: Date): string => {
  return date.toDateString();
};

export const shortDateRep = (date: Date): string => {
  const now = new Date();
  const year =
    now.getFullYear() === date.getFullYear()
      ? ""
      : now.getFullYear() < 2000
      ? `/${now.getFullYear()}`
      : `/${date.getFullYear() - 2000}`;

  return `${date.getDate()}/${date.getMonth() + 1}${year}`;
};

export const clampDate = ({
  day,
  month,
  year,
}: Partial<DateInfo> = {}): Partial<DateInfo> => {
  const lasDay = new Date(year || 2000, month || 1, 0).getDate();

  return {
    ...(day && { day: day > lasDay ? lasDay : day }),
    ...(month && { month }),
    ...(year && { year }),
  };
};

export const fromDateInfo = ({ day, month, year }: DateInfo) =>
  new Date(year, month - 1, day);

export const toDateInfo = (date?: any): DateInfo | undefined => {
  if (!date) return;

  const _date = new Date(date);

  return isNaN(_date.getTime())
    ? undefined
    : {
        day: _date.getDate(),
        month: _date.getMonth() + 1,
        year: _date.getFullYear(),
      };
};

export const fromTimeInfo = (
  { hour, minute, period }: TimeInfo12H,
  t: Converter<string> = identity
) => `${addZeros(hour)}:${addZeros(minute)}${t(period)}`;

export const to24H = ({ hour, minute, period }: TimeInfo12H): TimeInfo => ({
  hour:
    period === "PM" && hour < 12
      ? hour + 12
      : period === "AM" && hour === 12
      ? 0
      : hour,
  minute,
});

export const to12H = ({ hour, minute }: TimeInfo): TimeInfo12H => ({
  hour: hour > 12 ? hour - 12 : hour === 0 ? 12 : hour,
  minute,
  period: hour > 11 ? "PM" : "AM",
});

export const shiftDate = (
  date: Date,
  {
    year = 0,
    month = 0,
    day = 0,
    hour = 0,
    minute = 0,
  }: RequireAtLeastOne<TimeDelta>
): Date => {
  const newDate = new Date(date);

  newDate.setFullYear(newDate.getFullYear() + year);
  newDate.setMonth(newDate.getMonth() + month);
  newDate.setDate(newDate.getDate() + day);
  newDate.setHours(newDate.getHours() + hour);
  newDate.setMinutes(newDate.getMinutes() + minute);

  return newDate;
};

const millisecondsPerUnit: {
  [key in TimeDeltaUnits]: number;
} = {
  year: 3.154e10,
  month: 2.628e9,
  day: 8.64e7,
  hour: 3.6e6,
  minute: 60000,
};

interface GetTimeDelta {
  (date1: Date, date2: Date, maxUnit?: "year"): Required<TimeDelta>;
  (date1: Date, date2: Date, maxUnit?: "month"): Required<
    Omit<TimeDelta, "year">
  >;
  (date1: Date, date2: Date, maxUnit?: "day"): Required<
    Omit<TimeDelta, "year" | "month">
  >;
  (date1: Date, date2: Date, maxUnit?: "hour"): Required<
    Omit<TimeDelta, "year" | "month" | "day">
  >;
  (date1: Date, date2: Date, maxUnit?: "minute"): Required<
    Omit<TimeDelta, "year" | "month" | "day" | "hour">
  >;
  (date1: Date, date2: Date, maxUnit?: TimeDeltaUnits): TimeDelta;
}

export const getTimeDelta: GetTimeDelta = (date1, date2, maxUnit = "year") =>
  msToTd(Math.abs(date1.getTime() - date2.getTime()), maxUnit) as any;

export const msToTd = (
  milliseconds: number,
  maxUnit: TimeDeltaUnits = "year"
): TimeDelta => {
  const timeDelta: any = {};

  const idx = timeDeltaUnits.indexOf(maxUnit);

  for (let i = idx; i < timeDeltaUnits.length; i++) {
    const unit = timeDeltaUnits[i];
    const value = (unit === "minute" ? Math.round : Math.floor)(
      milliseconds / millisecondsPerUnit[unit]
    );

    if (unit === "minute" && value === 60) {
      timeDelta["hour"] = (timeDelta["hour"] || 0) + 1;
      timeDelta[unit] = 0;
    } else {
      timeDelta[unit] = value;
    }

    milliseconds -= value * millisecondsPerUnit[unit];
  }

  return timeDelta;
};

export const tdToMs = (timeDelta: TimeDelta): number =>
  Object.keys(timeDelta).reduce(
    (prev, curr) =>
      prev +
      (timeDelta[curr as TimeDeltaUnits] as number) *
        (millisecondsPerUnit[curr as TimeDeltaUnits] as number),
    0
  );

export const applyTimeDelta = (
  delta1: TimeDelta,
  delta2: TimeDelta,
  {
    maxUnit = "year",
    method = "add",
  }: {
    maxUnit?: TimeDeltaUnits;
    method?: "add" | "subtract";
  } = {}
) =>
  msToTd(
    method === "subtract"
      ? tdToMs(delta1) - tdToMs(delta2)
      : tdToMs(delta1) + tdToMs(delta2),
    maxUnit
  );

export const formatTimeDelta = (
  timeDelta: TimeDelta,
  maxUnit: TimeDeltaUnits
): TimeDelta => msToTd(tdToMs(timeDelta), maxUnit);

export const toDate = (value: unknown) => {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }
};

export const dateSchema = z
  .union([z.coerce.date(), z.instanceof(Timestamp)])
  .transform((value) => (value instanceof Timestamp ? value.toDate() : value));

export type DateValue = z.input<typeof dateSchema>;
