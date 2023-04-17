import { ErrorMessage, ReachOutMessage } from "components/FlashMessages";
import { FormLayout } from "components/Layouts";
import { useLeadContext, usePopupContext } from "context";
import { usePageT } from "hooks";
import Lead from "models/lead";

import LeadForm from "../LeadForm";

export default function NewLead() {
  const ldt = usePageT("lead");

  const { openModal } = usePopupContext();
  const { addLead } = useLeadContext();

  return (
    <FormLayout name="NewLead" title={ldt("formTitle")}>
      <LeadForm
        onSubmit={(data, { reset }) =>
          addLead(new Lead.DB(data), {
            onFulfilled: () => {
              openModal(<ReachOutMessage />, { center: true, closable: true });
              reset();
            },
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
}
