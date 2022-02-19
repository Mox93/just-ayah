import { FunctionComponent, MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import InputField from "components/InputField";
import { useCustomers } from "context/Customers";
import { Keys } from "models";
import {
  CustomerInfo,
  CustomerValidation,
  customerValidator,
} from "models/customer";
import { sanitizePhoneNumber } from "models/phoneNumber";
import { cn } from "utils";

interface CustomerFormProps {
  onfulfilled?: (response: any) => void;
  onrejected?: (response: any) => void;
}

const CustomerForm: FunctionComponent<CustomerFormProps> = ({
  onfulfilled,
  onrejected,
}) => {
  const { t } = useTranslation();
  const pi = (value: string) => t(`personal_info.${value}`);
  const e = (value: string) => t(`elements.${value}`);

  const { addCustomer } = useCustomers();

  const [customer, setCustomer] = useState<Partial<CustomerInfo>>({});
  const [validation, setValidation] =
    useState<CustomerValidation>(customerValidator);

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
    <form className="CustomerForm container" dir={t("dir")}>
      <InputField
        required
        name="fullName"
        label={pi("first_name")}
        value={customer.fullName}
        onChange={update("fullName")}
        validators={[Boolean]}
      />

      <div className="input-group">
        <InputField
          name="phoneNumber"
          label={pi("phone_number")}
          type="tel"
          value={(customer.phoneNumber || {}).number}
          map={(value) => ({ number: sanitizePhoneNumber(value) })}
          onChange={update("phoneNumber")}
          required
          validators={[Boolean]}
        />
        <InputField
          name="phoneNumber"
          label={pi("second_phone_number")}
          value={(customer.secondaryPhoneNumber || [{}])[0].number}
          map={(value) => [{ number: sanitizePhoneNumber(value) }]}
          onChange={update("secondaryPhoneNumber")}
        />
      </div>

      <InputField
        name="facebookLink"
        label={pi("facebook_link")}
        value={customer.facebookLink}
        onChange={update("facebookLink")}
      />

      <button
        className={cn({ submitting }, ["submit-btn", "cta-btn"])}
        type="submit"
        onClick={submitForm}
        disabled={!valid || submitting}
      >
        {e("join_initiative")}
      </button>
    </form>
  );
};

export default CustomerForm;
