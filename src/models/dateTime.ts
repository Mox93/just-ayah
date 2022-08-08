import { identity } from "./../utils/functions";
import { Timestamp } from "firebase/firestore";
import { range, twoDigits } from "utils";

export const DateTime = Timestamp;

export interface DateInfo {
  day: number;
  month: number;
  year: number;
}

export interface TimeInfo {
  hour: number;
  minute: number;
}

export interface TimeInfo12H {
  hour: number;
  minute: number;
  period: "AM" | "PM";
}

export const hours = (h24?: boolean) => (h24 ? range(24) : range(1, 13));
export const minutes = (interval = 1) => range(0, 60, interval);

export const weekDays = [
  "Fri",
  "Sat",
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
] as const;

export type WeekDay = typeof weekDays[number];

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

  return isNaN(_date.getDate())
    ? undefined
    : {
        day: _date.getDate(),
        month: _date.getMonth() + 1,
        year: _date.getFullYear(),
      };
};

export const fromTimeInfo = (
  { hour, minute, period }: TimeInfo12H,
  t: (value: string) => string = identity
) => `${twoDigits(hour)}:${twoDigits(minute)}${t(period)}`;

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
