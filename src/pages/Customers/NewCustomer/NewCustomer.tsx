import { FunctionComponent } from "react";

import justAyahBG from "assets/img/just-ayah-banner.jpg";
import LanguageSelector from "components/LanguageSelector";

import CustomerForm from "../CustomerForm";
import { usePopupContext } from "context";
import Container from "components/Container";
import { usePageT } from "hooks";

interface NewCustomerProps {}

const NewCustomer: FunctionComponent<NewCustomerProps> = () => {
  const { showPopup } = usePopupContext();
  const cst = usePageT("customers");

  return (
    <div className="NewCustomer">
      <img className="banner" src={justAyahBG} alt="" />
      <LanguageSelector />
      <Container
        variant="form"
        header={<h2 className="title">{cst("formTitle")}</h2>}
      >
        <CustomerForm
          onfulfilled={() =>
            showPopup(
              <>
                <h1>Thank you for signing up</h1>
                <p>We will contact you soon</p>
                <a href="/">go back to the home page</a>
                <a href="/join">fill in a new form</a>
              </>
            )
          }
        />
      </Container>
    </div>
  );
};

export default NewCustomer;
