import { FunctionComponent, MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import InputField from "../components/InputField";
import DatePicker from "../components/DatePicker";
import RadioSelector from "../components/RadioSelector";
import {
  StudentInfo,
  StudentValidation,
  studentValidator,
} from "../models/student";
import { useStudents } from "../context/Students";
import { gender } from "../models/gender";
import { Keys } from "../models";
import { fromYesNo, toYesNo } from "../utils";
import { sanitizePhoneNumber } from "../models/phoneNumber";

interface StudentFormProps {}

const StudentForm: FunctionComponent<StudentFormProps> = () => {
  const { t } = useTranslation();
  const pi = (value: string) => t(`personal_info.${value}`);
  const e = (value: string) => t(`elements.${value}`);

  const { addStudent } = useStudents();

  const [student, setStudent] = useState<Partial<StudentInfo>>({});
  const [validation, setValidation] =
    useState<StudentValidation>(studentValidator);

  const update =
    (key: Keys<StudentInfo>) =>
    (value: any, valid: boolean = true) => {
      setStudent((state) => ({ ...state, [key]: value }));
      setValidation((state) => ({ ...state, [key]: valid }));
    };

  const submitForm = (e: MouseEvent) => {
    console.log(student);
    console.log(addStudent);

    addStudent(student as StudentInfo);
    e.preventDefault();
  };

  const valid = Object.values(validation).reduce(
    (acc, cur) => acc && cur,
    true
  );

  return (
    <form className="student-form container" dir={t("dir")}>
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
          options={gender.map((g) => ({ value: g, name: pi(g) }))}
          selected={student.gender}
          onChange={update("gender")}
          required
        />
      </div>

      <div className="input-group">
        <InputField
          name="country"
          label={pi("country")}
          value={student.country}
          onChange={update("country")}
          required
          validators={[Boolean]}
        />
        <InputField
          name="governorate"
          label={pi("governorate")}
          value={student.governorate}
          onChange={update("governorate")}
        />
      </div>

      <div className="input-group">
        <InputField
          name="phoneNumber"
          label={pi("phone_number")}
          type="tel"
          value={(student.phoneNumber || {}).number}
          map={(value) => ({ number: sanitizePhoneNumber(value) })}
          onChange={update("phoneNumber")}
          required
          validators={[Boolean]}
        />
        <InputField
          name="phoneNumber"
          label={pi("second_phone_number")}
          value={(student.secondaryPhoneNumber || [{}])[0].number}
          map={(value) => [{ number: [sanitizePhoneNumber(value)] }]}
          onChange={update("secondaryPhoneNumber")}
        />
      </div>

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
        <InputField
          name="occupation"
          label={pi("occupation")}
          value={student.occupation}
          onChange={update("occupation")}
          required
          validators={[Boolean]}
        />
      </div>

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
      />

      <button
        className="submit-btn cta-btn"
        type="submit"
        onClick={submitForm}
        disabled={!valid}
      >
        {e("join_initiative")}
      </button>
    </form>
  );
};

export default StudentForm;
