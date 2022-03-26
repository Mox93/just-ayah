import cn from "classnames";
import { FunctionComponent, MouseEvent, useState } from "react";

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
import { fromYesNo, toYesNo } from "utils";
import WorkStatusTree from "components/WorkStatus";
import CountrySelector from "components/CountrySelector";
import GovernorateSelector from "components/GovernorateSelector";
import PhoneNumber from "components/PhoneNumber";
import TimeZoneSelector from "components/TimeZoneSelector";
import { useDirT, useGlobalT, usePersonalInfoT } from "utils/translation";

interface StudentFormProps {
  onfulfilled?: (response: any) => void;
  onrejected?: (response: any) => void;
}

const StudentForm: FunctionComponent<StudentFormProps> = ({
  onfulfilled,
  onrejected,
}) => {
  const dir = useDirT();
  const glb = useGlobalT();
  const pi = usePersonalInfoT();

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
    addStudent(student as StudentInfo, { onfulfilled, onrejected });
  };

  const valid = Object.values(validation).reduce(
    (acc, cur) => acc && cur,
    true
  );

  const availabilityOptions = ["whatsapp", "telegram", "call"].map(
    (option) => ({ name: pi(option), option })
  );

  return (
    <form className="Form Container" dir={dir}>
      <div className="inputGroup">
        <InputField
          required
          name="firstName"
          label={pi("firstName")}
          value={student.firstName}
          onChange={update("firstName")}
          validators={[Boolean]}
        />
        <InputField
          required
          name="middleName"
          label={pi("middleName")}
          value={student.middleName}
          onChange={update("middleName")}
          validators={[Boolean]}
        />
        <InputField
          required
          name="lastName"
          label={pi("lastName")}
          value={student.lastName}
          onChange={update("lastName")}
          validators={[Boolean]}
        />
      </div>

      <div className="inputGroup">
        <DatePicker
          label={pi("dateOfBirth")}
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

      <div className="inputGroup">
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

      <div className="inputGroup">
        <GovernorateSelector
          country={student.country}
          label={pi("governorate")}
          value={student.governorate}
          onChange={update("governorate")}
          required
        />

        <TimeZoneSelector
          label={pi("timeZone")}
          selected={student.timeZone}
          onChange={update("timeZone")}
        />
      </div>

      <PhoneNumber
        label={pi("phoneNumber")}
        value={(student.phoneNumbers || {})[0]}
        tags={availabilityOptions}
        map={(value) => ({ ...(student.phoneNumbers || {}), 0: value })}
        onChange={update("phoneNumbers")}
        required
      />
      <PhoneNumber
        label={pi("secondPhoneNumber")}
        value={(student.phoneNumbers || [])[1]}
        tags={availabilityOptions}
        map={(value) => ({ ...(student.phoneNumbers || {}), 1: value })}
        onChange={update("phoneNumbers")}
      />

      <InputField
        name="email"
        label={pi("email")}
        value={student.email}
        onChange={update("email")}
      />

      <div className="inputGroup">
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
          label={pi("doesWork")}
          options={[
            { value: "yes", name: glb("yes") },
            { value: "no", name: glb("no") },
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
        label={pi("quran")}
        options={[
          { value: "yes", name: glb("yes") },
          { value: "no", name: glb("no") },
        ]}
        selected={toYesNo(student.Quran)}
        map={fromYesNo}
        onChange={update("Quran")}
        required
      />

      <RadioSelector
        name="canUseZoom"
        label={pi("zoom")}
        options={[
          { value: "yes", name: glb("yes") },
          { value: "no", name: glb("no") },
        ]}
        selected={toYesNo(student.Zoom)}
        map={fromYesNo}
        onChange={update("Zoom")}
        required
      />

      <button
        className={cn({ submitting }, "submitBtn ctaBtn")}
        type="submit"
        onClick={submitForm}
        disabled={!valid || submitting}
      >
        {glb("joinInitiative")}
      </button>
    </form>
  );
};

export default StudentForm;
