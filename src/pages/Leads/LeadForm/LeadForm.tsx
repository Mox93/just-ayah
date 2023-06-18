import { InputGroup, formAtoms } from "components/Form";
import { SubmitHandler } from "components/Form/utils";
import { usePersonalInfoT } from "hooks";
import { LeadFormData } from "models/lead";

const { Form, Input, Textarea, PhoneNumberInput, useForm } =
  formAtoms<LeadFormData>();

interface LeadFormProps {
  onSubmit: SubmitHandler<LeadFormData>;
}

export default function LeadForm({ onSubmit }: LeadFormProps) {
  const pi = usePersonalInfoT();

  const formProps = useForm({ onSubmit });

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
