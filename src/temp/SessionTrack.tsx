import { UseFormReset } from "react-hook-form";

import { ErrorMessage } from "components/FlashMessages";
import { formAtoms } from "components/Form";
import FormLayout from "components/Layouts/FormLayout";
import { usePopupContext } from "context";
import { useApplyOnce, useLanguage, useLoading, useSmartForm } from "hooks";
import { mergeCallbacks, pass } from "utils";

import SessionTrackFields from "./SessionTrackFields";
import SuccessMessage from "./SuccessMessage";
import { SessionTrackData, addSessionTrack, deleteSessionTrack } from "./utils";

const { Form, Textarea } = formAtoms<SessionTrackData>();

export default function SessionTrack() {
  const [, setLanguage] = useLanguage();
  useApplyOnce(() => {
    setLanguage("ar");
  });

  const { openModal, closeModal } = usePopupContext();

  const [addTrack, isLoading] = useLoading(
    (stopLoading) =>
      (data: SessionTrackData, reset: UseFormReset<SessionTrackData>) =>
        addSessionTrack(data)
          .then((doc) => {
            openModal(
              <SuccessMessage
                startOver={mergeCallbacks(
                  closeModal,
                  pass(reset, { date: new Date() })
                )}
                undo={async () => {
                  await deleteSessionTrack({ id: doc.id });
                  closeModal();
                }}
              />,
              { center: true }
            );
          })
          .catch((error) =>
            openModal(<ErrorMessage error={error} />, {
              center: true,
              closable: true,
            })
          )
          .finally(stopLoading)
  );

  const formProps = useSmartForm<SessionTrackData>({
    onSubmit: (data, { reset }) => addTrack()(data, reset),
    defaultValues: { date: new Date() },
  });
  const {
    formHook: { control, resetField },
  } = formProps;

  return (
    <FormLayout title="(الاشراف الإداري) تقارير اللقاءات">
      <Form {...formProps} resetProps={{}} submitProps={{ isLoading }}>
        <SessionTrackFields {...{ control, resetField }} />
        <Textarea name="notes" label="ملاحظات" />
      </Form>
    </FormLayout>
  );
}
