import { FunctionComponent } from "react";
import { getOccupation, noWorkReasons, WorkStatus } from "models/work";
import InputField from "components/InputField";
import RadioSelector from "components/RadioSelector";
import { usePersonalInfoT } from "utils/translation";

interface WorkStatusTreeProps {
  status: WorkStatus;
  onChange: (value: any, valid: boolean) => void;
}

const WorkStatusTree: FunctionComponent<WorkStatusTreeProps> = ({
  status,
  onChange,
}) => {
  const pi = usePersonalInfoT();

  return status.doesWork ? (
    <InputField
      className="WorkStatus"
      name="occupation"
      label={pi("occupation")}
      value={getOccupation(status)}
      map={(value) => ({ doesWork: true, job: value })}
      onChange={onChange}
      required
      validators={[(value) => Boolean(value.job)]}
    />
  ) : (
    <div className="WorkStatus">
      <RadioSelector
        name="noWorkReason"
        label={pi("noWorkReason")}
        options={[...noWorkReasons, "other"].map((value) => ({
          value,
          name: pi(value),
        }))}
        selected={status.reason}
        map={(value) => ({ doesWork: false, reason: value })}
        onChange={(value) => onChange(value, value.reason !== "other")}
        required
      />
      {status.reason === "other" && (
        <InputField
          name="noWorkDetails"
          label={pi("noWorkDetails")}
          value={status.explanation}
          map={(value) => ({
            doesWork: false,
            reason: "other",
            explanation: value,
          })}
          onChange={onChange}
          required
          validators={[(value) => Boolean(value.explanation)]}
        />
      )}
    </div>
  );
};

export default WorkStatusTree;
