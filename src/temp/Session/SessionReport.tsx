import { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";

import { DeleteButton } from "components/Buttons";
import { formAtoms } from "components/Form";
import FormLayout from "components/Layouts/FormLayout";
import { closeModal } from "context";

import {
  SessionReportData,
  SessionStatus,
  addSessionReport,
  deleteSessionReport,
  updateSessionReport,
  useMetaData,
} from "../api";
import SessionReportFields from "./SessionReportFields";
import SessionTrackFields from "./SessionTrackFields";
import { useSessionForm } from "./SessionForm.utils";

const { Form, Textarea } = formAtoms<SessionReportData>();

export default function SessionReport() {
  const { id, formProps, isLoading, noChange } = useSessionForm({
    addSession: addSessionReport,
    deleteSession: deleteSessionReport,
    updateSession: updateSessionReport,
  });

  const {
    formHook: { control, unregister },
  } = formProps;

  const status = useWatch({ name: "status", control });
  const { sessionStatus } = useMetaData();

  const showReport = useMemo(
    () => needsReport(sessionStatus, status),
    [sessionStatus, status]
  );

  useEffect(() => {
    if (!showReport) unregister(["recitation", "memorization", "rules"]);
  }, [showReport]);

  return (
    <FormLayout title="تقارير اللقاءات (المعلمين)">
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
        {showReport && <SessionReportFields />}
        <Textarea name="notes" label="ملاحظات" />
      </Form>
      {id && (
        <DeleteButton
          message="هل تريد حذف هذا التقرير؟"
          label="تأكيد حذف التقرير"
          onDelete={async () => {
            await deleteSessionReport({ id });
            closeModal();
          }}
        />
      )}
    </FormLayout>
  );
}

function needsReport(
  sessionStatus: SessionStatus[] | undefined,
  status: string
) {
  return sessionStatus?.find(({ value }) => value === status)?.needsReport;
}
