import { PartialDeep } from "type-fest";

import {
  InputGroup,
  formAtoms,
  SelectionInput as BaseSelectionInput,
  SubmitHandler,
} from "components/Form";
import { useGlobalT, usePersonalInfoT } from "hooks";
import { genderSchema } from "models/blocks";
import { TeacherFormData } from "models/teacher";
import { transformer } from "utils/transformer";

const {
  Form,
  Input,
  PhoneNumberInput,
  modifiers: { defaultModifiers },
  useForm,
} = formAtoms<TeacherFormData>();

const SelectionInput = transformer(BaseSelectionInput, ...defaultModifiers);

interface TeacherFormProps {
  formId?: string;
  defaultValues?: PartialDeep<TeacherFormData>;
  onSubmit: SubmitHandler<TeacherFormData>;
}

export default function TeacherForm({
  formId,
  defaultValues,
  onSubmit,
}: TeacherFormProps) {
  const glb = useGlobalT();
  const pi = usePersonalInfoT();

  const formProps = useForm({
    onSubmit,
    defaultValues,
    storage: { key: "teacherForm" + (formId ? `/${formId}` : "") },
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
