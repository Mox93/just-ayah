import { z } from "zod";

import { identity } from "utils";

import { Converter } from "../types";
import { fromTimeInfo, to12H, weekDaySchema } from "../_blocks/dateTime";

export const scheduleSchema = z
  .object({
    entries: z.array(
      z.object({
        day: weekDaySchema,
        time: z.object({
          hour: z.number().int().nonnegative().max(23),
          minute: z.number().int().nonnegative().max(59),
        }),
      })
    ),
    notes: z.string(),
  })
  .partial();

export type Schedule = z.infer<typeof scheduleSchema>;

export const scheduleBrief = (
  schedule?: Schedule,
  t: Converter<string> = identity,
  t1: Converter<string> = identity
) =>
  schedule?.entries
    ?.filter(({ day, time }) => day && time)
    ?.map(({ day, time }) => `${t(day)} ${fromTimeInfo(to12H(time), t1)}`)
    .join(" - ") || schedule?.notes;
