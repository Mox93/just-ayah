import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { getOccupation, noWorkReasons, WorkStatus } from "models/work";
import InputField from "components/InputField";
import RadioSelector from "components/RadioSelector";

interface WorkStatusTreeProps {
  status: WorkStatus;
  onChange: (value: any, valid: boolean) => void;
}

const WorkStatusTree: FunctionComponent<WorkStatusTreeProps> = ({
  status,
  onChange,
}) => {
  const { t } = useTranslation();
  const pi = (value: string) => t(`personal_info.${value}`);

  return status.doesWork ? (
    <InputField
      className="WorkStatus"
      name="occupation"
      label={pi("occupation")}
      value={getOccupation(status)}
      map={(value) => ({ doesWork: true, occupation: value })}
      onChange={onChange}
      required
      validators={[(value) => Boolean(value.occupation)]}
    />
  ) : (
    <div className="WorkStatus">
      <RadioSelector
        name="noWorkReason"
        label={pi("no_work_reason")}
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
          name="explanation"
          label={pi("explanation")}
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
