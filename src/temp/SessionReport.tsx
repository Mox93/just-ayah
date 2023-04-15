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
import { useApplyOnce, useLanguage, useSmartForm } from "hooks";
import { identity } from "utils";

import { useMetaData } from "./utils";

interface SessionTrackForm {
  teacher: string;
  student: string;
  status: string;
  date: Date;
}

const { Form, InputGroup, DateInput } = formAtoms<SessionTrackForm>();

function menuModifiers<T extends {}>() {
  return [processProps<T>(), menu<T>(), registerField<T>()] as const;
}

const MenuInput = formChild(
  BaseMenuInput,
  ...menuModifiers<SessionTrackForm>()
);

export default function SessionReport() {
  const [, setLanguage] = useLanguage();
  useApplyOnce(() => {
    setLanguage("ar");
  });

  const { teachers, sessionStatus } = useMetaData();

  const formProps = useSmartForm<SessionTrackForm>({
    onSubmit: (data) => {
      console.log(data);
    },
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
    <FormLayout title="(المعلمين) تقارير اللقاءات">
      <Form {...formProps} resetProps={{}}>
        <InputGroup>
          <MenuInput options={getTeachers} name="teacher" label="اسم المعلم" />
          <MenuInput options={getStudents} name="student" label="اسم الطالب" />
        </InputGroup>
        <InputGroup>
          <MenuInput options={sessionStatus} name="status" label="وضع اللقاء" />
          <DateInput name="date" label="تاريخ اللقاء" range={{ start, end }} />
        </InputGroup>
      </Form>
    </FormLayout>
  );
}
