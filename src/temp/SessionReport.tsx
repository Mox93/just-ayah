import { useCallback, useEffect } from "react";
import { UseFormReset, useWatch } from "react-hook-form";

import { MenuInput as BaseMenuInput, formAtoms } from "components/Form";
import {
  formChild,
  menu,
  processProps,
  registerField,
} from "components/Form/utils/formModifiers";
import FormLayout from "components/Layouts/FormLayout";
import LoadingPopup from "components/LoadingPopup";
import { useApplyOnce, useLanguage, useLoading, useSmartForm } from "hooks";
import { identity, mergeCallbacks, pass } from "utils";

import {
  SessionReportData,
  addSessionReport,
  deleteSessionReport,
  useMetaData,
} from "./utils";
import { usePopupContext } from "context";
import SuccessMessage from "./SuccessMessage";
import { ErrorMessage } from "components/FlashMessages";

const { Form, DateInput, InputGroup, Textarea } =
  formAtoms<SessionReportData>();

function menuModifiers<T extends {}>() {
  return [processProps<T>(), menu<T>(), registerField<T>()] as const;
}

const MenuInput = formChild(
  BaseMenuInput,
  ...menuModifiers<SessionReportData>()
);

export default function SessionReport() {
  const [, setLanguage] = useLanguage();
  useApplyOnce(() => {
    setLanguage("ar");
  });

  const { teachers, sessionStatus } = useMetaData();

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

  const [teacher, student] = useWatch({
    name: ["teacher", "student"],
    control,
  });

  useEffect(() => {
    if (!teachers || !teacher || teachers[teacher].includes(student)) return;
    resetField("student");
  }, [resetField, student, teacher, teachers]);

  const getTeachers = useCallback(
    () => (teachers ? Object.keys(teachers).sort() : []),
    [teachers]
  );
  const getStudents = useCallback<() => string[]>(
    () =>
      teachers
        ? teacher
          ? teachers[teacher].sort()
          : Object.values(teachers).flatMap(identity).sort()
        : [],
    [teacher, teachers]
  );

  if (!teachers || !sessionStatus) return <LoadingPopup message="تحميل" />;

  const now = new Date();
  const start = new Date();
  const end = new Date();
  start.setFullYear(2020);
  end.setFullYear(now.getFullYear() + 1);

  return (
    <FormLayout title="(المعلمين) تقارير اللقاءات">
      <Form {...formProps} resetProps={{}} submitProps={{ isLoading }}>
        <InputGroup>
          <MenuInput
            options={getTeachers}
            name="teacher"
            label="اسم المعلم"
            required
          />
          <MenuInput
            options={getStudents}
            name="student"
            label="اسم الطالب"
            required
          />
        </InputGroup>
        <InputGroup>
          <MenuInput
            options={sessionStatus}
            name="status"
            label="وضع اللقاء"
            required
          />
          <DateInput
            name="date"
            label="تاريخ اللقاء"
            range={{ start, end }}
            required
          />
        </InputGroup>
        <Textarea name="notes" label="ملاحظات" />
      </Form>
    </FormLayout>
  );
}
