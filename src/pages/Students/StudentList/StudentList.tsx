import { deleteField } from "firebase/firestore";
import { useEffect, useMemo, useState, VFC } from "react";
import { FieldPath, FieldPathValue } from "react-hook-form";

import { ReactComponent as Info } from "assets/icons/info-svgrepo-com.svg";
import { Button } from "components/Buttons";
import { SelectionMenu } from "components/DropdownMenu";
import Ellipsis, { ellipsis } from "components/Ellipsis";
import { StatusMenu } from "components/DropdownMenu";
import { FieldProps, Table } from "components/Table";
import {
  useCourseContext,
  usePopupContext,
  useStudentContext,
  useTeacherContext,
} from "context";
import {
  useDateTimeT,
  useGlobalT,
  useGovT,
  useLoading,
  usePageT,
  usePersonalInfoT,
} from "hooks";
import { getCountry } from "models/country";
import { getAge, historyRep } from "models/dateTime";
import { handleEgGov } from "models/governorate";
import { getPhoneNumberByTag } from "models/phoneNumber";
import { scheduleBrief } from "models/schedule";
import { Student } from "models/student";
import { getOccupation } from "models/work";
import { cn, concat } from "utils";

import StudentNotes from "../StudentNotes";
import StudentSchedule from "../StudentSchedule";

interface StudentListProps {}

const StudentList: VFC<StudentListProps> = () => {
  const glb = useGlobalT();
  const gov = useGovT("egypt");
  const stu = usePageT("students");
  const pi = usePersonalInfoT();
  const swd = useDateTimeT("weekDay.short");
  const dt = useDateTimeT();

  const { students, fetchStudents, updateStudent } = useStudentContext();

  const {
    data: { courses },
  } = useCourseContext();

  const {
    data: { teacherList },
  } = useTeacherContext();

  const { showPopup } = usePopupContext();

  const showNotesPopup = (id: string) => () =>
    showPopup(<StudentNotes id={id} />, { closable: true, dismissible: true });

  const showSchedulePopup = (id: string) => () =>
    showPopup(<StudentSchedule id={id} />, {
      closable: true,
      dismissible: true,
    });

  const updateField =
    <TKey extends FieldPath<Student>>(name: TKey, id: string) =>
    (value?: FieldPathValue<Student, TKey>) =>
      updateStudent(
        id,
        {
          [name]: value || (deleteField() as any),
        },
        { applyLocally: true }
      );

  const fields: FieldProps[] = useMemo(
    () => [
      {
        name: "name",
        header: pi("fullName"),
        className: "name",
        getValue: ({ firstName, middleName, lastName }: Student) =>
          concat(firstName, middleName, lastName),
      },
      {
        name: "status",
        header: glb("status"),
        className: "buttonCell",
        getValue: ({ id, meta: { progress } }: Student) => {
          return (
            <StatusMenu
              variant="progress"
              status={progress}
              onChange={updateField("meta.progress", id)}
            />
          );
        },
        fit: true,
      },
      {
        name: "subscription",
        header: glb("subscription"),
        className: "buttonCell",
        getValue: ({ id, meta: { subscription } }: Student) => {
          return (
            <StatusMenu
              variant="subscription"
              status={subscription}
              onChange={updateField("meta.subscription", id)}
            />
          );
        },
        fit: true,
      },
      {
        name: "phoneNumber",
        header: pi("phoneNumber"),
        className: "phoneNumber",
        getValue: (
          { phoneNumber, phoneNumbers }: any // TODO update field name in fireStore
        ) => getPhoneNumberByTag(phoneNumber || phoneNumbers, "whatsapp"),
        fit: true,
      },
      {
        name: "age",
        header: pi("age"),
        getValue: ({ dateOfBirth }: Student) => getAge(dateOfBirth),
        fit: true,
      },
      {
        name: "education",
        header: pi("education"),
      },
      {
        name: "occupation",
        header: pi("occupation"),
        getValue: ({ workStatus }: Student) => getOccupation(workStatus, pi),
      },
      {
        name: "nationality",
        header: pi("nationality"),
        getValue: ({ country }: Student) => getCountry(country)?.native,
      },
      {
        name: "residence",
        header: pi("residence"),
        getValue: ({ country, governorate }: Student) => {
          const parts = [getCountry(country)?.native];
          if (governorate) parts.push(handleEgGov(governorate, gov));
          return parts.join(" - ");
        },
      },
      {
        name: "course",
        header: glb("course"),
        className: "buttonCell",
        getValue: ({ id, meta: { course } }: Student) => (
          <SelectionMenu
            selected={course}
            options={courses}
            size="small"
            setValue={updateField("meta.course", id)}
            renderElement={ellipsis()}
          />
        ),
      },
      {
        name: "teacher",
        header: glb("teacher"),
        className: "buttonCell",
        getValue: ({ id, meta: { teacher } }: Student) => (
          <SelectionMenu
            selected={teacher}
            options={teacherList}
            size="small"
            setValue={updateField("meta.teacher", id)}
            renderElement={ellipsis()}
          />
        ),
      },
      {
        name: "schedule",
        header: glb("schedule"),
        className: "buttonCell",
        getValue: ({ id, meta: { schedule } }: Student) => {
          const brief = scheduleBrief(schedule, swd, dt);

          return (
            <Button
              variant="plain-text"
              size="small"
              onClick={showSchedulePopup(id)}
            >
              <Ellipsis className={cn({ empty: !brief })}>
                {brief || ". . ."}
              </Ellipsis>
              {schedule?.notes && <Info className="infoIcon iconS" />}
            </Button>
          );
        },
      },
      {
        name: "notes",
        header: glb("notes"),
        className: "buttonCell",
        getValue: ({ id, meta: { notes: [lastNote] = [] } }: Student) => (
          <Button
            variant="plain-text"
            size="small"
            onClick={showNotesPopup(id)}
            dir="auto"
          >
            <Ellipsis className={cn({ empty: !lastNote })}>
              {lastNote?.body || ". . ."}
            </Ellipsis>
          </Button>
        ),
      },
      {
        name: "dateCreated",
        header: glb("dateCreated"),
        getValue: ({ meta: { dateCreated } }: Student) =>
          historyRep(dateCreated),
        fit: true,
      },
    ],
    []
  );

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const handleSelect = (id: string) =>
    setSelected((state) => new Set(state.add(id)));
  const handleDeselect = (id: string) =>
    setSelected((state) => {
      state.delete(id);
      return new Set(state);
    });

  const [loadStudents, isLoading] = useLoading((stopLoading) => {
    fetchStudents({
      options: { onFulfilled: stopLoading, onRejected: stopLoading },
    });
  });

  useEffect(() => {
    if (process.env.REACT_APP_ENV === "production") loadStudents();
  }, []);

  return (
    <div className="StudentList">
      {selected.size > 0 && (
        <div className="selectionCounter">
          {stu("counter", { count: selected.size })}
        </div>
      )}
      <Table
        {...{ fields, selected }}
        data={students}
        toggleSelect={(checked, id) =>
          checked ? handleSelect(id) : handleDeselect(id)
        }
        toggleSelectAll={(checked) =>
          setSelected(
            checked ? new Set(students.map(({ id }) => id)) : new Set()
          )
        }
        extraProps={(data: Student) => ({ gender: data.gender })}
        footer={
          <Button
            className="loadMore"
            variant="gray-text"
            onClick={loadStudents}
            isLoading={isLoading}
          >
            {glb("loadMore")}
          </Button>
        }
      />
    </div>
  );
};

export default StudentList;
