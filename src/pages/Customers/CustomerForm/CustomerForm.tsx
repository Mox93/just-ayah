import { FunctionComponent } from "react";

import { formAtoms } from "components/Form";
import { useCustomers } from "context/Customers";
import { useDirT, usePageT, usePersonalInfoT } from "hooks";
import { CustomerInfo } from "models/customer";

const { Form, Input, InputGroup, PhoneNumberInput } = formAtoms<CustomerInfo>();

interface CustomerFormProps {
  onfulfilled?: (response: any) => void;
  onrejected?: (response: any) => void;
}

const CustomerForm: FunctionComponent<CustomerFormProps> = ({
  onfulfilled,
  onrejected,
}) => {
  const dirT = useDirT();
  const pi = usePersonalInfoT();
  const cst = usePageT("customers");

  const { addCustomer } = useCustomers();

  const onSubmit = (data: CustomerInfo) =>
    addCustomer(data, { onFulfilled: onfulfilled, onRejected: onrejected });

  return (
    <Form className="Container" dir={dirT} onSubmit={onSubmit} resetProps={{}}>
      <h2 className="header">{cst("formTitle")}</h2>

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
    </Form>
  );
};

export default CustomerForm;
