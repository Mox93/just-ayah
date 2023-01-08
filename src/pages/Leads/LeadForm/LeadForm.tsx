import { VFC } from "react";

import { formAtoms } from "components/Form";
import { useLeadContext } from "context";
import { usePersonalInfoT, useSmartForm } from "hooks";
import { LeadInfo } from "models/lead";

const { Form, Input, Textarea, InputGroup, PhoneNumberInput } =
  formAtoms<LeadInfo>();

interface LeadFormProps {
  onfulfilled?: (response: any) => void;
  onrejected?: (response: any) => void;
}

const LeadForm: VFC<LeadFormProps> = ({ onfulfilled, onrejected }) => {
  const pi = usePersonalInfoT();

  const { add } = useLeadContext();

  const formProps = useSmartForm({
    onSubmit: (data: LeadInfo) =>
      add(data, { onFulfilled: onfulfilled, onRejected: onrejected }),
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
