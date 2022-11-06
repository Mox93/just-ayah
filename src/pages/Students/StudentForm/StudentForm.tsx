import { VFC } from "react";

import { formAtoms } from "components/Form";
import { useGlobalT, usePersonalInfoT, useSmartForm } from "hooks";
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
  TermsOfService,
  TimezoneSelectorInput,
} = formAtoms<StudentInfo>();

interface StudentFormProps {
  formId?: string;
  defaultValues?: Partial<StudentInfo>;
  onSubmit: (data: StudentInfo) => void;
}

const StudentForm: VFC<StudentFormProps> = ({
  formId,
  defaultValues,
  onSubmit,
}) => {
  const glb = useGlobalT();
  const pi = usePersonalInfoT();

  const formProps = useSmartForm<StudentInfo>({
    onSubmit,
    defaultValues,
    storage: {
      key: "studentForm" + (formId ? `/${formId}` : ""),
      filter: { type: "exclude", fields: ["termsOfService"] },
    },
    resetOnSubmit: true,
  });

  const {
    formHook: { watch },
  } = formProps;

  const value = watch("workStatus");
  const workStatus: WorkStatusInfo | undefined = value && {
    ...value,
    doesWork: fromYesNo(value.doesWork),
  };

  const now = new Date();

  return (
    <Form
      className="StudentForm"
      submitProps={{ children: glb("joinInitiative") }}
      resetProps={{}}
      {...formProps}
    >
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

        {workStatus?.doesWork === true ? (
          <Input
            name="workStatus.job"
            label={pi("occupation")}
            rules={{ required: "noWorkStatus", shouldUnregister: true }}
          />
        ) : workStatus?.doesWork === false ? (
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

      {workStatus?.reason === "other" && (
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
      <TermsOfService
        name="termsOfService"
        url="https://drive.google.com/file/d/1uXAUeNnZAVRCSq8u7Xv1lZXBX-fmLR-k/preview"
      />
    </Form>
  );
};

export default StudentForm;
