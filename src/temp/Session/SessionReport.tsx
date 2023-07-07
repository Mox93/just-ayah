import { useMemo } from "react";
import { UseFormReset, useWatch } from "react-hook-form";

import { ErrorMessage } from "components/FlashMessages";
import { formAtoms } from "components/Form";
import FormLayout from "components/Layouts/FormLayout";
import { openModal, closeModal } from "context";
import { useApplyOnce, useLanguage, useLoading } from "hooks";
import { mergeCallbacks, pass } from "utils";

import SuccessMessage from "../SuccessMessage";
import {
  SessionReportData,
  addSessionReport,
  deleteSessionReport,
  useMetaData,
} from "../utils";
import SessionReportFields from "./SessionReportFields";
import SessionTrackFields from "./SessionTrackFields";

const { Form, Textarea, useForm } = formAtoms<SessionReportData>();

export default function SessionReport() {
  const [, setLanguage] = useLanguage();
  useApplyOnce(() => {
    setLanguage("ar");
  });

  const [addReport, isLoading] = useLoading(
    (
      stopLoading,
      data: SessionReportData,
      reset: UseFormReset<SessionReportData>
    ) =>
      addSessionReport(data)
        .then((doc) => {
          openModal(
            <SuccessMessage
              startOver={mergeCallbacks(
                closeModal,
                pass(reset, { date: new Date() })
              )}
              undo={async () => {
                await deleteSessionReport({ id: doc.id });
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
    onSubmit: (data, { reset }) => addReport(data, reset),
    defaultValues: { date: new Date() },
  });
  const {
    formHook: { control },
  } = formProps;

  const status = useWatch({ name: "status", control });
  const { sessionStatus } = useMetaData();

  const showReport = useMemo(
    () => sessionStatus?.find(({ value }) => value === status)?.needsReport,
    [sessionStatus, status]
  );

  return (
    <FormLayout title="(المعلمين) تقارير اللقاءات">
      <Form {...formProps} resetProps={{}} submitProps={{ isLoading }}>
        <SessionTrackFields />
        {showReport && <SessionReportFields />}
        <Textarea name="notes" label="ملاحظات" />
      </Form>
    </FormLayout>
  );
}
