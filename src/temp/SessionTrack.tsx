import { UseFormReset } from "react-hook-form";

import { ErrorMessage } from "components/FlashMessages";
import { formAtoms } from "components/Form";
import FormLayout from "components/Layouts/FormLayout";
import { openModal, closeModal } from "context";
import { useApplyOnce, useLanguage, useLoading } from "hooks";
import { mergeCallbacks, pass } from "utils";

import SessionTrackFields from "./SessionTrackFields";
import SuccessMessage from "./SuccessMessage";
import { SessionTrackData, addSessionTrack, deleteSessionTrack } from "./utils";

const { Form, Textarea, useForm } = formAtoms<SessionTrackData>();

export default function SessionTrack() {
  const [, setLanguage] = useLanguage();
  useApplyOnce(() => {
    setLanguage("ar");
  });

  const [addTrack, isLoading] = useLoading(
    (
      stopLoading,
      data: SessionTrackData,
      reset: UseFormReset<SessionTrackData>
    ) =>
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

  const formProps = useForm({
    onSubmit: (data, { reset }) => addTrack(data, reset),
    defaultValues: { date: new Date() },
  });

  return (
    <FormLayout title="(الاشراف الإداري) تقارير اللقاءات">
      <Form {...formProps} resetProps={{}} submitProps={{ isLoading }}>
        <SessionTrackFields />
        <Textarea name="notes" label="ملاحظات" />
      </Form>
    </FormLayout>
  );
}
