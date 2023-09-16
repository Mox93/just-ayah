import { useMemo } from "react";

import {
  InputGroup,
  formAtoms,
  SelectionInput as BaseSelectionInput,
} from "components/Form";
import { usePersonalInfoT } from "hooks";
import { genderSchema } from "models/blocks";
import { shiftDate } from "models/_blocks";
import { transformer } from "utils/transformer";

import { StudentData } from "../api";
import PhoneNumberField from "./PhoneNumberField";

const {
  CountrySelectorInput,
  DateInput,
  GovernorateSelectorInput,
  Input,
  modifiers: { defaultModifiers },
} = formAtoms<StudentData>();

const SelectionInput = transformer(BaseSelectionInput, ...defaultModifiers);

export default function StudentDataFields() {
  const pi = usePersonalInfoT();

  const range = useMemo(() => {
    const now = new Date();
    return {
      start: shiftDate(now, { year: -10 }),
      end: shiftDate(now, { year: -150 }),
    };
  }, []);

  return (
    <>
      <InputGroup>
        <Input
          name="name"
          label={pi("fullName")}
          rules={{ required: "noFullName" }}
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
        <DateInput
          name="dateOfBirth"
          label={pi("dateOfBirth")}
          rules={{ required: "noDateOfBirth" }}
          range={range}
        />
        <CountrySelectorInput
          name="nationality"
          label={pi("nationality")}
          renderSections={["emoji", "native"]}
          rules={{ required: "noNationality" }}
        />
      </InputGroup>

      <InputGroup>
        <CountrySelectorInput
          name="country"
          label={pi("residence")}
          renderSections={["emoji", "native"]}
          rules={{ required: "noResidence" }}
          anchorPoint="top-end"
        />
        <GovernorateSelectorInput
          name="governorate"
          countryField="country"
          label={pi("governorate")}
          rules={{ required: "noGovernorate" }}
        />
      </InputGroup>

      <InputGroup>
        <PhoneNumberField
          name="phoneNumber.0"
          label={pi("phoneNumber")}
          required
        />
        <PhoneNumberField
          name="phoneNumber.1"
          label={pi("secondPhoneNumber")}
        />
      </InputGroup>

      <Input name="email" label={pi("email")} type="email" />

      <InputGroup>
        <Input
          name="education"
          label={pi("education")}
          rules={{ required: "noEducation" }}
        />
        <Input
          name="job"
          label={pi("job")}
          rules={{ required: "noWorkStatus" }}
        />
      </InputGroup>
    </>
  );
}
