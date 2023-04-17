import { formAtoms } from "components/Form";
import { SubmitHandler, usePersonalInfoT, useSmartForm } from "hooks";
import { LeadFormData } from "models/lead";

const { Form, Input, Textarea, InputGroup, PhoneNumberInput } =
  formAtoms<LeadFormData>();

interface LeadFormProps {
  onSubmit: SubmitHandler<LeadFormData>;
}

export default function LeadForm({ onSubmit }: LeadFormProps) {
  const pi = usePersonalInfoT();

  const formProps = useSmartForm({ onSubmit });

  return (
    <Form className="ContainerForm" resetProps={{}} {...formProps}>
      <Input
        name="fullName"
        label={pi("fullName")}
        rules={{ required: "noFullName" }}
      />

      <InputGroup>
        <PhoneNumberInput
          label={pi("phoneNumber")}
          name="phoneNumber.0"
          rules={{ required: "noPhoneNumber" }}
          withTags
        />
        <PhoneNumberInput
          label={pi("secondPhoneNumber")}
          name="phoneNumber.1"
          withTags
        />
      </InputGroup>

      <Input name="facebook" label={pi("facebookLink")} type="url" />
      <Textarea name="message" label={pi("leaveQuestion")} />
    </Form>
  );
}
