import { timeZoneList, Timezone, getTimezone } from "models/timezone";
import { pluck } from "utils";
import { PathsOrConverters, renderAttributes } from "utils/render";

interface TimezoneHookProps {
  renderSections: PathsOrConverters<Timezone>;
  selectedTimezone?: string;
}

const useTimezoneSelector = ({
  renderSections,
  selectedTimezone,
}: TimezoneHookProps) => ({
  renderElement: renderAttributes<Timezone>(renderSections),
  options: timeZoneList,
  getKey: pluck<Timezone>("tzCode"),
  selected: getTimezone(selectedTimezone),
});

export default useTimezoneSelector;
