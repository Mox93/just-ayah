import DropdownMenu from "components/DropdownMenu";
import InputField from "components/InputField";
import { weekDays } from "models/dateTime";
import { Schedule } from "models/schedule";
import { FunctionComponent, useEffect, useState } from "react";
import { useGlobalT } from "utils/translation";

interface ScheduleViewerProps {
  schedule?: Schedule;
  onScheduleChange: (schedule: Schedule) => void;
}

const ScheduleViewer: FunctionComponent<ScheduleViewerProps> = ({
  schedule,
  onScheduleChange,
}) => {
  const glb = useGlobalT();

  const [draft, setDraft] = useState(schedule);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!draft) setEditMode(true);
  }, [draft]);

  return (
    <div className="ScheduleViewer">
      {editMode ? (
        <div className="edit">
          <div className="entry">
            <DropdownMenu
              label={glb("day")}
              options={[...weekDays]}
              selected={schedule?.entries[0].day}
              mapValue={(selected) => selected && weekDays[selected]}
            />
            <InputField
              label={glb("time")}
              onChange={(value) => setDraft(value)}
              value={draft?.note}
            />
          </div>
          <InputField
            label={glb("notes")}
            onChange={(value) => setDraft(value)}
            value={draft?.note}
          />
          <div className="actions">
            <button
              className="save"
              // onClick={() => onScheduleChange({ ...schedule, note: draft })}
              disabled={!draft}
            />
            <button
              className="cancel"
              // onClick={() => setDraft(note)}
            />
          </div>
        </div>
      ) : (
        <div className="view"></div>
      )}
    </div>
  );
};

export default ScheduleViewer;
