import { VFC } from "react";
import { SubmitHandler } from "react-hook-form";

import { formAtoms } from "components/Form";
import { usePersonalInfoT, useSmartForm } from "hooks";
import { LeadFormData } from "models/lead";

const { Form, Input, Textarea, InputGroup, PhoneNumberInput } =
  formAtoms<LeadFormData>();

interface LeadFormProps {
  onSubmit: SubmitHandler<LeadFormData>;
}

const LeadForm: VFC<LeadFormProps> = ({ onSubmit }) => {
  const pi = usePersonalInfoT();

  const formProps = useSmartForm({
    onSubmit,
    resetOnSubmit: true,
  });

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
};

export default LeadForm;
