import { SubmitHandler } from "react-hook-form";
import { PartialDeep } from "type-fest";

import { formAtoms } from "components/Form";
import { useGlobalT, usePersonalInfoT, useSmartForm } from "hooks";
import { OTHER } from "models";
import {
  booleanSelectorProps,
  genderSchema,
  noWorkReasons,
} from "models/blocks";
import { StudentFormData } from "models/student";

import { useWorkStatus } from "./StudentForm.utils";
import { shiftDate } from "models/_blocks";

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
} = formAtoms<StudentFormData>();

interface StudentFormProps {
  formId?: string;
  termsUrl?: string;
  defaultValues?: PartialDeep<StudentFormData>;
  onSubmit: SubmitHandler<StudentFormData>;
}

export default function StudentForm({
  formId,
  defaultValues,
  termsUrl,
  onSubmit,
}: StudentFormProps) {
  const glb = useGlobalT();
  const pi = usePersonalInfoT();

  const {
    formHook,
    formHook: { control },
    ...formProps
  } = useSmartForm<StudentFormData>({
    onSubmit,
    ...(defaultValues && { defaultValues }),
    storage: {
      key: "studentForm" + (formId ? `/${formId}` : ""),
      filter: { type: "omit", fields: ["meta.termsOfService"] },
    },
    resetOnSubmit: true,
  });

  const workStatus = useWorkStatus(control);
  const yesNoProps = booleanSelectorProps(glb, "yes", "no");
  const now = new Date();

  return (
    <Form
      className="StudentForm"
      submitProps={{ children: glb("joinInitiative") }}
      resetProps={{}}
      formHook={formHook}
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
          range={{ start: now, end: shiftDate(now, { year: -150 }) }}
        />

        <SelectionInput
          name="gender"
          type="radio"
          label={pi("gender")}
          options={genderSchema.options}
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
          countryField="country"
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
          label={pi("doesWork")}
          rules={{ required: "noWorkStatus" }}
          {...yesNoProps}
        />

        {workStatus?.doesWork ? (
          <Input
            name="workStatus.job"
            label={pi("occupation")}
            rules={{ required: "noWorkStatus", shouldUnregister: true }}
          />
        ) : workStatus?.doesWork === false ? (
          <SelectionInput
            name="workStatus.status.value"
            type="radio"
            options={noWorkReasons}
            renderElement={pi}
            label={pi("noWorkReason")}
            rules={{ required: "noWorkStatus", shouldUnregister: true }}
          />
        ) : null}
      </InputGroup>

      {workStatus?.doesWork === false &&
        workStatus?.status?.value === OTHER && (
          <Input
            name="workStatus.status.other"
            label={pi("noWorkDetails")}
            rules={{ required: "noWorkStatus", shouldUnregister: true }}
          />
        )}

      <SelectionInput
        name="meta.quran"
        label={pi("quran")}
        rules={{ required: "noAnswer" }}
        {...yesNoProps}
      />

      <SelectionInput
        name="meta.zoom.canUse"
        label={pi("zoom")}
        rules={{ required: "noAnswer" }}
        {...yesNoProps}
      />

      {termsUrl && <TermsOfService name="meta.termsOfService" url={termsUrl} />}
    </Form>
  );
}
