import ScheduleViewer from "components/ScheduleViewer";
import { useStudents } from "context/Students";
import { Schedule } from "models/schedule";
import { FunctionComponent, useState } from "react";

interface StudentScheduleProps {
  studentId: string;
}

const StudentSchedule: FunctionComponent<StudentScheduleProps> = ({
  studentId,
}) => {
  const { updateStudent } = useStudents();
  const [schedule, setSchedule] = useState<Schedule>();

  const updateSchedule = (newSchedule: Schedule) => {
    updateStudent(studentId, { schedule: newSchedule });
    setSchedule(newSchedule);
  };

  return (
    <ScheduleViewer schedule={schedule} onScheduleChange={updateSchedule} />
  );
};

export default StudentSchedule;
