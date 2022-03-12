import { FunctionComponent, MouseEvent, useState } from "react";

import InputField from "components/InputField";
import { useCustomers } from "context/Customers";
import { Keys } from "models";
import {
  CustomerInfo,
  CustomerValidation,
  customerValidation,
} from "models/customer";
import { cn } from "utils";
import PhoneNumber from "components/PhoneNumber";
import { useDirT, useGlobalT, usePersonalInfoT } from "utils/translation";

interface CustomerFormProps {
  onfulfilled?: (response: any) => void;
  onrejected?: (response: any) => void;
}

const CustomerForm: FunctionComponent<CustomerFormProps> = ({
  onfulfilled,
  onrejected,
}) => {
  const dir = useDirT();
  const glb = useGlobalT();
  const pi = usePersonalInfoT();

  const { addCustomer } = useCustomers();

  const [customer, setCustomer] = useState<Partial<CustomerInfo>>({});
  const [validation, setValidation] =
    useState<CustomerValidation>(customerValidation);

  const [submitting, setSubmitting] = useState(false);

  const update =
    (key: Keys<CustomerInfo>, validByDefault: boolean = true) =>
    (value: any, valid: boolean = validByDefault) => {
      setCustomer((state) => ({ ...state, [key]: value }));
      setValidation((state) => ({ ...state, [key]: valid }));
    };

  const submitForm = (e: MouseEvent) => {
    e.preventDefault();

    setSubmitting(true);
    addCustomer(customer as CustomerInfo, onfulfilled, onrejected);
  };

  const valid = Object.values(validation).reduce(
    (acc, cur) => acc && cur,
    true
  );

  return (
    <form className="CustomerForm container" dir={dir}>
      <InputField
        required
        name="fullName"
        label={pi("fullName")}
        value={customer.fullName}
        onChange={update("fullName")}
        validators={[Boolean]}
      />

      <PhoneNumber
        label={pi("phoneNumber")}
        value={customer.phoneNumber || {}}
        onChange={update("phoneNumber")}
        required
      />
      <PhoneNumber
        label={pi("secondPhoneNumber")}
        value={(customer.secondaryPhoneNumber || [{}])[0]}
        onChange={update("secondaryPhoneNumber")}
      />

      <InputField
        name="facebookLink"
        label={pi("facebookLink")}
        value={customer.facebookLink}
        onChange={update("facebookLink")}
      />

      <button
        className={cn({ submitting }, ["submitBtn", "ctaBtn"])}
        type="submit"
        onClick={submitForm}
        disabled={!valid || submitting}
      >
        {glb("joinInitiative")}
      </button>
    </form>
  );
};

export default CustomerForm;
