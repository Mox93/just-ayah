import { weekDays } from "./dateTime";
interface Time {
  h: number;
  m: number;
}

export interface ScheduleEntry {
  day: number;
  time: Time;
}

export interface Schedule {
  "entries[0]": ScheduleEntry;
  entries: ScheduleEntry[];
  note?: string;
}

const eq = (a: ScheduleEntry, b: ScheduleEntry): boolean =>
  a.day === b.day && a.time.h * 60 + a.time.m === b.time.h * 60 + b.time.m;

const lt = (a: ScheduleEntry, b: ScheduleEntry): boolean =>
  a.day < b.day ||
  (a.day === b.day && a.time.h * 60 + a.time.m < b.time.h * 60 + b.time.m);

export const getUpcoming = ({ entries }: Schedule): ScheduleEntry => {
  const now = new Date();
  const ref: ScheduleEntry = {
    day: now.getDay(),
    time: { h: now.getHours(), m: now.getMinutes() },
  };

  const allEntries = [ref, ...entries];
  allEntries.sort((a, b) => (lt(a, b) ? 1 : eq(a, b) ? 0 : -1));

  let upcoming = entries[0];

  allEntries.forEach((entry, index) => {
    if (eq(entry, ref)) {
      upcoming = allEntries[(index + 1) % allEntries.length];
    }
  });

  return upcoming;
};

export const scheduleToString = ({
  day,
  time: { h, m },
}: ScheduleEntry): string => {
  const hh = h % 12;

  return `${weekDays[day]} at ${hh < 10 ? 0 : ""}${hh}:${m < 10 ? 0 : ""}${m} ${
    h < 12 ? "AM" : "PM"
  }`;
};
