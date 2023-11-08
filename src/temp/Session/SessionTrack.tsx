import { DeleteButton } from "components/Buttons";
import { formAtoms } from "components/Form";
import FormLayout from "components/Layouts/FormLayout";
import { closeModal } from "context";

import {
  SessionTrackData,
  addSessionTrack,
  deleteSessionTrack,
  updateSessionTrack,
} from "../api";
import SessionTrackFields from "./SessionTrackFields";
import { useSessionForm } from "./SessionForm.utils";

const { Form, Textarea } = formAtoms<SessionTrackData>();

export default function SessionTrack() {
  const { id, formProps, isLoading, noChange } = useSessionForm({
    addSession: addSessionTrack,
    deleteSession: deleteSessionTrack,
    updateSession: updateSessionTrack,
  });

  return (
    <FormLayout title="تقارير اللقاءات (الاشراف الإداري)">
      <Form
        {...formProps}
        resetProps={{
          ...(id && {
            children: "تراجع",
            disabled: noChange,
          }),
        }}
        submitProps={{
          isLoading,
          ...(id && {
            children: "حفظ",
            disabled: noChange,
          }),
        }}
      >
        <SessionTrackFields />
        <Textarea name="notes" label="ملاحظات" />
      </Form>
      {id && (
        <DeleteButton
          message="هل تريد حذف هذا التقرير؟"
          label="تأكيد حذف التقرير"
          afterDeleteGoTo="/temp/session/track"
          onDelete={async () => {
            await deleteSessionTrack({ id });
            closeModal();
          }}
        />
      )}
    </FormLayout>
  );
}
