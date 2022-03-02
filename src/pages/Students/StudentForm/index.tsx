import { FunctionComponent, MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import InputField from "components/InputField";
import DatePicker from "components/DatePicker";
import RadioSelector from "components/RadioSelector";
import {
  StudentInfo,
  StudentValidation,
  studentValidation,
} from "models/student";
import { useStudents } from "context/Students";
import { genders } from "models/gender";
import { Keys } from "models";
import { cn, fromYesNo, toYesNo } from "utils";
import WorkStatusTree from "components/WorkStatus";
import CountrySelector from "components/CountrySelector";
import GovernorateSelector from "components/GovernorateSelector";
import PhoneNumber from "components/PhoneNumber";
import TimeZoneSelector from "components/TimeZoneSelector";

interface StudentFormProps {
  onfulfilled?: (response: any) => void;
  onrejected?: (response: any) => void;
}

const StudentForm: FunctionComponent<StudentFormProps> = ({
  onfulfilled,
  onrejected,
}) => {
  const { t } = useTranslation();
  const pi = (value: string) => t(`personal_info.${value}`);
  const e = (value: string) => t(`elements.${value}`);

  const { addStudent } = useStudents();

  const [student, setStudent] = useState<Partial<StudentInfo>>({});
  const [validation, setValidation] =
    useState<StudentValidation>(studentValidation);

  const [submitting, setSubmitting] = useState(false);

  const update =
    (key: Keys<StudentInfo>, validByDefault: boolean = true) =>
    (value: any, valid: boolean = validByDefault) => {
      setStudent((state) => ({ ...state, [key]: value }));
      setValidation((state) => ({ ...state, [key]: valid }));
    };

  const submitForm = (e: MouseEvent) => {
    e.preventDefault();

    setSubmitting(true);
    addStudent(student as StudentInfo, onfulfilled, onrejected);
  };

  const valid = Object.values(validation).reduce(
    (acc, cur) => acc && cur,
    true
  );

  const availabilityOptions = ["WhatsApp", "Telegram", "call"].map(
    (option) => ({ name: pi(option), option })
  );

  return (
    <form className="StudentForm container" dir={t("dir")}>
      <div className="input-group">
        <InputField
          required
          name="firstName"
          label={pi("first_name")}
          value={student.firstName}
          onChange={update("firstName")}
          validators={[Boolean]}
        />
        <InputField
          required
          name="middleName"
          label={pi("middle_name")}
          value={student.middleName}
          onChange={update("middleName")}
          validators={[Boolean]}
        />
        <InputField
          required
          name="lastName"
          label={pi("last_name")}
          value={student.lastName}
          onChange={update("lastName")}
          validators={[Boolean]}
        />
      </div>

      <div className="input-group">
        <DatePicker
          label={pi("date_of_birth")}
          onChange={update("dateOfBirth")}
          value={student.dateOfBirth}
          required
          validators={[Boolean]}
        />
        <RadioSelector
          name="gender"
          label={pi("gender")}
          options={genders.map((g) => ({ value: g, name: pi(g) }))}
          selected={student.gender}
          onChange={update("gender")}
          required
        />
      </div>

      <div className="input-group">
        <CountrySelector
          name="nationality"
          label={pi("nationality")}
          selected={student.nationality}
          onChange={update("nationality")}
          required
        />

        <CountrySelector
          name="residence"
          label={pi("residence")}
          selected={student.country}
          onChange={update("country")}
          required
        />
      </div>

      <div className="input-group">
        <GovernorateSelector
          country={student.country}
          label={pi("governorate")}
          value={student.governorate}
          onChange={update("governorate")}
          required
        />

        <TimeZoneSelector
          label={pi("time_zone")}
          selected={student.timeZone}
          onChange={update("timeZone")}
        />
      </div>

      <PhoneNumber
        label={pi("phone_number")}
        value={student.phoneNumber || {}}
        tags={availabilityOptions}
        onChange={update("phoneNumber")}
        required
      />
      <PhoneNumber
        label={pi("second_phone_number")}
        value={(student.secondaryPhoneNumber || [])[0]}
        tags={availabilityOptions}
        map={(value) => [value]}
        onChange={update("secondaryPhoneNumber")}
      />

      <InputField
        name="email"
        label={pi("email")}
        value={student.email}
        onChange={update("email")}
      />

      <div className="input-group">
        <InputField
          name="education"
          label={pi("education")}
          value={student.education}
          onChange={update("education")}
          required
          validators={[Boolean]}
        />
        <RadioSelector
          name="doesWork"
          label={pi("does_work")}
          options={[
            { value: "yes", name: e("yes") },
            { value: "no", name: e("no") },
          ]}
          selected={student.workStatus && toYesNo(student.workStatus.doesWork)}
          map={(value) => ({ doesWork: fromYesNo(value) })}
          onChange={update("workStatus", false)}
          required
        />
      </div>

      {student.workStatus && (
        <WorkStatusTree
          status={student.workStatus}
          onChange={update("workStatus")}
        />
      )}

      <RadioSelector
        name="previousQuranMemorization"
        label={pi("experience")}
        options={[
          { value: "yes", name: e("yes") },
          { value: "no", name: e("no") },
        ]}
        selected={toYesNo(student.previousQuranMemorization)}
        map={fromYesNo}
        onChange={update("previousQuranMemorization")}
        required
      />

      <RadioSelector
        name="canUseZoom"
        label={pi("zoom")}
        options={[
          { value: "yes", name: e("yes") },
          { value: "no", name: e("no") },
        ]}
        selected={toYesNo(student.canUseZoom)}
        map={fromYesNo}
        onChange={update("canUseZoom")}
        required
      />

      <button
        className={cn({ submitting }, ["submit-btn", "cta-btn"])}
        type="submit"
        onClick={submitForm}
        disabled={!valid || submitting}
      >
        {e("join_initiative")}
      </button>
    </form>
  );
};

export default StudentForm;
