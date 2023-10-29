import { isEqual } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { UseFormReset, useWatch } from "react-hook-form";
import { PartialDeep } from "type-fest";

import { DeleteButton } from "components/Buttons";
import { ErrorMessage } from "components/FlashMessages";
import { formAtoms } from "components/Form";
import FormLayout from "components/Layouts/FormLayout";
import { openModal, closeModal, useRequestData } from "context";
import { useApplyOnce, useLanguage, useLoading } from "hooks";
import { mergeCallbacks, pass } from "utils";

import SuccessMessage from "../SuccessMessage";
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

const { Form, Textarea, useForm } = formAtoms<SessionReportData>();

export default function SessionReport() {
  const {
    data,
    params: { id },
  } = useRequestData<PartialDeep<SessionReportData>>();

  const [defaultData, setDefaultData] = useState(data);

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
      (id
        ? updateSessionReport(id, data).then(() => setDefaultData(data))
        : addSessionReport(data).then((doc) => {
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
      )
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
    defaultValues: id ? defaultData : { date: new Date() },
    resetToDefaultValues: true,
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

  const updatedData = useWatch({ control });
  const noChange = useMemo(
    () => isEqual(defaultData, updatedData),
    [defaultData, updatedData]
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
