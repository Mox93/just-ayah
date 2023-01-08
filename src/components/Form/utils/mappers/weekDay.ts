import { useDateTimeT } from "hooks";
import { WeekDay, weekDays } from "models/blocks";
import { PathsOrConverters } from "utils/render";
import { createModifier } from "utils/transformer";

interface WeekDayMapperProps {
  short?: boolean;
}

const weekDayMapper = createModifier<{
  renderSections?: PathsOrConverters<WeekDay>;
}>(({ short, ...props }: WeekDayMapperProps) => {
  const wdT = useDateTimeT("weekDay");
  const swdT = useDateTimeT("weekDay.short");

  return {
    ...props,
    renderElement: short ? swdT : wdT,
    options: weekDays,
  };
});

export default weekDayMapper;
