import { FunctionComponent, useState } from "react";

import justAyahBG from "assets/img/just-ayah-banner.jpg";
import LanguageSelector from "components/LanguageSelector";

import CustomerForm from "../CustomerForm";
import CustomerSignedUp from "../CustomerSignedUp";

interface NewCustomerProps {}

const NewCustomer: FunctionComponent<NewCustomerProps> = () => {
  const [complete, setComplete] = useState(false);

  return (
    <div className="NewCustomer">
      <img className="banner" src={justAyahBG} alt="" />
      <LanguageSelector />
      <CustomerForm
        onfulfilled={() => setComplete(true)}
        onrejected={() => setComplete(false)}
      />
      {<CustomerSignedUp visible={complete} />}
    </div>
  );
};

export default NewCustomer;
