import { VFC } from "react";

import { formAtoms } from "components/Form";
import { useGlobalT, usePersonalInfoT, useSmartForm } from "hooks";
import { genders } from "models/gender";
import { TeacherInfo } from "models/teacher";

const {
  Form,
  Input,
  InputGroup,
  PhoneNumberInput,
  SelectionInput: { Teacher: SelectionInput },
} = formAtoms<TeacherInfo>();

interface TeacherFormProps {
  formId?: string;
  defaultValues?: Partial<TeacherInfo>;
  onSubmit: (data: TeacherInfo) => void;
}

const TeacherForm: VFC<TeacherFormProps> = ({
  formId,
  defaultValues,
  onSubmit,
}) => {
  const glb = useGlobalT();
  const pi = usePersonalInfoT();

  const formProps = useSmartForm<TeacherInfo>({
    onSubmit,
    defaultValues,
    storageKey: "teacherForm" + (formId ? `/${formId}` : ""),
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
          options={[...genders]}
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
};

export default TeacherForm;
