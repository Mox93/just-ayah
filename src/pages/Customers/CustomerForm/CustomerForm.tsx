import { FunctionComponent } from "react";

import { formAtoms } from "components/Form";
import { useCustomerContext } from "context";
import { usePersonalInfoT } from "hooks";
import { CustomerInfo } from "models/customer";

const { Form, Input, Textarea, InputGroup, PhoneNumberInput } =
  formAtoms<CustomerInfo>();

interface CustomerFormProps {
  onfulfilled?: (response: any) => void;
  onrejected?: (response: any) => void;
}

const CustomerForm: FunctionComponent<CustomerFormProps> = ({
  onfulfilled,
  onrejected,
}) => {
  const pi = usePersonalInfoT();

  const { add } = useCustomerContext();

  const onSubmit = (data: CustomerInfo) =>
    add(data, { onFulfilled: onfulfilled, onRejected: onrejected });

  return (
    <Form className="ContainerForm" onSubmit={onSubmit} resetProps={{}}>
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

export default CustomerForm;
