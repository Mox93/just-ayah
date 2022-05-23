import {
  timeZoneList,
  Timezone,
  getTimezone,
  getTimezoneCode,
} from "models/timezone";
import { renderAttributes } from "utils/render";

interface TimezoneHookProps {
  renderSections: (keyof Timezone)[];
  selectedTimezone?: string;
}

const useTimezoneSelector = ({
  renderSections,
  selectedTimezone,
}: TimezoneHookProps) => ({
  renderElement: renderAttributes(...renderSections),
  options: timeZoneList,
  getKey: getTimezoneCode,
  selected: getTimezone(selectedTimezone),
});

export default useTimezoneSelector;
