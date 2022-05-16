export interface DateInDB {
  nanoseconds: number;
  seconds: number;
}

export interface DateInfo {
  day: number;
  month: number;
  year: number;
}

export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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

export const dateFromDB = (date: DateInDB): Date => {
  return new Date(date.seconds * 1000);
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
