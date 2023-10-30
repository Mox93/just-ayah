import { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";

import {
  MenuInput as BaseMenuInput,
  SelectionInput,
  InputGroup,
  formAtoms,
} from "components/Form";
import { transformer } from "utils/transformer";

import { SessionTrackData, useMetaData } from "../api";

const ALL = "الجميع";

const {
  DateInput,
  modifiers: { menuModifiers },
  useFormContext,
} = formAtoms<SessionTrackData>();

const MenuInput = transformer(BaseMenuInput, ...menuModifiers);

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
    if (
      !teachers ||
      !teacher ||
      teachers[teacher].some(({ name }) => name.includes(student))
    )
      return;
    resetField("student", { defaultValue: null });
  }, [resetField, student, teacher, teachers]);

  const teacherList = useMemo(
    () => (teachers ? Object.keys(teachers).sort() : []),
    [teachers]
  );

  const [statusFilter, setStatusFilter] = useState("فعال");

  const studentList = useMemo(() => {
    if (!teachers) return [];

    const studentList: string[] = [];

    if (teacher)
      teachers[teacher].forEach(({ name, status }) => {
        if (statusFilter === ALL || status === statusFilter)
          studentList.push(name);
      });
    else
      Object.values(teachers).forEach((students) =>
        students.forEach(({ name, status }) => {
          if (statusFilter === ALL || status === statusFilter)
            studentList.push(name);
        })
      );

    return studentList.sort();
  }, [statusFilter, teacher, teachers]);

  const filters = useMemo(() => {
    if (!teachers) return [];

    const filters = new Set([ALL]);

    if (teacher) teachers[teacher].forEach(({ status }) => filters.add(status));
    else
      Object.values(teachers).forEach((students) =>
        students.forEach(({ status }) => filters.add(status))
      );

    return Array.from(filters).sort();
  }, [teacher, teachers]);

  useEffect(() => {
    if (filters.length && !filters.includes(statusFilter)) setStatusFilter(ALL);
  }, [filters, statusFilter]);

  const sessionStatusList = useMemo<string[]>(
    () => sessionStatus?.map(({ value }) => value) || [],
    [sessionStatus]
  );

  const range = useMemo(() => {
    const now = new Date();
    const start = new Date();
    const end = new Date();
    start.setFullYear(2020);
    end.setFullYear(now.getFullYear());

    return { start, end };
  }, []);

  return (
    <>
      <InputGroup>
        <MenuInput
          options={teacherList}
          name="teacher"
          label="اسم المعلم"
          required
        />
        <MenuInput
          options={studentList}
          name="student"
          label="اسم الطالب"
          required
          header={
            <SelectionInput
              type="radio"
              name="filter"
              options={filters}
              checked={(option) => option === statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          }
        />
      </InputGroup>
      <InputGroup>
        <MenuInput
          options={sessionStatusList}
          name="status"
          label="وضع اللقاء"
          required
        />
        <DateInput name="date" label="تاريخ اللقاء" range={range} required />
      </InputGroup>
    </>
  );
}
