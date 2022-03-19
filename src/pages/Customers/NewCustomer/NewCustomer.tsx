import { FunctionComponent } from "react";

import justAyahBG from "assets/img/just-ayah-banner.jpg";
import LanguageSelector from "components/LanguageSelector";

import CustomerForm from "../CustomerForm";
import { usePopup } from "context/Popup";

interface NewCustomerProps {}

const NewCustomer: FunctionComponent<NewCustomerProps> = () => {
  const { showPopup } = usePopup();

  return (
    <div className="NewCustomer">
      <img className="banner" src={justAyahBG} alt="" />
      <LanguageSelector />
      <CustomerForm
        onfulfilled={() =>
          showPopup(
            <>
              <h1>Thank you for signing up</h1>
              <p>We will contact you soon</p>
              <a href="/">go back to the home page</a>
              <a href="/join">fill in a new form</a>
            </>,
            false
          )
        }
      />
    </div>
  );
};

export default NewCustomer;
