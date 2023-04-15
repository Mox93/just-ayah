import { useCallback, useEffect } from "react";
import { useWatch } from "react-hook-form";

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
import { identity } from "utils";

import {
  SessionTrackData,
  addSessionTrack,
  deleteSessionTrack,
  useMetaData,
} from "./utils";
import { usePopupContext } from "context";
import SuccessMessage from "./SuccessMessage";
import { ErrorMessage } from "components/FlashMessages";

const { Form, DateInput, InputGroup, Textarea } = formAtoms<SessionTrackData>();

function menuModifiers<T extends {}>() {
  return [processProps<T>(), menu<T>(), registerField<T>()] as const;
}

const MenuInput = formChild(
  BaseMenuInput,
  ...menuModifiers<SessionTrackData>()
);

export default function SessionTrack() {
  const [, setLanguage] = useLanguage();
  useApplyOnce(() => {
    setLanguage("ar");
  });

  const { teachers, sessionStatus } = useMetaData();

  const { openModal, closeModal } = usePopupContext();

  const [addTrack, isLoading] = useLoading(
    (stopLoading) => (data: SessionTrackData) =>
      addSessionTrack(data)
        .then((doc) =>
          openModal(
            <SuccessMessage
              close={closeModal}
              undo={() => {
                deleteSessionTrack({ id: doc.id }).then(closeModal);
              }}
            />,
            { center: true }
          )
        )
        .catch((error) =>
          openModal(<ErrorMessage error={error} />, {
            center: true,
            closable: true,
          })
        )
        .finally(stopLoading)
  );

  const formProps = useSmartForm<SessionTrackData>({
    onSubmit: (data) => addTrack()(data),
    resetOnSubmit: true,
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
    () => (teachers ? Object.keys(teachers) : []),
    [teachers]
  );
  const getStudents = useCallback(
    () =>
      teachers
        ? teacher
          ? teachers[teacher]
          : (Object.values(teachers).flatMap(identity) as string[])
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
    <FormLayout title="(الاشراف الإداري) تقارير اللقاءات">
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
