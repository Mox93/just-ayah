import { useMemo } from "react";
import { PartialDeep } from "type-fest";

import {
  InputGroup,
  formAtoms,
  SelectionInput as BaseSelectionInput,
  SubmitHandler,
} from "components/Form";
import { useGlobalT, usePersonalInfoT } from "hooks";
import { shiftDate } from "models/_blocks";
import { booleanSelectorProps, genderSchema } from "models/blocks";
import { StudentFormData } from "models/student";
import { transformer } from "utils/transformer";

import WorkStatusSection from "./WorkStatusSection";

const {
  CountrySelectorInput,
  DateInput,
  Form,
  GovernorateSelectorInput,
  Input,
  PhoneNumberInput,
  modifiers: { defaultModifiers },
  TermsOfService,
  TimezoneSelectorInput,
  useForm,
} = formAtoms<StudentFormData>();

const SelectionInput = transformer(BaseSelectionInput, ...defaultModifiers);

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
  const formProps = useForm({
    onSubmit,
    ...(defaultValues && { defaultValues }),
    storage: {
      key: "studentForm" + (formId ? `/${formId}` : ""),
      filter: { type: "omit", fields: ["meta.termsOfService"] },
    },
  });

  const yesNoProps = booleanSelectorProps(glb, "yes", "no");

  const range = useMemo(() => {
    const now = new Date();
    return {
      start: shiftDate(now, { year: -10 }),
      end: shiftDate(now, { year: -150 }),
    };
  }, []);

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
          range={range}
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
          anchorPoint="top-end"
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
          anchorPoint="top-end"
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

      <WorkStatusSection />

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
