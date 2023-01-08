import { VFC } from "react";

import Container from "components/Container";
import { FormLayout } from "components/Layouts";
import { usePopupContext } from "context";
import { usePageT } from "hooks";

import LeadForm from "../LeadForm";

interface NewLeadProps {}

const NewLead: VFC<NewLeadProps> = () => {
  const cst = usePageT("lead");
  const { openModal } = usePopupContext();

  return (
    <FormLayout name="NewLead" title={cst("formTitle")}>
      <Container
        variant="form"
        header={<h2 className="title">{cst("formTitle")}</h2>}
      >
        <LeadForm
          onfulfilled={() =>
            openModal(
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

export default NewLead;
