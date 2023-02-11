import { VFC } from "react";

import { ErrorMessage, ReachOutMessage } from "components/FlashMessages";
import { FormLayout } from "components/Layouts";
import { useLeadContext, usePopupContext } from "context";
import { usePageT } from "hooks";
import Lead, { LeadFormData } from "models/lead";

import LeadForm from "../LeadForm";

interface NewLeadProps {}

const NewLead: VFC<NewLeadProps> = () => {
  const ldt = usePageT("lead");

  const { openModal } = usePopupContext();
  const { addLead } = useLeadContext();

  return (
    <FormLayout name="NewLead" title={ldt("formTitle")}>
      <LeadForm
        onSubmit={(data: LeadFormData) =>
          addLead(new Lead.DB(data), {
            onFulfilled: () =>
              openModal(<ReachOutMessage />, { center: true, closable: true }),
            onRejected: () =>
              openModal(<ErrorMessage />, {
                center: true,
                closable: true,
              }),
          })
        }
      />
    </FormLayout>
  );
};

export default NewLead;
