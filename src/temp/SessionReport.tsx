import { useMemo } from "react";
import { UseFormReset, useWatch } from "react-hook-form";

import { ErrorMessage } from "components/FlashMessages";
import { formAtoms } from "components/Form";
import FormLayout from "components/Layouts/FormLayout";
import { usePopupContext } from "context";
import { useApplyOnce, useLanguage, useLoading, useSmartForm } from "hooks";
import { mergeCallbacks, pass } from "utils";

import SessionReportFields from "./SessionReportFields";
import SessionTrackFields from "./SessionTrackFields";
import SuccessMessage from "./SuccessMessage";
import {
  SessionReportData,
  addSessionReport,
  deleteSessionReport,
  useMetaData,
} from "./utils";

const { Form, Textarea } = formAtoms<SessionReportData>();

export default function SessionReport() {
  const [, setLanguage] = useLanguage();
  useApplyOnce(() => {
    setLanguage("ar");
  });

  const { openModal, closeModal } = usePopupContext();

  const [addReport, isLoading] = useLoading(
    (stopLoading) =>
      (data: SessionReportData, reset: UseFormReset<SessionReportData>) =>
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

  const formProps = useSmartForm<SessionReportData>({
    onSubmit: (data, { reset }) => addReport()(data, reset),
    defaultValues: { date: new Date() },
  });
  const {
    formHook: { control, resetField },
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
        <SessionTrackFields {...{ control, resetField }} />
        {showReport && <SessionReportFields />}
        <Textarea name="notes" label="ملاحظات" />
      </Form>
    </FormLayout>
  );
}
