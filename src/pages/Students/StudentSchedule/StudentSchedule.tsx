import { useMemo } from "react";

import { ScheduleForm } from "components/Schedule";
import { useStudentContext } from "context";

interface StudentScheduleProps {
  id: string;
}

export default function StudentSchedule({ id }: StudentScheduleProps) {
  const { students, updateStudent } = useStudentContext();
  const schedule = useMemo(
    () => students.find(({ id: _id }) => id === _id)?.meta.schedule,
    [id, students]
  );

  return (
    <ScheduleForm
      defaultValues={schedule}
      onSubmit={(data) =>
        updateStudent(id, { "meta.schedule": data }, { applyLocally: true })
      }
    />
  );
}
