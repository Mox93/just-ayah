import { FunctionComponent } from "react";

import DropdownMenu from "components/DropdownMenu";
import { getTimeZone, timeZoneList } from "models/timeZone";

interface TimeZoneSelectorProps {
  label: string;
  selected?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const TimeZoneSelector: FunctionComponent<TimeZoneSelectorProps> = (props) => {
  return (
    <DropdownMenu
      {...props}
      className="TimeZoneSelector"
      name="timeZone"
      options={timeZoneList}
      mapValue={(tzCode) => getTimeZone(tzCode)?.label}
      mapKey={(timezone) => timezone.tzCode}
      mapSelection={(timezone) => timezone.tzCode}
      renderElement={(timezone) => <p className="timezone">{timezone.label}</p>}
    />
  );
};

export default TimeZoneSelector;
