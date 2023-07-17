import { useMemo } from "react";
import { useWatch } from "react-hook-form";

import {
  InputGroup,
  formAtoms,
  SelectionInput as BaseSelectionInput,
  formContextFactory,
  MenuInput as BaseMenuInput,
  SubmitHandler,
} from "components/Form";
import { useGlobalT, usePersonalInfoT } from "hooks";
import { OTHER } from "models";
import { booleanSelectorProps, genderSchema, leadsSchema } from "models/blocks";
import { shiftDate } from "models/_blocks";
import { transformer } from "utils/transformer";

import { NewStudent } from "../api";
import PhoneNumberField from "./PhoneNumberField";

const {
  CountrySelectorInput,
  DateInput,
  Form,
  GovernorateSelectorInput,
  Input,
  modifiers: { defaultModifiers, menuModifiers },
  TermsOfService,
  useForm,
} = formAtoms<NewStudent>();

const SelectionInput = transformer(BaseSelectionInput, ...defaultModifiers);
const MenuInput = transformer(BaseMenuInput, ...menuModifiers);

interface StudentFormProps {
  termsUrl: string;
  onSubmit: SubmitHandler<NewStudent>;
}

export default function StudentForm({ termsUrl, onSubmit }: StudentFormProps) {
  const glb = useGlobalT();
  const pi = usePersonalInfoT();

  const formProps = useForm({
    onSubmit,
    storage: {
      key: "studentForm/temp",
      filter: { type: "omit", fields: ["termsOfService"] },
    },
  });

  const range = useMemo(() => {
    const now = new Date();
    return {
      start: shiftDate(now, { year: -10 }),
      end: shiftDate(now, { year: -150 }),
    };
  }, []);

  const yesNoProps = booleanSelectorProps(glb, "yes", "no");

  return (
    <Form
      submitProps={{ children: glb("joinInitiative") }}
      resetProps={{}}
      {...formProps}
    >
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

      <SelectionInput
        name="quran"
        label={pi("quran")}
        rules={{ required: "noAnswer" }}
        {...yesNoProps}
      />

      <SelectionInput
        name="zoom"
        label={pi("zoom")}
        rules={{ required: "noAnswer" }}
        {...yesNoProps}
      />

      <SelectionInput
        name="zoomTestSession"
        label={pi("zoomTestSession")}
        rules={{ required: "noAnswer" }}
        {...yesNoProps}
      />

      <SelectionInput
        name="telegram"
        label={pi("telegram")}
        rules={{ required: "noAnswer" }}
        {...yesNoProps}
      />

      <LeadsSection />

      {<TermsOfService name="termsOfService" url={termsUrl} />}
    </Form>
  );
}

const [, useFormContext] = formContextFactory<NewStudent>();

function LeadsSection() {
  const glb = useGlobalT();
  const pi = usePersonalInfoT();

  const {
    formHook: { control },
  } = useFormContext();

  const lead = useWatch({
    control: control,
    name: "lead",
  });

  return (
    <InputGroup>
      <MenuInput
        name="lead"
        options={leadsSchema.options}
        renderElement={glb}
        label={pi("lead")}
        rules={{ required: "noAnswer" }}
      />
      {lead === OTHER && (
        <Input
          name="leadOther"
          rules={{ required: "noAnswer", shouldUnregister: true }}
        />
      )}
    </InputGroup>
  );
}
