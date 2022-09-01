import { useMemo, VFC } from "react";

import { ScheduleForm } from "components/Schedule";
import { useStudentContext } from "context";

interface StudentScheduleProps {
  id: string;
}

const StudentSchedule: VFC<StudentScheduleProps> = ({ id }) => {
  const { students, updateStudent } = useStudentContext();
  const schedule = useMemo(
    () => students.find(({ id: studentId }) => id === studentId)?.meta.schedule,
    [students, id]
  );

  return (
    <ScheduleForm
      defaultValues={schedule}
      onSubmit={(data) =>
        updateStudent(id, { "meta.schedule": data }, { applyLocally: true })
      }
    />
  );
};

export default StudentSchedule;
