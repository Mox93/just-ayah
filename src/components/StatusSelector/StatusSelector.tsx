import {
  StudentStatus,
  studentStatuses,
  StudentStatusType,
} from "models/studentStatus";
import { FunctionComponent, useEffect, useState } from "react";
import { cn } from "utils";
import { useGlobalT } from "utils/translation";

interface StatusSelectorProps {
  onChange: (status: StudentStatus) => void;
}

const StatusSelector: FunctionComponent<StatusSelectorProps> = ({
  onChange,
}) => {
  const glb = useGlobalT();

  const [selected, setSelected] = useState<StudentStatusType>();
  const [date, setDate] = useState<string>();

  useEffect(() => {
    if (selected && selected !== "postponed") {
      onChange({ type: selected });
    }
  }, [selected]);

  return (
    <div className="StatusSelector">
      {studentStatuses.map((type) =>
        type === "postponed" && selected === "postponed" ? (
          <div key={type} className="postponed date">
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
            <button
              onClick={() => date && onChange({ type, date: new Date(date) })}
            />
          </div>
        ) : (
          <button
            key={type}
            className={cn("colorCoded", type)}
            onClick={() => setSelected(type)}
          >
            {glb(type)}
          </button>
        )
      )}
    </div>
  );
};

export default StatusSelector;
