import { isEqual } from "lodash";
import { useState, VFC } from "react";

import { formAtoms } from "components/Form";
import { useStudentContext } from "context";
import { useDirT, useGlobalT, usePageT, usePersonalInfoT } from "hooks";
import { genders } from "models/gender";
import { StudentInfo } from "models/student";
import { noWorkReasons, WorkStatusInfo } from "models/work";
import { fromYesNo, yesNo } from "utils";

const {
  CountrySelectorInput,
  DateInput,
  Form,
  GovernorateSelectorInput,
  Input,
  InputGroup,
  PhoneNumberInput,
  SelectionInput: { Student: SelectionInput },
  TimezoneSelectorInput,
} = formAtoms<StudentInfo>();

interface StudentFormProps {
  onFulfilled?: (response: any) => void;
  onRejected?: (response: any) => void;
}

const StudentForm: VFC<StudentFormProps> = ({ onFulfilled, onRejected }) => {
  const dirT = useDirT();
  const glb = useGlobalT();
  const pi = usePersonalInfoT();
  const stu = usePageT("students");

  const { add } = useStudentContext();

  const [workStatus, setWorkStatus] = useState<WorkStatusInfo>({});

  const onSubmit = (data: StudentInfo) => {
    add(data, { onFulfilled, onRejected });
  };

  const now = new Date();

  return (
    <Form
      dir={dirT}
      onSubmit={onSubmit}
      submitProps={{ children: glb("joinInitiative") }}
      resetProps={{}}
      storageKey="studentForm"
      hook={({ watch }) => {
        const value = watch("workStatus");
        const newValue = value
          ? { ...value, doesWork: fromYesNo(value.doesWork) }
          : {};

        !isEqual(newValue, workStatus) && setWorkStatus(newValue);
      }}
    >
      <h2 className="header">{stu("formTitle")}</h2>

      <InputGroup>
        <Input
          name="firstName"
          label={pi("firstName")}
          rules={{ required: "noFirstName" }}
        />
        <Input
          name="middleName"
          label={pi("middleName")}
          rules={{ required: "noMiddleName" }}
        />
        <Input
          name="lastName"
          label={pi("lastName")}
          rules={{ required: "noLastName" }}
        />
      </InputGroup>

      <InputGroup>
        {/* <Input
          name="dateOfBirth"
          type="date"
          label={pi("dateOfBirth")}
          rules={{ required: "noDateOfBirth" }}
        /> */}
        <DateInput
          name="dateOfBirth"
          label={pi("dateOfBirth")}
          rules={{ required: "noDateOfBirth" }}
          yearsRange={{
            start: now.getFullYear(),
            end: now.getFullYear() - 151,
          }}
        />

        <SelectionInput
          name="gender"
          type="radio"
          label={pi("gender")}
          options={[...genders]}
          renderElement={pi}
          rules={{ required: "noGender" }}
        />
      </InputGroup>

      <InputGroup>
        <CountrySelectorInput
          name="nationality"
          label={pi("nationality")}
          renderSections={["emoji", "native"]}
          rules={{ required: "noNationality" }}
        />

        <CountrySelectorInput
          name="country"
          label={pi("residence")}
          renderSections={["emoji", "native"]}
          rules={{ required: "noResidence" }}
          overflowDir="start"
        />
      </InputGroup>

      <InputGroup>
        <GovernorateSelectorInput
          name="governorate"
          countryField={"country"}
          label={pi("governorate")}
          rules={{ required: "noGovernorate" }}
        />

        <TimezoneSelectorInput
          name="timezone"
          label={pi("timezone")}
          overflowDir="start"
        />
      </InputGroup>

      <InputGroup>
        <PhoneNumberInput
          name="phoneNumber.0"
          label={pi("phoneNumber")}
          rules={{ required: "noPhoneNumber" }}
          withTags
        />
        <PhoneNumberInput
          name="phoneNumber.1"
          label={pi("secondPhoneNumber")}
          withTags
        />
      </InputGroup>

      <InputGroup>
        <Input name="email" label={pi("email")} type="email" />

        <Input
          name="education"
          label={pi("education")}
          rules={{ required: "noEducation" }}
        />
      </InputGroup>

      <InputGroup>
        <SelectionInput
          name="workStatus.doesWork"
          type="radio"
          label={pi("doesWork")}
          options={yesNo}
          renderElement={glb}
          rules={{ required: "noWorkStatus" }}
        />

        {workStatus.doesWork === true ? (
          <Input
            name="workStatus.job"
            label={pi("occupation")}
            rules={{ required: "noWorkStatus", shouldUnregister: true }}
          />
        ) : workStatus.doesWork === false ? (
          <SelectionInput
            name="workStatus.reason"
            type="radio"
            options={[...noWorkReasons]}
            renderElement={pi}
            label={pi("noWorkReason")}
            rules={{ required: "noWorkStatus", shouldUnregister: true }}
          />
        ) : null}
      </InputGroup>

      {workStatus.reason === "other" && (
        <Input
          name="workStatus.explanation"
          label={pi("noWorkDetails")}
          rules={{ required: "noWorkStatus", shouldUnregister: true }}
        />
      )}

      <SelectionInput
        name="Quran"
        type="radio"
        label={pi("quran")}
        options={yesNo}
        renderElement={glb}
        rules={{ required: "noAnswer" }}
      />

      <SelectionInput
        name="Zoom"
        type="radio"
        label={pi("zoom")}
        options={yesNo}
        renderElement={glb}
        rules={{ required: "noAnswer" }}
      />
    </Form>
  );
};

export default StudentForm;
