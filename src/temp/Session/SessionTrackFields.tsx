import { useCallback, useEffect } from "react";
import { useWatch } from "react-hook-form";

import {
  MenuInput as BaseMenuInput,
  InputGroup,
  formAtoms,
  formContextFactory,
} from "components/Form";
import { identity } from "utils";
import { transformer } from "utils/transformer";

import { SessionTrackData, useMetaData } from "../api";

const {
  DateInput,
  modifiers: { menuModifiers },
} = formAtoms<SessionTrackData>();

const MenuInput = transformer(BaseMenuInput, ...menuModifiers);

const [, useFormContext] = formContextFactory<SessionTrackData>();

export default function SessionTrackFields() {
  const { teachers, sessionStatus } = useMetaData();

  const {
    formHook: { control, resetField },
  } = useFormContext();

  const [teacher, student] = useWatch({
    name: ["teacher", "student"],
    control,
  });

  useEffect(() => {
    if (!teachers || !teacher || teachers[teacher].includes(student)) return;
    resetField("student", { defaultValue: null });
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

  const getSessionStatus = useCallback<() => string[]>(
    () => sessionStatus?.map(({ value }) => value) || [],
    [sessionStatus]
  );

  const now = new Date();
  const start = new Date();
  const end = new Date();
  start.setFullYear(2020);
  end.setFullYear(now.getFullYear() + 1);

  return (
    <>
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
          options={getSessionStatus}
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
    </>
  );
}
