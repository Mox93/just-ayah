import { FunctionComponent } from "react";

import { useCustomers } from "context/Customers";
import { CustomerInfo } from "models/customer";
import { useDirT, useGlobalT, usePersonalInfoT } from "utils/translation";
import { formAtoms } from "components/Form";
import { get, set } from "react-hook-form";

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
  const glb = useGlobalT();
  const pi = usePersonalInfoT();

  const { addCustomer } = useCustomers();

  const onSubmit = ({
    fullName,
    phoneNumber: [mainPhoneNumber, ...otherPhoneNumbers],
    ...data
  }: CustomerInfo) => {
    const sanitizedData: CustomerInfo = {
      fullName,
      phoneNumber: [mainPhoneNumber],
    };

    for (let key in data) {
      const value = get(data, key);
      if (value) set(sanitizedData, key, value);
    }

    otherPhoneNumbers?.forEach((phoneNumber) => {
      if (phoneNumber.code && phoneNumber.number)
        sanitizedData.phoneNumber.push(phoneNumber);
    });

    console.log(sanitizedData);

    addCustomer(sanitizedData, { onfulfilled, onrejected });
  };

  return (
    <Form
      className="Container"
      dir={dirT}
      onSubmit={onSubmit}
      submitButton={glb("joinInitiative")}
    >
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
        />
        <PhoneNumberInput
          label={pi("secondPhoneNumber")}
          name="phoneNumber.1"
        />
      </InputGroup>

      <Input name="facebook" label={pi("facebookLink")} type="url" />
    </Form>
  );
};

export default CustomerForm;
