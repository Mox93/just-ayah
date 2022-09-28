import { VFC } from "react";

import Container from "components/Container";
import { FormLayout } from "components/Layouts";
import { usePopupContext } from "context";
import { usePageT } from "hooks";

import CustomerForm from "../CustomerForm";

interface NewCustomerProps {}

const NewCustomer: VFC<NewCustomerProps> = () => {
  const cst = usePageT("customer");
  const { showPopup } = usePopupContext();

  return (
    <FormLayout name="NewCustomer" title={cst("formTitle")}>
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
    </FormLayout>
  );
};

export default NewCustomer;
