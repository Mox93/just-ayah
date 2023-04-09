import { useMemo } from "react";

import { clampDate, DateInfo } from "models/_blocks";
import { range } from "utils";

export interface DateRange {
  start?: Date;
  end?: Date;
}

interface UseDateRangeProps extends DateRange, Partial<DateInfo> {}

export function useDateRanges({
  start,
  end,
  day,
  month,
  year,
}: UseDateRangeProps) {
  // TODO move these to a reducer init
  const now = new Date();
  start = start ?? new Date(now.getFullYear() - 100);
  end = end ?? new Date(start.getFullYear() + 201);

  const startDay = 1;
  // month === start.getMonth() + 1 && year === start.getFullYear()
  //   ? start.getDate()
  //   : 1;
  const endDay = clampDate({ day: 31, month, year }).day! + 1;
  // month === end.getMonth() + 1 && year === end.getFullYear()
  //   ? end.getDate() + 1
  //   : clampDate({ day: 31, month, year }).day! + 1;

  const startMonth = 1; // year === start.getFullYear() ? start.getMonth() + 1 : 1;
  const endMonth = 13; // year === end.getFullYear() ? end.getMonth() + 2 : 13;

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  return {
    days: useMemo(() => range(startDay, endDay), [startDay, endDay]),
    months: useMemo(() => range(startMonth, endMonth), [startMonth, endMonth]),
    years: useMemo(
      () => [...range(startYear, endYear), endYear],
      [startYear, endYear]
    ),
  };
}
