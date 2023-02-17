import { PartialDeep } from "type-fest";

import { formAtoms } from "components/Form";
import { useGlobalT, usePersonalInfoT, useSmartForm } from "hooks";
import { genderSchema } from "models/blocks";
import { TeacherFormData } from "models/teacher";

const {
  Form,
  Input,
  InputGroup,
  PhoneNumberInput,
  SelectionInput: { Teacher: SelectionInput },
} = formAtoms<TeacherFormData>();

interface TeacherFormProps {
  formId?: string;
  defaultValues?: PartialDeep<TeacherFormData>;
  onSubmit: (data: TeacherFormData) => void;
}

export default function TeacherForm({
  formId,
  defaultValues,
  onSubmit,
}: TeacherFormProps) {
  const glb = useGlobalT();
  const pi = usePersonalInfoT();

  const formProps = useSmartForm<TeacherFormData>({
    onSubmit,
    defaultValues,
    storage: { key: "teacherForm" + (formId ? `/${formId}` : "") },
    resetOnSubmit: true,
  });

  return (
    <Form
      className="TeacherForm"
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
        <SelectionInput
          name="gender"
          type="radio"
          label={pi("gender")}
          options={genderSchema.options}
          renderElement={pi}
          rules={{ required: "noGender" }}
        />
        <Input name="email" label={pi("email")} type="email" />
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
    </Form>
  );
}
