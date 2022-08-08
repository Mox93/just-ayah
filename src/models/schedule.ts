import { identity } from "utils";

import { fromTimeInfo, to12H, WeekDay } from "./dateTime";

interface ScheduleEntire {
  day: WeekDay;
  time: { hour: number; minute: number };
}

export interface Schedule {
  entries?: ScheduleEntire[];
  notes?: string;
}

export const scheduleBrief = (
  schedule?: Schedule,
  t: (value: string) => string = identity,
  t1: (value: string) => string = identity
) =>
  schedule?.entries
    ?.filter(({ day, time }) => day && time)
    ?.map(({ day, time }) => `${t(day)} ${fromTimeInfo(to12H(time), t1)}`)
    .join(" - ") || schedule?.notes;
